import 'server-only'

import Stripe from 'stripe'
import { site } from '@/lib/site'
import { scopeBySlug, type BuildScope } from '@/lib/services'

/**
 * Stripe Checkout, server-side only.
 *
 * The single rule this file exists to enforce: **the amount is read from
 * `services.ts`, never from the request.** A browser can send any slug it
 * likes; the worst it can do is name a package that does not exist, or one
 * that is not purchasable. It can never name a price.
 *
 * Klarna and the rest are not implemented here and must not be. Stripe's
 * optimised checkout decides which methods a given customer is eligible for
 * and renders them itself — recreating that would mean quoting instalment
 * terms we do not set, to people who may not qualify for them.
 */

/**
 * Whether Stripe *could* run, ignoring whether we have chosen to offer it.
 * Use `isCheckoutEnabled()` from ./flag for anything a visitor can see —
 * credentials existing is not the same as the journey being open.
 */
export function isCheckoutConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

/**
 * Guards against a live key reaching a preview or a local machine.
 *
 * Test keys are `sk_test_…`, live keys `sk_live_…`. A live key outside
 * production means a real card could be charged from a branch deploy, so this
 * refuses rather than warns.
 */
function assertKeyMatchesEnvironment(key: string): void {
  const isLiveKey = key.startsWith('sk_live_')
  const isProduction = process.env.VERCEL_ENV === 'production'
  if (isLiveKey && !isProduction) {
    throw new Error(
      'Refusing to use a live Stripe key outside production. Set a sk_test_ key for preview and development.'
    )
  }
}

let client: Stripe | undefined

function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set.')
  assertKeyMatchesEnvironment(key)
  client ??= new Stripe(key)
  return client
}

/**
 * The origin Stripe returns the customer to.
 *
 * Preferring the request's own origin keeps a preview deployment returning to
 * that preview rather than bouncing the customer to production mid-purchase.
 */
function returnOrigin(requestOrigin?: string): string {
  return requestOrigin || process.env.NEXT_PUBLIC_SITE_URL || site.url
}

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: 'unconfigured' | 'not-purchasable' | 'failed' }

/**
 * Creates a Checkout Session for one build package.
 *
 * `slug` is the only thing taken from the caller, and it is resolved against
 * the package list before anything else happens.
 */
export async function createCheckoutSession(
  slug: string,
  requestOrigin?: string
): Promise<CheckoutResult> {
  if (!isCheckoutConfigured()) return { ok: false, reason: 'unconfigured' }

  const scope: BuildScope | undefined = scopeBySlug(slug)
  if (!scope || !scope.checkout || scope.pricing !== 'fixed') {
    return { ok: false, reason: 'not-purchasable' }
  }

  const origin = returnOrigin(requestOrigin)

  try {
    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      // `payment_method_types` is deliberately omitted. Left unset, Stripe
      // uses the methods enabled in the dashboard and shows each customer the
      // ones they are actually eligible for — card, wallets, and Klarna where
      // it applies. Hard-coding a list here would silently drop anything
      // enabled later, and would mean Northbound deciding who sees Klarna.
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            // Pence. Read from services.ts, never from the browser.
            unit_amount: scope.price * 100,
            product_data: {
              name: `Northbound Web — ${scope.name}`,
              description: `${scope.summary} ${scope.pages}, ${scope.revisions}.`,
            },
          },
        },
      ],
      // Reconciling a webhook back to a package without re-deriving it.
      metadata: { scope: scope.slug, scopeName: scope.name },
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      // What the customer wants building. Cheaper to ask now than to chase.
      custom_fields: [
        {
          key: 'business',
          label: { type: 'custom', custom: 'Your business name' },
          type: 'text',
          optional: true,
        },
      ],
      success_url: `${origin}/web/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/web/services?checkout=cancelled#builds`,
    })

    if (!session.url) return { ok: false, reason: 'failed' }
    return { ok: true, url: session.url }
  } catch (error) {
    // Never surface Stripe's message: it can name configuration.
    console.error(
      `[checkout] session creation failed for "${slug}": ${
        error instanceof Error ? error.name : 'unknown'
      }`
    )
    return { ok: false, reason: 'failed' }
  }
}

export type PaidSession = {
  paid: boolean
  scopeName?: string
  email?: string
  amountTotal?: number
}

/**
 * Reads a completed session back from Stripe.
 *
 * The success page calls this instead of trusting the redirect. Landing on
 * /success proves only that a browser followed a URL — `payment_status` from
 * Stripe's own API is what proves money moved.
 */
export async function readCheckoutSession(sessionId: string): Promise<PaidSession> {
  if (!isCheckoutConfigured()) return { paid: false }
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId)
    return {
      paid: session.payment_status === 'paid',
      scopeName: session.metadata?.scopeName ?? undefined,
      email: session.customer_details?.email ?? undefined,
      amountTotal: session.amount_total ?? undefined,
    }
  } catch (error) {
    console.error(
      `[checkout] could not read session: ${
        error instanceof Error ? error.name : 'unknown'
      }`
    )
    return { paid: false }
  }
}

/**
 * Verifies a webhook came from Stripe.
 *
 * Signature verification needs the raw body, so the route hands the exact
 * bytes it received rather than a re-serialised object.
 */
export function constructWebhookEvent(
  rawBody: string,
  signature: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set.')
  return stripe().webhooks.constructEvent(rawBody, signature, secret)
}
