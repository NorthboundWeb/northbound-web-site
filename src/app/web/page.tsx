import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { MountainPlate } from '@/components/mountain'
import {
  ArrowLink,
  ButtonLink,
  Container,
  Display,
  Label,
  Rail,
  Section,
  cn,
} from '@/components/ui'
import { CurrencySelect } from '@/components/currency-select'
import { formatMoney, isApproximate } from '@/lib/money/currency'
import { getRates } from '@/lib/money/rates'
import { getCurrency } from '@/lib/prefs/server'
import {
  COMPLIMENTARY_MONTH_TERMS,
  TIMELINE_TERMS,
  buildPackages,
  commercialTerms,
  improvements,
  managementPlans,
  managementTerms,
  standards,
} from '@/lib/services'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'Web services',
  description: 'Fixed-price website builds from £249, and optional monthly management. Fast, accessible, secure sites for UK small businesses — the price you see is the price you pay.',
  path: '/web',
})

export default async function WebPage() {
  const currency = await getCurrency()
  const rates = await getRates()
  const approximate = isApproximate(currency)

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
              <Label>Northbound.Web</Label>
              <Display as="h1" size="lg" className="mt-9 max-w-3xl text-cream">
                Websites that grow
                <br />
                your business
              </Display>
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                One-off website builds, ongoing management and continuous
                improvements. The price is published, the scope is written down,
                and the site is yours to keep.
              </p>
              <div className="mt-11 flex flex-wrap items-center gap-4">
                <ButtonLink href="#pricing" variant="light">
                  Website packages
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline">
                  Start a project
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
              <Label tone="light">Website packages</Label>
              <Display as="h2" size="md" className="mt-8 text-ink">
                One-off builds.
                <br />
                Fixed prices.
              </Display>
            </div>
            <div className="max-w-sm">
              <p className="text-sm leading-relaxed text-ink-muted">
                These are the advertised prices, not estimates. Only a Custom
                build varies, and its scope and figure are agreed in writing
                first.
              </p>
              <div className="mt-5 [&_label]:text-ink-faint [&_select]:border-line-ink [&_select]:text-ink [&_select]:hover:border-line-ink-strong">
                <CurrencySelect value={currency} />
              </div>
              {approximate ? (
                <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                  Amounts in {currency} are an approximate conversion, shown as
                  a guide. Quotes, contracts and payments are agreed and settled
                  in pounds sterling.
                </p>
              ) : null}
            </div>
          </div>

          <ul className="mt-14 grid gap-px bg-line-ink sm:grid-cols-2 xl:grid-cols-4">
            {buildPackages.map((pkg) => (
              <li
                key={pkg.slug}
                id={pkg.slug}
                className="group relative flex scroll-mt-24 flex-col bg-cream p-7 sm:p-8"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="display text-2xl text-ink">{pkg.name}</h3>
                  {pkg.badge ? (
                    <span className="label text-orange-ink">{pkg.badge}</span>
                  ) : null}
                </div>

                <p className="display mt-6 text-5xl text-ink">
                  {pkg.variable ? (
                    <span className="align-middle text-xl text-ink-muted">
                      From{' '}
                    </span>
                  ) : null}
                  {formatMoney(pkg.pricePence, currency, rates)}
                </p>
                <p className="label mt-2 text-ink-faint">
                  One-off build{approximate ? ' · approx.' : ''}
                </p>

                <p className="mt-6 text-sm leading-relaxed text-ink-muted">
                  {pkg.summary}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5 border-t border-line-ink pt-6">
                  {pkg.includes.map((inc) => (
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
                  {pkg.timeline}
                </p>

                <ButtonLink
                  href={`/contact?package=${pkg.enquiryParam}`}
                  variant="solid"
                  className="relative z-10 mt-6 w-full"
                >
                  {pkg.cta}
                </ButtonLink>
              </li>
            ))}
          </ul>

          <div className="mt-10 space-y-3 border-t border-line-ink pt-8">
            <p className="text-xs leading-relaxed text-ink-faint">
              {TIMELINE_TERMS}
            </p>
            <p className="text-xs leading-relaxed text-ink-faint">
              {COMPLIMENTARY_MONTH_TERMS}
            </p>
            {buildPackages
              .filter((p) => p.note)
              .map((p) => (
                <p key={p.slug} className="text-xs leading-relaxed text-ink-faint">
                  <span className="font-semibold text-ink-muted">{p.name}:</span>{' '}
                  {p.note}
                </p>
              ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ management */}
      <Section id="management" className="scroll-mt-24 bg-black">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label>Management</Label>
              <Display as="h2" size="md" className="mt-8 text-cream">
                Looked after
                <br />
                once it is live.
              </Display>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-chalk-muted">
              Optional, rolling, and never a condition of having a site built.
            </p>
          </div>

          <ul className="mt-14 grid gap-6 lg:grid-cols-2">
            {managementPlans.map((plan) => (
              <li
                key={plan.slug}
                id={plan.slug}
                className="flex scroll-mt-24 flex-col border border-line p-8 sm:p-10"
              >
                <h3 className="display text-2xl text-cream">{plan.name}</h3>
                <p className="display mt-5 text-5xl text-cream">
                  {formatMoney(plan.pricePence, currency, rates)}
                  <span className="align-middle text-lg text-chalk-faint">
                    /month{approximate ? ' · approx.' : ''}
                  </span>
                </p>
                <p className="mt-6 text-sm leading-relaxed text-chalk-muted">
                  {plan.summary}
                </p>
                <ul className="mt-7 flex-1 space-y-2.5 border-t border-line pt-6">
                  {plan.includes.map((inc) => (
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
                  {plan.changeTime}
                </p>
                <ButtonLink
                  href={`/contact?package=${plan.enquiryParam}`}
                  variant="outline"
                  className="mt-7 w-full"
                >
                  {plan.cta}
                </ButtonLink>
              </li>
            ))}
          </ul>

          <ul className="mt-10 space-y-2.5 border-t border-line pt-8">
            {managementTerms.map((term) => (
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
              <Label tone="light">Improvements</Label>
              <Display as="h2" size="md" className="mt-8 text-ink">
                Better every
                <br />
                month.
              </Display>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-muted">
                A site is not finished at launch. Improvement work is part of a
                management plan rather than a separate product — small, measured
                changes inside your plan&rsquo;s included change time.
              </p>
              <ArrowLink href="#management" tone="ink" className="mt-9">
                See management plans
              </ArrowLink>
            </div>
            <ul className="grid gap-px self-start bg-line-ink">
              {improvements.map((item, i) => (
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
          <Label>Standards</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-cream">
            How every site is built.
          </Display>
          <ul className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((s) => (
              <li key={s.title} className="bg-black p-7 sm:p-8">
                <h3 className="label text-cream">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-chalk-muted">
                  {s.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ terms */}
      <Section id="terms" className="scroll-mt-24 bg-cream text-ink">
        <Container>
          <Label tone="light">Terms</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-ink">
            The practical detail.
          </Display>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {commercialTerms.map((block) => (
              <div key={block.title}>
                <h3 className="label text-ink">{block.title}</h3>
                <ul className="mt-5 space-y-3">
                  {block.points.map((point) => (
                    <li
                      key={point}
                      className="text-sm leading-relaxed text-ink-muted"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-5 border-t border-line-ink pt-10">
            <ButtonLink href="/contact" variant="solid" size="lg">
              Start a project
            </ButtonLink>
            <ArrowLink href="/web/work" tone="ink">
              View our work
            </ArrowLink>
            <a
              href={`mailto:${site.email}`}
              className={cn(
                'label text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline'
              )}
            >
              {site.email}
            </a>
          </div>
        </Container>
      </Section>
    </>
  )
}
