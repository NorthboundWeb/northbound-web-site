'use client'

import { useRef } from 'react'
import { Container, Label } from '@/components/ui'
import { ramp, useScrollProgress } from '@/lib/use-scroll-progress'

/**
 * Devices.
 *
 * A laptop and a phone held in perspective, turning from an angled three-
 * quarter view to face-on as the page scrolls through the section, each
 * showing the same site at its own size.
 *
 * CSS 3D transforms only, driven by the shared scroll-progress hook. The
 * screens are decorative — the real argument is in the captions underneath,
 * which are plain text and always present.
 *
 * Reduced motion: the devices render face-on and still, with no pin.
 */

const CAPTIONS = [
  {
    title: 'Thumb-first buttons',
    body: 'Call and book sit low on the phone, where thumbs actually reach.',
  },
  {
    title: 'Readable without pinching',
    body: 'Text sized for phones, so nobody has to zoom in to read a price.',
  },
  {
    title: 'One site, every size',
    body: 'The same pages rearrange themselves for phones, tablets and laptops.',
  },
] as const

export function Devices() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { progress, enabled } = useScrollProgress(sectionRef)

  const p = enabled ? progress : 1
  const turn = ramp(p, 0.1, 0.78)

  // Starts angled away, settles face-on.
  const laptop = {
    transform: `rotateX(${(1 - turn) * 24}deg) rotateY(${(1 - turn) * -26}deg) translateZ(${turn * 30}px)`,
  }
  const phone = {
    transform: `rotateX(${(1 - turn) * 16}deg) rotateY(${(1 - turn) * 34}deg) translateY(${(1 - turn) * 26}px)`,
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="devices-heading"
      className="border-b border-line"
      style={{ height: enabled ? '240vh' : undefined }}
    >
      <div
        className={
          enabled
            ? 'sticky top-0 flex min-h-dvh items-center py-12'
            : 'py-20 sm:py-28'
        }
      >
        <Container>
          <div className="max-w-2xl">
            <Label>Every screen</Label>
            <h2 id="devices-heading" className="display mt-5 text-4xl sm:text-5xl">
              Built for the phone
              <br />
              in their hand first.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-muted sm:text-lg">
              Most people find a trade on their phone, usually in a hurry and
              often standing in a cold kitchen. The same site works just as well
              on a laptop.
            </p>
          </div>

          <div
            aria-hidden
            className="relative mt-12 h-[46vw] max-h-[420px] min-h-[240px]"
            style={{ perspective: '1600px', perspectiveOrigin: '50% 40%' }}
          >
            {/* Laptop */}
            <div
              className="absolute top-0 left-1/2 w-[76%] max-w-[620px] -translate-x-1/2"
              style={{ ...laptop, transformStyle: 'preserve-3d' }}
            >
              <div className="rounded-t-xl rounded-b bg-[#0b0c0e] p-[1.1%] shadow-2xl">
                <div className="@container aspect-[16/10] overflow-hidden rounded-sm bg-white">
                  <WideMock />
                </div>
              </div>
              <div
                className="mx-[-6%] h-3 rounded-b-xl"
                style={{
                  background: 'linear-gradient(#c9ccd1,#9ea3aa)',
                  transformOrigin: 'top',
                  transform: 'rotateX(70deg)',
                }}
              />
            </div>

            {/* Phone */}
            <div
              className="absolute top-[12%] right-[2%] w-[19%] max-w-[150px] min-w-[86px]"
              style={{ ...phone, transformStyle: 'preserve-3d' }}
            >
              <div className="rounded-[14%] bg-[#0b0c0e] p-[5%] shadow-2xl ring-1 ring-white/10">
                <div className="@container aspect-[9/19] overflow-hidden rounded-[10%] bg-white">
                  <TallMock />
                </div>
              </div>
            </div>
          </div>

          <dl className="mt-12 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
            {CAPTIONS.map((c) => (
              <div key={c.title}>
                <dt className="font-display text-lg tracking-tight uppercase">
                  {c.title}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {c.body}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  )
}

/** Laptop-shaped mock. Sized in cqw so it scales with the lid. */
function WideMock() {
  return (
    <div className="relative h-full w-full bg-white text-[#0c1f3f]">
      <div className="flex h-[7cqw] items-center justify-between bg-[#0c1f3f] px-[4cqw] text-[1.6cqw] text-white">
        <span>Same-day callouts · Mon–Sat</span>
        <b className="text-[#ffb4ae]">Fixed price before we start</b>
      </div>
      <div className="flex items-center justify-between border-b border-[#d9dfe8] px-[4cqw] py-[2.4cqw]">
        <span className="text-[3.4cqw] font-extrabold uppercase">Thornley</span>
        <span className="bg-[#d7261e] px-[2cqw] py-[1.2cqw] text-[2cqw] font-bold text-white">
          0113 496 0123
        </span>
      </div>
      <div className="px-[4cqw] pt-[4cqw]">
        <div className="text-[2cqw] font-bold tracking-[0.12em] text-[#d7261e] uppercase">
          Boiler down?
        </div>
        <div className="mt-[1cqw] w-[58%] text-[6.4cqw] leading-[0.94] font-extrabold uppercase">
          Warm again today.
        </div>
        <div className="mt-[2.4cqw] flex gap-[1.2cqw]">
          <span className="bg-[#d7261e] px-[2.4cqw] py-[1.4cqw] text-[2cqw] font-bold text-white uppercase">
            Book a visit
          </span>
          <span className="px-[2.4cqw] py-[1.4cqw] text-[2cqw] font-bold uppercase shadow-[inset_0_0_0_0.3cqw_#0c1f3f]">
            Get a price
          </span>
        </div>
      </div>
      <div className="absolute top-[26cqw] right-[4cqw] w-[30cqw] bg-[#0c1f3f] p-[2cqw] text-white">
        <div className="text-[1.7cqw] tracking-[0.1em] text-[#ffb4ae] uppercase">
          Repairs from
        </div>
        <div className="text-[6cqw] leading-none font-extrabold">£85</div>
      </div>
    </div>
  )
}

/** Phone-shaped mock, with the actions down at thumb height. */
function TallMock() {
  return (
    <div className="relative h-full w-full bg-white text-[#0c1f3f]">
      <div className="bg-[#0c1f3f] px-[5cqw] pt-[11cqw] pb-[3cqw] text-center text-[4cqw] text-white">
        Same-day callouts
      </div>
      <div className="flex items-center justify-between border-b border-[#d9dfe8] px-[5cqw] py-[4cqw]">
        <span className="text-[6.5cqw] font-extrabold uppercase">Thornley</span>
        <span className="block size-[9cqw] bg-[#f0f3f7]" />
      </div>
      <div className="px-[5cqw] pt-[6cqw]">
        <div className="text-[4cqw] font-bold tracking-[0.1em] text-[#d7261e] uppercase">
          Boiler down?
        </div>
        <div className="mt-[2cqw] text-[12cqw] leading-[0.92] font-extrabold uppercase">
          Warm by tonight.
        </div>
      </div>
      <div className="mt-[6cqw] grid grid-cols-2 gap-[2cqw] px-[5cqw]">
        {['Repairs', 'Servicing', 'Boilers', 'Bathrooms'].map((x) => (
          <div
            key={x}
            className="border-t-[1.2cqw] border-[#d7261e] bg-[#f0f3f7] p-[3cqw] text-[4.5cqw] font-bold uppercase"
          >
            {x}
          </div>
        ))}
      </div>
      {/* Actions at the bottom, where thumbs reach. */}
      <div className="absolute inset-x-0 bottom-0 flex gap-[2cqw] border-t border-[#d9dfe8] bg-white px-[4cqw] pt-[3cqw] pb-[6cqw]">
        <span className="flex-1 bg-[#d7261e] py-[4cqw] text-center text-[5cqw] font-bold text-white uppercase">
          Call
        </span>
        <span className="flex-1 bg-[#0c1f3f] py-[4cqw] text-center text-[5cqw] font-bold text-white uppercase">
          Book
        </span>
      </div>
    </div>
  )
}
