import type { MetadataRoute } from 'next'
import { employees } from '@/lib/ai/employees'
import { teams } from '@/lib/ai/teams'
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
    { path: '/ai', priority: 0.8 },
    { path: '/ai/employees', priority: 0.7 },
    { path: '/ai/services', priority: 0.7 },
    { path: '/ai/access', priority: 0.5 },
    // Derived, so a new employee or team is in the sitemap by existing.
    ...employees.map((e) => ({ path: `/ai/employees/${e.slug}`, priority: 0.6 })),
    ...teams.map((t) => ({ path: `/ai/services/${t.slug}`, priority: 0.6 })),
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
