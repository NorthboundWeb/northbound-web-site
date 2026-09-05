import type { Metadata } from 'next'
import { site } from '@/lib/site'

/**
 * Per-page metadata.
 *
 * Every page needs its OWN canonical and og:url — inheriting the root's meant
 * every share of /web or /ai reported itself as the homepage. This builds both
 * from one path so they cannot disagree.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  /** Absolute path, e.g. "/web". */
  path: string
}): Metadata {
  const url = new URL(path, site.url).toString()
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
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
 * how to reach it. No aggregateRating, no review, no foundingDate, no
 * postal address — none of that has been confirmed, and inventing it in
 * JSON-LD is the same lie as inventing it on the page, just less visible.
 */
export function structuredData() {
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
    inLanguage: 'en-GB',
    publisher: { '@id': `${site.url}#organisation` },
  }

  return { '@context': 'https://schema.org', '@graph': [organisation, website] }
}
