/**
 * The "Book a call" flow: a short, Averlo-style set of questions that ends in
 * a preferred call time. Shared by the browser (so each step is checked as
 * you go) and the server action (which checks everything again, because a
 * server action is a public POST endpoint).
 *
 * Nothing here quotes a price the services page does not. The budget bands
 * exist to size the conversation, not to set a figure — the fixed packages
 * are still what the visitor pays.
 *
 * There is no live calendar: the visitor states a preferred slot and Che
 * confirms it by email. The copy says so, and the slots are deliberately
 * described as "preferred", never "booked", until a human has replied.
 */

import { ADVANCED_MANAGEMENT_PRICE, buildPackages } from '@/lib/services'

export const helpOptions = [
  'Build a new website',
  'Redesign my website',
  'Landing page',
  'Online booking or shop',
  'Monthly website care',
  'Something else',
] as const

const pro = buildPackages.find((pkg) => pkg.slug === 'pro')?.price ?? 249

/**
 * Low on purpose: most Northbound work sits at the bottom two bands. The top
 * band is open-ended so nobody is boxed in, but no band promises a package or
 * a price — those are fixed and published on /services.
 */
export const bookingBudgets = [
  {
    id: `around-${pro}`,
    label: `Around £${pro}`,
    note: 'A focused site or a single landing page.',
  },
  {
    id: '250-500',
    label: '£250 – £500',
    note: 'A multi-page site with the essentials done properly.',
  },
  {
    id: '500-1000',
    label: '£500 – £1,000',
    note: 'More pages, bookings or a shop, extra features.',
  },
  {
    id: '1000-plus',
    label: '£1,000+',
    note: 'A bigger build or a web app, scoped on the call.',
  },
  {
    id: 'unsure',
    label: 'Not sure yet',
    note: 'No problem. I will suggest what fits after we talk.',
  },
] as const

export type BudgetId = (typeof bookingBudgets)[number]['id']

export const planOptions = ['Yes, tell me more', 'Maybe', 'One-off build only'] as const

export const timelineOptions = [
  'As soon as possible',
  'Within a month',
  '1–3 months',
  'Just exploring',
] as const

/** Preferred call times, UK local time. Che confirms or offers another. */
export const slotOptions = ['09:30', '11:00', '13:30', '15:00', '17:30', '19:00'] as const

/** How far ahead a preferred day may be. */
export const DAYS_AHEAD = 30

export const PLAN_NOTE = `Hosting, edits and support for a set monthly fee, from £${ADVANCED_MANAGEMENT_PRICE} a month. Optional, and the first month is free.`

export type BookingInput = {
  help: string[]
  other: string
  budget: string
  plan: string
  timeline: string
  name: string
  business: string
  email: string
  phone: string
  site: string
  /** ISO date, YYYY-MM-DD, in UK local time. */
  day: string
  slot: string
}

export const emptyBooking: BookingInput = {
  help: [],
  other: '',
  budget: '',
  plan: '',
  timeline: '',
  name: '',
  business: '',
  email: '',
  phone: '',
  site: '',
  day: '',
  slot: '',
}

export type BookingField = keyof BookingInput
export type BookingErrors = Partial<Record<BookingField, string>>

/** Same rule the Apps Script inbox applies, so nothing passes here and fails there. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The step each field is asked on, so an error can send you back to it. */
export const stepOfField: Record<BookingField, number> = {
  help: 0,
  other: 0,
  budget: 1,
  plan: 1,
  timeline: 2,
  name: 3,
  business: 3,
  email: 3,
  phone: 3,
  site: 3,
  day: 4,
  slot: 4,
}

export const STEP_COUNT = 5

const pad = (n: number) => String(n).padStart(2, '0')

