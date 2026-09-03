import { LOCKUP_PATH, LOCKUP_VIEWBOX, MARK_PATH, MARK_VIEWBOX } from './logo-paths'
import { cn } from './ui'

const LOCKUP_W = 514
const LOCKUP_H = 266
const MARK_W = 372
const MARK_H = 156

/**
 * Shared paint for every logo on the page.
 *
 * The 22KB of path data and the metal gradient are declared once here and
 * referenced by id, so a page carrying the header, hero and footer logos ships
 * one copy rather than three. Rendered once, from the root layout.
 */
export function LogoDefs() {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute"
    >
      <defs>
        {/*
          Brushed aluminium: graphite through cool grey to a single bright
          specular band, then back down. Four restrained tones and one
          highlight — no rainbow, no glitter.
        */}
        <linearGradient id="nb-metal" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#6E7681" />
          <stop offset="14%" stopColor="#AEB4BA" />
          <stop offset="26%" stopColor="#E8EBEE" />
          <stop offset="33%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#DDE1E5" />
          <stop offset="52%" stopColor="#9BA2A9" />
          <stop offset="63%" stopColor="#C7CCD2" />
          <stop offset="74%" stopColor="#F1F3F5" />
          <stop offset="84%" stopColor="#A9B0B7" />
          <stop offset="100%" stopColor="#767D87" />
        </linearGradient>

        {/*
          Fine foil grain, matching the tactile texture on the brand board.
          Static: it is rendered once and never re-rasterised, and it is
          switched off below 768px so scrolling stays cheap on phones.
        */}
        <filter id="nb-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>

        <mask
          id="nb-lockup-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={LOCKUP_W}
          height={LOCKUP_H}
        >
          <path d={LOCKUP_PATH} fill="#fff" />
        </mask>

        <mask
          id="nb-mark-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={MARK_W}
          height={MARK_H}
        >
          <path d={MARK_PATH} fill="#fff" />
        </mask>
      </defs>
    </svg>
  )
}

/**
 * The logo, painted in moving metal.
 *
 * The mark itself is a static mask — its geometry, proportions and internal
 * detail never change. A gradient sheet twice the width of the mark is drawn
 * behind that mask and translated across it, so the only thing in motion is
 * the light on the material. Transform-only, so it composites on the GPU and
 * causes no layout work; `prefers-reduced-motion` parks the sheet mid-sweep,
 * leaving the same silver logo, static.
 */
function Metal({
  variant,
  intensity,
  className,
}: {
  variant: 'lockup' | 'mark'
  intensity: 'hero' | 'ambient'
  className?: string
}) {
  const lockup = variant === 'lockup'
  const w = lockup ? LOCKUP_W : MARK_W
  const h = lockup ? LOCKUP_H : MARK_H

  return (
    <svg
      viewBox={lockup ? LOCKUP_VIEWBOX : MARK_VIEWBOX}
      className={className}
      aria-hidden
      focusable="false"
    >
      <g mask={`url(#nb-${variant}-mask)`}>
        <rect
          x={-w * 0.5}
          y={0}
          width={w * 2}
          height={h}
          fill="url(#nb-metal)"
          className={intensity === 'hero' ? 'nb-sheen-hero' : 'nb-sheen'}
        />
        <rect
          width={w}
          height={h}
          filter="url(#nb-grain)"
          className="nb-grain"
          opacity={0.12}
        />
      </g>
    </svg>
  )
}

/** Full lockup: monogram, NORTHBOUND, WEB. */
export function Lockup({
  className = 'h-12 w-auto',
  intensity = 'ambient',
}: {
  className?: string
  intensity?: 'hero' | 'ambient'
}) {
  return <Metal variant="lockup" intensity={intensity} className={cn('nb-logo', className)} />
}

/** Symbol only — the scrolled header mark and tight spaces. */
export function Mark({
  className = 'h-8 w-auto',
  intensity = 'ambient',
}: {
  className?: string
  intensity?: 'hero' | 'ambient'
}) {
  return <Metal variant="mark" intensity={intensity} className={cn('nb-logo', className)} />
}

/**
 * Flat single-colour lockup for surfaces where the metal would be wrong —
 * the footer, print, and anywhere the logo sits on cream.
 */
export function LockupFlat({ className = 'h-10 w-auto' }: { className?: string }) {
  return (
    <svg
      viewBox={LOCKUP_VIEWBOX}
      className={className}
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path d={LOCKUP_PATH} />
    </svg>
  )
}
