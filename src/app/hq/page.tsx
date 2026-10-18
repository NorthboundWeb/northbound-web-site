import type { Metadata } from 'next'
import Link from 'next/link'
import { requireHq } from '@/lib/hq/auth'
import { mailConfigured } from '@/lib/hq/mail'
import { listClients, storeConfigured, type ClientRecord } from '@/lib/hq/store'
import { PageHeader, Panel, cn } from './_components/ui'

export const metadata: Metadata = { title: 'Home' }

const tools = [
  {
    href: '/hq/clients',
    title: 'Client register',
    body: 'Every client, domain, renewal date, subscription and last deploy.',
  },
  {
    href: '/hq/intake',
    title: 'New client',
    body: 'Capture a brief once. It creates the client and can email you a copy.',
  },
  {
    href: '/hq/audit',
    title: 'Site audit',
    body: 'Health-check any website and download a branded PDF report.',
  },
  {
    href: '/hq/template',
    title: 'Starter kit',
    body: 'The reusable base for a new client site, and the launch checklist.',
  },
]

function daysUntil(date: string | null): number | null {
  if (!date) return null
  const target = new Date(`${date}T00:00:00Z`).getTime()
  return Number.isNaN(target) ? null : Math.ceil((target - Date.now()) / 86_400_000)
}

function Connection({ label, on, detail }: { label: string; on: boolean; detail: string }) {
  return (
    <li className="flex items-start gap-3 text-sm">
      <span
        aria-hidden
        className={cn('mt-1.5 size-2 shrink-0 rounded-full', on ? 'bg-yellow' : 'bg-line-strong')}
      />
      <span>
        <span className="font-semibold text-chalk">{label}</span>
        <span className="ml-2 text-chalk-faint">{on ? 'connected' : 'not connected'}</span>
        <span className="mt-0.5 block text-xs text-chalk-faint">{detail}</span>
      </span>
    </li>
  )
}

export default async function HqHome() {
  await requireHq()

  let clients: ClientRecord[] = []
  if (storeConfigured()) {
    try {
      clients = await listClients()
    } catch {
      clients = []
    }
  }

  const active = clients.filter((c) => c.status !== 'archived')
  const renewals = active
    .map((client) => ({ client, days: daysUntil(client.domain_renewal) }))
    .filter((entry): entry is { client: ClientRecord; days: number } => entry.days !== null && entry.days <= 60)
    .sort((a, b) => a.days - b.days)

  return (
    <>
      <PageHeader eyebrow="Private" title="Northbound HQ">
        Your workspace for running the business. Only you can see it.
      </PageHeader>

      <div className="mb-10 grid gap-5 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group border border-line bg-char p-6 transition-colors hover:border-orange"
          >
            <h2 className="mb-2 text-lg font-semibold text-chalk">{tool.title}</h2>
            <p className="text-sm text-chalk-muted">{tool.body}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel title="Renewals in the next 60 days">
          {!storeConfigured() ? (
            <p className="text-sm text-chalk-faint">Connect storage to track renewals.</p>
          ) : renewals.length === 0 ? (
            <p className="text-sm text-chalk-faint">Nothing due soon.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {renewals.map(({ client, days }) => (
                <li key={client.id} className="flex items-baseline justify-between gap-4">
                  <Link href={`/hq/clients/${client.id}`} className="font-semibold underline-offset-4 hover:underline">
                    {client.name}
                  </Link>
                  <span className={cn(days < 0 ? 'text-orange' : days <= 30 ? 'text-yellow' : 'text-chalk-muted')}>
                    {client.domain ?? 'domain'} ·{' '}
                    {days < 0 ? `${-days} days overdue` : days === 0 ? 'today' : `${days} days`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Connections">
          <ul className="space-y-4">
            <Connection
              label="Client storage (Supabase)"
              on={storeConfigured()}
              detail="HQ_SUPABASE_URL and HQ_SUPABASE_SERVICE_KEY"
            />
            <Connection
              label="Email (Resend)"
              on={mailConfigured()}
              detail="RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL"
            />
            <Connection
              label="Deploy status (Vercel)"
              on={Boolean(process.env.VERCEL_API_TOKEN)}
              detail="VERCEL_API_TOKEN, plus VERCEL_TEAM_ID for a team"
            />
            <Connection
              label="Subscription status (Stripe)"
              on={Boolean(process.env.STRIPE_SECRET_KEY)}
              detail="STRIPE_SECRET_KEY: a restricted, read-only key"
            />
            <Connection
              label="Google PageSpeed"
              on={Boolean(process.env.PAGESPEED_API_KEY)}
              detail="PAGESPEED_API_KEY (optional; works without it at a lower rate limit)"
            />
          </ul>
          <p className="mt-5 text-xs text-chalk-faint">
            Set in Vercel → Project → Settings → Environment Variables, then redeploy.
          </p>
        </Panel>
      </div>
    </>
  )
}
