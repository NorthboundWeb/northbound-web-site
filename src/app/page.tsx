import Link from 'next/link'
import { CompassDiagram } from '@/components/graphics'
import { Gantry } from '@/components/gantry'
import { SiteCheck } from '@/components/site-check'
import { Comparison } from '@/components/comparison'
import { comparisons } from '@/lib/discover'
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
import { currency, site } from '@/lib/site'
import {
  ADVANCED_MANAGEMENT_PRICE,
  ANNUAL_TERMS,
  COMPLIMENTARY_MONTH_TERMS,
  buildPackages,
  managementPlans,
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

      {/* ── Hero: the gantry ──────────────────────────────────── */}
      <Gantry />

      {/* ── Junctions: the route a project takes ──────────────── */}
      <Section id="how" className="scroll-mt-20 border-b border-line">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="02">How it works</Label>
            <span className="label text-ink-faint">Three junctions</span>
          </div>
          <Display className="mt-6">Route</Display>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
            Three junctions between first message and live site. You know the
            price before the first one, and nothing goes live until you have
            approved it.
          </p>

          <ol className="route mt-16">
            {[
              {
                j: 'J1',
                title: 'Tell me the plan',
                body: 'Your business, what you want from it, and what the website needs to do. A call, no charge — and if a smaller package would do the job, that is the one I will point you at.',
              },
              {
                j: 'J2',
                title: 'Make it yours',
                body: 'We agree the brief, I build the first version on a live preview link you can check any time, and we refine it together through your revision rounds.',
              },
              {
                j: 'J3',
                title: 'Put it out there',
                body: 'Once you have approved it and paid the balance, it goes live — a careful DNS switch, planned so nothing goes dark. Management keeps it running afterwards, if you want it to.',
              },
            ].map((step) => (
              <li key={step.j} className="relative pl-24 sm:pl-28">
                <span aria-hidden className="jn">{step.j}</span>
                <h3 className="display text-3xl sm:text-4xl">{step.title}</h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
        <style>{`
          .route{position:relative;list-style:none;margin:0;padding:6px 0;display:flex;flex-direction:column;gap:52px}
          .route::before{content:"";position:absolute;left:26px;top:0;bottom:0;width:14px;border-radius:3px;background:var(--ink)}
          .route::after{content:"";position:absolute;left:32px;top:0;bottom:0;width:2px;background:repeating-linear-gradient(to bottom,var(--paper) 0 14px,transparent 14px 30px)}
          .jn{position:absolute;left:0;top:2px;z-index:1;display:inline-flex;align-items:center;justify-content:center;min-width:66px;padding:9px 10px 7px;border-radius:4px;background:var(--ink);color:var(--paper);border:3px solid var(--paper);box-shadow:0 0 0 2px var(--ink);font-family:var(--font-display);font-size:1.2rem;line-height:1;letter-spacing:.04em}
          @media (max-width:640px){.route{gap:40px}.jn{min-width:58px;font-size:1.05rem}}
        `}</style>
      </Section>

      {/* ── Discover teaser: one live comparison, then the push ── */}
      <section
        aria-labelledby="discover-heading"
        className="border-b border-line bg-paper-sunk"
      >
        <Container className="py-20 sm:py-28">
          <div className="flex items-start justify-between">
            <Label index="03">Discover</Label>
            <span className="label text-accent">Drag it</span>
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
            <div>
              <Display as="h2" className="mt-0">
                Seen
              </Display>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-muted">
                This is {comparisons[0].business}&apos;s website in 2009, and
                the one it should be. Drag the handle. Then go and see three
                more — a bakery, a lash studio and a dog groomer — with what
                changed on each one and why.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href="/discover" size="lg">
                  See the difference
                </ButtonLink>
                <ArrowLink href="/discover#methods">Builder vs agency vs me</ArrowLink>
              </div>
            </div>
            <div>
              <Comparison data={comparisons[0]} />
              <p className="mt-3 text-xs text-ink-faint">
                {comparisons[0].business} is a made-up business. The problems are
                real ones.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Site self-check ───────────────────────────────────── */}
      <div id="check" className="scroll-mt-20">
        <SiteCheck />
      </div>

      {/* ── Judged ───────────────────────────────────────────── */}
      <StatementBand
        index="04"
        aside="Northbound"
        word="Judged"
        lede="People decide whether to trust a business before they read a word of it. A site that looks considered says the business is. See what that looks like, side by side, on Discover."
      >
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ButtonLink href="/discover" variant="inverse" size="lg">
            See the difference
          </ButtonLink>
          <ArrowLink href="/contact" className="text-cream">Or start a project</ArrowLink>
        </div>
      </StatementBand>

      {/* ── Packages ─────────────────────────────────────────── */}
      <Section id="packages" className="scroll-mt-20 border-b border-line">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="05">Packages</Label>
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

                <p className="mt-5 text-[13px] leading-relaxed text-ink-faint">
                  First month of management free, worth{' '}
                  {currency.format(ADVANCED_MANAGEMENT_PRICE)}.
                </p>

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
        index="06"
        eyebrow="After launch"
        aside="First month free"
        word="Kept"
        lede="Optional, and not a condition of the build. Hosting is included while a plan is active, the first month is free, and a year paid up front is twelve months for the price of ten. Plans are rolling — cancel before your next billing date and future renewals stop."
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
                  <span className="block text-sm tracking-[0.16em] text-ink-faint">
                    From
                  </span>
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
            {COMPLIMENTARY_MONTH_TERMS} {ANNUAL_TERMS} Safety and security
            fixes never count against your update hours.
          </p>
        </Container>
      </Section>

      {/* ── Closing ──────────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="reveal">
            <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto]">
              <div>
                <Label index="07" />
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
