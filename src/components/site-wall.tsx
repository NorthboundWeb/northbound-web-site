'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { demos } from '@/lib/showcase'
import { DemoSite } from './demo-site'
import { demoComponents } from './demos/registry'
import { THEME_EVENT } from './theme-toggle'

/**
 * The home page's moving background: a tilted wall of the demo websites,
 * three rows drifting in opposite directions. Every few seconds the wall
 * dissolves into a field of dots that traces the same cards (and swells
 * under the mouse), then the sites fade back in.
 *
 * The cards are the real demo pages drawn small, not screenshots. The rows
 * and the dot canvas share one tilted plane and one clock, so the dots line
 * up with the cards they replace.
 *
 * You can swipe, drag or scroll sideways across it; the rows follow your
 * hand and, once you let go, glide back to their normal drift.
 *
 * Purely decorative for assistive tech (the same demos are listed as normal
 * links lower down the page). Stops when off screen or when the tab is
 * hidden; holds still for people who prefer reduced motion.
 */

const PLANE_W = 2000
const PLANE_H = 900
const CARD_W = 400
const CARD_H = 250
const GAP = 28
const PITCH = CARD_W + GAP
const ROW_H = CARD_H + 40
const TOP = (PLANE_H - ROW_H * 3 + 40) / 2
/**
 * Each row owns its own slice of the demos (12 demos, 3 rows: 4 each) and
 * repeats it, so the same site can never appear in two rows at once, and the
 * loop wraps exactly on a repeat, so there is no jump when it restarts.
 */
const PERIOD = Math.max(1, Math.floor(demos.length / 3))
const SPAN = PITCH * PERIOD
const PER_ROW = Math.ceil((PLANE_W + SPAN) / PITCH) + 1
const SPEEDS = [-16, 22, -12] // px per second, per row
/** How far each row follows a finger or trackpad, so the rows keep their depth. */
const GRAB = [1, 1.3, 0.8]
/** After the last touch the wall waits this long, then glides back to its normal drift. */
const RETURN_AFTER = 0.55 // seconds
const RETURN_RATE = 3.2 // higher = quicker glide back
const SCALE = CARD_W / 1280

// Morph timeline, seconds: sites → dots → sites.
const CYCLE = 15
const FADE = 1.1
const DOTS_FROM = 8
const DOTS_TO = 12.5

const SPACING = 11
/** Phones get a coarser, cheaper dot field: about a third of the dots, drawn at 30 fps. */
const SPACING_SMALL = 17

function dotPhase(t: number) {
  const c = t % CYCLE
  if (c < DOTS_FROM - FADE) return 0
  if (c < DOTS_FROM) return (c - (DOTS_FROM - FADE)) / FADE
  if (c < DOTS_TO) return 1
  if (c < DOTS_TO + FADE) return 1 - (c - DOTS_TO) / FADE
  return 0
}

