import zlib from 'node:zlib'

/**
 * A minimal PDF writer.
 *
 * Supports exactly what the audit report needs — filled rectangles, rules,
 * single-line text in two standard fonts, and link annotations — and nothing
 * else. It exists because the project has no PDF dependency and a report
 * generator does not justify adding one. The fonts are the built-in Helvetica
 * pair every PDF viewer already has, so nothing is embedded.
 *
 * Coordinates use a top-left origin in points (1/72 inch), like a layout tool,
 * and are flipped to PDF's bottom-left origin on output.
 */

export type Rgb = [number, number, number]
export type FontKey = 'regular' | 'bold'

export function rgb(hex: string): Rgb {
  const value = hex.replace('#', '')
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
  ]
}

export const A4 = { width: 595.28, height: 841.89 }

// Advance widths in 1/1000 em for characters 32..126, from the standard
// Helvetica and Helvetica-Bold font metrics.
const HELVETICA = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
]
const HELVETICA_BOLD = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611,
  975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556,
  333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611,
  611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584,
]
const METRICS: Record<FontKey, number[]> = { regular: HELVETICA, bold: HELVETICA_BOLD }

/** Unicode characters that have a different byte in WinAnsi than in Latin-1. */
const WIN_ANSI: Record<string, number> = {
  '€': 0x80, '…': 0x85, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94,
  '•': 0x95, '–': 0x96, '—': 0x97, '™': 0x99,
}
const WIN_ANSI_WIDTH: Record<number, number> = {
  0x85: 1000, 0x91: 222, 0x92: 222, 0x93: 333, 0x94: 333, 0x95: 350,
  0x96: 556, 0x97: 1000, 0x99: 1000, 0x80: 556,
}

/** Maps a string to WinAnsi bytes, replacing anything unsupported with "?". */
function encode(text: string): number[] {
  const bytes: number[] = []
  for (const char of text) {
    const code = char.codePointAt(0) ?? 63
    if (code === 9 || code === 10 || code === 13) bytes.push(32)
    else if (code >= 32 && code <= 126) bytes.push(code)
    else if (char in WIN_ANSI) bytes.push(WIN_ANSI[char])
    else if (code >= 160 && code <= 255) bytes.push(code)
    else bytes.push(63)
  }
  return bytes
}

function glyphWidth(byte: number, font: FontKey): number {
  if (byte >= 32 && byte <= 126) return METRICS[font][byte - 32]
  return WIN_ANSI_WIDTH[byte] ?? 556
}

export function textWidth(text: string, font: FontKey, size: number, charSpace = 0): number {
  const bytes = encode(text)
  const advance = bytes.reduce((sum, b) => sum + glyphWidth(b, font), 0)
  return (advance / 1000) * size + charSpace * bytes.length
}

/** Greedy word wrap. A single word longer than the line is split by letter. */
export function wrapText(text: string, font: FontKey, size: number, maxWidth: number): string[] {
  const lines: string[] = []
  for (const paragraph of text.split('\n')) {
    let line = ''
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word
      if (textWidth(candidate, font, size) <= maxWidth) {
        line = candidate
        continue
      }
      if (line) lines.push(line)
      if (textWidth(word, font, size) <= maxWidth) {
        line = word
        continue
      }
      // Long unbroken string (a URL): break it where it no longer fits.
      let chunk = ''
      for (const char of word) {
        if (textWidth(chunk + char, font, size) > maxWidth && chunk) {
          lines.push(chunk)
          chunk = ''
        }
        chunk += char
      }
      line = chunk
    }
    lines.push(line)
  }
  return lines
}

function escapePdfString(bytes: number[]): string {
  let out = ''
  for (const b of bytes) {
    if (b === 0x28 || b === 0x29 || b === 0x5c) out += `\\${String.fromCharCode(b)}`
    else if (b < 32 || b > 126) out += `\\${b.toString(8).padStart(3, '0')}`
    else out += String.fromCharCode(b)
  }
  return out
}

const fmt = (n: number) => (Math.round(n * 100) / 100).toString()
const color = (c: Rgb) => `${fmt(c[0])} ${fmt(c[1])} ${fmt(c[2])}`

type Annotation = { x: number; y: number; w: number; h: number; uri: string }

export class PdfPage {
  readonly width = A4.width
  readonly height = A4.height
  readonly ops: string[] = []
  readonly annotations: Annotation[] = []

  private flip(y: number) {
    return this.height - y
  }

  rect(x: number, y: number, w: number, h: number, fill: Rgb) {
    this.ops.push(`${color(fill)} rg ${fmt(x)} ${fmt(this.flip(y + h))} ${fmt(w)} ${fmt(h)} re f`)
  }

