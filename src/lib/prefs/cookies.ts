/**
 * Visitor preferences that must survive a refresh and a direct link.
 *
 * Both are read on the server so the first byte of HTML is already correct —
 * there is no client-side correction pass, and therefore no flash of the wrong
 * currency and no hydration mismatch.
 */
export const CURRENCY_COOKIE = 'nb_currency'
export const LOCALE_COOKIE = 'nb_locale'

/** A year. Long enough that a returning visitor keeps their choice. */
export const PREF_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const PREF_COOKIE_ATTRS = `Path=/; Max-Age=${PREF_COOKIE_MAX_AGE}; SameSite=Lax`
