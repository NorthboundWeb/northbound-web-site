'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'
import { isValidCode, normaliseCode } from '@/lib/unlock'
import { site } from '@/lib/site'
import { contactSchema, type ContactInput, type ContactState } from './schema'

/** Bots fill every field they find, including ones a human never sees. */
const HONEYPOT_FIELD = 'subject'
/** A genuine person does not read, think and type in under this many ms. */
const MIN_FILL_MS = 3_000

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Strip CR/LF from anything interpolated into a mail header. */
function headerSafe(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

async function clientKey() {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || headerList.get('x-real-ip')
  return ip || 'unknown'
}

const TYPE_LABELS: Record<string, string> = {
  build: 'New website',
  management: 'Website management',
  help: 'Help with an existing site',
  jarvis: 'Jarvis Full Access request',
  other: 'Something else',
}

function summarise(enquiry: ContactInput) {
  return [
    ['Enquiry', TYPE_LABELS[enquiry.enquiryType] ?? enquiry.enquiryType],
    ['Name', enquiry.name],
    ['Email', enquiry.email],
    ['Phone', enquiry.phone || '—'],
    ['Business', enquiry.business || '—'],
    ['Existing site', enquiry.existingUrl || '—'],
    ['Scope', enquiry.scope || '—'],
    ['Plan', enquiry.plan || '—'],
    ['Size', enquiry.size || '—'],
    [
      'UNLOCK',
      enquiry.unlock
        ? `${normaliseCode(enquiry.unlock)}${isValidCode(enquiry.unlock) ? ' (valid)' : ' (NOT RECOGNISED)'}`
        : '—',
    ],
  ] as const
}

/**
 * Builds a mailto: containing the whole enquiry, so a delivery failure costs
 * the visitor one click rather than costing Northbound the lead entirely.
 */
function fallbackMailto(enquiry: ContactInput) {
  const body = [
    ...summarise(enquiry).map(([k, v]) => `${k}: ${v}`),
    '',
    enquiry.message,
  ].join('\n')
  const subject = `Website enquiry — ${enquiry.name}`
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export async function submitEnquiry(
  _previous: ContactState,
  formData: FormData
): Promise<ContactState> {
  // 1. Spam traps. Both return a fake success so a bot learns nothing.
  if (String(formData.get(HONEYPOT_FIELD) ?? '') !== '') {
    return { status: 'success' }
  }
  const startedAt = Number(formData.get('startedAt') ?? 0)
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS) {
    return { status: 'success' }
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

  // 3. Validate on the server — a server action is a public POST endpoint.
  const parsed = contactSchema.safeParse({
    enquiryType: formData.get('enquiryType'),
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    business: formData.get('business') || undefined,
    existingUrl: formData.get('existingUrl') || undefined,
    scope: formData.get('scope') || undefined,
    plan: formData.get('plan') || undefined,
    size: formData.get('size') || undefined,
    unlock: formData.get('unlock') || undefined,
    message: formData.get('message'),
  })

  if (!parsed.success) {
    const errors: ContactState['errors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactInput | undefined
      if (field && !errors[field]) errors[field] = issue.message
    }
    return { status: 'error', message: 'Please check the highlighted fields.', errors }
  }

  const enquiry = parsed.data
  const mailto = fallbackMailto(enquiry)

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL

  /**
   * Recovery log. Deliberately minimal — name, email and type only, never the
   * message body — so a failed enquiry can still be followed up without
   * writing the whole conversation into server logs.
   */
  const logRecovery = (reason: string) =>
    console.error(
      `[enquiry-undelivered] ${reason} | ${enquiry.name} <${enquiry.email}> | ${enquiry.enquiryType}`
    )

  const DELIVERY_FAILED =
    'I could not send that automatically. Your message is not lost — use the button below to send it straight from your email app, and it will reach me.'

  if (!apiKey || !to || !from) {
    logRecovery('email not configured')
    return { status: 'error', message: DELIVERY_FAILED, fallbackMailto: mailto }
  }

  const lines = summarise(enquiry)
  const subject = `${TYPE_LABELS[enquiry.enquiryType] ?? 'Enquiry'} — ${headerSafe(enquiry.name)}${
    enquiry.business ? ` (${headerSafe(enquiry.business)})` : ''
  }`

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: enquiry.email,
      subject,
      text: [...lines.map(([k, v]) => `${k}: ${v}`), '', enquiry.message].join('\n'),
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
      logRecovery(`resend rejected: ${error.name ?? 'unknown'}`)
      return { status: 'error', message: DELIVERY_FAILED, fallbackMailto: mailto }
    }
  } catch (error) {
    logRecovery(`send threw: ${error instanceof Error ? error.name : 'unknown'}`)
    return { status: 'error', message: DELIVERY_FAILED, fallbackMailto: mailto }
  }

  return {
    status: 'success',
    message: 'Thanks — your enquiry is with me. I normally reply within one working day.',
  }
}
