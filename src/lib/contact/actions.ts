'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
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

const GENERIC_ERROR =
  'Something went wrong sending your message. Please email me directly and I will pick it up.'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Strip CR/LF from anything interpolated into a mail header. Without this a
 * crafted name could inject extra headers into the outgoing message.
 */
function headerSafe(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

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

  // 4. Send. Configuration problems are logged server-side but never described
  //    to the visitor — an error page is not the place to leak setup detail.
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !to || !from) {
    console.error(
      'Enquiry not sent: RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is missing.'
    )
    return { status: 'error', message: GENERIC_ERROR }
  }

  const subject = `New enquiry — ${headerSafe(enquiry.name)}${
    enquiry.business ? ` (${headerSafe(enquiry.business)})` : ''
  }`

  const lines = [
    ['Name', enquiry.name],
    ['Email', enquiry.email],
    ['Business', enquiry.business ?? '—'],
    ['Project type', enquiry.projectType ?? '—'],
    ['Budget', enquiry.budget ?? '—'],
  ] as const

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: enquiry.email,
      subject,
      text: [
        ...lines.map(([label, value]) => `${label}: ${value}`),
        '',
        enquiry.message,
      ].join('\n'),
      html: `
        <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">
          ${lines
            .map(
              ([label, value]) =>
                `<tr><td style="padding:4px 16px 4px 0;color:#666">${label}</td><td style="padding:4px 0"><strong>${escapeHtml(
                  String(value)
                )}</strong></td></tr>`
            )
            .join('')}
        </table>
        <hr style="margin:20px 0;border:none;border-top:1px solid #e5e5e5" />
        <p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
          enquiry.message
        )}</p>
      `,
    })

    if (error) {
      console.error('Resend rejected the enquiry:', error)
      return { status: 'error', message: GENERIC_ERROR }
    }
  } catch (error) {
    console.error('Failed to send enquiry:', error)
    return { status: 'error', message: GENERIC_ERROR }
  }

  return {
    status: 'success',
    message: 'Thanks — your message is with me. I normally reply within one working day.',
  }
}
