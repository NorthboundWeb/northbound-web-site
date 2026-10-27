'use server'

import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'
import { site } from '@/lib/site'
import { findPromo } from './promos'
import {
  contactSchema,
  type ContactInput,
  type ContactState,
} from './schema'
import {
  laneById,
  readStart,
  validateAll,
  type AppliedPromo,
  type PromoCheck,
  type StartState,
} from './start'
import { composeStartMessage } from './start-message'

/** Bots fill every field they find, including ones a human never sees. */
const HONEYPOT_FIELD = 'website'
/** A genuine person does not read, think and type in under this many ms. */
const MIN_FILL_MS = 3_000

/**
 * How long to wait for the enquiry inbox (a Google Apps Script web app, see
 * apps-script/enquiries.gs) before telling the visitor it did not go through.
 * A cold start is usually 1-3 seconds, so this leaves plenty of room.
 */
const WEBHOOK_TIMEOUT_MS = 8_000

const GENERIC_ERROR = `Something went wrong sending your message. Please email me directly at ${site.email} and I will pick it up.`

const LIMITED_ERROR = `You have sent a few messages already. Please try again later, or email me directly at ${site.email}.`

async function clientKey() {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  // The left-most entry is the original client on Vercel's proxy chain.
  const ip = forwarded?.split(',')[0]?.trim() || headerList.get('x-real-ip')
  return ip || 'unknown'
}

/**
 * The checks every submission goes through before any work is done: the two
 * spam traps (which fail silently as a "success" so a bot gets no signal about
 * which one caught it) and the rate limit.
 */
async function screen(formData: FormData): Promise<'trap' | 'limited' | 'ok'> {
  if (String(formData.get(HONEYPOT_FIELD) ?? '') !== '') return 'trap'

  const startedAt = Number(formData.get('startedAt') ?? 0)
  if (Number.isFinite(startedAt) && startedAt > 0) {
    if (Date.now() - startedAt < MIN_FILL_MS) return 'trap'
  }

  const limited = rateLimit(`contact:${await clientKey()}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  })
  return limited.ok ? 'ok' : 'limited'
}

type Delivery = {
  name: string
  email: string
  business?: string
  projectType?: string
  budget?: string
  message: string
}

/**
 * Sends an enquiry to the Google Apps Script web app, which emails it to the
 * inbox and logs it to a Google Sheet (apps-script/enquiries.gs). The script
 * escapes and re-checks everything itself. Configuration problems are logged
 * server-side but never described to the visitor: an error page is not the
 * place to leak setup detail.
 *
 * `id` is stored beside the row and used by the script to ignore a repeat.
 */
async function deliver(enquiry: Delivery, id: string): Promise<boolean> {
  const webhookUrl = process.env.ENQUIRY_WEBHOOK_URL
  const webhookToken = process.env.ENQUIRY_WEBHOOK_TOKEN

  if (!webhookUrl || !webhookToken) {
    console.error(
      'Enquiry not sent: ENQUIRY_WEBHOOK_URL or ENQUIRY_WEBHOOK_TOKEN is missing.'
    )
    return false
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

  try {
    // Apps Script answers a POST with a redirect to the page holding its
    // reply, so redirects must be followed.
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({
        token: webhookToken,
        id,
        name: enquiry.name,
        email: enquiry.email,
        business: enquiry.business ?? '',
        projectType: enquiry.projectType ?? '',
        budget: enquiry.budget ?? '',
        message: enquiry.message,
      }),
    })

    // Apps Script reports its own failures with HTTP 200 and { ok: false }.
    const result: unknown = await response.json().catch(() => null)
    const delivered =
      response.ok &&
      typeof result === 'object' &&
      result !== null &&
      (result as { ok?: unknown }).ok === true

    if (!delivered) {
      console.error('The enquiry inbox rejected the enquiry:', {
        status: response.status,
        result,
      })
    }
    return delivered
  } catch (error) {
    console.error('Failed to send enquiry:', error)
    return false
  } finally {
    clearTimeout(timer)
  }
}

export async function submitEnquiry(
  _previous: ContactState,
  formData: FormData
): Promise<ContactState> {
  // 1. Spam traps and rate limit.
  const gate = await screen(formData)
  if (gate === 'trap') return { status: 'success' }
  if (gate === 'limited') return { status: 'error', message: LIMITED_ERROR }

  // 2. Validate.
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    business: formData.get('business') || undefined,
    projectType: formData.get('projectType') || undefined,
    budget: formData.get('budget') || undefined,
    message: formData.get('message'),
  })

  if (!parsed.success) {
    const errors: ContactState['errors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactInput | undefined
      if (field && !errors[field]) errors[field] = issue.message
    }
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors,
    }
  }

  // 3. Send.
  if (!(await deliver(parsed.data, crypto.randomUUID()))) {
    return { status: 'error', message: GENERIC_ERROR }
  }

  return {
    status: 'success',
    message: 'Thanks — your message is with me. I normally reply within one working day.',
  }
}

/**
 * Checks a promo code. The codes never leave the server: the browser only
 * learns about a code by asking, and it is rate limited so the list cannot be
 * guessed at in bulk. Unknown codes all get the same answer.
 */
export async function checkPromo(raw: string): Promise<PromoCheck> {
  const limited = rateLimit(`promo:${await clientKey()}`, {
    limit: 12,
    windowMs: 10 * 60 * 1000,
  })
  if (!limited.ok) {
    return {
      ok: false,
      message: 'That is a lot of tries. Please wait a few minutes and try again.',
    }
  }

  const promo = findPromo(raw)
  if (!promo) {
    return {
      ok: false,
      message: 'That code is not recognised. Check the spelling, or carry on without one.',
    }
  }
  return { ok: true, promo }
}

/**
 * The guided Start-a-project flow. It carries the same protections as the
 * plain enquiry form (traps, rate limit, server-side validation) and adds one
 * thing: the promo code is looked up again here, and any price in the message
 * is worked out here, so nothing the browser claims about money is believed.
 */
export async function submitStart(
  _previous: StartState,
  formData: FormData
): Promise<StartState> {
  const gate = await screen(formData)
  if (gate === 'trap') return { status: 'success' }
  if (gate === 'limited') return { status: 'error', message: LIMITED_ERROR }

  const input = readStart(formData)
  const errors = validateAll(input)
  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors,
    }
  }

  const lane = laneById(input.pkg)
  if (!lane) {
    return { status: 'error', message: 'Please pick a lane.', errors: { pkg: 'Pick a lane.' } }
  }

  // An unrecognised code is dropped quietly rather than failing the enquiry; the
  // visitor already saw it accepted or refused when they entered it.
  const promo: AppliedPromo | null = input.promo ? findPromo(input.promo) : null

  const ref = `NB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const message = composeStartMessage({ input, lane, promo, ref })

  const sent = await deliver(
    {
      name: input.name.trim(),
      email: input.email.trim(),
      business: input.biz.trim(),
      projectType: lane.projectType,
      budget: input.pkg === 'custom' ? input.budget : '',
      message,
    },
    ref
  )
  if (!sent) return { status: 'error', message: GENERIC_ERROR }

  return {
    status: 'success',
    ref,
    message: 'Thanks — your route is with me. I normally reply within one working day.',
  }
}
