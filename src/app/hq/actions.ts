'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { rateLimit } from '@/lib/rate-limit'
import {
  HQ_COOKIE,
  SESSION_SECONDS,
  createSessionToken,
  passwordMatches,
  readHqConfig,
} from '@/lib/hq/session'

async function clientKey() {
  const list = await headers()
  const forwarded = list.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || list.get('x-real-ip') || 'unknown'
}

/**
 * Password login. Rate-limited per client so a guessing run is slow, and every
 * failure returns the same message whether the password was wrong or HQ is not
 * configured, so the response says nothing about which it was.
 */
export async function login(formData: FormData) {
  const config = readHqConfig()

  const limited = rateLimit(`hq-login:${await clientKey()}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  })
  if (!limited.ok) redirect('/hq/login?error=wait')

  const attempt = String(formData.get('password') ?? '')
  const ok = config !== null && attempt.length > 0 && (await passwordMatches(config, attempt))
  if (!ok || !config) redirect('/hq/login?error=1')

  const token = await createSessionToken(config.secret)
  ;(await cookies()).set(HQ_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/hq',
    maxAge: SESSION_SECONDS,
  })
  redirect('/hq')
}

export async function logout() {
  ;(await cookies()).set(HQ_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/hq',
    maxAge: 0,
  })
  redirect('/hq/login')
}
