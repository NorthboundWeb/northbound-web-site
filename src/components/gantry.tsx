'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui'

/**
 * The gantry.
 *
 * A dark full-bleed band at the top of the home page: a motorway gantry with a
 * working variable-message sign. The sign is a real 5×7 dot-matrix display —
 * every character is thirty-five dots, lit from a bitmap font — cycling four
 * short messages until the visitor types their business name, at which point
 * it writes that instead.
 *
 * The road under it is a perspective plane with moving lane markings. It is
 * decorative, pausable, and stops entirely under prefers-reduced-motion.
 *
 * The lane signs either side of the display are real links: the two places
 * the home page most wants people to go.
 *
 * Why no library: the whole thing is CSS transforms, a keyframe and one
 * interval. Nothing here warrants a dependency.
 */

const COLS = 18

const MESSAGES: [string, string][] = [
  ['SLOW WEBSITE?', 'TAKE THE NEXT EXIT'],
  ['FIXED PRICES', 'FROM £249'],
  ['YOU OWN IT', 'OUTRIGHT'],
  ['SEE THE DIFFERENCE', 'ON DISCOVER'],
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

export function Gantry() {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const typed = name.trim().length > 0
  const typedRef = useRef(typed)
  typedRef.current = typed

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      if (typedRef.current) return
      setMsg((m) => (m + 1) % MESSAGES.length)
    }, 3600)
    return () => window.clearInterval(id)
  }, [paused])

  const lines = useMemo(() => {
    const raw: [string, string] = typed
      ? ['NEW WEBSITE FOR', name]
      : MESSAGES[msg % MESSAGES.length]
    return {
      label: raw.join(' '),
      rows: raw.map((text, li) =>
        centre(text)
          .split('')
          .map((c, ci) => ({ dots: glyph(c), delay: typed ? 0 : li * 160 + ci * 26 }))
      ),
    }
  }, [name, msg, typed])

  const roadPaused = paused || reduced

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-green text-cream"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 34% at 50% 82%, rgba(240,74,10,.14), transparent 70%)',
        }}
      />

      <Container className="relative z-10 pt-6 pb-[21rem] sm:pb-[23rem]">
        {/* The gantry */}
        <div className="gantry relative mx-auto max-w-5xl">
          <span aria-hidden className="post left-0" />
          <span aria-hidden className="post right-0" />
          <div aria-hidden className="beam" />

          <div className="hang">
            <Link href="/discover" className="lane">
              <span>Discover</span>
              <DownArrow />
            </Link>

            <div className="vms" role="img" aria-label={`Sign reads: ${lines.label}`}>
              <div className="vms-in" aria-hidden>
                {lines.rows.map((row, li) => (
                  <div key={li} className="vline">
                    {row.map((ch, ci) => (
                      <div
                        key={ci}
                        className="ch"
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

            <Link href="/services" className="lane">
              <span>Prices</span>
              <DownArrow />
            </Link>
          </div>
        </div>

        {/* Copy */}
        <div className="mx-auto mt-14 max-w-3xl text-center sm:mt-16">
          <h1
            id="hero-heading"
            className="display rise-in text-[clamp(3rem,8.5vw,7.5rem)] text-cream"
            style={{ animationDelay: '1050ms' }}
          >
            Websites that get
            <br />
            people to your door<span className="text-accent">.</span>
          </h1>
          <p
            className="rise-in mx-auto mt-7 max-w-xl text-lg leading-relaxed text-cream/80"
            style={{ animationDelay: '1150ms' }}
          >
            Fast, clear websites for small UK businesses, at fixed prices from
            £249. You own everything we build.
          </p>

          <form
            className="rise-in mx-auto mt-9 max-w-md text-left"
            style={{ animationDelay: '1250ms' }}
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="biz" className="label block text-cream/70">
              Put your business in lights
            </label>
            <input
              id="biz"
              type="text"
              autoComplete="organization"
              maxLength={30}
              placeholder="Your business name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2.5 w-full border-b-2 border-cream/40 bg-transparent py-3 text-xl font-medium text-cream placeholder:text-cream/40 focus:border-accent focus:outline-none"
            />
            <p className="mt-2.5 text-xs text-cream/55">
              Watch the sign. Nothing you type is saved or sent.
            </p>
          </form>
        </div>
      </Container>

      {/* The road */}
      <div aria-hidden className={`road-wrap ${roadPaused ? 'paused' : ''}`}>
        <div className="road">
          <span className="edge" style={{ left: 70 }} />
          <span className="dash" style={{ left: '34%' }} />
          <span className="dash" style={{ left: '50%' }} />
          <span className="dash" style={{ left: '66%' }} />
          <span className="edge" style={{ right: 70 }} />
          <span className="eyes" />
        </div>
      </div>

      {!reduced ? (
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          className="press absolute right-4 bottom-4 z-20 min-h-11 rounded-sm border border-cream/25 bg-green/70 px-4 text-xs font-medium tracking-wide text-cream/80 uppercase backdrop-blur-sm hover:border-cream/60 sm:right-6 sm:bottom-6"
        >
          {paused ? 'Play the road' : 'Pause the road'}
        </button>
      ) : null}

      <style>{css}</style>
    </section>
  )
}

function DownArrow() {
  return (
    <svg viewBox="0 0 40 50" className="h-9 w-7" aria-hidden>
      <path d="M15 3h10v27h11L20 47 4 30h11z" fill="currentColor" />
    </svg>
  )
}

/*
 * Scoped styles. These are component-specific enough (the dot-matrix grid,
 * the perspective road) that a utility class per rule would be noise. They
 * live beside the markup they shape.
 */
const css = `
.gantry{--dot:5px;--dg:1.6px;animation:gantry-arrive 1200ms var(--ease-out) 80ms both;transform-origin:50% 0}
.post{position:absolute;top:0;width:16px;height:560px;background:linear-gradient(90deg,#0a211c,#1b3a32 45%,#0a211c);z-index:-1}
.beam{height:16px;border-radius:2px;background:repeating-linear-gradient(135deg,#2a4a41 0 10px,#1b3a32 10px 20px)}
.hang{display:grid;grid-template-columns:200px minmax(0,1fr) 200px;gap:18px;align-items:start;margin-top:10px;padding:0 28px}
.lane{display:flex;flex-direction:column;align-items:center;gap:8px;padding:18px 14px 14px;border-radius:10px;background:#112f29;box-shadow:inset 0 0 0 5px #112f29,inset 0 0 0 8px #f2ebdd;color:#f2ebdd;font-family:var(--font-display);font-size:1.6rem;line-height:1;letter-spacing:.02em;text-transform:uppercase;text-decoration:none;transition:transform 200ms var(--ease-out),box-shadow 150ms ease}
.lane:hover{box-shadow:inset 0 0 0 5px #112f29,inset 0 0 0 8px #f04a0a}
.lane:active{transform:scale(.97);transition-duration:90ms}
.vms{padding:10px;border-radius:6px;background:#0a211c}
.vms-in{display:flex;flex-direction:column;align-items:center;gap:calc(var(--dot) * 2.2);padding:18px 16px 16px;border-radius:3px;background:#05100d;animation:gantry-power 900ms steps(1,end) 760ms both}
.vline{display:flex;gap:calc(var(--dot) + var(--dg) * 2)}
.ch{display:grid;grid-template-columns:repeat(5,var(--dot));grid-auto-rows:var(--dot);gap:var(--dg)}
.ch i{display:block;border-radius:50%;background:#1f1407;transition:background-color 150ms ease,box-shadow 150ms ease;transition-delay:inherit}
.ch i.on{background:#f59e0b;box-shadow:0 0 4px rgba(245,158,11,.9)}
.road-wrap{position:absolute;left:0;right:0;bottom:0;height:330px;perspective:520px;perspective-origin:50% 0%;overflow:hidden;pointer-events:none;z-index:1}
.road-wrap::after{content:"";position:absolute;inset:0;background:linear-gradient(#0d2a24 0%,rgba(13,42,36,.85) 22%,rgba(13,42,36,0) 60%)}
.road{position:absolute;left:50%;bottom:-60px;width:1240px;height:1500px;margin-left:-620px;transform-origin:50% 100%;transform:rotateX(77deg);background:#0a1e19}
.edge{position:absolute;top:0;bottom:0;width:12px;background:rgba(242,235,221,.75)}
.dash{position:absolute;top:0;bottom:0;width:11px;margin-left:-5px;background:repeating-linear-gradient(to bottom,rgba(242,235,221,.75) 0 80px,transparent 80px 200px);animation:gantry-drive 520ms linear infinite}
.eyes{position:absolute;top:0;bottom:0;right:52px;width:8px;opacity:.9;background:repeating-linear-gradient(to bottom,#f04a0a 0 9px,transparent 9px 100px);animation:gantry-drive2 260ms linear infinite}
.paused .dash,.paused .eyes{animation-play-state:paused}
@keyframes gantry-drive{to{background-position:0 200px}}
@keyframes gantry-drive2{to{background-position:0 100px}}
@keyframes gantry-arrive{from{opacity:0;transform:translateY(-14px) scale(.86)}to{opacity:1;transform:none}}
@keyframes gantry-power{0%{opacity:0}12%{opacity:.7}18%{opacity:.08}30%{opacity:1}36%{opacity:.4}44%{opacity:1}100%{opacity:1}}
@media (max-width:900px){
  .gantry{--dot:4px;--dg:1.3px}
  .hang{grid-template-columns:1fr 1fr;padding:0 8px}
  .vms{grid-column:1/-1;order:-1}
  .post{display:none}
}
@media (max-width:560px){
  .gantry{--dot:2.6px;--dg:1px}
  .lane{font-size:1.2rem}
}
@media (prefers-reduced-motion:reduce){
  .gantry,.vms-in{animation:gantry-fade 300ms ease both}
  .dash,.eyes{animation:none}
  .ch i{transition-duration:80ms;transition-delay:0ms!important}
}
@keyframes gantry-fade{from{opacity:0}to{opacity:1}}
`
