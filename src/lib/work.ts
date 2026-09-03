/**
 * The public portfolio.
 *
 * HONESTY RULES — read before adding anything:
 *  - Never list a business as a client without a real, agreed engagement.
 *  - Anything that is not paid client work carries a `kind` that says so, and
 *    that badge is rendered wherever the project appears.
 *  - No invented metrics, results, testimonials or launch dates.
 *
 * The approved mockup showed three portfolio tiles with company names against
 * them. Those companies are not Northbound clients, so they are not here. The
 * grid renders whatever is in this array and fills the remaining slots with an
 * honest placeholder rather than padding it with fiction.
 */
export type WorkKind = 'client' | 'concept' | 'demo' | 'experiment' | 'internal'

export const workKindLabel: Record<WorkKind, string> = {
  client: 'Client project',
  concept: 'Concept',
  demo: 'Demo',
  experiment: 'Experiment',
  internal: 'Internal project',
}

export type WorkItem = {
  slug: string
  title: string
  /** What kind of site it is — shown under the title. */
  category: string
  kind: WorkKind
  summary: string
  /** Only set where the site is genuinely public and live. */
  href?: string
}

export const work: WorkItem[] = [
  {
    slug: 'northbound',
    title: 'Northbound',
    category: 'Brand and marketing site',
    kind: 'internal',
    summary:
      'This site. Static-rendered, served from the edge, built to the same accessibility and performance standards as client work.',
  },
]

/** Shown wherever the portfolio is thin, in place of invented projects. */
export const WORK_PLACEHOLDER = {
  title: 'More work in progress',
  body: 'Recent client sites are shared on request — some are under wraps until launch.',
  cta: 'Ask to see examples',
  href: '/contact',
} as const
