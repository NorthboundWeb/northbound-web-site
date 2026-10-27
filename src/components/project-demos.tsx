'use client'

import { useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/components/ui'

/**
 * The six working demos on /projects.
 *
 * Every business in here is invented, and the page says so. Nothing is saved
 * or sent: these show what a feature feels like, not a real client's data.
 *
 * Anything that reads the clock renders a neutral placeholder on the server
 * and the real thing after hydration, so the server HTML and the first client
 * render always agree.
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
  disabled,
  label,
  className,
}: {
  on: boolean
  onClick: () => void
  children: ReactNode
  disabled?: boolean
  label?: string
  className?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'press min-h-11 border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed',
        on
          ? 'border-accent bg-accent-wash text-ink'
          : 'border-line-strong text-ink hover:border-accent disabled:border-line disabled:text-ink-faint disabled:line-through',
        className
      )}
    >
      {children}
    </button>
  )
}

function Lbl({ children }: { children: ReactNode }) {
  return <span className="label mb-2.5 block text-ink-faint">{children}</span>
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ── 1 · Online booking ─────────────────────────────────────────────────────

const SERVICES = [
  { id: 'cut', label: 'Cut', price: 18, mins: 30 },
  { id: 'fade', label: 'Skin fade', price: 22, mins: 45 },
  { id: 'beard', label: 'Beard trim', price: 12, mins: 20 },
]
const STAFF = ['Anyone', 'Jo', 'Ravi', 'Mia']
/** Kestrel's hours by Date#getDay(): 0 is Sunday. null means closed. */
const KESTREL_HOURS: ([number, number] | null)[] = [
  null,
  null,
  [9, 18],
  [9, 18],
  [9, 20],
  [9, 18],
  [8, 16],
]

/** A small deterministic hash, so the same day always shows the same gaps. */
function hash(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

function openDays(now: number) {
  const days: Date[] = []
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  for (let i = 0; days.length < 6 && i < 21; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    const hours = KESTREL_HOURS[day.getDay()]
    if (!hours) continue
    // Today only counts if there is still time left to book.
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
    return <p className="text-sm text-ink-muted">Checking today’s availability…</p>
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

  const change = (patch: () => void) => {
    patch()
    setDone(false)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6">
        <div>
          <Lbl>Service</Lbl>
          <div role="group" aria-label="Service" className="flex flex-wrap gap-2.5">
            {SERVICES.map((s) => (
              <Pill key={s.id} on={svcId === s.id} onClick={() => change(() => setSvcId(s.id))}>
                {s.label}
              </Pill>
            ))}
          </div>
        </div>
        <div>
          <Lbl>With</Lbl>
          <div role="group" aria-label="Barber" className="flex flex-wrap gap-2.5">
            {STAFF.map((name) => (
              <Pill
                key={name}
                on={staff === name}
                onClick={() =>
                  change(() => {
                    setStaff(name)
                    setTime('')
                  })
                }
              >
                {name}
              </Pill>
            ))}
          </div>
        </div>
        <div>
          <Lbl>Day</Lbl>
          <div role="group" aria-label="Day" className="flex flex-wrap gap-2.5">
            {days.map((d, i) => (
              <Pill
                key={d.toDateString()}
                on={i === idx}
                label={`${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`}
                onClick={() =>
                  change(() => {
                    setDayIdx(i)
                    setTime('')
                  })
                }
                className="flex min-w-16 flex-col items-center py-2"
              >
                <span className="label">
                  {i === 0 && d.toDateString() === new Date(now).toDateString()
                    ? 'Today'
                    : DAY_NAMES[d.getDay()].slice(0, 3)}
                </span>
                <span className="display text-xl leading-none">{d.getDate()}</span>
              </Pill>
            ))}
          </div>
        </div>
        <div>
          <Lbl>Time</Lbl>
          {anyFree ? (
            <div role="group" aria-label="Time" className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <Pill
                  key={s.label}
                  on={chosen === s.label}
                  disabled={s.taken}
                  label={`${s.label}${s.taken ? ', taken' : ''}`}
                  onClick={() => change(() => setTime(s.label))}
                  className="min-w-[4.5rem] px-3"
                >
                  {s.label}
                </Pill>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">
              Fully booked that day. Try another day or barber.
            </p>
          )}
        </div>
      </div>

      <div aria-live="polite" className="h-fit border border-line-strong bg-paper-raised p-6">
        {booked ? (
          <div>
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center bg-accent text-cream"
            >
              ✓
            </span>
            <h3 className="display mt-4 text-3xl text-ink">You are booked in</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              <strong className="font-medium text-ink">
                {svc.label} · {svc.mins} min
              </strong>{' '}
              with {staff === 'Anyone' ? 'the first free barber' : staff}, {dayText}, {chosen}.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              On a real site you would get a confirmation email now. On Ultimate, a reminder
              too.
            </p>
            <button
              type="button"
              onClick={() => {
                setTime('')
                setDone(false)
              }}
              className="label mt-4 text-accent underline-offset-4 hover:underline"
            >
              Book another
            </button>
          </div>
        ) : (
          <div>
            <p className="flex items-center gap-3 font-medium text-ink">
              <span
                aria-hidden
                className="grid h-7 w-7 place-items-center border border-line-strong text-xs"
              >
                K
              </span>
              Kestrel Barbers
            </p>
            <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
              {[
                ['Service', `${svc.label} · ${svc.mins} min`],
                ['With', staff === 'Anyone' ? 'First free barber' : staff],
                ['When', chosen ? `${dayText}, ${chosen}` : `${dayText}, pick a time`],
                ['Price', `£${svc.price}, pay in the shop`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-ink-faint">{k}</dt>
                  <dd className="text-right text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              disabled={!chosen}
              onClick={() => chosen && setDone(true)}
              className="press mt-5 w-full bg-ink px-6 py-3.5 text-sm font-medium uppercase tracking-[0.12em] text-paper hover:bg-accent hover:text-cream disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink"
            >
              {chosen ? `Book ${chosen}` : 'Pick a time'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 2 · The redesign ───────────────────────────────────────────────────────

export function RedesignDemo() {
  const [pos, setPos] = useState(50)
  const [grab, setGrab] = useState(false)
  const valueText =
    pos < 35 ? 'Mostly the new site' : pos > 65 ? 'Mostly the 2009 site' : 'Half and half'

  return (
    <div
      className={cn(
        'relative h-[24rem] select-none overflow-hidden border border-line-strong sm:h-[27rem]',
        'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent'
      )}
      style={{ '--cut': `${pos}%` } as CSSProperties}
    >
      {/* The new site sits underneath, whole. */}
      <div aria-hidden className="absolute inset-0 flex flex-col bg-[#f6f1e7] text-[#0f2a3d]">
        <div className="flex items-center justify-between px-5 py-4 text-xs sm:px-8">
          <span className="display text-xl">The Harbour</span>
          <span className="tracking-[0.12em]">MENU · VISIT · BOOK</span>
        </div>
        <div className="flex flex-1 items-center gap-8 px-5 sm:px-8">
          <div className="max-w-md">
            <p className="display text-4xl leading-[0.95] sm:text-6xl">Breakfast by the water.</p>
            <p className="mt-4 text-sm leading-relaxed sm:text-base">
              Fresh bakes from 7am, proper coffee, and a table that looks at the boats.
            </p>
            <div className="mt-5 flex gap-3 text-xs font-medium tracking-[0.1em]">
              <span className="bg-[#0f2a3d] px-4 py-2.5 text-[#f6f1e7]">SEE THE MENU</span>
              <span className="border border-[#0f2a3d] px-4 py-2.5">BOOK A TABLE</span>
            </div>
          </div>
          <div className="relative ml-auto hidden h-40 w-40 shrink-0 sm:block">
            <span className="absolute bottom-0 left-4 h-24 w-28 rounded-b-[3rem] bg-[#f08a5d]" />
            <span className="absolute bottom-6 right-2 h-10 w-8 rounded-r-full border-[6px] border-[#f08a5d]" />
          </div>
        </div>
      </div>

      {/* The 2009 site covers the left of it, cut at the handle. */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden bg-[#c0c0c0] p-4 text-black sm:p-6"
        style={{
          clipPath: 'inset(0 calc(100% - var(--cut)) 0 0)',
          fontFamily: '"Times New Roman", Times, serif',
        }}
      >
        <p className="text-center text-xl font-bold text-[#800000] sm:text-3xl">
          ~*~ Welcome to The Harbour Café ~*~
        </p>
        <div className="mt-3 overflow-hidden whitespace-nowrap bg-[#ffff00] py-1 text-sm font-bold text-[#ff0000]">
          <span className="nb-marquee inline-block">
            !!! NEW !!! Now serving JACKET POTATOES !!! Best viewed in Internet Explorer 6 !!!
          </span>
        </div>
        <p className="mt-3 text-center text-sm">
          <u className="text-[#0000ee]">Home</u> | <u className="text-[#0000ee]">Menu</u> |{' '}
          <u className="text-[#0000ee]">Guestbook</u> | <u className="text-[#0000ee]">Links</u> |{' '}
          <u className="text-[#0000ee]">Contact Us</u>
        </p>
        <div className="mt-4 border-2 border-[#808080] bg-white p-3 text-sm">
          Click <u className="text-[#0000ee]">HERE</u> to see our menu (PDF, 4.2MB). Opening times
          may vary. Please ring before visiting.
        </div>
        <p className="mt-4 text-xs">Visitors: 004817</p>
      </div>

      <span className="label absolute left-3 top-3 bg-black px-2 py-1 text-white">2009</span>
      <span className="label absolute right-3 top-3 bg-green px-2 py-1 text-cream">Northbound</span>

      {/* The native range input is the control, so it works from the keyboard
          and with a screen reader; the visible handle just follows it. */}
      <input
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
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-accent"
        style={{ left: 'var(--cut)' }}
      />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-1/2 z-10 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-lg text-cream transition-transform',
          grab && 'scale-110'
        )}
        style={{ left: 'var(--cut)' }}
      >
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
    <div className="space-y-6">
      <div>
        <Lbl>Property</Lbl>
        <div role="group" aria-label="Property" className="flex flex-wrap gap-2.5">
          {HOMES.map((o) => (
            <Pill key={o.id} on={home === o.id} onClick={() => setHome(o.id)}>
              {o.label}
            </Pill>
          ))}
        </div>
      </div>
      <div>
        <Lbl>How often</Lbl>
        <div role="group" aria-label="How often" className="flex flex-wrap gap-2.5">
          {FREQS.map((o) => (
            <Pill key={o.id} on={freq === o.id} onClick={() => setFreq(o.id)}>
              {o.label}
            </Pill>
          ))}
        </div>
      </div>
      <div>
        <Lbl>Extras</Lbl>
        <div role="group" aria-label="Extras" className="flex flex-wrap gap-2.5">
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
      <div aria-live="polite" className="border-t border-line pt-6">
        <p className="display text-6xl text-ink">
          £{price}
          <span className="label ml-3 align-middle text-ink-faint normal-case">{f.per}</span>
        </p>
        <div aria-hidden className="mt-4 h-2 w-full bg-line">
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${Math.max(6, Math.round((price / QUOTE_MAX) * 100))}%` }}
          />
        </div>
      </div>
    </div>
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
const TAG_NAMES: Record<string, string> = { V: 'Vegetarian', VG: 'Vegan', GF: 'Gluten-free' }

export function MenuDemo() {
  const [filter, setFilter] = useState('all')
  const matches = (tags: string[]) => filter === 'all' || tags.includes(filter)
  const shown = MENU.filter((m) => matches(m.tags)).length
  const filterLabel = MENU_FILTERS.find((x) => x.id === filter)?.label.toLowerCase() ?? ''

  return (
    <div>
      <div role="group" aria-label="Filter the menu" className="flex flex-wrap gap-2.5">
        {MENU_FILTERS.map((o) => (
          <Pill key={o.id} on={filter === o.id} onClick={() => setFilter(o.id)}>
            {o.label}
          </Pill>
        ))}
      </div>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {MENU.map((m) => {
          const on = matches(m.tags)
          return (
            <li
              key={m.name}
              aria-hidden={!on}
              className={cn(
                'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5 transition-opacity',
                on ? 'opacity-100' : 'opacity-30'
              )}
            >
              <span className="text-[15px] text-ink">{m.name}</span>
              <span className="font-medium text-ink">£{m.price.toFixed(2)}</span>
              {m.tags.length ? (
                <span className="basis-full">
                  {m.tags.map((t) => (
                    <span key={t} className="label mr-2 text-ink-faint">
                      {TAG_NAMES[t]}
                    </span>
                  ))}
                </span>
              ) : null}
            </li>
          )
        })}
      </ul>
      <p aria-live="polite" className="mt-4 text-sm text-ink-muted">
        {filter === 'all'
          ? `${shown} dishes`
          : `${shown} of ${MENU.length} dishes are ${filterLabel}`}
      </p>
    </div>
  )
}

// ── 5 · Live opening hours ─────────────────────────────────────────────────

function hourText(h: number) {
  const suffix = h >= 12 ? 'pm' : 'am'
  return `${h % 12 === 0 ? 12 : h % 12}${suffix}`
}

export function HoursDemo() {
  const now = useNow()
  if (now === null) {
    return <p className="text-sm text-ink-muted">Reading your clock…</p>
  }

  const date = new Date(now)
  const dow = date.getDay()
  const mins = date.getHours() * 60 + date.getMinutes()
  const today = KESTREL_HOURS[dow]

  let big: string
  let sub: string
  let open = false
  if (today && mins >= today[0] * 60 && mins < today[1] * 60) {
    const left = today[1] * 60 - mins
    big = 'Open now'
    sub =
      left <= 60
        ? `Closing soon, at ${hourText(today[1])} (${left} min left)`
        : `Until ${hourText(today[1])} today`
    open = true
  } else {
    big = 'Closed right now'
    if (today && mins < today[0] * 60) {
      sub = `Opens at ${hourText(today[0])} today`
    } else {
      let i = 0
      let d = dow
      do {
        i++
        d = (dow + i) % 7
      } while (!KESTREL_HOURS[d] && i < 7)
      const next = KESTREL_HOURS[d]
      sub = next
        ? `Opens ${i === 1 ? 'tomorrow' : DAY_NAMES[d]} at ${hourText(next[0])}`
        : 'Closed this week'
    }
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div aria-live="polite" className="flex items-start gap-4">
        <span
          aria-hidden
          className={cn(
            'mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 border-ink',
            open ? 'bg-ink' : 'bg-transparent'
          )}
        />
        <div>
          <p className="display text-4xl text-ink">{big}</p>
          <p className="mt-2 text-sm text-ink-muted">{sub}</p>
        </div>
      </div>
      <ul className="divide-y divide-line border-y border-line text-sm">
        {[1, 2, 3, 4, 5, 6, 0].map((d) => {
          const h = KESTREL_HOURS[d]
          return (
            <li
              key={d}
              className={cn(
                'flex justify-between gap-4 py-2.5',
                d === dow ? 'font-medium text-ink' : 'text-ink-muted'
              )}
            >
              <span>
                {DAY_NAMES[d]}
                {d === dow ? ' (today)' : ''}
              </span>
              <span>{h ? `${hourText(h[0])} – ${hourText(h[1])}` : 'Closed'}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ── 6 · Your colours ───────────────────────────────────────────────────────

const PALETTES = [
  { id: 'harbour', label: 'Harbour', name: 'The Harbour', headline: 'Breakfast by the water.', bg: '#F6F1E7', ink: '#0F2A3D', brand: '#0F2A3D', on: '#F6F1E7', accent: '#F08A5D', onAccent: '#0F2A3D' },
  { id: 'forest', label: 'Forest', name: 'Oakfield Gardens', headline: 'Gardens that look after themselves.', bg: '#F1F4EC', ink: '#1E3A2B', brand: '#2F5D3F', on: '#F1F4EC', accent: '#D9B44A', onAccent: '#1E3A2B' },
  { id: 'plum', label: 'Plum', name: 'Velvet Nails', headline: 'Nails done properly.', bg: '#FBF5F7', ink: '#3A1530', brand: '#5B1F4B', on: '#FBF5F7', accent: '#E7A9C4', onAccent: '#3A1530' },
  { id: 'mono', label: 'Mono', name: 'Hart & Co. Joinery', headline: 'Made to measure. Built to last.', bg: '#111111', ink: '#F2F2F2', brand: '#000000', on: '#FFFFFF', accent: '#FFFFFF', onAccent: '#111111' },
]

export function ColoursDemo() {
  const [id, setId] = useState('harbour')
  const p = PALETTES.find((x) => x.id === id) ?? PALETTES[0]

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Palette" className="flex flex-wrap gap-2.5">
        {PALETTES.map((o) => (
          <Pill key={o.id} on={id === o.id} onClick={() => setId(o.id)} className="flex items-center gap-3">
            <span aria-hidden className="flex">
              <span className="h-4 w-4 border border-line-strong" style={{ background: o.brand }} />
              <span className="-ml-1 h-4 w-4 border border-line-strong" style={{ background: o.accent }} />
            </span>
            {o.label}
          </Pill>
        ))}
      </div>
      <div
        aria-hidden
        className="overflow-hidden border border-line-strong transition-colors duration-300"
        style={{ background: p.bg, color: p.ink }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5 text-sm"
          style={{ background: p.brand, color: p.on }}
        >
          <span className="display text-lg">{p.name}</span>
          <span className="hidden gap-5 text-xs tracking-[0.12em] sm:flex">
            <span>SERVICES</span>
            <span>ABOUT</span>
            <span>CONTACT</span>
          </span>
        </div>
        <div className="px-5 py-8 sm:px-8 sm:py-10">
          <p className="display text-4xl leading-[0.95] sm:text-5xl">{p.headline}</p>
          <p className="mt-3 max-w-md text-sm">
            Same layout, different business. Every colour follows the brand.
          </p>
          <span
            className="mt-5 inline-block px-5 py-3 text-xs font-medium tracking-[0.12em]"
            style={{ background: p.accent, color: p.onAccent }}
          >
            GET IN TOUCH
          </span>
          <div className="mt-7 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-16 border"
                style={{ borderColor: p.ink, background: 'transparent', opacity: 0.35 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
