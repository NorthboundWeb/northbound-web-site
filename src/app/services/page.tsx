import type { Metadata } from 'next'
import { CropMarks } from '@/components/graphics'
import {
  ArrowLink,
  ButtonLink,
  CardCta,
  Container,
  Display,
  Label,
  Section,
  StatementBand,
  cn,
} from '@/components/ui'
import {
  ADVANCED_MANAGEMENT_PRICE,
  COMPLIMENTARY_MONTH_TERMS,
  TIMELINE_TERMS,
  buildPackages,
  commercialTerms,
  managementPlans,
  managementTerms,
} from '@/lib/services'
import { currency, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Packages and prices',
  description:
    'Website packages at fixed prices: Basic £199, Standard £299, Advanced £399, and Custom from £499. Optional management plans at £39, £80 and £149 a month.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <>
      <Section className="border-b border-line pb-16 sm:pb-20">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="01">Packages and prices</Label>
            <span className="label text-ink-faint">Fixed</span>
          </div>
          <Display as="h1" className="mt-6">
            Priced
          </Display>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Three packages at fixed prices, so you know what you are paying
            before you speak to me. The fourth is for work that does not fit a
            package, where the scope and the price are agreed together first.
          </p>
        </Container>
      </Section>

      {/* Package spreads */}
      {buildPackages.map((pkg, index) => (
        <section
          key={pkg.slug}
          id={pkg.slug}
          className={cn(
            'scroll-mt-20 border-b border-line py-16 sm:py-24',
            index % 2 === 1 && 'bg-paper-sunk'
          )}
        >
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <div>
                <div className="flex items-center gap-4">
                  <span className="label text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {pkg.badge ? (
                    <span className="label flex items-center gap-2 text-accent">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {pkg.badge}
                    </span>
                  ) : null}
                </div>

                <h2 className="display mt-4 text-[clamp(3rem,9vw,7rem)] text-ink">
                  {pkg.name}
                </h2>

                <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-muted">
                  {pkg.summary}
                </p>

                <div className="mt-10 border-t border-line pt-8">
                  <p className="display text-[clamp(3rem,8vw,5.5rem)] text-accent">
                    {pkg.variable ? (
                      <>
                        <span className="label mr-3 align-super text-ink-faint">
                          From
                        </span>
                        {currency.format(pkg.price)}
                      </>
                    ) : (
                      currency.format(pkg.price)
                    )}
                  </p>
                  <p className="mt-4 max-w-sm text-sm text-ink-faint">
                    {pkg.variable
                      ? 'Starting price. The final figure is agreed in writing before any work begins.'
                      : 'One-off. 50% deposit to begin, 50% once complete and approved, before it goes live.'}
                  </p>

                  <p className="label mt-8 text-ink">
                    Timescale ·{' '}
                    <span className="text-accent">{pkg.timeline}</span>
                  </p>
                  <p className="mt-3 max-w-md text-xs leading-relaxed text-ink-faint">
                    {TIMELINE_TERMS}
                  </p>
                </div>

                <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-muted">
                  <span className="label text-ink">Best for </span>
                  {pkg.bestFor}
                </p>

                {pkg.note ? (
                  <p className="mt-6 max-w-md border-l-2 border-accent pl-5 text-sm leading-relaxed text-ink-faint">
                    {pkg.note}
                  </p>
                ) : null}

                <ButtonLink
                  href={`/contact?package=${pkg.enquiryParam}`}
                  size="lg"
                  className="mt-10"
                >
                  {pkg.cta}
                </ButtonLink>
              </div>

              <div className="lg:pt-16">
                <h3 className="label text-ink-faint">What is included</h3>
                <ul className="mt-7 border-t border-line">
                  {pkg.includes.map((item, i) => (
                    <li
                      key={item}
                      className="flex gap-5 border-b border-line py-4"
                    >
                      <span className="label shrink-0 pt-0.5 text-accent">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[15px] leading-relaxed text-ink-muted">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {pkg.freeAdvancedMonth ? (
                  <p className="mt-8 border border-line bg-paper-raised p-6 text-sm leading-relaxed text-ink-muted">
                    {COMPLIMENTARY_MONTH_TERMS}
                  </p>
                ) : null}
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* Management: green band, then the plans on paper */}
      <StatementBand
        id="management"
        index="05"
        eyebrow="Management plans"
        aside="Optional"
        word="Kept"
        className="scroll-mt-20"
        lede={
          <>
            The Advanced and Custom builds include one complimentary month of
            Advanced Management, worth{' '}
            {currency.format(ADVANCED_MANAGEMENT_PRICE)}.{' '}
            {COMPLIMENTARY_MONTH_TERMS}
          </>
        }
      />

      <Section className="border-b border-line">
        <Container>
          <div className="grid border-t border-l border-line lg:grid-cols-3">
            {managementPlans.map((plan) => (
              <div
                key={plan.slug}
                className="group relative flex flex-col border-r border-b border-line p-8 transition-colors hover:bg-paper-raised focus-within:bg-paper-raised"
              >
                <h3 className="label text-ink-faint">{plan.name}</h3>
                <p className="display mt-3 text-[clamp(2.75rem,6vw,4rem)] text-ink">
                  {currency.format(plan.price)}
                  <span className="label ml-1.5 align-middle text-ink-faint">
                    /mo
                  </span>
                </p>
                <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">
                  {plan.summary}
                </p>
                <ul className="mt-7 flex-1 space-y-3.5">
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

                {/* Change time sits below the benefits on purpose — a plan is
                    the site being looked after, not hours sold by the month. */}
                <p className="mt-7 border-t border-line pt-5 text-sm leading-relaxed text-ink-faint">
                  {plan.changeTime}
                </p>

                <CardCta
                  href={`/contact?package=${plan.enquiryParam}`}
                  className="mt-6"
                >
                  {plan.cta}
                </CardCta>
              </div>
            ))}
          </div>

          <div className="mt-12 border border-line bg-paper-sunk p-8">
            <h3 className="label text-ink-faint">How the plans work</h3>
            <ul className="mt-6 space-y-3.5">
              {managementTerms.map((term) => (
                <li key={term} className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span className="text-[15px] leading-relaxed text-ink-muted">
                    {term}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Practical terms */}
      <Section id="terms" className="scroll-mt-20 border-b border-line">
        <Container>
          <div className="reveal">
            <div className="flex items-start justify-between">
              <Label index="06">The practical bits</Label>
            </div>
            <Display className="mt-6">Plainly</Display>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
              The things people normally have to ask for. Easier to put them
              here.
            </p>

            <div className="mt-16 grid border-t border-l border-line sm:grid-cols-2">
              {commercialTerms.map((term, i) => (
                <div
                  key={term.title}
                  className="relative border-r border-b border-line p-8"
                >
                  <CropMarks className="opacity-30" />
                  <div className="flex items-baseline gap-4">
                    <span className="label text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="display text-2xl text-ink sm:text-3xl">
                      {term.title}
                    </h3>
                  </div>
                  <ul className="mt-6 space-y-3.5">
                    {term.points.map((point) => (
                      <li key={point} className="flex gap-3.5">
                        <span
                          aria-hidden
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        />
                        <span className="text-[15px] leading-relaxed text-ink-muted">
                          {point}
                        </span>
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
              business and what is not working, and I will tell you which
              package fits — including when it is the cheaper one.
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
              <ArrowLink href="/approach">See how a project runs</ArrowLink>
            </div>
            <p className="mt-8 text-sm text-ink-faint">
              Or email{' '}
              <a
                href={`mailto:${site.email}`}
                className="text-accent underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
