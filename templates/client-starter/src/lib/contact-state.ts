/**
 * Shared by the server action and the form. Kept out of the 'use server'
 * file, which may only export async functions.
 */
export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<'name' | 'email' | 'message', string>>
}

export const initialContactState: ContactState = { status: 'idle' }
