import Link from 'next/link'
import {
  BrowserFrame,
  CompassDiagram,
  Crosshair,
  CursorArrow,
  RouteMarker,
  TravellingLine,
  Wireframe,
} from '@/components/graphics'
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
import { currency, site } from '@/lib/site'
import {
  ADVANCED_MANAGEMENT_PRICE,
  COMPLIMENTARY_MONTH_TERMS,
  buildPackages,
  managementPlans,
} from '@/lib/services'

/** The editorial run: one idea, one word, one diagram per spread. */
const spreads = [
  {
    index: '01',
    word: 'Missed',
    copy: 'If they do not understand what you do in five seconds, they leave.',
    Graphic: CursorArrow,
    tint: 'text-ink',
  },
  {
    index: '02',
    word: 'Seen',
    copy: 'Social media gets attention. A website builds trust.',
    Graphic: Crosshair,
    tint: 'text-olive',
  },
  {
    index: '03',
    word: 'Clear',
    copy: 'What do you offer? Who is it for? What is the next step?',
    Graphic: Wireframe,
    tint: 'text-cobalt',
  },
  {
    index: '04',
    word: 'Found',
    copy: 'A good website works for you around the clock. Even when you do not.',
    Graphic: RouteMarker,
    tint: 'text-mustard',
  },
]

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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <Container className="pt-16 pb-20 sm:pt-20 sm:pb-28">
          <div className="flex items-start justify-between">
            <Label>Web development · {site.location}</Label>
            <span className="label text-accent">01</span>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="rise-in">
              <Display as="h1">Northbound</Display>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-muted sm:text-xl">
                Your website is often your first impression. Make it a good one.
                Websites built for small businesses that want to look the part.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href="/contact" size="lg">
                  Start a project
                </ButtonLink>
                <ArrowLink href="/services">See packages and prices</ArrowLink>
              </div>
            </div>

            <div className="lg:pb-4">
              <BrowserFrame className="w-full text-ink" />
              <TravellingLine className="mt-6" />
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 lg:grid-cols-4">
            {[
              { t: 'Pricing', d: 'Fixed package prices, £199 to £399' },
              { t: 'Replies', d: 'Usually within one working day' },
              { t: 'Ownership', d: 'Your code, your repository, your domain' },
              { t: 'Aftercare', d: 'Optional plans, £39 to £149/month' },
            ].map((item) => (
              <div key={item.t}>
                <dt className="label text-accent">{item.t}</dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                  {item.d}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Editorial spreads ────────────────────────────────── */}
      {spreads.map((s, i) => (
        <section
          key={s.word}
          className={cn(
            'border-b border-line',
            i % 2 === 1 && 'bg-paper-sunk'
          )}
        >
          <Container className="py-20 sm:py-28">
            <div className="reveal">
              <div
                className={cn(
                  'grid items-center gap-12 lg:grid-cols-[1fr_auto]',
                  i % 2 === 1 && 'lg:grid-flow-dense'
                )}
              >
                <div className={cn(i % 2 === 1 && 'lg:col-start-2')}>
                  <Label index={s.index} />
                  <Display className="mt-6">{s.word}</Display>
                  <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-muted">
                    {s.copy}
                  </p>
                </div>
                <div
                  className={cn(
                    'w-44 justify-self-start sm:w-56 lg:w-72',
                    i % 2 === 1 && 'lg:col-start-1 lg:justify-self-end',
                    s.tint
                  )}
                >
                  <s.Graphic />
                </div>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* ── Judged ───────────────────────────────────────────── */}
      <StatementBand
        index="05"
        aside="Northbound"
        word="Judged"
        lede="People decide whether to trust a business before they read a word of it. A site that looks considered says the business is."
      >
        <div className="mt-10">
          <ButtonLink href="/contact" variant="inverse" size="lg">
            Start a project
          </ButtonLink>
        </div>
      </StatementBand>

      {/* ── Packages ─────────────────────────────────────────── */}
      <Section id="packages" className="scroll-mt-20 border-b border-line">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="06">Packages</Label>
            <span className="label text-ink-faint">Fixed prices</span>
          </div>

          <Display className="mt-6">Built</Display>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
            You should not have to sit through a sales call to find out what a
            website costs. Pick the size that fits, or ask me which one does.
          </p>

          <ul className="mt-16 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
            {buildPackages.map((pkg) => (
              <li
                key={pkg.slug}
                className="group relative flex flex-col border-r border-b border-line p-7 transition-colors hover:bg-paper-raised focus-within:bg-paper-raised"
              >
                {/* Reserved row so the badge never knocks one price out of
                    alignment with the others. */}
                <div className="mb-4 flex h-5 items-center">
                  {pkg.badge ? (
                    <span className="label flex items-center gap-2 text-accent">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {pkg.badge}
                    </span>
                  ) : null}
                </div>

                <h3 className="label text-ink-faint">{pkg.name}</h3>

                <p className="display mt-3 text-[clamp(2.75rem,6vw,4rem)] text-ink">
                  {pkg.variable ? (
                    <>
                      <span className="block text-sm tracking-[0.16em] text-ink-faint">
                        From
                      </span>
                      {currency.format(pkg.price)}
                    </>
                  ) : (
                    currency.format(pkg.price)
                  )}
                </p>

                <p className="mt-5 flex-1 text-[15px] leading-relaxed text-ink-muted">
                  {pkg.summary}
                </p>

                {pkg.freeAdvancedMonth ? (
                  <p className="mt-5 text-[13px] leading-relaxed text-ink-faint">
                    Includes 1 complimentary month of Advanced Management, worth{' '}
                    {currency.format(ADVANCED_MANAGEMENT_PRICE)}.
                  </p>
                ) : null}

                <CardCta
                  href={`/contact?package=${pkg.enquiryParam}`}
                  className="mt-7"
                >
                  {pkg.cta}
                </CardCta>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-ink-muted">
            <Link href="/services" className="text-accent underline-offset-4 hover:underline">
              See what each package includes
            </Link>{' '}
            — page limits, revision rounds and timescales.
          </p>
        </Container>
      </Section>

      {/* ── Management: green band, then the plans on paper ──── */}
      <StatementBand
        index="07"
        eyebrow="After launch"
        aside="Optional"
        word="Kept"
        lede="Optional, and not a condition of the build. Plans are rolling — cancel before your next billing date and future renewals stop."
      />

      <Section className="border-b border-line">
        <Container>
          <ul className="grid border-t border-l border-line sm:grid-cols-3">
            {managementPlans.map((plan) => (
              <li
                key={plan.slug}
                className="group relative flex flex-col border-r border-b border-line p-7 transition-colors hover:bg-paper-raised focus-within:bg-paper-raised"
              >
                <h3 className="label text-ink-faint">{plan.name}</h3>
                <p className="display mt-3 text-[clamp(2.5rem,5.5vw,3.5rem)] text-ink">
                  {currency.format(plan.price)}
                  <span className="label ml-1 align-middle text-ink-faint">
                    /mo
                  </span>
                </p>
                <p className="mt-5 flex-1 text-[15px] leading-relaxed text-ink-muted">
                  {plan.summary}
                </p>
                <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-ink-faint">
                  {plan.changeTime}
                </p>
                <CardCta
                  href={`/contact?package=${plan.enquiryParam}`}
                  className="mt-6"
                >
                  {plan.cta}
                </CardCta>
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

      {/* ── Closing ──────────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="reveal">
            <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto]">
              <div>
                <Label index="08" />
                <Display className="mt-6">Northbound</Display>
                <p className="display mt-8 text-2xl leading-tight text-ink-muted sm:text-3xl">
                  Rebuild. Rebrand. Relaunch.
                </p>
                <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-muted">
                  Websites for small businesses that want to look the part. Tell
                  me what you are trying to do and I will tell you which package
                  fits.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <ButtonLink href="/contact" size="lg">
                    Start a project
                  </ButtonLink>
                  <a
                    href={`mailto:${site.email}`}
                    className="label text-ink-muted underline-offset-4 hover:text-accent hover:underline"
                  >
                    {site.email}
                  </a>
                </div>
              </div>
              <CompassDiagram className="w-40 justify-self-start text-ink sm:w-56 lg:w-64" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
