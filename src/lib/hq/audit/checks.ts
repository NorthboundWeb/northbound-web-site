import { FetchError, safeFetch, type FetchResult, type Fetcher } from './safe-fetch'
import { parseHtml, type ParsedPage } from './html'
import { fetchPageSpeed } from './psi'
import {
  CATEGORY_LABELS,
  CATEGORY_WEIGHTS,
  type AuditResult,
  type CategoryId,
  type CategoryScore,
  type Check,
  type CheckStatus,
  type PageSpeed,
} from './types'

/**
 * The site audit.
 *
 * Reads a site's homepage plus a handful of well-known files and a sample of
 * its own links, and turns what it finds into plain-English findings. It is a
 * first-look health check, not a full audit, and every limit of that is
 * recorded in `limitations` so the report never claims more than it measured.
 */

export class AuditFailure extends Error {
  code: string
  constructor(message: string, code: string) {
    super(message)
    this.name = 'AuditFailure'
    this.code = code
  }
}

const TLS_ERRORS = new Set([
  'CERT_HAS_EXPIRED',
  'DEPTH_ZERO_SELF_SIGNED_CERT',
  'SELF_SIGNED_CERT_IN_CHAIN',
  'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
  'ERR_TLS_CERT_ALTNAME_INVALID',
  'CERT_NOT_YET_VALID',
])

export function describeFailure(error: unknown): AuditFailure {
  const code = error instanceof FetchError ? error.code : 'EUNKNOWN'
  if (error instanceof AuditFailure) return error
  if (code === 'EBLOCKED') {
    return new AuditFailure(
      error instanceof Error ? error.message : 'That address cannot be checked.',
      code
    )
  }
  if (TLS_ERRORS.has(code)) {
    return new AuditFailure(
      'The site\'s security certificate is not valid (it may be expired, self-signed or issued for a different name). Visitors will see a browser warning. That is itself the headline finding for this site.',
      code
    )
  }
  if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
    return new AuditFailure('That domain does not resolve. Check the spelling.', code)
  }
  if (code === 'ECONNREFUSED' || code === 'ECONNRESET') {
    return new AuditFailure('The site refused the connection.', code)
  }
  if (code === 'ETIMEDOUT') {
    return new AuditFailure('The site took too long to respond.', code)
  }
  return new AuditFailure('The site could not be checked. Try again in a moment.', code)
}

/** Accepts "example.com", "www.example.com/page" or a full URL. */
export function normaliseUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) throw new AuditFailure('Enter a website address.', 'EINPUT')
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  let url: URL
  try {
    url = new URL(withScheme)
  } catch {
    throw new AuditFailure('That does not look like a web address.', 'EINPUT')
  }
  url.hash = ''
  return url.href
}

const SECOND_LEVEL = new Set(['co', 'org', 'gov', 'ac', 'com', 'net', 'ltd', 'plc', 'me'])

/** Good-enough "same site" key: example.co.uk, not www.example.co.uk. */
export function registrableDomain(hostname: string): string {
  const labels = hostname.toLowerCase().replace(/^\[|\]$/g, '').split('.')
  if (labels.length <= 2) return labels.join('.')
  const tld = labels[labels.length - 1]
  const second = labels[labels.length - 2]
  const keep = tld.length === 2 && SECOND_LEVEL.has(second) ? 3 : 2
  return labels.slice(-keep).join('.')
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next
      next += 1
      results[index] = await worker(items[index])
    }
  })
  await Promise.all(runners)
  return results
}

type Options = {
  fetcher?: Fetcher
  /** Ask PageSpeed Insights for lab measurements. Slower, soft-failing. */
  pageSpeed?: boolean
  /** Injected for tests. */
  pageSpeedFetcher?: (url: string) => Promise<PageSpeed | null>
  now?: () => Date
}

const GENERIC_LINK_TEXT = new Set([
  'click here',
  'here',
  'read more',
  'more',
  'learn more',
  'link',
  'this',
  'click',
])

