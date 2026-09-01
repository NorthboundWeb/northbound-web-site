/**
 * Kept out of `actions.ts` deliberately: a `'use server'` module may only
 * export async functions. Exporting the initial state from there builds
 * cleanly but throws at runtime the first time the action module is
 * evaluated — "A 'use server' file can only export async functions".
 */
export type UnlockState = {
  status: 'idle' | 'valid' | 'invalid' | 'throttled'
  code?: string
  reward?: string
}

export const initialUnlockState: UnlockState = { status: 'idle' }
