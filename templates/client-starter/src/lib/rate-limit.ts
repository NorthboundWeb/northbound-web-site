/**
 * Minimal fixed-window rate limiter held in module memory.
 *
 * Enough to make casual form spam costly. Serverless instances do not share
 * memory, so the limit is per warm instance rather than global; if the site
 * ever gains a login or payment path, swap this for a shared store.
 */
type Window = { count: number; resetAt: number }

const windows = new Map<string, Window>()
const MAX_KEYS = 5_000

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  const existing = windows.get(key)

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_KEYS) {
      for (const [k, v] of windows) if (v.resetAt <= now) windows.delete(k)
    }
    windows.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterSeconds: 0 }
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) }
  }

  existing.count += 1
  return { ok: true, retryAfterSeconds: 0 }
}
