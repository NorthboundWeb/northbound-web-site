import type { Metadata } from 'next'
import {
  Arrow,
  ButtonLink,
  Container,
  Eyebrow,
  Section,
} from '@/components/ui'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description: `About ${site.name} — an independent web development studio building websites and web applications for small businesses across the ${site.location}.`,
  alternates: { canonical: '/about' },
}

/*
  NOTE FOR CHE: this page deliberately makes no claims that need verifying —
  no invented years of experience, client counts, or past projects. Everything
  here is about how you work, which is true today. Add the specifics (your
  background, a photo, real client names once you have permission) when you
  have them. Made-up credentials are the fastest way to lose a client who
  checks.
*/

const beliefs = [
  {
    title: 'The price is on the page',
    body: 'Package prices are published, and they are what you pay. If the work grows because you have asked for something new, we agree that separately, in writing, before I build it. No invoice should ever be a surprise.',
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
    title: 'The honest answer, even when it costs me',
    body: 'If the Basic Build would do what you need, I will not sell you the Advanced one. If the thing you are describing does not need a developer at all, I will say so. Long-term relationships pay better than one oversold project.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Section className="border-b border-line">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-6 text-4xl leading-[1.1] font-normal sm:text-5xl">
              A small studio, which is rather the point.
            </h1>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink-muted">
              <p>
                Northbound Web is an independent web development studio working
                with small businesses across the {site.location}. When you get in
                touch, you are talking to the person who will design and build
                the thing — not an account manager relaying messages to a team
                you never meet.
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
                genuinely own — and, if you want it, looked after by me for a
                predictable monthly fee.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>How I work</Eyebrow>
            <h2 className="mt-6 text-3xl leading-tight sm:text-4xl">
              Four things I will not budge on.
            </h2>
          </div>

          <dl className="mt-16 grid gap-x-14 gap-y-12 sm:grid-cols-2">
            {beliefs.map((belief) => (
              <div key={belief.title} className="border-t border-line pt-6">
                <dt className="text-lg">{belief.title}</dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                  {belief.body}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section className="border-t border-line bg-paper-sunk">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl leading-tight sm:text-4xl">
              Let us have a conversation.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              No obligation, no pitch, and no proposal written before I
              understand what your business actually needs.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <ButtonLink href="/contact" size="lg">
                Get in touch <Arrow />
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
