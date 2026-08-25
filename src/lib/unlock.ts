import 'server-only'

/**
 * UNLOCK — Northbound's promotional code mechanism.
 *
 * Codes are validated on the server and never shipped to the browser, so the
 * list cannot be read out of the bundle. A redeemed code is recorded against
 * the enquiry; it does not apply a discount automatically, because Northbound
 * takes no payment on the site yet. CJ honours it at quote time.
 *
 * To add a code: add an entry below. Keep them short, uppercase and memorable.
 */

export type UnlockCode = {
  code: string
  /** Shown to the visitor once redeemed. Keep it concrete. */
  reward: string
  /** ISO date. Omit for no expiry. */
  expires?: string
}

const CODES: UnlockCode[] = [
  {
    code: 'FIRSTLIGHT',
    reward: 'Founding rate on your first build, honoured at quote.',
  },
  {
    code: 'DUENORTH',
    reward: 'Your first month of management included, on any build.',
  },
]

export function normaliseCode(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, '')
}

export function redeem(input: string): UnlockCode | undefined {
  const code = normaliseCode(input)
  if (!code) return undefined
  const match = CODES.find((c) => c.code === code)
  if (!match) return undefined
  if (match.expires && new Date(match.expires) < new Date()) return undefined
  return match
}

/** True when the code is real — used to annotate an enquiry. */
export function isValidCode(input: string | undefined) {
  return Boolean(input && redeem(input))
}
