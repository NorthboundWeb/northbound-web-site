'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ADVANCED_MANAGEMENT_PRICE, buildPackages } from '@/lib/services'
import { currency, site } from '@/lib/site'

/**
 * The footnote.
 *
 * A single bar at the end of every page. Scrolling stops at the end of the
 * page; one more deliberate scroll (or a tap on the bar) unfolds the small
 * print. The first scroll at the end only arms it, so the inertia tail of the
 * scroll that got you there never opens it by accident.
 *
 * The links and terms are in the document either way, for search engines and
 * screen readers; folding only changes what is drawn.
 */
export function SiteFooter() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let armed = false
    let armTimer: number | undefined
    let touchY: number | null = null
    const atEnd = () =>
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2
    const arm = (ms: number) => {
      armed = true
      window.clearTimeout(armTimer)
      armTimer = window.setTimeout(() => {
        armed = false
      }, ms)
    }
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) return
      if (!atEnd()) {
        armed = false
        return
      }
      if (!armed) return arm(900)
      armed = false
      setOpen(true)
    }
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null
    }
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return
      const dy = touchY - (e.touches[0]?.clientY ?? touchY)
      if (dy > 28 && atEnd()) {
        touchY = null
        if (!armed) return arm(1200)
        armed = false
        setOpen(true)
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.clearTimeout(armTimer)
    }
  }, [])

  return (
    <footer className={open ? 'foot open' : 'foot'}>
      <div className="foot-wrap">
        <button
          type="button"
          className="foot-bar"
          aria-expanded={open}
          aria-controls="footnote"
          onClick={() => setOpen((v) => !v)}
        >
          <span>{site.name} · Websites for small UK businesses</span>
          <span className="hint">
            {open ? 'Close' : 'Scroll again for the small print'}
            <svg
              className="nudge"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>

        <div className="foot-panel" id="footnote">
          <div className="foot-in">
            <div className="foot-body">
              <nav aria-label="Packages">
                <h2 className="foot-h">Packages</h2>
                <ul>
                  {buildPackages.map((pkg) => (
                    <li key={pkg.slug}>
                      <Link href="/#prices">
                        {pkg.name} — {pkg.variable ? 'from ' : ''}
                        {currency.format(pkg.price)}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/#prices">
                      Management — from {currency.format(ADVANCED_MANAGEMENT_PRICE)}/month
                    </Link>
                  </li>
                </ul>
              </nav>

              <nav aria-label="Pages">
                <h2 className="foot-h">Pages</h2>
                <ul>
                  {site.pages.map((page) => (
                    <li key={page.href}>
                      <Link href={page.href}>{page.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div>
                <h2 className="foot-h">The terms, briefly</h2>
                <p>
                  Half to start, and half once the site is complete and approved,
                  before it goes live. Timelines are estimates, counted from when
                  the deposit and your content arrive. Revision feedback within 10
                  working days keeps the date; silence is never taken as approval.
                  You own the code, domain and content.
                </p>
              </div>

              <div>
                <h2 className="foot-h">Management</h2>
                <p>
                  Optional, rolling, and not a condition of the build. The first
                  month is free and does not turn into a paid plan by itself. Pay
                  annually for twelve months at the price of ten. Safety and
                  security fixes never count against your hours. Cancel before
                  your next billing date to stop renewals.
                </p>
              </div>

              <div className="foot-legal">
                <span>
                  © {new Date().getFullYear()} {site.name} ·{' '}
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                  {site.socials.map((s) => (
                    <span key={s.label}>
                      {' · '}
                      <a href={s.href} rel="me noopener noreferrer" target="_blank">
                        {s.label}
                      </a>
                    </span>
                  ))}
                </span>
                <span>Every business shown on this site is invented for the demonstrations.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{css}</style>
    </footer>
  )
}

const css = `
.foot{position:relative;z-index:10;font-size:14px;color:#9AA1AA}
.foot-wrap{max-width:1320px;margin-inline:auto;padding-inline:40px;box-sizing:border-box}
.foot-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%;padding:18px 0;border:0;border-top:1px solid #2B2F35;background:transparent;color:#D5D9DE;font:600 14px var(--font-sans);cursor:pointer;text-align:left}
.foot-bar:focus-visible{outline:2px solid #FFB21A;outline-offset:4px;border-radius:4px}
.foot-bar .hint{display:inline-flex;align-items:center;gap:8px;color:#9AA1AA;font-weight:500;white-space:nowrap}
.foot-bar .hint svg{width:16px;height:16px;transition:transform 520ms var(--ease-out)}
.foot.open .foot-bar .hint svg{transform:rotate(180deg)}
.foot-bar .hint .nudge{animation:foot-nudge 1.6s ease-in-out infinite}
.foot.open .foot-bar .hint .nudge{animation:none}
@keyframes foot-nudge{0%,100%{translate:0 0}50%{translate:0 4px}}
.foot-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows 620ms var(--ease-out)}
.foot.open .foot-panel{grid-template-rows:1fr}
.foot-in{min-height:0;overflow:hidden}
.foot-body{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:32px 28px;padding:10px 0 40px;opacity:0;transform:translateY(-6px);transition:opacity 260ms ease,transform 420ms var(--ease-out)}
.foot.open .foot-body{opacity:1;transform:none;transition-delay:120ms}
.foot-h{margin:0 0 10px;font-weight:800;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#FFB21A}
.foot ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:7px}
.foot a{color:#D5D9DE;text-decoration:none}
@media (hover:hover){.foot a:hover{color:#FFB21A}}
.foot p{margin:0;line-height:1.5}
.foot-legal{grid-column:1/-1;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 20px;padding-top:18px;border-top:1px solid #2B2F35;font-size:13px}
@media (max-width:900px){.foot-body{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:640px){.foot-wrap{padding-inline:18px}.foot-bar .hint{white-space:normal;text-align:right}}
@media (max-width:560px){.foot-body{grid-template-columns:minmax(0,1fr)}}
@media (prefers-reduced-motion:reduce){.foot-panel{transition:none}.foot-body{transition:opacity 200ms ease;transform:none}.foot-bar .hint .nudge{animation:none}}
`
