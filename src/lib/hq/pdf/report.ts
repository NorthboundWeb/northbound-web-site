import type { AuditResult, Check } from '../audit/types'
import { CATEGORY_LABELS } from '../audit/types'
import { PdfDocument, PdfPage, rgb, textWidth, wrapText, type Rgb } from './writer'

/**
 * The branded site-audit report.
 *
 * Palette and tone follow the Northbound site: near-black ground, warm cream
 * paper, burnt-orange accent, plain direct language. The wording is bounded on
 * purpose. It reports what was observed, says what the check cannot see, and
 * makes no promises about results, prices or turnaround.
 */

export type ReportBrand = {
  name: string
  email: string
  url: string
}

const INK = rgb('#111111')
const INK_MUTED = rgb('#4a4a48')
const INK_FAINT = rgb('#63625e')
const BLACK = rgb('#0e0e0e')
const CREAM = rgb('#f2efe9')
const CREAM_SUNK = rgb('#e9e5dc')
const ORANGE = rgb('#dd5a22')
const ORANGE_INK = rgb('#a83c13')
const YELLOW = rgb('#f0b429')
const CHALK_MUTED = rgb('#a8a7a3')
const RULE = rgb('#cfcac0')

const MARGIN = 48
const CONTENT_WIDTH = 595.28 - MARGIN * 2
const BOTTOM = 841.89 - 64

const STATUS_LABEL: Record<string, { label: string; color: Rgb }> = {
  fail: { label: 'FIX', color: ORANGE_INK },
  warn: { label: 'IMPROVE', color: INK_MUTED },
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  })
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/** Draws a block of wrapped text and returns the y after its last line. */
function paragraph(
  page: PdfPage,
  text: string,
  x: number,
  y: number,
  width: number,
  options: { size: number; color: Rgb; font?: 'regular' | 'bold'; leading?: number }
): number {
  const leading = options.leading ?? options.size * 1.4
  let cursor = y
  for (const line of wrapText(text, options.font ?? 'regular', options.size, width)) {
    page.text(line, x, cursor, { font: options.font, size: options.size, color: options.color })
    cursor += leading
  }
  return cursor
}

function measureParagraph(text: string, width: number, size: number, leading?: number): number {
  return wrapText(text, 'regular', size, width).length * (leading ?? size * 1.4)
}

function wordmark(page: PdfPage, x: number, y: number, ink: Rgb) {
  page.text('NORTHBOUND', x, y, { font: 'bold', size: 15, color: ink, charSpace: 2.4 })
}

function scoreColor(score: number | null): Rgb {
  if (score === null) return RULE
  return score >= 75 ? INK : ORANGE
}

function summarise(result: AuditResult): string {
  const fails = result.checks.filter((c) => c.status === 'fail').length
  const warns = result.checks.filter((c) => c.status === 'warn').length
  const passes = result.checks.filter((c) => c.status === 'pass').length
  if (fails === 0 && warns === 0) {
    return `Everything we checked is in good shape: ${passes} checks passed.`
  }
  const parts: string[] = []
  if (fails > 0) parts.push(`${fails} ${fails === 1 ? 'issue' : 'issues'} worth fixing`)
  if (warns > 0) parts.push(`${warns} ${warns === 1 ? 'thing' : 'things'} that could be better`)
  return `We found ${parts.join(' and ')}. ${passes} ${passes === 1 ? 'check' : 'checks'} passed.`
}

