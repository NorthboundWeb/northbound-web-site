'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { rateLimit } from '@/lib/rate-limit'
import { createCheckoutSession } from '@/lib/checkout/stripe'
import { scopeBySlug } from '@/lib/services'

/**
 * Starts checkout for one package.
 *
 * A server action, so the button works without JavaScript: the form posts,
 * Stripe is called on the server, and the browser is redirected. Nothing about
 * the price travels through the client.
 */
export async function startCheckout(formData: FormData): Promise<void> {
  const slug = String(formData.get('scope') ?? '')

  // Custom is quoted, not purchasable. Sending it to the enquiry form here
  // means the no-JavaScript path lands somewhere correct too, rather than
  // bouncing off Stripe with an error the visitor did not cause.
  const scope = scopeBySlug(slug)
  if (scope && !scope.checkout) redirect(`/contact?package=${scope.slug}`)

  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  const ip =
    forwarded?.split(',')[0]?.trim() || headerList.get('x-real-ip') || 'unknown'

  // Session creation is a paid API call, so it is worth limiting even though
  // nothing is charged until the customer reaches Stripe.
  const limited = rateLimit(`checkout:${ip}`, {
    limit: 12,
    windowMs: 10 * 60 * 1000,
  })
  if (!limited.ok) redirect('/web/services?checkout=throttled#builds')

  const origin = headerList.get('origin') ?? undefined
  const result = await createCheckoutSession(slug, origin)

  // redirect() throws, so it must sit outside any try/catch above it.
  if (!result.ok) redirect(`/web/services?checkout=${result.reason}#builds`)
  redirect(result.url)
}
