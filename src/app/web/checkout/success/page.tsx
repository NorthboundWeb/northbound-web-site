import type { Metadata } from 'next'
import { ArrowLink, ButtonLink, Container, Display, Label, Section } from '@/components/ui'
import { readCheckoutSession } from '@/lib/checkout/stripe'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Order received',
  // A confirmation page has nothing to offer a search engine and everything to
  // lose by being indexed.
  robots: { index: false, follow: false },
}

const NEXT_STEPS = [
  {
    step: '01',
    title: 'A receipt, from Stripe',
    body: 'It arrives at the address you entered at checkout, usually within a minute. That is your proof of payment — Northbound never sees or stores your card details.',
  },
  {
    step: '02',
    title: 'An email from me',
    body: 'Within one working day, with the questions I need answered to begin: what your business does, who it is for, and anything you already have — logo, photographs, copy.',
  },
  {
    step: '03',
    title: 'The clock starts',
    body: 'Your estimate runs from the point I have your content, not from today. The sooner that arrives, the sooner you are looking at a preview link.',
  },
]

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams

  // Never trust the redirect. Reaching this URL proves a browser followed a
  // link; only Stripe's own record proves a payment happened.
  const session = sessionId ? await readCheckoutSession(sessionId) : { paid: false }

  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <Label index="01">{session.paid ? 'Payment received' : 'Checkout'}</Label>

          {session.paid ? (
            <>
              <Display as="h1" className="mt-6">
                Booked
              </Display>
              <p className="mt-8 text-lg leading-relaxed text-ink-muted">
                Thank you — your {session.scopeName ?? 'website'} build is paid
                for and reserved.
                {session.email ? ` A receipt is on its way to ${session.email}.` : ''}
              </p>

              <ol className="mt-12 border-t border-line">
                {NEXT_STEPS.map((s) => (
                  <li key={s.step} className="flex gap-6 border-b border-line py-7">
                    <span className="label shrink-0 pt-1 text-accent-deep">{s.step}</span>
                    <div>
                      <h2 className="display text-xl text-ink sm:text-2xl">{s.title}</h2>
                      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                <ButtonLink href="/contact?type=build" size="lg">
                  Send your details now
                </ButtonLink>
                <ArrowLink href="/web/process">See what happens next</ArrowLink>
              </div>
            </>
          ) : (
            <>
              <Display as="h1" className="mt-6">
                Hold on
              </Display>
              <p className="mt-8 text-lg leading-relaxed text-ink-muted">
                I could not confirm a completed payment for this link. If you
                have just paid, your receipt from Stripe is the thing that
                counts — nothing is lost.
              </p>
              <p className="mt-5 leading-relaxed text-ink-muted">
                Email{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="text-accent-deep underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>{' '}
                and I will sort it out. Otherwise you can pick a package again —
                you will not be charged twice for the same build.
              </p>
              <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                <ButtonLink href="/web/services#builds" size="lg">
                  Back to packages
                </ButtonLink>
                <ArrowLink href="/contact">Talk to me instead</ArrowLink>
              </div>
            </>
          )}
        </div>
      </Container>
    </Section>
  )
}
