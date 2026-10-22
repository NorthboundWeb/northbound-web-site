'use server'

import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'
import { site } from '@/lib/site'
import {
  contactSchema,
  type ContactInput,
  type ContactState,
} from './schema'

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

async function clientKey() {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  // The left-most entry is the original client on Vercel's proxy chain.
  const ip = forwarded?.split(',')[0]?.trim() || headerList.get('x-real-ip')
  return ip || 'unknown'
}

export async function submitEnquiry(
  _previous: ContactState,
  formData: FormData
): Promise<ContactState> {
  // 1. Spam traps. Both fail silently as a "success" so a bot gets no signal
  //    about which check caught it.
  if (String(formData.get(HONEYPOT_FIELD) ?? '') !== '') {
    return { status: 'success' }
  }

  const startedAt = Number(formData.get('startedAt') ?? 0)
  if (Number.isFinite(startedAt) && startedAt > 0) {
    if (Date.now() - startedAt < MIN_FILL_MS) {
      return { status: 'success' }
    }
  }

  // 2. Rate limit before doing any work.
  const limited = rateLimit(`contact:${await clientKey()}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  })
  if (!limited.ok) {
    return {
      status: 'error',
      message: `You have sent a few messages already. Please try again later, or email me directly at ${site.email}.`,
    }
  }

  // 3. Validate.
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

  const enquiry = parsed.data

  // 4. Send. The enquiry goes to a Google Apps Script web app that emails it
  //    to the inbox and logs it to a Google Sheet (apps-script/enquiries.gs).
  //    It escapes and re-checks everything itself. Configuration problems are
  //    logged server-side but never described to the visitor: an error page is
  //    not the place to leak setup detail.
  const webhookUrl = process.env.ENQUIRY_WEBHOOK_URL
  const webhookToken = process.env.ENQUIRY_WEBHOOK_TOKEN

  if (!webhookUrl || !webhookToken) {
    console.error(
      'Enquiry not sent: ENQUIRY_WEBHOOK_URL or ENQUIRY_WEBHOOK_TOKEN is missing.'
    )
    return { status: 'error', message: GENERIC_ERROR }
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
        id: crypto.randomUUID(),
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
      return { status: 'error', message: GENERIC_ERROR }
    }
  } catch (error) {
    console.error('Failed to send enquiry:', error)
    return { status: 'error', message: GENERIC_ERROR }
  } finally {
    clearTimeout(timer)
  }

  return {
    status: 'success',
    message: 'Thanks — your message is with me. I normally reply within one working day.',
  }
}
