'use client'

import { useId, useRef, useState } from 'react'
import type { Comparison as ComparisonData, MockAfter, MockBefore } from '@/lib/discover'

/**
 * A before-and-after comparison with a split you drag.
 *
 * Both mock-ups are drawn in CSS at a fixed aspect ratio and sized in
 * container-query units, so they scale without measuring anything. The after
 * site sits on top and is clipped to the slider position; the before site
 * shows through on the other side.
 *
 * The handle is a real range input, visually hidden, stretched over the whole
 * frame. That gives keyboard, screen-reader and touch support for free,
 * including arrow keys, Home and End, without a line of pointer maths.
 */
export function Comparison({ data }: { data: ComparisonData }) {
  const [pos, setPos] = useState(50)
  const id = useId()
  const frame = useRef<HTMLDivElement>(null)

  return (
    <div className="cmp">
      <div
        ref={frame}
        className="@container relative aspect-[760/500] overflow-hidden rounded-md border border-line bg-paper-raised shadow-sm select-none"
      >
        <Before mock={data.before} />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          aria-hidden
        >
          <After mock={data.after} />
        </div>

        {/* Divider and handle */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-cream shadow-[0_0_0_1px_rgba(13,42,36,.35)]"
          style={{ left: `calc(${pos}% - 1px)` }}
        >
          <span className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-cream shadow-lg ring-2 ring-cream">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6 4 12l5 6M15 6l5 6-5 6" />
            </svg>
          </span>
        </div>

        {/* Labels */}
        <span aria-hidden className="label absolute top-3 left-3 z-10 rounded-sm bg-ink/85 px-2 py-1 text-cream">
          Before
        </span>
        <span aria-hidden className="label absolute top-3 right-3 z-10 rounded-sm bg-accent px-2 py-1 text-accent-ink">
          After
        </span>

        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare ${data.business} before and after. Drag to reveal.`}
          aria-valuetext={`${pos}% before, ${100 - pos}% after`}
          className="cmp-range absolute inset-0 z-20 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus-visible:opacity-100"
        />
      </div>

      <style>{`
        .cmp-range:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:6px}
        .cmp-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:44px;height:100%;background:transparent}
        .cmp-range::-moz-range-thumb{width:44px;height:1000px;background:transparent;border:0}
      `}</style>
    </div>
  )
}

/* ── The "before" sites ─────────────────────────────────────────────── */

function Before({ mock }: { mock: MockBefore }) {
  switch (mock.style) {
    case 'table-2009':
      return <Table2009 mock={mock} />
    case 'template-2016':
      return <Template2016 mock={mock} />
    case 'facebook-only':
      return <SocialOnly mock={mock} />
    default:
      return <BuilderGeneric mock={mock} />
  }
}

function Table2009({ mock }: { mock: MockBefore }) {
  return (
    <div aria-hidden className="absolute inset-0 font-serif text-[#111]" style={{ background: '#fffbe6' }}>
      <div className="absolute inset-x-[2.4cqw] top-[2.8cqw] border-[0.4cqw] border-[#b8b8b8] p-[1.3cqw] text-center" style={{ background: 'linear-gradient(#e7eefb,#b9c9ea)' }}>
        <b className="block text-[3.6cqw] tracking-wide text-[#1a2fa0] underline">{mock.title}</b>
        <small className="text-[1.8cqw] text-[#b00]" style={{ fontFamily: 'Comic Sans MS, cursive' }}>{mock.tagline}</small>
      </div>
      <div className="absolute inset-x-0 top-[21cqw] text-center text-[1.8cqw] text-[#00e]">
        {mock.nav.map((n, i) => (
          <span key={n}>{i > 0 ? '|' : ''}<u className="mx-[0.8cqw]">{n}</u></span>
        ))}
      </div>
      <div className="absolute inset-x-0 top-[25cqw] text-center text-[2.9cqw] text-[#c00]" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
        Welcome To Our Website!!!
      </div>
      <div className="absolute inset-x-[2.4cqw] top-[33cqw] grid h-[29cqw] grid-cols-[38%_1fr] gap-[0.3cqw] border-[0.26cqw] border-[#ccc] p-[0.3cqw] text-[1.8cqw]">
        <div className="border border-[#ccc] p-[1cqw]">
          <b>OUR SERVICES:</b><br />* Boilers<br />* Central Heating<br />* Bathrooms<br />* Leaks &amp; Repairs
          <span className="mt-[0.8cqw] inline-block border border-dashed border-[#c90] bg-[#ff0] px-[0.8cqw] text-[1.5cqw]">Page Under Construction</span>
        </div>
        <div className="border border-[#ccc] p-[1cqw]">
          {mock.body}<br /><br />
          <span className="font-bold text-[#c00]">*** NEW *** We now do power flushing!!</span><br /><br />
          {mock.phone}<br />Fax: 0113 496 0124
        </div>
      </div>
      <div className="absolute inset-x-[2.4cqw] bottom-[1.6cqw] text-center text-[1.4cqw] text-[#555]">
        Visitors: <span className="bg-black px-[0.6cqw] font-mono tracking-[0.2em] text-[#0f0]">004213</span> | © 2009 | Best viewed at 1024x768
      </div>
    </div>
  )
}

function Template2016({ mock }: { mock: MockBefore }) {
  return (
    <div aria-hidden className="absolute inset-0 bg-white font-sans text-[#333]">
      <div className="flex h-[9cqw] items-center justify-between px-[3cqw]">
        <span className="text-[2.6cqw] font-light tracking-[0.3em] uppercase">{mock.title}</span>
        <span className="flex gap-[2cqw] text-[1.5cqw] tracking-[0.15em] uppercase">
          {mock.nav.map((n) => <span key={n}>{n}</span>)}
        </span>
      </div>
      <div className="relative mx-[3cqw] h-[38cqw] overflow-hidden bg-[#8a7a6a]">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 40% 60%, #c9b6a0, #6e5c4b 70%)' }} />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <div className="text-[5cqw] font-light italic">{mock.tagline}</div>
            <div className="mt-[1.5cqw] inline-block border border-white px-[2.5cqw] py-[1cqw] text-[1.6cqw] tracking-[0.2em] uppercase">Read more</div>
          </div>
        </div>
        <div className="absolute bottom-[1.5cqw] left-1/2 flex -translate-x-1/2 gap-[0.8cqw]">
          <i className="block size-[1cqw] rounded-full bg-white" /><i className="block size-[1cqw] rounded-full bg-white/40" /><i className="block size-[1cqw] rounded-full bg-white/40" /><i className="block size-[1cqw] rounded-full bg-white/40" />
        </div>
        <div className="absolute top-[1.5cqw] right-[1.5cqw] rounded-sm bg-black/60 px-[1cqw] py-[0.5cqw] text-[1.3cqw] text-white">Loading… 3.1 MB</div>
      </div>
      <div className="mx-[3cqw] mt-[3cqw] text-center">
        <div className="text-[2.6cqw] font-light tracking-[0.2em] uppercase">Welcome</div>
        <p className="mx-auto mt-[1.5cqw] max-w-[60cqw] text-[1.7cqw] leading-relaxed text-[#777]">{mock.body}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-[#222] py-[1.5cqw] text-center text-[1.3cqw] text-[#999]">{mock.phone} · Follow us on Facebook</div>
    </div>
  )
}

function SocialOnly({ mock }: { mock: MockBefore }) {
  return (
    <div aria-hidden className="absolute inset-0 bg-[#e9e9ec] font-sans text-[#111]">
      <div className="absolute top-[4cqw] left-1/2 h-[92cqw] w-[44cqw] -translate-x-1/2 overflow-hidden rounded-[4cqw] bg-white shadow-xl">
        <div className="flex items-center gap-[2cqw] border-b border-[#eee] px-[3cqw] py-[2.5cqw]">
          <span className="block size-[7cqw] rounded-full" style={{ background: 'conic-gradient(#f09433,#e6683c,#dc2743,#cc2366,#bc1888,#f09433)' }} />
          <div>
            <div className="text-[2cqw] font-semibold">{mock.title}</div>
            <div className="text-[1.5cqw] text-[#666]">{mock.tagline}</div>
          </div>
        </div>
        <div className="flex justify-around border-b border-[#eee] py-[1.5cqw] text-[1.5cqw] font-medium text-[#888]">
          {mock.nav.map((n) => <span key={n}>{n}</span>)}
        </div>
        <div className="grid grid-cols-3 gap-[0.4cqw] p-[0.4cqw]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="block aspect-square" style={{ background: ['#f3d1dc', '#e8b4c4', '#f7e3e8', '#d9a7b8', '#f3d1dc', '#eac3d0'][i] }} />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 border-t border-[#eee] bg-[#fafafa] p-[2cqw]">
          <div className="ml-auto w-[80%] rounded-[2cqw] rounded-br-sm bg-[#3797f0] px-[2cqw] py-[1.5cqw] text-[1.6cqw] leading-snug text-white">hi! do you have anything thursday?</div>
          <div className="mt-[1cqw] w-[85%] rounded-[2cqw] rounded-bl-sm bg-[#efefef] px-[2cqw] py-[1.5cqw] text-[1.6cqw] leading-snug">{mock.body}</div>
          <div className="mt-[1cqw] ml-auto w-[60%] rounded-[2cqw] rounded-br-sm bg-[#3797f0] px-[2cqw] py-[1.5cqw] text-[1.6cqw] leading-snug text-white">maybe 2? or 4?</div>
        </div>
      </div>
      <div className="absolute right-[3cqw] bottom-[3cqw] rounded-sm bg-white px-[1.5cqw] py-[1cqw] text-[1.5cqw] text-[#666] shadow">Google: no results for this business</div>
    </div>
  )
}

function BuilderGeneric({ mock }: { mock: MockBefore }) {
  return (
    <div aria-hidden className="absolute inset-0 bg-white font-sans text-[#2d2d2d]">
      <div className="flex h-[9cqw] items-center justify-between border-b border-[#eee] px-[3cqw]">
        <span className="text-[2.4cqw] font-bold text-[#4a6cf7]">{mock.title}</span>
        <span className="flex gap-[2cqw] text-[1.5cqw]">{mock.nav.map((n) => <span key={n}>{n}</span>)}</span>
        <span className="rounded-full bg-[#4a6cf7] px-[2cqw] py-[0.8cqw] text-[1.4cqw] text-white">Get Started</span>
      </div>
      <div className="grid grid-cols-2 items-center gap-[3cqw] px-[3cqw] pt-[5cqw]">
        <div>
          <div className="text-[4.4cqw] leading-[1.1] font-bold">{mock.tagline}</div>
          <p className="mt-[1.5cqw] text-[1.6cqw] leading-relaxed text-[#777]">{mock.body}</p>
          <span className="mt-[2cqw] inline-block rounded-full bg-[#4a6cf7] px-[2.5cqw] py-[1.2cqw] text-[1.6cqw] text-white">Learn More</span>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5cqw] bg-[#dfe6f3]">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 70%, #c7b299, #8b7355 70%)' }} />
          <span className="absolute top-[1cqw] left-[1cqw] rounded-sm bg-white/90 px-[1cqw] py-[0.4cqw] text-[1.2cqw] text-[#999]">stock-photo-happy-dog-2381.jpg</span>
        </div>
      </div>
      <div className="mt-[4cqw] grid grid-cols-3 gap-[2cqw] px-[3cqw]">
        {['Grooming', 'Bathing', 'Nail Trimming'].map((s) => (
          <div key={s} className="rounded-[1.2cqw] border border-[#eee] p-[2cqw] text-center shadow-[0_2px_8px_rgba(0,0,0,.06)]">
            <span className="mx-auto block size-[4cqw] rounded-full bg-[#eef1fb]" />
            <div className="mt-[1cqw] text-[1.8cqw] font-semibold">{s}</div>
            <div className="text-[1.3cqw] text-[#999]">Lorem ipsum dolor sit</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── The "after" site ───────────────────────────────────────────────── */

function After({ mock }: { mock: MockAfter }) {
  return (
    <div className="absolute inset-0 font-sans" style={{ background: mock.bg, color: mock.ink }}>
      <div className="flex h-[4cqw] items-center justify-between px-[3.4cqw] text-[1.5cqw]" style={{ background: mock.ink, color: mock.bg }}>
        <span>{mock.strip}</span>
      </div>
      <div className="flex h-[8cqw] items-center justify-between px-[3.4cqw]" style={{ borderBottom: `1px solid ${mock.soft}` }}>
        <span className="text-[2.8cqw] font-extrabold tracking-tight">{mock.name}</span>
        <span className="px-[1.8cqw] py-[1.1cqw] text-[1.9cqw] font-bold" style={{ background: mock.accent, color: mock.onAccent, borderRadius: '0.5cqw' }}>{mock.phone}</span>
      </div>
      <div className="absolute top-[15cqw] left-[3.4cqw] w-[54cqw]">
        <small className="block text-[1.9cqw] font-bold tracking-[0.12em] uppercase" style={{ color: mock.accent }}>{mock.kicker}</small>
        <h3 className="mt-[0.8cqw] text-[6.2cqw] leading-[0.95] font-extrabold tracking-tight">{mock.headline}</h3>
        <p className="mt-[1.6cqw] text-[2cqw] leading-snug opacity-80">{mock.sub}</p>
        <div className="mt-[2.1cqw] flex gap-[1cqw]">
          <span className="px-[2.1cqw] py-[1.4cqw] text-[2cqw] font-bold" style={{ background: mock.accent, color: mock.onAccent, borderRadius: '0.5cqw' }}>{mock.ctaA}</span>
          <span className="px-[2.1cqw] py-[1.4cqw] text-[2cqw] font-bold" style={{ boxShadow: `inset 0 0 0 0.26cqw ${mock.ink}`, borderRadius: '0.5cqw' }}>{mock.ctaB}</span>
        </div>
      </div>
      <div className="absolute top-[16cqw] right-[3.4cqw] aspect-[4/3] w-[34cqw] overflow-hidden" style={{ background: mock.soft, borderRadius: '1cqw' }}>
        <span className="absolute bottom-[-18%] left-1/2 block aspect-square w-[62%] -translate-x-1/2 rounded-full" style={{ background: mock.accent, opacity: 0.85 }} />
        <span className="absolute top-[14%] right-[16%] block aspect-square w-[22%] rounded-full" style={{ border: `0.3cqw solid ${mock.ink}`, opacity: 0.35 }} />
      </div>
      <div className="absolute inset-x-[3.4cqw] bottom-[2.6cqw] grid grid-cols-3 gap-[1.3cqw]">
        {mock.tiles.map(([name, note]) => (
          <div key={name} className="px-[1.6cqw] py-[1.3cqw] text-[1.7cqw] opacity-90" style={{ background: mock.soft, borderTop: `0.4cqw solid ${mock.accent}`, borderRadius: '0.4cqw' }}>
            <b className="block text-[2.3cqw] font-bold">{name}</b>
            {note}
          </div>
        ))}
      </div>
    </div>
  )
}
