import 'server-only'
import { Resend } from 'resend'

/**
 * Sends a plain note to the owner through Resend, using the same environment
 * variables as the enquiry form (RESEND_API_KEY, CONTACT_TO_EMAIL,
 * CONTACT_FROM_EMAIL). Returns false when mail is not configured or fails, so
 * a missing key never breaks the thing the person was actually doing.
 */

export function mailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL
  )
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** A header value must never carry a line break, or it can inject headers. */
function headerSafe(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

export async function sendOwnerNote(
  subject: string,
  rows: Array<[label: string, value: string | null]>
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !to || !from) return false

  const present = rows.filter((row): row is [string, string] => Boolean(row[1]))

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      subject: headerSafe(subject),
      text: present.map(([label, value]) => `${label}: ${value}`).join('\n'),
      html: `<table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">${present
        .map(
          ([label, value]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top">${escapeHtml(
              label
            )}</td><td style="padding:4px 0;white-space:pre-wrap"><strong>${escapeHtml(value)}</strong></td></tr>`
        )
        .join('')}</table>`,
    })
    if (error) {
      console.error('Resend rejected the note:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Could not send the note:', error)
    return false
  }
}
