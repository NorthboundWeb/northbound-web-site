import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES, isLocale } from '@/i18n/config'
import { LOCALE_COOKIE } from '@/lib/prefs/cookies'

/**
 * Locale routing.
 *
 * English is served from unprefixed URLs, so `/web` is REWRITTEN to the
 * internal `/en/web` — the visitor's URL never changes and every existing
 * link, canonical and sitemap entry keeps working. `/fr/web` and friends are
 * already in their final shape and pass straight through.
 *
 * A returning visitor who picked French and then types the bare `/web` is
 * REDIRECTED to `/fr/web` rather than rewritten, so the address bar tells the
 * truth about which language they are reading. Only their own stored choice
 * can trigger that — Accept-Language is deliberately not consulted, because a
 * browser's language header is a guess, and silently moving someone off the
 * URL they asked for on the strength of a guess is worse than showing English
 * with a visible way to change it.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const hasPrefix = LOCALES.some(
    (locale) =>
      locale !== DEFAULT_LOCALE &&
      (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
  )
  if (hasPrefix) return NextResponse.next()

  const stored = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(stored) && stored !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = `/${stored}${pathname === '/' ? '' : pathname}`
    url.search = search
    return NextResponse.redirect(url)
  }

  // Default locale: rewrite so the app sees a locale segment, while the
  // visitor keeps the unprefixed URL.
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  /**
   * Everything except Next's internals and the files served straight from
   * /public. Without the exclusions the rewrite would also catch CSS, JS and
   * the logo SVGs, and they would 404.
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|opengraph-image|robots.txt|sitemap.xml|northbound-lockup.svg|northbound-mark.svg).*)',
  ],
}
