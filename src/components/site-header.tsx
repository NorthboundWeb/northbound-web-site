'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { buildPackages } from '@/lib/services'
import { currency, site } from '@/lib/site'

/** "Pro £249 · Ultimate £349 · Custom from £349", from the package data. */
const pricesNote = buildPackages
  .map((p) => `${p.name} ${p.variable ? 'from ' : ''}${currency.format(p.price)}`)
  .join(' · ')

/**
 * The top bar.
 *
 * The Northbound sign is a button that drops a route map: one junction per
 * page. Beside it, the four links the design puts in the bar, and the Start a
 * project button. Under 900px the links fold into the route map.
 *
 * The bar is transparent over the top of the page, hides as soon as you scroll
 * down, and only comes back after a deliberate scroll up (90px of continuous
 * upward travel, or reaching the top), so momentum ticks do not flicker it.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const [renderedPath, setRenderedPath] = useState(pathname)
  const [mapOpen, setMapOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)

  // Close the route map when the route changes. Adjusting state during render
  // is React's recommended alternative to an effect here.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setMapOpen(false)
  }

  useEffect(() => {
    let lastY = window.scrollY
    let upRun = 0
    let hide = false
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      if (dy > 0) {
        upRun = 0
        if (y > 120) hide = true
      } else if (dy < 0) {
        upRun -= dy
        if (upRun >= 90) hide = false
      }
      const top = y < 24
      if (top) hide = false
      setHidden(hide)
      setAtTop(top)
    }
    // No initial call: the defaults describe a page at the top, and a page
    // that loads part-way down (an anchor link) fires a scroll event anyway.
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The route map closes on Escape (returning focus to the sign) and on a
  // press anywhere outside it.
  useEffect(() => {
    if (!mapOpen) return
    const onPress = (event: PointerEvent) => {
      if (mapRef.current && !mapRef.current.contains(event.target as Node)) {
        setMapOpen(false)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMapOpen(false)
        mapRef.current?.querySelector<HTMLButtonElement>('button.tb-brand')?.focus()
      }
    }
    document.addEventListener('pointerdown', onPress)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPress)
      document.removeEventListener('keydown', onKey)
    }
  }, [mapOpen])

  const barClass = [
    'tb',
    hidden && !mapOpen ? 'tb-hide' : '',
    atTop ? 'tb-top' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={barClass}>
      <div className="tb-wrap">
        <div ref={mapRef} className={mapOpen ? 'tb-menu open' : 'tb-menu'}>
          <button
            type="button"
            className="tb-brand"
            aria-expanded={mapOpen}
            aria-controls="routemap"
            onClick={() => setMapOpen((v) => !v)}
          >
            Northbound
            <span className="tb-chev" aria-hidden />
          </button>

          <div
            className="rmap"
            id="routemap"
            role="dialog"
            aria-label="Site route map"
            inert={!mapOpen}
          >
            <div className="rmap-h">
              <span className="rmap-t">Northbound · Route map</span>
              <button
                type="button"
                className="rmap-x"
                aria-label="Close route map"
                onClick={() => setMapOpen(false)}
              >
                ×
              </button>
            </div>
            <ul>
              {site.routeMap.map((stop) => {
                const here = pathname === stop.href
                return (
                  <li key={stop.code}>
                    <Link
                      href={stop.href}
                      className={stop.go ? 'rm rm-go' : 'rm'}
                      aria-current={here ? 'page' : undefined}
                      onClick={() => setMapOpen(false)}
                    >
                      <span className="rm-j">{stop.code}</span>
                      <span className="rm-txt">
                        <span className="rm-name">{stop.label}</span>
                        <span className="rm-sub">{stop.note ?? pricesNote}</span>
                      </span>
                      {here ? (
                        <span className="rm-tag">You are here</span>
                      ) : (
                        <span className="rm-arrow" aria-hidden>
                          →
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <p className="rmap-f">
              Websites for small UK businesses. Fixed prices, and you own what we
              build.
            </p>
          </div>
        </div>

        <nav className="tb-links" aria-label="Main">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="tb-btn">
          Start a project
        </Link>
      </div>

      <style>{css}</style>
    </header>
  )
}

const css = `
/* The design was drawn content-box; Tailwind's preflight is border-box, so the
   few rules with a fixed size and padding say which they mean. */
