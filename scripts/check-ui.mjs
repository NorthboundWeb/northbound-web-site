/**
 * End-to-end UI checks against a running build.
 *
 * Covers the things a type-check and a lint cannot see: horizontal overflow at
 * every supported width, duplicate element ids, heading structure, console
 * errors, anything overlapping a form control, the skip link actually moving
 * focus, currency switching and persistence, the mobile menu, and every
 * query-string preselection the pricing cards depend on.
 *
 * Usage: npm run build && npm start, then node scripts/check-ui.mjs [baseUrl]
 */
import { chromium } from 'playwright'
const BASE = process.argv[2] ?? 'http://localhost:3000'

const ROUTES = ['/', '/web', '/ai', '/web/work', '/about', '/contact', '/privacy']
const WIDTHS = [390, 500, 768, 1024, 1440]
const problems = []
const note = (m) => problems.push(m)

const b = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
)

/* 1. Overflow + duplicate IDs + console errors, every route × every width. */
for (const width of WIDTHS) {
  const ctx = await b.newContext({ viewport: { width, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)) })
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 160)))

  for (const route of ROUTES) {
    errors.length = 0
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(250)

    const res = await page.evaluate(() => {
      const d = document.documentElement
      // Duplicate element ids.
      const seen = new Map()
      for (const el of document.querySelectorAll('[id]')) {
        seen.set(el.id, (seen.get(el.id) ?? 0) + 1)
      }
      const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([id, n]) => `${id}×${n}`)
      // Headings.
      const h1s = document.querySelectorAll('h1').length
      return { scrollW: d.scrollWidth, clientW: d.clientWidth, dupes, h1s }
    })

    if (res.scrollW > res.clientW + 1) note(`OVERFLOW ${width}px ${route}: ${res.scrollW} > ${res.clientW}`)
    if (res.dupes.length) note(`DUPLICATE-ID ${width}px ${route}: ${res.dupes.join(', ')}`)
    if (res.h1s !== 1) note(`H1-COUNT ${width}px ${route}: found ${res.h1s}`)
    if (errors.length) note(`CONSOLE ${width}px ${route}: ${errors.join(' | ')}`)
  }
  await ctx.close()
}

/* 2. The reported overlap: anything covering the contact form's controls at 500px. */
{
  const ctx = await b.newContext({ viewport: { width: 500, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE + '/contact', { waitUntil: 'networkidle' })
  const overlaps = await page.evaluate(() => {
    const found = []
    const controls = [...document.querySelectorAll('input, select, textarea, button, a')]
    for (const c of controls) {
      const r = c.getBoundingClientRect()
      if (r.width < 4 || r.height < 4) continue
      // What does the browser say is actually on top at the control's centre?
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      if (cy < 0 || cy > window.innerHeight) continue
      const top = document.elementFromPoint(cx, cy)
      if (top && top !== c && !c.contains(top) && !top.contains(c)) {
        found.push(`${c.tagName.toLowerCase()}${c.id ? '#' + c.id : ''} covered by ${top.tagName.toLowerCase()}${top.className ? '.' + String(top.className).slice(0, 40) : ''}`)
      }
    }
    return found
  })
  for (const o of overlaps) note(`OVERLAP 500px /contact: ${o}`)
  await ctx.close()
}

/* 3. Skip link must move focus into main. */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim())
  await page.keyboard.press('Enter')
  await page.waitForTimeout(200)
  const afterEnter = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName)
  await page.keyboard.press('Tab')
  const afterTab = await page.evaluate(() => {
    const a = document.activeElement
    return a ? `${a.tagName}${a.id ? '#' + a.id : ''} "${(a.textContent || '').trim().slice(0, 30)}"` : 'none'
  })
  console.log(`skip link: first tab = "${first}" | after Enter focus = ${afterEnter} | next Tab = ${afterTab}`)
  if (afterEnter !== 'main') note(`SKIP-LINK: focus went to ${afterEnter}, expected main`)
  await ctx.close()
}

/* 4. Currency switch, and whether it survives navigation and a reload. */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(BASE + '/web', { waitUntil: 'networkidle' })
  const before = await page.locator('#starter').innerText()
  await page.selectOption('select[name="currency"]', 'EUR')
  await page.waitForTimeout(1200)
  const after = await page.locator('#starter').innerText()
  await page.goto(BASE + '/web', { waitUntil: 'networkidle' })
  const afterReload = await page.locator('#starter').innerText()
  const g = (t) => (t.match(/[£€$]\s?[\d,]+/) || ['?'])[0]
  console.log(`currency: GBP=${g(before)} -> EUR=${g(after)} -> after reload=${g(afterReload)}`)
  if (g(after) === g(before)) note('CURRENCY: selecting EUR did not change the displayed price')
  if (g(afterReload) !== g(after)) note('CURRENCY: selection did not survive a reload')
  const approx = await page.locator('text=approximate conversion').count()
  if (!approx) note('CURRENCY: no "approximate conversion" note shown for EUR')
  await ctx.close()
}

/* 5. Mobile menu behaviour. */
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await ctx.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /open menu/i }).click()
  await page.waitForTimeout(300)
  const opened = await page.locator('#mobile-nav').isVisible()
  const locked = await page.evaluate(() => getComputedStyle(document.body).overflow)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  const closed = (await page.locator('#mobile-nav').count()) === 0
  const unlocked = await page.evaluate(() => getComputedStyle(document.body).overflow)
  console.log(`mobile menu: opens=${opened} scrollLocked=${locked} escClosed=${closed} restored=${unlocked}`)
  if (!opened) note('MOBILE MENU: did not open')
  if (locked !== 'hidden') note(`MOBILE MENU: body scroll not locked (${locked})`)
  if (!closed) note('MOBILE MENU: Escape did not close it')
  await ctx.close()
}

/* 6. Query-string preselection. */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  for (const [q, expect] of [
    ['?package=starter', 'Starter build'],
    ['?package=advanced', 'Advanced build'],
    ['?package=pro', 'Pro build'],
    ['?package=custom', 'Custom build'],
    ['?package=pro-management', 'Pro Management'],
    ['?package=ultimate-management', 'Ultimate Management'],
    ['?interest=employees', 'Northbound Employees — register interest'],
  ]) {
    await page.goto(BASE + '/contact' + q, { waitUntil: 'domcontentloaded' })
    const v = await page.locator('select#projectType').inputValue()
    if (v !== expect) note(`PRESELECT ${q}: got "${v}", expected "${expect}"`)
  }
  console.log('preselection checked for 7 query strings')
  await ctx.close()
}

await b.close()
if (problems.length) { console.log(`\n✗ ${problems.length} problem(s):`); for (const p of problems) console.log('  ' + p); process.exitCode = 1 }
else console.log('\n✓ all verification checks passed')
