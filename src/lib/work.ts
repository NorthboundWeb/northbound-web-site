/**
 * The public portfolio.
 *
 * HONESTY RULES — read before adding anything:
 *  - Never list a business as a client without a real, agreed engagement.
 *  - Anything that is not paid client work carries a `kind` that says so, and
 *    that badge renders wherever the project appears.
 *  - No invented metrics, testimonials, conversion improvements or revenue
 *    results. "What was built" is a description of work, never an outcome
 *    claim.
 *  - `href` is set only where the site is genuinely live and public.
 *  - `shots` are real screenshots committed to /public. A project without one
 *    renders the drawn plate instead; it never renders a fake browser mock-up.
 *
 * The approved mockup showed three portfolio tiles with company names against
 * them. Those companies are not Northbound clients, so they are not here.
 */
export type WorkKind = 'client' | 'demo' | 'internal' | 'concept'

export const workKindLabel: Record<WorkKind, string> = {
  client: 'Client project',
  demo: 'Demo project',
  internal: 'Internal project',
  concept: 'Concept',
}

export type WorkShot = {
  /** Path under /public. */
  src: string
  /** Describes what the screenshot shows — it carries content, so it needs alt. */
  alt: string
  width: number
  height: number
}

/** Keys into `t.work.projects`. Adding a project means adding both. */
export type WorkSlug = 'northbound'

export type WorkItem = {
  slug: WorkSlug
  title: string
  kind: WorkKind
  /** Real screenshots, when they exist. */
  shots?: { desktop?: WorkShot; mobile?: WorkShot }
  /** Only where the site is genuinely live and public. */
  href?: string
}

export const work: WorkItem[] = [
  {
    slug: 'northbound',
    title: 'Northbound',
    kind: 'internal',
  },
]

/**
 * Assets still needed before the portfolio is launch-ready.
 *
 * Kept in code rather than in a note somewhere, because the page reads from it
 * and the gap stays visible until it is filled.
 */
export const PORTFOLIO_GAP = {
  haveCount: work.length,
  targetCount: 3,
  needed: [
    'Permission to name any real client project publicly',
    'Desktop and mobile screenshots for each project (1440px and 390px wide)',
    'A one-line brief and a short list of what was built, per project',
    'A live URL for any project that is public',
  ],
} as const