.tb{position:sticky;top:0;z-index:40;background:rgba(18,20,23,.84);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.06);transition:transform 420ms var(--ease-out),background-color 300ms ease,border-color 300ms ease}
.tb.tb-hide{transform:translateY(-100%)}
.tb.tb-top{background:transparent;border-bottom-color:transparent;-webkit-backdrop-filter:none;backdrop-filter:none}
.tb-wrap{position:relative;display:flex;align-items:center;gap:28px;max-width:1320px;margin-inline:auto;padding:16px 40px;box-sizing:border-box}
.tb-menu{position:relative;flex:none}
.tb-brand{display:inline-flex;align-items:center;gap:10px;padding:8px 16px 6px;background:#1D4F91;border:0;border-radius:8px;box-shadow:inset 0 0 0 3px #1D4F91,inset 0 0 0 5px #FFFFFF;font:800 19px/1.3 var(--font-sans);letter-spacing:.01em;color:#FFFFFF;cursor:pointer;transition:transform 160ms var(--ease-out),filter 150ms ease}
.tb-brand:active{transform:scale(.97)}
@media (hover:hover){.tb-brand:hover{filter:brightness(1.12)}}
.tb-brand:focus-visible{outline:3px solid #FFB21A;outline-offset:3px}
.tb-chev{display:inline-block;width:8px;height:8px;margin-top:-4px;border-right:2.5px solid #FFFFFF;border-bottom:2.5px solid #FFFFFF;transform:rotate(45deg);transition:transform 240ms var(--ease-out)}
.tb-menu.open .tb-chev{transform:translate(0,4px) rotate(-135deg)}
.tb-links{display:flex;gap:6px;margin-left:auto}
.tb-links a{font-weight:600;font-size:15px;text-decoration:none;color:#D5D9DE;padding:10px 12px;border-radius:4px;white-space:nowrap;transition:color 150ms ease,background-color 150ms ease}
.tb-links a[aria-current]{color:#FFB21A}
@media (hover:hover){.tb-links a:hover{color:#FFFFFF;background:#1A1D21}}
.tb-btn{box-sizing:content-box;display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:4px 18px 0;background:transparent;color:#FFFFFF;border:2px solid rgba(255,255,255,.55);border-radius:6px;font-weight:800;font-size:15px;white-space:nowrap;text-decoration:none;transition:border-color 150ms ease,background-color 150ms ease,color 150ms ease,transform 200ms var(--ease-out)}
.tb-btn:active{transform:scale(.97);transition-duration:90ms}
@media (hover:hover){.tb-btn:hover{border-color:#FFB21A;color:#FFB21A;background:rgba(255,178,26,.08)}}
.rmap{position:absolute;top:calc(100% + 18px);left:0;z-index:60;width:380px;max-width:calc(100vw - 32px);box-sizing:border-box;padding:16px 16px 14px;background:#1D4F91;border-radius:12px;box-shadow:inset 0 0 0 3px #1D4F91,inset 0 0 0 6px #FFFFFF,0 24px 60px rgba(0,0,0,.55);color:#FFFFFF;transform-origin:30px -18px;opacity:0;visibility:hidden;transform:translateY(-10px) scale(.96);pointer-events:none;transition:opacity 160ms ease,transform 220ms var(--ease-out),visibility 0s linear 220ms}
.tb-menu.open .rmap{opacity:1;visibility:visible;transform:none;pointer-events:auto;transition:opacity 160ms ease,transform 260ms var(--ease-out),visibility 0s}
.rmap::before,.rmap::after{content:"";position:absolute;top:-18px;width:3px;height:18px;background:repeating-linear-gradient(to bottom,#8A929B 0 4px,#4A5058 4px 6px);border-radius:2px}
.rmap::before{left:34px}.rmap::after{left:94px}
.rmap-h{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 8px 12px;margin-bottom:6px;border-bottom:2px solid rgba(255,255,255,.85)}
.rmap-t{font-weight:800;font-size:13px;letter-spacing:.14em;text-transform:uppercase}
.rmap-x{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;margin:-6px -4px -6px 0;border:0;border-radius:6px;background:transparent;color:#FFFFFF;font:inherit;font-size:22px;line-height:1;cursor:pointer;transition:background-color 150ms ease}
@media (hover:hover){.rmap-x:hover{background:rgba(255,255,255,.14)}}
.rmap ul{list-style:none;margin:0;padding:0}
.rmap li + li{border-top:1px solid rgba(255,255,255,.18)}
.rmap a.rm{display:grid;grid-template-columns:52px minmax(0,1fr) auto;align-items:center;gap:14px;padding:11px 8px;border-radius:6px;color:#FFFFFF;text-decoration:none;transition:background-color 150ms ease}
@media (hover:hover){.rmap a.rm:hover{background:rgba(255,255,255,.1);color:#FFFFFF}}
.rmap a.rm:focus-visible{outline:3px solid #FFB21A;outline-offset:-3px}
.rm-j{box-sizing:content-box;display:inline-flex;align-items:center;justify-content:center;height:30px;border-radius:4px;background:#121417;color:#FFFFFF;box-shadow:inset 0 0 0 2px #FFFFFF;font-weight:800;font-size:14px;padding-top:2px}
.rm-txt{display:flex;flex-direction:column;min-width:0}
.rm-name{font-weight:800;font-size:18px;line-height:1.2}
.rm-sub{font-weight:600;font-size:13px;line-height:1.35;color:#DCE6F3}
.rm-tag{font-weight:800;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#FFB21A;white-space:nowrap}
.rm-arrow{font-weight:800;font-size:20px;line-height:1}
.rmap a.rm.rm-go .rm-j{background:#FFB21A;color:#121417;box-shadow:none}
.rmap a.rm[aria-current] .rm-j{background:#FFFFFF;color:#1D4F91}
.rmap-f{margin:10px 8px 2px;font-size:12.5px;font-weight:600;line-height:1.45;color:#DCE6F3}
@media (max-width:900px){.tb-links{display:none}.tb-btn{margin-left:auto}}
@media (max-width:640px){
  .tb-wrap{padding-inline:18px}
  .tb-btn{min-height:44px;padding:4px 14px 0;font-size:14px}
  .rmap{position:fixed;top:72px;left:16px;right:16px;width:auto;max-width:none}
  .rmap::before,.rmap::after{display:none}
}
@media (prefers-reduced-motion:reduce){.rmap,.tb-menu.open .rmap{transform:none;transition:opacity 120ms ease,visibility 0s}.tb-chev{transition:none}}
`