const TRACKERS: Array<[RegExp, string]> = [
  [/googletagmanager\.com|google-analytics\.com|gtag\(/i, 'Google Analytics / Tag Manager'],
  [/connect\.facebook\.net|fbq\(/i, 'Meta (Facebook) Pixel'],
  [/static\.hotjar\.com/i, 'Hotjar'],
  [/clarity\.ms/i, 'Microsoft Clarity'],
  [/snap\.licdn\.com/i, 'LinkedIn Insight Tag'],
]

function isHtml(result: FetchResult): boolean {
  return (result.headers['content-type'] ?? '').toLowerCase().includes('html')
}

function pluralise(count: number, one: string, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`
}

/** "1 image has" / "5 images have": the verb agrees with the count. */
function counted(count: number, one: string, singularVerb: string, pluralVerb: string) {
  return `${pluralise(count, one)} ${count === 1 ? singularVerb : pluralVerb}`
}

export async function runAudit(input: string, options: Options = {}): Promise<AuditResult> {
  const fetcher = options.fetcher ?? safeFetch
  const now = options.now ?? (() => new Date())
  const started = Date.now()
  const url = normaliseUrl(input)

  let home: FetchResult
  try {
    home = await fetcher(url)
  } catch (error) {
    throw describeFailure(error)
  }

  if (home.status >= 400) {
    throw new AuditFailure(
      `The site answered with an error (HTTP ${home.status}) instead of a page.`,
      'EHTTP'
    )
  }
  if (!isHtml(home)) {
    throw new AuditFailure('That address did not return a web page.', 'ENOTHTML')
  }

  const final = new URL(home.url)
  const origin = final.origin
  const page = parseHtml(home.body)
  const limitations: string[] = [
    'Checks the homepage and a sample of up to 12 of its own links. Other pages were not reviewed.',
    'This is an automated first look, not a full audit. It reports what is visible from outside and cannot judge design, copy or how well the site converts.',
  ]
  if (home.truncated) {
    limitations.push('The homepage was very large, so only the first 2 MB was read.')
  }

  // Everything below is independent of everything else, so run it together.
  const wantsPageSpeed = options.pageSpeed === true
  const psiPromise = wantsPageSpeed
    ? (options.pageSpeedFetcher ?? fetchPageSpeed)(home.url)
    : Promise.resolve<PageSpeed | null>(null)

  const [httpProbe, robots, notFound, favicon, links, psi] = await Promise.all([
    final.protocol === 'https:'
      ? fetcher(`http://${final.hostname}/`, { followRedirects: false, maxBytes: 2048, timeoutMs: 8_000 }).catch(
          () => null
        )
      : Promise.resolve(null),
    fetcher(`${origin}/robots.txt`, { maxBytes: 100_000, timeoutMs: 8_000 }).catch(() => null),
    fetcher(`${origin}/northbound-check-${Math.random().toString(36).slice(2, 10)}`, {
      maxBytes: 2048,
      timeoutMs: 8_000,
    }).catch(() => null),
    page.hasIconLink
      ? Promise.resolve(null)
      : fetcher(`${origin}/favicon.ico`, { method: 'HEAD', timeoutMs: 6_000 }).catch(() => null),
    checkLinks(page, final, fetcher),
    psiPromise,
  ])

  // The sitemap location comes from robots.txt when it says, else the default.
  const sitemapFromRobots = robots?.status === 200
    ? robots.body.match(/^\s*sitemap:\s*(\S+)/im)?.[1]
    : undefined
  const sitemap = await fetcher(sitemapFromRobots ?? `${origin}/sitemap.xml`, {
    maxBytes: 200_000,
    timeoutMs: 8_000,
  }).catch(() => null)

  const checks: Check[] = []
  const add = (
    category: CategoryId,
    id: string,
    title: string,
    status: CheckStatus,
    weight: number,
    found: string,
    problem?: { why: string; fix: string }
  ) => {
    checks.push({
      id,
      category,
      title,
      status,
      weight,
      found,
      ...(status === 'warn' || status === 'fail' ? problem : {}),
    })
  }
  const h = home.headers

  // ---- Security -----------------------------------------------------------
  const isHttps = final.protocol === 'https:'
  add(
    'security',
    'https',
    'Served over HTTPS',
    isHttps ? 'pass' : 'fail',
    5,
    isHttps ? 'The site loads over a secure connection.' : 'The site loads over plain HTTP.',
    {
      why: 'Browsers label HTTP sites "Not secure", visitors lose trust, and anything typed into a form can be read in transit.',
      fix: 'Install an SSL certificate (free from Let\'s Encrypt or included with most hosts) and serve the whole site over HTTPS.',
    }
  )

  if (isHttps && httpProbe) {
    const redirectsToHttps =
      httpProbe.status >= 300 &&
      httpProbe.status < 400 &&
      (httpProbe.headers.location ?? '').toLowerCase().startsWith('https://')
    add(
      'security',
      'http-redirect',
      'Insecure address redirects to HTTPS',
      redirectsToHttps ? 'pass' : httpProbe.status === 200 ? 'fail' : 'warn',
      2,
      redirectsToHttps
        ? 'Visiting the http:// address sends people to the secure version.'
        : httpProbe.status === 200
          ? 'The http:// address serves the site directly without redirecting.'
          : `The http:// address answered with HTTP ${httpProbe.status} and no redirect to HTTPS.`,
      {
        why: 'Anyone who types the address without https:// can end up on an unprotected copy of the site.',
        fix: 'Add a permanent (301) redirect from http:// to https:// in your host or DNS settings.',
      }
    )
  }

  if (isHttps) {
    add(
      'security',
      'hsts',
      'HSTS header',
      h['strict-transport-security'] ? 'pass' : 'warn',
      2,
      h['strict-transport-security']
        ? 'The site tells browsers to always use HTTPS.'
        : 'No Strict-Transport-Security header.',
      {
        why: 'Without it, a browser can be tricked into using the insecure version on a hostile network.',
        fix: 'Send a Strict-Transport-Security header once HTTPS is working everywhere (your host usually has a setting for this).',
      }
    )
  }

  add(
    'security',
    'csp',
    'Content Security Policy',
    h['content-security-policy'] ? 'pass' : 'warn',
    1,
    h['content-security-policy']
      ? 'A Content Security Policy is set.'
      : 'No Content Security Policy header.',
    {
      why: 'A policy limits what scripts can run on the page, which blunts the damage from an injected script.',
      fix: 'Add a Content-Security-Policy header listing the sources the site genuinely needs.',
    }
  )

  const nosniff = (h['x-content-type-options'] ?? '').toLowerCase().includes('nosniff')
  add(
    'security',
    'nosniff',
    'Content-type sniffing blocked',
    nosniff ? 'pass' : 'warn',
    1,
    nosniff ? 'X-Content-Type-Options is set to nosniff.' : 'X-Content-Type-Options is missing.',
    {
      why: 'Browsers may otherwise guess a file\'s type and run content that was only meant to be displayed.',
      fix: 'Send the header X-Content-Type-Options: nosniff.',
    }
  )

  const framed =
    Boolean(h['x-frame-options']) ||
    /frame-ancestors/i.test(h['content-security-policy'] ?? '')
  add(
    'security',
    'framing',
    'Protected from clickjacking',
    framed ? 'pass' : 'warn',
    1,
    framed
      ? 'The site controls whether other sites can embed it in a frame.'
      : 'Other sites can embed this one in a frame.',
    {
      why: 'A hostile page could load the site invisibly and trick visitors into clicking on it.',
      fix: 'Send X-Frame-Options: DENY (or SAMEORIGIN), or a frame-ancestors rule in the Content Security Policy.',
    }
  )

  add(
    'security',
    'referrer',
    'Referrer policy',
    h['referrer-policy'] ? 'pass' : 'warn',
    0.5,
    h['referrer-policy'] ? 'A Referrer-Policy is set.' : 'No Referrer-Policy header.',
    {
      why: 'Without one, full page addresses (which can contain private details) may be passed to other sites.',
      fix: 'Send Referrer-Policy: strict-origin-when-cross-origin.',
    }
  )

  if (isHttps) {
    const mixed = page.insecureResources
    add(
      'security',
      'mixed-content',
      'No insecure resources on a secure page',
      mixed.length === 0 ? 'pass' : 'fail',
      3,
      mixed.length === 0
        ? 'Everything the page loads uses HTTPS.'
        : `${counted(mixed.length, 'resource', 'loads', 'load')} over plain HTTP, for example ${mixed[0]}.`,
      {
        why: 'Browsers block or flag insecure files on secure pages, which can break images or scripts and shows a warning.',
        fix: 'Change those http:// links to https:// (or to relative links).',
      }
    )
  }

  const leaks = [h['x-powered-by'], /\d/.test(h.server ?? '') ? h.server : undefined].filter(
    (v): v is string => Boolean(v)
  )
  add(
    'security',
    'software-leak',
    'Server software not advertised',
    leaks.length === 0 ? 'pass' : 'warn',
    0.5,
    leaks.length === 0
      ? 'The site does not advertise its software versions.'
      : `The site announces its software (${leaks.join(', ')}).`,
    {
      why: 'Published version numbers help attackers pick out known weaknesses.',
      fix: 'Remove or hide the X-Powered-By and Server version headers in the server configuration.',
    }
  )

  // ---- Search visibility --------------------------------------------------
  const title = page.title
  const titleLength = title?.length ?? 0
  add(
    'seo',
    'title',
    'Page title',
    !title ? 'fail' : titleLength >= 15 && titleLength <= 65 ? 'pass' : 'warn',
    4,
    !title
      ? 'The homepage has no title.'
      : `The title is "${title}" (${titleLength} characters).`,
    {
      why: 'The title is the clickable headline in Google results and the biggest single on-page ranking signal.',
      fix: !title
        ? 'Add a <title> that says what the business does and where, in roughly 15 to 65 characters.'
        : 'Aim for roughly 15 to 65 characters so it is neither vague nor cut off in results.',
    }
  )

  const description = page.metas.description?.trim() ?? ''
  add(
    'seo',
    'description',
    'Meta description',
    !description ? 'fail' : description.length >= 70 && description.length <= 170 ? 'pass' : 'warn',
    3,
    !description
      ? 'There is no meta description.'
      : `The description is ${description.length} characters long.`,
    {
      why: 'It is the summary shown under your title in Google. A missing one leaves Google to guess, usually badly.',
      fix: 'Write a one or two sentence summary of 70 to 170 characters that makes someone want to click.',
    }
  )

  add(
    'seo',
    'h1',
    'One main heading',
    page.h1s.length === 1 ? 'pass' : page.h1s.length === 0 ? 'fail' : 'warn',
    3,
    page.h1s.length === 1
      ? `The main heading is "${page.h1s[0].slice(0, 80)}".`
      : page.h1s.length === 0
        ? 'The homepage has no main (H1) heading.'
        : `The homepage has ${page.h1s.length} main headings.`,
    {
      why: 'The H1 tells visitors and search engines what the page is about. Having none, or several competing, muddies that.',
      fix: 'Give the page exactly one H1 that states what the business does.',
    }
  )

  add(
    'seo',
    'canonical',
    'Canonical address',
    page.canonical ? 'pass' : 'warn',
    1.5,
    page.canonical ? 'A canonical address is declared.' : 'No canonical link is set.',
    {
      why: 'Without one, the same page reachable at several addresses (with and without www, with tracking codes) can split its ranking.',
      fix: 'Add <link rel="canonical"> pointing at the preferred address of each page.',
    }
  )

  const noindex =
    /noindex/i.test(page.metas.robots ?? '') || /noindex/i.test(h['x-robots-tag'] ?? '')
  add(
    'seo',
    'indexable',
    'Open to search engines',
    noindex ? 'fail' : 'pass',
    6,
    noindex
      ? 'The page tells search engines not to list it.'
      : 'Nothing is blocking search engines from listing the page.',
    {
      why: 'A noindex instruction keeps the site out of Google entirely. It is often left over from when the site was being built.',
      fix: 'Remove the noindex robots meta tag or X-Robots-Tag header, then ask Google to re-crawl the site.',
    }
  )

  const robotsOk = robots?.status === 200
  const blanketBlock =
    robotsOk && /user-agent:\s*\*[\s\S]*?disallow:\s*\/\s*$/im.test(robots?.body ?? '')
  add(
    'seo',
    'robots',
    'robots.txt',
    blanketBlock ? 'fail' : robotsOk ? 'pass' : 'warn',
    blanketBlock ? 6 : 1,
    blanketBlock
      ? 'robots.txt tells all search engines to stay away from the whole site.'
      : robotsOk
        ? 'A robots.txt file is in place.'
        : 'There is no robots.txt file.',
    {
      why: blanketBlock
        ? 'This blocks every search engine from the entire site.'
        : 'It is the first file search engines ask for, and it is where your sitemap is usually announced.',
      fix: blanketBlock
        ? 'Remove the "Disallow: /" rule for all user agents.'
        : 'Add a simple robots.txt that allows crawling and points to your sitemap.',
    }
  )

  const sitemapOk =
    sitemap?.status === 200 && /<(urlset|sitemapindex)\b/i.test(sitemap.body)
  add(
    'seo',
    'sitemap',
    'XML sitemap',
    sitemapOk ? 'pass' : 'warn',
    2,
    sitemapOk ? 'An XML sitemap was found.' : 'No XML sitemap was found.',
    {
      why: 'A sitemap helps Google find and re-check every page, which matters most for newer or smaller sites.',
      fix: 'Publish /sitemap.xml (most website builders can generate it) and list it in robots.txt.',
    }
  )

  const ogTitle = Boolean(page.metas['og:title'])
  const ogImage = Boolean(page.metas['og:image'])
  add(
    'seo',
    'social-preview',
    'Link preview for social sharing',
    ogTitle && ogImage ? 'pass' : 'warn',
    1.5,
    ogTitle && ogImage
      ? 'Sharing the site shows a title and image.'
      : `Sharing the link will look bare (${[!ogTitle && 'no og:title', !ogImage && 'no og:image']
          .filter(Boolean)
          .join(', ')}).`,
    {
      why: 'When the site is shared on Facebook, WhatsApp or LinkedIn, a missing preview image makes the link look untrustworthy and gets fewer clicks.',
      fix: 'Add Open Graph tags (og:title, og:description, og:image) with a 1200x630 image.',
    }
  )

  add(
    'seo',
    'structured-data',
    'Structured data',
    page.jsonLd.length > 0 ? 'pass' : 'warn',
    1,
    page.jsonLd.length > 0
      ? 'The page includes structured data for search engines.'
      : 'No structured data (schema.org) was found.',
    {
      why: 'It lets Google show richer results such as opening hours, reviews and address for a local business.',
      fix: 'Add LocalBusiness schema in JSON-LD with the name, address, phone and opening hours.',
    }
  )

  const faviconFound = page.hasIconLink || favicon?.status === 200
  add(
    'seo',
    'favicon',
    'Favicon',
    faviconFound ? 'pass' : 'warn',
    0.5,
    faviconFound ? 'The site has a favicon.' : 'No favicon was found.',
    {
      why: 'The small icon appears in browser tabs, bookmarks and some search results. Without it the site looks unfinished.',
      fix: 'Add a favicon and link it in the page head.',
    }
  )

  const softNotFound = notFound?.status === 200
  if (notFound) {
    add(
      'seo',
      'not-found',
      'Missing pages return "not found"',
      softNotFound ? 'warn' : notFound.status === 404 || notFound.status === 410 ? 'pass' : 'info',
      1,
      softNotFound
        ? 'A page that does not exist loads normally instead of reporting an error.'
        : notFound.status === 404 || notFound.status === 410
          ? 'Pages that do not exist correctly return a 404.'
          : `A page that does not exist answered with HTTP ${notFound.status}.`,
      {
        why: 'When missing pages look successful, Google can index junk addresses and the site gets harder to maintain.',
        fix: 'Make sure unknown addresses return a proper 404 status along with a helpful message.',
      }
    )
  }

  const textLength = page.text.length
  add(
    'seo',
    'content',
    'Readable content on the page',
    textLength >= 300 ? 'pass' : 'warn',
    1.5,
    textLength >= 300
      ? `The homepage has about ${Math.round(textLength / 6)} words of readable text.`
      : 'The homepage has very little readable text.',
    {
      why: 'Search engines rank pages on the words they can read. Very little text, or text that only appears through scripts, gives them little to go on.',
      fix: 'Describe what the business does, where and for whom in real text on the page, not only in images or sliders.',
    }
  )

  if (links.sampled > 0) {
    add(
      'seo',
      'broken-links',
      'No broken internal links',
      links.broken.length === 0 ? 'pass' : 'fail',
      3,
      links.broken.length === 0
        ? `Checked ${pluralise(links.sampled, 'internal link')}, and all worked.`
        : `${links.broken.length} of ${links.sampled} sampled internal links are broken, for example ${links.broken[0].href} (${links.broken[0].reason}).`,
      {
        why: 'Dead links frustrate visitors and tell Google the site is not looked after.',
        fix: 'Update or remove the broken links, or redirect the old addresses to the right pages.',
      }
    )
  }

  // ---- Speed --------------------------------------------------------------
  add(
    'performance',
    'response-time',
    'Server response time',
    home.timeMs < 1_000 ? 'pass' : home.timeMs < 2_500 ? 'warn' : 'fail',
    4,
    `The homepage arrived in ${(home.timeMs / 1000).toFixed(1)} seconds (measured from our server).`,
    {
      why: 'Slow first responses delay everything that follows, and visitors leave slow sites.',
      fix: 'Look at hosting quality, caching and heavy plugins or database queries that run on every page load.',
    }
  )

  add(
    'performance',
    'html-size',
    'Page document size',
    home.bodyBytes < 200_000 ? 'pass' : home.bodyBytes < 600_000 ? 'warn' : 'fail',
    1.5,
    `The page document is ${(home.bodyBytes / 1024).toFixed(0)} KB before images and scripts.`,
    {
      why: 'A very large page document is slow to download and to process, particularly on mobile data.',
      fix: 'Trim inline styles and scripts, and avoid loading content that is not needed on first view.',
    }
  )

  const encoding = (h['content-encoding'] ?? '').toLowerCase()
  const compressed = ['gzip', 'br', 'deflate', 'zstd'].some((e) => encoding.includes(e))
  if (home.bodyBytes > 5_000) {
    add(
      'performance',
      'compression',
      'Compression enabled',
      compressed ? 'pass' : 'warn',
      2,
      compressed ? `The page is compressed (${encoding}).` : 'The page is sent uncompressed.',
      {
        why: 'Compression typically cuts the size of the page by around two thirds, speeding up every visit.',
        fix: 'Enable gzip or Brotli compression in the hosting or server settings.',
      }
    )
  }

  const blocking = page.scripts.filter(
    (s) => s.inHead && s.src && !s.async && !s.defer && !s.module
  )
  add(
    'performance',
    'blocking-scripts',
    'Scripts that hold up the page',
    blocking.length === 0 ? 'pass' : blocking.length <= 2 ? 'warn' : 'fail',
    2.5,
    blocking.length === 0
      ? 'No scripts block the page from appearing.'
      : `${counted(blocking.length, 'script', 'in the page head must', 'in the page head must')} finish before anything shows.`,
    {
      why: 'Blocking scripts leave visitors looking at a blank screen while they download.',
      fix: 'Add defer or async to non-critical scripts, or move them to the end of the page.',
    }
  )

  const unsized = page.images.filter((i) => !i.width && !i.height && i.src).length
  add(
    'performance',
    'image-sizes',
    'Images reserve their space',
    unsized <= 3 ? 'pass' : 'warn',
    1,
    unsized === 0
      ? 'Images declare their dimensions.'
      : `${counted(unsized, 'image', 'does', 'do')} not declare a width and height.`,
    {
      why: 'Without dimensions, the page jumps around as images load, which is frustrating and counts against you in Google\'s page experience measures.',
      fix: 'Set width and height on every image (or an aspect ratio in CSS).',
    }
  )

  const belowFold = page.images.slice(2).filter((i) => i.loading !== 'lazy' && i.src)
  add(
    'performance',
    'lazy-images',
    'Images load only when needed',
    belowFold.length <= 5 ? 'pass' : 'warn',
    1,
    belowFold.length <= 5
      ? 'Images further down the page are not all loaded up front.'
      : `${belowFold.length} images further down the page all load immediately.`,
    {
      why: 'Loading every image up front slows the first view, especially on phones.',
      fix: 'Add loading="lazy" to images below the first screen.',
    }
  )

  const siteDomain = registrableDomain(final.hostname)
  const thirdPartyHosts = new Set<string>()
  for (const script of page.scripts) {
    if (!script.src) continue
    try {
      const host = new URL(script.src, final).hostname
      if (registrableDomain(host) !== siteDomain) thirdPartyHosts.add(registrableDomain(host))
    } catch {
      /* unparseable src: ignore */
    }
  }
  add(
    'performance',
    'third-party',
    'Third-party scripts',
    thirdPartyHosts.size <= 3 ? 'pass' : thirdPartyHosts.size <= 8 ? 'warn' : 'fail',
    1.5,
    thirdPartyHosts.size === 0
      ? 'The page loads no scripts from other companies.'
      : `Scripts load from ${pluralise(thirdPartyHosts.size, 'other domain')}.`,
    {
      why: 'Each outside script adds delay and a dependency you do not control, and many track visitors.',
      fix: 'Remove tools that are no longer used and load the rest after the page has appeared.',
    }
  )

  if (psi) {
    if (psi.performanceScore !== null) {
      add(
        'performance',
        'psi-score',
        'Google PageSpeed score (mobile)',
        psi.performanceScore >= 90 ? 'pass' : psi.performanceScore >= 50 ? 'warn' : 'fail',
        6,
        `Google\'s lab test scored the site ${psi.performanceScore} out of 100 on a simulated mid-range phone.`,
        {
          why: 'Most visitors arrive on phones, and slow sites lose them before the page has even shown.',
          fix: 'Start with the largest images and the scripts that load first.',
        }
      )
    }
    if (psi.lcpMs !== null) {
      add(
        'performance',
        'psi-lcp',
        'Time until the main content appears',
        psi.lcpMs <= 2_500 ? 'pass' : psi.lcpMs <= 4_000 ? 'warn' : 'fail',
        4,
        `The main content took ${(psi.lcpMs / 1000).toFixed(1)} seconds to appear on a simulated phone (Google recommends 2.5 seconds or less).`,
        {
          why: 'This is one of Google\'s Core Web Vitals and feeds into how the site ranks.',
          fix: 'Compress and properly size the main image, and avoid delaying it behind scripts.',
        }
      )
    }
    if (psi.cls !== null) {
      add(
        'performance',
        'psi-cls',
        'Layout stability',
        psi.cls <= 0.1 ? 'pass' : psi.cls <= 0.25 ? 'warn' : 'fail',
        3,
        `The page shifted by ${psi.cls.toFixed(2)} while loading (Google recommends 0.1 or less).`,
        {
          why: 'Content that jumps as it loads makes people tap the wrong thing, and is another Core Web Vital.',
          fix: 'Reserve space for images, adverts and embedded content before they load.',
        }
      )
    }
    if (psi.tbtMs !== null) {
      add(
        'performance',
        'psi-tbt',
        'Responsiveness while loading',
        psi.tbtMs <= 200 ? 'pass' : psi.tbtMs <= 600 ? 'warn' : 'fail',
        2,
        `The page was unresponsive for about ${Math.round(psi.tbtMs)} ms while loading.`,
        {
          why: 'Heavy scripts make the page feel frozen when people first try to use it.',
          fix: 'Remove or delay heavy scripts and split large bundles.',
        }
      )
    }
  } else if (wantsPageSpeed) {
    limitations.push(
      'Google PageSpeed measurements were unavailable for this run, so real-world loading figures are not included.'
    )
  } else {
    limitations.push(
      'Speed is judged from the page itself, measured from our server. Real-world loading figures from Google PageSpeed were not requested.'
    )
  }

  // ---- Mobile -------------------------------------------------------------
  const viewport = page.metas.viewport ?? ''
  add(
    'mobile',
    'viewport',
    'Set up for phones',
    !viewport ? 'fail' : /width\s*=\s*device-width/i.test(viewport) ? 'pass' : 'warn',
    5,
    !viewport
      ? 'The page has no viewport setting, so phones show a shrunken desktop page.'
      : /width\s*=\s*device-width/i.test(viewport)
        ? 'The page tells phones to use their own screen width.'
        : `The viewport setting (${viewport}) does not use the device width.`,
    {
      why: 'Without it, phones show a tiny zoomed-out copy of the desktop site. Over half of web visits are on phones.',
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> and make sure the layout is responsive.',
    }
  )

  const phoneInText = /(?:\+44\s?\d|0\d{2,4})[\s\d]{7,12}/.test(page.text)
  const telLink = page.anchors.some((a) => a.href.toLowerCase().startsWith('tel:'))
  if (telLink || phoneInText) {
    add(
      'mobile',
      'tap-to-call',
      'Phone number is tappable',
      telLink ? 'pass' : 'warn',
      2,
      telLink
        ? 'A tap-to-call phone link is present.'
        : 'A phone number is shown, but it is not a tap-to-call link.',
      {
        why: 'On a phone, people expect to tap a number to call. Making them copy it loses enquiries.',
        fix: 'Wrap the number in a tel: link, for example <a href="tel:+441234567890">.',
      }
    )
  }

  // ---- Accessibility ------------------------------------------------------
  add(
    'accessibility',
    'lang',
    'Page language declared',
    page.lang ? 'pass' : 'warn',
    2,
    page.lang ? `The page declares its language (${page.lang}).` : 'The page does not declare its language.',
    {
      why: 'Screen readers use it to choose the right pronunciation, and browsers use it to offer translation.',
      fix: 'Add lang="en-GB" to the <html> tag.',
    }
  )

  const imagesNoAlt = page.images.filter((i) => i.alt === null && i.src).length
  add(
    'accessibility',
    'image-alt',
    'Images have descriptions',
    imagesNoAlt === 0 ? 'pass' : imagesNoAlt <= 3 ? 'warn' : 'fail',
    3,
    imagesNoAlt === 0
      ? 'Every image has alternative text.'
      : `${counted(imagesNoAlt, 'image', 'has', 'have')} no alternative text.`,
    {
      why: 'Blind and partially sighted visitors rely on it, it is expected under UK accessibility law for many organisations, and Google uses it to understand images.',
      fix: 'Add a short description to each meaningful image (alt=""), and an empty alt on purely decorative ones.',
    }
  )

  if (page.forms > 0 || page.unlabelledInputs > 0) {
    add(
      'accessibility',
      'form-labels',
      'Form fields are labelled',
      page.unlabelledInputs === 0 ? 'pass' : 'fail',
      3,
      page.unlabelledInputs === 0
        ? 'Every form field has a label.'
        : `${counted(page.unlabelledInputs, 'form field', 'has', 'have')} no label.`,
      {
        why: 'Without labels, screen readers cannot say what a field is for, and people tapping a label cannot focus its field.',
        fix: 'Give every field a visible <label> connected to it.',
      }
    )
  }

  let headingJumps = 0
  for (let i = 1; i < page.headingLevels.length; i += 1) {
    if (page.headingLevels[i] - page.headingLevels[i - 1] > 1) headingJumps += 1
  }
  add(
    'accessibility',
    'heading-order',
    'Headings in a sensible order',
    headingJumps === 0 ? 'pass' : 'warn',
    1,
    headingJumps === 0
      ? 'Headings follow a logical order.'
      : `Headings skip levels in ${pluralise(headingJumps, 'place')}.`,
    {
      why: 'Screen reader users navigate by headings, and skipped levels make the page structure confusing.',
      fix: 'Use heading levels in order (H1, then H2, then H3) and style them with CSS instead of picking a level for its size.',
    }
  )

  const unnamedLinks = page.anchors.filter((a) => !a.text.trim()).length
  const genericLinks = page.anchors.filter((a) =>
    GENERIC_LINK_TEXT.has(a.text.trim().toLowerCase())
  ).length
  add(
    'accessibility',
    'link-text',
    'Links say where they go',
    unnamedLinks === 0 && genericLinks < 3 ? 'pass' : 'warn',
    1.5,
    unnamedLinks === 0 && genericLinks < 3
      ? 'Link text is descriptive.'
      : [
          unnamedLinks > 0 && `${counted(unnamedLinks, 'link', 'has', 'have')} no text at all`,
          genericLinks >= 3 && `${pluralise(genericLinks, 'link')} just say "click here" or "read more"`,
        ]
          .filter(Boolean)
          .join(', ') + '.',
    {
      why: 'People using screen readers often jump from link to link out of context, where "read more" means nothing. It also wastes a chance to use keywords.',
      fix: 'Make link text describe the destination, and give icon-only links an aria-label.',
    }
  )

  const zoomBlocked =
    /user-scalable\s*=\s*(no|0)/i.test(viewport) ||
    /maximum-scale\s*=\s*(1(\.0)?)(?!\d)/i.test(viewport)
  if (viewport) {
    add(
      'accessibility',
      'zoom',
      'Visitors can zoom',
      zoomBlocked ? 'fail' : 'pass',
      2,
      zoomBlocked ? 'The page stops visitors zooming in.' : 'Visitors can zoom the page.',
      {
        why: 'People with low vision depend on pinch-zoom. Blocking it fails basic accessibility standards.',
        fix: 'Remove user-scalable=no and any maximum-scale below 5 from the viewport setting.',
      }
    )
  }

  // ---- Trust and privacy --------------------------------------------------
  const privacyLink = page.anchors.some((a) => /privacy/i.test(`${a.text} ${a.href}`))
  add(
    'trust',
    'privacy-policy',
    'Privacy policy',
    privacyLink ? 'pass' : 'warn',
    3,
    privacyLink ? 'A privacy policy is linked from the homepage.' : 'No link to a privacy policy was found.',
    {
      why: 'UK GDPR expects sites that collect personal details, including through a contact form or analytics, to explain what they do with them. This is an observation, not legal advice.',
      fix: 'Publish a privacy policy that matches what the site really collects, and link it in the footer.',
    }
  )

  const rawBody = home.body
  const trackers = TRACKERS.filter(([pattern]) => pattern.test(rawBody)).map(([, name]) => name)
  const cookieMention =
    /cookie/i.test(page.text) || page.anchors.some((a) => /cookie/i.test(`${a.text} ${a.href}`))
  if (trackers.length > 0) {
    add(
      'trust',
      'cookie-notice',
      'Tracking and cookie notice',
      cookieMention ? 'pass' : 'warn',
      2,
      cookieMention
        ? `Tracking tools were found (${trackers.join(', ')}) and the page mentions cookies. Whether consent is requested before tracking starts could not be verified.`
        : `Tracking tools were found (${trackers.join(', ')}) but no cookie notice or cookie policy is visible.`,
      {
        why: 'In the UK, most tracking cookies need consent before they are set. This is an observation, not legal advice.',
        fix: 'Add a cookie notice that lets visitors decline, and only load the tracking tools after they agree.',
      }
    )
  }

  const hasContact =
    page.anchors.some((a) => /^(mailto:|tel:)/i.test(a.href)) ||
    page.forms > 0 ||
    phoneInText ||
    /[\w.+-]+@[\w-]+\.[\w.-]+/.test(page.text)
  add(
    'trust',
    'contact',
    'Easy to get in touch',
    hasContact ? 'pass' : 'warn',
    3,
    hasContact
      ? 'The homepage offers a way to contact the business.'
      : 'No phone number, email address or contact form is visible on the homepage.',
    {
      why: 'If a visitor cannot see how to reach you within a few seconds, many will simply leave.',
      fix: 'Put a phone number, email address or enquiry button in the header and footer of every page.',
    }
  )

  const categories = scoreCategories(checks)
  const score = overallScore(categories)

  return {
    url,
    finalUrl: home.url,
    fetchedAt: now().toISOString(),
    durationMs: Date.now() - started,
    score,
    grade: gradeFor(score),
    categories,
    checks,
    pageSpeed: psi,
    limitations,
  }
}

