import Link from 'next/link'
import { GrowthIcon, PeopleIcon, ShieldIcon, WindowIcon } from '@/components/graphics'
import { Mark } from '@/components/logo'
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
  cn,
} from '@/components/ui'
import { formatMoney } from '@/lib/money/currency'
import { buildPackages } from '@/lib/services'
import { localePath } from '@/i18n/config'
import { resolvePage, type LocaleParams } from '@/lib/page-locale'
import { divisions } from '@/lib/site'
import { work } from '@/lib/work'

/** The entry price, read from the pricing data rather than typed into copy. */
const cheapestBuild = buildPackages.reduce((cheapest, pkg) =>
  pkg.pricePence < cheapest.pricePence ? pkg : cheapest
)

export default async function HomePage({ params }: LocaleParams) {
  const { locale, t } = await resolvePage(params)
  const h = t.home

  /**
   * The approved mockup showed "200+ websites" and "trusted by UK
   * businesses". Neither figure has been verified, so neither is published —
   * these are statements that are true without counting anything.
   */
  const credentials = h.credentials
  const pillars = [
    { icon: WindowIcon, ...h.pillars.web },
    { icon: PeopleIcon, ...h.pillars.ai, comingSoon: true },
    { icon: GrowthIcon, ...h.pillars.growth },
    { icon: ShieldIcon, ...h.pillars.secure },
  ]

  return (
    <>
      {/* ---------------------------------------------------------------- 01 */}
      <section className="relative overflow-hidden">
        {/* The plate bleeds off the right edge, behind the type. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-90 sm:w-[70%] lg:w-[58%]"
        >
          <MountainPlate className="h-full w-full" />
        </div>

        <Container className="relative">
          <div className="flex gap-8 lg:gap-14">
            <Rail index="01" />

            <div className="min-w-0 flex-1 pt-14 pb-20 sm:pt-20 lg:pt-24 lg:pb-32">
              <Label>{h.eyebrow}</Label>

              <Display as="h1" size="lg" className="mt-9 max-w-4xl text-cream">
                {h.h1Line1}
                <br />
                {h.h1Line2}
              </Display>

              <p className="mt-9 max-w-lg text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                {h.lede.split('{price}')[0]}
                <strong className="font-semibold text-cream">
                  {formatMoney(cheapestBuild.pricePence)}
                </strong>
                {h.lede.split('{price}')[1]}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <ButtonLink href={localePath(locale, '/web') + '#pricing'} variant="light" size="lg">
                  {t.common.cta.seePackages}
                </ButtonLink>
                <ButtonLink href={localePath(locale, '/contact')} variant="outline" size="lg">
                  {t.common.cta.startProject}
                </ButtonLink>
              </div>

              <p className="mt-8 max-w-md text-sm leading-relaxed text-chalk-faint">
                {h.aiNote}{' '}
                <Link
                  href={localePath(locale, '/ai')}
                  className="text-yellow underline-offset-4 hover:underline"
                >
                  {h.aiNoteLink}
                </Link>
              </p>
            </div>

            {/* Credentials rail — desktop only, as in the composition. */}
            <div className="hidden w-44 shrink-0 flex-col justify-center py-24 xl:flex">
              {credentials.map((c, i) => (
                <div
                  key={c.label}
                  className={cn(
                    'py-6',
                    i > 0 && 'border-t border-line'
                  )}
                >
                  <p className="label text-chalk-faint">{c.label}</p>
                  <p className="display mt-2 text-3xl text-cream">{c.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------- division cards */}
      <Container className="relative pb-20 sm:pb-28">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          {divisions.map((d) => {
            const web = d.accent === 'orange'
            return (
              <article
                key={d.id}
                className={cn(
                  'group relative flex flex-col border-l-[3px] p-8 transition-transform duration-300 sm:p-10 lg:hover:-translate-y-1',
                  web
                    ? 'border-l-orange bg-cream text-ink'
                    : 'border-l-yellow bg-char-raised text-chalk'
                )}
              >
                <div className="flex items-center gap-5">
                  <span
                    className={cn(
                      'display text-2xl',
                      web ? 'text-ink' : 'text-yellow'
                    )}
                  >
                    {d.index}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      'h-px flex-1',
                      web ? 'bg-line-ink-strong' : 'bg-line-strong'
                    )}
                  />
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M3 12h17M14 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>

                <Display as="h2" size="md" className="mt-10">
                  {d.name}
                </Display>

                <p
                  className={cn(
                    'mt-5 text-sm font-semibold tracking-wide uppercase',
                    web ? 'text-ink' : 'text-yellow'
                  )}
                >
                  {web ? h.divisions.webHeadline : h.divisions.aiHeadline}
                </p>

                {!d.available ? <ComingSoon className="mt-6 self-start">{t.common.comingSoon}</ComingSoon> : null}

                <p
                  className={cn(
                    'mt-6 max-w-md text-[15px] leading-relaxed',
                    web ? 'text-ink-muted' : 'text-chalk-muted'
                  )}
                >
                  {web ? h.divisions.webBody : h.divisions.aiBody}
                </p>

                {web ? (
                  <p className="label mt-6 text-ink">
                    {t.common.availableNow} · {t.common.from.toLowerCase()}{' '}
                    {formatMoney(cheapestBuild.pricePence)}
                  </p>
                ) : null}

                <div className="mt-10 pt-2">
                  <ButtonLink
                    href={localePath(locale, d.href)}
                    variant={web ? 'solid' : 'yellow'}
                    // Stretches over the whole card; see CardCta's note.
                    className="relative z-10 after:absolute after:inset-0 after:content-['']"
                  >
                    {web ? t.common.cta.exploreWeb : t.common.cta.exploreComing}
                  </ButtonLink>
                </div>
              </article>
            )
          })}
        </div>

        {/* Replaces the mockup's "NB" lettermark plate with the approved mark. */}
        <div className="mt-8 hidden items-center gap-4 border border-line px-5 py-4 lg:inline-flex">
          <Mark className="h-6 w-auto" />
          <p className="label text-chalk-muted">
            {h.signature}
          </p>
        </div>
      </Container>

      {/* ---------------------------------------------------------------- 02 */}
      <Section className="bg-cream text-ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Label tone="light">{h.whatWeDo}</Label>
              <Display as="h2" size="md" className="mt-8 text-ink">
                {h.twoDivisionsLine1}
                <br />
                {h.twoDivisionsLine2}
              </Display>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-muted sm:text-base">
                {h.twoDivisionsBody1}
              </p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-muted sm:text-base">
                {h.twoDivisionsBody2}
              </p>
              <ButtonLink
                href={localePath(locale, '/about')}
                variant="solid"
                className="mt-10"
              >
                {t.common.cta.learnMore}
              </ButtonLink>
            </div>

            <ul className="grid gap-px self-start bg-line-ink sm:grid-cols-2">
              {pillars.map((p) => (
                <li key={p.title} className="bg-cream p-7 sm:p-8">
                  <p.icon className="h-7 w-7 text-ink" />
                  <h3 className="label mt-6 text-ink">{p.title}</h3>
                  {'comingSoon' in p && p.comingSoon ? (
                    <p className="label mt-3 text-ink-faint">{t.common.comingSoon}</p>
                  ) : null}
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- 03 */}
      <Section className="bg-black">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
            <div>
              <Label>{h.recentWork}</Label>
              <Display as="h2" size="md" className="mt-8 text-cream">
                {h.workLine1}
                <br />
                {h.workLine2}
              </Display>
              <ArrowLink href={localePath(locale, '/web/work')} className="mt-10">
                {t.common.cta.viewWork}
              </ArrowLink>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2">
              {work.map((item) => (
                <li key={item.slug} className="group">
                  <Link href={localePath(locale, '/web/work')} className="block">
                    <div className="relative aspect-4/3 overflow-hidden border border-line bg-char">
                      <MountainPlate className="h-full w-full opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                      <span className="label absolute top-3 left-3 border border-line-strong bg-black/80 px-2.5 py-1 text-chalk">
                        {t.work.kinds[item.kind]}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[15px] text-cream">{item.title}</h3>
                    <p className="mt-1 text-sm text-chalk-faint">
                      {t.work.projects[item.slug].category}
                    </p>
                  </Link>
                </li>
              ))}

              {/*
                No filler card. The portfolio is genuinely short, so the second
                cell says so and offers the real next step rather than padding
                the grid with a project that does not exist.
              */}
              <li className="flex flex-col justify-center border-l border-line pl-6">
                <p className="text-[15px] leading-relaxed text-chalk-muted">
                  {h.workMore}
                </p>
                <ArrowLink href={localePath(locale, '/contact')} className="mt-6">
                  {t.common.cta.askToSee}
                </ArrowLink>
              </li>
            </ul>
          </div>
        </Container>
      </Section>
    </>
  )
}
