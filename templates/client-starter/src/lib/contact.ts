'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { z } from 'zod'
import { rateLimit } from './rate-limit'
import type { ContactState } from './contact-state'

/**
 * The enquiry form's server action. It is a public POST endpoint, so every
 * protection lives here and not only in the browser: a honeypot, a rate limit,
 * server-side validation and HTML-escaping of anything put in the email.
 */

const schema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(120),
  email: z.email('Please enter a valid email address.').max(254),
  message: z.string().trim().min(10, 'Please tell us a little more.').max(5000),
})

const HONEYPOT = 'website'
const FAILED = 'Sorry, that did not send. Please email us directly instead.'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** A header value must never carry a line break, or it can inject headers. */
const headerSafe = (value: string) => value.replace(/[\r\n]+/g, ' ').trim()

async function clientKey() {
  const list = await headers()
  const forwarded = list.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || list.get('x-real-ip') || 'unknown'
}

export async function submitEnquiry(
  _previous: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Bots fill every field. Pretend it worked so they learn nothing.
  if (String(formData.get(HONEYPOT) ?? '') !== '') return { status: 'success' }

  const limited = rateLimit(`contact:${await clientKey()}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  })
  if (!limited.ok) {
    return { status: 'error', message: 'Too many messages in a short time. Please try again later.' }
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })
  if (!parsed.success) {
    const errors: NonNullable<ContactState['errors']> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as 'name' | 'email' | 'message' | undefined
      if (field && !errors[field]) errors[field] = issue.message
    }
    return { status: 'error', message: 'Please check the highlighted fields.', errors }
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !to || !from) {
    // Logged for the developer; never described to the visitor.
    console.error('Enquiry not sent: RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is missing.')
    return { status: 'error', message: FAILED }
  }

  const { name, email, message } = parsed.data
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: email,
      subject: `New enquiry from ${headerSafe(name)}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p style="font-family:system-ui,sans-serif;font-size:14px"><strong>${escapeHtml(
        name
      )}</strong> (${escapeHtml(email)})</p><p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
        message
      )}</p>`,
    })
    if (error) {
      console.error('Resend rejected the enquiry:', error)
      return { status: 'error', message: FAILED }
    }
  } catch (error) {
    console.error('Failed to send enquiry:', error)
    return { status: 'error', message: FAILED }
  }

  return { status: 'success', message: 'Thanks. Your message is on its way and we will be in touch.' }
}
