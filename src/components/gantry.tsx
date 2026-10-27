'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * The hero: a windscreen view of a motorway at night.
 *
 * A gantry hangs over the lane ahead with two blue lane signs (real links) and
 * a variable-message sign between them. The sign is a 5×7 dot-matrix display —
 * every character is thirty-five dots, lit from a bitmap font — cycling short
 * messages until the visitor types their business name, then writing that.
 *
 * The road is drawn on a canvas with a real perspective projection: a pinhole
 * camera 1.25 m above the middle lane of a three-lane UK motorway. Markings are
 * placed in metres and projected, so the perspective holds at any screen size.
 *   x = centre + fx · X / z      y = fy · eyeHeight / z
 * Road studs follow UK practice: red on the hard-shoulder edge, amber by the
 * central reservation, white between lanes.
 *
 * Everything moving here is decorative: the road can be paused, and stops
 * entirely under prefers-reduced-motion.
 */

const COLS = 18

const MESSAGES: [string, string][] = [
  ['SLOW WEBSITE?', 'TAKE THE NEXT EXIT'],
  ['FIXED PRICES', 'FROM £249'],
  ['YOU OWN IT', 'OUTRIGHT'],
  ['SEE THE DIFFERENCE', 'ON DISCOVER'],
  ['MANAGEMENT:', 'FIRST MONTH FREE'],
]

/** 5×7 bitmap font, 35 bits per glyph, rows top to bottom. */
const FONT: Record<string, string> = {
  A: '01110100011000111111100011000110001', B: '11110100011000111110100011000111110',
  C: '01110100011000010000100001000101110', D: '11100100101000110001100011001011100',
  E: '11111100001000011110100001000011111', F: '11111100001000011110100001000010000',
  G: '01110100011000010111100011000101111', H: '10001100011000111111100011000110001',
  I: '01110001000010000100001000010001110', J: '00111000100001000010000101001001100',
  K: '10001100101010011000101001001010001', L: '10000100001000010000100001000011111',
  M: '10001110111010110101100011000110001', N: '10001100011100110101100111000110001',
  O: '01110100011000110001100011000101110', P: '11110100011000111110100001000010000',
  Q: '01110100011000110001101011001001101', R: '11110100011000111110101001001010001',
  S: '01111100001000001110000010000111110', T: '11111001000010000100001000010000100',
  U: '10001100011000110001100011000101110', V: '10001100011000110001100010101000100',
  W: '10001100011000110101101011010101010', X: '10001100010101000100010101000110001',
  Y: '10001100010101000100001000010000100', Z: '11111000010001000100010001000011111',
  '0': '01110100011001110101110011000101110', '1': '00100011000010000100001000010001110',
  '2': '01110100010000100010001000100011111', '3': '11111000100010000010000011000101110',
  '4': '00010001100101010010111110001000010', '5': '11111100001111000001000011000101110',
  '6': '00110010001000011110100011000101110', '7': '11111000010001000100010000100001000',
  '8': '01110100011000101110100011000101110', '9': '01110100011000101111000010001001100',
  '£': '00110010010100011100010000100011111', '-': '00000000000000011111000000000000000',
  '.': '00000000000000000000000000110001100', "'": '01100001000100000000000000000000000',
  '&': '01100100101010001000101011001001101', '!': '00100001000010000100001000000000100',
  '?': '01110100010000100010001000000000100', ',': '00000000000000000000011000010001000',
  '/': '00001000100001000100010000100010000', ':': '00000011000110000000011000110000000',
  '+': '00000001000010011111001000010000000', ' ': '00000000000000000000000000000000000',
}

const glyphCache = new Map<string, boolean[]>()
function glyph(c: string): boolean[] {
  let g = glyphCache.get(c)
  if (!g) {
    g = (FONT[c] ?? FONT[' ']).split('').map((b) => b === '1')
    glyphCache.set(c, g)
  }
  return g
}

