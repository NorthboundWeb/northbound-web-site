import 'server-only'
import { cookies } from 'next/headers'
import { DEFAULT_CURRENCY, isCurrency, type Currency } from '@/lib/money/currency'
import { CURRENCY_COOKIE } from './cookies'

/**
 * The visitor's display currency, resolved on the server.
 *
 * Reading a cookie opts the route out of static generation. That is a
 * deliberate trade: a price is the single most important thing on the pricing
 * page, and rendering it correctly in the first response beats shaving a few
 * milliseconds off a cached one. Anything unrecognised falls back to GBP.
 */
export async function getCurrency(): Promise<Currency> {
  const value = (await cookies()).get(CURRENCY_COOKIE)?.value
  return isCurrency(value) ? value : DEFAULT_CURRENCY
}
