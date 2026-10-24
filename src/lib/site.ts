/**
 * Single source of truth for site-wide details.
 *
 * PLACEHOLDERS: `url`, `email` and `phone` are best guesses. Replace them with
 * the real domain and business contact details before launch — they feed
 * metadata, the sitemap, structured data and the footer.
 */
export const site = {
  name: 'Northbound Web',
  // Used for canonical URLs, OG tags and the sitemap. Set NEXT_PUBLIC_SITE_URL
  // in Vercel so preview and production resolve correctly.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://northboundweb.co.uk',
  tagline: 'Web development for small businesses that need to be taken seriously.',
  description:
    'Northbound Web builds fast, accessible, secure websites and web applications for UK small businesses — designed properly, built to last, and looked after once they are live.',
  email: 'che@northboundweb.co.uk',
  location: 'United Kingdom',
  nav: [
    { href: '/discover', label: 'Discover' },
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Services' },
    // Labelled "Process" but kept at /approach: the URL is in the sitemap and
    // the page's canonical tag, so renaming the route would be an SEO change.
    { href: '/approach', label: 'Process' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  /**
   * The route map that opens from the Northbound wordmark: one "junction" per
   * destination. Kept separate from `nav` because it is a map of the whole site
   * (including Home and the start of a project), not the top-bar links.
   */
  routeMap: [
    { code: 'J1', href: '/', label: 'Home', note: 'Where you are starting', go: false },
    { code: 'J2', href: '/discover', label: 'Discover', note: 'Before and after, side by side', go: false },
    { code: 'J3', href: '/projects', label: 'Projects', note: 'Working demos you can try', go: false },
    { code: 'J4', href: '/services', label: 'Prices', note: 'Packages and management plans', go: false },
    { code: 'J5', href: '/approach', label: 'How it works', note: 'How a project runs', go: false },
    { code: 'J6', href: '/contact', label: 'Start a project', note: 'Plan your route', go: true },
  ],
  socials: [
    { label: 'TikTok', handle: 'northbound.web.uk', href: 'https://www.tiktok.com/@northbound.web.uk' },
    { label: 'Instagram', handle: 'northboundwebuk', href: 'https://www.instagram.com/northboundwebuk' },
  ],
} as const

export const currency = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})
