import type { Metadata } from 'next'
import Link from 'next/link'
import { requireHq } from '@/lib/hq/auth'
import { loadLiveSignals, type LiveSignals } from '@/lib/hq/live'
import { StoreError, listClients, storeConfigured, type ClientRecord } from '@/lib/hq/store'
import { StorageSetup } from '../_components/setup-panel'
import { Notice, PageHeader, StatusPill, buttonClass, cn } from '../_components/ui'

export const metadata: Metadata = { title: 'Clients' }

function daysUntil(date: string | null): number | null {
  if (!date) return null
  const target = new Date(`${date}T00:00:00Z`).getTime()
  if (Number.isNaN(target)) return null
  return Math.ceil((target - Date.now()) / 86_400_000)
}

function renewalCell(date: string | null) {
  const days = daysUntil(date)
  if (days === null) return <span className="text-chalk-faint">–</span>
  const label = new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return (
    <span className={cn(days < 0 ? 'text-orange' : days <= 30 ? 'text-yellow' : 'text-chalk-muted')}>
      {label}
      <span className="ml-2 text-xs">
        {days < 0 ? `${-days}d overdue` : days === 0 ? 'today' : `${days}d`}
      </span>
    </span>
  )
}

function deployCell(client: ClientRecord, live: LiveSignals | null) {
  if (!client.vercel_project) return <span className="text-chalk-faint">–</span>
  if (!live?.vercelConnected) return <span className="text-chalk-faint">not connected</span>
  const signal = live.deploys.get(client.id)
  if (!signal) return <span className="text-chalk-faint">unavailable</span>
  const when = new Date(signal.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/London',
  })
  return (
    <span className={signal.state === 'ERROR' ? 'text-orange' : 'text-chalk-muted'}>
      {signal.state.toLowerCase()} · {when}
    </span>
  )
}

function stripeCell(client: ClientRecord, live: LiveSignals | null) {
  if (!client.stripe_customer_id) return <span className="text-chalk-faint">–</span>
  if (!live?.stripeConnected) return <span className="text-chalk-faint">not connected</span>
  const signal = live.stripe.get(client.id)
  if (!signal) return <span className="text-chalk-faint">unavailable</span>
  const bad = ['past_due', 'unpaid', 'canceled', 'incomplete_expired'].includes(signal.status)
  return (
    <span className={bad ? 'text-orange' : 'text-chalk-muted'}>
      {signal.status.replace(/_/g, ' ')}
      {signal.testMode ? <span className="ml-1 text-xs text-chalk-faint">(test)</span> : null}
    </span>
  )
}

export default async function ClientsPage() {
  await requireHq()

  let clients: ClientRecord[] = []
  let loadError: string | null = null
  if (storeConfigured()) {
    try {
      clients = await listClients()
    } catch (error) {
      loadError = error instanceof StoreError ? error.message : 'The register could not be loaded.'
    }
  }
  const live = clients.length > 0 ? await loadLiveSignals(clients) : null
  const active = clients.filter((c) => c.status !== 'archived')

  return (
    <>
      <PageHeader eyebrow="Register" title="Clients">
        Every client, domain, renewal and subscription in one place.
      </PageHeader>

      {!storeConfigured() ? <StorageSetup /> : null}
      {loadError ? <Notice tone="error">{loadError}</Notice> : null}

      {storeConfigured() && !loadError ? (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-chalk-muted">
              {active.length} active {active.length === 1 ? 'client' : 'clients'}
              {clients.length !== active.length ? `, ${clients.length - active.length} archived` : ''}
            </p>
            <Link href="/hq/intake" className={buttonClass}>
              New client
            </Link>
          </div>

          {clients.length === 0 ? (
            <Notice tone="info">No clients yet. Add the first one from the New client form.</Notice>
          ) : (
            <div className="overflow-x-auto border border-line">
              <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
                <thead className="bg-char-sunk text-xs uppercase tracking-[0.14em] text-chalk-faint">
                  <tr>
                    {['Client', 'Status', 'Domain', 'Registrar', 'Renewal', 'Plan', 'Subscription', 'Last deploy'].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className={cn('border-t border-line', client.status === 'archived' && 'opacity-50')}>
                      <th scope="row" className="px-4 py-3 font-semibold">
                        <Link href={`/hq/clients/${client.id}`} className="underline-offset-4 hover:underline">
                          {client.name}
                        </Link>
                      </th>
                      <td className="px-4 py-3">
                        <StatusPill status={client.status} />
                      </td>
                      <td className="px-4 py-3 text-chalk-muted">{client.domain ?? '–'}</td>
                      <td className="px-4 py-3 text-chalk-muted">{client.registrar ?? '–'}</td>
                      <td className="px-4 py-3">{renewalCell(client.domain_renewal)}</td>
                      <td className="px-4 py-3 text-chalk-muted">{client.management_plan ?? '–'}</td>
                      <td className="px-4 py-3">{stripeCell(client, live)}</td>
                      <td className="px-4 py-3">{deployCell(client, live)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </>
  )
}
