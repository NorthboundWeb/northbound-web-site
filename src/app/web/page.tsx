import type { Metadata } from 'next'
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
  Container,
  Display,
  Label,
  Section,
  StatementBand,
  cn,
} from '@/components/ui'
import {
  ENTRY_PRICE,
  PRICING_PROMISE,
  buildScopes,
  existingSiteHelp,
  managementPlans,
  process,
} from '@/lib/services'
import { currency, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Northbound Web — websites built, hosted and managed',
  description: `Northbound Web designs, builds, hosts and manages websites for businesses across the ${site.location}. Builds from ${currency.format(ENTRY_PRICE)}, with a fixed price agreed in writing before anything starts.`,
  alternates: { canonical: '/web' },
}

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

export default function WebPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Northbound Web',
    parentOrganization: { '@type': 'Organization', name: site.name },
    url: `${site.url}/web`,
    email: site.email,
    areaServed: site.location,
    description: metadata.description,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero: the whole proposition, above the fold ────────── */}
      <section className="border-b border-line">
        <Container className="pt-14 pb-20 sm:pt-16 sm:pb-24">
          <div className="flex items-start justify-between">
            <Label>Northbound Web · {site.location}</Label>
            <span className="label text-accent-deep">01</span>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h1 className="display text-[clamp(3rem,12vw,10rem)] text-ink">
                Websites
                <span className="text-accent">.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                We build, host and manage websites for businesses. You explain
                what you do — the technical side is handled for you.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href="/contact" size="lg">
                  Start a project
                </ButtonLink>
                <ArrowLink href="/web/services">View services</ArrowLink>
              </div>

              <p className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="display text-4xl text-accent">
                  From {currency.format(ENTRY_PRICE)}
                </span>
                <span className="text-[15px] text-ink-muted">
                  · fixed price agreed in writing first
                </span>
              </p>
            </div>

            <div className="lg:pb-4">
              <BrowserFrame className="w-full text-ink" />
              <TravellingLine className="mt-6" />
            </div>
          </div>

          {/* The 30-second answer, as a strip of facts. */}
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10 lg:grid-cols-4">
            {[
              { t: 'Who it is for', d: 'Small businesses that need to look established' },
              { t: 'What you get', d: 'A site built, hosted and looked after' },
              { t: 'What it costs', d: `From ${currency.format(ENTRY_PRICE)}, quoted before you commit` },
              { t: 'What happens next', d: 'A free call, then a fixed written quote' },
            ].map((item) => (
              <div key={item.t}>
                <dt className="label text-accent-deep">{item.t}</dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-ink-muted">{item.d}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Editorial spreads ─────────────────────────────────── */}
      {spreads.map((s, i) => (
        <section key={s.word} className={cn('border-b border-line', i % 2 === 1 && 'bg-paper-sunk')}>
          <Container className="py-20 sm:py-28">
            <div className="step-in">
              <div className={cn('grid items-center gap-12 lg:grid-cols-[1fr_auto]', i % 2 === 1 && 'lg:grid-flow-dense')}>
                <div className={cn(i % 2 === 1 && 'lg:col-start-2')}>
                  <Label index={s.index} />
                  <Display className="mt-6">{s.word}</Display>
                  <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-muted">{s.copy}</p>
                </div>
                <div className={cn('w-44 justify-self-start sm:w-56 lg:w-72', i % 2 === 1 && 'lg:col-start-1 lg:justify-self-end', s.tint)}>
                  <s.Graphic />
                </div>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* ── Pinned: the headline holds while the scopes scroll ── */}
      <Section className="border-b border-line">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="pin-column">
              <Label index="05">What we build</Label>
              <Display className="mt-6">Scopes</Display>
              <p className="mt-8 max-w-sm text-lg leading-relaxed text-ink-muted">
                Four sizes, priced by the amount of work involved. Start at the
                bottom and move up only if you need to.
              </p>
              <ButtonLink href="/web/services" className="mt-10">
                See what is included
              </ButtonLink>
            </div>

            <ol className="border-t border-line">
              {buildScopes.map((s, i) => (
                <li key={s.slug} className="step-in border-b border-line py-10">
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="label text-accent-deep">{String(i + 1).padStart(2, '0')}</span>
                    {s.badge ? <span className="label text-accent-deep">{s.badge}</span> : null}
                  </div>
                  <h3 className="display mt-4 text-[clamp(2.5rem,7vw,4.5rem)] text-ink">{s.name}</h3>
                  <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-muted">{s.summary}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <span className="display text-3xl text-accent">
                      {s.pricing === 'from' && s.price
                        ? `From ${currency.format(s.price)}`
                        : 'Quoted'}
                    </span>
                    <span className="label text-ink-faint">{s.pages}</span>
                    <span className="label text-ink-faint">{s.revisions}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-faint">{PRICING_PROMISE}</p>
        </Container>
      </Section>

      {/* ── Already have a website ────────────────────────────── */}
      <StatementBand
        index="06"
        eyebrow="Already have a website?"
        word={existingSiteHelp.word}
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
              Start a project
            </ButtonLink>
            <p className="max-w-md text-sm leading-relaxed text-ink-faint">{existingSiteHelp.note}</p>
          </div>
        </Container>
      </Section>

      {/* ── Management ────────────────────────────────────────── */}
      <Section className="border-b border-line">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="pin-column">
              <Label index="07">After launch</Label>
              <Display className="mt-6">Kept</Display>
              <p className="mt-8 max-w-sm text-lg leading-relaxed text-ink-muted">
                Optional, rolling, and not a condition of the build. Someone
                keeps the site online, current and working — so you do not have
                to learn how.
              </p>
              <ArrowLink href="/web/services#management" className="mt-10">
                Compare the plans
              </ArrowLink>
            </div>

            <div className="grid border-t border-l border-line sm:grid-cols-3">
              {managementPlans.map((p) => (
                <div key={p.slug} className="border-r border-b border-line p-7">
                  <h3 className="label text-ink-faint">{p.name}</h3>
                  <p className="display mt-3 text-[clamp(2.25rem,5vw,3rem)] text-ink">
                    {currency.format(p.price)}
                    <span className="label ml-1 align-middle text-ink-faint">/mo</span>
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{p.summary}</p>
                  <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-ink-faint">
                    {p.changeTime}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Process ───────────────────────────────────────────── */}
      <Section className="border-b border-line">
        <Container>
          <Label index="08">How it runs</Label>
          <Display className="mt-6">Ordered</Display>
          <ol className="mt-14 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
            {process.map((item) => (
              <li key={item.step} className="border-r border-b border-line p-8 transition-colors hover:bg-paper-sunk">
                <p className="display text-4xl text-accent">{item.step}</p>
                <h3 className="display mt-4 text-2xl text-ink">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ol>
          <ArrowLink href="/web/process" className="mt-10">
            The standards behind every build
          </ArrowLink>
        </Container>
      </Section>

      {/* ── Close ─────────────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="step-in grid items-end gap-12 lg:grid-cols-[1fr_auto]">
            <div>
              <Label index="09" />
              <Display className="mt-6">Begin</Display>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-muted">
                Tell me what your business does and what is not working. I will
                tell you which scope fits, what it costs, and honestly whether
                you need me at all.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href="/contact" size="lg">
                  Start a project
                </ButtonLink>
                <a
                  href={`mailto:${site.email}`}
                  className="label text-ink-muted underline-offset-4 hover:text-accent-deep hover:underline"
                >
                  {site.email}
                </a>
              </div>
            </div>
            <CompassDiagram className="w-40 justify-self-start text-ink sm:w-56" />
          </div>
        </Container>
      </Section>
    </>
  )
}
