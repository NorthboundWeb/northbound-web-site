/**
 * The guided "Start a project" flow: its options, its validation and the
 * advice it gives. Shared by the browser (so each step can be checked as you
 * go) and the server action (which checks everything again, because a server
 * action is a public POST endpoint and the browser cannot be trusted).
 *
 * Prices, timelines and package summaries come from src/lib/services.ts, so
 * the flow can never quote something the services page does not.
 *
 * Promo codes are NOT in this file or anywhere the browser can import. See
 * src/lib/contact/promos.ts.
 */

import { buildPackages, managementPlans } from '@/lib/services'
import { budgetBands } from './schema'

export const tradeOptions = [
  'Trades',
  'Beauty',
  'Food & drink',
  'Shop',
  'Services',
  'Something else',
] as const

export const pageOptions = ['1–3', '4–5', '6–8', '9 or more'] as const

export const featureOptions = [
  'Online booking',
  'Take deposits or payments',
  'Booking for several staff',
  'Reminders and rescheduling',
  'Gallery of work',
  'Price list or menu',
  'Local SEO (show up nearby)',
  'Contact form',
] as const

export const contentOptions = ['Yes, all of it', 'Some of it', 'Not yet'] as const

export type LaneId = 'pro' | 'ultimate' | 'custom' | 'unsure'

export type Lane = {
  id: LaneId
  name: string
  /** 0 for "Help me choose". */
  price: number
  /** True where the price is a floor (Custom), not the advertised figure. */
  variable: boolean
  timeline: string
  summary: string
  /** The value the enquiry form's "What do you need?" select uses. */
  projectType: string
}

export const lanes: Lane[] = [
  ...buildPackages.map((pkg) => ({
    id: pkg.slug as LaneId,
    name: pkg.name,
    price: pkg.price,
    variable: Boolean(pkg.variable),
    timeline: pkg.timeline,
    summary: pkg.summary,
    projectType: `${pkg.name} build`,
  })),
  {
    id: 'unsure' as const,
    name: 'Help me choose',
    price: 0,
    variable: false,
    timeline: 'I will recommend one',
    summary:
      'Tell me what you need and I will point you at the smallest package that does it.',
    projectType: 'Not sure yet',
  },
]

export function laneById(id: string) {
  return lanes.find((lane) => lane.id === id)
}

/**
 * Page allowances, matching the "Up to N pages" lines in buildPackages. Used
 * only to nudge a visitor towards the package that fits what they ticked.
 */
const PAGE_LIMIT = { pro: 5, ultimate: 8 } as const

export type StartInput = {
  biz: string
  trade: string
  site: string
  pkg: string
  budget: string
  mgmt: boolean
  pages: string
  feats: string[]
  content: string
  name: string
  phone: string
  email: string
  msg: string
  promo: string
}

export const emptyStart: StartInput = {
  biz: '',
  trade: '',
  site: '',
  pkg: '',
  budget: '',
  mgmt: false,
  pages: '',
  feats: [],
  content: '',
  name: '',
  phone: '',
  email: '',
  msg: '',
  promo: '',
}

export type StartField = keyof StartInput
export type StartErrors = Partial<Record<StartField, string>>

/** Same rule the Apps Script inbox applies, so nothing passes here and fails there. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The step each field is asked on, so an error can send you back to it. */
export const stepOfField: Record<StartField, number> = {
  biz: 0,
  trade: 0,
  site: 0,
  pkg: 1,
  budget: 1,
  mgmt: 1,
  pages: 2,
  feats: 2,
  content: 2,
  name: 3,
  phone: 3,
  email: 3,
  msg: 3,
  promo: 4,
}

export function validateStep(step: number, f: StartInput): StartErrors {
  const errors: StartErrors = {}
  if (step === 0) {
    if (!f.biz.trim()) errors.biz = 'Add your business name so I know who it is for.'
    else if (f.biz.trim().length > 120) errors.biz = 'That is too long.'
    if (!(tradeOptions as readonly string[]).includes(f.trade)) {
      errors.trade = 'Pick the closest one. It shapes the suggestions.'
    }
    if (f.site.trim().length > 200) errors.site = 'That is too long.'
  }
  if (step === 1) {
    if (!laneById(f.pkg)) errors.pkg = 'Pick a lane, or choose "Help me choose".'
    if (f.budget && !(budgetBands as readonly string[]).includes(f.budget)) {
      errors.budget = 'Pick one of the options.'
    }
  }
  if (step === 3) {
    if (f.name.trim().length < 2) errors.name = 'Add your name.'
    else if (f.name.trim().length > 100) errors.name = 'That name is too long.'
    const email = f.email.trim()
    if (!EMAIL_RE.test(email) || email.length > 200) {
      errors.email = 'That email address does not look complete.'
    }
    if (f.phone.trim().length > 40) errors.phone = 'That is too long.'
    if (f.msg.trim().length > 2000) errors.msg = 'Please keep this under 2,000 characters.'
  }
  return errors
}

