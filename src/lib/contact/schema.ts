import { z } from 'zod'
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
    id: 'jarvis',
    label: 'Jarvis Full Access',
    blurb: 'You want the advanced Jarvis capabilities switched on.',
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

export function prefillFromParams(params: {
  package?: string | string[]
  type?: string | string[]
}): { enquiryType: EnquiryTypeId; scope?: string; plan?: string } {
  const pkg = typeof params.package === 'string' ? params.package : undefined
  const type = typeof params.type === 'string' ? params.type : undefined

  if (pkg && paramToPlan[pkg]) {
    return { enquiryType: 'management', plan: paramToPlan[pkg] }
  }
  if (pkg && paramToScope[pkg]) {
    return { enquiryType: 'build', scope: paramToScope[pkg] }
  }
  if (type && (enquiryTypeIds as string[]).includes(type)) {
    return { enquiryType: type as EnquiryTypeId }
  }
  return { enquiryType: 'build' }
}
