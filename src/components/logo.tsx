/**
 * Compass-rose mark: a north-pointing needle inside a ring.
 * Drawn with currentColor so it inherits ink or accent wherever it is used.
 */
export function Logo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      {/* North half — filled, the emphasis of the mark */}
      <path d="M16 4.5 22 20 16 16.6 10 20Z" fill="currentColor" />
      {/* South half — outlined, so the needle reads as pointing up */}
      <path
        d="M16 27.5 10 20l6 3.4 6-3.4Z"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <Logo className="h-7 w-7 text-accent" />
      <span className="font-serif text-lg tracking-tight">
        Northbound<span className="text-ink-faint"> Web</span>
      </span>
    </span>
  )
}
