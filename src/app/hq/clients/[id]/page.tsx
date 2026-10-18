import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireHq } from '@/lib/hq/auth'
import { driveFolders, onboardingChecklist } from '@/lib/hq/checklist'
import { UUID_PATTERN } from '@/lib/hq/form'
import { CLIENT_STATUSES } from '@/lib/hq/schemas'
import { StoreError, getClient, storeConfigured, type ClientRecord } from '@/lib/hq/store'
import { buildPackages, managementPlans } from '@/lib/services'
import { saveClient } from '../actions'
import {
  Field,
  Notice,
  PageHeader,
  Panel,
  StatusPill,
  buttonClass,
  ghostButtonClass,
  inputClass,
} from '../../_components/ui'

export const metadata: Metadata = { title: 'Client' }

const BRIEF_LABELS: Record<string, string> = {
  pages: 'Pages needed',
  goals: 'Goals',
  brand_assets: 'Logo and brand',
  copy_status: 'Copy',
  photos_status: 'Photos',
  integrations: 'Integrations',
  deadline: 'Deadline or event',
  notes: 'Notes from intake',
}

/** A select that also keeps a stored value which is no longer in the list. */
function OptionList({ options, current }: { options: string[]; current: string | null }) {
  const all = current && !options.includes(current) ? [current, ...options] : options
  return (
    <>
      {all.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </>
  )
}

export default async function ClientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; created?: string; emailed?: string; error?: string }>
}) {
  await requireHq()
  const { id } = await params
  const flags = await searchParams
  if (!UUID_PATTERN.test(id) || !storeConfigured()) notFound()

  let client: ClientRecord | null
  try {
    client = await getClient(id)
  } catch (error) {
    return <Notice tone="error">{error instanceof StoreError ? error.message : 'The client could not be loaded.'}</Notice>
  }
  if (!client) notFound()

  const siteToAudit = client.domain || client.current_website
  const briefEntries = Object.entries(client.brief ?? {}).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].trim() !== ''
  )
  const buildOptions = buildPackages.map((pkg) => `${pkg.name} build`)
  const planOptions = managementPlans.map((plan) => plan.name)
  const save = saveClient.bind(null, client.id)

  return (
    <>
      <PageHeader eyebrow="Client" title={client.name}>
        <div className="flex flex-wrap items-center gap-4">
          <StatusPill status={client.status} />
          <Link href="/hq/clients" className="text-sm text-chalk-muted underline-offset-4 hover:underline">
            Back to all clients
          </Link>
        </div>
      </PageHeader>

      {flags.created ? <Notice tone="success">Client saved.{flags.emailed ? ' A copy of the brief was emailed to you.' : ''}</Notice> : null}
      {flags.saved ? <Notice tone="success">Changes saved.</Notice> : null}
      {flags.error ? <Notice tone="error">{flags.error}</Notice> : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <form action={save} className="space-y-8">
          <Panel title="Details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Business name" htmlFor="name">
                <input id="name" name="name" required defaultValue={client.name} maxLength={200} className={inputClass} />
              </Field>
              <Field label="Status" htmlFor="status">
                <select id="status" name="status" defaultValue={client.status} className={inputClass}>
                  {CLIENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Contact name" htmlFor="contact_name">
                <input id="contact_name" name="contact_name" defaultValue={client.contact_name ?? ''} className={inputClass} />
              </Field>
              <Field label="Contact email" htmlFor="contact_email">
                <input id="contact_email" name="contact_email" type="email" defaultValue={client.contact_email ?? ''} className={inputClass} />
              </Field>
              <Field label="Contact phone" htmlFor="contact_phone">
                <input id="contact_phone" name="contact_phone" type="tel" defaultValue={client.contact_phone ?? ''} className={inputClass} />
              </Field>
              <Field label="Current website" htmlFor="current_website">
                <input id="current_website" name="current_website" defaultValue={client.current_website ?? ''} className={inputClass} />
              </Field>
            </div>
          </Panel>

          <Panel title="Domain and hosting">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Domain" htmlFor="domain">
                <input id="domain" name="domain" defaultValue={client.domain ?? ''} className={inputClass} />
              </Field>
              <Field label="Registrar" htmlFor="registrar" hint="Name only. Never store logins here.">
                <input id="registrar" name="registrar" defaultValue={client.registrar ?? ''} className={inputClass} />
              </Field>
              <Field label="Domain renewal date" htmlFor="domain_renewal">
                <input id="domain_renewal" name="domain_renewal" type="date" defaultValue={client.domain_renewal ?? ''} className={inputClass} />
              </Field>
              <Field label="Vercel project" htmlFor="vercel_project" hint="The project name, used to show the last deploy.">
                <input id="vercel_project" name="vercel_project" defaultValue={client.vercel_project ?? ''} className={inputClass} />
              </Field>
              <Field label="GitHub repository" htmlFor="github_repo" hint="owner/name">
                <input id="github_repo" name="github_repo" defaultValue={client.github_repo ?? ''} className={inputClass} />
              </Field>
            </div>
          </Panel>

          <Panel title="Plan and billing">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Build package" htmlFor="build_package">
                <select id="build_package" name="build_package" defaultValue={client.build_package ?? ''} className={inputClass}>
                  <option value="">None</option>
                  <OptionList options={buildOptions} current={client.build_package} />
                </select>
              </Field>
              <Field label="Management plan" htmlFor="management_plan">
                <select id="management_plan" name="management_plan" defaultValue={client.management_plan ?? ''} className={inputClass}>
                  <option value="">None</option>
                  <OptionList options={planOptions} current={client.management_plan} />
                </select>
              </Field>
              <Field label="Stripe customer ID" htmlFor="stripe_customer_id" hint="Starts with cus_. Used to show subscription status.">
                <input id="stripe_customer_id" name="stripe_customer_id" defaultValue={client.stripe_customer_id ?? ''} className={inputClass} />
              </Field>
            </div>
          </Panel>

          <Panel title="Notes">
            <label htmlFor="notes" className="sr-only">
              Notes
            </label>
            <textarea id="notes" name="notes" rows={5} maxLength={5000} defaultValue={client.notes ?? ''} className={inputClass} />
          </Panel>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className={buttonClass}>
              Save changes
            </button>
            {siteToAudit ? (
              <Link href={`/hq/audit?url=${encodeURIComponent(siteToAudit)}`} className={ghostButtonClass}>
                Audit {siteToAudit}
              </Link>
            ) : null}
          </div>
        </form>

        <aside className="space-y-8">
          {briefEntries.length > 0 ? (
            <Panel title="Intake brief">
              <dl className="space-y-4 text-sm">
                {briefEntries.map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-chalk-faint">
                      {BRIEF_LABELS[key] ?? key}
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap text-chalk-muted">{value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          ) : null}

          <Panel title="Drive folder">
            <p className="mb-3 text-sm text-chalk-muted">
              Create <strong className="text-chalk">Clients / {client.name}</strong> with:
            </p>
            <ul className="space-y-1 text-sm text-chalk-muted">
              {driveFolders.map((folder) => (
                <li key={folder}>└ {folder}</li>
              ))}
            </ul>
          </Panel>

          <Panel title="Onboarding checklist">
            <ol className="space-y-4 text-sm">
              {onboardingChecklist.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="mt-0.5 w-5 shrink-0 text-chalk-faint">{index + 1}.</span>
                  <div>
                    <p className="font-semibold text-chalk">
                      {step.title}
                      {step.risky ? <span className="ml-2 text-xs font-semibold uppercase tracking-[0.12em] text-orange">care</span> : null}
                    </p>
                    <p className="mt-1 text-chalk-faint">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </aside>
      </div>
    </>
  )
}
