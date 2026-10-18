/**
 * A deliberately small HTML reader for the site audit.
 *
 * It is not a full parser and does not pretend to be. It extracts the handful
 * of things the checks need — titles, meta tags, headings, images, scripts,
 * links, form fields — with attribute-aware regexes, which is reliable enough
 * for well-formed pages and degrades gracefully on messy ones. Adding a
 * parsing dependency for this would be more surface than the job justifies.
 */

export type Attrs = Record<string, string>

export type ParsedImage = {
  src: string
  alt: string | null
  width: string | null
  height: string | null
  loading: string | null
}

export type ParsedScript = {
  src: string | null
  async: boolean
  defer: boolean
  module: boolean
  inHead: boolean
}

export type ParsedLink = { href: string; text: string; rel: string }

export type ParsedPage = {
  lang: string | null
  title: string | null
  metas: Record<string, string>
  canonical: string | null
  hasIconLink: boolean
  h1s: string[]
  headingLevels: number[]
  images: ParsedImage[]
  scripts: ParsedScript[]
  stylesheets: string[]
  anchors: ParsedLink[]
  forms: number
  unlabelledInputs: number
  iframes: string[]
  jsonLd: string[]
  /** Every absolute http:// resource reference, for mixed-content checks. */
  insecureResources: string[]
  /** Text with tags removed, for light keyword checks. */
  text: string
}

const TAG = /<([a-zA-Z][a-zA-Z0-9:-]*)((?:\s+[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>/g
const ATTR = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&pound;': '£',
}

export function decodeEntities(value: string): string {
  return value
    .replace(/&(amp|lt|gt|quot|apos|nbsp|pound|#39);/g, (m) => ENTITIES[m] ?? m)
    .replace(/&#(\d+);/g, (_, code) => {
      const n = Number(code)
      return n > 0 && n < 0x110000 ? String.fromCodePoint(n) : ''
    })
}

function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()
}

function parseAttrs(raw: string): Attrs {
  const attrs: Attrs = {}
  let match: RegExpExecArray | null
  ATTR.lastIndex = 0
  while ((match = ATTR.exec(raw))) {
    const name = match[1].toLowerCase()
    if (name in attrs) continue
    attrs[name] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '')
  }
  return attrs
}

export function parseHtml(source: string): ParsedPage {
  // Pull JSON-LD out before blanking script bodies, then drop comments so
  // commented-out markup is not mistaken for the real page.
  const jsonLd: string[] = []
  let html = source.replace(/<!--[\s\S]*?-->/g, '')
  html = html.replace(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
    (whole, attrString: string, body: string) => {
      if (/type\s*=\s*["']?application\/ld\+json/i.test(attrString)) {
        jsonLd.push(body.trim())
      }
      return `<script ${attrString}></script>`
    }
  )
  html = html.replace(/<style\b([^>]*)>[\s\S]*?<\/style>/gi, '<style $1></style>')

  const headEnd = html.search(/<\/head>/i)

  const page: ParsedPage = {
    lang: null,
    title: null,
    metas: {},
    canonical: null,
    hasIconLink: false,
    h1s: [],
    headingLevels: [],
    images: [],
    scripts: [],
    stylesheets: [],
    anchors: [],
    forms: 0,
    unlabelledInputs: 0,
    iframes: [],
    jsonLd,
    insecureResources: [],
    text: '',
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (titleMatch) page.title = stripTags(titleMatch[1]) || null

  // <label> regions, so an input nested inside one counts as labelled.
  const labelRanges: Array<[number, number]> = []
  const labelFor = new Set<string>()
  const labelRe = /<label\b([^>]*)>([\s\S]*?)<\/label>/gi
  let labelMatch: RegExpExecArray | null
  while ((labelMatch = labelRe.exec(html))) {
    labelRanges.push([labelMatch.index, labelMatch.index + labelMatch[0].length])
    const forAttr = parseAttrs(labelMatch[1]).for
    if (forAttr) labelFor.add(forAttr)
  }

  const insecure = (value: string | undefined) => {
    if (value && /^http:\/\//i.test(value.trim())) {
      page.insecureResources.push(value.trim())
    }
  }

  let match: RegExpExecArray | null
  TAG.lastIndex = 0
  while ((match = TAG.exec(html))) {
    const name = match[1].toLowerCase()
    const attrs = parseAttrs(match[2] ?? '')
    const index = match.index

    switch (name) {
      case 'html':
        page.lang = attrs.lang?.trim() || null
        break

      case 'meta': {
        const key = (attrs.name ?? attrs.property ?? attrs['http-equiv'] ?? '').toLowerCase()
        if (key && attrs.content !== undefined && !(key in page.metas)) {
          page.metas[key] = attrs.content
        }
        break
      }

      case 'link': {
        const rel = (attrs.rel ?? '').toLowerCase()
        if (rel.split(/\s+/).includes('canonical')) page.canonical = attrs.href ?? null
        if (/\bicon\b/.test(rel)) page.hasIconLink = true
        if (rel.split(/\s+/).includes('stylesheet')) {
          page.stylesheets.push(attrs.href ?? '')
          insecure(attrs.href)
        }
        break
      }

      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        const level = Number(name[1])
        page.headingLevels.push(level)
        if (level === 1) {
          const close = html.indexOf('</h1>', index)
          const inner = close === -1 ? '' : html.slice(index + match[0].length, close)
          page.h1s.push(stripTags(inner))
        }
        break
      }

      case 'img':
        page.images.push({
          src: attrs.src ?? attrs['data-src'] ?? '',
          alt: 'alt' in attrs ? attrs.alt : null,
          width: attrs.width ?? null,
          height: attrs.height ?? null,
          loading: attrs.loading ?? null,
        })
        insecure(attrs.src)
        break

      case 'script':
        page.scripts.push({
          src: attrs.src ?? null,
          async: 'async' in attrs,
          defer: 'defer' in attrs,
          module: (attrs.type ?? '').toLowerCase() === 'module',
          inHead: headEnd === -1 ? false : index < headEnd,
        })
        insecure(attrs.src)
        break

      case 'iframe':
        page.iframes.push(attrs.src ?? '')
        insecure(attrs.src)
        break

      case 'form':
        page.forms += 1
        break

      case 'input':
      case 'select':
      case 'textarea': {
        const type = (attrs.type ?? 'text').toLowerCase()
        if (['hidden', 'submit', 'button', 'image', 'reset'].includes(type)) break
        const named =
          attrs['aria-label'] || attrs['aria-labelledby'] || attrs.title
        const byFor = attrs.id ? labelFor.has(attrs.id) : false
        const wrapped = labelRanges.some(([from, to]) => index > from && index < to)
        if (!named && !byFor && !wrapped) page.unlabelledInputs += 1
        break
      }
    }
  }

  const anchorRe = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi
  let anchor: RegExpExecArray | null
  while ((anchor = anchorRe.exec(html))) {
    const attrs = parseAttrs(anchor[1])
    if (attrs.href === undefined) continue
    const inner = anchor[2]
    // An icon-only link is named by its image alt or aria-label, not its text.
    const imgAlt = inner.match(/<img\b[^>]*\balt\s*=\s*["']([^"']*)["']/i)?.[1]
    const text = stripTags(inner) || attrs['aria-label'] || imgAlt || attrs.title || ''
    page.anchors.push({ href: attrs.href, text, rel: (attrs.rel ?? '').toLowerCase() })
  }

  const body = html.replace(/<head[\s\S]*?<\/head>/i, '')
  page.text = stripTags(
    body
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
  )

  return page
}
