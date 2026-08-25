import type { Metadata } from 'next'
import { Crosshair } from '@/components/graphics'
import {
  ArrowLink,
  ButtonLink,
  Container,
  Display,
  Label,
  Section,
  StatementBand,
} from '@/components/ui'
import { divisions, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description: `${site.name} is an independent technology company in the ${site.location}, building websites and software for small businesses.`,
  alternates: { canonical: '/about' },
}

/*
  NOTE FOR CHE: this page deliberately makes no claims that need verifying —
  no invented years of experience, client counts, or past projects. Add the
  specifics when you have them. Made-up credentials are the fastest way to
  lose a client who checks.
*/

const beliefs = [
  {
    title: 'The price is on the page',
    body: 'Where a price is published, it is what you pay for that scope. Anything beyond it is quoted in writing and agreed before I build it. No invoice should ever be a surprise.',
  },
  {
    title: 'You own everything',
    body: 'The domain stays in your name. The code lives in a repository you own. If you ever want to take the project elsewhere, you hand another developer a link and they can get to work. Nothing here depends on me staying reachable.',
  },
  {
    title: 'Plain English, always',
    body: 'You should never have to nod along to something you do not follow. I will explain what I am recommending and why, in language that does not require a computer science degree, and I will tell you when a decision genuinely does not matter.',
  },
  {
    title: 'The honest answer',
    body: 'If the smallest scope would do what you need, I will not sell you a larger one. If the thing you are describing does not need a developer at all, I will say so. Long-term relationships pay better than one oversold project.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Section className="border-b border-line">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="01">About</Label>
            <span className="label text-ink-faint">{site.location}</span>
          </div>
          <Display as="h1" className="mt-6">
            Small
          </Display>
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_auto] lg:items-start">
            <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink-muted">
              <p>
                Northbound is an independent technology company working with
                small businesses across the {site.location}. It is deliberately
                small: when you get in touch, you are talking to the person who
                will design and build the thing — not an account manager
                relaying messages to a team you never meet.
              </p>
              <p>
                Most small businesses have been failed by their website at least
                once. A cheap template that never brought in an enquiry. An
                agency that vanished after launch. A platform that seemed
                reasonable until the subscription doubled and the content turned
                out to be impossible to export. The work here is a reaction to
                all three.
              </p>
              <p>
                So: proper design rather than a stock theme, built on tools that
                will still be maintained in five years, handed over in a form you
                genuinely own — and, if you want it, looked after for a
                predictable monthly fee.
              </p>
            </div>
            <Crosshair className="w-36 justify-self-start text-olive sm:w-48" />
          </div>
        </Container>
      </Section>

      <Section className="border-b border-line">
        <Container>
          <Label index="02">The divisions</Label>
          <div className="mt-10 grid border-t border-l border-line sm:grid-cols-2">
            {divisions.map((d) => (
              <div key={d.id} className="border-r border-b border-line p-8">
                <p className="label flex items-center gap-3 text-ink-faint">
                  <span
                    aria-hidden
                    className={
                      d.state === 'live'
                        ? 'inline-block h-2 w-2 rounded-full bg-accent'
                        : 'inline-block h-2 w-2 rounded-full border border-line-strong'
                    }
                  />
                  {d.stateLabel}
                </p>
                <h2 className="display mt-4 text-3xl text-ink">
                  Northbound {d.name}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                  {d.summary}
                </p>
                <ArrowLink href={d.href} className="mt-6">
                  Northbound {d.name}
                </ArrowLink>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <StatementBand
        index="03"
        eyebrow="How I work"
        word="Four"
        lede="Things I will not budge on."
      />

      <Section className="border-b border-line">
        <Container>
          <dl className="grid border-t border-l border-line sm:grid-cols-2">
            {beliefs.map((b, i) => (
              <div key={b.title} className="border-r border-b border-line p-8">
                <span className="label text-accent-deep">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <dt className="display mt-4 text-2xl text-ink sm:text-3xl">
                  {b.title}
                </dt>
                <dd className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                  {b.body}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-3xl">
            <Display>Talk</Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              No obligation, no pitch, and no proposal written before I
              understand what your business actually needs.
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
              <ArrowLink href="/web/services">See what a build includes</ArrowLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
