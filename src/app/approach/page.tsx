import type { Metadata } from 'next'
import {
  Arrow,
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from '@/components/ui'
import { process, standards } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Approach',
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
          <div className="max-w-3xl">
            <Eyebrow>Approach</Eyebrow>
            <h1 className="mt-6 text-4xl leading-[1.1] font-normal sm:text-5xl">
              A website is not a deliverable. It is something that has to keep
              working.
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-ink-muted">
              Plenty of sites look fine the week they launch and quietly rot
              afterwards — slow on a phone, invisible to search, impossible to
              edit, or sitting on a platform that puts the rent up every year.
              Most of that is decided by choices made before anyone opens a
              design tool. Here is how I make them.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="The process"
            title="Six steps, every project."
            lede="You know what stage we are at, what happens next, and what it costs — from the first call onwards."
          />

          <ol className="mt-16 space-y-px overflow-hidden rounded-2xl border border-line bg-line">
            {process.map((item) => (
              <li
                key={item.step}
                className="grid gap-4 bg-paper p-8 sm:grid-cols-[auto_1fr] sm:gap-10 sm:p-10"
              >
                <p className="font-serif text-2xl text-accent sm:w-16">
                  {item.step}
                </p>
                <div>
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="border-y border-line bg-paper-sunk">
        <Container>
          <SectionHeading
            eyebrow="Standards"
            title="Non-negotiables."
            lede="These apply whether you are spending six hundred pounds or six thousand. They are the difference between a site that lasts and one that has to be rebuilt in eighteen months."
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

      <Section>
        <Container>
          <SectionHeading
            eyebrow="The stack"
            title="Boring tools, chosen on purpose."
            lede="Nothing here is used because it is fashionable. Each one is proven, well documented, and something another developer could pick up if you ever needed them to."
          />

          <dl className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {stack.map((item) => (
              <div key={item.name} className="border-t border-line pt-6">
                <dt className="text-lg">{item.name}</dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                  {item.why}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-12 max-w-2xl text-sm leading-relaxed text-ink-faint">
            Small projects do not get all of this. A brochure site does not need
            a database or a payment system, and adding one would mean charging
            you for complexity you will never use. Each project gets only the
            pieces it genuinely needs.
          </p>
        </Container>
      </Section>

      <Section className="border-t border-line bg-paper-sunk">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl leading-tight sm:text-4xl">
              Sound like the right fit?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              The first conversation is free and there is no pitch at the end of
              it — just an honest read on what you need.
            </p>
            <div className="mt-9 flex justify-center">
              <ButtonLink href="/contact" size="lg">
                Start a conversation <Arrow />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
