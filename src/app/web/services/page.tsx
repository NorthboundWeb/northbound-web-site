import type { Metadata } from 'next'
import { CropMarks } from '@/components/graphics'
import { PricingSelector } from '@/components/pricing-selector'
import {
  ArrowLink,
  ButtonLink,
  CardCta,
  Container,
  Display,
  Label,
  Section,
  StatementBand,
} from '@/components/ui'
import { isCheckoutEnabled } from '@/lib/checkout/flag'
import {
  COMPLIMENTARY_MONTH_TERMS,
  ENQUIRY_PROCESS,
  ENQUIRY_PROCESS_SUMMARY,
  KLARNA_NOTE,
  MANAGEMENT_STEP_UP,
  ONE_OFF_LABEL,
  PRICING_PROMISE,
  PRO_MANAGEMENT_PRICE,
  TIMELINE_TERMS,
  buildScopes,
  commercialTerms,
  existingSiteHelp,
  managementPlans,
  managementTerms,
} from '@/lib/services'
import { currency, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Services and pricing',
  description: `What Northbound Web builds and what it costs. One-off website builds from ${currency.format(buildScopes[0].price)}, optional management from ${currency.format(managementPlans[0].price)} a month, and help with a website you already have.`,
  alternates: { canonical: '/web/services' },
}

/**
 * Only reachable while checkout is switched on. With it off, the selector is
 * a link into the enquiry form and there is no failure state to explain —
 * which is the point: `?checkout=unconfigured` was a dead end a visitor got
 * sent to for pressing the main call to action.
 */
