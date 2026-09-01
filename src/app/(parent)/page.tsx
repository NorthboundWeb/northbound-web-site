import type { Metadata } from 'next'
import Link from 'next/link'
import { CompassDiagram } from '@/components/graphics'
import { ArrowLink, Container, Display, Label, Section } from '@/components/ui'
import { divisions, site } from '@/lib/site'

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: '/' },
}

/**
 * The gateway.
 *
 * Its whole job is to make two things obvious in one screen: this is a parent
 * company, and there are two directions. So the divisions are not cards on a
 * page — they are two full environments you step into, each rendering in its
 * own palette via `data-division`. Hovering one dims the other; the choice is
 * the interaction.
 *
 * Adding a third division changes the grid and nothing else.
 */
export default function GatewayPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    sameAs: site.socials.map((s) => s.href),
    department: divisions.map((d) => ({
      '@type': 'Organization',
      name: d.wordmark,
      url: new URL(d.href, site.url).toString(),
      description: d.summary,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── The masthead ──────────────────────────────────────── */}
      <section className="border-b border-line">
        <Container className="pt-14 pb-12 sm:pt-20 sm:pb-16">
          <div className="flex items-baseline justify-between gap-4">
            <Label>{site.location}</Label>
            <span className="label text-ink-faint">Est. 2026</span>
          </div>

          <h1 className="display mt-10 text-[clamp(3.25rem,17vw,16rem)] text-ink">
            {'Northbound'.split('').map((c, i) => (
              <span
                key={i}
                className="lift-in inline-block"
                style={{ animationDelay: `${i * 32}ms` }}
              >
                {c}
              </span>
            ))}
            <span
              className="lift-in inline-block text-accent"
              style={{ animationDelay: '352ms' }}
            >
              .
            </span>
          </h1>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-lg leading-relaxed text-ink-muted sm:text-xl">
              {site.tagline} Two divisions: one builds where your business
              lives, the other builds who works in it.
            </p>
            <p className="label shrink-0 text-ink-faint">
              Choose your direction ↓
            </p>
          </div>
        </Container>
      </section>

      {/* ── The two directions ────────────────────────────────── */}
      <section className="group/gate grid border-b border-line lg:grid-cols-2">
        {divisions.map((d, i) => (
          <Link
            key={d.id}
            href={d.href}
            data-division={d.id}
            className={[
              'group/panel relative flex min-h-[26rem] flex-col justify-between overflow-hidden',
              'bg-paper p-7 text-ink transition-[opacity,background-color] duration-500 sm:p-12',
              'lg:min-h-[36rem]',
              // The unhovered panel steps back so the chosen one steps forward.
              'lg:group-hover/gate:opacity-55 lg:hover:!opacity-100',
              i === 0 ? 'border-b border-line lg:border-r lg:border-b-0' : '',
            ].join(' ')}
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="label text-ink-faint">
                {d.index} / {d.wordmark}
              </span>
              <span
                className={`label ${d.state === 'live' ? 'text-accent-deep' : 'text-ink-faint'}`}
              >
                {d.stateLabel}
              </span>
            </div>

            <div className="mt-16 lg:mt-0">
              {/* The promise is the headline; the division name is the label. */}
              <p className="display text-[clamp(2.75rem,9vw,5.5rem)] text-ink">
                {d.promise.replace(/\.$/, '')}
                <span className="text-accent">.</span>
              </p>
              <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-ink-muted">
                {d.summary}
              </p>
              <span className="label mt-9 inline-flex items-center gap-2.5 text-ink">
                {d.enter}
                <span
                  aria-hidden
                  className="text-accent-deep transition-transform duration-300 group-hover/panel:translate-x-2"
                >
                  →
                </span>
              </span>
            </div>

            {/* A rule that draws itself across the panel on approach. */}
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-500 group-hover/panel:w-full"
            />
          </Link>
        ))}
      </section>

      {/* ── What Northbound is ────────────────────────────────── */}
      <Section>
        <Container>
          <div className="step-in grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <Label index="03">The idea</Label>
              <Display className="mt-6">Own it</Display>
              <p className="mt-8 text-lg leading-relaxed text-ink-muted">
                Small businesses get handed software they do not own, on
                platforms they cannot leave, at prices that only go up.
                Northbound builds the opposite: work you own outright, on
                infrastructure that will still be maintained in five years,
                priced so you know the number before you commit.
              </p>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
                {divisions.map((d) => (
                  <ArrowLink key={d.id} href={d.href}>
                    {d.wordmark}
                  </ArrowLink>
                ))}
              </div>
            </div>
            <CompassDiagram className="w-36 justify-self-start text-ink sm:w-52" />
          </div>
        </Container>
      </Section>
    </>
  )
}
