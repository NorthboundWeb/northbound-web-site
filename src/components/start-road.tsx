import { Container } from '@/components/ui'

export const ROUTE = [
  { code: 'J1', label: 'Your business' },
  { code: 'J2', label: 'Your lane' },
  { code: 'J3', label: 'What it needs' },
  { code: 'J4', label: 'Your details' },
  { code: 'END', label: 'Arrive' },
] as const

/** Where the car stops for each step, as a percentage of the road's width. */
export function carAt(step: number) {
  return 10 + Math.min(step, ROUTE.length - 1) * 20
}

/**
 * The road along the bottom of the Start flow, with a car as the progress
 * indicator. It sticks to the bottom of the viewport while the flow is on
 * screen and comes to rest at the bottom of the flow, so it never sits on top
 * of the footer.
 *
 * Presentational only: the flow owns the step. Positions are set with `left`
 * and negative-width flex centring rather than transforms, so they stay put
 * when reduced motion removes transforms.
 */
export function StartRoad({
  step,
  motion,
  signTop,
  signSub,
}: {
  step: number
  /** Set while the car is driving between two stops. */
  motion: { rev: boolean } | null
  /** The price sign shown on narrow screens, where there is no summary panel. */
  signTop: string
  signSub: string
}) {
  const here = Math.min(step, ROUTE.length - 1)
  return (
    <div className="nb-road mt-16">
      <Container>
        <div className="flex items-end gap-4">
          <div className="nb-carriage min-w-0 flex-1">
            <div className="nb-surface" aria-hidden />
            <ol className="nb-stops" aria-label="Your progress">
              {ROUTE.map((stop, i) => (
                <li
                  key={stop.code}
                  aria-current={i === here ? 'step' : undefined}
                  data-state={i < step ? 'done' : i === here ? 'here' : 'next'}
                  style={{ left: `${10 + i * 20}%` }}
                >
                  <span className="nb-post" aria-hidden />
                  <span className="nb-plate">{stop.code}</span>
                  <span className="nb-stop-label">{stop.label}</span>
                </li>
              ))}
            </ol>
            <div
              className="nb-car"
              aria-hidden
              data-moving={motion ? 'true' : undefined}
              data-rev={motion?.rev ? 'true' : undefined}
              style={{ left: `${carAt(step)}%` }}
            >
              <svg viewBox="0 0 60 28" width="60" height="28">
                <path
                  d="M3 20V14q0-3 3-3h9l6-7q1-1 3-1h15q2 0 3 1l5 7h8q3 0 3 3v6z"
                  style={{ fill: 'var(--orange)' }}
                />
                <path
                  d="M16 11l5-6h9v6zM32 5h7l4.5 6H32z"
                  style={{ fill: 'var(--green)' }}
                  opacity=".85"
                />
                <rect x="55" y="13" width="3" height="3" rx="1" style={{ fill: 'var(--cream)' }} />
                <rect x="2.5" y="13" width="2.5" height="3" rx="1" style={{ fill: '#c4361a' }} />
                {[14, 46].map((cx) => (
                  <g key={cx} className="nb-wheel">
                    <circle cx={cx} cy="21" r="5.5" fill="#0a1a16" stroke="#8a9a92" strokeWidth="1.5" />
                    <path d={`M${cx} 17v8M${cx - 4} 21h8`} stroke="#9aa9a1" strokeWidth="1.5" />
                    <circle cx={cx} cy="21" r="1.6" fill="#d9ddd6" />
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="nb-sign lg:hidden" aria-hidden>
            <div className="nb-sign-top">{signTop}</div>
            <div className="nb-sign-sub">{signSub}</div>
          </div>
        </div>
      </Container>
    </div>
  )
}
