/**
 * Northbound Employees — the Northbound.AI product line, STRUCTURALLY.
 *
 * NOTHING HERE IS AVAILABLE YET. Every worker is in development and the site
 * must say so wherever one appears.
 *
 * Names, icons and status live here; the role, the problem it addresses, the
 * benefit and the example tasks live in the dictionaries keyed by these slugs,
 * so they translate without touching a component. Names are NOT translated —
 * Scout is Scout in every language.
 *
 * Rules for the copy in the dictionaries:
 *  - No pricing, no integration names, no customer results, no performance
 *    figures, no launch dates. None of that is settled.
 *  - Vary the language between cards. If every one opens the same way the page
 *    reads as filler.
 *  - This is not Jarvis. Jarvis is internal and is not the public product.
 */

export type EmployeeStatus = 'coming-soon' | 'in-development'

export type EmployeeSlug =
  | 'scout'
  | 'audit'
  | 'closer'
  | 'forge'
  | 'keeper'
  | 'signal'
  | 'venture'

export type Employee = {
  slug: EmployeeSlug
  /** A product name — identical in every language. */
  name: string
  status: EmployeeStatus
  /** Key into the icon map in `@/components/graphics`. */
  icon: EmployeeSlug
}

export const employees: Employee[] = [
  { slug: 'scout', name: 'Scout', status: 'coming-soon', icon: 'scout' },
  { slug: 'audit', name: 'Audit', status: 'coming-soon', icon: 'audit' },
  { slug: 'closer', name: 'Closer', status: 'in-development', icon: 'closer' },
  { slug: 'forge', name: 'Forge', status: 'in-development', icon: 'forge' },
  { slug: 'keeper', name: 'Keeper', status: 'coming-soon', icon: 'keeper' },
  { slug: 'signal', name: 'Signal', status: 'in-development', icon: 'signal' },
  { slug: 'venture', name: 'Venture', status: 'coming-soon', icon: 'venture' },
]

/**
 * Director coordinates the workforce. It is deliberately not one of the seven
 * workers — it is the layer above them — so it is presented separately and
 * never occupies a worker card.
 */
export const director = {
  name: 'Director',
  status: 'in-development' as EmployeeStatus,
  icon: 'director' as const,
} as const

/** The public status of the whole division, stated once. */
export const AI_PUBLIC_STATUS = {
  available: false,
  /**
   * There is no waitlist system, so interest is routed to the existing,
   * working enquiry form with the reason preselected — rather than to a signup
   * that quietly does nothing.
   */
  interestPath: '/contact',
  interestQuery: 'interest=employees',
} as const
