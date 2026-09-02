import Link from 'next/link'
import { divisions } from '@/lib/site'

/**
 * Northbound wayfinding — permanent signage for the two divisions.
 *
 * Two geometries, not one shrunk:
 *
 *   lg+     a fixed rail down the right edge. Squared plates, hairline
 *           borders, number over word — a directional sign rather than a
 *           floating widget.
 *   < lg    a fixed bottom bar, "01 WEB | 02 EMPLOYEES", one row tall.
 *
 * **It never overlaps content, and that is enforced by layout rather than by
 * hoping.** The homepage reserves exactly the space this occupies —
 * `lg:pr-[11rem]` for the rail, bottom padding for the bar — so the page's
 * own content box stops where the signage begins. Nothing is covered and
 * nothing is trapped at any width.
 *
 * Hover and focus expand it **vertically only**. Growing leftward would put
 * the panel over body copy, which is the one thing this must not do.
 *
 * Each plate carries `data-division`, so it renders in that division's own
 * environment — rust on cream for Web, signal yellow on charcoal for
 * Employees — while the homepage around it stays neutral. Same idea as the
 * gateway panels: the colour is the destination.
 */
export function DivisionSwitcher() {
  return (
    <nav
      // The hook the shell reserves space against. See globals.css.
      data-switcher=""
      aria-label="Northbound divisions"
      className={[
        // Bottom bar on small screens, right rail from lg up.
        'fixed z-30 print:hidden',
        'inset-x-0 bottom-0 flex',
        'lg:inset-x-auto lg:right-0 lg:bottom-auto lg:top-1/2 lg:w-[11rem] lg:-translate-y-1/2 lg:flex-col',
      ].join(' ')}
    >
      {divisions.map((d, i) => (
        <Link
          key={d.id}
          href={d.href}
          data-division={d.id}
          aria-label={`${d.wordmark} — ${d.signLine}`}
          className={[
            'group/sign relative flex-1 bg-paper text-ink',
            'border-line transition-colors duration-200',
            // Mobile: one row, 56px of target, safe-area aware.
            'flex items-center gap-3 border-t px-4',
            'min-h-14 pb-[env(safe-area-inset-bottom)]',
            i === 0 ? 'border-r' : '',
            // Desktop: a stacked plate.
            'lg:min-h-0 lg:flex-none lg:flex-col lg:items-stretch lg:gap-0 lg:border-r-0 lg:border-l lg:px-5 lg:py-4',
            i === 0 ? 'lg:border-t' : 'lg:border-t',
            'lg:hover:bg-paper-raised',
          ].join(' ')}
        >
          {/* accent-deep, not accent: brand rust at label size is 3.5:1 on
              cream. In the AI theme both resolve to the signal yellow, which
              is 12:1 on charcoal. */}
          <span className="label shrink-0 text-ink-faint lg:text-accent-deep">
            {d.index}
          </span>

          <span className="display text-lg leading-none text-ink lg:mt-2 lg:text-2xl">
            {d.signLabel}
          </span>

          {/*
            The extra line. 0fr → 1fr grows the row from nothing to its
            natural height, so the plate expands downward on hover or
            keyboard focus and never sideways over the page.
          */}
          <span className="hidden lg:grid lg:grid-rows-[0fr] lg:transition-[grid-template-rows] lg:duration-300 lg:group-hover/sign:grid-rows-[1fr] lg:group-focus-visible/sign:grid-rows-[1fr]">
            <span className="overflow-hidden">
              <span className="mt-2 block text-[13px] leading-snug text-ink-muted">
                {d.signLine}
              </span>
            </span>
          </span>

          {/* Direction, not decoration: this takes you somewhere else. */}
          <span
            aria-hidden
            className="ml-auto text-accent-deep transition-transform duration-200 group-hover/sign:-translate-y-0.5 group-hover/sign:translate-x-0.5 lg:mt-3 lg:ml-0"
          >
            ↗
          </span>

          {/* The accent edge that marks which environment this leads to. */}
          <span
            aria-hidden
            className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover/sign:w-full lg:top-0 lg:bottom-auto lg:h-full lg:w-0.5 lg:group-hover/sign:h-full"
          />
        </Link>
      ))}
    </nav>
  )
}
