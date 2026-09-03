import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/**
 * Public routes only. /services and /approach are gone and 308 to /web and
 * /about#process respectively (see next.config.ts) — a redirecting URL does
 * not belong in a sitemap, so they are not listed here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '/', priority: 1 },
    { path: '/web', priority: 0.9 },
    { path: '/web/work', priority: 0.7 },
    { path: '/ai', priority: 0.8 },
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
