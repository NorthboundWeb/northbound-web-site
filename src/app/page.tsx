import type { Metadata } from 'next'
import Link from 'next/link'
import { CompassDiagram, TravellingLine } from '@/components/graphics'
import { ArrowLink, Container, Display, Label, Section } from '@/components/ui'
import { divisions, site } from '@/lib/site'

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: '/' },
}

export default function GatewayPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    sameAs: site.socials.map((s) => s.href),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── The gateway ───────────────────────────────────────── */}
      <section className="border-b border-line">
        <Container className="pt-16 pb-14 sm:pt-24">
          <div className="flex items-start justify-between">
            <Label>{site.location}</Label>
            <span className="label text-accent-deep">00</span>
          </div>

          <h1 className="display mt-10 text-[clamp(3.5rem,16vw,15rem)] text-ink">
            {'Northbound'.split('').map((c, i) => (
              <span
                key={i}
                className="lift-in inline-block"
                style={{ animationDelay: `${i * 35}ms` }}
              >
                {c}
              </span>
            ))}
            <span className="lift-in inline-block text-accent" style={{ animationDelay: '385ms' }}>
              .
            </span>
          </h1>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
              A technology company building the digital infrastructure small
              businesses actually run on. Two directions so far.
            </p>
            <TravellingLine className="w-full max-w-xs lg:w-64" />
          </div>
        </Container>
      </section>

      {/* ── Choose your direction ─────────────────────────────── */}
      <section className="border-b border-line">
        <Container className="py-10">
          <Label index="01">Choose your direction</Label>
        </Container>

        <div className="grid border-t border-line lg:grid-cols-2">
          {divisions.map((d, i) => (
            <Link
              key={d.id}
              href={d.href}
              className={`group relative flex min-h-[58vh] flex-col justify-between overflow-hidden p-8 transition-colors duration-300 sm:p-12 lg:min-h-[68vh] ${
                i === 0
                  ? 'border-b border-line hover:bg-paper-sunk lg:border-r lg:border-b-0'
                  : 'bg-paper-sunk hover:bg-paper'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="label text-ink-faint">Northbound {d.name}</span>
                <span
                  className={`label ${d.state === 'live' ? 'text-accent-deep' : 'text-ink-faint'}`}
                >
                  {d.stateLabel}
                </span>
              </div>

              <div>
                <p className="display text-[clamp(3.5rem,11vw,8rem)] text-ink transition-transform duration-500 group-hover:-translate-y-1">
                  {d.word}
                  <span className="text-accent">.</span>
                </p>
                <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-ink-muted">
                  {d.summary}
                </p>
                <span className="label mt-8 inline-flex items-center gap-2.5 text-ink">
                  Enter Northbound {d.name}
                  <span className="text-accent-deep transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </span>
              </div>

              {/* A rule that draws itself across the panel on hover. */}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ── What Northbound is ────────────────────────────────── */}
      <Section>
        <Container>
          <div className="step-in grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <Label index="02">The idea</Label>
              <Display className="mt-6">Own it</Display>
              <p className="mt-8 text-lg leading-relaxed text-ink-muted">
                Small businesses get handed software they do not own, on
                platforms they cannot leave, at prices that only go up.
                Northbound builds the opposite: work you own outright, on
                infrastructure that will still be maintained in five years,
                priced so you know the number before you commit.
              </p>
              <div className="mt-10 flex flex-wrap gap-6">
                <ArrowLink href="/web">Websites and management</ArrowLink>
                <ArrowLink href="/ai">Tools and automation</ArrowLink>
              </div>
            </div>
            <CompassDiagram className="w-40 justify-self-start text-ink sm:w-56" />
          </div>
        </Container>
      </Section>
    </>
  )
}
