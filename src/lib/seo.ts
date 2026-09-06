import type { Metadata } from 'next'
import { LOCALES, LOCALE_META, localePath, type Locale } from '@/i18n/config'
import { site } from '@/lib/site'

/**
 * Per-page, per-locale metadata.
 *
 * Every page needs its OWN canonical and og:url — inheriting the root's meant
 * every share of /web reported itself as the homepage. Both are built from one
 * path so they cannot disagree.
 *
 * `languages` produces the hreflang set. Each locale points at its own URL and
 * `x-default` points at English, so a search engine is told which version to
 * show without guessing from the copy.
 */
export function pageMetadata({
  locale,
  title,
  description,
  path,
}: {
  locale: Locale
  title: string
  description: string
  /** Locale-independent path, e.g. "/web". */
  path: string
}): Metadata {
  const url = new URL(localePath(locale, path), site.url).toString()

  const languages: Record<string, string> = {}
  for (const code of LOCALES) {
    languages[LOCALE_META[code].tag] = localePath(code, path)
  }
  languages['x-default'] = localePath('en', path)

  return {
    title,
    description,
    alternates: { canonical: localePath(locale, path), languages },
    openGraph: {
      type: 'website',
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: LOCALES.filter((c) => c !== locale).map(
        (c) => LOCALE_META[c].ogLocale
      ),
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${site.name}`,
      description,
    },
  }
}

/**
 * Structured data.
 *
 * Deliberately minimal: name, what the business does, where it operates, and
 * how to reach it. No aggregateRating, no review, no foundingDate — none of
 * that has been confirmed, and inventing it in JSON-LD is the same lie as
 * inventing it on the page, just less visible.
 */
export function structuredData(locale: Locale = 'en') {
  const organisation = {
    '@type': 'ProfessionalService',
    '@id': `${site.url}#organisation`,
    name: site.legalName,
    url: site.url,
    description: site.description,
    email: site.email,
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    knowsAbout: [
      'Web design',
      'Web development',
      'Website hosting',
      'Website maintenance',
    ],
    sameAs: site.socials.map((s) => s.href),
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${site.url}#website`,
    url: site.url,
    name: site.name,
    inLanguage: LOCALE_META[locale].tag,
    publisher: { '@id': `${site.url}#organisation` },
  }

  return { '@context': 'https://schema.org', '@graph': [organisation, website] }
}
