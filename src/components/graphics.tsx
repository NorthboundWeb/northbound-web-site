/**
 * Technical line graphics for the Northbound print system.
 *
 * All drawn with `currentColor` for strokes so they inherit deep green, with
 * orange applied only to the one element that carries emphasis — the point,
 * the marker, the direction. Nothing here is a bitmap.
 */

type G = { className?: string }

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** Oversized browser window — the hero's structural illustration. */
export function BrowserFrame({ className = 'w-full' }: G) {
  return (
    <svg viewBox="0 0 400 280" className={className} aria-hidden>
      <rect x="8" y="8" width="384" height="264" rx="3" {...stroke} />
      <line x1="8" y1="46" x2="392" y2="46" {...stroke} />
      <circle cx="28" cy="27" r="4.5" {...stroke} />
      <circle cx="46" cy="27" r="4.5" {...stroke} />
      <circle cx="64" cy="27" r="4.5" fill="var(--orange)" stroke="none" />
      <rect x="88" y="19" width="230" height="16" rx="8" {...stroke} />

      {/* Wireframe content blocks */}
      <rect x="34" y="76" width="150" height="14" {...stroke} />
      <rect x="34" y="102" width="110" height="8" {...stroke} />
      <rect x="34" y="118" width="128" height="8" {...stroke} />
      <rect x="34" y="150" width="86" height="26" rx="13" fill="var(--orange)" stroke="none" />
      <rect x="222" y="76" width="144" height="100" rx="2" {...stroke} />
      <path d="M222 150 258 118 288 148 316 124 366 168" {...stroke} />
      <circle cx="246" cy="98" r="9" {...stroke} />

      <line x1="34" y1="212" x2="366" y2="212" {...stroke} strokeDasharray="2 6" />
      <rect x="34" y="228" width="70" height="8" {...stroke} />
      <rect x="120" y="228" width="70" height="8" {...stroke} />
      <rect x="206" y="228" width="70" height="8" {...stroke} />
    </svg>
  )
}

/** Cursor arrow — used on the "missed" idea of visitors leaving. */
export function CursorArrow({ className = 'w-full' }: G) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="78" {...stroke} strokeDasharray="3 7" />
      <circle cx="100" cy="100" r="52" {...stroke} />
      <path d="M86 62 132 108 108 112 98 138Z" fill="var(--orange)" stroke="none" />
      <line x1="100" y1="8" x2="100" y2="26" {...stroke} />
      <line x1="100" y1="174" x2="100" y2="192" {...stroke} />
      <line x1="8" y1="100" x2="26" y2="100" {...stroke} />
      <line x1="174" y1="100" x2="192" y2="100" {...stroke} />
    </svg>
  )
}

/** Crosshair / target — "seen". */
export function Crosshair({ className = 'w-full' }: G) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="86" {...stroke} />
      <circle cx="100" cy="100" r="58" {...stroke} strokeDasharray="4 6" />
      <circle cx="100" cy="100" r="30" {...stroke} />
      <circle cx="100" cy="100" r="7" fill="var(--orange)" stroke="none" />
      <line x1="100" y1="0" x2="100" y2="42" {...stroke} />
      <line x1="100" y1="158" x2="100" y2="200" {...stroke} />
      <line x1="0" y1="100" x2="42" y2="100" {...stroke} />
      <line x1="158" y1="100" x2="200" y2="100" {...stroke} />
    </svg>
  )
}

/** Simplified site wireframe — "clear". */
export function Wireframe({ className = 'w-full' }: G) {
  return (
    <svg viewBox="0 0 300 240" className={className} aria-hidden>
      <rect x="6" y="6" width="288" height="228" rx="2" {...stroke} />
      <line x1="6" y1="40" x2="294" y2="40" {...stroke} />
      <rect x="20" y="18" width="46" height="10" fill="var(--orange)" stroke="none" />
      <line x1="200" y1="23" x2="230" y2="23" {...stroke} />
      <line x1="240" y1="23" x2="270" y2="23" {...stroke} />
      <rect x="20" y="60" width="150" height="18" {...stroke} />
      <rect x="20" y="88" width="120" height="8" {...stroke} />
      <rect x="20" y="102" width="134" height="8" {...stroke} />
      <rect x="20" y="126" width="72" height="22" rx="11" {...stroke} />
      <rect x="196" y="60" width="82" height="88" rx="2" {...stroke} strokeDasharray="3 5" />
      <line x1="20" y1="172" x2="278" y2="172" {...stroke} strokeDasharray="2 6" />
      <rect x="20" y="188" width="76" height="30" {...stroke} />
      <rect x="110" y="188" width="76" height="30" {...stroke} />
      <rect x="200" y="188" width="76" height="30" {...stroke} />
    </svg>
  )
}

/** Route with a location marker — "found". */
export function RouteMarker({ className = 'w-full' }: G) {
  return (
    <svg viewBox="0 0 260 200" className={className} aria-hidden>
      <path
        d="M14 168 C 70 168, 58 96, 112 96 S 186 40, 244 40"
        {...stroke}
        strokeDasharray="3 7"
      />
      <circle cx="14" cy="168" r="6" {...stroke} />
      <path
        d="M214 26c-11 0-20 9-20 20 0 15 20 34 20 34s20-19 20-34c0-11-9-20-20-20Z"
        fill="var(--orange)"
        stroke="none"
      />
      <circle cx="214" cy="46" r="7" fill="var(--paper)" stroke="none" />
      <line x1="0" y1="192" x2="260" y2="192" {...stroke} />
      <line x1="14" y1="186" x2="14" y2="198" {...stroke} />
      <line x1="130" y1="186" x2="130" y2="198" {...stroke} />
      <line x1="246" y1="186" x2="246" y2="198" {...stroke} />
    </svg>
  )
}

/** Compass rose — the brand mark's geometry, enlarged. */
export function CompassDiagram({ className = 'w-full' }: G) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="90" {...stroke} />
      <circle cx="100" cy="100" r="66" {...stroke} strokeDasharray="2 6" />
      <path d="M100 24 122 112 100 98 78 112Z" fill="var(--orange)" stroke="none" />
      <path d="M100 176 78 112 100 126 122 112Z" {...stroke} />
      <line x1="100" y1="4" x2="100" y2="18" {...stroke} />
      <line x1="196" y1="100" x2="182" y2="100" {...stroke} />
      <line x1="100" y1="196" x2="100" y2="182" {...stroke} />
      <line x1="4" y1="100" x2="18" y2="100" {...stroke} />
    </svg>
  )
}

/** Corner crop marks, as on a print sheet. */
export function CropMarks({ className = '' }: G) {
  const mark = 'absolute h-4 w-4 border-ink/40'
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${mark} top-0 left-0 border-t border-l`} />
      <span className={`${mark} top-0 right-0 border-t border-r`} />
      <span className={`${mark} bottom-0 left-0 border-b border-l`} />
      <span className={`${mark} bottom-0 right-0 border-b border-r`} />
    </div>
  )
}

/** Orange arrow used on buttons and links — the recurring directional motif. */
export function ArrowRight({ className = 'h-3.5 w-3.5' }: G) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  )
}

/** A hairline with an orange point travelling it. */
export function TravellingLine({ className = '' }: G) {
  return (
    <div aria-hidden className={`relative h-2 w-full ${className}`}>
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-line-strong" />
      <span className="travelling-dot absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent" />
    </div>
  )
}
