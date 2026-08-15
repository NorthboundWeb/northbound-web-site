import Link from 'next/link'
import {
  Arrow,
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from '@/components/ui'
import { currency, site } from '@/lib/site'
import {
  ADVANCED_MANAGEMENT_PRICE,
  COMPLIMENTARY_MONTH_TERMS,
  buildPackages,
  managementPlans,
  process,
  standards,
} from '@/lib/services'

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    areaServed: site.location,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Website packages',
      itemListElement: buildPackages.map((pkg) => ({
        '@type': 'Offer',
        name: pkg.name,
        price: pkg.price,
        priceCurrency: 'GBP',
        description: pkg.summary,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — asymmetric and left-aligned, with the promise stated plainly. */}
      <section className="relative overflow-hidden border-b border-line">
        <Container className="py-24 sm:py-32 lg:py-40">
          <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <Eyebrow>Web development · {site.location}</Eyebrow>
              <h1 className="mt-7 text-[2.75rem] leading-[1.05] font-normal sm:text-6xl lg:text-[4.25rem]">
                Websites that make small businesses look like{' '}
                <em className="font-normal text-accent not-italic">
                  serious ones
                </em>
                .
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                I design and build fast, accessible, secure websites and web
                applications — then look after them once they are live. No page
                builders, no templates, no being locked into a platform you
                cannot leave.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href="/contact" size="lg">
                  Get a quote <Arrow />
                </ButtonLink>
                <ButtonLink href="/services" variant="secondary" size="lg">
                  See services and prices
                </ButtonLink>
              </div>
            </div>

            {/* Supporting facts rather than invented testimonials or logos. */}
            <dl className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              {[
                { term: 'Pricing', detail: 'Fixed package prices, £199 to £399' },
                { term: 'Replies', detail: 'Usually within one working day' },
                { term: 'Ownership', detail: 'Your code, your repository, your domain' },
                { term: 'Aftercare', detail: 'Optional plans, £39 to £149/month' },
              ].map((item) => (
                <div key={item.term}>
                  <dt className="eyebrow">{item.term}</dt>
                  <dd className="mt-2.5 text-[15px] leading-relaxed text-ink-muted">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Services */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Packages"
            title="Four packages. Prices on the page."
            lede="You should not have to sit through a sales call to find out what a website costs. Pick the size that fits, or ask me which one does."
          />

          <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {buildPackages.map((pkg) => (
              <li key={pkg.slug} className="bg-paper">
                <Link
                  href={`/services#${pkg.slug}`}
                  className="group flex h-full flex-col p-8 transition-colors hover:bg-paper-sunk"
                >
                  {/* Reserved row so the badge never pushes one card's title
                      onto a second line and knocks its price out of alignment
                      with the others. */}
                  <div className="mb-3 flex h-5 items-center">
                    {pkg.badge ? (
                      <span className="rounded-full bg-accent-wash px-2.5 py-1 text-[10px] font-medium tracking-wide text-accent uppercase">
                        {pkg.badge}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-xl">{pkg.name}</h3>

                  <p className="mt-4 font-serif text-3xl text-accent">
                    {pkg.variable ? (
                      <>
                        <span className="text-lg text-ink-faint">from </span>
                        {currency.format(pkg.price)}
                      </>
                    ) : (
                      currency.format(pkg.price)
                    )}
                  </p>

                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-muted">
                    {pkg.summary}
                  </p>

                  {pkg.freeAdvancedMonth ? (
                    <p className="mt-5 text-[13px] leading-relaxed text-ink-faint">
                      Includes 1 complimentary month of Advanced Management,
                      worth {currency.format(ADVANCED_MANAGEMENT_PRICE)}.
                    </p>
                  ) : null}

                  <p className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
                    What is included
                    <span className="transition-transform group-hover:translate-x-1">
                      <Arrow />
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Management plans */}
      <Section className="border-t border-line pt-0">
        <Container>
          <SectionHeading
            eyebrow="After launch"
            title="Keep it looked after."
            lede="Optional, and not a condition of the build. Plans are rolling — cancel before your next billing date and future renewals stop."
          />

          <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {managementPlans.map((plan) => (
              <li key={plan.slug} className="flex flex-col bg-paper p-8">
                <h3 className="text-xl">{plan.name}</h3>
                <p className="mt-4 font-serif text-3xl text-accent">
                  {currency.format(plan.price)}
                  <span className="font-sans text-base text-ink-faint">
                    /month
                  </span>
                </p>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-muted">
                  {plan.summary}
                </p>
                <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-ink-faint">
                  {plan.changeTime}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-faint">
            The Advanced and Custom builds each include one complimentary month
            of Advanced Management, worth{' '}
            {currency.format(ADVANCED_MANAGEMENT_PRICE)}.{' '}
            {COMPLIMENTARY_MONTH_TERMS}
          </p>
        </Container>
      </Section>

      {/* Standards — the real differentiator */}
      <Section className="border-y border-line bg-paper-sunk">
        <Container>
          <SectionHeading
            eyebrow="How it is built"
            title="The parts you cannot see are the parts that fail later."
            lede="Anyone can produce something that looks acceptable on a laptop. These are the standards that decide whether it still works in two years."
          />

          <div className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((standard) => (
              <div key={standard.title}>
                <h3 className="text-lg">{standard.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                  {standard.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="You always know what happens next."
            lede="Every project runs through the same six steps. No silence for three weeks, no surprise invoice at the end."
          />

          <ol className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {process.map((item) => (
              <li key={item.step} className="border-t border-line pt-6">
                <p className="font-serif text-sm text-accent">{item.step}</p>
                <h3 className="mt-3 text-lg">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Closing CTA */}
      <Section className="border-t border-line bg-paper-sunk">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl leading-tight sm:text-4xl">
              Tell me what you are trying to do.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              Describe the business and the problem. I will tell you which
              package fits, what it will do for you, and honestly whether you
              need me at all.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <ButtonLink href="/contact" size="lg">
                Start a project <Arrow />
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