function drawCover(doc: PdfDocument, result: AuditResult, brand: ReportBrand) {
  const page = doc.addPage()
  page.rect(0, 0, page.width, page.height, CREAM)

  // Header band
  page.rect(0, 0, page.width, 112, BLACK)
  wordmark(page, MARGIN, 66, CREAM)
  const tag = 'WEBSITE HEALTH CHECK'
  const tagWidth = textWidth(tag, 'bold', 8, 1.6)
  page.text(tag, page.width - MARGIN - tagWidth, 64, {
    font: 'bold',
    size: 8,
    color: CHALK_MUTED,
    charSpace: 1.6,
  })
  page.rect(0, 112, page.width, 4, ORANGE)

  // Title
  page.text('Website health check', MARGIN, 190, { font: 'bold', size: 34, color: INK })
  page.text(hostOf(result.finalUrl), MARGIN, 220, { font: 'bold', size: 17, color: ORANGE_INK })
  page.text(`Checked ${formatDate(result.fetchedAt)}`, MARGIN, 242, {
    size: 10,
    color: INK_FAINT,
  })

  // Score block
  const top = 280
  page.rect(MARGIN, top, 150, 150, BLACK)
  const scoreText = String(result.score)
  const scoreWidth = textWidth(scoreText, 'bold', 64)
  page.text(scoreText, MARGIN + (150 - scoreWidth) / 2, top + 84, {
    font: 'bold',
    size: 64,
    color: CREAM,
  })
  const outOf = 'out of 100'
  page.text(outOf, MARGIN + (150 - textWidth(outOf, 'regular', 10)) / 2, top + 106, {
    size: 10,
    color: CHALK_MUTED,
  })
  page.rect(MARGIN, top + 150, 150, 26, ORANGE)
  const gradeText = `GRADE ${result.grade}`
  page.text(gradeText, MARGIN + (150 - textWidth(gradeText, 'bold', 10, 1.4)) / 2, top + 168, {
    font: 'bold',
    size: 10,
    color: BLACK,
    charSpace: 1.4,
  })

  // Summary beside the score
  const sx = MARGIN + 150 + 30
  const sw = CONTENT_WIDTH - 150 - 30
  let y = paragraph(page, summarise(result), sx, top + 26, sw, {
    font: 'bold',
    size: 15,
    color: INK,
    leading: 20,
  })
  y = paragraph(
    page,
    'This is an automated first look at the public side of the website: security, search visibility, speed, mobile use, accessibility and trust. The sections that follow explain each finding in plain English and what to do about it.',
    sx,
    y + 8,
    sw,
    { size: 10, color: INK_MUTED, leading: 14.5 }
  )

  // Category bars
  let by = 506
  page.text('HOW EACH AREA SCORED', MARGIN, by, {
    font: 'bold',
    size: 8,
    color: INK_FAINT,
    charSpace: 1.6,
  })
  by += 12
  page.line(MARGIN, by, MARGIN + CONTENT_WIDTH, by, RULE)
  by += 22
  const barX = MARGIN + 150
  const barW = CONTENT_WIDTH - 150 - 44
  for (const category of result.categories) {
    page.text(category.label, MARGIN, by, { font: 'bold', size: 10.5, color: INK })
    page.rect(barX, by - 9, barW, 10, CREAM_SUNK)
    if (category.score !== null && category.score > 0) {
      page.rect(barX, by - 9, (barW * category.score) / 100, 10, scoreColor(category.score))
    }
    const label = category.score === null ? '–' : String(category.score)
    page.text(label, MARGIN + CONTENT_WIDTH - textWidth(label, 'bold', 11), by, {
      font: 'bold',
      size: 11,
      color: INK,
    })
    by += 30
  }

  // Footer note on the cover
  paragraph(
    page,
    `Prepared by ${brand.name}. ${brand.url.replace(/^https?:\/\//, '')}`,
    MARGIN,
    BOTTOM - 4,
    CONTENT_WIDTH,
    { size: 9, color: INK_FAINT }
  )
}

type Cursor = { page: PdfPage; y: number }

function newContentPage(doc: PdfDocument): Cursor {
  const page = doc.addPage()
  page.rect(0, 0, page.width, page.height, CREAM)
  page.rect(0, 0, page.width, 6, ORANGE)
  return { page, y: 70 }
}

function ensureSpace(doc: PdfDocument, cursor: Cursor, needed: number): Cursor {
  return cursor.y + needed > BOTTOM ? newContentPage(doc) : cursor
}

function sectionHeading(page: PdfPage, text: string, y: number): number {
  page.text(text, MARGIN, y, { font: 'bold', size: 20, color: INK })
  return y + 14
}

function findingHeight(check: Check): number {
  const inner = CONTENT_WIDTH - 26
  let h = 14 + 16 // label line + title
  h += measureParagraph(check.found, inner, 10, 14)
  if (check.why) h += 8 + 12 + measureParagraph(check.why, inner, 9.5, 13.5)
  if (check.fix) h += 6 + 12 + measureParagraph(check.fix, inner, 9.5, 13.5)
  return h + 24
}