export function SiteWall() {
  const wrap = useRef<HTMLDivElement>(null)
  const rows = useRef<(HTMLDivElement | null)[]>([])
  const cardsLayer = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = wrap.current
    const cv = canvas.current
    if (!el || !cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 760px)').matches || window.matchMedia('(pointer: coarse)').matches
    const spacing = small ? SPACING_SMALL : SPACING
    const dpr = small ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
    cv.width = PLANE_W * dpr
    cv.height = PLANE_H * dpr
    ctx.scale(dpr, dpr)

    let visible = true
    let raf = 0
    let last = performance.now()
    let t = 0
    const pointer = { x: -9999, y: -9999 }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    })
    io.observe(el)

    // Hand movement: u[r] is how far row r has been pushed from its normal place.
    const u = [0, 0, 0]
    const hand = { id: -1, startX: 0, startY: 0, lastX: 0, lastT: 0, vel: 0, active: false, moved: false, lastInput: 0 }
    const planeScale = () => {
      const v = parseFloat(getComputedStyle(el!).getPropertyValue('--wall-scale'))
      return v > 0 ? v : 0.62
    }
    const push = (dxPlane: number) => {
      for (let r = 0; r < 3; r++) u[r] += dxPlane * GRAB[r]
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      hand.id = e.pointerId
      hand.startX = hand.lastX = e.clientX
      hand.startY = e.clientY
      hand.lastT = performance.now()
      hand.vel = 0
      hand.moved = false
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      // Linear map into the plane: ignores the tilt, close enough for a glow.
      pointer.x = ((e.clientX - r.left) / r.width) * PLANE_W
      pointer.y = ((e.clientY - r.top) / r.height) * PLANE_H

      if (e.pointerId !== hand.id) return
      if (!hand.active) {
        const dx = e.clientX - hand.startX
        const dy = e.clientY - hand.startY
        // Sideways intent only; a mostly vertical move is the page scrolling.
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return
        hand.active = true
        hand.moved = true
        hand.lastX = e.clientX
        hand.lastT = performance.now()
        try {
          el.setPointerCapture(e.pointerId)
        } catch {}
        el.classList.add('is-dragging')
      }
      const now = performance.now()
      const step = (e.clientX - hand.lastX) / planeScale()
      const dt = Math.max(0.001, (now - hand.lastT) / 1000)
      hand.vel = hand.vel * 0.6 + (step / dt) * 0.4
      hand.lastX = e.clientX
      hand.lastT = now
      hand.lastInput = now
      push(step)
    }
    const release = (e: PointerEvent) => {
      if (e.pointerId !== hand.id) return
      hand.id = -1
      if (hand.active) {
        hand.active = false
        hand.lastInput = performance.now()
        // A pause before letting go means no fling.
        if (performance.now() - hand.lastT > 90) hand.vel = 0
        hand.vel = Math.max(-2500, Math.min(2500, hand.vel))
        el.classList.remove('is-dragging')
      }
    }
    // A drag must not count as a click on the card underneath.
    const onClickCapture = (e: MouseEvent) => {
      if (hand.moved) {
        e.preventDefault()
        e.stopPropagation()
        hand.moved = false
      }
    }
    // Sideways wheel or two-finger trackpad swipe. Up and down is left to the page.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      push(-e.deltaX / planeScale())
      hand.vel = 0
      hand.lastInput = performance.now()
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', release)
    el.addEventListener('pointercancel', release)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('click', onClickCapture, true)
    el.addEventListener('wheel', onWheel, { passive: false })

    const offsets = [0, 0, 0]
    let dark = document.documentElement.dataset.theme === 'dark'
    const onTheme = () => {
      dark = document.documentElement.dataset.theme === 'dark'
    }
    window.addEventListener(THEME_EVENT, onTheme)

    let cleared = true
    function draw(alpha: number) {
      if (alpha <= 0.01) {
        // Clear once on the way out, not every frame while the sites show.
        if (!cleared) ctx!.clearRect(0, 0, PLANE_W, PLANE_H)
        cleared = true
        return
      }
      cleared = false
      ctx!.clearRect(0, 0, PLANE_W, PLANE_H)
      const buckets: Path2D[] = [new Path2D(), new Path2D(), new Path2D(), new Path2D()]
      for (let y = spacing / 2; y < PLANE_H; y += spacing) {
        const ry = y - TOP
        const r = Math.floor(ry / ROW_H)
        const inRowY = ry - r * ROW_H
        const rowOk = r >= 0 && r < 3 && inRowY >= 0 && inRowY <= CARD_H
        for (let x = spacing / 2; x < PLANE_W; x += spacing) {
          let level = 0 // 0 faint ground, 1 card body, 2 card detail, 3 card edge
          if (rowOk) {
            let lx = (x - offsets[r]) % PITCH
            if (lx < 0) lx += PITCH
            if (lx <= CARD_W) {
              const edge = lx < 8 || lx > CARD_W - 8 || inRowY < 8 || inRowY > CARD_H - 8
              const header = inRowY < 30
              const headline = inRowY > 70 && inRowY < 120 && lx > 24 && lx < CARD_W * 0.6
              const panel = lx > CARD_W * 0.62 && lx < CARD_W - 24 && inRowY > 60 && inRowY < CARD_H - 40
              level = edge ? 3 : header || headline || panel ? 2 : 1
            }
          }
          const dx = x - pointer.x
          const dy = y - pointer.y
          // Only do the square root for dots near the pointer.
          const near = dx > -160 && dx < 160 && dy > -160 && dy < 160 ? Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 160) : 0
          const wave = small ? 1 : 0.85 + 0.15 * Math.sin(x * 0.012 + y * 0.008 + t * 1.6)
          const base = [0.9, 1.5, 2.2, 2.8][level] * (small ? 1.25 : 1)
          const rad = (base + near * 2.6) * wave
          const b = Math.min(3, level + (near > 0.5 ? 1 : 0))
          buckets[b].moveTo(x + rad, y)
          buckets[b].arc(x, y, rad, 0, Math.PI * 2)
        }
      }
      const tones = dark
        ? ['rgba(242,245,250,.14)', 'rgba(242,245,250,.36)', 'rgba(242,245,250,.68)', 'rgba(242,245,250,.95)']
        : ['rgba(12,18,32,.16)', 'rgba(12,18,32,.38)', 'rgba(12,18,32,.7)', 'rgba(12,18,32,.95)']
      ctx!.globalAlpha = alpha
      buckets.forEach((p, i) => {
        ctx!.fillStyle = tones[i]
        ctx!.fill(p)
      })
      ctx!.globalAlpha = 1
    }

    let skip = false
    let cardsHidden = false
    function frame(now: number) {
      if (!visible || document.hidden) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!reduced && !hand.active) t += dt
      const a = reduced ? 0 : dotPhase(t)
      // Phones draw the dots every other frame; the sites themselves stay at full rate.
      const drawNow = !(small && a > 0 && (skip = !skip))
      if (!hand.active) {
        if (Math.abs(hand.vel) > 8) {
          // Carry on a little after a flick, slowing down.
          for (let r = 0; r < 3; r++) u[r] += hand.vel * GRAB[r] * dt
          hand.vel *= Math.exp(-dt * 3.5)
          hand.lastInput = now
        } else {
          hand.vel = 0
          if (now - hand.lastInput > RETURN_AFTER * 1000) {
            for (let r = 0; r < 3; r++) {
              // The loop repeats every SPAN, so take the short way back.
              u[r] -= Math.round(u[r] / SPAN) * SPAN
              u[r] = Math.abs(u[r]) < 0.3 ? 0 : u[r] * Math.exp(-dt * RETURN_RATE)
            }
          }
        }
      }
      for (let r = 0; r < 3; r++) {
        // Wrap within one set of cards so the loop is seamless.
        const o = ((((t * SPEEDS[r] + u[r]) % SPAN) + SPAN) % SPAN) - SPAN
        offsets[r] = o
        const row = rows.current[r]
        // While the dots fully cover the sites, stop moving the hidden DOM.
        if (row && a < 0.999) row.style.transform = `translate3d(${o}px,0,0)`
      }
      if (cardsLayer.current) {
        cardsLayer.current.style.opacity = String(1 - a)
        // Fully hidden layers cost nothing to composite.
        const hide = a >= 0.999
        if (hide !== cardsHidden) {
          cardsHidden = hide
          cardsLayer.current.style.visibility = hide ? 'hidden' : 'visible'
        }
      }
      if (drawNow) draw(a)
      raf = requestAnimationFrame(frame)
    }

    const onVis = () => {
      if (!document.hidden && visible) {
        last = performance.now()
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', release)
      el.removeEventListener('pointercancel', release)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('click', onClickCapture, true)
      el.removeEventListener('wheel', onWheel)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener(THEME_EVENT, onTheme)
    }
  }, [])

  return (
    <div className="wall" ref={wrap} aria-hidden="true">
      <div className="wall-plane" style={{ width: PLANE_W, height: PLANE_H }}>
        <div className="wall-cards" ref={cardsLayer}>
          {[0, 1, 2].map((r) => (
            <div
              key={r}
              className="wall-row"
              ref={(n) => {
                rows.current[r] = n
              }}
              style={{ top: TOP + r * ROW_H, width: PITCH * PER_ROW }}
            >
              {Array.from({ length: PER_ROW }, (_, i) => {
                const d = demos[r * PERIOD + (i % PERIOD)]
                return (
                  <Link
                    key={i}
                    href={`/demos/${d.slug}`}
                    tabIndex={-1}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    className="wall-card"
                    style={{ left: i * PITCH, width: CARD_W, height: CARD_H }}
                  >
                    <div className="wall-shot" style={{ transform: `scale(${SCALE})` }}>
                      {(() => {
                        const Shot = demoComponents[d.slug]?.Shot
                        return Shot ? <Shot /> : <DemoSite d={d} />
                      })()}
                    </div>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
        <canvas ref={canvas} className="wall-dots" style={{ width: PLANE_W, height: PLANE_H }} />
      </div>
    </div>
  )
}
