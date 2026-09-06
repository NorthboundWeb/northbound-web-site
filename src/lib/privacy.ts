/**
 * Privacy notice configuration.
 *
 * The prose lives in the dictionaries; this file holds the facts that are
 * specific to the business and must not be guessed at. Everything here was
 * supplied by the owner or is derived from the code.
 *
 * HARD RULE: nothing in this file may be invented. A privacy notice is a legal
 * statement about what a business actually does, and a plausible-sounding
 * guess is a false statement to a regulator and to the visitor.
 */

/** Confirmed by the owner. */
export const controller = {
  /** Sole trader — NOT a limited company. Do not describe it as one. */
  legalIdentity: 'Che Walker, a sole trader trading as Northbound Web',
  postalAddress: ['32 Ryland Road', 'B24 8JJ', 'United Kingdom'],
  /**
   * ICO registration number, once the data-protection fee self-assessment is
   * complete. While this is null the page shows no registration line at all —
   * claiming "ICO registered" without a number would be a false statement.
   */
  icoRegistrationNumber: null as string | null,
} as const

/** When the notice was last substantively changed. */
export const PRIVACY_LAST_UPDATED = '2026-09-06'

/**
 * Third parties that necessarily see enquiry data, read off the dependencies
 * in this repository rather than from a template.
 */
export const processors = [
  {
    name: 'Resend',
    role: 'Delivers the enquiry email. Your message passes through their systems to reach the Northbound inbox.',
    privacyUrl: 'https://resend.com/legal/privacy-policy',
  },
  {
    name: 'Vercel',
    role: 'Hosts this website and runs the code that receives the form submission.',
    privacyUrl: 'https://vercel.com/legal/privacy-policy',
  },
] as const

export const ICO_COMPLAINT_URL = 'https://ico.org.uk/make-a-complaint/'
