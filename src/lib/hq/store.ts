import 'server-only'
import type { ClientStatus, ClientUpdate, Intake } from './schemas'

/**
 * Client register storage, over Supabase's REST interface.
 *
 * Plain fetch rather than the Supabase client library: this uses four
 * operations on one table, and a dependency is more surface than that needs.
 * The service-role key is read from the environment, used only on the server,
 * and never exposed to the browser.
 *
 * Required environment variables (Vercel → Project → Settings → Environment
 * Variables):
 *   HQ_SUPABASE_URL           e.g. https://abcd1234.supabase.co
 *   HQ_SUPABASE_SERVICE_KEY   the service_role key. Server-side only.
 */

export type ClientRecord = {
  id: string
  name: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  status: ClientStatus
  current_website: string | null
  domain: string | null
  registrar: string | null
  domain_renewal: string | null
  build_package: string | null
  management_plan: string | null
  vercel_project: string | null
  github_repo: string | null
  stripe_customer_id: string | null
  notes: string | null
  brief: Record<string, unknown>
  created_at: string
  updated_at: string
}

export class StoreError extends Error {}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function config(): { url: string; key: string } | null {
  const url = process.env.HQ_SUPABASE_URL?.replace(/\/+$/, '')
  const key = process.env.HQ_SUPABASE_SERVICE_KEY
  return url && key ? { url, key } : null
}

export function storeConfigured(): boolean {
  return config() !== null
}

async function request<T>(
  path: string,
  init: { method?: string; body?: unknown; single?: boolean } = {}
): Promise<T> {
  const cfg = config()
  if (!cfg) throw new StoreError('Storage is not connected.')

  const response = await fetch(`${cfg.url}/rest/v1/${path}`, {
    method: init.method ?? 'GET',
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.single ? { Accept: 'application/vnd.pgrst.object+json' } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    // The body can name tables and columns; log it, do not show it.
    console.error('HQ store error', response.status, await response.text().catch(() => ''))
    throw new StoreError(
      response.status === 404 || response.status === 406
        ? 'Not found.'
        : 'The register could not be reached. Check the Supabase settings.'
    )
  }
  return (await response.json()) as T
}

export async function listClients(): Promise<ClientRecord[]> {
  return request<ClientRecord[]>('hq_clients?select=*&order=created_at.desc')
}

export async function getClient(id: string): Promise<ClientRecord | null> {
  if (!UUID.test(id)) return null
  try {
    return await request<ClientRecord>(`hq_clients?id=eq.${id}&select=*`, { single: true })
  } catch (error) {
    if (error instanceof StoreError && error.message === 'Not found.') return null
    throw error
  }
}

export async function updateClient(id: string, patch: ClientUpdate): Promise<ClientRecord> {
  if (!UUID.test(id)) throw new StoreError('Not found.')
  return request<ClientRecord>(`hq_clients?id=eq.${id}`, {
    method: 'PATCH',
    body: patch,
    single: true,
  })
}

export async function createClientFromIntake(intake: Intake): Promise<ClientRecord> {
  const { name, contact_name, contact_email, contact_phone, current_website, domain, build_package, management_plan, ...brief } =
    intake
  return request<ClientRecord>('hq_clients', {
    method: 'POST',
    single: true,
    body: {
      name,
      contact_name,
      contact_email,
      contact_phone,
      current_website,
      domain,
      build_package,
      management_plan,
      status: 'intake',
      brief,
    },
  })
}
