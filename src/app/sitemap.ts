import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/**
 * Only pages that are genuinely useful to a visitor arriving cold. /web/work
 * is excluded deliberately — it carries no case studies yet and sets its own
 * noindex — as are /unlock and the enquiry confirmation states.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '/', priority: 1 },
    { path: '/web', priority: 0.9 },
    { path: '/web/services', priority: 0.9 },
    { path: '/web/process', priority: 0.7 },
    { path: '/ai', priority: 0.6 },
    { path: '/ai/full-access', priority: 0.5 },
    { path: '/about', priority: 0.6 },
    { path: '/contact', priority: 0.8 },
  ]

  const lastModified = new Date()

  return routes.map(({ path, priority }) => ({
    url: new URL(path, site.url).toString(),
    lastModified,
    changeFrequency: 'monthly',
    priority,
  }))
}
