'use server'

import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'
import { normaliseCode, redeem } from '@/lib/unlock'

export type UnlockState = {
  status: 'idle' | 'valid' | 'invalid' | 'throttled'
  code?: string
  reward?: string
}

export const initialUnlockState: UnlockState = { status: 'idle' }

export async function checkUnlock(
  _previous: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || headerList.get('x-real-ip') || 'unknown'

  // Codes are short and guessable by brute force, so the attempt rate matters
  // more here than on the enquiry form.
  const limited = rateLimit(`unlock:${ip}`, { limit: 10, windowMs: 10 * 60 * 1000 })
  if (!limited.ok) return { status: 'throttled' }

  const raw = String(formData.get('code') ?? '')
  const match = redeem(raw)
  if (!match) return { status: 'invalid', code: normaliseCode(raw) }

  return { status: 'valid', code: match.code, reward: match.reward }
}
