/**
 * Supported locales.
 *
 * The URL prefix is the short code (`/fr/web`); the BCP-47 tag is what goes in
 * `<html lang>` and hreflang. English is the default and is served WITHOUT a
 * prefix, because /web, /about and the rest are already live, in the sitemap
 * and carrying canonical tags — moving them to /en/… would throw away every
 * existing URL for no gain.
 *
 * Names are written in their own language: someone looking for German is
 * looking for "Deutsch", not "German". No flags anywhere — a flag names a
 * country, and none of these languages belongs to one country.
 */
export const LOCALES = ['en', 'fr', 'de', 'es'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_META: Record<
  Locale,
  { tag: string; name: string; ogLocale: string }
> = {
  en: { tag: 'en-GB', name: 'English', ogLocale: 'en_GB' },
  fr: { tag: 'fr-FR', name: 'Français', ogLocale: 'fr_FR' },
  de: { tag: 'de-DE', name: 'Deutsch', ogLocale: 'de_DE' },
  es: { tag: 'es-ES', name: 'Español', ogLocale: 'es_ES' },
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/**
 * The public path for a route in a given locale.
 *
 * `/web` in English, `/fr/web` in French. Everything that builds a link,
 * canonical, hreflang or sitemap entry goes through here, so the default
 * locale's missing prefix is decided in exactly one place.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path
  return locale === DEFAULT_LOCALE ? clean || '/' : `/${locale}${clean}`
}

/** Splits a request path into its locale and the route beneath it. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, maybe, ...rest] = pathname.split('/')
  if (isLocale(maybe) && maybe !== DEFAULT_LOCALE) {
    return { locale: maybe, path: '/' + rest.join('/') }
  }
  return { locale: DEFAULT_LOCALE, path: pathname }
}