/** Every step that has required fields, for the server's final check. */
export function validateAll(f: StartInput): StartErrors {
  return { ...validateStep(0, f), ...validateStep(1, f), ...validateStep(3, f) }
}

/**
 * Reads a submitted form into a StartInput. Unknown values are dropped rather
 * than trusted: an option that is not on the list becomes empty, and the
 * validation above then decides whether that is allowed.
 */
export function readStart(formData: FormData): StartInput {
  const text = (key: string, max: number) =>
    String(formData.get(key) ?? '').slice(0, max)
  const option = (key: string, allowed: readonly string[]) => {
    const value = String(formData.get(key) ?? '')
    return allowed.includes(value) ? value : ''
  }
  const featureValues = formData.getAll('feats').map(String)

  return {
    biz: text('biz', 300),
    trade: option('trade', tradeOptions),
    site: text('site', 300),
    pkg: option('pkg', lanes.map((lane) => lane.id)),
    budget: option('budget', budgetBands),
    mgmt: formData.get('mgmt') === 'on',
    pages: option('pages', pageOptions),
    feats: featureOptions.filter((feature) => featureValues.includes(feature)),
    content: option('content', contentOptions),
    name: text('name', 300),
    phone: text('phone', 100),
    email: text('email', 300),
    msg: text('msg', 5000),
    promo: text('promo', 64),
  }
}

export type LaneAdvice = {
  text: string
  /** The lane to offer a switch to. */
  switchTo: LaneId
  switchLabel: string
}

/**
 * Shown at "What it needs" when what was asked for outgrows the lane chosen.
 * It only ever suggests a move up, and says what the move costs.
 */
export function laneAdvice(f: StartInput): LaneAdvice | null {
  const pageCount = f.pages
  const manyPages = pageCount === '6–8' || pageCount === '9 or more'
  const team =
    f.feats.includes('Booking for several staff') ||
    f.feats.includes('Reminders and rescheduling') ||
    f.feats.includes('Take deposits or payments')

  if (f.pkg === 'pro' && (manyPages || team)) {
    const why = manyPages
      ? `${pageCount === '9 or more' ? '9 or more' : '6–8'} pages is more than Pro's ${PAGE_LIMIT.pro}.`
      : 'Payments, reminders and several staff calendars come with Ultimate.'
    const ultimate = laneById('ultimate')
    return {
      text: `${why} Ultimate covers it${ultimate ? ` for £${ultimate.price}` : ''}.`,
      switchTo: 'ultimate',
      switchLabel: 'Switch to Ultimate',
    }
  }
  if (f.pkg === 'ultimate' && pageCount === '9 or more') {
    const custom = laneById('custom')
    return {
      text: `More than ${PAGE_LIMIT.ultimate} pages is beyond Ultimate. A Custom build${custom ? `, from £${custom.price},` : ''} is quoted to fit.`,
      switchTo: 'custom',
      switchLabel: 'Switch to Custom',
    }
  }
  return null
}

/** What the browser learns about a code once the server has accepted it. */
export type AppliedPromo = {
  code: string
  kind: 'amount' | 'percent'
  value: number
  tag: string
  what: string
  msg: string
  ff?: boolean
}

export type PromoCheck =
  | { ok: true; promo: AppliedPromo }
  | { ok: false; message: string }

export type StartState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: StartErrors
  /** Quoted back to the visitor, and stored beside the enquiry. */
  ref?: string
}

export const initialStartState: StartState = { status: 'idle' }

/**
 * Turns the `?package=` value used by the pricing cards into a starting
 * point: a build lane preselects that lane, a management plan ticks the
 * management box. Anything unrecognised starts the flow empty.
 */
export function startFromParam(param: string | string[] | undefined): {
  lane?: LaneId
  mgmt?: boolean
} {
  if (typeof param !== 'string') return {}
  const build = buildPackages.find((pkg) => pkg.enquiryParam === param)
  if (build) return { lane: build.slug as LaneId }
  if (managementPlans.some((plan) => plan.enquiryParam === param)) {
    return { mgmt: true }
  }
  return {}
}
