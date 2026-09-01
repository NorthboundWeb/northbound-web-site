import { cn } from '@/components/ui'

/**
 * How work moves through a team, as a customer would describe it.
 *
 * Steps, then the result. Deliberately not an architecture diagram: nobody
 * buying this cares which service calls which. On a phone it runs down the
 * screen; from sm up it runs across.
 */
export function TeamFlow({
  steps,
  className,
}: {
  steps: string[]
  className?: string
}) {
  return (
    <ol
      className={cn(
        'flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3',
        className
      )}
    >
      {steps.map((step, i) => {
        const last = i === steps.length - 1
        return (
          <li
            key={step}
            className="flex items-center gap-3 sm:gap-3"
          >
            <span
              className={cn(
                'label whitespace-nowrap border px-3 py-2',
                last
                  ? 'border-accent bg-accent text-accent-ink'
                  : 'border-line text-ink'
              )}
            >
              {step}
            </span>
            {!last ? (
              <span
                aria-hidden
                className="text-accent sm:mr-0"
              >
                {/* Down the screen on a phone, across it on a wider one. */}
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 rotate-90 sm:rotate-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 8h11M9 4l4 4-4 4" />
                </svg>
              </span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