  /** Rounded rectangle, filled. Radius is clamped to half the shorter side. */
  roundRect(x: number, y: number, w: number, h: number, radius: number, fill: Rgb) {
    const r = Math.min(radius, w / 2, h / 2)
    const k = r * 0.5523
    const top = this.flip(y)
    const bottom = this.flip(y + h)
    const right = x + w
    this.ops.push(
      [
        `${color(fill)} rg`,
        `${fmt(x + r)} ${fmt(bottom)} m`,
        `${fmt(right - r)} ${fmt(bottom)} l`,
        `${fmt(right - r + k)} ${fmt(bottom)} ${fmt(right)} ${fmt(bottom + r - k)} ${fmt(right)} ${fmt(bottom + r)} c`,
        `${fmt(right)} ${fmt(top - r)} l`,
        `${fmt(right)} ${fmt(top - r + k)} ${fmt(right - r + k)} ${fmt(top)} ${fmt(right - r)} ${fmt(top)} c`,
        `${fmt(x + r)} ${fmt(top)} l`,
        `${fmt(x + r - k)} ${fmt(top)} ${fmt(x)} ${fmt(top - r + k)} ${fmt(x)} ${fmt(top - r)} c`,
        `${fmt(x)} ${fmt(bottom + r)} l`,
        `${fmt(x)} ${fmt(bottom + r - k)} ${fmt(x + r - k)} ${fmt(bottom)} ${fmt(x + r)} ${fmt(bottom)} c`,
        'f',
      ].join(' ')
    )
  }

  line(x1: number, y1: number, x2: number, y2: number, stroke: Rgb, width = 0.75) {
    this.ops.push(
      `${color(stroke)} RG ${fmt(width)} w ${fmt(x1)} ${fmt(this.flip(y1))} m ${fmt(x2)} ${fmt(this.flip(y2))} l S`
    )
  }

  /** `y` is the text baseline, measured from the top of the page. */
  text(
    text: string,
    x: number,
    y: number,
    options: { font?: FontKey; size?: number; color: Rgb; charSpace?: number }
  ) {
    const { font = 'regular', size = 10, charSpace = 0 } = options
    const face = font === 'bold' ? 'F2' : 'F1'
    this.ops.push(
      `BT ${color(options.color)} rg /${face} ${fmt(size)} Tf ${fmt(charSpace)} Tc ${fmt(x)} ${fmt(
        this.flip(y)
      )} Td (${escapePdfString(encode(text))}) Tj ET`
    )
  }

  link(x: number, y: number, w: number, h: number, uri: string) {
    this.annotations.push({ x, y, w, h, uri })
  }
}

export class PdfDocument {
  readonly pages: PdfPage[] = []

  addPage(): PdfPage {
    const page = new PdfPage()
    this.pages.push(page)
    return page
  }

  build(info: { title: string; author: string; subject: string }): Buffer {
    const parts: Buffer[] = []
    const offsets: number[] = []
    let length = 0

    const push = (chunk: Buffer | string) => {
      const buffer = typeof chunk === 'string' ? Buffer.from(chunk, 'latin1') : chunk
      parts.push(buffer)
      length += buffer.length
    }
    const object = (id: number, body: Buffer | string) => {
      offsets[id] = length
      push(`${id} 0 obj\n`)
      push(body)
      push('\nendobj\n')
    }

    // Object numbering: 1 catalog, 2 page tree, 3 + 4 fonts, 5 info,
    // then three objects per page (content, annotations are inline, page).
    const FIRST_PAGE_OBJECT = 6
    const pageObjectId = (index: number) => FIRST_PAGE_OBJECT + index * 2
    const contentObjectId = (index: number) => FIRST_PAGE_OBJECT + index * 2 + 1
    const objectCount = FIRST_PAGE_OBJECT + this.pages.length * 2

    push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')

    object(1, '<< /Type /Catalog /Pages 2 0 R >>')
    object(
      2,
      `<< /Type /Pages /Count ${this.pages.length} /Kids [${this.pages
        .map((_, i) => `${pageObjectId(i)} 0 R`)
        .join(' ')}] >>`
    )
    object(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
    object(
      4,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
    )
    const ascii = (value: string) => escapePdfString(encode(value).map((b) => (b > 126 ? 63 : b)))
    object(
      5,
      `<< /Title (${ascii(info.title)}) /Author (${ascii(info.author)}) /Subject (${ascii(
        info.subject
      )}) /Producer (Northbound) >>`
    )

    this.pages.forEach((page, index) => {
      const annots = page.annotations
        .map(
          (a) =>
            `<< /Type /Annot /Subtype /Link /Border [0 0 0] /Rect [${fmt(a.x)} ${fmt(
              page.height - a.y - a.h
            )} ${fmt(a.x + a.w)} ${fmt(page.height - a.y)}] /A << /S /URI /URI (${escapePdfString(
              encode(a.uri)
            )}) >> >>`
        )
        .join(' ')

      object(
        pageObjectId(index),
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${fmt(page.width)} ${fmt(
          page.height
        )}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectId(
          index
        )} 0 R${annots ? ` /Annots [${annots}]` : ''} >>`
      )

      const stream = zlib.deflateSync(Buffer.from(page.ops.join('\n'), 'latin1'))
      object(
        contentObjectId(index),
        Buffer.concat([
          Buffer.from(`<< /Length ${stream.length} /Filter /FlateDecode >>\nstream\n`, 'latin1'),
          stream,
          Buffer.from('\nendstream', 'latin1'),
        ])
      )
    })

    const xrefStart = length
    push(`xref\n0 ${objectCount}\n`)
    push('0000000000 65535 f \n')
    for (let id = 1; id < objectCount; id += 1) {
      push(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`)
    }
    push(
      `trailer\n<< /Size ${objectCount} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
    )

    return Buffer.concat(parts)
  }
}