function drawFinding(doc: PdfDocument, start: Cursor, check: Check): Cursor {
  const height = findingHeight(check)
  const cursor = ensureSpace(doc, start, height)
  const { page } = cursor
  const top = cursor.y
  const inner = CONTENT_WIDTH - 26
  const x = MARGIN + 18

  page.rect(MARGIN, top, 4, height - 14, check.status === 'fail' ? ORANGE : YELLOW)

  const status = STATUS_LABEL[check.status] ?? STATUS_LABEL.warn
  let y = top + 11
  page.text(status.label, x, y, { font: 'bold', size: 7.5, color: status.color, charSpace: 1.4 })
  const category = CATEGORY_LABELS[check.category].toUpperCase()
  page.text(category, x + textWidth(status.label, 'bold', 7.5, 1.4) + 12, y, {
    font: 'bold',
    size: 7.5,
    color: INK_FAINT,
    charSpace: 1.4,
  })

  y += 16
  page.text(check.title, x, y, { font: 'bold', size: 12.5, color: INK })

  y += 17
  y = paragraph(page, check.found, x, y, inner, { size: 10, color: INK, leading: 14 })

  if (check.why) {
    y += 8
    page.text('Why it matters', x, y, { font: 'bold', size: 8.5, color: INK_FAINT })
    y += 12
    y = paragraph(page, check.why, x, y, inner, { size: 9.5, color: INK_MUTED, leading: 13.5 })
  }
  if (check.fix) {
    y += 6
    page.text('How to fix it', x, y, { font: 'bold', size: 8.5, color: INK_FAINT })
    y += 12
    y = paragraph(page, check.fix, x, y, inner, { size: 9.5, color: INK_MUTED, leading: 13.5 })
  }

  return { page, y: top + height }
}

function drawSpeedPanel(doc: PdfDocument, start: Cursor, result: AuditResult): Cursor {
  const psi = result.pageSpeed
  if (!psi) return start
  const cursor = ensureSpace(doc, start, 112)
  const { page } = cursor
  const top = cursor.y

  page.rect(MARGIN, top, CONTENT_WIDTH, 92, BLACK)
  page.text('REAL-WORLD SPEED  ·  GOOGLE PAGESPEED, MOBILE', MARGIN + 18, top + 22, {
    font: 'bold',
    size: 7.5,
    color: CHALK_MUTED,
    charSpace: 1.4,
  })

  const stats: Array<[string, string]> = [
    ['Overall', psi.performanceScore === null ? '–' : `${psi.performanceScore}/100`],
    ['Main content', psi.lcpMs === null ? '–' : `${(psi.lcpMs / 1000).toFixed(1)}s`],
    ['Layout shift', psi.cls === null ? '–' : psi.cls.toFixed(2)],
    ['Unresponsive', psi.tbtMs === null ? '–' : `${Math.round(psi.tbtMs)}ms`],
  ]
  const colWidth = (CONTENT_WIDTH - 36) / stats.length
  stats.forEach(([label, value], index) => {
    const cx = MARGIN + 18 + colWidth * index
    page.text(value, cx, top + 56, { font: 'bold', size: 22, color: CREAM })
    page.text(label, cx, top + 74, { size: 9, color: CHALK_MUTED })
  })

  return { page, y: top + 112 }
}

