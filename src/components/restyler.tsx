'use client'

import { useState } from 'react'
import { Fraunces, Space_Grotesk } from 'next/font/google'
import { Container, Label } from '@/components/ui'

/**
 * The restyler.
 *
 * A demo business site the visitor restyles live — palette, type pairing,
 * spacing, corners — and watches rebuild instantly, with the resulting spec
 * printed underneath.
 *
 * The point is not the toy. Every control writes a CSS custom property on one
 * wrapper and the whole demo re-renders from those four values, which is the
 * argument Northbound is making: a site built on a system, not a template.
 * The spec readout makes that visible — it is the same handful of decisions
 * that a real build is handed over with.
 *
 * No dependencies. Two extra typefaces are loaded through next/font, which
 * self-hosts them; the third pairing reuses the fonts the site already has.
 *
 * Fernway Coffee House is invented.
 */

const editorial = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
})

const geometric = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
})

type Palette = {
  name: string
  bg: string
  ink: string
  soft: string
  accent: string
  onAccent: string
}

const PALETTES: Palette[] = [
  {
    name: 'Bottle green',
    bg: '#f4f1e8',
    ink: '#14312a',
    soft: '#e4dfd0',
    accent: '#c2410c',
    onAccent: '#ffffff',
  },
  {
    name: 'Ink and chalk',
    bg: '#fbfbf9',
    ink: '#16181d',
    soft: '#ecedea',
    accent: '#1d4ed8',
    onAccent: '#ffffff',
  },
  {
    name: 'Terracotta',
    bg: '#fdf6f0',
    ink: '#432818',
    soft: '#f3e3d6',
    accent: '#bc4b2a',
    onAccent: '#fff6f0',
  },
  {
    name: 'Night shift',
    bg: '#14161a',
    ink: '#eef0ee',
    soft: '#22262c',
    accent: '#5eead4',
    onAccent: '#06241f',
  },
  {
    name: 'Seaglass',
    bg: '#f2f7f6',
    ink: '#0f3b38',
    soft: '#dcebe8',
    accent: '#0f766e',
    onAccent: '#ffffff',
  },
]

type Pairing = { name: string; heading: string; body: string; note: string }

const PAIRINGS: Pairing[] = [
  {
    name: 'Editorial',
    heading: editorial.style.fontFamily,
    body: 'var(--font-body)',
    note: 'Fraunces / Inter',
  },
  {
    name: 'Geometric',
    heading: geometric.style.fontFamily,
    body: geometric.style.fontFamily,
    note: 'Space Grotesk',
  },
  {
    name: 'Poster',
    heading: 'var(--font-display)',
    body: 'var(--font-body)',
    note: 'Anton / Inter',
  },
]

const DENSITIES = [
  { name: 'Roomy', space: 1.25 },
  { name: 'Balanced', space: 1 },
  { name: 'Compact', space: 0.78 },
]

const CORNERS = [
  { name: 'Square', radius: '0px' },
  { name: 'Soft', radius: '10px' },
  { name: 'Round', radius: '22px' },
]