const CHECKOUT_NOTICES: Record<string, string> = {
  cancelled:
    'Checkout was cancelled and you have not been charged. Pick a package again whenever you are ready.',
  failed:
    'Something went wrong opening checkout, and nothing has been charged. Try again, or send an enquiry and I will invoice you directly.',
  throttled:
    'That is a few checkout attempts in a short space of time. Give it a minute, or send an enquiry instead.',
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>
}) {
  const { checkout } = await searchParams
  // Suppressed entirely when checkout is off, so a stale link cannot show a
  // visitor an error about a journey that no longer exists.
  const notice =
    checkout && isCheckoutEnabled() ? CHECKOUT_NOTICES[checkout] : undefined
  const checkoutEnabled = isCheckoutEnabled()

  return (
    <>
      <Section className="border-b border-line pb-16">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="01">Services and pricing</Label>
            <span className="label text-ink-faint">Northbound.Web</span>
          </div>
          <Display as="h1" className="mt-6">
            Priced
          </Display>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
            One-off builds from {currency.format(buildScopes[0].price)}. Above
            that, price follows the amount of work — pages, features, how much
            needs building rather than arranging. {PRICING_PROMISE}
          </p>
        </Container>
      </Section>

      {/* ── The selector ───────────────────────────────────────── */}
      <Section id="builds" className="scroll-mt-20 border-b border-line">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1fr] lg:items-start lg:gap-20">
            <div>
              <Label index="02">Website builds</Label>
              <Display className="mt-6">Choose</Display>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-muted">
                Four sizes. Pick the one that matches what you need and send
                an enquiry — or tell me what you are trying to do and I will
                point you at the right one, including when that is the cheaper
                one.
              </p>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-faint">
                Every build price is a one-off total for the website itself. It
                is never charged weekly or monthly. Management is a separate,
                optional subscription.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-faint">
                {ENQUIRY_PROCESS_SUMMARY}
              </p>
            </div>

            <PricingSelector
              checkoutEnabled={checkoutEnabled}
              notice={notice}
            />
          </div>
        </Container>
      </Section>

      {/* ── How buying works ───────────────────────────────────── */}
      <Section className="border-b border-line">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Label index="03">How buying works</Label>
              <Display className="mt-6">No checkout</Display>
              <p className="mt-8 max-w-sm text-[17px] leading-relaxed text-ink-muted">
                You are not buying a website out of a vending machine. Every
                project is confirmed and priced in writing before a penny
                changes hands.
              </p>
            </div>
            <ol className="border-t border-line">
              {ENQUIRY_PROCESS.map((s) => (
                <li
                  key={s.step}
                  className="step-in grid gap-2 border-b border-line py-6 sm:grid-cols-[3.5rem_12rem_1fr] sm:items-baseline sm:gap-8"
                >
                  <span className="label text-accent-deep">{s.step}</span>
                  <h3 className="display text-xl text-ink sm:text-2xl">{s.title}</h3>
                  <p className="max-w-xl text-[15px] leading-relaxed text-ink-muted">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* ── What each one includes ─────────────────────────────── */}
      <Section className="border-b border-line">
        <Container>
          <Label index="04">Side by side</Label>
          <Display className="mt-6">Included</Display>

          <div className="mt-14 grid border-t border-l border-line md:grid-cols-2 xl:grid-cols-4">
            {buildScopes.map((s) => (
              <div
                key={s.slug}
                id={s.slug}
                className="scroll-mt-20 flex flex-col border-r border-b border-line p-7"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="display text-2xl text-ink sm:text-3xl">{s.name}</h2>
                  {s.badge ? (
                    <span className="label text-accent-deep">{s.badge}</span>
                  ) : null}
                </div>

                <p className="display mt-4 text-[clamp(2.25rem,5vw,3rem)] text-accent">
                  {s.from ? `From ${currency.format(s.price)}` : currency.format(s.price)}
                </p>
                <p className="mt-2 text-[13px] text-ink-faint">
                  {s.checkout ? ONE_OFF_LABEL : 'Quoted individually'}
                </p>

                <p className="mt-6 text-[15px] leading-relaxed text-ink-muted">
                  {s.summary}
                </p>

                <ul className="mt-7 flex-1 space-y-3">
                  {s.includes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="text-[14px] leading-relaxed text-ink-muted">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-7 border-t border-line pt-5 text-[13px] leading-relaxed">
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-faint">Timescale</dt>
                    <dd className="text-right text-ink-muted">{s.timeline}</dd>
                  </div>
                  <div className="mt-2 flex justify-between gap-3">
                    <dt className="text-ink-faint">Best for</dt>
                    <dd className="text-right text-ink-muted">{s.bestFor}</dd>
                  </div>
                </dl>

                {s.note ? (
                  <p className="mt-5 border-l-2 border-accent pl-4 text-[13px] leading-relaxed text-ink-faint">
                    {s.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-faint">
            {TIMELINE_TERMS}
          </p>
          {checkoutEnabled ? (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-faint">
              {KLARNA_NOTE} — the available payment methods are decided by our
              payment provider based on what you are eligible for. Northbound
              does not set those terms.
            </p>
          ) : null}
        </Container>
      </Section>

      {/* ── Already have a website ─────────────────────────────── */}
      <StatementBand
        id="existing"
        index="05"
        eyebrow="Already have a website?"
        word={existingSiteHelp.word}
        className="scroll-mt-20"
        lede={existingSiteHelp.summary}
      />

      <Section className="border-b border-line">
        <Container>
          <div className="grid border-t border-l border-line sm:grid-cols-2">
            {existingSiteHelp.options.map((o, i) => (
              <div key={o.title} className="border-r border-b border-line p-8">
                <span className="label text-accent-deep">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display mt-4 text-2xl text-ink sm:text-3xl">{o.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{o.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <ButtonLink href="/contact?type=help" size="lg">
              Get help with your site
            </ButtonLink>
            <p className="max-w-md text-sm leading-relaxed text-ink-faint">{existingSiteHelp.note}</p>
          </div>
        </Container>
      </Section>

      {/* ── Management ────────────────────────────────────────── */}
      <StatementBand
        id="management"
        index="06"
        eyebrow="Management plans"
        aside="Optional · monthly"
        word="Kept"
        className="scroll-mt-20"
        lede={
          <>
            A separate monthly subscription, never part of the build price. The
            Pro and Custom builds include one complimentary month of Pro
            Management, worth {currency.format(PRO_MANAGEMENT_PRICE)}.{' '}
            {COMPLIMENTARY_MONTH_TERMS}
          </>
        }
      />

      <Section className="border-b border-line">
        <Container>
          <div className="grid border-t border-l border-line lg:grid-cols-2">
            {managementPlans.map((plan, i) => {
              const isUpgrade = i === 1
              return (
                <div
                  key={plan.slug}
                  className={`group relative flex flex-col border-r border-b p-8 transition-colors focus-within:bg-paper-raised hover:bg-paper-raised sm:p-10 ${
                    isUpgrade ? 'border-accent bg-accent-wash' : 'border-line'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="label text-ink">{plan.name}</h3>
                    {plan.badge ? (
                      <span className="label text-accent-deep">{plan.badge}</span>
                    ) : null}
                  </div>

                  <p className="display mt-4 text-[clamp(3rem,7vw,4.5rem)] text-ink">
                    {currency.format(plan.price)}
                    <span className="label ml-2 align-middle text-ink-faint">/month</span>
                  </p>

                  {/* The whole point of the pair: the step up is £9. Derived
                      from the prices above so it cannot drift. */}
                  {isUpgrade ? (
                    <p className="mt-3 text-[15px] leading-relaxed text-accent-deep">
                      {currency.format(MANAGEMENT_STEP_UP)} more than Pro
                      Management, for double the change time and everything
                      below.
                    </p>
                  ) : null}

                  <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">
                    {plan.summary}
                  </p>

                  <ul className="mt-7 flex-1 space-y-3.5">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex gap-3.5">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="text-[15px] leading-relaxed text-ink-muted">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Change time sits below the benefits: a plan is the site
                      being looked after, not hours sold by the month. */}
                  <p className="mt-7 border-t border-line pt-5 text-sm leading-relaxed text-ink-faint">
                    {plan.changeTime}
                  </p>
                  <CardCta href={`/contact?package=${plan.enquiryParam}`} className="mt-6">
                    {plan.cta}
                  </CardCta>
                </div>
              )
            })}
          </div>

          <div className="mt-12 border border-line bg-paper-sunk p-8">
            <h3 className="label text-ink-faint">How the plans work</h3>
            <ul className="mt-6 space-y-3.5">
              {managementTerms.map((term) => (
                <li key={term} className="flex gap-4">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-[15px] leading-relaxed text-ink-muted">{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── Practical terms ───────────────────────────────────── */}
      <Section id="terms" className="scroll-mt-20 border-b border-line">
        <Container>
          <div className="step-in">
            <Label index="07">The practical bits</Label>
            <Display className="mt-6">Plainly</Display>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
              The things people normally have to ask for. Easier to put them here.
            </p>

            <div className="mt-14 grid border-t border-l border-line sm:grid-cols-2">
              {commercialTerms.map((term, i) => (
                <div key={term.title} className="relative border-r border-b border-line p-8">
                  <CropMarks className="opacity-30" />
                  <div className="flex items-baseline gap-4">
                    <span className="label text-accent-deep">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="display text-2xl text-ink sm:text-3xl">{term.title}</h3>
                  </div>
                  <ul className="mt-6 space-y-3.5">
                    {term.points.map((point) => (
                      <li key={point} className="flex gap-3.5">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="text-[15px] leading-relaxed text-ink-muted">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-3xl">
            <Display>Unsure</Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              That is normal, and it is my job rather than yours. Describe the
              business and what is not working, and I will tell you which scope
              fits — including when it is the cheaper one.
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
              <ArrowLink href="/web/process">See how a project runs</ArrowLink>
            </div>
            <p className="mt-8 text-sm text-ink-faint">
              Or email{' '}
              <a href={`mailto:${site.email}`} className="text-accent-deep underline-offset-4 hover:underline">
                {site.email}
              </a>
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
