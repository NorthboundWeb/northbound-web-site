/**
 * Route and link integrity check.
 *
 * Crawls every public page of a running build, collects every href that is
 * actually rendered, and proves each one goes somewhere real:
 *
 *   - internal path  → must respond 200 (following redirects)
 *   - path + #anchor → the target page must contain that element id
 *   - bare #anchor   → the current page must contain that element id
 *   - external       → must be an absolute https URL
 *
 * Fails on "#", "javascript:void(0)", unknown routes and missing anchors, so a
 * dead button cannot reach production unnoticed.
 *
 * Usage: node scripts/check-links.mjs [baseUrl]
 */
const BASE = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')

/** Pages to crawl. Everything else is discovered from the links on these. */
const SEEDS = [
  '/',
  '/web',
  '/web/work',
  '/ai',
  '/about',
  '/contact',
  '/privacy',
  '/does-not-exist-404',
]

const failures = []
const pages = new Map()

async function load(path) {
  if (pages.has(path)) return pages.get(path)
  const res = await fetch(BASE + path, { redirect: 'follow' })
  const html = res.ok ? await res.text() : ''
  const entry = { status: res.status, html, url: res.url }
  pages.set(path, entry)
  return entry
}

function hrefsIn(html) {
  return [...html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)].map((m) => m[1])
}

function hasId(html, id) {
  // Matches id="x" on any element, quoted exactly as Next renders it.
  return new RegExp(`\\sid="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(html)
}

function fail(page, href, reason) {
  failures.push(`${page.padEnd(22)} ${href.padEnd(38)} ${reason}`)
}

const queue = [...SEEDS]
const crawled = new Set()

while (queue.length) {
  const path = queue.shift()
  if (crawled.has(path)) continue
  crawled.add(path)

  const page = await load(path)
  // The 404 seed is expected to 404; everything else must render.
  if (path === '/does-not-exist-404') {
    if (page.status !== 404) failures.push(`404 page returned ${page.status}, expected 404`)
    continue
  }
  if (page.status !== 200) {
    failures.push(`${path} returned ${page.status}`)
    continue
  }

  for (const href of hrefsIn(page.html)) {
    if (!href || href === '#') {
      fail(path, href || '(empty)', 'dead href')
      continue
    }
    if (/^javascript:/i.test(href)) {
      fail(path, href, 'javascript: href')
      continue
    }
    if (href.startsWith('mailto:') || href.startsWith('tel:')) continue

    if (/^https?:\/\//i.test(href)) {
      if (!href.startsWith('https://')) fail(path, href, 'external link is not https')
      continue
    }
    if (href.startsWith('//') || !href.startsWith('/')) {
      if (href.startsWith('#')) {
        const id = decodeURIComponent(href.slice(1))
        if (!hasId(page.html, id)) fail(path, href, `no element with id="${id}" on this page`)
      } else {
        fail(path, href, 'unrecognised href form')
      }
      continue
    }

    // Internal absolute path, optionally with a query and/or a hash.
    const [pathPart, hash] = href.split('#')
    const target = pathPart.split('?')[0]
    const targetPage = await load(pathPart)
    if (targetPage.status !== 200) {
      fail(path, href, `target responded ${targetPage.status}`)
      continue
    }
    if (hash && !hasId(targetPage.html, decodeURIComponent(hash))) {
      fail(path, href, `no element with id="${hash}" on ${target}`)
    }
    if (!crawled.has(target) && SEEDS.includes(target)) queue.push(target)
  }
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} link problem(s):\n`)
  for (const f of failures) console.error('  ' + f)
  process.exit(1)
}
console.log(`✓ every rendered link resolves (${crawled.size} pages crawled)`)
