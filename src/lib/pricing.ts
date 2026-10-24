/**
 * Small price helpers shared by the Start flow (browser) and the server action
 * that re-checks it. Nothing in here knows about any promo code: the codes
 * themselves live in src/lib/contact/promos.ts, which only the server imports.
 */

export type Discount = { kind: 'amount' | 'percent'; value: number }

/** £249, £174.30. Whole pounds drop the pence; anything else keeps two places. */
export function money(n: number) {
  const rounded = Math.round(n * 100) / 100
  return '£' + (Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2))
}

/** A build price after a code, never below zero. */
export function discounted(price: number, discount: Discount | null) {
  if (!discount) return price
  const off =
    discount.kind === 'percent' ? (price * discount.value) / 100 : discount.value
  return Math.max(0, Math.round((price - off) * 100) / 100)
}
