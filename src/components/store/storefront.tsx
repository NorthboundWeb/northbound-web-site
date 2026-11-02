'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { whatsappHref } from '@/lib/contact'
import { ANNUAL_TERMS, COMPLIMENTARY_MONTH_TERMS, TIMELINE_TERMS, buildPackages, managementPlans } from '@/lib/services'
import { useT } from '../lang-provider'

/**
 * The store itself (only shown once unlocked, see src/lib/store/gate.ts).
 * Nothing is charged here: it lets someone put an order together from the
 * real packages and plans, see what it comes to, and hand it to /start or
 * WhatsApp. Every price comes from src/lib/services.ts.
 *
 * Moving parts: a tilting 3D shelf that leans towards the pointer, cards that
 * flip to show what is included, a live total that counts up, a drag-to-
 * compare panel, and a basket bar that slides in once something is chosen.
 */

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`

/** Adds `.in` to every [data-reveal] element as it scrolls into view. */
function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((i) => i.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
      { threshold: 0.18 },
    )
    items.forEach((i) => io.observe(i))
    return () => io.disconnect()
  }, [root])
}

/** A number that rolls towards its target instead of jumping. */
function useCountUp(target: number, ms = 600) {
  const [shown, setShown] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(target)
      return
    }
    const start = performance.now()
    const a = from.current
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms)
      const e = 1 - Math.pow(1 - p, 3)
      setShown(Math.round(a + (target - a) * e))
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return shown
}

type Build = (typeof buildPackages)[number]['slug'] | null
type Plan = (typeof managementPlans)[number]['slug'] | null

export function Storefront() {
  const t = useT()
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)

  const [build, setBuild] = useState<Build>(null)
  const [plan, setPlan] = useState<Plan>(null)
  const [annual, setAnnual] = useState(false)
  const [first, setFirst] = useState(true)
  const [flipped, setFlipped] = useState<string | null>(null)

  const pkg = buildPackages.find((p) => p.slug === build) ?? null
  const mp = managementPlans.find((p) => p.slug === plan) ?? null

  const buildPrice = pkg?.price ?? 0
  const dueToday = pkg ? (first ? 0 : Math.round(buildPrice / 2)) : 0
  const planMonthly = mp?.price ?? 0
  const planYear = mp ? planMonthly * 10 : 0
  const shownBuild = useCountUp(buildPrice)
  const shownToday = useCountUp(dueToday)
  const shownPlan = useCountUp(annual ? planYear : planMonthly)

  const summary = useMemo(() => {
    const lines: string[] = []
    if (pkg) lines.push(`${pkg.name} build — ${pkg.variable ? 'from ' : ''}${gbp(pkg.price)}`)
    if (mp) lines.push(`${mp.name} — ${annual ? `${gbp(planYear)} a year (12 months for the price of 10)` : `${gbp(mp.price)} a month`}, first month free`)
    lines.push(first ? 'First website with Northbound: built free, nothing up front' : `Not my first website: 50% deposit (${gbp(dueToday)})`)
    return lines
  }, [pkg, mp, annual, first, planYear, dueToday])

  const orderText = `Hi Che, I'd like to order from the store:\n${summary.map((s) => `• ${s}`).join('\n')}`

  // ---- hero shelf tilt ------------------------------------------------------
  const stage = useRef<HTMLDivElement>(null)
  function tilt(e: React.PointerEvent<HTMLDivElement>) {
    const el = stage.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 14).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 18).toFixed(2)}deg`)
    el.style.setProperty('--px', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--py', `${(y * 100).toFixed(1)}%`)
    el.classList.add('live')
  }
  function untilt() {
    const el = stage.current
    if (!el) return
    el.classList.remove('live')
    el.style.removeProperty('--rx')
    el.style.removeProperty('--ry')
  }

  // ---- compare slider -------------------------------------------------------
  const [split, setSplit] = useState(50)
  const pro = buildPackages[0]
  const ult = buildPackages[1]

  const tiles = [
    { k: 'pro', name: 'Pro', price: gbp(249), sub: t('Fixed price') },
    { k: 'ultimate', name: 'Ultimate', price: gbp(349), sub: t('Fixed price') },
    { k: 'custom', name: 'Custom', price: `${t('from')} ${gbp(349)}`, sub: t('Quoted in writing') },
    { k: 'care', name: t('Management'), price: `${t('from')} ${gbp(39)}`, sub: t('a month, optional') },
  ]

  return (
    <div ref={root} className="st">
      {/* ---- hero -------------------------------------------------------- */}
      <section className="st-hero wrap">
        <div className="st-hero-copy" data-reveal>
          <p className="eyebrow">{t('Store')}</p>
          <h1 className="section-h big">
            {t('Pick a build.')}
            <span>{t('See the price before you start.')}</span>
          </h1>
          <p className="section-sub">{t('Put an order together below. Nothing is charged here: your first website is built free, and you only pay if you like it.')}</p>
        </div>
        <div className="st-stage" ref={stage} onPointerMove={tilt} onPointerLeave={untilt} onPointerCancel={untilt} aria-hidden="true">
          <div className="st-shelf">
            {tiles.map((x, i) => (
              <button
                key={x.k}
                type="button"
                className={`st-tile st-tile-${i + 1}`}
                tabIndex={-1}
                onClick={() => {
                  if (x.k === 'care') setPlan((p) => p ?? 'pro-management')
                  else setBuild(x.k as Build)
                  document.getElementById('st-order')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                <span className="st-tile-name">{x.name}</span>
                <span className="st-tile-price">{x.price}</span>
                <span className="st-tile-sub">{x.sub}</span>
                <i className="st-tile-shine" />
              </button>
            ))}
          </div>
          <div className="st-stage-floor" />
        </div>
      </section>

      <div className="st-ticker" aria-hidden="true">
        <div className="st-ticker-track">
          {[0, 1].map((n) => (
            <span key={n}>
              {[
                t('Priced before we start'),
                t('First website built free'),
                t('No deposit on your first site'),
                t('Estimated 72-hour build'),
                t('Management optional, first month free'),
                t('You own the domain and the code'),
              ].map((s) => (
                <em key={s}>{s}</em>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ---- order builder --------------------------------------------- */}
      <section id="st-order" className="band wrap st-order" aria-labelledby="st-order-h">
        <div data-reveal>
          <p className="eyebrow">{t('Build your order')}</p>
          <h2 id="st-order-h" className="section-h">
            {t('1. Choose a build')}
            <span>{t('Tap a card to pick it. Tap “What’s in it” to flip it over.')}</span>
          </h2>
        </div>

        <div className="st-cards" role="radiogroup" aria-label={t('Website build')}>
          {buildPackages.map((p, i) => {
            const on = build === p.slug
            const isFlipped = flipped === p.slug
            return (
              <div key={p.slug} className={`st-card${on ? ' on' : ''}${isFlipped ? ' flip' : ''}`} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="st-card-inner">
                  <div className="st-face st-front">
                    {p.badge && <span className="st-badge">{t(p.badge)}</span>}
                    <h3>{p.name}</h3>
                    <p className="st-price">
                      {p.variable && <small>{t('from')} </small>}
                      {gbp(p.price)}
                    </p>
                    <p className="st-sum">{t(p.summary)}</p>
                    <div className="st-card-actions">
                      <button type="button" role="radio" aria-checked={on} className={`btn${on ? ' dark' : ''}`} onClick={() => setBuild(on ? null : p.slug)}>
                        {on ? t('Chosen') : t('Choose')}
                      </button>
                      <button type="button" className="st-flip" onClick={() => setFlipped(isFlipped ? null : p.slug)} aria-expanded={isFlipped}>
                        {t('What’s in it')} <span aria-hidden="true">↻</span>
                      </button>
                    </div>
                  </div>
                  <div className="st-face st-back" aria-hidden={!isFlipped}>
                    <h3>
                      {p.name} <small>{t('includes')}</small>
                    </h3>
                    <ul>
                      {p.includes.map((x) => (
                        <li key={x}>{t(x)}</li>
                      ))}
                    </ul>
                    <p className="st-small">{t(p.timeline)}.</p>
                    <button type="button" className="st-flip" onClick={() => setFlipped(null)}>
                      {t('Back')} <span aria-hidden="true">↺</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div data-reveal>
          <h2 className="section-h st-h2">
            {t('2. Add management?')}
            <span>{t('Optional. Keeps the site online, secure and current. The first month is free.')}</span>
          </h2>
        </div>
        <div className="st-plans" role="radiogroup" aria-label={t('Management plan')} data-reveal>
          <button type="button" role="radio" aria-checked={plan === null} className="pill" onClick={() => setPlan(null)}>
            {t('No plan')}
          </button>
          {managementPlans.map((m) => (
            <button key={m.slug} type="button" role="radio" aria-checked={plan === m.slug} className="pill" aria-pressed={plan === m.slug} onClick={() => setPlan(m.slug)}>
              {m.name} · {gbp(m.price)}
              {m.slug === 'custom-management' ? '+' : ''}/{t('mo')}
            </button>
          ))}
        </div>
        {mp && (
          <div className="st-plan-detail" data-reveal>
            <ul>
              {mp.includes.map((x) => (
                <li key={x}>{t(x)}</li>
              ))}
              <li>{t(mp.changeTime)}</li>
            </ul>
            <label className="st-switch">
              <input type="checkbox" checked={annual} onChange={(e) => setAnnual(e.target.checked)} />
              <span className="st-switch-track" aria-hidden="true">
                <i />
              </span>
              <span>
                {t('Pay yearly')} · <b>{t('12 months for the price of 10')}</b>
              </span>
            </label>
          </div>
        )}

        <div data-reveal>
          <h2 className="section-h st-h2">
            {t('3. Is this your first website with me?')}
            <span>{t('Your first website is built free. Every later website or system starts with a 50% deposit.')}</span>
          </h2>
        </div>
        <div className="st-plans" data-reveal>
          <button type="button" className="pill" aria-pressed={first} onClick={() => setFirst(true)}>
            {t('Yes, my first')}
          </button>
          <button type="button" className="pill" aria-pressed={!first} onClick={() => setFirst(false)}>
            {t('No, I have had one before')}
          </button>
        </div>

        {/* ---- live total ------------------------------------------------ */}
        <div className="st-total" data-reveal aria-live="polite">
          <div className="st-total-row">
            <span>{t('Build')}</span>
            <b>
              {pkg?.variable && <small>{t('from')} </small>}
              {pkg ? gbp(shownBuild) : '—'}
            </b>
          </div>
          <div className="st-total-row">
            <span>{annual ? t('Management, per year') : t('Management, per month')}</span>
            <b>
              {mp ? gbp(shownPlan) : '—'}
              {mp?.slug === 'custom-management' && '+'}
            </b>
          </div>
          <div className="st-total-row st-total-big">
            <span>{t('Due today')}</span>
            <b>{pkg ? gbp(shownToday) : '—'}</b>
          </div>
          <p className="st-small">
            {pkg
              ? first
                ? t('Nothing up front. If you like the finished site you buy it at the build price; if you do not, you owe nothing and I will not contact you again.')
                : t('The remaining 50% is payable once the site is complete and approved, before it goes live.')
              : t('Choose a build above to see the total.')}
            {mp && ` ${t(COMPLIMENTARY_MONTH_TERMS)}`}
            {mp && annual && ` ${t(ANNUAL_TERMS)}`}
          </p>
          <p className="st-small">{t(TIMELINE_TERMS)}</p>
        </div>
      </section>

      {/* ---- compare ----------------------------------------------------- */}
      <section className="band wrap st-compare" aria-labelledby="st-cmp-h">
        <div data-reveal>
          <p className="eyebrow">{t('Compare')}</p>
          <h2 id="st-cmp-h" className="section-h">
            {t('Pro or Ultimate?')}
            <span>{t('Drag the handle to see both.')}</span>
          </h2>
        </div>
        <div className="st-cmp" data-reveal style={{ ['--split' as string]: `${split}%` }}>
          <div className="st-cmp-pane st-cmp-a">
            <h3>
              {pro.name} <b>{gbp(pro.price)}</b>
            </h3>
            <ul>
              {pro.includes.map((x) => (
                <li key={x}>{t(x)}</li>
              ))}
            </ul>
          </div>
          <div className="st-cmp-pane st-cmp-b">
            <h3>
              {ult.name} <b>{gbp(ult.price)}</b>
            </h3>
            <ul>
              {ult.includes.map((x) => (
                <li key={x}>{t(x)}</li>
              ))}
            </ul>
          </div>
          <div className="st-cmp-handle" aria-hidden="true">
            <i>⇆</i>
          </div>
          <label className="sr" htmlFor="st-split">
            {t('Compare Pro and Ultimate')}
          </label>
          <input id="st-split" className="st-cmp-range" type="range" min={8} max={92} value={split} onChange={(e) => setSplit(Number(e.target.value))} />
        </div>
      </section>

      {/* ---- coming soon ------------------------------------------------- */}
      <section className="band wrap st-soon" aria-labelledby="st-soon-h">
        <div data-reveal>
          <p className="eyebrow">{t('On the shelves soon')}</p>
          <h2 id="st-soon-h" className="section-h">
            {t('More to come.')}
            <span>{t('These are not for sale yet.')}</span>
          </h2>
        </div>
        <div className="st-ghosts">
          {[t('Add-ons'), t('Starter templates'), t('Gift a website')].map((name, i) => (
            <div key={name} className="st-ghost" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="st-ghost-tag">{t('Coming soon')}</span>
              <h3>{name}</h3>
              <div className="st-ghost-lines" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- basket bar -------------------------------------------------- */}
      <div className={`st-basket${pkg || mp ? ' show' : ''}`} aria-hidden={!(pkg || mp)}>
        <div className="st-basket-in wrap">
          <div className="st-basket-sum">
            <b>{[pkg?.name, mp?.name].filter(Boolean).join(' + ') || t('Nothing chosen')}</b>
            <span>
              {pkg ? `${t('Due today')} ${gbp(dueToday)}` : t('Add a build')}
              {mp ? ` · ${annual ? `${gbp(planYear)}/${t('yr')}` : `${gbp(mp.price)}/${t('mo')}`} ${t('after the free month')}` : ''}
            </span>
          </div>
          <div className="st-basket-actions">
            <a className="btn" href={whatsappHref(orderText)} target="_blank" rel="noopener noreferrer">
              {t('Order on WhatsApp')}
            </a>
            <Link className="btn dark" href="/start">
              {t('Start the build')} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
