import { ButtonLink, Container, Display, Label, Section } from '@/components/ui'
import { DEFAULT_LOCALE, localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

/**
 * Custom 404.
 *
 * Next renders not-found.tsx without the `[locale]` param, so the language
 * cannot be read from the route here. It falls back to English and offers a
 * route back into every section; the layout above it still sets `lang` from
 * the URL, and the localised recovery links keep a French visitor in French.
 *
 * Metadata (including robots noindex) is set by the route-level not-found
 * boundary in the layout's metadata, since a 404 has nothing to rank for.
 */
export default async function NotFound() {
  const locale = DEFAULT_LOCALE
  const t = await getDictionary(locale)

  const links = [
    { href: '/web', label: t.common.nav.web },
    { href: '/ai', label: t.common.nav.ai },
    { href: '/web/work', label: t.common.nav.work },
    { href: '/about', label: t.common.nav.about },
    { href: '/contact', label: t.common.nav.contact },
  ]

  return (
    <Section>
      <Container>
        <Label>{t.notFound.eyebrow}</Label>
        <Display as="h1" size="lg" className="mt-9 text-cream">
          {t.notFound.heading}
        </Display>
        <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-chalk-muted">
          {t.notFound.body}
        </p>
        <nav aria-label={t.notFound.recovery} className="mt-11 flex flex-wrap gap-4">
          <ButtonLink href={localePath(locale, '/')} variant="light">
            {t.notFound.backHome}
          </ButtonLink>
          {links.map((item) => (
            <ButtonLink
              key={item.href}
              href={localePath(locale, item.href)}
              variant="outline"
            >
              {item.label}
            </ButtonLink>
          ))}
        </nav>
      </Container>
    </Section>
  )
}
