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
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Northbound AI — Jarvis',
  description:
    'Northbound AI builds Jarvis: a business assistant that actually does the work — reads your inbox and calendar, runs automations on a schedule, and asks before it acts. Currently in private preview.',
  alternates: { canonical: '/ai' },
}

/**
 * Everything on this page describes capability that exists in the Jarvis
 * codebase today. Nothing is aspirational, and the preview state is stated
 * plainly rather than implied. Do not add a capability here before it ships.
 */
const capabilities = [
  {
    index: '01',
    title: 'It uses tools, not just words',
    body: 'Jarvis decides which of its tools it needs, uses them, combines the results, and tells you what it did. Gmail, Calendar, Drive, GitHub, Vercel, web search.',
    state: 'Working',
  },
  {
    index: '02',
    title: 'It asks before it acts',
    body: 'Anything that reaches outside Jarvis — sending, creating, deleting — stops and asks first. Permission is enforced in the code that runs the tool, not in the instructions.',
    state: 'Working',
  },
  {
    index: '03',
    title: 'It runs on a schedule',
    body: 'Automations run without you opening anything. A morning brief, a weekly check, a recurring tidy-up. Scheduled work is capped at read-only by default.',
    state: 'Working',
  },
  {
    index: '04',
    title: 'It remembers what matters',
    body: 'Long-term memory, preferences and per-project context, so you are not re-explaining your business every morning.',
    state: 'Working',
  },
]

const states = [
  { label: 'Available', body: 'Ready to use on the free tier.' },
  { label: 'Needs connection', body: 'Works once you connect the account — Jarvis shows a Connect button rather than pretending.' },
  { label: 'Full Access', body: 'Advanced capability, switched on after a short request.' },
  { label: 'Coming later', body: 'Named honestly, never shown as if it works.' },
]

export default function AiPage() {
  return (
    <>
      <section className="border-b border-line">
        <Container className="pt-14 pb-20 sm:pt-16 sm:pb-24">
          <div className="flex items-start justify-between">
            <Label>Northbound AI</Label>
            <span className="label text-ink-faint">In private preview</span>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <h1 className="display text-[clamp(3rem,12vw,10rem)] text-ink">
                Jarvis<span className="text-accent">.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                A business assistant that does the work rather than describing
                it. One conversation, access to the tools your business already
                runs on.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href="/ai/full-access" size="lg">
                  Request Full Access
                </ButtonLink>
                <ArrowLink href="/ai/full-access">What Full Access unlocks</ArrowLink>
              </div>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-ink-faint">
                Jarvis is in private preview. It is not open to the public yet —
                access is granted a few people at a time, so the people using it
                get looked after properly.
              </p>
            </div>
            <div className="lg:pb-4">
              <Crosshair className="mx-auto w-56 text-ink sm:w-72" />
              <TravellingLine className="mt-10" />
            </div>
          </div>
        </Container>
      </section>

      <Section className="border-b border-line">
        <Container>
          <Label index="01">What it does today</Label>
          <Display className="mt-6">Works</Display>
          <div className="mt-14 grid border-t border-l border-line sm:grid-cols-2">
            {capabilities.map((c) => (
              <div key={c.index} className="step-in border-r border-b border-line p-8">
                <div className="flex items-center justify-between">
                  <span className="label text-accent-deep">{c.index}</span>
                  <span className="label text-ink-faint">{c.state}</span>
                </div>
                <h2 className="display mt-5 text-2xl text-ink sm:text-3xl">{c.title}</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <StatementBand
        index="02"
        eyebrow="No pretending"
        word="Honest"
        lede="Every capability shows its real state. If Gmail is not connected, Jarvis says connect Gmail — it does not quietly invent an inbox."
      />

      <Section className="border-b border-line">
        <Container>
          <div className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
            {states.map((s) => (
              <div key={s.label} className="border-r border-b border-line p-8">
                <h3 className="display text-xl text-ink">{s.label}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{s.body}</p>
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
              <Display className="mt-6">Access</Display>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-muted">
                Basic Jarvis stays free. Full Access opens the advanced
                capabilities, and it is free too — the request exists so I know
                who is using it and what would actually help.
              </p>
              <div className="mt-10">
                <ButtonLink href="/ai/full-access" size="lg">
                  Request Full Access
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
