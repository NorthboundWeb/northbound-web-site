'use client'

import { useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'

/**
 * The six working demos on /projects.
 *
 * Every business in here is invented, and the page says so. Nothing is saved
 * or sent: these show what a feature feels like, not a real client's data.
 *
 * Anything that reads the clock renders a neutral placeholder on the server
 * and the real thing after hydration, so the server HTML and the first client
 * render always agree.
 *
 * Markup and class names follow the Projects board; the styles live with the
 * page in src/app/projects/page.tsx.
 */

// ── Shared bits ────────────────────────────────────────────────────────────

/** The current time in 30-second steps. Null on the server and while hydrating. */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000)
  return () => window.clearInterval(id)
}
const clientNow = () => Math.floor(Date.now() / 30_000) * 30_000
const serverNow = () => null
function useNow() {
  return useSyncExternalStore(subscribe, clientNow, serverNow)
}

function Pill({
  on,
  onClick,
  children,
}: {
  on: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button className={on ? 'pill on' : 'pill'} type="button" aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  )
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** Kestrel's hours by Date#getDay(): 0 is Sunday. null means closed. */
const KESTREL_HOURS: ([number, number] | null)[] = [null, null, [9, 18], [9, 18], [9, 20], [9, 18], [8, 16]]

// ── 1 · Online booking ─────────────────────────────────────────────────────

const SERVICES = [
  { id: 'cut', label: 'Cut', price: 18, mins: 30 },
  { id: 'fade', label: 'Skin fade', price: 22, mins: 45 },
  { id: 'beard', label: 'Beard trim', price: 12, mins: 20 },
]
const STAFF = ['Anyone', 'Jo', 'Ravi', 'Mia']

/** A small deterministic hash, so the same day always shows the same gaps. */
function hash(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

/** The next six days Kestrel is open, starting today if there is time left. */
function openDays(now: number) {
  const days: Date[] = []
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  for (let i = 0; days.length < 6 && i < 21; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    const hours = KESTREL_HOURS[day.getDay()]
    if (!hours) continue
    if (i === 0 && new Date(now).getHours() >= hours[1] - 1) continue
    days.push(day)
  }
  return days
}

function slotsFor(day: Date, staff: string, now: number) {
  const hours = KESTREL_HOURS[day.getDay()]
  if (!hours) return []
  const today = new Date(now)
  const isToday = today.toDateString() === day.toDateString()
  const nowMins = today.getHours() * 60 + today.getMinutes()
  const who = staff === 'Anyone' ? STAFF.slice(1) : [staff]
  const out: { label: string; taken: boolean }[] = []
  for (let m = hours[0] * 60; m <= hours[1] * 60 - 60; m += 30) {
    const label = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
    const free = who.some((w) => hash(day.toDateString() + w + label) > 0.45)
    out.push({ label, taken: !free || (isToday && m <= nowMins + 30) })
  }
  return out
}

export function BookingDemo() {
  const now = useNow()
  const [svcId, setSvcId] = useState('fade')
  const [staff, setStaff] = useState('Anyone')
  const [dayIdx, setDayIdx] = useState(0)
  const [time, setTime] = useState('')
  const [done, setDone] = useState(false)

  if (now === null) {
    return <p className="noslots">Checking today’s availability…</p>
  }

  const days = openDays(now)
  const idx = Math.min(dayIdx, days.length - 1)
  const day = days[idx]
  const svc = SERVICES.find((s) => s.id === svcId) ?? SERVICES[0]
  const slots = slotsFor(day, staff, now)
  const chosen = slots.some((s) => s.label === time && !s.taken) ? time : ''
  const dayText = `${DAY_NAMES[day.getDay()].slice(0, 3)} ${day.getDate()} ${MONTHS[day.getMonth()]}`
  const anyFree = slots.some((s) => !s.taken)
  const booked = done && chosen !== ''
  const svcText = `${svc.label} · ${svc.mins} min`
  const staffText = staff === 'Anyone' ? 'first free barber' : staff
  const whenText = chosen ? `${dayText}, ${chosen}` : `${dayText}, pick a time`

  return (
    <div className="bk">
      <div className="bk-steps">
        <div>
          <span className="lbl">Service</span>
          <div className="seg" role="group" aria-label="Service">
            {SERVICES.map((s) => (
              <Pill
                key={s.id}
                on={svcId === s.id}
                onClick={() => {
                  setSvcId(s.id)
                  setDone(false)
                }}
              >
                {s.label}
              </Pill>
            ))}
          </div>
        </div>
        <div>
          <span className="lbl">With</span>
          <div className="seg" role="group" aria-label="Barber">
            {STAFF.map((name) => (
              <Pill
                key={name}
                on={staff === name}
                onClick={() => {
                  setStaff(name)
                  setTime('')
                  setDone(false)
                }}
              >
                {name}
              </Pill>
            ))}
          </div>
        </div>
        <div>
          <span className="lbl">Day</span>
          <div className="days" role="group" aria-label="Day">
            {days.map((d, i) => (
              <button
                key={d.toDateString()}
                className={i === idx ? 'day on' : 'day'}
                type="button"
                aria-pressed={i === idx}
                aria-label={`${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`}
                onClick={() => {
                  setDayIdx(i)
                  setTime('')
                  setDone(false)
                }}
              >
                <span className="dw">
                  {i === 0 && d.toDateString() === new Date(now).toDateString()
                    ? 'Today'
                    : DAY_NAMES[d.getDay()].slice(0, 3)}
                </span>
                <span className="dn">{d.getDate()}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="lbl">Time</span>
          {anyFree ? (
            <div className="slots" role="group" aria-label="Time">
              {slots.map((s) => (
                <button
                  key={s.label}
                  className={chosen === s.label ? 'slot on' : 'slot'}
                  type="button"
                  disabled={s.taken}
                  aria-pressed={chosen === s.label}
                  aria-label={`${s.label}${s.taken ? ', taken' : ''}`}
                  onClick={() => setTime(s.label)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="noslots">Fully booked that day. Try another day or barber.</p>
          )}
        </div>
      </div>

      <div className="ticket" aria-live="polite">
        {booked ? (
          <div className="booked">
            <span className="tickmark" aria-hidden>
              ✓
            </span>
            <h3>You’re booked in</h3>
            <p>
              <strong>{svcText}</strong> with {staffText}, {whenText}.
            </p>
            <p>
              On a real site you’d get a confirmation email now. On Ultimate, a reminder the day
              before too.
            </p>
            <button
              className="linkbtn"
              type="button"
              onClick={() => {
                setTime('')
                setDone(false)
              }}
            >
              Book another
            </button>
          </div>
        ) : (
          <>
            <div className="shop">
              <span className="mark">K</span>Kestrel Barbers
            </div>
            <dl>
              <div>
                <dt>Service</dt>
                <dd>{svcText}</dd>
              </div>
              <div>
                <dt>With</dt>
                <dd>{staffText}</dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>{whenText}</dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>£{svc.price}, pay in the shop</dd>
              </div>
            </dl>
            <button className="gobtn" type="button" disabled={!chosen} onClick={() => chosen && setDone(true)}>
              {chosen ? `Book ${chosen}` : 'Pick a time'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── 2 · The redesign ───────────────────────────────────────────────────────

export function RedesignDemo() {
  const [pos, setPos] = useState(50)
  const [grab, setGrab] = useState(false)
  const valueText = pos < 35 ? 'Mostly the new site' : pos > 65 ? 'Mostly the 2009 site' : 'Half and half'

  return (
    <div className={grab ? 'ba grab' : 'ba'} style={{ '--cut': `${pos}%` } as CSSProperties}>
      <div className="ba-old" aria-hidden>
        <p className="o-title">~*~ Welcome to The Harbour Café ~*~</p>
        <div className="o-marq">
          <span className="o-marq-in">
            !!! NEW !!! Now serving JACKET POTATOES !!! Best viewed in Internet Explorer 6 !!!
          </span>
        </div>
        <div className="o-links">
          <a>Home</a>|<a>Menu</a>|<a>Guestbook</a>|<a>Links</a>|<a>Contact Us</a>
        </div>
        <div className="o-box">
          Click <a style={{ color: '#0000EE' }}>HERE</a> to see our menu (PDF, 4.2MB). Opening times
          may vary. Please ring before visiting.
        </div>
        <br />
        <span className="o-count">Visitors: 004817</span>
      </div>
      <div className="ba-new" aria-hidden>
        <div className="n-nav">
          <span className="n-logo">The Harbour</span>
          <span>Menu · Visit · Book</span>
        </div>
        <div className="n-copy">
          <p className="n-h">Breakfast by the water.</p>
          <p className="n-p">Fresh bakes from 7am, proper coffee, and a table that looks at the boats.</p>
          <div className="n-cta">
            <span className="n-btn">See the menu</span>
            <span className="n-btn ghost">Book a table</span>
          </div>
        </div>
        <div className="n-art">
          <span className="n-steam" />
          <span className="n-steam s2" />
          <span className="n-steam s3" />
          <span className="n-cup" />
        </div>
      </div>
      <span className="ba-lab l">2009</span>
      <span className="ba-lab r">Northbound</span>
      <input
        className="ba-range"
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        onPointerDown={() => setGrab(true)}
        onPointerUp={() => setGrab(false)}
        onPointerCancel={() => setGrab(false)}
        aria-label="Drag to compare the old and new website"
        aria-valuetext={valueText}
      />
      <span className="ba-line" />
      <span className="ba-knob" aria-hidden>
        ⇆
      </span>
    </div>
  )
}

// ── 3 · Instant quotes ─────────────────────────────────────────────────────

const HOMES = [
  { id: 'flat', label: 'Flat', base: 8 },
  { id: 'terrace', label: 'Terrace', base: 14 },
  { id: 'semi', label: 'Semi', base: 18 },
  { id: 'detached', label: 'Detached', base: 26 },
]
const FREQS = [
  { id: 'four', label: 'Every 4 weeks', mult: 1, per: 'per clean, every 4 weeks' },
  { id: 'eight', label: 'Every 8 weeks', mult: 1.25, per: 'per clean, every 8 weeks' },
  { id: 'once', label: 'Just once', mult: 1.8, per: 'one-off clean' },
]
const EXTRAS = [
  { id: 'cons', label: 'Conservatory', add: 10 },
  { id: 'frames', label: 'Frames & sills', add: 6 },
  { id: 'gutters', label: 'Gutter clear', add: 35 },
]
const QUOTE_MAX = Math.round(26 * 1.8 + 10 + 6 + 35)

export function QuoteDemo() {
  const [home, setHome] = useState('semi')
  const [freq, setFreq] = useState('four')
  const [extras, setExtras] = useState<Record<string, boolean>>({})

  const h = HOMES.find((x) => x.id === home) ?? HOMES[0]
  const f = FREQS.find((x) => x.id === freq) ?? FREQS[0]
  let price = h.base * f.mult
  for (const x of EXTRAS) if (extras[x.id]) price += x.add
  price = Math.round(price)

  return (
    <>
      <div>
        <span className="lbl">Property</span>
        <div className="seg" role="group" aria-label="Property">
          {HOMES.map((o) => (
            <Pill key={o.id} on={home === o.id} onClick={() => setHome(o.id)}>
              {o.label}
            </Pill>
          ))}
        </div>
      </div>
      <div>
        <span className="lbl">How often</span>
        <div className="seg" role="group" aria-label="How often">
          {FREQS.map((o) => (
            <Pill key={o.id} on={freq === o.id} onClick={() => setFreq(o.id)}>
              {o.label}
            </Pill>
          ))}
        </div>
      </div>
      <div>
        <span className="lbl">Extras</span>
        <div className="ticks" role="group" aria-label="Extras">
          {EXTRAS.map((o) => (
            <Pill
              key={o.id}
              on={Boolean(extras[o.id])}
              onClick={() => setExtras((cur) => ({ ...cur, [o.id]: !cur[o.id] }))}
            >
              {extras[o.id] ? '✓ ' : '+ '}
              {o.label}
            </Pill>
          ))}
        </div>
      </div>
      <div className="qt-out" aria-live="polite">
        <div className="qt-price">
          £{price}
          <span className="per">{f.per}</span>
        </div>
        <div className="qt-meter" aria-hidden>
          <div
            className="qt-fill"
            style={{ '--w': `${Math.max(6, Math.round((price / QUOTE_MAX) * 100))}%` } as CSSProperties}
          />
        </div>
      </div>
    </>
  )
}

// ── 4 · Menus and price lists ──────────────────────────────────────────────

const MENU = [
  { name: 'Full Harbour breakfast', price: 11.5, tags: [] as string[] },
  { name: 'Veggie breakfast', price: 10.5, tags: ['V'] },
  { name: 'Smashed avocado on sourdough', price: 8.5, tags: ['V', 'VG'] },
  { name: 'Smoked salmon & scrambled eggs', price: 9.75, tags: ['GF'] },
  { name: 'Overnight oats, berries', price: 6, tags: ['V', 'VG', 'GF'] },
  { name: 'Crab sandwich', price: 10, tags: [] },
  { name: 'Lemon drizzle (slice)', price: 3.5, tags: ['V'] },
]
const MENU_FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'V', label: 'Vegetarian' },
  { id: 'VG', label: 'Vegan' },
  { id: 'GF', label: 'Gluten-free' },
]
const TAG_NAMES: Record<string, string> = { V: 'VEGETARIAN', VG: 'VEGAN', GF: 'GLUTEN-FREE' }

export function MenuDemo() {
  const [filter, setFilter] = useState('all')
  const matches = (tags: string[]) => filter === 'all' || tags.includes(filter)
  const shown = MENU.filter((m) => matches(m.tags)).length
  const filterLabel = MENU_FILTERS.find((x) => x.id === filter)?.label.toLowerCase() ?? ''

  return (
    <>
      <div className="seg" role="group" aria-label="Filter the menu">
        {MENU_FILTERS.map((o) => (
          <Pill key={o.id} on={filter === o.id} onClick={() => setFilter(o.id)}>
            {o.label}
          </Pill>
        ))}
      </div>
      <ul className="menu">
        {MENU.map((m) => {
          const match = matches(m.tags)
          return (
            <li key={m.name} className={match ? 'mi' : 'mi dim'} aria-hidden={!match}>
              <span className="mi-name">{m.name}</span>
              <span className="mi-price">£{m.price.toFixed(2)}</span>
              <span className="mi-tags">
                {m.tags.map((t) => (
                  <span key={t} className="dt">
                    {TAG_NAMES[t]}
                  </span>
                ))}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="count" aria-live="polite">
        {filter === 'all' ? `${shown} dishes` : `${shown} of ${MENU.length} dishes are ${filterLabel}`}
      </p>
    </>
  )
}

// ── 5 · Live opening hours ─────────────────────────────────────────────────

function fmt(h: number) {
  const ap = h >= 12 ? 'pm' : 'am'
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${hh}${ap}`
}

export function HoursDemo() {
  const now = useNow()

  let big = 'Checking the clock…'
  let sub = 'Kestrel Barbers'
  let lamp = ''
  let dow = -1
  if (now !== null) {
    const d = new Date(now)
    dow = d.getDay()
    const mins = d.getHours() * 60 + d.getMinutes()
    const today = KESTREL_HOURS[dow]
    if (today && mins >= today[0] * 60 && mins < today[1] * 60) {
      const left = today[1] * 60 - mins
      big = 'Open now'
      sub = left <= 60 ? `Closing soon, at ${fmt(today[1])} (${left} min left)` : `Until ${fmt(today[1])} today`
      lamp = 'open'
    } else {
      if (today && mins < today[0] * 60) {
        sub = `Opens at ${fmt(today[0])} today`
      } else {
        let i = 0
        let next = dow
        do {
          i++
          next = (dow + i) % 7
        } while (!KESTREL_HOURS[next] && i < 7)
        const nh = KESTREL_HOURS[next]
        sub = nh ? `Opens ${i === 1 ? 'tomorrow' : DAY_NAMES[next]} at ${fmt(nh[0])}` : ''
      }
      big = 'Closed right now'
      lamp = 'shut'
    }
  }

  return (
    <>
      <div className="hrs-status" aria-live="polite">
        <span className={lamp ? `lamp ${lamp}` : 'lamp'} aria-hidden />
        <div>
          <div className="hrs-big">{big}</div>
          <div className="hrs-sub">{sub}</div>
        </div>
      </div>
      <ul className="hrs">
        {[1, 2, 3, 4, 5, 6, 0].map((d) => {
          const h = KESTREL_HOURS[d]
          return (
            <li key={d} className={d === dow ? 'today' : undefined}>
              <span>
                {DAY_NAMES[d]}
                {d === dow ? ' (today)' : ''}
              </span>
              <span className={h ? undefined : 'closed'}>{h ? `${fmt(h[0])} – ${fmt(h[1])}` : 'Closed'}</span>
            </li>
          )
        })}
      </ul>
    </>
  )
}

// ── 6 · Your colours ───────────────────────────────────────────────────────

const PALETTES = [
  { id: 'harbour', label: 'Harbour', name: 'The Harbour', headline: 'Breakfast by the water.', bg: '#F6F1E7', ink: '#0F2A3D', brand: '#0F2A3D', on: '#F6F1E7', accent: '#F08A5D', onaccent: '#0F2A3D' },
  { id: 'forest', label: 'Forest', name: 'Oakfield Gardens', headline: 'Gardens that look after themselves.', bg: '#F1F4EC', ink: '#1E3A2B', brand: '#2F5D3F', on: '#F1F4EC', accent: '#D9B44A', onaccent: '#1E3A2B' },
  { id: 'plum', label: 'Plum', name: 'Velvet Nails', headline: 'Nails done properly.', bg: '#FBF5F7', ink: '#3A1530', brand: '#5B1F4B', on: '#FBF5F7', accent: '#E7A9C4', onaccent: '#3A1530' },
  { id: 'mono', label: 'Mono', name: 'Hart & Co. Joinery', headline: 'Made to measure. Built to last.', bg: '#111111', ink: '#F2F2F2', brand: '#000000', on: '#FFFFFF', accent: '#FFFFFF', onaccent: '#111111' },
]

export function ColoursDemo() {
  const [id, setId] = useState('harbour')
  const p = PALETTES.find((x) => x.id === id) ?? PALETTES[0]

  return (
    <>
      <div className="th-sw" role="group" aria-label="Palette">
        {PALETTES.map((o) => (
          <button
            key={o.id}
            className={id === o.id ? 'sw on' : 'sw'}
            type="button"
            aria-pressed={id === o.id}
            onClick={() => setId(o.id)}
          >
            <span className="dots" aria-hidden>
              <span className="dot" style={{ background: o.brand }} />
              <span className="dot" style={{ background: o.accent }} />
            </span>
            {o.label}
          </button>
        ))}
      </div>
      <div
        className="th-prev"
        aria-hidden
        style={
          {
            '--bg': p.bg,
            '--ink': p.ink,
            '--brand': p.brand,
            '--on': p.on,
            '--accent': p.accent,
            '--onaccent': p.onaccent,
          } as CSSProperties
        }
      >
        <div className="tp-bar">
          <span className="tp-logo">{p.name}</span>
          <span className="tp-links">
            <span>Services</span>
            <span>About</span>
            <span>Contact</span>
          </span>
        </div>
        <div className="tp-body">
          <p className="tp-h">{p.headline}</p>
          <p className="tp-p">Same layout, different business. Every colour follows the brand.</p>
          <span className="tp-btn">Get in touch</span>
          <div className="tp-cards">
            <span className="tp-card" />
            <span className="tp-card" />
            <span className="tp-card" />
          </div>
        </div>
      </div>
    </>
  )
}
