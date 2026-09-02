import 'server-only'

/**
 * The one switch that decides whether the site talks about paying online.
 *
 * Two conditions, both required, and the default is off:
 *
 *   CHECKOUT_ENABLED=true   an explicit decision that the flow is ready
 *   STRIPE_SECRET_KEY       the credentials to actually take a payment
 *
 * A Stripe key on its own is not enough. Setting a key while testing must
 * never quietly start telling visitors they can pay online — the site
 * promised an enquiry-and-invoice process and has to keep promising it until
 * someone deliberately flips this.
 *
 * When this is false, no checkout language, button or Klarna note may render
 * anywhere. The Stripe code stays in the repository, wired and tested, ready
 * for the day the flag goes on.
 */
export function isCheckoutEnabled(): boolean {
  return (
    process.env.CHECKOUT_ENABLED === 'true' &&
    Boolean(process.env.STRIPE_SECRET_KEY)
  )
}
