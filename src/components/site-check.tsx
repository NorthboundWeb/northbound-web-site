'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container, Label, buttonClass } from '@/components/ui'

/**
 * The site self-check.
 *
 * Eight yes/no questions about the visitor's current website, scored on an
 * arc, with whatever they answered "no" to listed back as the things worth
 * fixing.
 *
 * Everything runs in the browser and nothing is sent anywhere, which is said
 * on the page — people are being asked to admit their site is poor, and they
 * will only do that if it plainly costs them nothing.
 *
 * The questions are deliberately ones an owner can answer from memory in a few
 * seconds, standing in a van. No audits, no URL to paste, no score that needs
 * explaining.
 */

const QUESTIONS = [
  {
    q: 'Does it load in under three seconds on mobile data?',
    hint: 'Not on your office wifi — on 4G, outside.',
    fix: 'Speed: slow pages lose people before they see anything.',
  },
  {
    q: 'Can someone tap your phone number and have it ring?',
    hint: 'A number you have to copy out is a number nobody rings.',
    fix: 'Tap-to-call on every page.',
  },
  {
    q: 'Is a price, or a "from" price, visible without enquiring?',
    hint: 'People want a rough idea before they pick up the phone.',
    fix: 'Put a price, or a starting price, where it can be seen.',
  },
  {
    q: 'Does the address bar show a padlock?',
    hint: 'If it says "Not secure", visitors are being warned off.',
    fix: 'An SSL certificate, so browsers stop warning people away.',
  },
  {
    q: 'Does it read on a phone without pinching to zoom?',
    hint: 'Most of your visitors are on a phone.',
    fix: 'A layout that rearranges itself for small screens.',
  },
  {
    q: 'Is there one obvious next step on the home page?',
    hint: 'Call, book, or get a quote — one of them, clearly.',
    fix: 'A single clear action, rather than six competing ones.',
  },
  {
    q: 'Do you come up on Google for your trade and your town?',
    hint: 'Search it the way a customer would.',
    fix: 'The basics of local search, and a Google Business Profile.',
  },
  {
    q: 'Has anything on it changed in the last year?',
    hint: 'Old prices and dead links cost more trust than you think.',
    fix: 'Somewhere to keep it current without starting over.',
  },
] as const

type Answer = boolean | null

export function SiteCheck() {
  const [answers, setAnswers] = useState<Answer[]>(
    () => Array(QUESTIONS.length).fill(null) as Answer[],
  )

  const answered = answers.filter((a) => a !== null).length
  const score = answers.filter((a) => a === true).length
  const misses = QUESTIONS.filter((_, i) => answers[i] === false)
  const done = answered === QUESTIONS.length

  const set = (i: number, value: boolean) =>
    setAnswers((prev) => {
      const next = [...prev]
      next[i] = next[i] === value ? null : value
      return next
    })

  // Arc geometry: r=56 circle, drawn from the top.
  const circumference = 2 * Math.PI * 56
  const filled = answered === 0 ? 0 : score / QUESTIONS.length

  const verdict = !done
    ? { title: 'Answer the questions', body: 'Your score fills in as you go.' }
    : score >= 7
      ? {
          title: 'In good shape',
          body: 'Little to fix. A management plan would keep it that way.',
        }
      : score >= 4
        ? {
            title: 'Worth a look',
            body: 'The bones are there. A few fixes would do a lot.',
          }
        : {
            title: 'Costing you work',
            body: 'Enough is missing that people are leaving before they call.',
          }

  return (
    <section
      aria-labelledby="check-heading"
      className="border-b border-line py-20 sm:py-28"
    >
      <Container>
        <div className="flex items-start justify-between">
          <Label>Check your website</Label>
          <span className="label text-accent">
            {answered}/{QUESTIONS.length}
          </span>
        </div>

        <div className="mt-6 max-w-2xl">
          <h2 id="check-heading" className="display text-4xl sm:text-5xl">
            How does
            <br />
            yours score?
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink-muted sm:text-lg">
            Eight questions about the website you have now. Under a minute, and
            nothing is sent anywhere — it all stays in your browser.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <ol className="border-t border-line">
            {QUESTIONS.map((item, i) => {
              const a = answers[i]
              return (
                <li
                  key={item.q}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug font-medium sm:text-base">
                      {item.q}
                    </p>
                    <p className="mt-1 text-xs text-ink-faint">{item.hint}</p>
                  </div>
                  <div
                    role="group"
                    aria-label={item.q}
                    className="flex shrink-0 border border-line"
                  >
                    <button
                      type="button"
                      aria-pressed={a === true}
                      onClick={() => set(i, true)}
                      className={`press cursor-pointer px-4 py-1.5 text-sm ${
                        a === true
                          ? 'bg-olive text-cream'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      aria-pressed={a === false}
                      onClick={() => set(i, false)}
                      className={`press cursor-pointer border-l border-line px-4 py-1.5 text-sm ${
                        a === false
                          ? 'bg-accent text-accent-ink'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-line bg-paper-raised p-7 text-center">
              <svg
                viewBox="0 0 140 140"
                className="mx-auto w-40 max-w-full"
                role="img"
                aria-label={`Score ${score} out of ${QUESTIONS.length}`}
              >
                <circle
                  cx="70"
                  cy="70"
                  r="56"
                  fill="none"
                  stroke="var(--line)"
                  strokeWidth="12"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="56"
                  fill="none"
                  stroke={
                    filled >= 0.85
                      ? 'var(--olive)'
                      : filled >= 0.5
                        ? 'var(--mustard)'
                        : 'var(--accent)'
                  }
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - filled)}
                  transform="rotate(-90 70 70)"
                  style={{
                    transition:
                      'stroke-dashoffset var(--t-stage) var(--ease-out), stroke var(--t-slow) ease',
                  }}
                />
                <text
                  x="70"
                  y="78"
                  textAnchor="middle"
                  className="font-display fill-ink"
                  style={{ fontSize: '46px' }}
                >
                  {score}
                </text>
                <text
                  x="70"
                  y="98"
                  textAnchor="middle"
                  className="label fill-ink-faint"
                  style={{ fontSize: '11px' }}
                >
                  OUT OF {QUESTIONS.length}
                </text>
              </svg>

              <h3 className="display mt-5 text-2xl">{verdict.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {verdict.body}
              </p>

              {misses.length > 0 ? (
                <ul className="mt-6 space-y-2 border-t border-line pt-5 text-left text-sm text-ink-muted">
                  {misses.map((m) => (
                    <li key={m.q} className="flex gap-2.5">
                      <span aria-hidden className="text-accent">
                        →
                      </span>
                      {m.fix}
                    </li>
                  ))}
                </ul>
              ) : null}

              <Link
                href="/contact"
                className={`${buttonClass()} mt-6 w-full justify-center`}
              >
                Get a quote
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
