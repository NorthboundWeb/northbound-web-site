import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EmployeeMark } from '@/components/ai/employee-mark'
import { TeamFlow } from '@/components/ai/team-flow'
import { ArrowLink, ButtonLink, Container, Display, Label, Section } from '@/components/ui'
import { STATUS_LABEL } from '@/lib/ai/employees'
import { teamBySlug, teamMembers, teamStatus, teams } from '@/lib/ai/teams'

export function generateStaticParams() {
  return teams.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const team = teamBySlug(slug)
  if (!team) return {}
  return {
    title: team.name,
    description: `${team.outcome} ${team.pitch}`,
    alternates: { canonical: `/ai/services/${team.slug}` },
  }
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const team = teamBySlug(slug)
  if (!team) notFound()

  const members = teamMembers(team)

  return (
    <>
      <Section className="border-b border-line pb-14">
        <Container>
          <div className="flex items-baseline justify-between gap-4">
            <Label>Team {team.number}</Label>
            <span className="label text-ink-faint">
              {STATUS_LABEL[teamStatus(team)]}
            </span>
          </div>
          <h1 className="display mt-8 text-[clamp(3rem,13vw,9rem)] text-ink">
            {team.name}
          </h1>
          <p className="mt-8 max-w-2xl text-[clamp(1.25rem,4vw,1.875rem)] leading-snug text-ink">
            {team.outcome}
          </p>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
            {team.pitch}
          </p>
          <div className="mt-10">
            <p className="label text-ink-faint">How the work moves</p>
            <TeamFlow steps={team.flow} className="mt-5" />
          </div>
        </Container>
      </Section>

      <Section className="border-b border-line">
        <Container>
          <Label index="01">The team</Label>
          <Display className="mt-6">Who does it</Display>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {members.map((m) => (
              <article
                key={m.slug}
                className="group relative flex flex-col border border-line bg-paper-raised p-7 transition-colors hover:border-line-strong sm:p-8"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="label text-ink-faint">NB.AI / {m.number}</span>
                  <span className="label text-ink-faint">{STATUS_LABEL[m.status]}</span>
                </div>
                <EmployeeMark employee={m} className="mt-6 w-full text-ink-faint" />
                <h3 className="display mt-6 text-[clamp(2rem,7vw,3rem)] text-ink">
                  {m.name}
                </h3>
                <p className="label mt-2" style={{ color: `var(${m.colourVar})` }}>
                  {m.role}
                </p>
                <p className="mt-5 flex-1 text-[15px] leading-relaxed text-ink-muted">
                  {m.pitch}
                </p>
                <Link
                  href={`/ai/employees/${m.slug}`}
                  className="label mt-7 inline-flex min-h-11 items-center gap-2.5 text-ink after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
                >
                  Meet {m.name}
                  <span aria-hidden className="text-accent">→</span>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-b border-line">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Label index="02">What you get back</Label>
              <Display className="mt-6">Output</Display>
              {team.handoff ? (
                <p className="mt-8 max-w-sm border-l-2 border-accent pl-5 text-sm leading-relaxed text-ink-faint">
                  {team.handoff}
                </p>
              ) : null}
            </div>
            <ul className="border-t border-line">
              {team.delivers.map((d) => (
                <li
                  key={d}
                  className="step-in flex items-baseline gap-6 border-b border-line py-6"
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-accent" fill="none" aria-hidden>
                    <path d="M1.5 6.2 4.6 9.2 10.5 2.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
                  </svg>
                  <p className="text-[clamp(1.0625rem,3vw,1.375rem)] leading-snug text-ink">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-3xl">
            <Display as="h2">Get the {team.name}</Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              This team is not finished yet. Register interest, tell us what
              you want it to take off your hands, and you will help decide what
              it does first.
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href={`/ai/access?team=${team.slug}`} size="lg">
                Register interest
              </ButtonLink>
              <ArrowLink href="/ai/services">All teams</ArrowLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
