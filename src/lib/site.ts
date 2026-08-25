/**
 * Northbound — parent brand configuration.
 *
 * Northbound is the parent. Divisions sit beneath it and are declared here so
 * navigation, the homepage gateway and the footer all derive from one list.
 * Adding a third division later means adding one entry, not a rebuild.
 *
 * PLACEHOLDERS: `url` and `email` are best guesses. Replace with the real
 * domain and business inbox before launch — they feed metadata, the sitemap,
 * structured data, the footer and the enquiry fallback.
 */

export const site = {
  name: 'Northbound',
  legalName: 'Northbound',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://northboundweb.co.uk',
  tagline: 'A technology company. Choose your direction.',
  description:
    'Northbound builds digital infrastructure for small businesses. Northbound Web designs, builds and manages websites. Northbound AI builds tools and automation.',
  email: 'hello@northboundweb.co.uk',
  location: 'United Kingdom',
  socials: [
    {
      label: 'Instagram',
      handle: 'northboundwebuk',
      href: 'https://www.instagram.com/northboundwebuk',
    },
    {
      label: 'TikTok',
      handle: 'northbound.web.uk',
      href: 'https://www.tiktok.com/@northbound.web.uk',
    },
  ],
} as const

export type DivisionId = 'web' | 'ai'

export type Division = {
  id: DivisionId
  /** Shown as "Northbound {name}". */
  name: string
  href: string
  /** One line on the gateway. */
  summary: string
  /** The one-word display headline on the gateway card. */
  word: string
  /** Whether it is open for business or still being built. */
  state: 'live' | 'preview'
  stateLabel: string
  nav: { href: string; label: string }[]
}

export const divisions: Division[] = [
  {
    id: 'web',
    name: 'Web',
    href: '/web',
    word: 'Build',
    summary:
      'Websites, hosting and ongoing management for businesses that need to look the part.',
    state: 'live',
    stateLabel: 'Taking projects',
    nav: [
      { href: '/web', label: 'Overview' },
      { href: '/web/services', label: 'Services' },
      { href: '/web/process', label: 'Process' },
      { href: '/web/work', label: 'Work' },
    ],
  },
  {
    id: 'ai',
    name: 'AI',
    href: '/ai',
    word: 'Think',
    summary:
      'Jarvis and the automation tools that do the repetitive parts of running a business.',
    state: 'preview',
    stateLabel: 'In private preview',
    nav: [
      { href: '/ai', label: 'Overview' },
      { href: '/ai/full-access', label: 'Full Access' },
    ],
  },
]

export function divisionFor(pathname: string): Division | undefined {
  return divisions.find(
    (d) => pathname === d.href || pathname.startsWith(`${d.href}/`)
  )
}

/** Parent-level links, shown alongside whichever division you are in. */
export const parentNav = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export const currency = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})
