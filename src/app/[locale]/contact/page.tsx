import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { ContactForm } from '@/components/contact-form'
import { Container, Display, Label, Rail, Section } from '@/components/ui'
import { localePath } from '@/i18n/config'
import { interestFromParam, projectTypeFromParam } from '@/lib/contact/schema'
import { resolvePage } from '@/lib/page-locale'
import { getCurrency } from '@/lib/prefs/server'
import { site } from '@/lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale, t } = await resolvePage(params)
  return pageMetadata({
    locale,
    title: t.contact.metaTitle,
    description: t.contact.metaDescription,
    path: '/contact',
  })
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ package?: string | string[]; interest?: string | string[] }>
}) {
  const { locale, t } = await resolvePage(params)
  const query = await searchParams
  const currency = await getCurrency()
  // Resolved on the server so the right option is already selected in the HTML
  // — no flash of an empty select, and it still works without JavaScript.
  // A ?package= from a pricing card wins over a generic ?interest=.
  const preselected =
    projectTypeFromParam(query.package) ?? interestFromParam(query.interest)

  return (
    <>
      <section className="border-b border-line">
        <Container>
          <div className="flex gap-8 lg:gap-14">
            <Rail index="05" />
            <div className="min-w-0 flex-1 pt-14 pb-16 sm:pt-20 lg:pb-24">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Label>{t.contact.eyebrow}</Label>
                <span className="label text-chalk-faint">{t.contact.replyPromise}</span>
              </div>
              <Display as="h1" size="lg" className="mt-9 text-cream">
                {t.contact.heading}
              </Display>
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                {t.contact.ledeBefore}{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="text-orange underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>{' '}
                {t.contact.ledeAfter}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section className="bg-cream text-ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <ContactForm
                defaultProjectType={preselected}
                currency={currency}
                language={locale}
                t={t.contact}
                privacyHref={localePath(locale, '/privacy')}
              />
            </div>

            <aside>
              <div className="border border-line-ink bg-cream-sunk p-8">
                <h2 className="label text-ink-faint">{t.contact.faqEyebrow}</h2>
                <dl className="mt-8 divide-y divide-line-ink">
                  {t.contact.faq.map((item, i) => (
                    <div key={item.question} className="py-5 first:pt-0 last:pb-0">
                      <dt className="flex gap-4">
                        <span className="label shrink-0 pt-0.5 text-orange-ink">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-medium text-ink">
                          {item.question}
                        </span>
                      </dt>
                      <dd className="mt-2.5 pl-10 text-[15px] leading-relaxed text-ink-muted">
                        {item.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  )
}
