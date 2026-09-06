import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Image from 'next/image'
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
import type { Dictionary } from '@/i18n/dictionaries'
import { resolvePage, type LocaleParams } from '@/lib/page-locale'
import { work, type WorkItem } from '@/lib/work'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, t } = await resolvePage(params)
  return pageMetadata({
    locale,
    title: t.work.metaTitle,
    description: t.work.metaDescription,
    path: '/web/work',
  })
}

function CaseStudy({ item, t }: { item: WorkItem; t: Dictionary }) {
  const copy = t.work.projects[item.slug]
  const shot = item.shots?.desktop

  return (
    <article className="grid gap-10 border-t border-line pt-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      <div>
        <span className="label border border-line-strong px-2.5 py-1 text-chalk">
          {t.work.kinds[item.kind]}
        </span>
        <Display as="h2" size="md" className="mt-7 text-cream">
          {item.title}
        </Display>
        <p className="label mt-3 text-chalk-faint">{copy.category}</p>
        <p className="mt-7 text-[15px] leading-relaxed text-chalk-muted">
          {copy.brief}
        </p>

        <h3 className="label mt-9 text-chalk">{t.work.whatWasBuilt}</h3>
        <ul className="mt-4 space-y-2.5">
          {copy.built.map((line) => (
            <li
              key={line}
              className="flex gap-3 text-sm leading-relaxed text-chalk-muted"
            >
              <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-orange" />
              {line}
            </li>
          ))}
        </ul>

        <h3 className="label mt-8 text-chalk">{t.work.services}</h3>
        <p className="mt-3 text-sm text-chalk-muted">{copy.services.join(' · ')}</p>

        {item.href ? (
          <ArrowLink href={item.href} className="mt-8">
            {t.work.visitSite}
          </ArrowLink>
        ) : null}
      </div>

      <div className="border border-line bg-char">
        {shot ? (
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 640px, 100vw"
          />
        ) : (
          // No real screenshot yet. The drawn plate stands in rather than a
          // fabricated browser mock-up of a site that was never designed.
          <div className="relative aspect-16/10 overflow-hidden">
            <MountainPlate className="h-full w-full opacity-60" />
          </div>
        )}
      </div>
    </article>
  )
}

export default async function WorkPage({ params }: LocaleParams) {
  const { locale, t } = await resolvePage(params)
  return (
    <>
      <section className="border-b border-line">
        <Container>
          <div className="flex gap-8 lg:gap-14">
            <Rail index="03" />
            <div className="min-w-0 flex-1 pt-14 pb-16 sm:pt-20 lg:pb-24">
              <Label>{t.work.eyebrow}</Label>
              <Display as="h1" size="lg" className="mt-9 max-w-3xl text-cream">
                {t.work.h1Line1}
                <br />
                {t.work.h1Line2}
              </Display>
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                {t.work.lede}
              </p>
              <ButtonLink
                href={localePath(locale, '/contact')}
                variant="light"
                className="mt-10"
              >
                {t.work.askToSeeMore}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <Section className="bg-black">
        <Container>
          <div className="space-y-16">
            {work.map((item) => (
              <CaseStudy key={item.slug} item={item} t={t} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-cream text-ink">
        <Container>
          <Label tone="light">{t.work.whatYouGet}</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-ink">
            {t.web.standardsHeadingAlt}
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
          <div className="mt-14 flex flex-wrap items-center gap-5 border-t border-line-ink pt-10">
            <ButtonLink href={localePath(locale, '/contact')} variant="solid" size="lg">
              {t.common.cta.startProject}
            </ButtonLink>
            <ArrowLink href={localePath(locale, '/web') + '#pricing'} tone="ink">
              {t.common.cta.seePackages}
            </ArrowLink>
          </div>
        </Container>
      </Section>
    </>
  )
}
