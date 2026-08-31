import type { Metadata } from 'next'
import { CompassDiagram, Crosshair, TravellingLine } from '@/components/graphics'
import {
  ArrowLink,
  ButtonLink,
  Container,
  Display,
  Label,
  Section,
  StatementBand,
} from '@/components/ui'
import {
  AI_STATUS_NOTE,
  EMPLOYEE_STATE_LABEL,
  employeesByReadiness,
} from '@/lib/ai-employees'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  // Absolute: this is a division landing page, so it carries the full brand
  // itself rather than having ' — Northbound' appended to a name that
  // already contains it.
  title: { absolute: 'Northbound.AI — AI employees for your business' },
  description:
    'Northbound.AI builds AI employees: workers that do a real job in your business — reading your inbox, auditing your site, handling the admin — rather than sitting in a chat window. In development.',
  alternates: { canonical: '/ai' },
}

/**
 * A preview, and it says so at the top. Every role reads from
 * `src/lib/ai-employees.ts`, where `state` is what stops this page describing
 * something that does not exist as though you could buy it today. No prices:
 * Northbound.AI is not on sale.
 */

const principles = [
  {
    index: '01',
    title: 'A job, not a chatbot',
    body: 'An employee has a role and a remit. It does the whole job — gathers what it needs, does the work, tells you what it did — rather than waiting to be prompted a step at a time.',
  },
  {
    index: '02',
    title: 'It asks before it acts',
    body: 'Anything that reaches outside — sending, creating, deleting — stops and asks. Permission is enforced in the code that runs the action, not in the instructions given to a model.',
  },
  {
    index: '03',
    title: 'It uses what you already have',
    body: 'Your inbox, your calendar, your files, your site. An employee works with the tools the business already runs on instead of asking you to move into a new one.',
  },
  {
    index: '04',
    title: 'You can see what it did',
    body: 'Every action is recorded and readable after the fact. An employee whose work you cannot check is not one you can trust with anything that matters.',
  },
]

export default function AiPage() {
  return (
    <>
      <section className="border-b border-line">
        <Container className="pt-14 pb-20 sm:pt-16 sm:pb-24">
          <div className="flex items-start justify-between">
            <Label>Northbound.AI</Label>
            <span className="label text-ink-faint">In development</span>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h1 className="display text-[clamp(2.75rem,10vw,8rem)] text-ink">
                AI employees<span className="text-accent">.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                Not another chatbot. Workers that hold a role in your business
                and do the job end to end — the morning read-through, the site
                audit, the admin nobody gets round to.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href="/ai/full-access" size="lg">
                  Request early access
                </ButtonLink>
                <ArrowLink href="/ai/full-access">What Full Access unlocks</ArrowLink>
              </div>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-ink-faint">
                {AI_STATUS_NOTE}
              </p>
            </div>
            <div className="lg:pb-4">
              <Crosshair className="mx-auto w-56 text-ink sm:w-72" />
              <TravellingLine className="mt-10" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── The roster ─────────────────────────────────────────── */}
      <Section className="border-b border-line">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label index="01">The roster</Label>
              <Display className="mt-6">Hires</Display>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink-faint">
              Each one is a role with a boundary. The state beside it is the
              real state — nothing here is described as working before it is.
            </p>
          </div>

          <div className="mt-14 grid border-t border-l border-line md:grid-cols-2 xl:grid-cols-3">
            {employeesByReadiness.map((e) => (
              <div
                key={e.slug}
                className="step-in flex flex-col border-r border-b border-line p-8"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="display text-2xl text-ink sm:text-3xl">{e.role}</h2>
                  <span
                    className={`label shrink-0 ${
                      e.state === 'live' ? 'text-accent-deep' : 'text-ink-faint'
                    }`}
                  >
                    {EMPLOYEE_STATE_LABEL[e.state]}
                  </span>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                  {e.remit}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {e.duties.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="text-[14px] leading-relaxed text-ink-muted">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <StatementBand
        index="02"
        eyebrow="How they are built"
        word="Bounded"
        lede="An employee you cannot audit and cannot stop is not an employee, it is a liability. Every one of these is built to be checked."
      />

      <Section className="border-b border-line">
        <Container>
          <div className="grid border-t border-l border-line sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.index} className="border-r border-b border-line p-8">
                <span className="label text-accent-deep">{p.index}</span>
                <h3 className="display mt-4 text-2xl text-ink sm:text-3xl">{p.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="step-in grid items-end gap-12 lg:grid-cols-[1fr_auto]">
            <div>
              <Label index="03" />
              <Display className="mt-6">Early</Display>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-muted">
                The Assistant is in private preview as Jarvis. There is no
                public pricing for Northbound.AI yet, because there is nothing
                to sell yet — access is granted a few people at a time so the
                people using it get looked after properly.
              </p>
              <div className="mt-10">
                <ButtonLink href="/ai/full-access" size="lg">
                  Request early access
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-ink-faint">
                Or email{' '}
                <a href={`mailto:${site.email}`} className="text-accent-deep underline-offset-4 hover:underline">
                  {site.email}
                </a>
              </p>
            </div>
            <CompassDiagram className="w-40 justify-self-start text-ink sm:w-56" />
          </div>
        </Container>
      </Section>
    </>
  )
}
