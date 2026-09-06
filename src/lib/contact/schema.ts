import { z } from 'zod'
import type { Dictionary } from '@/i18n/dictionaries'
import { buildPackages, managementPlans } from '@/lib/services'

/**
 * Builds and management plans both use the name "Advanced"/"Pro", so builds are
 * suffixed " build" and plans carry their own "Management" suffix. Without that
 * the dropdown shows two options reading simply "Pro", and the enquiry email
 * cannot tell which one was picked.
 */
export const EMPLOYEES_INTEREST = 'Northbound Employees — register interest'

export const projectTypes = [
  ...buildPackages.map((pkg) => `${pkg.name} build`),
  ...managementPlans.map((plan) => plan.name),
  EMPLOYEES_INTEREST,
  'Not sure yet',
  'Something else',
] as const

/**
 * Maps the `?package=` value used by the pricing cards to the matching option
 * in this form. Built from the same data the cards render from, so a link and
 * its target option cannot drift apart.
 */
const packageParamToProjectType: Record<string, string> = {
  ...Object.fromEntries(
    buildPackages.map((pkg) => [pkg.enquiryParam, `${pkg.name} build`])
  ),
  ...Object.fromEntries(
    managementPlans.map((plan) => [plan.enquiryParam, plan.name])
  ),
}

/**
 * Resolves a `?package=` query value to a form option. Returns undefined for
 * anything unrecognised, so a hand-edited or stale URL just leaves the select
 * on its placeholder rather than preselecting something wrong.
 */
export function projectTypeFromParam(
  param: string | string[] | undefined
): string | undefined {
  if (typeof param !== 'string') return undefined
  const match = packageParamToProjectType[param]
  return match && (projectTypes as readonly string[]).includes(match)
    ? match
    : undefined
}

/**
 * Resolves `?interest=` to a form option.
 *
 * Northbound Employees are not for sale, so "register interest" cannot go to a
 * checkout or a waitlist that does not exist. It lands here instead, on the
 * working enquiry form, with the reason for writing already selected.
 */
export function interestFromParam(
  param: string | string[] | undefined
): string | undefined {
  return param === 'employees' ? EMPLOYEES_INTEREST : undefined
}

/**
 * Only asked about for a Custom build, where the price genuinely varies.
 * The packaged builds have published prices, so a budget question would be
 * asking something the visitor can already read off the page.
 */
/**
 * Budget bands. The VALUES are stable identifiers stored in the enquiry and
 * validated on the server; the visible labels come from the dictionary, so a
 * French visitor picks "Moins de 500 £" and the enquiry still records the same
 * band. Changing one of these strings changes stored data, so don't.
 */
export const budgetBands = [
  'Not sure yet',
  'Under £500',
  '£500 – £1,000',
  '£1,000 – £2,500',
  'Over £2,500',
] as const

/**
 * Validated on the server, not just in the browser. A server action is a public
 * POST endpoint, so anything the form promises has to be re-checked here.
 */
/**
 * Builds the schema with messages in the reader's language.
 *
 * The rules are identical in every locale — only the wording changes — so
 * there is one definition rather than four, and a French visitor is told what
 * is wrong in French rather than in English.
 */
export function buildContactSchema(e: Dictionary['contact']['errors']) {
  return z.object({
    name: z.string().trim().min(2, e.nameRequired).max(100, e.nameTooLong),
    email: z
      .string()
      .trim()
      .min(1, e.emailRequired)
      .max(200, e.emailTooLong)
      .email(e.emailInvalid),
    business: z.string().trim().max(120, e.businessTooLong).optional(),
    projectType: z.enum(projectTypes).optional(),
    budget: z.enum(budgetBands).optional(),
    message: z
      .string()
      .trim()
      .min(20, e.messageTooShort)
      .max(4000, e.messageTooLong),
  })
}

export type ContactInput = z.infer<ReturnType<typeof buildContactSchema>>

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  /** Field-level messages, keyed by input name. */
  errors?: Partial<Record<keyof ContactInput, string>>
}

export const initialContactState: ContactState = { status: 'idle' }
