import type { Metadata } from 'next'
import { CompassDiagram, TravellingLine } from '@/components/graphics'
import {
  ButtonLink,
  Container,
  Display,
  Label,
  Section,
  StatementBand,
} from '@/components/ui'
import { process, standards } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Process',
  description:
    'How a Northbound Web project runs, from first conversation to aftercare — and the standards applied to performance, accessibility, security and ownership on every build.',
  alternates: { canonical: '/approach' },
}

const stack = [
  {
    name: 'Next.js and React',
    why: 'Pages are rendered ahead of time and served as finished HTML, so they appear immediately instead of waiting on the browser to assemble them.',
  },
  {
    name: 'Vercel',
    why: 'Hosting on a global edge network with automatic HTTPS. Every change gets a preview link before it reaches the public site.',
  },
  {
    name: 'Supabase',
    why: 'Database, accounts and file storage when a project needs them, with access rules enforced at the database rather than in the browser.',
  },
  {
    name: 'Stripe',
    why: 'Payments, deposits and subscriptions. Card details go to Stripe directly and are never stored on your site.',
  },
  {
    name: 'Cloudflare',
    why: 'Domains and DNS, with changes planned in advance so a switch never takes your site or email offline.',
  },
  {
    name: 'Sentry and PostHog',
    why: 'Error monitoring and analytics, configured to answer business questions without collecting personal data you have no use for.',
  },
]

export default function ApproachPage() {
  return (
    <>
      <Section className="border-b border-line">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="01">Process</Label>
            <span className="label text-ink-faint">Six steps</span>
          </div>
          <Display as="h1" className="mt-6">
            Ordered
          </Display>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Plenty of sites look fine the week they launch and quietly rot
            afterwards — slow on a phone, invisible to search, impossible to
            edit. Most of that is decided by choices made before anyone opens a
            design tool. Here is how I make them.
          </p>
          <TravellingLine className="mt-14 max-w-xl" />
        </Container>
      </Section>

      <Section className="border-b border-line">
        <Container>
          <ol className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
            {process.map((item) => (
              <li
                key={item.step}
                className="border-r border-b border-line p-8 transition-colors hover:bg-paper-sunk"
              >
                <p className="display text-5xl text-accent">{item.step}</p>
                <h2 className="display mt-5 text-2xl text-ink sm:text-3xl">
                  {item.title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <StatementBand
        index="02"
        eyebrow="Standards"
        word="Solid"
        lede="These apply whether you are spending £199 or £499. They are the difference between a site that lasts and one that has to be rebuilt in eighteen months."
      />

      <Section className="border-b border-line">
        <Container>
          <div className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((s) => (
              <div key={s.title} className="border-r border-b border-line p-8">
                <h3 className="display text-2xl text-ink">{s.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-b border-line">
        <Container>
          <div className="reveal">
            <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <Label index="03">The stack</Label>
                <Display className="mt-6">Boring</Display>
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
                  Nothing here is used because it is fashionable. Each one is
                  proven, well documented, and something another developer could
                  pick up if you ever needed them to.
                </p>
              </div>
              <CompassDiagram className="w-36 justify-self-start text-ink sm:w-48" />
            </div>

            <dl className="mt-16 grid border-t border-l border-line sm:grid-cols-2">
              {stack.map((item) => (
                <div key={item.name} className="border-r border-b border-line p-8">
                  <dt className="display text-2xl text-ink">{item.name}</dt>
                  <dd className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                    {item.why}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-faint">
              Small projects do not get all of this. A brochure site does not
              need a database or a payment system, and adding one would mean
              charging you for complexity you will never use. Each project gets
              only the pieces it genuinely needs.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-3xl">
            <Display>Begin</Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              The first conversation is free and there is no pitch at the end of
              it — just an honest read on what you need.
            </p>
            <div className="mt-10">
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
