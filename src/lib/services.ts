/**
 * Northbound.Web's offer — the STRUCTURE of it.
 *
 * Prices, slugs, enquiry parameters and flags live here. All customer-facing
 * prose lives in the dictionaries (`src/i18n/dictionaries`), keyed by the same
 * slugs, so it can be translated and professionally reviewed without touching
 * a component.
 *
 * PRICES ARE INTEGER GBP PENCE and are formatted through
 * `@/lib/money/currency`. Never write a price as a display string, and never
 * store a converted EUR/USD figure — GBP is the contractual currency and every
 * other currency on the site is a labelled approximation of these numbers.
 *
 * RETIRED — do not reinstate any of these names or figures anywhere public:
 * Basic £199, Standard £199/£299, Advanced £399, Business, Extended, the £119
 * and £999 packages, Essential Management, Complete Management, management at
 * £60 or £69, and any change allowance described as 30 minutes, "an hour" or
 * "double the change".
 */

/** Pro Management's monthly price, quoted wherever the free month is mentioned. */
export const PRO_MANAGEMENT_PENCE = 3_900

export type PackageSlug = 'starter' | 'advanced' | 'pro' | 'custom'

export type BuildPackage = {
  slug: PackageSlug
  /** A product name — identical in every language. */
  name: string
  /** Integer GBP pence. */
  pricePence: number
  /** True only where the price is a floor rather than the advertised figure. */
  variable?: boolean
  /** Renders the "most popular" marker. */
  popular?: boolean
  /**
   * Query-string value used by /contact?package=… to preselect this package.
   * Deliberately separate from `slug`, which is a live page anchor
   * (/web#pro) and must not change.
   */
  enquiryParam: string
  /** Whether the package bundles a complimentary month of Pro Management. */
  freeProMonth?: boolean
}

export const buildPackages: BuildPackage[] = [
  { slug: 'starter', name: 'Starter', pricePence: 24_900, enquiryParam: 'starter' },
  { slug: 'advanced', name: 'Advanced', pricePence: 29_900, popular: true, enquiryParam: 'advanced' },
  { slug: 'pro', name: 'Pro', pricePence: 38_900, freeProMonth: true, enquiryParam: 'pro' },
  { slug: 'custom', name: 'Custom', pricePence: 49_900, variable: true, freeProMonth: true, enquiryParam: 'custom' },
]

export type PlanSlug = 'pro-management' | 'ultimate-management'

export type ManagementPlan = {
  slug: PlanSlug
  /** A product name — identical in every language. */
  name: string
  /** Integer GBP pence, per month. */
  pricePence: number
  enquiryParam: string
}

export const managementPlans: ManagementPlan[] = [
  { slug: 'pro-management', name: 'Pro Management', pricePence: PRO_MANAGEMENT_PENCE, enquiryParam: 'pro-management' },
  { slug: 'ultimate-management', name: 'Ultimate Management', pricePence: 5_900, enquiryParam: 'ultimate-management' },
]

/**
 * Management beyond the two published plans — several sites, or a workload the
 * standard tiers cannot price. Quoted individually, so it is a floor and is
 * always written as "from".
 */
export const CUSTOM_MANAGEMENT_FROM_PENCE = 5_900