/** YYYY-MM-DD for a Date, in the machine's local zone (UK on Vercel's London region or the visitor's browser). */
export function isoDay(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * The next `count` weekdays, starting tomorrow. Built the same way in the
 * browser (to draw the picker) and on the server (to check the choice), so a
 * day that could be clicked is always a day the server will accept.
 */
export function upcomingWeekdays(from: Date, count = 10) {
  const days: { iso: string; date: Date }[] = []
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  while (days.length < count) {
    d.setDate(d.getDate() + 1)
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) days.push({ iso: isoDay(d), date: new Date(d) })
  }
  return days
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/

/** A weekday no more than DAYS_AHEAD days from now, and not in the past. */
export function isAllowedDay(iso: string, now = new Date()) {
  if (!ISO_RE.test(iso)) return false
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  if (isoDay(date) !== iso) return false
  const dow = date.getDay()
  if (dow === 0 || dow === 6) return false
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const limit = new Date(today)
  limit.setDate(limit.getDate() + DAYS_AHEAD)
  return date > today && date <= limit
}

const longDay = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export function formatDay(iso: string) {
  if (!ISO_RE.test(iso)) return iso
  const [y, m, d] = iso.split('-').map(Number)
  return longDay.format(new Date(y, m - 1, d))
}

export function validateStep(step: number, f: BookingInput): BookingErrors {
  const errors: BookingErrors = {}
  if (step === 0) {
    if (f.help.length === 0) errors.help = 'Pick at least one, even if it is "Something else".'
    if (f.other.trim().length > 1000) errors.other = 'Please keep this under 1,000 characters.'
  }
  if (step === 1) {
    if (!bookingBudgets.some((b) => b.id === f.budget)) {
      errors.budget = 'Pick the closest range, or "Not sure yet".'
    }
    if (f.plan && !(planOptions as readonly string[]).includes(f.plan)) {
      errors.plan = 'Pick one of the options.'
    }
  }
  if (step === 2) {
    if (!(timelineOptions as readonly string[]).includes(f.timeline)) {
      errors.timeline = 'Pick the closest.'
    }
  }
  if (step === 3) {
    if (f.name.trim().length < 2) errors.name = 'Add your name.'
    else if (f.name.trim().length > 100) errors.name = 'That name is too long.'
    const email = f.email.trim()
    if (!EMAIL_RE.test(email) || email.length > 200) {
      errors.email = 'That email address does not look complete.'
    }
    if (f.business.trim().length > 120) errors.business = 'That is too long.'
    if (f.phone.trim().length > 40) errors.phone = 'That is too long.'
    if (f.site.trim().length > 200) errors.site = 'That is too long.'
  }
  if (step === 4) {
    if (!isAllowedDay(f.day)) errors.day = 'Pick a weekday in the next few weeks.'
    if (!(slotOptions as readonly string[]).includes(f.slot)) errors.slot = 'Pick a time.'
  }
  return errors
}

/** Every step, for the server's final check. */
export function validateAll(f: BookingInput): BookingErrors {
  let errors: BookingErrors = {}
  for (let step = 0; step < STEP_COUNT; step += 1) {
    errors = { ...errors, ...validateStep(step, f) }
  }
  return errors
}

/**
 * Reads a submitted form into a BookingInput. Unknown values are dropped
 * rather than trusted: an option that is not on the list becomes empty, and
 * the validation above then decides whether that is allowed.
 */
export function readBooking(formData: FormData): BookingInput {
  const text = (key: string, max: number) => String(formData.get(key) ?? '').slice(0, max)
  const option = (key: string, allowed: readonly string[]) => {
    const value = String(formData.get(key) ?? '')
    return allowed.includes(value) ? value : ''
  }
  const helpValues = formData.getAll('help').map(String)

  return {
    help: helpOptions.filter((h) => helpValues.includes(h)),
    other: text('other', 2000),
    budget: option('budget', bookingBudgets.map((b) => b.id)),
    plan: option('plan', planOptions),
    timeline: option('timeline', timelineOptions),
    name: text('name', 300),
    business: text('business', 300),
    email: text('email', 300),
    phone: text('phone', 100),
    site: text('site', 300),
    day: text('day', 10),
    slot: option('slot', slotOptions),
  }
}

export function budgetLabel(id: string) {
  return bookingBudgets.find((b) => b.id === id)?.label ?? ''
}

/**
 * The enquiry text, written on the SERVER from the validated answers so the
 * inbox never receives anything the browser merely claimed.
 */
export function composeBookingMessage(input: BookingInput, ref: string) {
  const lines = [
    `Call request. Ref ${ref}`,
    '',
    `Preferred call: ${formatDay(input.day)} at ${input.slot} (UK time). Please confirm or offer another time.`,
    '',
    `Needs help with: ${input.help.join(', ')}`,
    `Working budget: ${budgetLabel(input.budget)}`,
    input.plan ? `Monthly plan: ${input.plan}` : null,
    `Timeline: ${input.timeline}`,
    input.site.trim() ? `Current website / Instagram: ${input.site.trim()}` : null,
    input.phone.trim() ? `Phone: ${input.phone.trim()}` : null,
  ].filter((line): line is string => line !== null)

  const note = input.other.trim()
  if (note) lines.push('', 'What else they need:', note)

  return lines.join('\n')
}

export type BookingState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: BookingErrors
  /** Quoted back to the visitor, and stored beside the enquiry. */
  ref?: string
}

export const initialBookingState: BookingState = { status: 'idle' }
