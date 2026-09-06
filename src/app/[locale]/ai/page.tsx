import type { Metadata } from 'next'
import { localePath } from '@/i18n/config'
import { resolvePage, type LocaleParams } from '@/lib/page-locale'
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
import { director, employees } from '@/lib/employees'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, t } = await resolvePage(params)
  return pageMetadata({
    locale,
    title: t.ai.metaTitle,
    description: t.ai.metaDescription,
    path: '/ai',
  })
}

export default async function AiPage({ params }: LocaleParams) {
  const { locale, t } = await resolvePage(params)
  const a = t.ai
  const interestHref = `${localePath(locale, '/contact')}?interest=employees`

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
              <Label>{a.eyebrow}</Label>
              <Display as="h1" size="lg" className="mt-9 max-w-3xl text-cream">
                {a.h1Line1}
                <br />
                {a.h1Line2}
              </Display>

              <ComingSoon className="mt-9">
                {t.common.comingSoon}
              </ComingSoon>

              <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                {a.statusHeadline} {a.statusBody}
              </p>

              <div className="mt-11 flex flex-wrap items-center gap-4">
                <ButtonLink href={localePath(locale, '/ai') + '#employees'} variant="yellow">
                  {t.common.cta.meetEmployees}
                </ButtonLink>
                <ButtonLink
                  href={interestHref}
                  variant="outline"
                >
                  {t.common.cta.registerInterest}
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
              <Label>{a.teamEyebrow}</Label>
              <Display as="h2" size="md" className="mt-8 text-cream">
                {a.teamLine1}
                <br />
                {a.teamLine2}
              </Display>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-chalk-muted">
              {a.teamAside}
            </p>
          </div>

          {/*
            Ruled with borders rather than by letting a background show through
            1px gaps. Seven cards never fill a two- or three-column grid, and a
            background-painted grid renders each empty cell as a solid block of
            rule colour that reads as a broken tile.
          */}
          <ul className="mt-14 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
            {employees.map((emp) => {
              const Icon = employeeIcons[emp.icon]
              return (
                <li
                  key={emp.slug}
                  id={emp.slug}
                  className="group flex scroll-mt-24 flex-col border-r border-b border-line bg-black p-7 transition-colors hover:bg-char sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="h-8 w-8 text-yellow" />
                    <span className="label text-chalk-faint">
                      {emp.status === 'coming-soon' ? t.common.comingSoon : t.common.inDevelopment}
                    </span>
                  </div>

                  <h3 className="display mt-7 text-3xl text-cream">{emp.name}</h3>
                  <p className="label mt-2 text-yellow">{a.employees[emp.slug].role}</p>

                  <p className="mt-6 text-sm leading-relaxed text-chalk-muted">
                    {a.employees[emp.slug].problem}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-cream">
                    {a.employees[emp.slug].benefit}
                  </p>

                  <p className="label mt-7 text-chalk-faint">{a.forExample}</p>
                  <ul className="mt-4 flex-1 space-y-2.5">
                    {a.employees[emp.slug].tasks.map((task) => (
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
                    href={interestHref}
                    tone="yellow"
                    className="mt-8"
                  >
                    <span>
                      {t.common.cta.registerInterest}
                      <span className="sr-only">
                        {' '}
                        {a.registerInterestIn.replace('{name}', emp.name)}
                      </span>
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
                  {t.common.inDevelopment}
                </span>
              </div>
              <p className="label mt-2 text-chalk-muted">{a.director.role}</p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-chalk-muted">
                {a.director.summary}
              </p>
            </div>
          </div>

          <p className="mt-10 border-t border-line pt-8 text-xs leading-relaxed text-chalk-faint">
            {a.disclaimer}
          </p>
        </Container>
      </Section>

      {/* ----------------------------------------------------- how it works */}
      <Section id="how-it-works" className="scroll-mt-24 bg-cream text-ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <Label tone="light">{a.howItWorks.eyebrow}</Label>
              <Display as="h2" size="md" className="mt-8 text-ink">
                {a.howItWorks.h2Line1}
                <br />
                {a.howItWorks.h2Line2}
              </Display>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-muted">
                {a.howItWorks.body}
              </p>
            </div>
            <ul className="grid gap-px self-start bg-line-ink">
              {a.howItWorks.steps.map((item, i) => (
                <li key={item.title} className="bg-cream p-7 sm:p-8">
                  <div className="flex items-baseline gap-5">
                    <span className="label text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
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
            <ComingSoon>{t.common.comingSoon}</ComingSoon>
            <Display as="h2" size="md" className="mt-8 max-w-2xl text-cream">
              {a.ctaLine1}
              <br />
              {a.ctaLine2}
            </Display>
            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-chalk-muted">
              {a.ctaBody}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink
                href={interestHref}
                variant="yellow"
              >
                Register interest
              </ButtonLink>
              <ButtonLink href={localePath(locale, '/contact')} variant="outline">
                {t.common.cta.talkToNorthbound}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
