import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/** Add every public route here as the site grows. */
const routes = ['/', '/contact', '/privacy']

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route, site.url).toString(),
    lastModified: new Date(),
  }))
}
