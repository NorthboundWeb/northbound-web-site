import type { Metadata } from 'next'
import { Container, Display, Label, Rail, Section } from '@/components/ui'
import { DEFAULT_LOCALE } from '@/i18n/config'
import { resolvePage, type LocaleParams } from '@/lib/page-locale'
import {
  ICO_COMPLAINT_URL,
  PRIVACY_LAST_UPDATED,
  controller,
  processors,
} from '@/lib/privacy'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, t } = await resolvePage(params)
  return pageMetadata({
    locale,
    title: t.privacy.metaTitle,
    description: t.privacy.metaDescription,
    path: '/privacy',
  })
}

function Block({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-line-ink pt-8">
      <h2 className="display text-2xl text-ink">{heading}</h2>
      <div className="mt-5 max-w-2xl space-y-4 text-[15px] leading-relaxed text-ink-muted">
        {children}
      </div>
    </section>
  )
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-orange" />
          {item}
        </li>
      ))}
    </ul>
  )
}

const mail = (email: string) => (
  <a href={`mailto:${email}`} className="text-orange-ink underline underline-offset-4">
    {email}
  </a>
)

export default async function PrivacyPage({ params }: LocaleParams) {
  const { locale, t } = await resolvePage(params)
  const p = t.privacy

  return (
    <>
      <section className="border-b border-line">
        <Container>
          <div className="flex gap-8 lg:gap-14">
            <Rail index="06" />
            <div className="min-w-0 flex-1 pt-14 pb-16 sm:pt-20 lg:pb-24">
              <Label>{p.eyebrow}</Label>
              <Display as="h1" size="lg" className="mt-9 text-cream">
                {p.heading}
              </Display>
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                {p.lede}
              </p>
              <p className="label mt-8 text-chalk-faint">
                {p.lastUpdated} {PRIVACY_LAST_UPDATED}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section className="bg-cream text-ink">
        <Container>
          <div className="max-w-3xl space-y-12">
            {/*
              A translated legal notice is a convenience, not the operative
              text: a mistranslated lawful basis or retention period is a
              compliance problem, so the English is stated to be authoritative
              rather than quietly assumed to be.
            */}
            {locale !== DEFAULT_LOCALE ? (
              <p className="border-l-2 border-orange bg-cream-sunk p-5 text-sm leading-relaxed text-ink-muted">
                {p.translationNotice}
              </p>
            ) : null}
            <Block heading={p.sections.who}>
              <p>{p.whoBody}</p>
              <p>
                {p.whoContact.replace('{email}', '')}
                {mail(site.email)}
              </p>
              <address className="not-italic">
                {controller.postalAddress.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              {/*
                No registration line unless there is a real number. "ICO
                registered" without one is a false claim about a statutory
                register.
              */}
              {controller.icoRegistrationNumber ? (
                <p>ICO registration number: {controller.icoRegistrationNumber}</p>
              ) : null}
            </Block>

            <Block heading={p.sections.collected}>
              <p>{p.collectedIntro}</p>
              <Bullets items={p.collectedFields} />
              <p>{p.technicalIntro}</p>
              <Bullets items={p.technicalFields} />
              <p>{p.noTracking}</p>
            </Block>

            <Block heading={p.sections.why}>
              <p>{p.whyBody}</p>
            </Block>

            <Block heading={p.sections.basis}>
              <p>{p.basisIntro}</p>
              <ul className="space-y-3">
                {p.bases.map((b) => (
                  <li key={b.name} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-orange" />
                    <span>
                      <strong className="font-semibold text-ink">{b.name}</strong> — {b.body}
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="label pt-4 text-ink">{p.liaHeading}</h3>
              <dl className="space-y-3">
                {p.lia.map((row) => (
                  <div key={row.label}>
                    <dt className="font-semibold text-ink">{row.label}</dt>
                    <dd>{row.body}</dd>
                  </div>
                ))}
              </dl>
            </Block>

            <Block heading={p.sections.shared}>
              <p>{p.sharedIntro}</p>
              <ul className="space-y-3">
                {processors.map((proc) => (
                  <li key={proc.name} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-orange" />
                    <span>
                      <strong className="font-semibold text-ink">{proc.name}</strong> — {proc.role}
                    </span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block heading={p.sections.transfers}>
              <p>{p.transfersBody}</p>
              <p>
                {p.transfersLinksIntro}{' '}
                {processors.map((proc, i) => (
                  <span key={proc.name}>
                    {i > 0 ? ' · ' : ''}
                    <a
                      href={proc.privacyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-ink underline underline-offset-4"
                    >
                      {proc.name}
                    </a>
                  </span>
                ))}
              </p>
            </Block>

            <Block heading={p.sections.retention}>
              <p>{p.retentionIntro}</p>
              <Bullets items={p.retention} />
            </Block>

            <Block heading={p.sections.rights}>
              <p>{p.rightsIntro}</p>
              <Bullets items={p.rights} />
              <p>
                {p.rightsHow.replace('{email}', '')}
                {mail(site.email)}
              </p>
            </Block>

            <Block heading={p.sections.complain}>
              <p>
                {p.complainBody.split('{link}')[0]}
                <a
                  href={ICO_COMPLAINT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-ink underline underline-offset-4"
                >
                  ico.org.uk
                </a>
                {p.complainBody.split('{link}')[1]}
              </p>
            </Block>
          </div>
        </Container>
      </Section>
    </>
  )
}
