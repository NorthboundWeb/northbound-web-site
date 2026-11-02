/**
 * The store is behind an admin code while it is being built. Visitors see an
 * "under construction" screen; anyone who enters STORE_CODE (or is signed in as
 * an admin of the client area) sees the real page. The unlock is a cookie
 * holding an HMAC of the code, so changing the code locks everyone out again.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/portal/session'

export const STORE_COOKIE = 'nb_store'
export const STORE_COOKIE_AGE = 60 * 60 * 24 * 30

const code = () => (process.env.STORE_CODE ?? '').trim()

export const storeCodeSet = () => code().length >= 6

/** The value the unlock cookie must hold: a keyed hash of the current code. */
export function storeCookieValue() {
  return createHmac('sha256', code()).update('nb-store-v1').digest('base64url')
}

export function codeMatches(attempt: string) {
  const want = Buffer.from(code())
  const got = Buffer.from(attempt.trim())
  return storeCodeSet() && want.length === got.length && timingSafeEqual(want, got)
}

export async function storeUnlocked(): Promise<'code' | 'admin' | null> {
  if (storeCodeSet()) {
    const raw = (await cookies()).get(STORE_COOKIE)?.value ?? ''
    const want = Buffer.from(storeCookieValue())
    const got = Buffer.from(raw)
    if (raw && want.length === got.length && timingSafeEqual(want, got)) return 'code'
  }
  const s = await getSession().catch(() => null)
  if (s?.admin) return 'admin'
  return null
}
