'use client'

import { useRef } from 'react'
import { Container, Label } from '@/components/ui'
import { ramp, useScrollProgress } from '@/lib/use-scroll-progress'

/**
 * The rebuild stage.
 *
 * A tall section with a sticky viewport inside it. As the page scrolls through
 * the section, a dated trade website is taken apart and reassembled as a modern
 * one, a step at a time.
 *
 * No animation library. Scroll position maps to a 0–1 progress value, and that
 * value drives opacity and transform on the layers. Progress is read inside a
 * single rAF-throttled scroll listener, so there is one measurement per frame
 * at most.
 *
 * Reduced motion: the effect is skipped entirely and the rebuilt site is shown
 * outright, with the steps listed in full. Nothing is hidden behind motion.
 *
 * The mock sites are sized in container-query units (cqw) against a fixed
 * aspect ratio, so they scale to any width without measuring anything in JS.
 *
 * Thornley Heating is invented. Its prices are illustrative and 0113 496 is a
 * number range reserved for drama and demonstrations.
 */

const STEPS = [
  {
    title: 'Clear out the clutter',
    detail: 'Visitor counters, Comic Sans and "under construction" go first.',
  },
  {
    title: 'Put things where people look',
    detail: 'Phone number top right. Services in a row. The price where it is seen.',
  },
  {
    title: 'Say what you do, plainly',
    detail: 'One headline about the problem you fix, and two buttons.',
  },
  {
    title: 'Make it safe and quick',
    detail: 'A padlock, fast pages, and a number that rings when tapped.',
  },
] as const

