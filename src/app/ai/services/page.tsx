import type { Metadata } from 'next'
import Link from 'next/link'
import { TeamFlow } from '@/components/ai/team-flow'
import { ArrowLink, ButtonLink, Container, Display, Label, Section } from '@/components/ui'
import { AI_STATUS_NOTE, STATUS_LABEL } from '@/lib/ai/employees'
import { teamMembers, teamStatus, teams } from '@/lib/ai/teams'

export const metadata: Metadata = {
  title: 'Northbound Teams',
  description:
    'Northbound Teams combine employees around one outcome — the Sales Engine, the Content Engine, the Customer Engine and Website Growth. In development.',
  alternates: { canonical: '/ai/services' },
}

export default function TeamsPage() {
  return (
    <>
      <Section className="border-b border-line pb-14">
        <Container>
          <div className="flex items-baseline justify-between gap-4">
            <Label index="01">Working together</Label>
            <span className="label text-ink-faint">{teams.length} teams</span>
          </div>
          <Display as="h1" className="mt-6">
            Teams
          </Display>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
            A team is a handful of employees pointed at one outcome, in the
            order the work actually happens. Hire the outcome rather than
            working out which specialist you need.
          </p>
          <p className="mt-8 max-w-2xl border-l-2 border-accent pl-5 text-sm leading-relaxed text-ink-faint">
            {AI_STATUS_NOTE}
          </p>
        </Container>
      </Section>

      {teams.map((team) => {
        const members = teamMembers(team)
        return (
          <Section
            key={team.slug}
            id={team.slug}
            className="scroll-mt-20 border-b border-line"
          >
            <Container>
              <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <Label index={team.number} />
                    <span className="label text-ink-faint">
                      {STATUS_LABEL[teamStatus(team)]}
                    </span>
                  </div>
                  <h2 className="display mt-6 text-[clamp(2.5rem,9vw,4.5rem)] text-ink">
                    {team.name}
                  </h2>
                  <p className="mt-5 text-[clamp(1.125rem,4vw,1.5rem)] leading-snug text-ink">
                    {team.outcome}
                  </p>
                  <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-muted">
                    {team.pitch}
                  </p>

                  <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                    {members.map((m) => (
                      <li key={m.slug}>
                        <Link
                          href={`/ai/employees/${m.slug}`}
                          className="group inline-flex items-center gap-2.5"
                        >
                          <span
                            aria-hidden
                            className="h-2.5 w-2.5"
                            style={{ backgroundColor: `var(${m.colourVar})` }}
                          />
                          <span className="label text-ink group-hover:text-accent">
                            {m.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <ArrowLink href={`/ai/services/${team.slug}`} className="mt-9">
                    Inside {team.name}
                  </ArrowLink>
                </div>

                <div>
                  <p className="label text-ink-faint">How the work moves</p>
                  <TeamFlow steps={team.flow} className="mt-6" />

                  <p className="label mt-12 text-ink-faint">What you get back</p>
                  <ul className="mt-6 border-t border-line">
                    {team.delivers.map((d) => (
                      <li key={d} className="flex gap-4 border-b border-line py-4">
                        <svg
                          viewBox="0 0 12 12"
                          className="mt-1.5 h-3 w-3 shrink-0 text-accent"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M1.5 6.2 4.6 9.2 10.5 2.8"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="square"
                          />
                        </svg>
                        <span className="text-[15px] leading-relaxed text-ink-muted">
                          {d}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {team.handoff ? (
                    <p className="mt-6 border-l-2 border-accent pl-5 text-sm leading-relaxed text-ink-faint">
                      {team.handoff}
                    </p>
                  ) : null}
                </div>
              </div>
            </Container>
          </Section>
        )
      })}

      <Section>
        <Container>
          <div className="max-w-3xl">
            <Display as="h2">Build your digital workforce</Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              Tell us the outcome you are after. If a team covers it we will
              say so, and if it does not exist yet we will tell you that
              instead.
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href="/ai/access" size="lg">
                Request early access
              </ButtonLink>
              <ArrowLink href="/ai/employees">Meet the employees</ArrowLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
