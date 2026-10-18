/**
 * Everything specific to this client lives here: change these values and the
 * whole site (titles, schema markup, footer, sitemap, contact details) follows.
 * Nothing in a component should hard-code a name, phone number or address.
 */
export const site = {
  name: 'Client Name',
  tagline: 'One clear sentence about what the business does.',
  description:
    'A 70 to 160 character summary for search results: what the business does, where, and for whom.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.co.uk',
  email: 'hello@example.co.uk',
  phone: '+44 1234 567890',
  address: {
    street: '1 High Street',
    city: 'Birmingham',
    postcode: 'B1 1AA',
    country: 'GB',
  },
  openingHours: ['Mo-Fr 09:00-17:30'],
  nav: [
    { href: '/', label: 'Home' },
    { href: '/contact', label: 'Contact' },
  ],
} as const