export function RebuildStage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { progress, enabled } = useScrollProgress(sectionRef)

  // With motion off, show the finished state and every step.
  const p = enabled ? progress : 1
  const activeStep = enabled
    ? Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))
    : -1

  const oldOut = ramp(p, 0.08, 0.62) // the dated site fading away
  const newIn = ramp(p, 0.3, 0.84) // the rebuilt site arriving
  const secure = p > 0.72 // the address bar gaining its padlock

  return (
    <section
      ref={sectionRef}
      aria-labelledby="rebuild-heading"
      className="relative border-b border-line"
      style={{ height: enabled ? '320vh' : undefined }}
    >
      <div
        className={
          enabled
            ? 'sticky top-0 flex min-h-dvh items-center py-12'
            : 'py-20 sm:py-28'
        }
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
            <div>
              <Label>The rebuild</Label>
              <h2
                id="rebuild-heading"
                className="display mt-5 text-4xl sm:text-5xl"
              >
                Same business.
                <br />
                Ten years apart.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
                Thornley Heating is invented, but its website is the one we find
                on half the trades in the county. Here is what changes.
              </p>

              <ol className="mt-8 border-t border-line">
                {STEPS.map((step, i) => {
                  const on = activeStep === i || !enabled
                  const done = enabled && activeStep > i
                  return (
                    <li
                      key={step.title}
                      className="relative border-b border-line py-3 pl-10"
                    >
                      <span
                        aria-hidden
                        className={`label absolute top-3.5 left-0 tabular-nums transition-colors duration-300 ${
                          on || done ? 'text-accent' : 'text-ink-faint'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`block font-display text-lg tracking-tight uppercase transition-colors duration-300 ${
                          on ? 'text-ink' : 'text-ink-faint'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span
                        className={
                          on
                            ? 'mt-1 block text-sm leading-relaxed text-ink-muted'
                            : 'sr-only'
                        }
                      >
                        {step.detail}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div>
              <div className="rounded-lg border border-line bg-paper-raised p-2 shadow-sm">
                {/* Address bar */}
                <div className="flex items-center gap-3 px-1.5 pt-1 pb-2.5">
                  <span aria-hidden className="flex gap-1.5">
                    <i className="block size-2 rounded-full bg-line-strong" />
                    <i className="block size-2 rounded-full bg-line-strong" />
                    <i className="block size-2 rounded-full bg-line-strong" />
                  </span>
                  <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-paper-sunk px-3 py-1 text-[11px] text-ink-faint">
                    <span
                      className={
                        secure ? 'text-olive' : 'text-accent shrink-0 font-medium'
                      }
                    >
                      {secure ? '🔒' : 'Not secure'}
                    </span>
                    <span className="truncate">
                      {secure
                        ? 'https://thornleyheating.co.uk'
                        : 'http://thornley-heating.example'}
                    </span>
                  </span>
                </div>

                {/* Screen. Everything inside sizes itself in cqw. */}
                <div className="@container relative aspect-[760/500] overflow-hidden rounded bg-white">
                  <DatedSite opacity={1 - oldOut} progress={p} />
                  <RebuiltSite opacity={newIn} />
                </div>
              </div>

              <p className="mt-3 text-xs text-ink-faint">
                Thornley Heating is a made-up business and its prices are
                examples.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

/** The 2014 site. Clutter leaves in stages before the whole layer fades. */
function DatedSite({
  opacity,
  progress,
}: {
  opacity: number
  progress: number
}) {
  const clutterGone = progress > 0.18
  return (
    <div
      aria-hidden
      className="absolute inset-0 font-serif text-[#111] transition-opacity duration-200"
      style={{ opacity, backgroundColor: '#fffbe6' }}
    >
      <div
        className="absolute inset-x-[2.4cqw] top-[2.8cqw] border-[0.4cqw] border-[#b8b8b8] p-[1.3cqw] text-center"
        style={{ background: 'linear-gradient(#e7eefb,#b9c9ea)' }}
      >
        <b className="block text-[3.9cqw] tracking-wide text-[#1a2fa0] underline">
          THORNLEY PLUMBING &amp; HEATING LTD
        </b>
        <small
          className="text-[1.8cqw] text-[#b00] transition-opacity duration-300"
          style={{ opacity: clutterGone ? 0 : 1 }}
        >
          ~ Quality Work At Affordable Prices ~
        </small>
      </div>

      <div className="absolute inset-x-0 top-[21cqw] text-center text-[1.8cqw] text-[#00e]">
        <u className="mx-[0.8cqw]">Home</u>|<u className="mx-[0.8cqw]">About Us</u>|
        <u className="mx-[0.8cqw]">Services</u>|<u className="mx-[0.8cqw]">Gallery</u>|
        <u className="mx-[0.8cqw]">Contact Us</u>
      </div>

      <div
        className="absolute inset-x-0 top-[25cqw] text-center text-[2.9cqw] text-[#c00] transition-opacity duration-300"
        style={{ opacity: clutterGone ? 0 : 1, fontFamily: 'Comic Sans MS, cursive' }}
      >
        Welcome To Our Website!!!
      </div>

      <div className="absolute inset-x-[2.4cqw] top-[33cqw] grid h-[29cqw] grid-cols-[38%_1fr] gap-[0.3cqw] border-[0.26cqw] border-[#ccc] p-[0.3cqw] text-[1.8cqw]">
        <div className="border border-[#ccc] p-[1cqw]">
          <b>OUR SERVICES:</b>
          <br />* Boilers
          <br />* Central Heating
          <br />* Bathrooms
          <br />* Leaks &amp; Repairs
          <span
            className="mt-[0.8cqw] inline-block border border-dashed border-[#c90] bg-[#ff0] px-[0.8cqw] text-[1.5cqw] transition-opacity duration-300"
            style={{ opacity: clutterGone ? 0 : 1 }}
          >
            Page Under Construction
          </span>
        </div>
        <div className="border border-[#ccc] p-[1cqw]">
          We are a family run buisness serving the area for many years. No job to
          big or to small!!
          <br />
          <br />
          <span
            className="font-bold text-[#c00] transition-opacity duration-300"
            style={{ opacity: clutterGone ? 0 : 1 }}
          >
            *** NEW *** We now do power flushing!!
          </span>
          <br />
          <br />
          Tel: 0113 496 0123
          <br />
          Fax: 0113 496 0124
        </div>
      </div>

      <div
        className="absolute inset-x-[2.4cqw] bottom-[1.6cqw] text-center text-[1.4cqw] text-[#555] transition-opacity duration-300"
        style={{ opacity: clutterGone ? 0 : 1 }}
      >
        Visitors:{' '}
        <span className="bg-black px-[0.6cqw] font-mono tracking-[0.2em] text-[#0f0]">
          004213
        </span>{' '}
        | © 2014 Thornley Plumbing &amp; Heating | Best viewed at 1024x768
      </div>
    </div>
  )
}

/** The rebuilt site. Its own brand, deliberately not Northbound's. */
function RebuiltSite({ opacity }: { opacity: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-white text-[#0c1f3f]"
      style={{ opacity, transform: `translateY(${(1 - opacity) * 1.5}cqw)` }}
    >
      <div className="absolute inset-x-0 top-0 flex h-[4cqw] items-center justify-between bg-[#0c1f3f] px-[3.4cqw] text-[1.5cqw] text-white">
        <span>Same-day callouts · Mon–Sat 8am–6pm</span>
        <b className="text-[#ffb4ae]">Fixed price before we start</b>
      </div>

      <div className="absolute inset-x-0 top-[4cqw] flex h-[8cqw] items-center justify-between border-b border-[#d9dfe8] px-[3.4cqw]">
        <span className="flex items-center gap-[1cqw] text-[3.2cqw] leading-none font-extrabold uppercase">
          <span
            className="block size-[2.9cqw] bg-[#d7261e]"
            style={{ clipPath: 'polygon(50% 0,100% 38%,82% 100%,18% 100%,0 38%)' }}
          />
          Thornley
        </span>
        <span className="hidden gap-[2.6cqw] text-[1.8cqw] text-[#46546b] @md:flex">
          <span>Boilers</span>
          <span>Repairs</span>
          <span>Bathrooms</span>
          <span>Areas</span>
        </span>
        <span className="bg-[#d7261e] px-[1.8cqw] py-[1.2cqw] text-[2.1cqw] font-bold tracking-wide text-white uppercase">
          0113 496 0123
        </span>
      </div>

      <div className="absolute top-[15cqw] left-[3.4cqw] w-[52cqw]">
        <small className="block text-[2cqw] font-bold tracking-[0.12em] text-[#d7261e] uppercase">
          Boiler down?
        </small>
        <h3 className="mt-[0.8cqw] text-[6.8cqw] leading-[0.92] font-extrabold uppercase">
          We&apos;ll have you warm again today.
        </h3>
        <p className="mt-[1.6cqw] text-[2cqw] leading-snug text-[#46546b]">
          Heating engineers covering the county. A fixed price before any work
          starts, and we tidy up after ourselves.
        </p>
        <div className="mt-[2.1cqw] flex gap-[1cqw]">
          <span className="bg-[#d7261e] px-[2.1cqw] py-[1.4cqw] text-[2.1cqw] font-bold tracking-wide text-white uppercase">
            Book a visit
          </span>
          <span className="px-[2.1cqw] py-[1.4cqw] text-[2.1cqw] font-bold tracking-wide uppercase shadow-[inset_0_0_0_0.26cqw_#0c1f3f]">
            Get a price
          </span>
        </div>
      </div>

      <div className="absolute top-[15.5cqw] right-[3.4cqw] w-[35cqw] bg-[#0c1f3f] p-[2.4cqw] text-white">
        <span className="absolute inset-x-0 top-0 h-[0.65cqw] bg-[#d7261e]" />
        <div className="mt-[0.5cqw] text-[1.8cqw] tracking-[0.1em] text-[#ffb4ae] uppercase">
          Boiler repairs from
        </div>
        <div className="text-[7.6cqw] leading-none font-extrabold">£85</div>
        <ul className="mt-[1.3cqw] grid gap-[0.8cqw] text-[1.7cqw]">
          <li>Same-day if you call before 2pm</li>
          <li>Price agreed before we start</li>
          <li>12-month guarantee on parts</li>
        </ul>
      </div>

      <div className="absolute inset-x-[3.4cqw] bottom-[2.6cqw] grid grid-cols-3 gap-[1.3cqw]">
        {[
          ['Repairs', 'Same day'],
          ['Servicing', 'From £70'],
          ['New boilers', 'Free survey'],
        ].map(([name, note]) => (
          <div
            key={name}
            className="border-t-[0.4cqw] border-[#d7261e] bg-[#f0f3f7] px-[1.6cqw] py-[1.3cqw] text-[1.7cqw] text-[#46546b]"
          >
            <b className="block text-[2.4cqw] font-bold uppercase text-[#0c1f3f]">
              {name}
            </b>
            {note}
          </div>
        ))}
      </div>
    </div>
  )
}
