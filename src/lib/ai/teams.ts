import { employeeBySlug, type Employee, type EmployeeStatus } from './employees'

/**
 * NORTHBOUND TEAMS — employees combined around an outcome.
 *
 * Most businesses know what they want to happen. Far fewer know which
 * specialist does it. A team is the answer to "I need more customers" rather
 * than "I need a prospecting tool".
 *
 * A team is defined by the employees in it, so its status is derived rather
 * than declared: a team can never claim to be further along than its least
 * ready member. That makes it impossible to advertise a working team built
 * out of employees that do not exist.
 */

export type Team = {
  slug: string
  number: string
  name: string
  /** The outcome, in the customer's words. */
  outcome: string
  pitch: string
  /** Employee slugs, in the order the work flows through them. */
  members: string[]
  /** The flow, as a customer would describe it. Ends in the result. */
  flow: string[]
  /** What you get back, week to week. */
  delivers: string[]
  /** Set when the team hands work to the other division. */
  handoff?: string
}

export const teams: Team[] = [
  {
    slug: 'sales-engine',
    number: '01',
    name: 'Sales Engine',
    outcome: 'Get more customers.',
    pitch:
      'Finding people to talk to, and actually talking to them, is the job that slips first when you are busy doing the work. This is the pair that keeps it moving.',
    members: ['scout', 'closer'],
    flow: ['Find', 'Research', 'Approach', 'Follow up', 'Conversation'],
    delivers: [
      'A working list of businesses worth approaching',
      'Outreach drafted and waiting for your approval',
      'Follow-ups that happen instead of being forgotten',
      'A clear view of who replied',
    ],
  },
  {
    slug: 'content-engine',
    number: '02',
    name: 'Content Engine',
    outcome: 'Get found and stay visible.',
    pitch:
      'Being good at the job is not the same as being findable. This pair works out what is worth saying and where saying it will actually be seen.',
    members: ['signal', 'rank'],
    flow: ['Spot', 'Plan', 'Prepare', 'Publish', 'Measure'],
    delivers: [
      'A plan of what to post and write, and why',
      'Draft content built on what you really do',
      'The search opportunities worth the effort, in order',
      'What changed after you did it',
    ],
  },
  {
    slug: 'customer-engine',
    number: '03',
    name: 'Customer Engine',
    outcome: 'Keep on top of customers.',
    pitch:
      'The enquiries you have not answered are the ones costing you money. This pair keeps the inbox moving and tells you what is still open.',
    members: ['keeper', 'watch'],
    flow: ['Receive', 'Sort', 'Draft', 'Follow up', 'Flag'],
    delivers: [
      'Common questions answered from your real information',
      'Replies drafted for the ones that need you',
      'Nothing sitting unanswered without you knowing',
      'An alert when something needs attention today',
    ],
  },
  {
    slug: 'website-growth',
    number: '04',
    name: 'Website Growth',
    outcome: 'Make the website earn its keep.',
    pitch:
      'A website is not finished at launch. This team watches how yours performs, finds what is holding it back, and sends the real build work to the people who built it.',
    members: ['rank', 'watch'],
    flow: ['Monitor', 'Diagnose', 'Prioritise', 'Improve', 'Verify'],
    delivers: [
      'Continuous checks that the site is up and fast',
      'The problems and opportunities worth acting on',
      'Improvements you can make yourself, spelled out',
      'Development work scoped and quoted, never assumed',
    ],
    handoff:
      'Work that needs building goes to Northbound.Web and is quoted before anything starts.',
  },
]

export function teamBySlug(slug: string): Team | undefined {
  return teams.find((t) => t.slug === slug)
}

export function teamMembers(team: Team): Employee[] {
  return team.members
    .map(employeeBySlug)
    .filter((e): e is Employee => Boolean(e))
}

/**
 * A team is only as ready as its least ready member — derived, never
 * declared, so a team cannot advertise itself past its own parts.
 */
const RANK: Record<EmployeeStatus, number> = {
  live: 0,
  preview: 1,
  building: 2,
  planned: 3,
}

export function teamStatus(team: Team): EmployeeStatus {
  const members = teamMembers(team)
  if (!members.length) return 'planned'
  return members.reduce<EmployeeStatus>(
    (worst, m) => (RANK[m.status] > RANK[worst] ? m.status : worst),
    members[0].status
  )
}
