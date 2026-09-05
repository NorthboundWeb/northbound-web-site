/**
 * WCAG AA contrast audit.
 *
 * Walks every element that renders its own text on every public route, at
 * desktop and mobile widths, resolves the effective background by climbing to
 * the first opaque ancestor, and fails if the ratio is under 4.5:1 (3:1 for
 * large text). The palette deliberately carries two oranges — --orange for the
 * near-black ground and --orange-ink for cream — and this is what stops the
 * wrong one being used on the wrong surface.
 *
 * Usage: npm run build && npm start, then node scripts/check-contrast.mjs
 */
import { chromium } from 'playwright'
const BASE = process.argv[2] ?? 'http://localhost:3000'
const b = await chromium.launch({ ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) })
const routes=['/','/web','/ai','/web/work','/about','/contact','/privacy']
const all=[]
for (const vp of [{w:1440,h:900,n:'desktop'},{w:390,h:844,n:'mobile'}]) {
  const ctx=await b.newContext({viewport:{width:vp.w,height:vp.h}})
  const p=await ctx.newPage()
  for (const r of routes) {
    await p.goto(BASE+r,{waitUntil:'networkidle'})
    const bad = await p.evaluate(() => {
      const lum = (c) => {
        const [r,g,bl] = c.map(v=>{ v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4) })
        return 0.2126*r+0.7152*g+0.0722*bl
      }
      const parse = (s) => { const m=s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m? {rgb:[+m[1],+m[2],+m[3]], a:m[4]===undefined?1:+m[4]} : null }
      const bgOf = (el) => {
        let n=el
        while (n && n!==document.documentElement) {
          const c=parse(getComputedStyle(n).backgroundColor)
          if (c && c.a>0.95) return c.rgb
          n=n.parentElement
        }
        return [14,14,14]
      }
      const out=[]
      for (const el of document.querySelectorAll('body *')) {
        const direct=[...el.childNodes].some(n=>n.nodeType===3 && n.textContent.trim().length>1)
        if (!direct) continue
        const cs=getComputedStyle(el)
        if (cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0) continue
        const rect=el.getBoundingClientRect()
        if (!rect.width||!rect.height) continue
        const fg=parse(cs.color); if(!fg) continue
        const bg=bgOf(el)
        const L1=lum(fg.rgb), L2=lum(bg)
        const ratio=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)
        const size=parseFloat(cs.fontSize)
        const bold=+cs.fontWeight>=700
        const large = size>=24 || (bold && size>=18.66)
        const min = large?3:4.5
        if (ratio < min - 0.01) {
          out.push({ text: el.textContent.trim().slice(0,40), ratio:+ratio.toFixed(2), min, size:+size.toFixed(1), color:cs.color, bg:`rgb(${bg.join(',')})` })
        }
      }
      return out
    })
    for (const x of bad) all.push({ vp:vp.n, route:r, ...x })
  }
  await ctx.close()
}
await b.close()
if (all.length) process.exitCode = 1
if (!all.length) console.log('✓ no WCAG AA contrast failures across', routes.length,'routes × 2 viewports')
else { console.log('✗', all.length,'contrast failures:'); for(const f of all) console.log(' ',f.vp,f.route,'|',f.ratio+':1 <',f.min,'|',f.size+'px |',f.color,'on',f.bg,'|',JSON.stringify(f.text)) }
