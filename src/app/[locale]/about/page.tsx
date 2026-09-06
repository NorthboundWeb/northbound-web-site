import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
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
import { localePath } from '@/i18n/config'
import { founderPhoto } from '@/lib/founder'
import { resolvePage, type LocaleParams } from '@/lib/page-locale'
import { divisions, site } from '@/lib/site'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, t } = await resolvePage(params)
  return pageMetadata({
    locale,
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    path: '/about',
  })
}

export default async function AboutPage({ params }: LocaleParams) {
  const { locale, t } = await resolvePage(params)
  const b = t.about

  return (
    <>
      <section className="border-b border-line">
        <Container>
          <div className="flex gap-8 lg:gap-14">
            <Rail index="04" />
            <div className="min-w-0 flex-1 pt-14 pb-16 sm:pt-20 lg:pb-24">
              <Label>{b.eyebrow}</Label>
              <Display as="h1" size="lg" className="mt-9 max-w-3xl text-cream">
                {b.heading}
              </Display>
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                {b.lede}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------ story */}
      <Section className="bg-cream text-ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_0.72fr] lg:gap-20">
            <div>
              <Label tone="light">{b.storyEyebrow}</Label>
              <div className="mt-9 max-w-2xl space-y-5">
                {b.story.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-relaxed text-ink-muted sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/*
              A real photograph goes here when there is one. Until then the
              column carries the pull-quote instead, so the layout reads as
              finished rather than as a missing image.
            */}
            <aside className="lg:pt-16">
              {founderPhoto ? (
                <figure className="border border-line-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={founderPhoto.src}
                    alt={founderPhoto.alt}
                    width={founderPhoto.width}
                    height={founderPhoto.height}
                    className="h-auto w-full"
                  />
                </figure>
              ) : (
                <blockquote className="border-l-2 border-orange pl-7">
                  <p className="display text-[clamp(1.5rem,3vw,2.25rem)] text-ink">
                    {b.pullQuote}
                  </p>
                  <footer className="label mt-6 text-ink-faint">
                    {b.pullQuoteFooter}
                  </footer>
                </blockquote>
              )}
            </aside>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- purpose */}
      <Section className="bg-black">
        <Container>
          <Label>{b.purposeEyebrow}</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-cream">
            {b.purposeHeading}
          </Display>
          <ul className="mt-14 grid gap-px bg-line lg:grid-cols-3">
            {b.purpose.map((item) => (
              <li key={item.title} className="bg-black p-7 sm:p-8">
                <h3 className="display text-xl text-cream">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-chalk-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* -------------------------------------------------------- divisions */}
      <Section className="bg-cream text-ink">
        <Container>
          <Label tone="light">{b.divisionsEyebrow}</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-ink">
            {b.divisionsHeading}
          </Display>
          <ul className="mt-14 grid gap-px bg-line-ink lg:grid-cols-2">
            {divisions.map((d) => (
              <li key={d.id} className="bg-cream p-8 sm:p-10">
                <span
                  className={
                    d.accent === 'orange'
                      ? 'label text-orange-ink'
                      : 'label text-ink-faint'
                  }
                >
                  {d.index}
                </span>
                <Display as="h3" size="sm" className="mt-6 text-ink">
                  {d.name}
                </Display>
                {!d.available ? <ComingSoon tone="light" className="mt-5">{t.common.comingSoon}</ComingSoon> : null}
                <p className="mt-6 text-sm leading-relaxed text-ink-muted">
                  {d.id === 'web' ? t.home.divisions.webBody : t.home.divisions.aiBody}
                </p>
                <ArrowLink
                  href={localePath(locale, d.href)}
                  tone={d.accent === 'orange' ? 'orangeInk' : 'ink'}
                  className="mt-8"
                >
                  {d.id === 'web' ? t.common.cta.exploreWeb : t.common.cta.exploreComing}
                </ArrowLink>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- process */}
      <Section id="process" className="scroll-mt-24 bg-black">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label>{b.processEyebrow}</Label>
              <Display as="h2" size="md" className="mt-8 text-cream">
                {b.processLine1}
                <br />
                {b.processLine2}
              </Display>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-chalk-muted">
              {b.processAside}
            </p>
          </div>

          <ol className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {b.process.map((step, i) => (
              <li key={step.title} className="bg-black p-7 sm:p-8">
                <span className="label text-orange">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display mt-5 text-2xl text-cream">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-chalk-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* -------------------------------------------------------- standards */}
      <Section className="bg-cream text-ink">
        <Container>
          <Label tone="light">{t.web.standardsEyebrow}</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-ink">
            {b.standardsHeading}
          </Display>
          <ul className="mt-14 grid gap-px bg-line-ink sm:grid-cols-2 lg:grid-cols-3">
            {t.web.standards.map((s) => (
              <li key={s.title} className="bg-cream p-7 sm:p-8">
                <h3 className="label text-ink">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  {s.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-wrap items-center gap-5 border-t border-line-ink pt-10">
            <ButtonLink href={localePath(locale, '/contact')} variant="solid" size="lg">
              {t.common.cta.discussProject}
            </ButtonLink>
            <ArrowLink href={localePath(locale, '/web') + '#pricing'} tone="ink">
              {t.common.cta.seePackages}
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
