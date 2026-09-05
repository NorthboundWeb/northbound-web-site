import 'server-only'
import { CURRENCIES, FALLBACK_RATES, type Rates } from './currency'

/**
 * Live GBP exchange rates, fetched server-side only.
 *
 * Frankfurter publishes the ECB reference rates and needs no API key, so no
 * secret reaches the browser and the visitor's browser never talks to it —
 * rendering does not depend on a third party being up.
 *
 * Cached for a day. If the request fails, times out, or returns anything
 * unexpected, the stored fallback is returned and the page renders normally:
 * a currency conversion is a convenience, and it is never allowed to take the
 * pricing page down with it.
 */
export async function getRates(): Promise<Rates> {
  try {
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=GBP&to=EUR,USD',
      {
        next: { revalidate: 60 * 60 * 24 },
        signal: AbortSignal.timeout(2500),
      }
    )
    if (!res.ok) return FALLBACK_RATES

    const data: unknown = await res.json()
    const quoted =
      typeof data === 'object' && data !== null && 'rates' in data
        ? (data as { rates: unknown }).rates
        : null
    if (typeof quoted !== 'object' || quoted === null) return FALLBACK_RATES

    const record = quoted as Record<string, unknown>
    const rates: Rates = { ...FALLBACK_RATES }
    for (const currency of CURRENCIES) {
      if (currency === 'GBP') continue
      const value = record[currency]
      // Anything not a sane positive number keeps its fallback.
      if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        rates[currency] = value
      }
    }
    return rates
  } catch {
    return FALLBACK_RATES
  }
}
