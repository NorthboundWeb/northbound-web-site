import type { Metadata } from 'next'
import {
  Arrow,
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from '@/components/ui'
import {
  ADVANCED_MANAGEMENT_PRICE,
  buildPackages,
  managementPlans,
} from '@/lib/services'
import { currency, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Packages and prices',
  description:
    'Website packages at fixed prices: Basic Build £199, Standard Build £299, Advanced Build £399, and Fully Custom from £499. Monthly management plans from £39.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <>
      <Section className="border-b border-line pb-16 sm:pb-20">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Packages and prices</Eyebrow>
            <h1 className="mt-6 text-4xl leading-[1.1] font-normal sm:text-5xl">
              What it costs, without having to ask.
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-ink-muted">
              Three packages at fixed prices, so you know what you are paying
              before you speak to me. The fourth is for genuinely bespoke work,
              where the figure depends on what you need building. Every build
              includes hosting setup, HTTPS and a repository you own.
            </p>
          </div>
        </Container>
      </Section>

      {buildPackages.map((pkg, index) => (
        <section
          key={pkg.slug}
          id={pkg.slug}
          className={
            index % 2 === 1
              ? 'scroll-mt-24 border-b border-line bg-paper-sunk py-16 sm:py-20'
              : 'scroll-mt-24 border-b border-line py-16 sm:py-20'
          }
        >
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl leading-tight">{pkg.name}</h2>
                  {pkg.badge ? (
                    <span className="rounded-full bg-accent-wash px-3 py-1 text-[11px] font-medium tracking-wide text-accent uppercase">
                      {pkg.badge}
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 text-[17px] leading-relaxed text-ink-muted">
                  {pkg.summary}
                </p>

                <div className="mt-8 border-t border-line pt-6">
                  <p className="font-serif text-5xl text-accent">
                    {pkg.variable ? (
                      <>
                        <span className="text-2xl text-ink-faint">from </span>
                        {currency.format(pkg.price)}
                      </>
                    ) : (
                      currency.format(pkg.price)
                    )}
                  </p>
                  <p className="mt-3 text-sm text-ink-faint">
                    {pkg.variable
                      ? 'One-off. The final figure depends on what you need building, and is confirmed in writing before any work starts.'
                      : 'One-off, all in. No monthly fee unless you choose one.'}
                  </p>
                </div>

                <p className="mt-8 text-[15px] leading-relaxed text-ink-muted">
                  <span className="font-medium text-ink">Best for: </span>
                  {pkg.bestFor}
                </p>
              </div>

              <div className="lg:pt-2">
                <h3 className="eyebrow">What is included</h3>
                <ul className="mt-6 space-y-4">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex gap-3.5">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="text-[15px] leading-relaxed text-ink-muted">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* Management plans */}
      <Section id="management" className="scroll-mt-24">
        <Container>
          <SectionHeading
            eyebrow="Management plans"
            title="Optional, rolling, and never a condition of the build."
            lede={`The Advanced and Fully Custom builds include the first month of Advanced Management free, worth ${currency.format(
              ADVANCED_MANAGEMENT_PRICE
            )}. After that, keep it or cancel — the site is yours either way.`}
          />

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
            {managementPlans.map((plan) => (
              <div key={plan.slug} className="flex flex-col bg-paper p-8">
                <h3 className="text-2xl">{plan.name}</h3>
                <p className="mt-4 font-serif text-4xl text-accent">
                  {plan.variable ? (
                    <span className="text-xl text-ink-faint">from </span>
                  ) : null}
                  {currency.format(plan.price)}
                  <span className="font-sans text-base text-ink-faint">
                    /month
                  </span>
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                  {plan.summary}
                </p>
                <ul className="mt-7 space-y-3.5">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex gap-3.5">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="text-[15px] leading-relaxed text-ink-muted">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-line bg-paper-sunk">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl leading-tight sm:text-4xl">
              Not sure which package you need?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              That is normal, and it is my job rather than yours. Describe the
              business and what is not working, and I will tell you which one
              fits — including when it is the cheaper one.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <ButtonLink href="/contact" size="lg">
                Get started <Arrow />
              </ButtonLink>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                or email {site.email}
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