type LinkSample = { sampled: number; broken: Array<{ href: string; reason: string }> }

async function checkLinks(
  page: ParsedPage,
  base: URL,
  fetcher: Fetcher
): Promise<LinkSample> {
  const siteDomain = registrableDomain(base.hostname)
  const seen = new Set<string>()
  const candidates: string[] = []

  for (const anchor of page.anchors) {
    const href = anchor.href.trim()
    if (!href || /^(#|mailto:|tel:|javascript:|sms:|data:)/i.test(href)) continue
    let target: URL
    try {
      target = new URL(href, base)
    } catch {
      continue
    }
    if (target.protocol !== 'http:' && target.protocol !== 'https:') continue
    if (registrableDomain(target.hostname) !== siteDomain) continue
    if (/logout|signout|log-out/i.test(target.pathname)) continue
    target.hash = ''
    if (target.href === base.href || seen.has(target.href)) continue
    seen.add(target.href)
    candidates.push(target.href)
  }

  // Spread the sample across the page instead of taking only the header menu.
  const LIMIT = 12
  const step = Math.max(1, candidates.length / LIMIT)
  const sample: string[] = []
  for (let i = 0; i < candidates.length && sample.length < LIMIT; i += step) {
    sample.push(candidates[Math.floor(i)])
  }

  const outcomes = await mapLimit(sample, 4, async (href) => {
    try {
      let response = await fetcher(href, { method: 'HEAD', timeoutMs: 8_000 })
      if ([403, 405, 501].includes(response.status)) {
        response = await fetcher(href, { maxBytes: 4_096, timeoutMs: 8_000 })
      }
      if (response.status === 404 || response.status === 410 || response.status >= 500) {
        return { href, reason: `HTTP ${response.status}` }
      }
      return null
    } catch (error) {
      const code = error instanceof FetchError ? error.code : ''
      if (code === 'ENOTFOUND') return { href, reason: 'domain not found' }
      return null // A flaky fetch is not evidence of a broken link.
    }
  })

  return {
    sampled: sample.length,
    broken: outcomes.filter((o): o is { href: string; reason: string } => o !== null),
  }
}

const STATUS_VALUE: Record<Exclude<CheckStatus, 'info'>, number> = {
  pass: 1,
  warn: 0.5,
  fail: 0,
}

export function scoreCategories(checks: Check[]): CategoryScore[] {
  const ids = Object.keys(CATEGORY_LABELS) as CategoryId[]
  return ids
    .map((id) => {
      const inCategory = checks.filter((c) => c.category === id)
      const scored = inCategory.filter(
        (c): c is Check & { status: 'pass' | 'warn' | 'fail' } => c.status !== 'info'
      )
      const totalWeight = scored.reduce((sum, c) => sum + c.weight, 0)
      const earned = scored.reduce((sum, c) => sum + c.weight * STATUS_VALUE[c.status], 0)
      return {
        id,
        label: CATEGORY_LABELS[id],
        score: totalWeight > 0 ? Math.round((earned / totalWeight) * 100) : null,
        pass: scored.filter((c) => c.status === 'pass').length,
        warn: scored.filter((c) => c.status === 'warn').length,
        fail: scored.filter((c) => c.status === 'fail').length,
      }
    })
    .filter((c) => c.pass + c.warn + c.fail > 0)
}

export function overallScore(categories: CategoryScore[]): number {
  let weight = 0
  let total = 0
  for (const category of categories) {
    if (category.score === null) continue
    const w = CATEGORY_WEIGHTS[category.id]
    weight += w
    total += w * category.score
  }
  return weight === 0 ? 0 : Math.round(total / weight)
}

export function gradeFor(score: number): AuditResult['grade'] {
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 40) return 'D'
  return 'E'
}
