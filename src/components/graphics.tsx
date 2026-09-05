/**
 * Thin-line technical marks.
 *
 * All drawn on a 24-unit grid with a 1.5 stroke and no fill, so they read as
 * drafting symbols rather than illustrations. `currentColor` throughout —
 * colour is decided by the surface each one sits on.
 */
type G = { className?: string }

function Icon({ className = 'h-6 w-6', children }: G & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  )
}

/** Web services — a browser chrome. */
export function WindowIcon({ className }: G) {
  return (
    <Icon className={className}>
      <rect x="2.5" y="4" width="19" height="16" />
      <path d="M2.5 8.5h19" />
      <path d="M5.5 6.25h1.5M8.5 6.25H10" />
    </Icon>
  )
}

/** AI employees — two figures. */
export function PeopleIcon({ className }: G) {
  return (
    <Icon className={className}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20" />
      <path d="M16 5.2a3.25 3.25 0 0 1 0 5.6" />
      <path d="M17 14h.5a4.5 4.5 0 0 1 4.5 4.5V20" />
    </Icon>
  )
}

/** Growth — a rising plot. */
export function GrowthIcon({ className }: G) {
  return (
    <Icon className={className}>
      <path d="M3 20h18" />
      <path d="M3 20V4" />
      <path d="M6 15.5l4-4.5 3.5 3L21 6" />
      <path d="M21 6h-4.5M21 6v4.5" />
    </Icon>
  )
}

/** Secure — a shield with a lock. */
export function ShieldIcon({ className }: G) {
  return (
    <Icon className={className}>
      <path d="M12 2.75 20 5.5v6c0 4.4-3.2 8.2-8 9.75-4.8-1.55-8-5.35-8-9.75v-6Z" />
      <rect x="9.25" y="10.75" width="5.5" height="4.5" />
      <path d="M10.5 10.75V9.5a1.5 1.5 0 0 1 3 0v1.25" />
    </Icon>
  )
}

/** The recurring directional arrow. */
export function ArrowRight({ className = 'h-3.5 w-3.5' }: G) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
      focusable="false"
    >
      <path d="M1 8h13M9 3l5 5-5 5" />
    </svg>
  )
}

export function ArrowLeftIcon({ className = 'h-3.5 w-3.5' }: G) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
      focusable="false"
    >
      <path d="M15 8H2M7 3 2 8l5 5" />
    </svg>
  )
}

/** Instagram glyph. */
export function InstagramIcon({ className = 'h-5 w-5' }: G) {
  return (
    <Icon className={className}>
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </Icon>
  )
}

/** TikTok glyph — drawn as a filled note so it reads at 20px. */
export function TikTokIcon({ className = 'h-5 w-5' }: G) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path d="M16.5 2h-3v13.1a2.6 2.6 0 1 1-2-2.53V9.5a5.6 5.6 0 1 0 5 5.57V9.02a6.7 6.7 0 0 0 4 1.32V7.3a3.8 3.8 0 0 1-4-3.8V2Z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Northbound Employees.                                               */
/* Each worker gets its own mark so the cards are told apart at a       */
/* glance — a scope, a ranked report, a conversation, a build block, a  */
/* watched window, a broadcast, a ledger. No robots, no emoji.          */
/* ------------------------------------------------------------------ */

/** Scout — a viewfinder sweeping a field. */
export function ScoutIcon({ className }: G) {
  return (
    <Icon className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M11 1.5v3M11 17.5v3M1.5 11h3M17.5 11h3" />
      <path d="M9 11h4M11 9v4" />
      <path d="M16 16l5.5 5.5" />
    </Icon>
  )
}

/** Audit — findings ranked, longest bar first. */
export function AuditIcon({ className }: G) {
  return (
    <Icon className={className}>
      <rect x="3.5" y="2.5" width="17" height="19" />
      <path d="M7 8h10M7 12h7M7 16h4" />
    </Icon>
  )
}

/** Closer — a reply going back out. */
export function CloserIcon({ className }: G) {
  return (
    <Icon className={className}>
      <path d="M3 5.5h18v11H8l-5 4.5Z" />
      <path d="M8 11h8M13 8l3 3-3 3" />
    </Icon>
  )
}

/** Forge — a page assembled from parts. */
export function ForgeIcon({ className }: G) {
  return (
    <Icon className={className}>
      <rect x="2.5" y="3.5" width="19" height="17" />
      <path d="M2.5 9h19" />
      <path d="M9 9v11.5" />
      <path d="M12.5 13h5.5M12.5 16.5h3.5" />
    </Icon>
  )
}

/** Keeper — a window under watch. */
export function KeeperIcon({ className }: G) {
  return (
    <Icon className={className}>
      <rect x="2.5" y="3.5" width="19" height="14" />
      <path d="M2.5 8h19" />
      <path d="M7 21h10" />
      <path d="M12 11.5l2.5 2.5 4-4.5" />
    </Icon>
  )
}

/** Signal — output broadcast outward. */
export function SignalIcon({ className }: G) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 16.2a6 6 0 0 0 0-8.4" />
      <path d="M4.8 4.8a10 10 0 0 0 0 14.4M19.2 19.2a10 10 0 0 0 0-14.4" />
    </Icon>
  )
}

/** Venture — a ledger with a rising column. */
export function VentureIcon({ className }: G) {
  return (
    <Icon className={className}>
      <path d="M3 21h18" />
      <rect x="4" y="13" width="4" height="5" />
      <rect x="10" y="9" width="4" height="9" />
      <rect x="16" y="4" width="4" height="14" />
    </Icon>
  )
}

/** Director — the layer coordinating the rest. */
export function DirectorIcon({ className }: G) {
  return (
    <Icon className={className}>
      <rect x="9" y="2.5" width="6" height="6" />
      <rect x="2.5" y="15.5" width="6" height="6" />
      <rect x="15.5" y="15.5" width="6" height="6" />
      <path d="M12 8.5v4M12 12.5H5.5v3M12 12.5h6.5v3" />
    </Icon>
  )
}

export const employeeIcons = {
  scout: ScoutIcon,
  audit: AuditIcon,
  closer: CloserIcon,
  forge: ForgeIcon,
  keeper: KeeperIcon,
  signal: SignalIcon,
  venture: VentureIcon,
  director: DirectorIcon,
} as const

/** A short rule used to terminate a label. */
export function Rule({ className = 'h-px w-10 bg-line-strong' }: G) {
  return <span aria-hidden className={className} />
}
