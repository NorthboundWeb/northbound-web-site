import { employees } from './employees'
import { teams } from './teams'

/**
 * "What do you need help with?"
 *
 * The entry point for someone who knows the problem but not the product. Each
 * outcome maps to the employees that address it and, where one exists, the
 * team built around it.
 *
 * The mapping is by slug and validated by the helpers below, so an outcome
 * cannot quietly point at an employee that has been renamed or removed.
 */

export type Outcome = {
  slug: string
  /** Phrased as the customer would say it, out loud. */
  label: string
  detail: string
  employees: string[]
  team?: string
}

export const outcomes: Outcome[] = [
  {
    slug: 'more-customers',
    label: 'Get more customers',
    detail: 'Find businesses worth approaching, and actually approach them.',
    employees: ['scout', 'closer'],
    team: 'sales-engine',
  },
  {
    slug: 'market-my-business',
    label: 'Market my business',
    detail: 'Have something worth saying, ready before you need it.',
    employees: ['signal'],
    team: 'content-engine',
  },
  {
    slug: 'get-found',
    label: 'Get found online',
    detail: 'Turn up when someone searches for what you sell.',
    employees: ['rank'],
    team: 'content-engine',
  },
  {
    slug: 'handle-admin',
    label: 'Handle the admin',
    detail: 'Stop losing the afternoon to the inbox.',
    employees: ['keeper'],
    team: 'customer-engine',
  },
  {
    slug: 'look-after-customers',
    label: 'Look after customers',
    detail: 'Answer quickly, follow up, and let nothing sit unanswered.',
    employees: ['keeper', 'closer'],
    team: 'customer-engine',
  },
  {
    slug: 'monitor-my-business',
    label: 'Watch over the business',
    detail: 'Know when something breaks before a customer tells you.',
    employees: ['watch'],
    team: 'website-growth',
  },
]

/**
 * Guards the mapping at module load. A typo here would silently render an
 * outcome with no employees, which is worse than a build failure.
 */
const employeeSlugs = new Set(employees.map((e) => e.slug))
const teamSlugs = new Set(teams.map((t) => t.slug))

for (const outcome of outcomes) {
  for (const slug of outcome.employees) {
    if (!employeeSlugs.has(slug)) {
      throw new Error(`Outcome "${outcome.slug}" names unknown employee "${slug}".`)
    }
  }
  if (outcome.team && !teamSlugs.has(outcome.team)) {
    throw new Error(`Outcome "${outcome.slug}" names unknown team "${outcome.team}".`)
  }
}
