import { z } from 'zod'
import { employees } from '@/lib/ai/employees'
import { teams } from '@/lib/ai/teams'
import { buildScopes, managementPlans } from '@/lib/services'

/**
 * The enquiry form branches on this. Each route asks only what is relevant —
 * nobody is made to answer questions about a website they do not have.
 */
export const enquiryTypes = [
  {
    id: 'build',
    label: 'A new website',
    blurb: 'You need a site built, or the one you have replaced.',
  },
  {
    id: 'management',
    label: 'Website management',
    blurb: 'You have a site and want it looked after.',
  },
  {
    id: 'help',
    label: 'Help with an existing site',
    blurb: 'Something is broken, slow, or not doing its job.',
  },
  {
    id: 'ai',
    label: 'Northbound.AI',
    blurb: 'You want an employee working on a job in your business.',
  },
  { id: 'other', label: 'Something else', blurb: 'Tell me what you need.' },
] as const

export type EnquiryTypeId = (typeof enquiryTypes)[number]['id']

export const enquiryTypeIds = enquiryTypes.map((t) => t.id) as [
  EnquiryTypeId,
  ...EnquiryTypeId[],
]

export const buildScopeOptions = [
  ...buildScopes.map((s) => s.name),
  'Not sure yet',
] as const

export const managementPlanOptions = [
  ...managementPlans.map((p) => p.name),
  'Not sure yet',
] as const

/**
 * What an early-access visitor can say they are interested in. Built from the
 * roster and the team list, so an employee added later appears here without
 * anyone remembering to update a second list.
 */
export const aiInterestOptions = [
  ...employees.map((e) => e.name),
  ...teams.map((t) => t.name),
  'Not sure yet',
] as const

export const projectSizes = [
  'Not sure yet',
  'A single page',
  'A few pages',
  'A larger site',
  'Something more involved',
] as const

/** Anything that needs a real reply is required; everything else is optional. */
export const contactSchema = z.object({
  enquiryType: z.enum(enquiryTypeIds),
  name: z.string().trim().min(2, 'Please enter your name.').max(100, 'That name is too long.'),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .max(200, 'That email address is too long.')
    .email('Please enter a valid email address.'),
  phone: z.string().trim().max(40, 'That phone number is too long.').optional(),
  business: z.string().trim().max(120, 'That is too long.').optional(),
  /** Their existing site, when they have one. Not the honeypot. */
  existingUrl: z.string().trim().max(300, 'That address is too long.').optional(),
  scope: z.enum(buildScopeOptions).optional(),
  plan: z.enum(managementPlanOptions).optional(),
  size: z.enum(projectSizes).optional(),
  unlock: z.string().trim().max(40).optional(),
  /** Which employee or team an early-access enquiry is about. */
  interest: z.enum(aiInterestOptions).optional(),
  message: z
    .string()
    .trim()
    .min(20, 'Please give me a little more detail — 20 characters or more.')
    .max(4000, 'Please keep this under 4,000 characters.'),
})

export type ContactInput = z.infer<typeof contactSchema>

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<keyof ContactInput, string>>
  /**
   * Set when delivery failed. A prefilled mailto: the visitor can click to send
   * the same enquiry themselves, so a failure never costs Northbound the lead.
   */
  fallbackMailto?: string
}

export const initialContactState: ContactState = { status: 'idle' }

/**
 * Maps ?package= / ?plan= values used across the site to the matching option,
 * derived from the same data the cards render from so links cannot drift.
 */
const paramToScope: Record<string, string> = Object.fromEntries(
  buildScopes.map((s) => [s.slug, s.name])
)
const paramToPlan: Record<string, string> = Object.fromEntries(
  managementPlans.map((p) => [p.enquiryParam, p.name])
)

/**
 * Links that existed under the previous package names, so an old bookmark or
 * an email sent last month still lands on the right thing rather than the
 * default. Mapping only preselects a dropdown — it promises nothing about
 * price.
 */
const RETIRED_PARAMS: Record<string, string> = {
  business: 'advanced',
  extended: 'pro',
  basic: 'starter',
  'basic-build': 'starter',
  'standard-build': 'advanced',
  'advanced-build': 'pro',
  'essential-management': 'pro-management',
  'advanced-management': 'pro-management',
  'complete-management': 'ultimate-management',
}

export type Prefill = {
  enquiryType: EnquiryTypeId
  scope?: string
  plan?: string
  /**
   * What was recognised, for the visible confirmation. Undefined when the
   * link carried nothing usable — an unknown ?package= must fall back
   * silently rather than confirm something that was never chosen.
   */
  confirmed?: string
}

/**
 * Reads a link's intent. Every branch is total: an unknown, misspelled or
 * missing parameter lands on the default enquiry rather than throwing or
 * confirming a package the visitor did not pick.
 */
export function prefillFromParams(params: {
  package?: string | string[]
  type?: string | string[]
}): Prefill {
  const raw = typeof params.package === 'string' ? params.package : undefined
  const pkg = raw ? (RETIRED_PARAMS[raw] ?? raw) : undefined
  const type = typeof params.type === 'string' ? params.type : undefined

  if (pkg && paramToPlan[pkg]) {
    return {
      enquiryType: 'management',
      plan: paramToPlan[pkg],
      confirmed: paramToPlan[pkg],
    }
  }
  if (pkg && paramToScope[pkg]) {
    return {
      enquiryType: 'build',
      scope: paramToScope[pkg],
      confirmed: paramToScope[pkg],
    }
  }
  // 'jarvis' was the old name for this enquiry, before Northbound.AI was a
  // division rather than one assistant. Old links still work.
  const resolvedType = type === 'jarvis' ? 'ai' : type
  if (resolvedType && (enquiryTypeIds as string[]).includes(resolvedType)) {
    return { enquiryType: resolvedType as EnquiryTypeId }
  }
  return { enquiryType: 'build' }
}
