/** Discount codes for the store. Percent taken off priced items; "price on request" items are unchanged. */
export const DISCOUNTS: Record<string, { percent: number; label: string }> = {
  NBFAMILY: { percent: 50, label: 'Half price' },
  NBPROMO: { percent: 30, label: '30% off' },
}

export function findDiscount(code: string) {
  const key = code.trim().toUpperCase().replace(/\s+/g, '')
  const d = DISCOUNTS[key]
  return d ? { code: key, percent: d.percent, label: d.label } : null
}

export const discounted = (price: number, percent: number) => Math.round(price * (100 - percent)) / 100
