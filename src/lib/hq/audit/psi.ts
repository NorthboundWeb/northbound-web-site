import type { PageSpeed } from './types'

/**
 * Optional lab measurements from Google's PageSpeed Insights API.
 *
 * This is the one place the audit asks a third party to load the target site.
 * It is soft-failing by design: PageSpeed is slow, rate-limited without a key
 * and sometimes simply declines, and none of that should sink the rest of the
 * report. Returns null on any problem; the caller notes the gap.
 *
 * Set PAGESPEED_API_KEY (server-side) to lift the anonymous rate limit.
 */
export async function fetchPageSpeed(
  url: string,
  timeoutMs = 50_000
): Promise<PageSpeed | null> {
  const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  endpoint.searchParams.set('url', url)
  endpoint.searchParams.set('strategy', 'mobile')
  endpoint.searchParams.set('category', 'performance')
  const key = process.env.PAGESPEED_API_KEY
  if (key) endpoint.searchParams.set('key', key)

  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(timeoutMs),
      cache: 'no-store',
    })
    if (!response.ok) return null

    const data = (await response.json()) as {
      lighthouseResult?: {
        categories?: { performance?: { score?: number | null } }
        audits?: Record<string, { numericValue?: number }>
      }
    }
    const lab = data.lighthouseResult
    if (!lab) return null

    const audit = (id: string) => lab.audits?.[id]?.numericValue ?? null
    const score = lab.categories?.performance?.score
    return {
      performanceScore: typeof score === 'number' ? Math.round(score * 100) : null,
      lcpMs: audit('largest-contentful-paint'),
      cls: audit('cumulative-layout-shift'),
      tbtMs: audit('total-blocking-time'),
      fcpMs: audit('first-contentful-paint'),
    }
  } catch {
    return null
  }
}
