import type { MetadataRoute } from 'next'
import { LOCALES, LOCALE_META, localePath } from '@/i18n/config'
import { site } from '@/lib/site'

/**
 * Every public route, in every locale.
 *
 * /services and /approach are gone and 308 to /web and /about#process (see
 * next.config.ts) — a redirecting URL does not belong in a sitemap, so they
 * are not listed. Each entry carries its `alternates.languages` so a crawler
 * that finds one language is told about the rest.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '/', priority: 1 },
    { path: '/web', priority: 0.9 },
    { path: '/web/work', priority: 0.7 },
    { path: '/ai', priority: 0.8 },
    { path: '/about', priority: 0.6 },
    { path: '/contact', priority: 0.8 },
    { path: '/privacy', priority: 0.3 },
  ]

  const lastModified = new Date()
  const absolute = (locale: (typeof LOCALES)[number], path: string) =>
    new URL(localePath(locale, path), site.url).toString()

  return routes.flatMap(({ path, priority }) =>
    LOCALES.map((locale) => ({
      url: absolute(locale, path),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((code) => [LOCALE_META[code].tag, absolute(code, path)])
        ),
      },
    }))
  )
}
