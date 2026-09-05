/**
 * Money for Northbound.
 *
 * Every price on the site is stored ONCE, in this codebase, as an integer
 * number of GBP pence. Nothing else is a source of truth: no component holds a
 * converted figure, no page hard-codes "€349", and no display value is ever
 * rounded back into the stored price.
 *
 * GBP is the contractual currency. EUR and USD exist so a visitor can judge
 * the cost in money they think in — they are explicitly labelled approximate
 * everywhere they appear, and quotes, contracts and payments are settled in
 * GBP regardless of what the visitor selected.
 */

export const CURRENCIES = ['GBP', 'EUR', 'USD'] as const
export type Currency = (typeof CURRENCIES)[number]
export const DEFAULT_CURRENCY: Currency = 'GBP'

export const CURRENCY_LABELS: Record<Currency, string> = {
  GBP: 'Pounds (GBP)',
  EUR: 'Euro (EUR)',
  USD: 'US dollars (USD)',
}

export function isCurrency(value: unknown): value is Currency {
  return typeof value === 'string' && (CURRENCIES as readonly string[]).includes(value)
}

/** Rate per £1. GBP is always exactly 1. */
export type Rates = Record<Currency, number>

/**
 * Fallback rates, used when the live source cannot be reached.
 *
 * Deliberately conservative and clearly stale-able: the page still renders,
 * the figure is still in the right ballpark, and the "approximate" label
 * beside it is doing the honest work. Update occasionally; nothing breaks if
 * it drifts, because no contract is priced from it.
 *
 * Recorded 2026-09 from the ECB reference rates.
 */
export const FALLBACK_RATES: Rates = { GBP: 1, EUR: 1.16, USD: 1.27 }

/**
 * Formats an integer number of GBP pence into the visitor's currency.
 *
 * Whole pounds are shown without decimals — every published price is a whole
 * number of pounds, and "£249.00" reads like a checkout, not a price list.
 * Converted amounts are rounded to a whole unit for the same reason; the
 * approximate label carries the imprecision.
 */
export function formatMoney(
  pence: number,
  currency: Currency = DEFAULT_CURRENCY,
  rates: Rates = FALLBACK_RATES
): string {
  const rate = rates[currency]
  // A missing or nonsensical rate must never render NaN, 0 or a skeleton.
  const safeRate = Number.isFinite(rate) && rate > 0 ? rate : FALLBACK_RATES[currency]
  const amount = (pence / 100) * safeRate

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(currency === 'GBP' ? pence / 100 : Math.round(amount))
}

/** True when the displayed figure is a conversion rather than the real price. */
export function isApproximate(currency: Currency): boolean {
  return currency !== DEFAULT_CURRENCY
}
