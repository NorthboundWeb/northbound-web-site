import type { Metadata } from 'next'
import Link from 'next/link'
import { Comparison } from '@/components/comparison'
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
import { comparisons, methods } from '@/lib/discover'

export const metadata: Metadata = {
  title: 'Discover — what a proper website changes',
  description:
    'Four small-business websites, before and after. Drag the slider, see what changed and why, and compare building it yourself, hiring an agency, or working with Northbound.',
  alternates: { canonical: '/discover' },
}

export default function DiscoverPage() {
  return (
    <>
      <Section className="border-b border-line pb-16 sm:pb-20">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="01">Discover</Label>
            <span className="label text-ink-faint">Before and after</span>
          </div>
          <Display as="h1" className="mt-6">
            Seen
          </Display>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Four small businesses, the website they had, and the one they
            should have. Drag the handle across each one. Every business here
            is invented — the problems are not.
          </p>
          <nav aria-label="Jump to a comparison" className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {comparisons.map((c, i) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="label flex items-center gap-3 text-ink transition-colors hover:text-accent"
              >
                <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                {c.business}
              </a>
            ))}
            <a href="#methods" className="label flex items-center gap-3 text-ink transition-colors hover:text-accent">
              <span className="text-accent">05</span>
              Three ways to get a website
            </a>
          </nav>
        </Container>
      </Section>

      {comparisons.map((c, index) => (
        <section
          key={c.slug}
          id={c.slug}
          aria-labelledby={`${c.slug}-heading`}
          className={cn(
            'scroll-mt-20 border-b border-line py-16 sm:py-24',
            index % 2 === 1 && 'bg-paper-sunk'
          )}
        >
          <Container>
            <div className="flex items-start justify-between gap-6">
              <Label index={String(index + 1).padStart(2, '0')}>{c.trade}</Label>
              <span className="label text-ink-faint">Invented business</span>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
              <div>
                <h2 id={`${c.slug}-heading`} className="display text-4xl sm:text-5xl">
                  {c.business}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-ink-muted">{c.who}</p>
                <p className="mt-4 border-l-2 border-accent pl-4 text-base leading-relaxed text-ink">
                  {c.problem}
                </p>

                <h3 className="label mt-10 text-ink-faint">What changed</h3>
                <ol className="mt-4 divide-y divide-line border-y border-line">
                  {c.changes.map((ch, i) => (
                    <li key={ch.title} className="grid grid-cols-[2rem_1fr] gap-3 py-4">
                      <span className="label pt-0.5 text-accent">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <p className="font-medium text-ink">{ch.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{ch.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="lg:sticky lg:top-24 lg:self-start">
                <Comparison data={c} />

                <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
                  {c.facts.map((f) => (
                    <div key={f.label} className="bg-paper-raised p-4">
                      <dt className="label text-ink-faint">{f.label}</dt>
                      <dd className="mt-2 text-sm">
                        <span className="block text-ink-faint line-through decoration-accent/60">{f.before}</span>
                        <span className="mt-0.5 block font-medium text-ink">{f.after}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-ink-faint">
                  Figures are measured on the two mock-ups above, not claimed
                  from a real client.
                </p>
              </div>
            </div>
          </Container>
        </section>
      ))}

      <StatementBand
        id="methods"
        index="05"
        eyebrow="Three ways to get a website"
        word="Compared"
        aside="Fair"
        lede="Build it yourself on a site builder, hire an agency, or work with Northbound. Each has a case. Here is how they differ, without pretending the alternatives have no merits."
        className="scroll-mt-20"
      />

      <Section className="border-b border-line">
        <Container>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="label py-4 pr-6 font-medium text-ink-faint">What matters</th>
                  <th scope="col" className="label py-4 pr-6 font-medium text-ink-faint">Site builder</th>
                  <th scope="col" className="label py-4 pr-6 font-medium text-ink-faint">Agency</th>
                  <th scope="col" className="label py-4 font-medium text-accent">Northbound</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((row) => (
                  <tr key={row.label} className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-6 font-medium text-ink">{row.label}</th>
                    <td className={cn('py-4 pr-6', row.best === 'builder' ? 'text-ink' : 'text-ink-muted')}>{row.builder}</td>
                    <td className={cn('py-4 pr-6', row.best === 'agency' ? 'text-ink' : 'text-ink-muted')}>{row.agency}</td>
                    <td className={cn('py-4', row.best === 'northbound' ? 'font-medium text-ink' : 'text-ink-muted')}>
                      {row.northbound}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-faint">
            Builder and agency figures are typical ranges from publicly
            advertised pricing, not quotes. If your situation is the cheap and
            quick one, a site builder may be the right answer — and I will say
            so on the call.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Label index="06">Your turn</Label>
              <Display as="p" className="mt-6">
                Next
              </Display>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
                Tell me what your website should be doing for you and isn&apos;t.
                You get a fixed price back, and a straight answer if a package
                is more than you need.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" size="lg">Start a project</ButtonLink>
              <ArrowLink href="/services">See prices</ArrowLink>
            </div>
          </div>
          <p className="mt-16 text-sm text-ink-faint">
            Want to check your own site first?{' '}
            <Link href="/#check" className="text-ink underline decoration-line-strong underline-offset-4 hover:text-accent">
              The eight-question check on the home page
            </Link>{' '}
            takes under a minute.
          </p>
        </Container>
      </Section>
    </>
  )
}
