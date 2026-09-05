/**
 * Northbound Employees — the Northbound.AI product line.
 *
 * NOTHING HERE IS AVAILABLE YET. Every worker is in development and the site
 * must say so wherever one appears. Rules before editing:
 *
 *  - `status` is the only permitted public state. There is no "available", and
 *    no worker may be presented as something a visitor can buy or deploy today.
 *  - `problem` names a situation a small-business owner recognises. `benefit`
 *    is the outcome in plain English. `tasks` are concrete examples of the work
 *    it is intended to do — examples, not a specification of shipped behaviour.
 *  - Vary the language. If every card opens "Built to help…", the page reads as
 *    filler; each entry below is written differently on purpose.
 *  - No pricing, no integration names, no customer results, no performance
 *    figures, no launch dates. None of that is settled.
 *  - This is not Jarvis. Jarvis is internal and is not the public product.
 */

export type EmployeeStatus = 'coming-soon' | 'in-development'

/** Keys into the icon map in `@/components/graphics`. */
export type EmployeeIcon =
  | 'scout'
  | 'audit'
  | 'closer'
  | 'forge'
  | 'keeper'
  | 'signal'
  | 'venture'
  | 'director'

export type Employee = {
  slug: string
  name: string
  /** The job title, in business terms. */
  role: string
  status: EmployeeStatus
  icon: EmployeeIcon
  /** The situation this worker exists to address. */
  problem: string
  /** The outcome for the owner, in one plain sentence. */
  benefit: string
  /** Three or four concrete examples of the work. */
  tasks: string[]
}

export const statusLabel: Record<EmployeeStatus, string> = {
  'coming-soon': 'Coming soon',
  'in-development': 'In development',
}

export const employees: Employee[] = [
  {
    slug: 'scout',
    name: 'Scout',
    role: 'Lead Finder',
    status: 'coming-soon',
    icon: 'scout',
    problem:
      'Finding people worth approaching is slow, and it is the first thing to get dropped when the week gets busy.',
    benefit: 'You start each week with a list of realistic prospects instead of a blank page.',
    tasks: [
      'Search for businesses matching the kind of customer you want',
      'Pull together what is publicly known about each one',
      'Filter out the ones clearly not worth your time',
      'Hand over a shortlist with a reason attached to each name',
    ],
  },
  {
    slug: 'audit',
    name: 'Audit',
    role: 'Opportunity Analyst',
    status: 'coming-soon',
    icon: 'audit',
    problem:
      'Most owners suspect something is losing them work online, but not which thing, or what it is costing.',
    benefit: 'You get a short, ranked list of what to fix first — and why it matters.',
    tasks: [
      'Review a website for the problems that lose enquiries',
      'Compare how a business shows up against others nearby',
      'Flag the pages doing the least work',
      'Rank the findings by likely impact rather than by ease',
    ],
  },
  {
    slug: 'closer',
    name: 'Closer',
    role: 'Sales Assistant',
    status: 'in-development',
    icon: 'closer',
    problem:
      'Enquiries go cold because nobody had ten minutes to follow up on the third day.',
    benefit: 'Nothing sits unanswered while you are on site or with a customer.',
    tasks: [
      'Draft replies to new enquiries for you to check and send',
      'Keep track of who is owed a follow-up and when',
      'Prepare a summary of the conversation before a call',
      'Raise the ones that need a human decision',
    ],
  },
  {
    slug: 'forge',
    name: 'Forge',
    role: 'Web Builder',
    status: 'in-development',
    icon: 'forge',
    problem:
      'Small website changes queue up for weeks because each one needs a developer.',
    benefit: 'Routine page and content work stops being a bottleneck.',
    tasks: [
      'Build out new pages from an agreed structure',
      'Turn supplied copy and images into finished sections',
      'Apply consistent changes across many pages at once',
      'Prepare the work for review before anything goes live',
    ],
  },
  {
    slug: 'keeper',
    name: 'Keeper',
    role: 'Website Manager',
    status: 'coming-soon',
    icon: 'keeper',
    problem:
      'A site quietly drifts — broken links, stale details, an out-of-date price nobody noticed.',
    benefit: 'Problems get spotted before a customer runs into them.',
    tasks: [
      'Watch for pages that break or stop loading properly',
      'Check that contact details, prices and opening hours still match reality',
      'Keep a record of what changed and when',
      'Report anything that needs a decision rather than a fix',
    ],
  },
  {
    slug: 'signal',
    name: 'Signal',
    role: 'Content and Growth',
    status: 'in-development',
    icon: 'signal',
    problem:
      'Posting consistently is the first casualty of a full diary, and the gap shows.',
    benefit: 'The business keeps showing up without you writing everything yourself.',
    tasks: [
      'Draft posts and updates in your own tone for approval',
      'Keep a schedule moving rather than posting in bursts',
      'Suggest topics from what customers actually ask about',
      'Summarise what got attention and what did not',
    ],
  },
  {
    slug: 'venture',
    name: 'Venture',
    role: 'Revenue Researcher',
    status: 'coming-soon',
    icon: 'venture',
    problem:
      'There is usually money in something the business already does — but finding it means research nobody has time for.',
    benefit: 'You see options for earning more from what you already have.',
    tasks: [
      'Research what comparable businesses charge for',
      'Look for services worth adding to the existing offer',
      'Estimate what a change would mean in practice',
      'Set the options out plainly so you can choose',
    ],
  },
]

/**
 * Director coordinates the workforce. It is deliberately not one of the seven
 * workers — it is the layer above them — so it is presented separately and
 * never occupies a worker card.
 */
export const director = {
  name: 'Director',
  role: 'Coordination layer',
  status: 'in-development' as EmployeeStatus,
  icon: 'director' as EmployeeIcon,
  summary:
    'The part that decides which employee picks up what, keeps them working to the same brief, and puts anything consequential in front of a person before it happens.',
} as const

/**
 * The public status of the whole division, stated once. Every "coming soon"
 * badge and interest link on the site derives from this.
 */
export const AI_PUBLIC_STATUS = {
  available: false,
  label: 'Coming soon',
  /**
   * There is no waitlist system, so interest is routed to the existing,
   * working enquiry form with the reason preselected — rather than to a signup
   * that quietly does nothing.
   */
  interestHref: '/contact?interest=employees',
  headline: 'Northbound Employees are coming soon.',
  body: 'AI-powered digital workers designed around actual business jobs — not another generic chatbot.',
} as const
