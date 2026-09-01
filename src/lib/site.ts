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
  tagline: 'Digital infrastructure for modern businesses.',
  description:
    'Northbound builds digital infrastructure for modern businesses. Northbound.Web builds your digital presence. Northbound.AI builds your digital workforce.',
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

/** Which palette an environment renders in. The parent is its own. */
export type ThemeId = 'parent' | DivisionId

export type Division = {
  id: DivisionId
  /** Two-digit index. Divisions are numbered in the order they were founded. */
  index: string
  /** The short form: "Web", "AI". Shown after the wordmark in the header. */
  name: string
  /** The full lockup, as written in running copy and on the gateway. */
  wordmark: string
  /** The one-line promise. Parallel across divisions on purpose. */
  promise: string
  /** What the division sells, in a sentence. */
  summary: string
  /** The gateway's call to action. */
  enter: string
  href: string
  /** The one-word display headline on the gateway panel. */
  word: string
  /** Whether it is open for business or still being built. */
  state: 'live' | 'preview'
  stateLabel: string
  nav: { href: string; label: string }[]
}

/**
 * The divisions, in order.
 *
 * This array is the site's spine: the gateway, the header, the footer and the
 * About page all render from it, and each division's palette is a block in
 * globals.css keyed to the same id. A third division is one entry here, one
 * palette block, and one layout file — not a rebuild.
 */
export const divisions: Division[] = [
  {
    id: 'web',
    index: '01',
    name: 'Web',
    wordmark: 'Northbound.Web',
    promise: 'Build your digital presence.',
    summary:
      'Websites designed and built to grow a business, plus hosting, management and help with the site you already have.',
    enter: 'Explore Web',
    href: '/web',
    word: 'Presence',
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
    index: '02',
    name: 'AI',
    wordmark: 'Northbound.AI',
    promise: 'Build your digital workforce.',
    summary:
      'Northbound Employees — specialists that take on a real job in your business, working alone or as a team.',
    enter: 'Meet the employees',
    href: '/ai',
    word: 'Workforce',
    state: 'preview',
    stateLabel: 'In development',
    nav: [
      { href: '/ai', label: 'Overview' },
      { href: '/ai/employees', label: 'Employees' },
      { href: '/ai/services', label: 'Teams' },
      { href: '/ai/access', label: 'Early access' },
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
