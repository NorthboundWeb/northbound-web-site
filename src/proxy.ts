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
/**
 * Content Security Policy.
 *
 * Nonce-based rather than 'unsafe-inline': Next emits inline scripts for
 * hydration, and allowing all inline script would defeat the point of having a
 * policy at all. A fresh nonce per request means an injected script cannot
 * guess its way in.
 *
 * Deliberately narrow. There are no external script or style origins to allow:
 * next/font downloads and self-hosts the two typefaces at build time, so
 * nothing is fetched from Google at runtime, and the mountain artwork is inline
 * SVG rather than a remote image. The only third-party host the site talks to
 * is the exchange-rate API, and that request is made server-side, so it never
 * needs a connect-src entry.
 *
 * `style-src-attr 'unsafe-inline'` is the one concession: the honeypot field
 * carries an inline style so it stays hidden even if the stylesheet fails to
 * load, and a style attribute cannot execute script.
 *
 * 'unsafe-eval' is development-only — React uses eval to rebuild server error
 * stacks in the browser. Neither React nor Next needs it in production.
 */
function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development'
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    'upgrade-insecure-requests',
  ].join('; ')
}

/** Applies the CSP to a response, and forwards the nonce to the renderer. */
function withCsp(response: NextResponse, csp: string): NextResponse {
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = buildCsp(nonce)
  // The renderer reads the nonce from the request headers to stamp it onto
  // its own inline scripts and onto the JSON-LD block.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const hasPrefix = LOCALES.some(
    (locale) =>
      locale !== DEFAULT_LOCALE &&
      (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
  )
  if (hasPrefix) {
    return withCsp(NextResponse.next({ request: { headers: requestHeaders } }), csp)
  }

  const stored = request.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(stored) && stored !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = `/${stored}${pathname === '/' ? '' : pathname}`
    url.search = search
    return withCsp(NextResponse.redirect(url), csp)
  }

  // Default locale: rewrite so the app sees a locale segment, while the
  // visitor keeps the unprefixed URL.
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return withCsp(
    NextResponse.rewrite(url, { request: { headers: requestHeaders } }),
    csp
  )
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
