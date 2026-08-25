import type { Metadata } from 'next'
import { CropMarks } from '@/components/graphics'
import {
  ArrowLink,
  ButtonLink,
  CardCta,
  Container,
  Display,
  Label,
  Section,
  StatementBand,
} from '@/components/ui'
import {
  ADVANCED_MANAGEMENT_PRICE,
  COMPLIMENTARY_MONTH_TERMS,
  ENTRY_PRICE,
  PRICING_PROMISE,
  TIMELINE_TERMS,
  buildScopes,
  commercialTerms,
  existingSiteHelp,
  managementPlans,
  managementTerms,
} from '@/lib/services'
import { currency, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Services and pricing',
  description: `What Northbound Web builds and what it costs. Website builds from ${currency.format(ENTRY_PRICE)}, optional management from ${currency.format(managementPlans[0].price)} a month, and help with a website you already have.`,
  alternates: { canonical: '/web/services' },
}

export default function ServicesPage() {
  return (
    <>
      <Section className="border-b border-line pb-16">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="01">Services and pricing</Label>
            <span className="label text-ink-faint">Northbound Web</span>
          </div>
          <Display as="h1" className="mt-6">
            Priced
          </Display>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Builds start at {currency.format(ENTRY_PRICE)}. Above that, price
            follows the amount of work — pages, features, how much needs
            building rather than arranging. {PRICING_PROMISE}
          </p>
        </Container>
      </Section>

      {/* ── Interactive scope comparator ───────────────────────── */}
      <Section id="builds" className="scroll-mt-20 border-b border-line">
        <Container>
          <Label index="02">Website builds</Label>
          <Display className="mt-6">Choose</Display>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
            Pick the size that matches what you need. Not sure? Start a project
            and I will tell you which one fits.
          </p>

          <div className="scopes mt-14">
            {/* Tabs */}
            <div className="grid gap-px border border-line bg-line sm:grid-cols-4">
              {buildScopes.map((s, i) => (
                <div key={s.slug} className="bg-paper">
                  <input
                    type="radio"
                    name="scope-view"
                    id={`scope-${s.slug}`}
                    defaultChecked={i === 0}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`scope-${s.slug}`}
                    className="flex h-full cursor-pointer flex-col gap-2 p-6 transition-colors hover:bg-paper-sunk"
                  >
                    <span className="label">{s.name}</span>
                    <span className="tab-price display text-2xl text-ink">
                      {s.pricing === 'from' && s.price
                        ? `From ${currency.format(s.price)}`
                        : 'Quoted'}
                    </span>
                    <span className="text-xs text-ink-faint">{s.pages}</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Panels */}
            {buildScopes.map((s) => (
              <div
                key={s.slug}
                data-scope={s.slug}
                id={s.slug}
                className="rise-in scroll-mt-20 border-r border-b border-l border-line p-8 sm:p-12"
              >
                <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
                  <div>
                    <div className="flex items-center gap-4">
                      <h2 className="display text-[clamp(2.5rem,7vw,5rem)] text-ink">{s.name}</h2>
                      {s.badge ? <span className="label text-accent-deep">{s.badge}</span> : null}
                    </div>

                    <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-muted">
                      {s.summary}
                    </p>

                    <div className="mt-10 border-t border-line pt-8">
                      <p className="display text-[clamp(2.75rem,7vw,4.5rem)] text-accent">
                        {s.pricing === 'from' && s.price
                          ? `From ${currency.format(s.price)}`
                          : 'Quoted'}
                      </p>
                      <p className="mt-4 max-w-sm text-sm text-ink-faint">
                        {s.pricing === 'from'
                          ? 'One-off. 50% deposit to begin, 50% once complete and approved, before it goes live.'
                          : 'Priced on the work involved, and agreed in writing before anything starts.'}
                      </p>

                      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                        {[
                          ['Pages', s.pages],
                          ['Revisions', s.revisions],
                          ['Timescale', s.timeline],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <dt className="label text-ink-faint">{k}</dt>
                            <dd className="mt-2 text-[15px] text-ink">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <p className="mt-5 max-w-md text-xs leading-relaxed text-ink-faint">
                        {TIMELINE_TERMS}
                      </p>
                    </div>

                    <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-muted">
                      <span className="label text-ink">Best for </span>
                      {s.bestFor}
                    </p>

                    {s.note ? (
                      <p className="mt-6 max-w-md border-l-2 border-accent pl-5 text-sm leading-relaxed text-ink-faint">
                        {s.note}
                      </p>
                    ) : null}

                    {/* Named per scope: four links reading "Start a project" would
                        be four identical entries in a screen reader's link list. */}
                    <ButtonLink href={`/contact?package=${s.slug}`} size="lg" className="mt-10">
                      {s.pricing === 'from'
                        ? `Start a ${s.name} project`
                        : `Get a quote for ${s.name}`}
                    </ButtonLink>
                  </div>

                  <div>
                    <h3 className="label text-ink-faint">What is included</h3>
                    <ul className="mt-7 border-t border-line">
                      {s.includes.map((item, i) => (
                        <li key={item} className="flex gap-5 border-b border-line py-4">
                          <span className="label shrink-0 pt-0.5 text-accent-deep">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[15px] leading-relaxed text-ink-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                    {s.freeAdvancedMonth ? (
                      <p className="mt-8 border border-line bg-paper-raised p-6 text-sm leading-relaxed text-ink-muted">
                        {COMPLIMENTARY_MONTH_TERMS}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Already have a website ─────────────────────────────── */}
      <StatementBand
        id="existing"
        index="03"
        eyebrow="Already have a website?"
        word={existingSiteHelp.word}
        className="scroll-mt-20"
        lede={existingSiteHelp.summary}
      />

      <Section className="border-b border-line">
        <Container>
          <div className="grid border-t border-l border-line sm:grid-cols-2">
            {existingSiteHelp.options.map((o, i) => (
              <div key={o.title} className="border-r border-b border-line p-8">
                <span className="label text-accent-deep">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display mt-4 text-2xl text-ink sm:text-3xl">{o.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{o.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <ButtonLink href="/contact?type=help" size="lg">
              Start a project
            </ButtonLink>
            <p className="max-w-md text-sm leading-relaxed text-ink-faint">{existingSiteHelp.note}</p>
          </div>
        </Container>
      </Section>

      {/* ── Management ────────────────────────────────────────── */}
      <StatementBand
        id="management"
        index="04"
        eyebrow="Management plans"
        aside="Optional"
        word="Kept"
        className="scroll-mt-20"
        lede={
          <>
            The Extended and Custom builds include one complimentary month of
            Advanced Management, worth {currency.format(ADVANCED_MANAGEMENT_PRICE)}.{' '}
            {COMPLIMENTARY_MONTH_TERMS}
          </>
        }
      />

      <Section className="border-b border-line">
        <Container>
          <div className="grid border-t border-l border-line lg:grid-cols-3">
            {managementPlans.map((plan) => (
              <div
                key={plan.slug}
                className="group relative flex flex-col border-r border-b border-line p-8 transition-colors hover:bg-paper-raised focus-within:bg-paper-raised"
              >
                <h3 className="label text-ink-faint">{plan.name}</h3>
                <p className="display mt-3 text-[clamp(2.75rem,6vw,4rem)] text-ink">
                  {currency.format(plan.price)}
                  <span className="label ml-1.5 align-middle text-ink-faint">/mo</span>
                </p>
                <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{plan.summary}</p>
                <ul className="mt-7 flex-1 space-y-3.5">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex gap-3.5">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="text-[15px] leading-relaxed text-ink-muted">{item}</span>
                    </li>
                  ))}
                </ul>
                {/* Change time sits below the benefits: a plan is the site being
                    looked after, not hours sold by the month. */}
                <p className="mt-7 border-t border-line pt-5 text-sm leading-relaxed text-ink-faint">
                  {plan.changeTime}
                </p>
                <CardCta href={`/contact?package=${plan.enquiryParam}`} className="mt-6">
                  {plan.cta}
                </CardCta>
              </div>
            ))}
          </div>

          <div className="mt-12 border border-line bg-paper-sunk p-8">
            <h3 className="label text-ink-faint">How the plans work</h3>
            <ul className="mt-6 space-y-3.5">
              {managementTerms.map((term) => (
                <li key={term} className="flex gap-4">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-[15px] leading-relaxed text-ink-muted">{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── Practical terms ───────────────────────────────────── */}
      <Section id="terms" className="scroll-mt-20 border-b border-line">
        <Container>
          <div className="step-in">
            <Label index="05">The practical bits</Label>
            <Display className="mt-6">Plainly</Display>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
              The things people normally have to ask for. Easier to put them here.
            </p>

            <div className="mt-14 grid border-t border-l border-line sm:grid-cols-2">
              {commercialTerms.map((term, i) => (
                <div key={term.title} className="relative border-r border-b border-line p-8">
                  <CropMarks className="opacity-30" />
                  <div className="flex items-baseline gap-4">
                    <span className="label text-accent-deep">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="display text-2xl text-ink sm:text-3xl">{term.title}</h3>
                  </div>
                  <ul className="mt-6 space-y-3.5">
                    {term.points.map((point) => (
                      <li key={point} className="flex gap-3.5">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="text-[15px] leading-relaxed text-ink-muted">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-3xl">
            <Display>Unsure</Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              That is normal, and it is my job rather than yours. Describe the
              business and what is not working, and I will tell you which scope
              fits — including when it is the cheaper one.
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
              <ArrowLink href="/web/process">See how a project runs</ArrowLink>
            </div>
            <p className="mt-8 text-sm text-ink-faint">
              Or email{' '}
              <a href={`mailto:${site.email}`} className="text-accent-deep underline-offset-4 hover:underline">
                {site.email}
              </a>
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
