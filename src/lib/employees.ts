/**
 * Northbound Employees — the Northbound.AI product line.
 *
 * NOTHING HERE IS AVAILABLE YET. Every employee is a concept in development
 * and the site must say so wherever one appears. Read these rules before
 * editing anything below:
 *
 *  - `status` is the only permitted public state. There is no "available",
 *    and no employee may be presented as something a visitor can buy, hire or
 *    activate today.
 *  - `benefits` describe what an employee is *intended* to help with, in
 *    business language. They are not claims about implemented behaviour.
 *  - No pricing, no integration names, no customer results, no performance
 *    figures. None of that has been built or agreed, so none of it goes here.
 *  - This is not Jarvis. Jarvis is internal and is not the public product.
 */

export type EmployeeStatus = 'coming-soon' | 'in-development'

export type Employee = {
  slug: string
  /** The employee's name, shown in display type. */
  name: string
  /** The job, not the technology — "Prospecting employee", not "LLM agent". */
  role: string
  status: EmployeeStatus
  /** One sentence on the business problem it is being built to help with. */
  summary: string
  /** Intended benefits. Framed as intent, never as delivered capability. */
  benefits: string[]
}

export const statusLabel: Record<EmployeeStatus, string> = {
  'coming-soon': 'Coming soon',
  'in-development': 'In development',
}

export const employees: Employee[] = [
  {
    slug: 'scout',
    name: 'Scout',
    role: 'Prospecting employee',
    status: 'coming-soon',
    summary:
      'Built to help businesses find potential customers worth contacting.',
    benefits: [
      'Find suitable prospects',
      'Research businesses',
      'Organise opportunities',
    ],
  },
  {
    slug: 'closer',
    name: 'Closer',
    role: 'Outreach employee',
    status: 'coming-soon',
    summary:
      'Built to help businesses follow up properly instead of letting enquiries go cold.',
    benefits: [
      'Draft outreach for review',
      'Keep track of follow-ups',
      'Surface conversations that need a person',
    ],
  },
  {
    slug: 'signal',
    name: 'Signal',
    role: 'Marketing employee',
    status: 'in-development',
    summary:
      'Built to take the routine end of marketing work off a busy owner’s desk.',
    benefits: [
      'Prepare content drafts',
      'Keep a posting schedule moving',
      'Summarise what is landing',
    ],
  },
  {
    slug: 'rank',
    name: 'Rank',
    role: 'Search employee',
    status: 'in-development',
    summary:
      'Built to help businesses stay findable without needing to learn SEO.',
    benefits: [
      'Spot search issues worth fixing',
      'Suggest page and content changes',
      'Track visibility over time',
    ],
  },
  {
    slug: 'keeper',
    name: 'Keeper',
    role: 'Customer and admin employee',
    status: 'coming-soon',
    summary:
      'Built to handle the repetitive admin that fills a working day.',
    benefits: [
      'Handle routine enquiries',
      'Keep records tidy',
      'Prepare the things a person has to sign off',
    ],
  },
  {
    slug: 'watch',
    name: 'Watch',
    role: 'Monitoring employee',
    status: 'in-development',
    summary:
      'Built to notice when something needs attention before a customer does.',
    benefits: [
      'Keep an eye on what matters',
      'Flag problems early',
      'Report in plain language',
    ],
  },
]

/**
 * The public status of the whole division, stated once. Every "coming soon"
 * badge, disabled CTA and waitlist link on the site derives from this.
 */
export const AI_PUBLIC_STATUS = {
  available: false,
  label: 'Coming soon',
  /**
   * Where "register interest" goes. There is no waitlist system, so interest
   * is routed to the existing, working contact form with the enquiry
   * preselected — rather than to a signup that quietly does nothing.
   */
  interestHref: '/contact?interest=employees',
  headline: 'Northbound Employees are coming soon.',
  body: 'AI-powered digital workers designed around actual business jobs — not another generic chatbot.',
} as const
