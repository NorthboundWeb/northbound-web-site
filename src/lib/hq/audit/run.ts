import 'server-only'
import { normaliseUrl, runAudit } from './checks'
import type { AuditResult } from './types'

/**
 * Runs an audit, remembering the result briefly.
 *
 * The audit page and the PDF download are separate requests for the same URL.
 * Without this, pressing "Download PDF" would re-fetch the whole site and wait
 * for PageSpeed a second time. The cache lives in module memory, so it is only
 * a convenience on a warm instance: a miss just means the audit runs again.
 */

const TTL_MS = 10 * 60 * 1000
const MAX_ENTRIES = 20

const cache = new Map<string, { at: number; result: AuditResult }>()

export async function runAuditCached(
  input: string,
  options: { pageSpeed: boolean }
): Promise<AuditResult> {
  const url = normaliseUrl(input)
  const key = `${options.pageSpeed ? 'ps' : 'nops'}:${url}`
  const now = Date.now()

  const hit = cache.get(key)
  if (hit && now - hit.at < TTL_MS) return hit.result

  const result = await runAudit(url, { pageSpeed: options.pageSpeed })

  if (cache.size >= MAX_ENTRIES) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].at - b[1].at)[0]
    if (oldest) cache.delete(oldest[0])
  }
  cache.set(key, { at: now, result })
  return result
}
