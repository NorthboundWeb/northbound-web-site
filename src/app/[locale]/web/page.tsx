import type { Metadata } from 'next'
import { CurrencySelect } from '@/components/currency-select'
import { MountainPlate } from '@/components/mountain'
import {
  ArrowLink,
  ButtonLink,
  Container,
  Display,
  Label,
  Rail,
  Section,
} from '@/components/ui'
import { localePath } from '@/i18n/config'
import { formatMoney, isApproximate } from '@/lib/money/currency'
import { getRates } from '@/lib/money/rates'
import { resolvePage, type LocaleParams } from '@/lib/page-locale'
import { getCurrency } from '@/lib/prefs/server'
import { pageMetadata } from '@/lib/seo'
import { buildPackages, managementPlans } from '@/lib/services'
import { site } from '@/lib/site'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, t } = await resolvePage(params)
  return pageMetadata({
    locale,
    title: t.web.metaTitle,
    description: t.web.metaDescription,
    path: '/web',
  })
}

export default async function WebPage({ params }: LocaleParams) {
  const { locale, t } = await resolvePage(params)
  const currency = await getCurrency()
  const rates = await getRates()
  const approximate = isApproximate(currency)
  const w = t.web

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] opacity-50 lg:block"
        >
          <MountainPlate className="h-full w-full" />
        </div>
        <Container className="relative">
          <div className="flex gap-8 lg:gap-14">
            <Rail index="01" />
            <div className="min-w-0 flex-1 pt-14 pb-20 sm:pt-20 lg:pb-28">
              <Label>{w.eyebrow}</Label>
              <Display as="h1" size="lg" className="mt-9 max-w-3xl text-cream">
                {w.h1Line1}
                <br />
                {w.h1Line2}
              </Display>
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                {w.lede}
              </p>
              <div className="mt-11 flex flex-wrap items-center gap-4">
                <ButtonLink href={localePath(locale, '/web') + '#pricing'} variant="light">
                  {t.common.cta.seePackages}
                </ButtonLink>
                <ButtonLink href={localePath(locale, '/contact')} variant="outline">
                  {t.common.cta.startProject}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------- pricing */}
      <Section id="pricing" className="scroll-mt-24 bg-cream text-ink">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label tone="light">{w.pricing.eyebrow}</Label>
              <Display as="h2" size="md" className="mt-8 text-ink">
                {w.pricing.h2Line1}
                <br />
                {w.pricing.h2Line2}
              </Display>
            </div>
            <div className="max-w-sm">
              <p className="text-sm leading-relaxed text-ink-muted">
                {w.pricing.aside}
              </p>
              <div className="mt-5 [&_label]:text-ink-faint [&_select]:border-line-ink [&_select]:text-ink [&_select]:hover:border-line-ink-strong">
                <CurrencySelect value={currency} />
              </div>
              {approximate ? (
                <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                  {w.pricing.approxNote.replace('{currency}', currency)}
                </p>
              ) : null}
            </div>
          </div>

          <ul className="mt-14 grid gap-px bg-line-ink sm:grid-cols-2 xl:grid-cols-4">
            {buildPackages.map((pkg) => {
              const copy = w.packages[pkg.slug]
              return (
                <li
                  key={pkg.slug}
                  id={pkg.slug}
                  className="group relative flex scroll-mt-24 flex-col bg-cream p-7 sm:p-8"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="display text-2xl text-ink">{pkg.name}</h3>
                    {pkg.popular ? (
                      <span className="label text-orange-ink">{w.pricing.popular}</span>
                    ) : null}
                  </div>

                  <p className="display mt-6 text-5xl text-ink">
                    {pkg.variable ? (
                      <span className="align-middle text-xl text-ink-muted">
                        {t.common.from}{' '}
                      </span>
                    ) : null}
                    {formatMoney(pkg.pricePence, currency, rates)}
                  </p>
                  <p className="label mt-2 text-ink-faint">
                    {w.pricing.oneOff}
                    {approximate ? ` · ${t.common.approx}` : ''}
                  </p>

                  <p className="mt-6 text-sm leading-relaxed text-ink-muted">
                    {copy.summary}
                  </p>

                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-line-ink pt-6">
                    {copy.includes.map((inc) => (
                      <li
                        key={inc}
                        className="flex gap-3 text-sm leading-relaxed text-ink-muted"
                      >
                        <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-orange" />
                        {inc}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 text-xs leading-relaxed text-ink-faint">
                    {copy.timeline}
                  </p>

                  <ButtonLink
                    href={`${localePath(locale, '/contact')}?package=${pkg.enquiryParam}`}
                    variant="solid"
                    className="relative z-10 mt-6 w-full"
                  >
                    {copy.cta}
                  </ButtonLink>
                </li>
              )
            })}
          </ul>

          <div className="mt-10 space-y-3 border-t border-line-ink pt-8">
            <p className="text-xs leading-relaxed text-ink-faint">{w.timelineTerms}</p>
            <p className="text-xs leading-relaxed text-ink-faint">
              {w.complimentaryTerms}
            </p>
            {buildPackages.map((pkg) => {
              const note = w.packages[pkg.slug].note
              return note ? (
                <p key={pkg.slug} className="text-xs leading-relaxed text-ink-faint">
                  <span className="font-semibold text-ink-muted">{pkg.name}:</span>{' '}
                  {note}
                </p>
              ) : null
            })}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ management */}
      <Section id="management" className="scroll-mt-24 bg-black">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label>{w.management.eyebrow}</Label>
              <Display as="h2" size="md" className="mt-8 text-cream">
                {w.management.h2Line1}
                <br />
                {w.management.h2Line2}
              </Display>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-chalk-muted">
              {w.management.aside}
            </p>
          </div>

          <ul className="mt-14 grid gap-6 lg:grid-cols-2">
            {managementPlans.map((plan) => {
              const copy = w.management.plans[plan.slug]
              return (
                <li
                  key={plan.slug}
                  id={plan.slug}
                  className="flex scroll-mt-24 flex-col border border-line p-8 sm:p-10"
                >
                  <h3 className="display text-2xl text-cream">{plan.name}</h3>
                  <p className="display mt-5 text-5xl text-cream">
                    {formatMoney(plan.pricePence, currency, rates)}
                    <span className="align-middle text-lg text-chalk-faint">
                      {t.common.perMonth}
                      {approximate ? ` · ${t.common.approx}` : ''}
                    </span>
                  </p>
                  <p className="mt-6 text-sm leading-relaxed text-chalk-muted">
                    {copy.summary}
                  </p>
                  <ul className="mt-7 flex-1 space-y-2.5 border-t border-line pt-6">
                    {copy.includes.map((inc) => (
                      <li
                        key={inc}
                        className="flex gap-3 text-sm leading-relaxed text-chalk-muted"
                      >
                        <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-orange" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-xs leading-relaxed text-chalk-faint">
                    {copy.changeTime}
                  </p>
                  <ButtonLink
                    href={`${localePath(locale, '/contact')}?package=${plan.enquiryParam}`}
                    variant="outline"
                    className="mt-7 w-full"
                  >
                    {copy.cta}
                  </ButtonLink>
                </li>
              )
            })}
          </ul>

          <ul className="mt-10 space-y-2.5 border-t border-line pt-8">
            {w.management.terms.map((term) => (
              <li key={term} className="text-xs leading-relaxed text-chalk-faint">
                {term}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ---------------------------------------------------- improvements */}
      <Section id="improvements" className="scroll-mt-24 bg-cream text-ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <Label tone="light">{w.improvements.eyebrow}</Label>
              <Display as="h2" size="md" className="mt-8 text-ink">
                {w.improvements.h2Line1}
                <br />
                {w.improvements.h2Line2}
              </Display>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-muted">
                {w.improvements.body}
              </p>
              <ArrowLink
                href={localePath(locale, '/web') + '#management'}
                tone="ink"
                className="mt-9"
              >
                {w.improvements.link}
              </ArrowLink>
            </div>
            <ul className="grid gap-px self-start bg-line-ink">
              {w.improvements.items.map((item, i) => (
                <li key={item.title} className="bg-cream p-7 sm:p-8">
                  <div className="flex items-baseline gap-5">
                    <span className="label text-orange-ink">
                      {String(i + 1).padStart(2, '0')}
                    </span>
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

      {/* -------------------------------------------------------- standards */}
      <Section className="bg-black">
        <Container>
          <Label>{w.standardsEyebrow}</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-cream">
            {w.standardsHeading}
          </Display>
          <ul className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {w.standards.map((s) => (
              <li key={s.title} className="bg-black p-7 sm:p-8">
                <h3 className="label text-cream">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-chalk-muted">{s.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ terms */}
      <Section id="terms" className="scroll-mt-24 bg-cream text-ink">
        <Container>
          <Label tone="light">{w.termsEyebrow}</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-ink">
            {w.termsHeading}
          </Display>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {w.terms.map((block) => (
              <div key={block.title}>
                <h3 className="label text-ink">{block.title}</h3>
                <ul className="mt-5 space-y-3">
                  {block.points.map((point) => (
                    <li key={point} className="text-sm leading-relaxed text-ink-muted">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-5 border-t border-line-ink pt-10">
            <ButtonLink href={localePath(locale, '/contact')} variant="solid" size="lg">
              {t.common.cta.startProject}
            </ButtonLink>
            <ArrowLink href={localePath(locale, '/web/work')} tone="ink">
              {t.common.cta.viewWork}
            </ArrowLink>
            <a
              href={`mailto:${site.email}`}
              className="label text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {site.email}
            </a>
          </div>
        </Container>
      </Section>
    </>
  )
}
