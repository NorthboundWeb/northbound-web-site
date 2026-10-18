/**
 * Session tokens for the private HQ area.
 *
 * One owner, one password, no user table. The password and a signing secret
 * live in environment variables (HQ_PASSWORD, HQ_SESSION_SECRET), never in the
 * code. A session is a short-lived signed timestamp in an httpOnly cookie, so
 * there is nothing to look up and nothing to leak from a database.
 *
 * Written against Web Crypto rather than node:crypto so the same code runs in
 * the proxy and in server actions.
 *
 * Fails closed: if either variable is missing or the secret is short, HQ is
 * treated as not configured and nobody gets in.
 */

export const HQ_COOKIE = 'nb_hq'
export const SESSION_SECONDS = 12 * 60 * 60

const encoder = new TextEncoder()

export type HqConfig = { password: string; secret: string }

/** Returns the configuration, or null when HQ must stay locked. */
export function readHqConfig(
  env: Record<string, string | undefined> = process.env
): HqConfig | null {
  const password = env.HQ_PASSWORD
  const secret = env.HQ_SESSION_SECRET
  if (!password || password.length < 12) return null
  if (!secret || secret.length < 32) return null
  return { password, secret }
}

async function sign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Compares without bailing out at the first difference. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken(
  secret: string,
  now: number = Date.now()
): Promise<string> {
  const expires = Math.floor(now / 1000) + SESSION_SECONDS
  return `${expires}.${await sign(secret, `hq:${expires}`)}`
}

export async function verifySessionToken(
  secret: string,
  token: string | undefined,
  now: number = Date.now()
): Promise<boolean> {
  if (!token) return false
  const [expiresRaw, signature, ...extra] = token.split('.')
  if (extra.length > 0 || !expiresRaw || !signature) return false
  if (!/^\d{1,12}$/.test(expiresRaw)) return false

  const expires = Number(expiresRaw)
  if (expires <= Math.floor(now / 1000)) return false

  return constantTimeEqual(signature, await sign(secret, `hq:${expires}`))
}

/**
 * Checks a password attempt. Both sides are run through the keyed hash first,
 * so the comparison is over equal-length digests and leaks nothing about the
 * real password's length.
 */
export async function passwordMatches(
  config: HqConfig,
  attempt: string
): Promise<boolean> {
  const [a, b] = await Promise.all([
    sign(config.secret, `pw:${attempt}`),
    sign(config.secret, `pw:${config.password}`),
  ])
  return constantTimeEqual(a, b)
}
