'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { ArrowRight } from '@/components/graphics'
import { cn } from '@/components/ui'
import { STATUS_LABEL, employeeBySlug } from '@/lib/ai/employees'
import { outcomes } from '@/lib/ai/outcomes'
import { teamBySlug } from '@/lib/ai/teams'

/**
 * "What do you need help with?"
 *
 * Most people arrive knowing the problem, not the product. Pick a problem and
 * the right employees — and the team built around them — appear underneath.
 *
 * Built as a radio group so arrow keys move between outcomes and a screen
 * reader announces "3 of 6". The result region is `aria-live` and given a
 * `key`, so choosing a different outcome re-announces rather than silently
 * swapping content under someone who cannot see it change.
 *
 * Nothing is hidden behind JavaScript that matters: every employee and team
 * is also listed in full further down the page.
 */
export function OutcomePicker() {
  const groupId = useId()
  const [active, setActive] = useState(outcomes[0])

  const picked = active.employees
    .map(employeeBySlug)
    .filter((e) => e !== undefined)
  const team = active.team ? teamBySlug(active.team) : undefined

  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <fieldset className="border-0 p-0">
        <legend className="label mb-5 text-ink-faint">
          Pick the one that sounds like you
        </legend>
        <div className="flex flex-col">
          {outcomes.map((o, i) => {
            const id = `${groupId}-${o.slug}`
            const on = o.slug === active.slug
            return (
              <div key={o.slug} className="relative">
                <input
                  type="radio"
                  name={`${groupId}-outcome`}
                  id={id}
                  checked={on}
                  onChange={() => setActive(o)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className={cn(
                    'flex cursor-pointer items-baseline gap-4 border-b border-line py-4 transition-colors duration-150',
                    'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent',
                    on ? 'text-ink' : 'text-ink-muted hover:text-ink'
                  )}
                >
                  <span
                    className={cn('label shrink-0', on ? 'text-accent' : 'text-ink-faint')}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="display text-[clamp(1.5rem,5vw,2.25rem)] leading-none">
                    {o.label}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      'ml-auto h-2 w-2 shrink-0 self-center transition-colors duration-150',
                      on ? 'bg-accent' : 'bg-transparent'
                    )}
                  />
                </label>
              </div>
            )
          })}
        </div>
      </fieldset>

      <div
        key={active.slug}
        aria-live="polite"
        className="rise-in border border-line bg-paper-raised p-6 sm:p-8"
      >
        <p className="label text-ink-faint">Who does this</p>
        <p className="mt-4 text-[17px] leading-relaxed text-ink">{active.detail}</p>

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {picked.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/ai/employees/${e.slug}`}
                className="group flex items-baseline gap-4 py-4 transition-colors hover:text-accent"
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 self-center"
                  style={{ backgroundColor: `var(${e.colourVar})` }}
                />
                <span className="display text-2xl text-ink group-hover:text-accent">
                  {e.name}
                </span>
                <span className="label text-ink-faint">{e.role}</span>
                <span className="label ml-auto shrink-0 text-ink-faint">
                  {STATUS_LABEL[e.status]}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {team ? (
          <div className="mt-8">
            <p className="label text-ink-faint">Or hire the team</p>
            <Link
              href={`/ai/services/${team.slug}`}
              className="group mt-3 inline-flex items-baseline gap-3"
            >
              <span className="display text-[clamp(1.75rem,6vw,2.5rem)] text-ink group-hover:text-accent">
                {team.name}
              </span>
              <span className="text-accent transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRight />
              </span>
            </Link>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              {team.outcome}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
