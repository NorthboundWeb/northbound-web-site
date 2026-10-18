'use server'

import { redirect } from 'next/navigation'
import { requireHq } from '@/lib/hq/auth'
import { UUID_PATTERN, formObject } from '@/lib/hq/form'
import { clientUpdateSchema, firstIssue } from '@/lib/hq/schemas'
import { StoreError, updateClient } from '@/lib/hq/store'

export async function saveClient(id: string, formData: FormData) {
  await requireHq()
  if (!UUID_PATTERN.test(id)) redirect('/hq/clients')

  const parsed = clientUpdateSchema.safeParse(formObject(formData))
  if (!parsed.success) {
    redirect(`/hq/clients/${id}?error=${encodeURIComponent(firstIssue(parsed.error))}`)
  }

  let failure: string | null = null
  try {
    await updateClient(id, parsed.data)
  } catch (error) {
    failure = error instanceof StoreError ? error.message : 'The change could not be saved.'
  }

  // redirect() works by throwing, so it must sit outside the try block.
  if (failure) redirect(`/hq/clients/${id}?error=${encodeURIComponent(failure)}`)
  redirect(`/hq/clients/${id}?saved=1`)
}
