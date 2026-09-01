/**
 * NORTHBOUND EMPLOYEES — the roster.
 *
 * An employee is a specialist hired for one job. It has a role, a remit, and
 * a boundary, the way a real hire would. It is not a chatbot and it is not a
 * model: a customer should never need to think about what is underneath.
 *
 * RULES — read before adding or editing an entry:
 *
 * 1. `status` is the honesty mechanism, and it is the only thing that
 *    licenses a claim. Only 'live' may be described as something a business
 *    can use today. Nothing is 'live' yet, and nothing becomes 'live' here
 *    until it is working in production.
 * 2. `does` is what the employee produces, in the customer's words. Three
 *    lines, outcome first. No model names, no "agentic", no "powered by".
 * 3. No prices. Northbound.AI is not on sale, and a price would imply a
 *    product that can be bought today.
 * 4. Adding employee 007 is one entry in this array. Every page — the roster,
 *    the detail pages, the teams, the outcome picker — renders from here, so
 *    nothing else needs touching.
 */

export type EmployeeStatus = 'live' | 'preview' | 'building' | 'planned'

/** What a customer is allowed to be told, per status. */
export const STATUS_LABEL: Record<EmployeeStatus, string> = {
  live: 'Available',
  preview: 'Early access',
  building: 'In development',
  planned: 'Planned',
}

export const STATUS_NOTE: Record<EmployeeStatus, string> = {
  live: 'Working today. Get in touch and we will set it up.',
  preview: 'Working with a small number of businesses. Ask to be one of them.',
  building: 'Being built now. Register interest and you will hear first.',
  planned: 'Designed, not yet built. Tell us if you need it and it moves up.',
}

export type Employee = {
  slug: string
  /** Zero-padded identifier. Employees are numbered as they are designed. */
  number: string
  /** The name a customer uses. */
  name: string
  /** The job title. */
  role: string
  /** The one line that answers "what is this for?". */
  purpose: string
  /** The pitch, written to the business owner rather than about the tech. */
  pitch: string
  /** Exactly three, outcome-first. This is the "three clear benefits". */
  does: string[]
  /** The boundary. What it explicitly does not decide or send on its own. */
  boundary: string
  /** The CSS custom property carrying this employee's identity colour. */
  colourVar: string
  status: EmployeeStatus
}

export const employees: Employee[] = [
  {
    slug: 'scout',
    number: '001',
    name: 'Scout',
    role: 'Prospecting',
    purpose: 'Find businesses worth contacting.',
    pitch:
      'Scout looks for the businesses that match the customers you already do your best work for, and gathers what you need to know before you get in touch.',
    does: [
      'Finds businesses matching your target customer',
      'Researches the details worth knowing before you approach',
      'Builds organised prospect lists you can work through',
    ],
    boundary:
      'Scout builds the list. It never contacts anyone — that is your call, or Closer’s once you approve it.',
    colourVar: '--emp-scout',
    status: 'building',
  },
  {
    slug: 'closer',
    number: '002',
    name: 'Closer',
    role: 'Outreach',
    purpose: 'Turn prospects into conversations.',
    pitch:
      'Closer writes the first approach and the follow-ups you keep meaning to send, using what Scout found so each one reads like it was written for that business.',
    does: [
      'Prepares outreach written for the business, not a mail merge',
      'Drafts the follow-ups that usually never get sent',
      'Surfaces who replied and what they said',
    ],
    boundary:
      'Every message waits for you to approve it. Closer never sends on your behalf unless you have said it can.',
    colourVar: '--emp-closer',
    status: 'building',
  },
  {
    slug: 'signal',
    number: '003',
    name: 'Signal',
    role: 'Marketing',
    purpose: 'Keep the business visible.',
    pitch:
      'Signal keeps a running supply of things worth saying, so the weeks you are too busy to post are not the weeks you disappear.',
    does: [
      'Suggests content and campaign ideas built on what you actually do',
      'Plans posts ahead so a busy week does not become a silent one',
      'Flags the moments worth marketing around',
    ],
    boundary:
      'Signal drafts and plans. Nothing is published anywhere until you have read it and said yes.',
    colourVar: '--emp-signal',
    status: 'planned',
  },
  {
    slug: 'rank',
    number: '004',
    name: 'Rank',
    role: 'Search',
    purpose: 'Help customers find you.',
    pitch:
      'Rank looks at how people search for what you sell, and tells you which pages to write, fix or leave alone — in the order that is worth the effort.',
    does: [
      'Finds the searches you could realistically win',
      'Says which pages to write and which to improve first',
      'Reports what changed after you did it',
    ],
    boundary:
      'Rank recommends and measures. Work that needs building is quoted and done by Northbound.Web.',
    colourVar: '--emp-rank',
    status: 'planned',
  },
  {
    slug: 'keeper',
    number: '005',
    name: 'Keeper',
    role: 'Customers and admin',
    purpose: 'Stay on top of the inbox.',
    pitch:
      'Keeper handles the questions you answer forty times a month, drafts the replies that need you, and tells you what is still waiting.',
    does: [
      'Answers common questions from your real prices, hours and policies',
      'Drafts the replies that need a human, ready for you to send',
      'Sorts incoming requests and flags what needs you today',
    ],
    boundary:
      'Keeper hands over the moment a question needs judgement. It never invents an answer it cannot source.',
    colourVar: '--emp-keeper',
    status: 'planned',
  },
  {
    slug: 'watch',
    number: '006',
    name: 'Watch',
    role: 'Monitoring',
    purpose: 'Notice before your customers do.',
    pitch:
      'Watch keeps an eye on the things that quietly break — the form that stopped sending, the page that got slow — and tells you while it is still a small problem.',
    does: [
      'Checks your website is up, fast and still working',
      'Spots the changes that matter and ignores the ones that do not',
      'Tells you what needs attention, and what can wait',
    ],
    boundary:
      'Watch reports. It does not change your website — repairs are agreed with you first.',
    colourVar: '--emp-watch',
    status: 'planned',
  },
]

export function employeeBySlug(slug: string): Employee | undefined {
  return employees.find((e) => e.slug === slug)
}

/** Anything real first, so the roster never buries a working employee. */
const RANK: Record<EmployeeStatus, number> = {
  live: 0,
  preview: 1,
  building: 2,
  planned: 3,
}

export const employeesByReadiness = [...employees].sort(
  (a, b) => RANK[a.status] - RANK[b.status]
)

/** True while nothing is purchasable — which gates every CTA on the AI side. */
export const anyEmployeeLive = employees.some((e) => e.status === 'live')

export const AI_STATUS_NOTE =
  'Northbound.AI is in development. Nothing here is on sale yet, and no employee is described as working before it is. Early access is how the first businesses get involved.'
