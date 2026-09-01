import type { Metadata } from 'next'
import { EmployeeCard } from '@/components/ai/employee-card'
import { ArrowLink, ButtonLink, Container, Display, Label, Section } from '@/components/ui'
import { AI_STATUS_NOTE, employeesByReadiness } from '@/lib/ai/employees'

export const metadata: Metadata = {
  title: 'Northbound Employees',
  description:
    'The Northbound Employees: Scout, Closer, Signal, Rank, Keeper and Watch. Specialists that take a real job off your hands. In development.',
  alternates: { canonical: '/ai/employees' },
}

export default function EmployeesPage() {
  return (
    <>
      <Section className="border-b border-line pb-14">
        <Container>
          <div className="flex items-baseline justify-between gap-4">
            <Label index="01">The roster</Label>
            <span className="label text-ink-faint">
              {employeesByReadiness.length} employees
            </span>
          </div>
          <Display as="h1" className="mt-6">
            Employees
          </Display>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Each one is hired for a single job, and each one has a boundary —
            the thing it will not do without asking you first.
          </p>
          <p className="mt-8 max-w-2xl border-l-2 border-accent pl-5 text-sm leading-relaxed text-ink-faint">
            {AI_STATUS_NOTE}
          </p>
        </Container>
      </Section>

      <Section className="border-b border-line">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {employeesByReadiness.map((e) => (
              <EmployeeCard key={e.slug} employee={e} />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-3xl">
            <Display as="h2">Not sure which</Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              Most people know the problem rather than the product. Say what is
              not happening and we will point you at whoever does it — or tell
              you honestly that it is not built yet.
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href="/ai#needs" size="lg">
                Start from the problem
              </ButtonLink>
              <ArrowLink href="/ai/services">See the teams</ArrowLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
