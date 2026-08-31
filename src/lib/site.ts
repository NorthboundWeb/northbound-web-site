/**
 * Northbound — parent brand configuration.
 *
 * Northbound is the parent. Divisions sit beneath it and are declared here so
 * navigation, the homepage gateway and the footer all derive from one list.
 * Adding a third division later means adding one entry, not a rebuild.
 *
 * `email` is the address already published on northboundweb.co.uk, so it is
 * the one a visitor would find anyway. It feeds the footer, the contact page
 * and the enquiry fallback — change it in this one place if the business inbox
 * moves. `CONTACT_TO_EMAIL` is separate and governs where the form delivers.
 */

export const site = {
  name: 'Northbound',
  legalName: 'Northbound',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://northboundweb.co.uk',
  tagline: 'Two divisions. One technology company.',
  description:
    'Northbound builds digital infrastructure for small businesses. Northbound.Web designs, builds and manages websites. Northbound.AI builds AI employees — workers that do a real job in your business.',
  email: 'che@northboundweb.co.uk',
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
  /** The short form: "Web", "AI". Shown after the wordmark in the header. */
  name: string
  /** The full lockup, as written in running copy and on the gateway. */
  wordmark: string
  /** The gateway's call to action. */
  enter: string
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
    wordmark: 'Northbound.Web',
    enter: 'Explore Web',
    href: '/web',
    word: 'Build',
    summary:
      'Website design and build, ecommerce and web services, hosting and ongoing management — including sites you already have.',
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
    wordmark: 'Northbound.AI',
    enter: 'Explore AI',
    href: '/ai',
    word: 'Work',
    summary:
      'AI employees: workers that do a real job in your business rather than sitting in a chat window waiting to be asked.',
    state: 'preview',
    stateLabel: 'In development',
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
