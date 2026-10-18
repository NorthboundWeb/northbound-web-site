'use server'

import { redirect } from 'next/navigation'
import { requireHq } from '@/lib/hq/auth'
import { formObject } from '@/lib/hq/form'
import { mailConfigured, sendOwnerNote } from '@/lib/hq/mail'
import { firstIssue, intakeSchema } from '@/lib/hq/schemas'
import { StoreError, createClientFromIntake, storeConfigured } from '@/lib/hq/store'

export async function submitIntake(formData: FormData) {
  await requireHq()

  const fields = formObject(formData)
  const parsed = intakeSchema.safeParse(fields)
  if (!parsed.success) {
    redirect(`/hq/intake?error=${encodeURIComponent(firstIssue(parsed.error))}`)
  }
  const intake = parsed.data

  const wantsCopy = fields.email_copy === 'on'
  const canStore = storeConfigured()
  const canMail = mailConfigured()

  if (!canStore && !(wantsCopy && canMail)) {
    redirect(
      `/hq/intake?error=${encodeURIComponent(
        'Nothing could be saved: storage is not connected and email is off. Connect Supabase, or tick "Email me a copy" with Resend set up.'
      )}`
    )
  }

  let createdId: string | null = null
  let failure: string | null = null
  if (canStore) {
    try {
      createdId = (await createClientFromIntake(intake)).id
    } catch (error) {
      failure = error instanceof StoreError ? error.message : 'The brief could not be saved.'
    }
  }
  if (failure) redirect(`/hq/intake?error=${encodeURIComponent(failure)}`)

  let emailed = false
  if (wantsCopy && canMail) {
    emailed = await sendOwnerNote(`New client brief — ${intake.name}`, [
      ['Business', intake.name],
      ['Contact', intake.contact_name],
      ['Email', intake.contact_email],
      ['Phone', intake.contact_phone],
      ['Current website', intake.current_website],
      ['Domain', intake.domain],
      ['Build package', intake.build_package],
      ['Management plan', intake.management_plan],
      ['Pages', intake.pages],
      ['Goals', intake.goals],
      ['Brand assets', intake.brand_assets],
      ['Copy', intake.copy_status],
      ['Photos', intake.photos_status],
      ['Integrations', intake.integrations],
      ['Deadline', intake.deadline],
      ['Notes', intake.notes],
    ])
  }

  if (createdId) redirect(`/hq/clients/${createdId}?created=1${emailed ? '&emailed=1' : ''}`)
  redirect('/hq/intake?emailed=1')
}
