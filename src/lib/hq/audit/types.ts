export type CheckStatus = 'pass' | 'warn' | 'fail' | 'info'

export type CategoryId =
  | 'security'
  | 'seo'
  | 'performance'
  | 'mobile'
  | 'accessibility'
  | 'trust'

export type Check = {
  id: string
  category: CategoryId
  title: string
  status: CheckStatus
  /** Relative importance inside its category. Ignored for `info`. */
  weight: number
  /** What was actually observed, in plain English. */
  found: string
  /** Why a business owner should care. Only set when something is wrong. */
  why?: string
  /** What to do about it. Only set when something is wrong. */
  fix?: string
}

export type CategoryScore = {
  id: CategoryId
  label: string
  /** 0–100, or null when the category had nothing scoreable. */
  score: number | null
  pass: number
  warn: number
  fail: number
}

export type PageSpeed = {
  performanceScore: number | null
  lcpMs: number | null
  cls: number | null
  tbtMs: number | null
  fcpMs: number | null
}

export type AuditResult = {
  url: string
  finalUrl: string
  fetchedAt: string
  durationMs: number
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'E'
  categories: CategoryScore[]
  checks: Check[]
  pageSpeed: PageSpeed | null
  /** Things the audit could not do, so the report never overstates itself. */
  limitations: string[]
}

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  security: 'Security',
  seo: 'Search visibility',
  performance: 'Speed',
  mobile: 'Mobile',
  accessibility: 'Accessibility',
  trust: 'Trust and privacy',
}

/** How much each category counts towards the overall score. */
export const CATEGORY_WEIGHTS: Record<CategoryId, number> = {
  security: 20,
  seo: 25,
  performance: 20,
  mobile: 10,
  accessibility: 15,
  trust: 10,
}
