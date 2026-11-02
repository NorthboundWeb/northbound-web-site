'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { limited } from '@/lib/portal/session'
import { STORE_COOKIE, STORE_COOKIE_AGE, codeMatches, storeCodeSet, storeCookieValue } from '@/lib/store/gate'

export type UnlockState = { status: 'idle' | 'error'; message: string }

export async function unlockStore(_prev: UnlockState, form: FormData): Promise<UnlockState> {
  if (String(form.get('website') ?? '')) return { status: 'idle', message: '' }
  const attempt = String(form.get('code') ?? '').slice(0, 80)
  if (!storeCodeSet()) return { status: 'error', message: 'The store code has not been set up yet.' }
  if (await limited('store', 8, 15 * 60 * 1000)) return { status: 'error', message: 'Too many tries. Please wait a few minutes.' }
  if (!codeMatches(attempt)) return { status: 'error', message: 'That code is not right.' }
  ;(await cookies()).set(STORE_COOKIE, storeCookieValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/store',
    maxAge: STORE_COOKIE_AGE,
  })
  redirect('/store')
}

export async function lockStore() {
  ;(await cookies()).delete({ name: STORE_COOKIE, path: '/store' })
  redirect('/store')
}
