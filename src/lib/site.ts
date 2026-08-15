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
  email: 'hello@northboundweb.co.uk',
  location: 'United Kingdom',
  nav: [
    { href: '/services', label: 'Services' },
    { href: '/approach', label: 'Approach' },
    { href: '/about', label: 'About' },
  ],
} as const

export const currency = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})
