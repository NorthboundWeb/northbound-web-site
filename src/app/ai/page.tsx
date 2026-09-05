import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { employeeIcons } from '@/components/graphics'
import { MountainPlate } from '@/components/mountain'
import {
  ArrowLink,
  ButtonLink,
  ComingSoon,
  Container,
  Display,
  Label,
  Rail,
  Section,
} from '@/components/ui'
import {
  AI_PUBLIC_STATUS,
  director,
  employees,
  statusLabel,
} from '@/lib/employees'

export const metadata: Metadata = pageMetadata({
  title: 'AI employees',
  description: 'Northbound Employees are coming soon — AI-powered digital workers designed around actual business jobs. A preview of what is being built, and how to register interest.',
  path: '/ai',
})

/**
 * How the employees are intended to work.
 *
 * Written as intent throughout. Nothing here describes behaviour that has been
 * built, and no integration, model or vendor is named — none of that has been
 * settled, so claiming it would be fiction.
 */
const howItWorks = [
  {
    step: '01',
    title: 'Pick the job',
    body: 'You start from a job that needs doing — finding prospects, chasing follow-ups, keeping admin straight — rather than from a piece of technology.',
  },
  {
    step: '02',
    title: 'Set the boundaries',
    body: 'An employee is intended to work inside limits you set, on the tasks you agree, with the things that matter kept under your sign-off.',
  },
  {
    step: '03',
    title: 'Review the work',
    body: 'The plan is that work comes back for review rather than going out unseen, so you keep control of anything that reaches a customer.',
  },
]

export default function AiPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] opacity-40 lg:block"
        >
          <MountainPlate className="h-full w-full" />
        </div>
        <Container className="relative">
          <div className="flex gap-8 lg:gap-14">
            <Rail index="02" />
            <div className="min-w-0 flex-1 pt-14 pb-20 sm:pt-20 lg:pb-28">
              <Label>Northbound.AI</Label>
              <Display as="h1" size="lg" className="mt-9 max-w-3xl text-cream">
                Your next employee
                <br />
                might not be human
              </Display>

              <ComingSoon className="mt-9">
                {AI_PUBLIC_STATUS.label}
              </ComingSoon>

              <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                {AI_PUBLIC_STATUS.headline} {AI_PUBLIC_STATUS.body}
              </p>

              <div className="mt-11 flex flex-wrap items-center gap-4">
                <ButtonLink href="#employees" variant="yellow">
                  Meet the employees
                </ButtonLink>
                <ButtonLink
                  href={AI_PUBLIC_STATUS.interestHref}
                  variant="outline"
                >
                  Register interest
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------- employees */}
      <Section id="employees" className="scroll-mt-24 bg-black">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label>The team</Label>
              <Display as="h2" size="md" className="mt-8 text-cream">
                Meet your
                <br />
                future team.
              </Display>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-chalk-muted">
              Seven workers, each with its own job. None is available to buy or
              hire yet, and every card says exactly where it stands.
            </p>
          </div>

          <ul className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {employees.map((emp) => {
              const Icon = employeeIcons[emp.icon]
              return (
                <li
                  key={emp.slug}
                  id={emp.slug}
                  className="group flex scroll-mt-24 flex-col bg-black p-7 transition-colors hover:bg-char sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="h-8 w-8 text-yellow" />
                    <span className="label text-chalk-faint">
                      {statusLabel[emp.status]}
                    </span>
                  </div>

                  <h3 className="display mt-7 text-3xl text-cream">{emp.name}</h3>
                  <p className="label mt-2 text-yellow">{emp.role}</p>

                  <p className="mt-6 text-sm leading-relaxed text-chalk-muted">
                    {emp.problem}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-cream">
                    {emp.benefit}
                  </p>

                  <p className="label mt-7 text-chalk-faint">For example</p>
                  <ul className="mt-4 flex-1 space-y-2.5">
                    {emp.tasks.map((task) => (
                      <li
                        key={task}
                        className="flex gap-3 text-sm leading-relaxed text-chalk-muted"
                      >
                        <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-yellow" />
                        {task}
                      </li>
                    ))}
                  </ul>

                  <ArrowLink
                    href={AI_PUBLIC_STATUS.interestHref}
                    tone="yellow"
                    className="mt-8"
                  >
                    <span>
                      Register interest
                      <span className="sr-only"> in {emp.name}</span>
                    </span>
                  </ArrowLink>
                </li>
              )
            })}
          </ul>

          {/* Director sits above the workers, so it is presented apart. */}
          <div className="mt-6 flex flex-col gap-6 border border-line p-7 sm:flex-row sm:items-start sm:p-8">
            {(() => {
              const Icon = employeeIcons[director.icon]
              return <Icon className="h-8 w-8 shrink-0 text-chalk-muted" />
            })()}
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="display text-2xl text-cream">{director.name}</h3>
                <span className="label text-chalk-faint">
                  {statusLabel[director.status]}
                </span>
              </div>
              <p className="label mt-2 text-chalk-muted">{director.role}</p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-chalk-muted">
                {director.summary}
              </p>
            </div>
          </div>

          <p className="mt-10 border-t border-line pt-8 text-xs leading-relaxed text-chalk-faint">
            Every employee above is in development. Nothing on this page
            describes a capability that is available today, and no pricing,
            integrations or performance figures are published because none have
            been finalised.
          </p>
        </Container>
      </Section>

      {/* ----------------------------------------------------- how it works */}
      <Section id="how-it-works" className="scroll-mt-24 bg-cream text-ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <Label tone="light">How it will work</Label>
              <Display as="h2" size="md" className="mt-8 text-ink">
                Built around
                <br />
                the job.
              </Display>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-muted">
                Not another generic chatbot bolted onto a website. The intention
                is a digital worker that takes on a defined job, inside limits
                you set, with a person keeping sign-off on anything that
                matters.
              </p>
            </div>
            <ul className="grid gap-px self-start bg-line-ink">
              {howItWorks.map((item) => (
                <li key={item.step} className="bg-cream p-7 sm:p-8">
                  <div className="flex items-baseline gap-5">
                    <span className="label text-ink-faint">{item.step}</span>
                    <div>
                      <h3 className="display text-xl text-ink">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- CTA */}
      <Section className="bg-black">
        <Container>
          <div className="border border-line p-9 sm:p-14">
            <ComingSoon>{AI_PUBLIC_STATUS.label}</ComingSoon>
            <Display as="h2" size="md" className="mt-8 max-w-2xl text-cream">
              Want to know when
              <br />
              they are ready?
            </Display>
            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-chalk-muted">
              There is no waitlist system yet, so registering interest sends a
              normal enquiry — it reaches a person, and you will hear back.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink
                href={AI_PUBLIC_STATUS.interestHref}
                variant="yellow"
              >
                Register interest
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Talk to Northbound
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
