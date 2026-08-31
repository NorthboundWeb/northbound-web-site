/**
 * Northbound.AI — the AI employees.
 *
 * The idea: an AI employee does one job in a business properly, end to end,
 * rather than being a chat window that answers whatever you type. Each one
 * gets a role, a remit and a boundary, the way a real hire would.
 *
 * RULES:
 *
 * 1. `state` is the whole honesty mechanism. Only 'live' may be described as
 *    something a customer can use today, and nothing is 'live' until it
 *    actually is. Everything here is currently in development or planned.
 * 2. No public pricing. Northbound.AI is not on sale, and inventing a number
 *    would be inventing a product.
 * 3. Adding an employee is one entry in this array. That is the point of the
 *    file — the page renders whatever is here, so the division can grow
 *    without a rebuild.
 */

export type EmployeeState = 'live' | 'building' | 'planned'

export const EMPLOYEE_STATE_LABEL: Record<EmployeeState, string> = {
  live: 'Available',
  building: 'In development',
  planned: 'Planned',
}

export type AiEmployee = {
  slug: string
  /** The job title, as you would advertise the role. */
  role: string
  /** One line: what this employee is responsible for. */
  remit: string
  /** What it actually does, in the order it would do it. */
  duties: string[]
  state: EmployeeState
}

export const aiEmployees: AiEmployee[] = [
  {
    slug: 'assistant',
    role: 'The Assistant',
    remit:
      'Reads your inbox, calendar and tools before you do, and tells you what genuinely needs you today.',
    duties: [
      'Pulls together a morning brief from your calendar, inbox and deployments',
      'Uses the tools your business already runs on rather than asking you to copy things across',
      'Asks before it sends, creates or deletes anything',
      'Runs recurring jobs on a schedule without you opening anything',
    ],
    state: 'building',
  },
  {
    slug: 'auditor',
    role: 'The Auditor',
    remit:
      'Looks at a website the way a customer and a search engine both would, and writes down what is wrong.',
    duties: [
      'Checks speed, mobile behaviour, broken links and missing basics',
      'Flags the pages losing enquiries, not just the pages scoring badly',
      'Produces a plain-English report with the fixes ordered by what they are worth',
    ],
    state: 'planned',
  },
  {
    slug: 'prospector',
    role: 'The Prospector',
    remit:
      'Finds businesses that fit what you do, and gathers what you need to approach them properly.',
    duties: [
      'Builds a list against criteria you set rather than scraping indiscriminately',
      'Gathers the public context that makes an approach relevant',
      'Hands you the list to approve — it never contacts anyone on its own',
    ],
    state: 'planned',
  },
  {
    slug: 'correspondent',
    role: 'The Correspondent',
    remit:
      'Drafts the outreach and the replies you keep meaning to write, in your words rather than a template.',
    duties: [
      'Drafts first contact and follow-ups from real context, not mail-merge fields',
      'Keeps a thread consistent so nobody gets the same message twice',
      'Every message waits for you to approve it before it goes anywhere',
    ],
    state: 'planned',
  },
  {
    slug: 'front-desk',
    role: 'The Front Desk',
    remit:
      'Answers the questions customers ask over and over, and knows when to stop and fetch a human.',
    duties: [
      'Answers from your actual pricing, hours and policies rather than guessing',
      'Hands over to you the moment a question needs judgement or a decision',
      'Tells you what people keep asking, which is usually a page you need to write',
    ],
    state: 'planned',
  },
  {
    slug: 'administrator',
    role: 'The Administrator',
    remit:
      'Does the filing, chasing and tidying that quietly eats an afternoon a week.',
    duties: [
      'Keeps records, folders and trackers in order rather than in a pile',
      'Chases the things that need chasing and reports what came back',
      'Flags what has gone stale instead of waiting to be asked',
    ],
    state: 'planned',
  },
]

/** Sorted so anything real appears first — the page never buries a live one. */
export const employeesByReadiness = [...aiEmployees].sort((a, b) => {
  const rank: Record<EmployeeState, number> = { live: 0, building: 1, planned: 2 }
  return rank[a.state] - rank[b.state]
})

export const AI_STATUS_NOTE =
  'Northbound.AI is in development. Nothing here is on sale yet, and no employee is described as working before it is. The Assistant is furthest along and is in private preview as Jarvis.'
