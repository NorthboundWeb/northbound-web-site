import type { Metadata } from 'next'
import { requireHq } from '@/lib/hq/auth'
import { mailConfigured } from '@/lib/hq/mail'
import { COPY_STATUSES, PHOTO_STATUSES } from '@/lib/hq/schemas'
import { storeConfigured } from '@/lib/hq/store'
import { buildPackages, managementPlans } from '@/lib/services'
import { submitIntake } from './actions'
import { Field, Notice, PageHeader, Panel, buttonClass, inputClass } from '../_components/ui'

export const metadata: Metadata = { title: 'New client' }

export default async function IntakePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; emailed?: string }>
}) {
  await requireHq()
  const { error, emailed } = await searchParams
  const canStore = storeConfigured()
  const canMail = mailConfigured()

  return (
    <>
      <PageHeader eyebrow="Onboarding" title="New client">
        Capture the brief once, here. It creates the client in the register and can email you a copy.
      </PageHeader>

      {error ? <Notice tone="error">{error}</Notice> : null}
      {emailed ? <Notice tone="success">The brief was emailed to you.</Notice> : null}
      {!canStore ? (
        <Notice tone="info">
          Storage is not connected yet, so this form can only email the brief to you. See{' '}
          <strong>Clients</strong> for the setup steps.
        </Notice>
      ) : null}

      <form action={submitIntake} className="space-y-8">
        <Panel title="Who">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business name" htmlFor="name">
              <input id="name" name="name" required maxLength={200} className={inputClass} />
            </Field>
            <Field label="Contact name" htmlFor="contact_name">
              <input id="contact_name" name="contact_name" required maxLength={200} className={inputClass} />
            </Field>
            <Field label="Email" htmlFor="contact_email">
              <input id="contact_email" name="contact_email" type="email" required className={inputClass} />
            </Field>
            <Field label="Phone" htmlFor="contact_phone">
              <input id="contact_phone" name="contact_phone" type="tel" className={inputClass} />
            </Field>
            <Field label="Current website" htmlFor="current_website" hint="Leave blank if they have none.">
              <input id="current_website" name="current_website" inputMode="url" className={inputClass} />
            </Field>
            <Field label="Domain" htmlFor="domain" hint="The one the new site will live on.">
              <input id="domain" name="domain" inputMode="url" className={inputClass} />
            </Field>
          </div>
        </Panel>

        <Panel title="What they are buying">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Build package" htmlFor="build_package">
              <select id="build_package" name="build_package" defaultValue="" className={inputClass}>
                <option value="">Not decided</option>
                {buildPackages.map((pkg) => (
                  <option key={pkg.slug} value={`${pkg.name} build`}>
                    {pkg.name} build
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Management plan" htmlFor="management_plan" hint="Optional. A plan is never a condition of having a site built.">
              <select id="management_plan" name="management_plan" defaultValue="" className={inputClass}>
                <option value="">None</option>
                {managementPlans.map((plan) => (
                  <option key={plan.slug} value={plan.name}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Panel>

        <Panel title="The brief">
          <div className="space-y-5">
            <Field label="Pages needed" htmlFor="pages" hint="Home, About, Services, Contact… one per line is fine.">
              <textarea id="pages" name="pages" rows={3} maxLength={3000} className={inputClass} />
            </Field>
            <Field label="What the site needs to achieve" htmlFor="goals">
              <textarea id="goals" name="goals" rows={3} maxLength={3000} className={inputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Copy" htmlFor="copy_status">
                <select id="copy_status" name="copy_status" defaultValue="Not discussed yet" className={inputClass}>
                  {COPY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Photos" htmlFor="photos_status">
                <select id="photos_status" name="photos_status" defaultValue="Not discussed yet" className={inputClass}>
                  {PHOTO_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Logo and brand" htmlFor="brand_assets" hint="Do they have a logo, colours, fonts? Brand design is not in the fixed packages.">
              <textarea id="brand_assets" name="brand_assets" rows={2} maxLength={1500} className={inputClass} />
            </Field>
            <Field label="Integrations" htmlFor="integrations" hint="Booking, mailing list, maps… connecting an existing third-party service is one thing; bespoke systems are quoted separately.">
              <textarea id="integrations" name="integrations" rows={2} maxLength={1500} className={inputClass} />
            </Field>
            <Field label="Deadline or event" htmlFor="deadline" hint="Timelines are estimates, so note any hard date.">
              <input id="deadline" name="deadline" maxLength={200} className={inputClass} />
            </Field>
            <Field label="Anything else" htmlFor="notes">
              <textarea id="notes" name="notes" rows={3} maxLength={5000} className={inputClass} />
            </Field>
          </div>
        </Panel>

        <div className="flex flex-wrap items-center gap-6">
          <button type="submit" className={buttonClass}>
            Save client
          </button>
          <label className="flex items-center gap-2 text-sm text-chalk-muted">
            <input
              type="checkbox"
              name="email_copy"
              defaultChecked={canMail}
              disabled={!canMail}
              className="size-4 accent-orange"
            />
            Email me a copy{canMail ? '' : ' (Resend not set up)'}
          </label>
        </div>
      </form>
    </>
  )
}
