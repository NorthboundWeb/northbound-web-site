'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { limited } from '@/lib/portal/session'
import { findDiscount } from '@/lib/store/discounts'
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

export type DiscountResult = { ok: true; code: string; percent: number; label: string } | { ok: false; message: string }

export async function checkDiscount(code: string): Promise<DiscountResult> {
  if (await limited('discount', 15, 15 * 60 * 1000)) return { ok: false, message: 'Too many tries. Please wait a few minutes.' }
  const d = findDiscount(String(code ?? '').slice(0, 40))
  return d ? { ok: true, ...d } : { ok: false, message: 'That code is not valid.' }
}
