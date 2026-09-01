import type { Metadata } from 'next'
import { EmployeeCard } from '@/components/ai/employee-card'
import { OutcomePicker } from '@/components/ai/outcome-picker'
import { TeamFlow } from '@/components/ai/team-flow'
import { TravellingLine } from '@/components/graphics'
import {
  ArrowLink,
  ButtonLink,
  Container,
  Display,
  Label,
  Section,
} from '@/components/ui'
import { AI_STATUS_NOTE, employeesByReadiness } from '@/lib/ai/employees'
import { teamStatus, teams } from '@/lib/ai/teams'
import { STATUS_LABEL } from '@/lib/ai/employees'
import { site } from '@/lib/site'
import Link from 'next/link'

export const metadata: Metadata = {
  // Absolute: a division landing page carries the full brand itself rather
  // than having ' — Northbound' appended to a name that already contains it.
  title: { absolute: 'Northbound.AI — AI employees built to get work done' },
  description:
    'Northbound Employees are specialists that take on a real job in your business — finding customers, writing the outreach, watching the website. Hire one, or a team built around the outcome. In development.',
  alternates: { canonical: '/ai' },
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Say what you need',
    body: 'Not which product — what is actually going wrong, or not happening. That is enough to start.',
  },
  {
    step: '02',
    title: 'We match the employee',
    body: 'One specialist, or a team where the job runs across more than one. If nothing fits yet, we will say so.',
  },
  {
    step: '03',
    title: 'You connect what it needs',
    body: 'Only the accounts that specific job requires, connected by you and revocable at any time.',
  },
  {
    step: '04',
    title: 'It starts working',
    body: 'Research, drafts, lists, checks — produced and handed to you rather than happening invisibly.',
  },
  {
    step: '05',
    title: 'You stay in charge',
    body: 'Anything that leaves your business waits for your approval. You see what was done and can stop it.',
  },
]

const CONTROL = [
  {
    title: 'You choose what it can reach',
    body: 'An employee is connected to the accounts its job needs and nothing else. Connecting is a decision you make, one at a time.',
  },
  {
    title: 'Nothing leaves without approval',
    body: 'Messages, posts and changes are prepared and shown to you. Sending is a separate step, and it is yours.',
  },
  {
    title: 'The work is visible',
    body: 'You can see what an employee did and what it produced. Work you cannot check is work you cannot trust.',
  },
  {
    title: 'You can disconnect',
    body: 'Remove an account and access stops. There is no arrangement that survives you changing your mind.',
  },
]

export default function AiPage() {
  return (
    <>
      {/* ── 01 · Hero ─────────────────────────────────────────── */}
      <section className="border-b border-line">
        <Container className="pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="flex items-baseline justify-between gap-4">
            <Label>Northbound.AI</Label>
            <span className="label text-ink-faint">02 / Division</span>
          </div>

          <h1 className="display display-stack mt-10 text-[clamp(3.25rem,14vw,11rem)] text-ink">
            Meet
            <br />
            your new
            <br />
            team<span className="text-accent">.</span>
          </h1>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-xl">
              <p className="text-lg leading-relaxed text-ink-muted sm:text-xl">
                AI employees built to get work done. Each one takes a real job
                off your hands — finding customers, writing the outreach,
                watching the website — and shows you what it did.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink href="#employees" size="lg">
                  Meet the employees
                </ButtonLink>
                <ArrowLink href="#needs">See what they can do</ArrowLink>
              </div>
            </div>
            <TravellingLine className="w-full max-w-sm lg:w-72" />
          </div>

          <p className="mt-12 max-w-2xl border-l-2 border-accent pl-5 text-sm leading-relaxed text-ink-faint">
            {AI_STATUS_NOTE}
          </p>
        </Container>
      </section>

      {/* ── 02 · What do you need help with? ──────────────────── */}
      <Section id="needs" className="scroll-mt-20 border-b border-line">
        <Container>
          <Label index="01">What do you need help with?</Label>
          <Display className="mt-6">Start here</Display>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
            You do not need to know which employee you want. Pick the thing
            that is not happening, and we will point you at whoever does it.
          </p>
          <div className="mt-14">
            <OutcomePicker />
          </div>
        </Container>
      </Section>

      {/* ── 03 · The roster ───────────────────────────────────── */}
      <Section id="employees" className="scroll-mt-20 border-b border-line">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label index="02">The roster</Label>
              <Display className="mt-6">Employees</Display>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-faint">
              Six specialists. Each one is a job with a boundary — what it
              does, and what it will never do without asking you first.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {employeesByReadiness.map((e) => (
              <EmployeeCard key={e.slug} employee={e} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 04 · Teams ────────────────────────────────────────── */}
      <Section id="teams" className="scroll-mt-20 border-b border-line">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label index="03">Working together</Label>
              <Display className="mt-6">Teams</Display>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-faint">
              Some jobs need more than one specialist. A team is a set of
              employees pointed at a single outcome.
            </p>
          </div>

          <div className="mt-14 grid gap-px border border-line bg-line lg:grid-cols-2">
            {teams.map((team) => (
              <Link
                key={team.slug}
                href={`/ai/services/${team.slug}`}
                className="group flex flex-col bg-paper p-7 transition-colors duration-200 hover:bg-paper-raised sm:p-9"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="label text-ink-faint">{team.number}</span>
                  <span className="label text-ink-faint">
                    {STATUS_LABEL[teamStatus(team)]}
                  </span>
                </div>
                <h3 className="display mt-5 text-[clamp(2rem,6vw,3rem)] text-ink group-hover:text-accent">
                  {team.name}
                </h3>
                <p className="mt-3 text-[17px] leading-relaxed text-ink-muted">
                  {team.outcome}
                </p>
                <TeamFlow steps={team.flow} className="mt-8" />
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 05 · How it works ─────────────────────────────────── */}
      <Section className="border-b border-line">
        <Container>
          <Label index="04">How it works</Label>
          <Display className="mt-6">Five steps</Display>

          <ol className="mt-14 border-t border-line">
            {HOW_IT_WORKS.map((s) => (
              <li
                key={s.step}
                className="step-in grid gap-3 border-b border-line py-7 sm:grid-cols-[4rem_14rem_1fr] sm:items-baseline sm:gap-8"
              >
                <span className="label text-accent">{s.step}</span>
                <h3 className="display text-2xl text-ink sm:text-[1.75rem]">
                  {s.title}
                </h3>
                <p className="max-w-xl text-[15px] leading-relaxed text-ink-muted">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── 06 · Control ──────────────────────────────────────── */}
      <Section className="border-b border-line">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label index="05">Human control</Label>
              <Display className="mt-6">Yours</Display>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-faint">
              An employee that can act without you knowing is not an employee.
              These are not settings we hope you find — they are how it works.
            </p>
          </div>

          <div className="mt-14 grid border-t border-l border-line sm:grid-cols-2">
            {CONTROL.map((c, i) => (
              <div key={c.title} className="border-r border-b border-line p-8">
                <span className="label text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="display mt-4 text-2xl text-ink sm:text-3xl">
                  {c.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 07 · Close ────────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Display as="h2">Build your digital workforce</Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              Northbound.AI is being built now, with a small number of
              businesses shaping it. Tell us which job you would hand over
              first and you will be among them.
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href="/ai/access" size="lg">
                Request early access
              </ButtonLink>
              <ArrowLink href="/ai/employees">Explore the employees</ArrowLink>
            </div>
            <p className="mt-8 text-sm text-ink-faint">
              Or email{' '}
              <a
                href={`mailto:${site.email}`}
                className="text-accent underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
