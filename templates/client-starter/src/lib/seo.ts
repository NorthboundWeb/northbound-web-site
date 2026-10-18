import { site } from './site'

/** LocalBusiness structured data, built from site.ts so it can never drift from the page. */
export function structuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    openingHours: site.openingHours,
  }
}
