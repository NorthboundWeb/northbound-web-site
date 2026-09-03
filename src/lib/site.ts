/**
 * Single source of truth for site-wide details.
 *
 * Navigation, social handles and the division definitions all live here. Any
 * public reference to a handle or a division route reads from this file — a
 * handle must never be typed into a component by hand, because that is how the
 * old Instagram handle survived three redesigns.
 */
export const site = {
  name: 'Northbound',
  legalName: 'Northbound Web',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://northboundweb.co.uk',
  tagline: 'Digital infrastructure for modern businesses.',
  description:
    'Northbound builds and manages websites for UK businesses, and is building Northbound Employees — AI workers designed around real business jobs. Web services available now; Employees coming soon.',
  email: 'hello@northboundweb.co.uk',
  location: 'United Kingdom',

  /** Header navigation, in order. Every destination is a real route. */
  nav: [
    { href: '/web', label: 'Web Services' },
    { href: '/ai', label: 'AI Employees' },
    { href: '/web/work', label: 'Our Work' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],

  /**
   * Public profiles. Both handles verified against the brief:
   * Instagram @northboundweb.uk, TikTok @northbound.web.uk.
   *
   * LinkedIn is deliberately absent. The approved mockup shows a LinkedIn
   * icon, but no Northbound LinkedIn profile has been confirmed to exist and
   * an icon without a working destination is a dead link. Add an entry here
   * once there is a real profile to point at.
   */
  socials: [
    {
      label: 'Instagram',
      handle: '@northboundweb.uk',
      href: 'https://www.instagram.com/northboundweb.uk/',
    },
    {
      label: 'TikTok',
      handle: '@northbound.web.uk',
      href: 'https://www.tiktok.com/@northbound.web.uk',
    },
  ],
} as const

/**
 * The two divisions. `available` drives every "coming soon" treatment on the
 * site, so the AI division's public status is changed in exactly one place.
 */
export const divisions = [
  {
    index: '01',
    id: 'web',
    name: 'Northbound.Web',
    href: '/web',
    headline: 'Websites that grow your business.',
    body: 'One-off website builds, ongoing management and continuous improvements.',
    cta: 'Explore web services',
    accent: 'orange',
    available: true,
  },
  {
    index: '02',
    id: 'ai',
    name: 'Northbound.AI',
    href: '/ai',
    headline: 'Employees that work for your business.',
    body: 'AI-powered employees designed to save time, take repetitive work off your hands and help businesses operate more effectively.',
    cta: "Explore what's coming",
    accent: 'yellow',
    available: false,
  },
] as const

export const currency = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})
