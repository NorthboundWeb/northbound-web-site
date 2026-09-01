import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EmployeeMark } from '@/components/ai/employee-mark'
import { ArrowLink, ButtonLink, Container, Display, Label, Section } from '@/components/ui'
import {
  STATUS_LABEL,
  STATUS_NOTE,
  employeeBySlug,
  employees,
} from '@/lib/ai/employees'
import { teamMembers, teams } from '@/lib/ai/teams'

/**
 * One employee, one page. Everything here comes from the roster, so employee
 * 007 gets a page by existing — there is nothing to build per employee.
 */
export function generateStaticParams() {
  return employees.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const employee = employeeBySlug(slug)
  if (!employee) return {}
  return {
    title: `${employee.name} — ${employee.role}`,
    description: `${employee.purpose} ${employee.pitch}`,
    alternates: { canonical: `/ai/employees/${employee.slug}` },
  }
}

export default async function EmployeePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const employee = employeeBySlug(slug)
  if (!employee) notFound()

  const live = employee.status === 'live'
  const inTeams = teams.filter((t) => t.members.includes(employee.slug))

  return (
    <>
      <Section className="border-b border-line pb-14">
        <Container>
          <div className="flex items-baseline justify-between gap-4">
            <Label>NB.AI / Employee {employee.number}</Label>
            <span className={`label ${live ? 'text-accent' : 'text-ink-faint'}`}>
              {STATUS_LABEL[employee.status]}
            </span>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-20">
            <div>
              <h1 className="display text-[clamp(4rem,18vw,12rem)] text-ink">
                {employee.name}
              </h1>
              <p
                className="label mt-4"
                style={{ color: `var(${employee.colourVar})` }}
              >
                {employee.role}
              </p>
              <p className="mt-8 max-w-lg text-[clamp(1.25rem,4vw,1.75rem)] leading-snug text-ink">
                {employee.purpose}
              </p>
              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-muted">
                {employee.pitch}
              </p>
            </div>

            <div
              className="border border-line bg-paper-raised p-6 sm:p-8"
              style={{ ['--emp' as string]: `var(${employee.colourVar})` }}
            >
              <EmployeeMark employee={employee} className="w-full text-ink-faint" />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-b border-line">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Label index="01">What it does</Label>
              <Display className="mt-6">Three jobs</Display>
            </div>
            <ol className="border-t border-line">
              {employee.does.map((d, i) => (
                <li
                  key={d}
                  className="step-in flex items-baseline gap-6 border-b border-line py-7"
                >
                  <span className="label shrink-0 text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[clamp(1.125rem,3.5vw,1.5rem)] leading-snug text-ink">
                    {d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      <Section className="border-b border-line">
        <Container>
          <div className="grid gap-10 border border-line bg-paper-raised p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Label index="02">The boundary</Label>
              <p className="mt-6 text-[clamp(1.25rem,4vw,1.75rem)] leading-snug text-ink">
                {employee.boundary}
              </p>
            </div>
            <div>
              <Label index="03">Where it is up to</Label>
              <p className="mt-6 text-[17px] leading-relaxed text-ink-muted">
                {STATUS_NOTE[employee.status]}
              </p>
              {inTeams.length ? (
                <div className="mt-8">
                  <p className="label text-ink-faint">Works alongside</p>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {inTeams.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/ai/services/${t.slug}`}
                          className="label text-ink underline-offset-4 hover:text-accent hover:underline"
                        >
                          {t.name}
                          <span className="ml-2 text-ink-faint">
                            {teamMembers(t)
                              .filter((m) => m.slug !== employee.slug)
                              .map((m) => m.name)
                              .join(' · ')}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-3xl">
            <Display as="h2">Hire {employee.name}</Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              {live
                ? `${employee.name} is working today. Tell us about the business and we will set it up.`
                : `${employee.name} is not finished yet, and we will not pretend otherwise. Register interest and you will hear the moment it is ready — and help shape it in the meantime.`}
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href={`/ai/access?employee=${employee.slug}`} size="lg">
                {live ? `Get ${employee.name}` : `Register interest`}
              </ButtonLink>
              <ArrowLink href="/ai/employees">Back to the roster</ArrowLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