export function Restyler() {
  const [palette, setPalette] = useState(0)
  const [pairing, setPairing] = useState(0)
  const [density, setDensity] = useState(1)
  const [corner, setCorner] = useState(1)

  const p = PALETTES[palette]
  const t = PAIRINGS[pairing]
  const d = DENSITIES[density]
  const c = CORNERS[corner]

  const shuffle = () => {
    setPalette(Math.floor(Math.random() * PALETTES.length))
    setPairing(Math.floor(Math.random() * PAIRINGS.length))
    setDensity(Math.floor(Math.random() * DENSITIES.length))
    setCorner(Math.floor(Math.random() * CORNERS.length))
  }

  return (
    <section
      aria-labelledby="restyler-heading"
      className="border-b border-line py-20 sm:py-28"
    >
      <Container>
        <div className="flex items-start justify-between">
          <Label>Try it yourself</Label>
          <span className="label text-accent">Live</span>
        </div>

        <div className="mt-6 max-w-2xl">
          <h2 id="restyler-heading" className="display text-4xl sm:text-5xl">
            Not a template.
            <br />A system.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink-muted sm:text-lg">
            Change four things and watch a whole site rebuild around them. This
            is how your site gets built — a handful of decisions, applied
            everywhere at once, so it stays consistent as it grows.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
          {/* ── Controls ───────────────────────────────────────── */}
          <div className="order-2 lg:order-1">
            <Choice
              legend="Palette"
              options={PALETTES.map((x) => x.name)}
              value={palette}
              onChange={setPalette}
              swatches={PALETTES.map((x) => x.accent)}
            />
            <Choice
              legend="Type"
              options={PAIRINGS.map((x) => x.name)}
              value={pairing}
              onChange={setPairing}
            />
            <Choice
              legend="Spacing"
              options={DENSITIES.map((x) => x.name)}
              value={density}
              onChange={setDensity}
            />
            <Choice
              legend="Corners"
              options={CORNERS.map((x) => x.name)}
              value={corner}
              onChange={setCorner}
            />

            <button
              type="button"
              onClick={shuffle}
              className="press mt-7 w-full cursor-pointer border border-line-strong px-5 py-3 text-sm font-medium tracking-wide uppercase hover:bg-ink hover:text-paper"
            >
              Surprise me
            </button>

            {/* The spec readout — the actual argument of the section. */}
            <dl className="mt-7 border-t border-line pt-5 text-xs">
              <SpecRow label="Background" value={p.bg} swatch={p.bg} />
              <SpecRow label="Ink" value={p.ink} swatch={p.ink} />
              <SpecRow label="Accent" value={p.accent} swatch={p.accent} />
              <SpecRow label="Typeface" value={t.note} />
              <SpecRow label="Spacing scale" value={`${d.space.toFixed(2)}×`} />
              <SpecRow label="Corner radius" value={c.radius} />
            </dl>
          </div>

          {/* ── The demo site ──────────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <div className="rounded-lg border border-line bg-paper-raised p-2 shadow-sm">
              <div className="flex items-center gap-3 px-1.5 pt-1 pb-2.5">
                <span aria-hidden className="flex gap-1.5">
                  <i className="block size-2 rounded-full bg-line-strong" />
                  <i className="block size-2 rounded-full bg-line-strong" />
                  <i className="block size-2 rounded-full bg-line-strong" />
                </span>
                <span className="flex-1 truncate rounded-full bg-paper-sunk px-3 py-1 text-center text-[11px] text-ink-faint">
                  fernwaycoffee.co.uk
                </span>
              </div>

              <div
                className="@container overflow-hidden"
                style={{
                  background: p.bg,
                  color: p.ink,
                  borderRadius: c.radius,
                  fontFamily: t.body,
                  transition:
                    'background-color var(--t-stage) var(--ease-out), color var(--t-stage) var(--ease-out), border-radius var(--t-stage) var(--ease-out)',
                }}
              >
                <DemoSite palette={p} pairing={t} space={d.space} radius={c.radius} />
              </div>
            </div>

            <p className="mt-3 text-xs text-ink-faint">
              Fernway Coffee House is a made-up business, built here to be taken
              apart.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Choice({
  legend,
  options,
  value,
  onChange,
  swatches,
}: {
  legend: string
  options: string[]
  value: number
  onChange: (i: number) => void
  swatches?: string[]
}) {
  return (
    <fieldset className="mt-6 first:mt-0">
      <legend className="label text-ink-faint">{legend}</legend>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((name, i) => {
          const on = i === value
          return (
            <button
              key={name}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(i)}
              className={`press flex cursor-pointer items-center gap-2 border px-3 py-1.5 text-sm ${
                on
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line text-ink-muted hover:border-line-strong hover:text-ink'
              }`}
            >
              {swatches ? (
                <span
                  aria-hidden
                  className="block size-3 rounded-full ring-1 ring-black/10"
                  style={{ background: swatches[i] }}
                />
              ) : null}
              {name}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function SpecRow({
  label,
  value,
  swatch,
}: {
  label: string
  value: string
  swatch?: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-line py-2 last:border-b-0">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="flex items-center gap-2 font-mono text-ink">
        {swatch ? (
          <span
            aria-hidden
            className="block size-3 rounded-sm ring-1 ring-black/10"
            style={{ background: swatch }}
          />
        ) : null}
        {value}
      </dd>
    </div>
  )
}

/** The demo site itself. Everything scales off `space` and `radius`. */
function DemoSite({
  palette,
  pairing,
  space,
  radius,
}: {
  palette: Palette
  pairing: Pairing
  space: number
  radius: string
}) {
  const pad = `${1.6 * space}rem`
  const gap = `${0.75 * space}rem`

  return (
    <div style={{ transition: 'all var(--t-stage) var(--ease-out)' }}>
      <header
        className="flex items-center justify-between border-b"
        style={{
          padding: `${0.85 * space}rem ${pad}`,
          borderColor: palette.soft,
        }}
      >
        <span
          className="text-base font-semibold tracking-tight"
          style={{ fontFamily: pairing.heading }}
        >
          Fernway
        </span>
        <span
          className="hidden gap-5 text-xs opacity-70 @sm:flex"
          aria-hidden
        >
          <span>Menu</span>
          <span>Beans</span>
          <span>Visit</span>
        </span>
        <span
          className="text-xs font-medium"
          style={{
            background: palette.accent,
            color: palette.onAccent,
            borderRadius: radius,
            padding: `${0.42 * space}rem ${0.85 * space}rem`,
          }}
        >
          Book a table
        </span>
      </header>

      <div
        className="grid items-center gap-6 @md:grid-cols-[1.15fr_0.85fr]"
        style={{ padding: pad }}
      >
        <div>
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: palette.accent }}
          >
            Roasted on site
          </span>
          <h3
            className="mt-2 text-3xl leading-[1.05] font-semibold tracking-tight @md:text-4xl"
            style={{ fontFamily: pairing.heading }}
          >
            Coffee worth the walk.
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-75">
            A small roastery and coffee house on the old mill road. Beans
            roasted on Tuesdays, bread from the bakery two doors down.
          </p>
          <div className="mt-5 flex flex-wrap" style={{ gap }}>
            <span
              className="text-xs font-medium"
              style={{
                background: palette.accent,
                color: palette.onAccent,
                borderRadius: radius,
                padding: `${0.55 * space}rem ${1.05 * space}rem`,
              }}
            >
              See the menu
            </span>
            <span
              className="text-xs font-medium"
              style={{
                border: `1px solid ${palette.ink}`,
                borderRadius: radius,
                padding: `${0.55 * space}rem ${1.05 * space}rem`,
              }}
            >
              Find us
            </span>
          </div>
        </div>

        {/* A stand-in for photography, drawn rather than loaded. */}
        <div
          aria-hidden
          className="relative aspect-[4/3] overflow-hidden"
          style={{ background: palette.soft, borderRadius: radius }}
        >
          <span
            className="absolute bottom-[-18%] left-1/2 block aspect-square w-[62%] -translate-x-1/2 rounded-full"
            style={{ background: palette.accent, opacity: 0.85 }}
          />
          <span
            className="absolute top-[14%] right-[16%] block aspect-square w-[22%] rounded-full"
            style={{ border: `2px solid ${palette.ink}`, opacity: 0.35 }}
          />
        </div>
      </div>

      <div
        className="grid gap-3 @sm:grid-cols-3"
        style={{ padding: `0 ${pad} ${pad}` }}
      >
        {[
          ['Filter', '£3.20'],
          ['Flat white', '£3.60'],
          ['Bag of beans', '£9.00'],
        ].map(([name, price]) => (
          <div
            key={name}
            style={{
              background: palette.soft,
              borderRadius: radius,
              padding: `${0.9 * space}rem`,
            }}
          >
            <div
              className="text-sm font-semibold"
              style={{ fontFamily: pairing.heading }}
            >
              {name}
            </div>
            <div className="mt-0.5 text-xs opacity-70">{price}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
