import { site } from '@/lib/site'

/**
 * Compass mark: a north-pointing needle in a ring. The north half is orange —
 * the same "direction is the point" idea the arrows carry.
 */
export function Logo({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden focusable="false">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M16 4.5 22 20 16 16.6 10 20Z" fill="var(--orange)" />
      <path d="M16 27.5 10 20l6 3.4 6-3.4Z" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

/**
 * Set in the condensed display face, uppercase, tightly tracked.
 *
 * The parent brand only. Which division you are in is shown beside it by the
 * header, so the wordmark never has to change as you move around the site.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Logo className="h-6 w-6" />
      <span className="display text-lg leading-none tracking-[0.02em]">
        {site.name}
      </span>
    </span>
  )
}
