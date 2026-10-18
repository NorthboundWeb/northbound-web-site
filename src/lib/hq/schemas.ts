import { z } from 'zod'

export const CLIENT_STATUSES = [
  'lead',
  'intake',
  'building',
  'live',
  'paused',
  'archived',
] as const
export type ClientStatus = (typeof CLIENT_STATUSES)[number]

/** Empty form fields arrive as "", which should be stored as nothing. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .optional()
    .transform((value) => value ?? null)

const optionalEmail = z
  .string()
  .trim()
  .max(254)
  .transform((value) => (value === '' ? null : value))
  .pipe(z.union([z.null(), z.email()]))
  .optional()
  .transform((value) => value ?? null)

const optionalDate = z
  .string()
  .trim()
  .transform((value) => (value === '' ? null : value))
  .pipe(z.union([z.null(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the date picker')]))
  .optional()
  .transform((value) => value ?? null)

/** Fields editable on a client's own page. */
export const clientUpdateSchema = z.object({
  name: z.string().trim().min(1, 'A name is required').max(200),
  contact_name: optionalText(200),
  contact_email: optionalEmail,
  contact_phone: optionalText(60),
  status: z.enum(CLIENT_STATUSES),
  current_website: optionalText(300),
  domain: optionalText(253),
  registrar: optionalText(120),
  domain_renewal: optionalDate,
  build_package: optionalText(60),
  management_plan: optionalText(60),
  vercel_project: optionalText(100),
  github_repo: optionalText(200),
  stripe_customer_id: z
    .string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .pipe(z.union([z.null(), z.string().regex(/^cus_[A-Za-z0-9]+$/, 'A Stripe customer ID starts with cus_')]))
    .optional()
    .transform((value) => value ?? null),
  notes: optionalText(5000),
})
export type ClientUpdate = z.infer<typeof clientUpdateSchema>

/** The intake brief. Stored as JSON on the client record. */
export const intakeSchema = z.object({
  name: z.string().trim().min(1, 'Business name is required').max(200),
  contact_name: z.string().trim().min(1, 'Contact name is required').max(200),
  contact_email: z.email('Enter a valid email address').max(254),
  contact_phone: optionalText(60),
  current_website: optionalText(300),
  domain: optionalText(253),
  build_package: optionalText(60),
  management_plan: optionalText(60),
  pages: optionalText(3000),
  goals: optionalText(3000),
  brand_assets: optionalText(1500),
  copy_status: optionalText(60),
  photos_status: optionalText(60),
  integrations: optionalText(1500),
  deadline: optionalText(200),
  notes: optionalText(5000),
})
export type Intake = z.infer<typeof intakeSchema>

export const COPY_STATUSES = [
  'Client supplies all copy',
  'Client supplies some, needs editing',
  'Needs copywriting (not in the fixed packages)',
  'Not discussed yet',
] as const

export const PHOTO_STATUSES = [
  'Client supplies photos',
  'Mixed: some client photos, some needed',
  'Needs photography or stock (not in the fixed packages)',
  'Not discussed yet',
] as const

/** Whatever the first issue is, as a single sentence for a banner. */
export function firstIssue(error: z.ZodError): string {
  const issue = error.issues[0]
  const field = String(issue?.path[0] ?? '').replace(/_/g, ' ')
  return issue ? `${field ? `${field[0].toUpperCase()}${field.slice(1)}: ` : ''}${issue.message}` : 'Check the form.'
}