function clean(text: string) {
  return text
    .toUpperCase()
    .replace(/[‘’`]/g, "'")
    .split('')
    .map((c) => (FONT[c] ? c : ' '))
    .join('')
}

function centre(text: string) {
  const t = clean(text).trim().slice(0, COLS)
  const pad = Math.floor((COLS - t.length) / 2)
  return (' '.repeat(pad) + t).padEnd(COLS, ' ')
}

/**
 * Roughly one letter slot in six flickers, picked by a fixed hash of its
 * position so the same slots stay faulty, like a real sign's tired LEDs.
 */
function flickerFor(slot: number) {
  const h = (Math.imul(slot + 7, 2246822519) ^ (slot << 13)) >>> 0
  return (h % 1000) / 1000 < 0.17 ? `k${1 + (h % 4)}` : ''
}

type Projection = {
  fx: number
  fy: number
  cx: number
  eye: number
  zNear: number
  Rbar: number
  bTop: number
}

type Posts = { left: number; right: number; cut: number }

function drawRoad(cv: HTMLCanvasElement, travel: number): Projection | null {
  const W = cv.clientWidth
  const H = cv.clientHeight
  if (!W || !H) return null
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const bw = Math.round(W * dpr)
  const bh = Math.round(H * dpr)
  if (cv.width !== bw || cv.height !== bh) {
    cv.width = bw
    cv.height = bh
  }
  const g = cv.getContext('2d')
  if (!g) return null
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, W, H)

  const eye = 1.25
  const lane = 3.65
  const shoulder = 3.3
  const zNear = 2.6
  const zFar = 420
  const fy = (H * zNear) / eye // bottom row = 2.6 m ahead
  const fx = (Math.max(W * 0.3, 140) * zNear) / (lane / 2) // lane lines at ±30% width at the bottom
  const cx = W / 2
  const px = (X: number, z: number) => cx + (fx * X) / z
  const py = (z: number) => (fy * eye) / z
  const quad = (
    x0: number,
    x1: number,
    z0: number,
    z1: number,
    fill: string | CanvasGradient
  ) => {
    g.fillStyle = fill
    g.beginPath()
    g.moveTo(px(x0, z0), py(z0))
    g.lineTo(px(x1, z0), py(z0))
    g.lineTo(px(x1, z1), py(z1))
    g.lineTo(px(x0, z1), py(z1))
    g.closePath()
    g.fill()
  }

  const Lout = -1.5 * lane - shoulder // outer edge of hard shoulder
  const Ledge = -1.5 * lane // hard-shoulder edge line
  const Redge = 1.5 * lane // offside edge line
  const Rbar = Redge + 1.1 // crash barrier
  const bTop = 0.75
  const bBot = 0.45

  // Verges and carriageway
  g.fillStyle = '#0d0f12'
  g.fillRect(0, 0, W, H)
  const surf = g.createLinearGradient(0, 0, 0, H)
  surf.addColorStop(0, '#121417')
  surf.addColorStop(1, '#25282d')
  quad(Lout, Rbar, zNear, zFar, surf)
  quad(Lout, Ledge, zNear, zFar, 'rgba(0,0,0,.18)') // hard shoulder a shade darker

  // Solid edge lines
  quad(Ledge - 0.1, Ledge + 0.1, zNear, zFar, 'rgba(242,242,236,.82)')
  quad(Redge - 0.1, Redge + 0.1, zNear, zFar, 'rgba(242,242,236,.82)')

  // Lane lines: 3 m dashes every 9 m, moving toward the camera
  const cyc = 9
  const dashLen = 3
  const off = travel % cyc
  for (let k = 0; k * cyc - off < zFar; k++) {
    let z0 = k * cyc - off
    const z1 = z0 + dashLen
    if (z1 < zNear) continue
    z0 = Math.max(z0, zNear)
    for (const X of [-0.5 * lane, 0.5 * lane]) {
      quad(X - 0.075, X + 0.075, z0, Math.min(z1, zFar), 'rgba(242,242,236,.78)')
    }
  }

  // Crash barrier on the central reservation
  g.fillStyle = '#3a3f46'
  g.beginPath()
  g.moveTo(px(Rbar, zNear), (fy * (eye - bTop)) / zNear)
  g.lineTo(px(Rbar, zFar), (fy * (eye - bTop)) / zFar)
  g.lineTo(px(Rbar, zFar), (fy * (eye - bBot)) / zFar)
  g.lineTo(px(Rbar, zNear), (fy * (eye - bBot)) / zNear)
  g.closePath()
  g.fill()
  g.strokeStyle = 'rgba(200,205,212,.35)'
  g.lineWidth = 1
  g.beginPath()
  g.moveTo(px(Rbar, zNear), (fy * (eye - bTop)) / zNear)
  g.lineTo(px(Rbar, zFar), (fy * (eye - bTop)) / zFar)
  g.stroke()
  const postOff = travel % 4
  g.fillStyle = '#2a2e34'
  for (let k = 0; k * 4 - postOff < 160; k++) {
    const z = k * 4 - postOff
    if (z < zNear) continue
    const x = px(Rbar, z)
    const w = Math.max(1, (fx * 0.12) / z)
    g.fillRect(x - w / 2, (fy * (eye - bTop)) / z, w, (fy * bTop) / z)
  }

  // Road studs, placed in the gaps between dashes, glowing in the headlights
  const studs = [
    { X: Ledge + 0.25, c: '255,58,46' }, // red: hard-shoulder edge
    { X: -0.5 * lane, c: '255,251,232' }, // white: lane lines
    { X: 0.5 * lane, c: '255,251,232' },
    { X: Redge - 0.25, c: '255,178,26' }, // amber: central reservation
  ]
  for (let k = 0; k * cyc - off < 330; k++) {
    const z = k * cyc - off + dashLen + (cyc - dashLen) / 2
    if (z < zNear + 0.3) continue
    const a = Math.max(0.5, Math.min(1, 1.2 - z / 260))
    const w = Math.max(1.8, Math.min(9, (fx * 0.16) / z))
    const h = Math.max(1.1, w * 0.45)
    const y = py(z)
    for (const s of studs) {
      const x = px(s.X, z)
      g.shadowColor = `rgba(${s.c},${a})`
      g.shadowBlur = w * 2.4
      g.fillStyle = `rgba(${s.c},${a})`
      g.fillRect(x - w / 2, y - h / 2, w, h)
    }
  }
  g.shadowBlur = 0

  // Headlight pool on the tarmac, and haze toward the horizon
  const pool = g.createRadialGradient(cx, H * 1.05, 10, cx, H * 1.05, Math.max(W, H) * 0.75)
  pool.addColorStop(0, 'rgba(255,244,214,.10)')
  pool.addColorStop(1, 'rgba(255,244,214,0)')
  g.fillStyle = pool
  g.fillRect(0, 0, W, H)
  const haze = g.createLinearGradient(0, 0, 0, H * 0.22)
  haze.addColorStop(0, 'rgba(18,20,23,.85)')
  haze.addColorStop(1, 'rgba(18,20,23,0)')
  g.fillStyle = haze
  g.fillRect(0, 0, W, H * 0.22)

  return { fx, fy, cx, eye, zNear, Rbar, bTop }
}

export function Gantry() {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState(0)
  const [paused, setPaused] = useState(false)
  const [posts, setPosts] = useState<Posts>({ left: 520, right: 520, cut: 0 })
  const typed = name.trim().length > 0

  const gantryRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const projRef = useRef<Projection | null>(null)
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  // The sign cycles until someone types, and holds while the road is paused.
  useEffect(() => {
    if (paused || typed) return
    const id = window.setInterval(() => {
      setMsg((m) => (m + 1) % MESSAGES.length)
    }, 3600)
    return () => window.clearInterval(id)
  }, [paused, typed])

  /*
   * Stand the gantry posts on the road: from the beam down to a point a fifth
   * of the way from the horizon to the bonnet. The right post stands on the
   * central reservation, behind the crash barrier, so it stops at the
   * barrier's top edge — measured under both edges of the post, because that
   * edge slopes in perspective, and the post's foot is cut to the slope.
   */
  const fitPosts = useCallback(() => {
    const gan = gantryRef.current
    const cv = canvasRef.current
    if (!gan || !cv) return
    const gr = gan.getBoundingClientRect()
    const r = cv.getBoundingClientRect()
    const ground = Math.max(120, Math.round(r.top + r.height * 0.2 - gr.top))
    let right = ground
    let cut = 0
    const P = projRef.current
    const post = gan.querySelector('.post.r')
    if (P && post) {
      const barrierTopAt = (xCss: number) => {
        const dx = xCss - r.left - P.cx
        if (dx <= 0) return null
        const z = (P.fx * P.Rbar) / dx
        if (z < P.zNear) return null
        return r.top + (P.fy * (P.eye - P.bTop)) / z
      }
      const pr = post.getBoundingClientRect()
      const yL = barrierTopAt(pr.left)
      const yR = barrierTopAt(pr.right)
      if (yL !== null && yR !== null) {
        right = Math.max(60, Math.round(yR - gr.top))
        cut = Math.max(0, Math.round(yR - yL))
      }
    }
    setPosts((p) =>
      p.left === ground && p.right === right && p.cut === cut
        ? p
        : { left: ground, right, cut }
    )
  }, [])

  // The road: one animation loop, 24 m/s (about 54 mph).
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let travel = 0
    let lastT = 0
    let raf = 0
    let fitted = false
    const loop = (t: number) => {
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0
      lastT = t
      if (!pausedRef.current && !reduced) travel += dt * 24
      const proj = drawRoad(cv, travel)
      if (proj) projRef.current = proj
      if (!fitted && proj) {
        fitted = true
        fitPosts()
      }
      raf = window.requestAnimationFrame(loop)
    }
    raf = window.requestAnimationFrame(loop)

    // The gantry arrives with a scale-in animation; measure again once it has
    // settled, or the posts are sized against the shrunken frame.
    const gan = gantryRef.current
    const onArrive = (e: AnimationEvent) => {
      if (e.target === gan) fitPosts()
    }
    gan?.addEventListener('animationend', onArrive)
    const settle = window.setTimeout(fitPosts, 1500)
    window.addEventListener('resize', fitPosts)
    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(settle)
      window.removeEventListener('resize', fitPosts)
      gan?.removeEventListener('animationend', onArrive)
    }
  }, [fitPosts])

  const lines = useMemo(() => {
    const raw: [string, string] = typed
      ? ['NEW WEBSITE FOR', name]
      : MESSAGES[msg % MESSAGES.length]
    return {
      label: raw.join(' '),
      rows: raw.map((text, li) =>
        centre(text)
          .split('')
          .map((c, ci) => ({
            dots: glyph(c),
            k: flickerFor(li * 100 + ci),
            delay: typed ? 0 : li * 160 + ci * 26,
          }))
      ),
    }
  }, [name, msg, typed])

  return (
    <section className="hero" id="top" aria-labelledby="hero-heading">
      <div className="hwrap">
        <div className="gantry" ref={gantryRef}>
          <span aria-hidden className="post l" style={{ height: posts.left }} />
          <span
            aria-hidden
            className="post r"
            style={{
              height: posts.right,
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - ${posts.cut}px))`,
            }}
          />
          <div aria-hidden className="beam" />
          <div className="hang">
            <div className="hung">
              <Link className="lane" href="/discover">
                <span>Discover</span>
                <DownArrow />
              </Link>
            </div>
            <div className="hung">
              <div className="vms" role="img" aria-label={`Sign reads: ${lines.label}`}>
                <div className="vms-in" aria-hidden>
                  {lines.rows.map((row, li) => (
                    <div key={li} className="vline">
                      {row.map((ch, ci) => (
                        <div
                          key={ci}
                          className={ch.k ? `ch ${ch.k}` : 'ch'}
                          style={{ transitionDelay: `${ch.delay}ms` }}
                        >
                          {ch.dots.map((on, di) => (
                            <i key={di} className={on ? 'on' : undefined} />
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hung">
              <a className="lane" href="#prices">
                <span>Prices</span>
                <DownArrow />
              </a>
            </div>
          </div>
        </div>

        <div className="copy">
          <h1 id="hero-heading" className="h1 hrise" style={{ animationDelay: '1050ms' }}>
            Websites that get people to your door.
          </h1>
          <p className="lede hrise" style={{ animationDelay: '1150ms' }}>
            Fast, clear websites for small UK businesses, at fixed prices from
            £249. You own everything we build.
          </p>
          <form
            className="try hrise"
            style={{ animationDelay: '1250ms' }}
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="biz">Put your business in lights</label>
            <input
              id="biz"
              type="text"
              autoComplete="organization"
              maxLength={30}
              placeholder="Your business name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 30))}
            />
            <p className="note">Watch the sign. Nothing you type is saved or sent.</p>
          </form>
        </div>
      </div>

      <div className="scene" aria-hidden>
        <div className="sky" />
        <div className="horizon" />
        <div className="ground">
          <canvas className="roadcv" ref={canvasRef} />
        </div>
        <div className="glass" />
      </div>
      <div className="me" aria-hidden>
        <svg viewBox="0 0 1180 260" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2a2e34" />
              <stop offset=".5" stopColor="#15181c" />
              <stop offset="1" stopColor="#0b0c0e" />
            </linearGradient>
            <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset=".5" stopColor="#fff" stopOpacity=".16" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 260 L0 150 Q120 92 300 78 Q590 50 880 78 Q1060 92 1180 150 L1180 260 Z" fill="url(#bon)" />
          <path d="M60 190 Q590 110 1120 190" stroke="url(#shine)" strokeWidth="14" strokeLinecap="round" />
          <path d="M0 128 Q590 40 1180 128" stroke="#000" strokeOpacity=".6" strokeWidth="18" />
          <rect x="470" y="236" width="240" height="24" rx="4" fill="#0b0c0e" />
          <rect x="520" y="226" width="140" height="10" rx="3" fill="#FFB21A" fillOpacity=".9" />
        </svg>
      </div>
      <button
        className="pause"
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? 'Play the road' : 'Pause the road'}
      </button>

      <style>{css}</style>
    </section>
  )
}

function DownArrow() {
  return (
    <svg viewBox="0 0 40 50" width="30" height="38" aria-hidden>
      <path d="M15 3h10v27h11L20 47 4 30h11z" fill="#FFFFFF" />
    </svg>
  )
}

/*
 * Scoped styles. These are component-specific enough (the dot-matrix grid,
 * the gantry, the windscreen) that a utility class per rule would be noise.
 * They live beside the markup they shape.
 */
const css = `
.hero{--bonnet:clamp(52px,10vh,108px);--road:clamp(200px,40vh,400px);--spring-soft:cubic-bezier(.22,1,.36,1);position:relative;min-height:calc(100svh - 88px);box-sizing:border-box;padding-bottom:calc(var(--bonnet) + 24px);background:#121417;overflow:hidden;color:#FFFFFF}
@supports (transition-timing-function: linear(0, 1)){
  .hero{--spring-soft:linear(0, 0.030 2.5%, 0.106 5%, 0.210 7.5%, 0.325 10%, 0.443 12.5%, 0.556 15%, 0.658 17.5%, 0.748 20%, 0.824 22.5%, 0.886 25%, 0.935 27.5%, 0.972 30%, 0.999 32.5%, 1.018 35%, 1.030 37.5%, 1.036 40%, 1.038 42.5%, 1.038 45%, 1.035 47.5%, 1.031 50%, 1.027 52.5%, 1.022 55%, 1.018 57.5%, 1.014 60%, 1.010 62.5%, 1.007 65%, 1.005 67.5%, 1.003 70%, 1.001 72.5%, 1)}
}
.hwrap{position:relative;z-index:3;width:100%;max-width:1240px;margin-inline:auto;padding-inline:40px;box-sizing:border-box}

.gantry{position:relative;z-index:2;margin-top:12px;animation:g-arrive 1200ms var(--spring-soft) 80ms both;transform-origin:50% 0}
.beam{height:16px;background:repeating-linear-gradient(135deg,#3B4048 0 10px,#30343B 10px 20px);border-radius:2px}
.post{position:absolute;top:0;width:16px;height:520px;background:linear-gradient(90deg,#2E3238,#43484F 45%,#2A2E33);z-index:-1}
.post::after{content:"";position:absolute;left:-7px;right:-7px;bottom:-6px;height:12px;border-radius:2px;background:#4a4f56;box-shadow:0 6px 10px rgba(0,0,0,.6)}
.post.r::after{display:none}
.post.l{left:0}.post.r{right:0}
.hang{display:grid;grid-template-columns:220px minmax(0,1fr) 220px;gap:18px;padding:0 34px;align-items:start;perspective:900px}
.hung{position:relative;padding-top:26px;transform-origin:50% 0;transform-style:preserve-3d;animation:var(--swayK,g-swayA) var(--swayT,5.2s) ease-in-out var(--swayD,0s) infinite}
.hung::before,.hung::after{content:"";position:absolute;top:0;width:3px;height:26px;background:linear-gradient(#6b717a,#3b4048);box-shadow:0 0 0 1px rgba(0,0,0,.5)}
.hung::before{left:18%}.hung::after{right:18%}
.hung > *{box-shadow:0 14px 30px -10px rgba(0,0,0,.8)}
.hung:nth-child(1){--swayK:g-swayA;--swayT:5.6s;--swayD:-1.2s}
.hung:nth-child(2){--swayK:g-swayC;--swayT:7.8s;--swayD:-2s}
.hung:nth-child(3){--swayK:g-swayB;--swayT:5.1s;--swayD:-0.4s}
/* Three different swings: left-first, right-first, and a slow twist in
   depth, so neighbouring signs are never moving the same way. */
@keyframes g-swayA{0%,100%{transform:rotate(-.7deg) rotateY(1.5deg)}50%{transform:rotate(.7deg) rotateY(-1.5deg)}}
@keyframes g-swayB{0%,100%{transform:rotate(.7deg) rotateY(-2deg)}50%{transform:rotate(-.7deg) rotateY(2deg)}}
@keyframes g-swayC{0%{transform:rotate(-.25deg) rotateY(3deg)}33%{transform:rotate(.7deg) rotateY(-1deg)}66%{transform:rotate(-.7deg) rotateY(-2.5deg)}100%{transform:rotate(-.25deg) rotateY(3deg)}}
.lane{display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 14px 16px;background:#1D4F91;border-radius:12px;box-shadow:inset 0 0 0 5px #1D4F91,inset 0 0 0 8px #FFFFFF;color:#FFFFFF;text-decoration:none;font-weight:800;font-size:24px;line-height:1.05;text-align:center;transition:transform 200ms var(--ease-out),filter 150ms ease}
.lane:active{transform:scale(.97);transition-duration:90ms}
@media (hover:hover){.lane:hover{color:#FFFFFF;filter:brightness(1.12)}}

/* The LED sign sizes its dots from its own width, so two lines of 18
   characters always fit: 18 chars × 5 dots, plus gaps, divided into 100cqw. */
.vms{container-type:inline-size;padding:10px;background:#2B2F35;border-radius:6px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06),0 14px 30px -10px rgba(0,0,0,.8)}
.vms-in{--dot:5px;--gap:calc(var(--dot) * .32);--chgap:calc(var(--dot) * 1.2);display:flex;flex-direction:column;align-items:center;gap:calc(var(--dot) * 2.2);padding:calc(var(--dot) * 3) 18px calc(var(--dot) * 2.6);background:#08090A;border-radius:3px}
@media (max-width:980px){.vms-in{--dot:4px}}
@media (max-width:640px){.vms-in{--dot:2.4px}}
@supports (width:1cqw){.vms-in{--dot:clamp(2px, calc((100cqw - 40px) / 124), 6px)}}
.vline{display:flex;gap:var(--chgap)}
.ch{display:grid;grid-template-columns:repeat(5,var(--dot));grid-auto-rows:var(--dot);gap:var(--gap)}
.ch i{display:block;border-radius:50%;background:#2A1E07;transition:background-color 150ms ease,box-shadow 150ms ease;transition-delay:inherit}
.ch i.on{background:#FFB21A;box-shadow:0 0 4px rgba(255,178,26,.9)}
/* The writing flickers; the panel does not. Every lit dot dips together now
   and then, and a few letters stutter on their own rhythm. Unlit dots and the
   panel never animate, so the sign itself is always on. */
.vline i.on{animation:g-textdip 9.5s steps(1,end) infinite}
@keyframes g-textdip{0%,100%{opacity:1}31%{opacity:1}31.6%{opacity:.35}32.2%{opacity:1}32.8%{opacity:.55}33.4%{opacity:1}72%{opacity:1}72.5%{opacity:.4}73%{opacity:1}}
.ch.k1 i.on{animation:g-flick1 3.7s steps(1,end) infinite}
.ch.k2 i.on{animation:g-flick2 5.3s steps(1,end) infinite}
.ch.k3 i.on{animation:g-flick3 2.9s steps(1,end) infinite}
.ch.k4 i.on{animation:g-flick4 7.1s steps(1,end) infinite}
@keyframes g-flick1{0%,100%{opacity:1}8%{opacity:.15}9%{opacity:1}41%{opacity:.3}42%{opacity:1}43%{opacity:.2}44%{opacity:1}77%{opacity:.5}78%{opacity:1}}
@keyframes g-flick2{0%,100%{opacity:1}23%{opacity:.1}24%{opacity:1}25%{opacity:.1}27%{opacity:1}66%{opacity:.4}67%{opacity:1}}
@keyframes g-flick3{0%,100%{opacity:1}12%{opacity:.2}13%{opacity:1}55%{opacity:.1}56%{opacity:1}57%{opacity:.3}58%{opacity:1}88%{opacity:.6}89%{opacity:1}}
@keyframes g-flick4{0%,100%{opacity:1}5%{opacity:.3}6%{opacity:1}49%{opacity:.15}50%{opacity:1}51%{opacity:.15}53%{opacity:1}}

.copy{position:relative;z-index:3;width:100%;max-width:780px;margin:clamp(16px,3vh,34px) auto 0;text-align:center;overflow-wrap:break-word}
.hero .h1{margin:0;text-shadow:0 2px 24px rgba(0,0,0,.85);font-weight:900;font-size:clamp(34px,min(6.2vw,8.2vh),84px);line-height:.98;letter-spacing:-.025em;text-wrap:balance}
.lede{text-wrap:wrap;text-shadow:0 1px 2px #000,0 0 16px rgba(0,0,0,.95);margin:clamp(10px,2vh,22px) auto 0;max-width:34em;font-size:clamp(16px,1.5vw,20px);line-height:1.55;color:#C9CED4}
.hrise{animation:g-rise 760ms var(--spring-soft) both}
.try{margin:clamp(14px,2.6vh,30px) auto 0;max-width:460px;text-align:left}
.try label,.note{text-shadow:0 1px 2px #000,0 0 12px rgba(0,0,0,.9)}
.try label{display:block;font-weight:700;font-size:15px;margin-bottom:8px}
.try input{box-sizing:border-box;width:100%;min-height:58px;padding:6px 18px 2px;background:rgba(18,20,23,.92);box-shadow:0 10px 30px rgba(0,0,0,.55);border:2px solid #3B4048;border-radius:8px;color:#FFFFFF;font:600 19px var(--font-sans);transition:border-color 150ms ease,box-shadow 150ms ease}
.try input::placeholder{color:#8A9099}
.try input:focus{outline:none;border-color:#FFB21A;box-shadow:0 0 0 4px rgba(255,178,26,.18)}
.note{margin:10px 0 0;font-size:13px;color:#9AA1AA}

/* The windscreen. The road is a plane tilted away from the viewer; your own
   car is the bonnet at the bottom; the gantry hangs over the lane ahead. */
.scene{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.sky{position:absolute;inset:0;background:radial-gradient(ellipse 60% 30% at 50% 58%,rgba(255,178,26,.10),transparent 70%),linear-gradient(#0c0e12 0%,#121417 55%,#15171b 100%)}
.horizon{position:absolute;left:0;right:0;bottom:calc(var(--bonnet) + var(--road));height:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08) 30%,rgba(255,255,255,.12) 50%,rgba(255,255,255,.08) 70%,transparent)}
.ground{position:absolute;left:0;right:0;bottom:0;height:calc(var(--bonnet) + var(--road));overflow:hidden}
.roadcv{position:absolute;inset:0;width:100%;height:100%;display:block}
.me{position:absolute;left:0;right:0;bottom:0;z-index:2;pointer-events:none;line-height:0}
.me svg{display:block;width:100%;height:var(--bonnet)}
.glass{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(170deg,rgba(255,255,255,.035) 0%,transparent 28%,transparent 70%,rgba(255,255,255,.02) 100%)}

.pause{box-sizing:content-box;position:absolute;right:24px;bottom:22px;z-index:4;min-height:44px;padding:4px 16px 0;border:1px solid #3B4048;border-radius:6px;background:rgba(18,20,23,.7);color:#D5D9DE;font:600 14px var(--font-sans);cursor:pointer;transition:transform 200ms var(--ease-out),border-color 150ms ease}
.pause:active{transform:scale(.97);transition-duration:90ms}
@media (hover:hover){.pause:hover{border-color:#8A9099}}
@keyframes g-arrive{from{opacity:0;transform:translateY(-14px) scale(.86)}to{opacity:1;transform:none}}
@keyframes g-rise{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}

@media (max-width:980px){
  .hang{grid-template-columns:1fr 1fr;padding:0 12px}
  .hung:nth-child(2){grid-column:1/-1;order:-1}
  .hung:nth-child(1),.hung:nth-child(3){padding-top:0}
  .hung:nth-child(1)::before,.hung:nth-child(1)::after,.hung:nth-child(3)::before,.hung:nth-child(3)::after{display:none}
  .post{display:none}
}
@media (max-width:640px){
  .hwrap{padding-inline:18px}
  .lane{flex-direction:row;justify-content:center;gap:10px;font-size:16px;padding:11px 12px 9px}
  .lane svg{width:16px;height:20px}
  .lede{font-size:15px}
  .vms-in{padding-left:10px;padding-right:10px}
  .pause{right:12px;bottom:12px;font-size:12px;min-height:40px}
}
@media (max-height:780px){
  .try .note{display:none}
  .lane{gap:6px;padding-top:12px;padding-bottom:10px}
  .lane svg{height:28px}
}
@media (prefers-reduced-motion:reduce){
  .hung{animation:none}
  .ch i.on,.vline i.on{animation:none!important}
  .gantry,.hrise{animation:g-fade 300ms ease both}
  .ch i{transition-duration:80ms;transition-delay:0ms}
}
@keyframes g-fade{from{opacity:0}to{opacity:1}}
`