export function buildAuditReport(result: AuditResult, brand: ReportBrand): Buffer {
  const doc = new PdfDocument()
  drawCover(doc, result, brand)

  const problems = result.checks
    .filter((c) => c.status === 'fail' || c.status === 'warn')
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'fail' ? -1 : 1
      return b.weight - a.weight
    })

  let cursor = newContentPage(doc)
  let y = sectionHeading(cursor.page, problems.length > 0 ? 'What to fix first' : 'Findings', cursor.y + 14)
  cursor = { page: cursor.page, y: y + 8 }

  cursor = drawSpeedPanel(doc, cursor, result)

  if (problems.length === 0) {
    cursor.y = paragraph(
      cursor.page,
      'Nothing needed fixing in the areas we checked. The checks that passed are listed below.',
      MARGIN,
      cursor.y + 6,
      CONTENT_WIDTH,
      { size: 11, color: INK_MUTED }
    )
  }

  for (const check of problems) cursor = drawFinding(doc, cursor, check)

  // What is already working
  const passes = result.checks.filter((c) => c.status === 'pass')
  if (passes.length > 0) {
    cursor = ensureSpace(doc, cursor, 70)
    y = sectionHeading(cursor.page, 'What is already working', cursor.y + 22)
    cursor = { page: cursor.page, y: y + 8 }
    const colWidth = CONTENT_WIDTH / 2 - 8
    let rowY = cursor.y
    for (let i = 0; i < passes.length; i += 2) {
      const row = passes.slice(i, i + 2).map((check) => ({
        title: check.title,
        lines: wrapText(check.title, 'regular', 10, colWidth - 14),
      }))
      const rowHeight = Math.max(...row.map((cell) => cell.lines.length)) * 13 + 6
      cursor = ensureSpace(doc, { page: cursor.page, y: rowY }, rowHeight)
      rowY = cursor.y
      row.forEach((cell, column) => {
        const x = MARGIN + column * (colWidth + 16)
        cursor.page.text('•', x, rowY, { font: 'bold', size: 10, color: ORANGE_INK })
        cell.lines.forEach((line, lineIndex) => {
          cursor.page.text(line, x + 14, rowY + lineIndex * 13, { size: 10, color: INK })
        })
      })
      rowY += rowHeight
    }
    cursor = { page: cursor.page, y: rowY }
  }

  // About this check + next step
  cursor = ensureSpace(doc, cursor, 230)
  y = sectionHeading(cursor.page, 'About this check', cursor.y + 22)
  y += 8
  for (const note of result.limitations) {
    cursor.page.text('•', MARGIN, y, { font: 'bold', size: 10, color: ORANGE_INK })
    y = paragraph(cursor.page, note, MARGIN + 14, y, CONTENT_WIDTH - 14, {
      size: 9.5,
      color: INK_MUTED,
      leading: 13.5,
    })
    y += 4
  }
  cursor.page.text('•', MARGIN, y, { font: 'bold', size: 10, color: ORANGE_INK })
  y = paragraph(
    cursor.page,
    'Notes on privacy and cookies are observations about what is visible on the site, not legal advice.',
    MARGIN + 14,
    y,
    CONTENT_WIDTH - 14,
    { size: 9.5, color: INK_MUTED, leading: 13.5 }
  )

  y += 18
  const boxHeight = 96
  cursor = ensureSpace(doc, { page: cursor.page, y }, boxHeight + 10)
  const { page } = cursor
  const boxTop = cursor.y
  page.rect(MARGIN, boxTop, CONTENT_WIDTH, boxHeight, BLACK)
  page.rect(MARGIN, boxTop, 5, boxHeight, ORANGE)
  page.text('Want a hand with any of this?', MARGIN + 24, boxTop + 32, {
    font: 'bold',
    size: 15,
    color: CREAM,
  })
  paragraph(
    page,
    `${brand.name} builds and manages websites for UK businesses. If you would like to talk through these findings, get in touch and we will look at them with you.`,
    MARGIN + 24,
    boxTop + 52,
    CONTENT_WIDTH - 48,
    { size: 9.5, color: CHALK_MUTED, leading: 13 }
  )
  const mail = brand.email
  page.text(mail, MARGIN + 24, boxTop + boxHeight - 12, { font: 'bold', size: 10.5, color: ORANGE })
  page.link(
    MARGIN + 24,
    boxTop + boxHeight - 24,
    textWidth(mail, 'bold', 10.5),
    14,
    `mailto:${mail}`
  )

  // Footer on every page after the cover.
  const total = doc.pages.length
  doc.pages.forEach((p, index) => {
    if (index === 0) return
    p.line(MARGIN, 841.89 - 46, MARGIN + CONTENT_WIDTH, 841.89 - 46, RULE)
    p.text(`${brand.name}  ·  ${hostOf(result.finalUrl)}  ·  ${formatDate(result.fetchedAt)}`, MARGIN, 841.89 - 30, {
      size: 8,
      color: INK_FAINT,
    })
    const label = `Page ${index + 1} of ${total}`
    p.text(label, MARGIN + CONTENT_WIDTH - textWidth(label, 'regular', 8), 841.89 - 30, {
      size: 8,
      color: INK_FAINT,
    })
  })

  return doc.build({
    title: `Website health check: ${hostOf(result.finalUrl)}`,
    author: brand.name,
    subject: 'Automated website health check',
  })
}
