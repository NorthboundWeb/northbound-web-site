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
  /** The links in the top bar, beside the Northbound sign. */
  nav: [
    { href: '/discover', label: 'Discover' },
    { href: '/projects', label: 'Projects' },
    { href: '/#prices', label: 'Prices' },
    { href: '/#how', label: 'How it works' },
    { href: '/booking', label: 'Book a call' },
  ],
  /**
   * Every page, for the footer. The longer pages stay reachable even though
   * the top bar only carries the four the design puts there.
   */
  pages: [
    { href: '/', label: 'Home' },
    { href: '/discover', label: 'Discover' },
    { href: '/projects', label: 'Projects' },
    { href: '/services', label: 'Packages in full' },
    // Labelled "Process" but kept at /approach: the URL is in the sitemap and
    // the page's canonical tag, so renaming the route would be an SEO change.
    { href: '/approach', label: 'Process' },
    { href: '/about', label: 'About' },
    { href: '/booking', label: 'Book a call' },
    { href: '/contact', label: 'Start a project' },
  ],
  /**
   * The route map that drops from the Northbound sign: one junction per
   * destination. The Prices note is built from the package data in
   * src/lib/services.ts, so a price is only ever written down in one place.
   */
  routeMap: [
    { code: 'J1', href: '/', label: 'Home', note: 'The motorway, live sign and fixed prices', go: false },
    { code: 'J2', href: '/discover', label: 'Discover', note: 'Template vs agency vs Northbound', go: false },
    { code: 'J3', href: '/projects', label: 'Projects', note: 'Working demos you can try', go: false },
    { code: 'J4', href: '/#prices', label: 'Prices', note: null, go: false },
    { code: 'J5', href: '/#how', label: 'How it works', note: 'From first message to live site', go: false },
    { code: 'J6', href: '/booking', label: 'Book a call', note: 'A free 20-minute call, five quick questions', go: false },
    { code: 'J7', href: '/contact', label: 'Start a project', note: 'Plan your route in about two minutes', go: true },
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
