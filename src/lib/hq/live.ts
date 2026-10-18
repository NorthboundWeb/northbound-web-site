import 'server-only'
import type { ClientRecord } from './store'

/**
 * Live signals for the register: last deploy (Vercel) and subscription status
 * (Stripe). Both are optional and soft-failing. A missing key, a slow API or a
 * wrong ID shows a dash, never a broken page.
 *
 * Environment variables (server-side only):
 *   VERCEL_API_TOKEN   a Vercel access token (read access is enough)
 *   VERCEL_TEAM_ID     the team ID, if projects live under a team
 *   STRIPE_SECRET_KEY  use a RESTRICTED key with read-only access to
 *                      Subscriptions. While developing, a test-mode key.
 */

export type DeploySignal = { state: string; createdAt: number; url: string | null }
export type StripeSignal = { status: string; testMode: boolean }

export type LiveSignals = {
  deploys: Map<string, DeploySignal | null>
  stripe: Map<string, StripeSignal | null>
  vercelConnected: boolean
  stripeConnected: boolean
}

const TIMEOUT_MS = 6_000

async function lastDeploy(project: string): Promise<DeploySignal | null> {
  const token = process.env.VERCEL_API_TOKEN
  if (!token) return null
  const url = new URL('https://api.vercel.com/v6/deployments')
  url.searchParams.set('projectId', project)
  url.searchParams.set('limit', '1')
  if (process.env.VERCEL_TEAM_ID) url.searchParams.set('teamId', process.env.VERCEL_TEAM_ID)

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) return null
    const data = (await response.json()) as {
      deployments?: Array<{ state?: string; readyState?: string; created?: number; url?: string }>
    }
    const latest = data.deployments?.[0]
    if (!latest) return null
    return {
      state: latest.state ?? latest.readyState ?? 'UNKNOWN',
      createdAt: latest.created ?? 0,
      url: latest.url ?? null,
    }
  } catch {
    return null
  }
}

async function subscriptionStatus(customerId: string): Promise<StripeSignal | null> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  const url = new URL('https://api.stripe.com/v1/subscriptions')
  url.searchParams.set('customer', customerId)
  url.searchParams.set('status', 'all')
  url.searchParams.set('limit', '1')

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${key}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) return null
    const data = (await response.json()) as { data?: Array<{ status?: string }> }
    return {
      status: data.data?.[0]?.status ?? 'none',
      testMode: /^(sk|rk)_test_/.test(key),
    }
  } catch {
    return null
  }
}

export async function loadLiveSignals(clients: ClientRecord[]): Promise<LiveSignals> {
  const deploys = new Map<string, DeploySignal | null>()
  const stripe = new Map<string, StripeSignal | null>()

  await Promise.all(
    clients.flatMap((client) => [
      client.vercel_project
        ? lastDeploy(client.vercel_project).then((signal) => {
            deploys.set(client.id, signal)
          })
        : Promise.resolve(),
      client.stripe_customer_id
        ? subscriptionStatus(client.stripe_customer_id).then((signal) => {
            stripe.set(client.id, signal)
          })
        : Promise.resolve(),
    ])
  )

  return {
    deploys,
    stripe,
    vercelConnected: Boolean(process.env.VERCEL_API_TOKEN),
    stripeConnected: Boolean(process.env.STRIPE_SECRET_KEY),
  }
}
