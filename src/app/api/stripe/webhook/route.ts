import { after } from 'next/server'
import { constructWebhookEvent } from '@/lib/checkout/stripe'

/**
 * Stripe webhook receiver.
 *
 * This is the only place a payment may be treated as real. A customer landing
 * on the success page proves a browser followed a URL; this proves Stripe
 * charged a card, because the payload is signed and verified before it is
 * read.
 *
 * Currently it verifies, logs and acknowledges. There is no database yet, so
 * there is nothing to write — but the door is built correctly, so adding a
 * record later is a few lines inside the switch rather than a rethink.
 */

/** Signature verification needs the exact bytes Stripe sent. */
export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing signature', { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    // Fail closed. Without the secret nothing can be verified, and accepting
    // unverified payment events would be worse than rejecting real ones.
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set')
    return new Response('Webhook not configured', { status: 503 })
  }

  const rawBody = await request.text()

  let event
  try {
    event = constructWebhookEvent(rawBody, signature)
  } catch (error) {
    console.error(
      `[stripe-webhook] signature verification failed: ${
        error instanceof Error ? error.name : 'unknown'
      }`
    )
    return new Response('Invalid signature', { status: 400 })
  }

  // Acknowledge fast. Stripe retries on a slow or failed response, so the
  // work happens after the 200 rather than inside the request.
  after(() => {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        // Deliberately minimal: enough to reconcile a payment to a package,
        // without writing a customer's details into the platform log.
        console.log(
          `[stripe-webhook] paid: ${session.metadata?.scopeName ?? 'unknown package'} — ${
            session.amount_total ?? 0
          } ${session.currency ?? 'gbp'} — session ${session.id}`
        )
        break
      }
      case 'checkout.session.expired':
        console.log(`[stripe-webhook] session expired: ${event.data.object.id}`)
        break
      default:
        // Everything else is acknowledged and ignored on purpose. Reacting to
        // event types we have not designed for is how duplicate work starts.
        break
    }
  })

  return Response.json({ received: true })
}
