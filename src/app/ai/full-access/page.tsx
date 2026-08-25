import type { Metadata } from 'next'
import { ButtonLink, Container, Display, Label, Section, StatementBand } from '@/components/ui'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Jarvis Full Access',
  description:
    'Full Access opens Jarvis’s advanced capabilities. It is free and approval-based — the request exists so Northbound knows who is using Jarvis and what would genuinely help them.',
  alternates: { canonical: '/ai/full-access' },
}

/**
 * Benefit-led on purpose. The top level answers "what can it now do for me?" —
 * the permission detail is available underneath for anyone who wants it, but
 * it is never the headline.
 */
const unlocks = [
  {
    index: '01',
    headline: 'Your morning, already read',
    body: 'Jarvis reads your inbox, calendar and deployments before you do, and tells you what actually needs you today.',
    detail:
      'Requires connecting Google (Gmail, Calendar, Drive). Read access only unless you approve an action. Jarvis never sends on your behalf without asking.',
  },
  {
    index: '02',
    headline: 'Work that happens without you',
    body: 'Recurring jobs run on a schedule — a weekly summary, a Monday check, a nightly tidy — and tell you when they are done.',
    detail:
      'Scheduled runs are capped at read-only by default, enforced in the executor rather than the prompt. Anything with a side effect waits for approval.',
  },
  {
    index: '03',
    headline: 'It knows your business',
    body: 'Long-term memory and per-project context, so you stop re-explaining who your clients are and how you work.',
    detail:
      'Memory is stored against your account with row-level security. You can read, edit and delete any of it at any time.',
  },
  {
    index: '04',
    headline: 'The tools you already pay for',
    body: 'Gmail, Calendar, Drive, GitHub, Vercel and web search, used together in one conversation rather than eight tabs.',
    detail:
      'Each integration is connected by you via OAuth. Tokens are encrypted before storage and never sent to the browser.',
  },
]

export default function FullAccessPage() {
  return (
    <>
      <Section className="border-b border-line">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="01">Jarvis</Label>
            <span className="label text-accent-deep">Free · approval-based</span>
          </div>
          <Display as="h1" className="mt-6">
            Full Access
          </Display>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Basic Jarvis is free and always will be. Full Access opens the
            advanced capabilities — and it is free as well. There is a request
            step because Jarvis is in private preview, and because knowing who
            is using it and what they need is how it gets better.
          </p>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <ButtonLink href="/contact?type=jarvis" size="lg">
              Request Full Access
            </ButtonLink>
            <p className="max-w-sm text-sm leading-relaxed text-ink-faint">
              No card, no trial, no upsell. It is not a paywall.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="border-b border-line">
        <Container>
          <Label index="02">What it opens</Label>
          <Display className="mt-6">More</Display>
          <div className="mt-14 border-t border-line">
            {unlocks.map((u) => (
              <details key={u.index} className="group step-in border-b border-line">
                <summary className="flex cursor-pointer items-start gap-6 py-8 transition-colors hover:bg-paper-sunk">
                  <span className="label shrink-0 pt-2 text-accent-deep">{u.index}</span>
                  <span className="flex-1">
                    <span className="display block text-[clamp(1.75rem,4vw,2.75rem)] text-ink">
                      {u.headline}
                    </span>
                    <span className="mt-3 block max-w-xl text-[17px] leading-relaxed text-ink-muted">
                      {u.body}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="label shrink-0 pt-2 text-accent-deep transition-transform duration-300 group-open:rotate-90"
                  >
                    →
                  </span>
                </summary>
                <p className="max-w-2xl pb-8 pl-[3.75rem] text-[15px] leading-relaxed text-ink-faint">
                  {u.detail}
                </p>
              </details>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-faint">
            Open any row for the permission detail. Nothing is switched on
            without you connecting the account it needs.
          </p>
        </Container>
      </Section>

      <StatementBand
        index="03"
        eyebrow="How it works"
        word="Ask"
        lede="Use Jarvis. When you hit something that needs Full Access, ask for it. I read every request personally and reply — usually within a working day."
      />

      <Section>
        <Container>
          <div className="max-w-3xl">
            <Display>Request</Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              Tell me what you would want Jarvis to do for you. That is the
              whole request — it is the most useful thing you can send.
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href="/contact?type=jarvis" size="lg">
                Request Full Access
              </ButtonLink>
              <a
                href={`mailto:${site.email}`}
                className="label text-ink-muted underline-offset-4 hover:text-accent-deep hover:underline"
              >
                {site.email}
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
