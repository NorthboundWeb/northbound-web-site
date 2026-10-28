'use client'

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { useFormStatus } from 'react-dom'
import { Arrow, buttonClass, cn } from '@/components/ui'
import { submitBooking } from '@/lib/contact/actions'
import {
  PLAN_NOTE,
  STEP_COUNT,
  bookingBudgets,
  budgetLabel,
  emptyBooking,
  formatDay,
  helpOptions,
  initialBookingState,
  planOptions,
  slotOptions,
  stepOfField,
  timelineOptions,
  upcomingWeekdays,
  validateStep,
  type BookingErrors,
  type BookingField,
  type BookingInput,
} from '@/lib/contact/booking'
import { site } from '@/lib/site'

const fieldClass =
  'w-full rounded-lg border border-line bg-paper-raised px-4 py-3.5 text-[15px] text-ink transition-colors placeholder:text-ink-faint hover:border-line-strong focus:border-accent focus:outline-none aria-[invalid=true]:border-accent'

/** The element to focus when a step is refused, keyed by the field at fault. */
const focusId: Partial<Record<BookingField, string>> = {
  help: 'help-0',
  budget: 'budget-0',
  timeline: 'timeline-0',
  name: 'name',
  email: 'email',
  day: 'day-0',
  slot: 'slot-0',
}

/**
 * One question per screen, in the style of a guided booking page: the
 * question is the headline, the answers are big pills, and one button moves
 * you on. Five steps, then a preferred call time, then a summary.
 */
const steps: { title: string; mark: string; sub: string }[] = [
  {
    title: 'What do you need help with',
    mark: '?',
    sub: 'Select all that apply. You can change your mind on the call.',
  },
  {
    title: 'What is your working budget',
    mark: '?',
    sub: 'A rough range is fine. It helps me suggest the right size of build, not a bigger one. The package prices themselves are fixed and published.',
  },
  {
    title: 'When do you want to be live',
    mark: '?',
    sub: 'Pick the closest.',
  },
  {
    title: 'Tell me about you',
    mark: '.',
    sub: 'So I know who I am talking to before the call.',
  },
  {
    title: 'Pick a time',
    mark: '.',
    sub: 'A free 20-minute video or phone call, UK time. I confirm the slot by email, or offer another if it has gone.',
  },
]

const pillClass =
  'press block cursor-pointer select-none rounded-full border-2 border-line-strong bg-paper-raised font-bold text-ink transition-colors hover:border-accent peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent'

const pillSizes = {
  md: 'px-6 py-3.5 pt-4 text-[17px]',
  sm: 'px-5 py-2.5 pt-3 text-[15px]',
} as const

function Pill({
  id,
  name,
  type,
  checked,
  onChange,
  children,
  size = 'md',
}: {
  id: string
  name: string
  type: 'radio' | 'checkbox'
  checked: boolean
  onChange: () => void
  children: ReactNode
  size?: keyof typeof pillSizes
}) {
  return (
    <label className="relative">
      <input
        id={id}
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className={cn(pillClass, pillSizes[size])}>{children}</span>
    </label>
  )
}

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string
  children: ReactNode
  optional?: string
}) {
  return (
    <label htmlFor={htmlFor} className="label mb-2.5 block text-ink">
      {children}
      {optional ? <span className="ml-2 text-ink-faint normal-case">({optional})</span> : null}
    </label>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-3 text-sm text-ink" role="alert">
      <span aria-hidden className="mr-1.5 text-accent">
        ▲
      </span>
      {message}
    </p>
  )
}

function Progress({ step, done }: { step: number; done: boolean }) {
  return (
    <ol className="flex gap-2" aria-label="Progress">
      {Array.from({ length: STEP_COUNT }, (_, i) => {
        const state = done || i < step ? 'done' : i === step ? 'here' : 'next'
        return (
          <li
            key={i}
            aria-current={state === 'here' ? 'step' : undefined}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              state === 'next' ? 'bg-line' : 'bg-accent'
            )}
          >
            <span className="sr-only">
              Step {i + 1}
              {state === 'done' ? ', done' : state === 'here' ? ', current' : ''}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function NextButton({ children }: { children: ReactNode }) {
  return (
    <button type="submit" className={cn(buttonClass({ size: 'lg' }), 'rounded-full px-8')}>
      {children}
      <span className="text-accent transition-transform duration-200 group-hover/btn:translate-x-1">
        <Arrow />
      </span>
    </button>
  )
}

function SendButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(buttonClass({ size: 'lg' }), 'rounded-full px-8')}
    >
      {pending ? 'Sending…' : 'Request this time'}
      {pending ? null : (
        <span className="text-accent transition-transform duration-200 group-hover/btn:translate-x-1">
          <Arrow />
        </span>
      )}
    </button>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="label text-ink-faint underline-offset-4 hover:text-accent hover:underline"
    >
      Back
    </button>
  )
}

export function BookingFlow() {
  const [f, setF] = useState<BookingInput>(emptyBooking)
  const [step, setStep] = useState(0)
  const [errs, setErrs] = useState<BookingErrors>({})
  const [state, formAction] = useActionState(submitBooking, initialBookingState)
  const done = state.status === 'success'

  // The picker is drawn from "now" once, so the list does not shift under a
  // visitor who leaves the tab open over midnight.
  const [now] = useState(() => new Date())
  const days = useMemo(() => upcomingWeekdays(now, 10), [now])

  const rootRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const startedAtRef = useRef(0)
  const firstRun = useRef(true)

  useEffect(() => {
    startedAtRef.current = Date.now()
  }, [])

  // Move focus to the new step's heading so a keyboard or screen-reader user
  // lands where the content changed. Skipped on the first render.
  const shown = done ? STEP_COUNT : step
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [shown])

  const set = (patch: Partial<BookingInput>) => {
    setF((prev) => ({ ...prev, ...patch }))
    setErrs((prev) => {
      const rest = { ...prev }
      for (const key of Object.keys(patch) as BookingField[]) delete rest[key]
      return rest
    })
  }

  const go = (n: number) => {
    setStep(n)
    setErrs({})
    requestAnimationFrame(() => {
      const el = rootRef.current
      if (el && el.getBoundingClientRect().top < 0) {
        const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' })
      }
    })
  }

  const next = (event: FormEvent) => {
    event.preventDefault()
    const found = validateStep(step, f)
    const first = (Object.keys(found) as BookingField[])[0]
    if (first) {
      setErrs(found)
      requestAnimationFrame(() => {
        const id = focusId[first]
        if (id) document.getElementById(id)?.focus()
      })
      return
    }
    go(step + 1)
  }

  const toggleHelp = (item: string) =>
    set({ help: f.help.includes(item) ? f.help.filter((x) => x !== item) : [...f.help, item] })

  const send = (formData: FormData) => {
    formData.set('startedAt', String(startedAtRef.current))
    formAction(formData)
  }

  const firstName = f.name.trim().split(/\s+/)[0] || 'there'
  const current = steps[Math.min(step, STEP_COUNT - 1)]

  // ── Heading ─────────────────────────────────────────────────────────────
  const heading = done ? (
    <>
      <p className="label text-accent">Request sent</p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="display mt-5 text-[clamp(2.5rem,6vw,5rem)] text-ink focus:outline-none"
      >
        You are on the way, {firstName}
        <span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">{state.message}</p>
      {state.ref ? <p className="label mt-4 text-ink-faint">Ref {state.ref}</p> : null}
    </>
  ) : (
    <>
      <p className="label text-accent">
        Book a call · Step {step + 1} of {STEP_COUNT}
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="display mt-5 text-[clamp(2.5rem,6vw,5rem)] text-ink focus:outline-none"
      >
        {current.title}
        <span className="text-accent">{current.mark}</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">{current.sub}</p>
    </>
  )

  // ── Steps ───────────────────────────────────────────────────────────────
  let body: ReactNode

  if (done) {
    const rows: [string, string][] = [
      ['Preferred call', `${formatDay(f.day)} at ${f.slot} (UK time)`],
      ['Needs', f.help.join(', ')],
      ['Working budget', budgetLabel(f.budget)],
      ['Timeline', f.timeline],
      ['Contact', `${f.name.trim()} · ${f.email.trim()}`],
    ]
    body = (
      <div role="status" className="rise-in">
        <dl className="grid gap-3 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-line bg-paper-sunk px-6 py-5"
            >
              <dt className="label text-ink-faint">{label}</dt>
              <dd className="mt-2 text-[17px] font-bold leading-snug text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <ol className="mt-10 divide-y divide-line border-y border-line">
          {[
            [
              'Next',
              'I confirm the time',
              'By email, normally within one working day. If that slot has gone I will offer the nearest one.',
            ],
            [
              'Then',
              'We talk for 20 minutes',
              'Your current site or socials, what the new one needs to do, and your timeline. No charge, no obligation.',
            ],
            [
              'After',
              'A written quote',
              'With a fixed scope and a fixed price. If a smaller package would do, I will say so.',
            ],
          ].map(([tag, head, text]) => (
            <li key={tag} className="grid grid-cols-[3.5rem_1fr] gap-3 py-4">
              <span className="label pt-0.5 text-accent">{tag}</span>
              <div>
                <p className="font-medium text-ink">{head}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    )
  } else if (step === 0) {
    body = (
      <form noValidate onSubmit={next} className="rise-in">
        <fieldset aria-describedby={errs.help ? 'help-error' : undefined}>
          <legend className="sr-only">What do you need help with?</legend>
          <div className="flex flex-wrap gap-3">
            {helpOptions.map((item, i) => (
              <Pill
                key={item}
                id={`help-${i}`}
                name="help"
                type="checkbox"
                checked={f.help.includes(item)}
                onChange={() => toggleHelp(item)}
              >
                {item}
              </Pill>
            ))}
          </div>
          <FieldError id="help-error" message={errs.help} />
        </fieldset>

        <div className="mt-10 max-w-2xl">
          <label htmlFor="other" className="block text-xl font-extrabold text-ink">
            What else do you need?
            <span className="label ml-3 text-ink-faint">optional</span>
          </label>
          <textarea
            id="other"
            rows={3}
            placeholder="Anything that would help me prepare: sites you like, features you need, what is not working now."
            value={f.other}
            onChange={(e) => set({ other: e.target.value })}
            aria-invalid={Boolean(errs.other)}
            aria-describedby={errs.other ? 'other-error' : undefined}
            className={cn(fieldClass, 'mt-4 resize-y')}
          />
          <FieldError id="other-error" message={errs.other} />
        </div>

        <Controls
          left={<span className="text-sm text-ink-faint">Free 20-minute call · No obligation</span>}
          right={<NextButton>Continue</NextButton>}
        />
      </form>
    )
  } else if (step === 1) {
    body = (
      <form noValidate onSubmit={next} className="rise-in">
        <fieldset aria-describedby={errs.budget ? 'budget-error' : undefined}>
          <legend className="sr-only">Working budget</legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bookingBudgets.map((band, i) => (
              <label key={band.id} className="relative block">
                <input
                  id={`budget-${i}`}
                  type="radio"
                  name="budget"
                  checked={f.budget === band.id}
                  onChange={() => set({ budget: band.id })}
                  className="peer sr-only"
                />
                <span className="press block h-full cursor-pointer rounded-2xl border-2 border-line-strong bg-paper-raised p-6 transition-colors hover:border-accent peer-checked:border-accent peer-checked:bg-accent-wash peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent">
                  <span className="display block text-2xl text-ink">{band.label}</span>
                  <span className="mt-3 block text-sm leading-relaxed text-ink-muted">
                    {band.note}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <FieldError id="budget-error" message={errs.budget} />
        </fieldset>

        <fieldset className="mt-10" aria-describedby={errs.plan ? 'plan-error' : undefined}>
          <legend className="text-xl font-extrabold text-ink">
            Open to a monthly plan?
            <span className="label ml-3 text-ink-faint">optional</span>
          </legend>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{PLAN_NOTE}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {planOptions.map((option, i) => (
              <Pill
                key={option}
                id={`plan-${i}`}
                name="plan"
                type="radio"
                checked={f.plan === option}
                onChange={() => set({ plan: option })}
                size="sm"
              >
                {option}
              </Pill>
            ))}
          </div>
          <FieldError id="plan-error" message={errs.plan} />
        </fieldset>

        <Controls left={<BackButton onClick={() => go(0)} />} right={<NextButton>Continue</NextButton>} />
      </form>
    )
  } else if (step === 2) {
    body = (
      <form noValidate onSubmit={next} className="rise-in">
        <fieldset aria-describedby={errs.timeline ? 'timeline-error' : undefined}>
          <legend className="sr-only">Timeline</legend>
          <div className="flex flex-wrap gap-3">
            {timelineOptions.map((option, i) => (
              <Pill
                key={option}
                id={`timeline-${i}`}
                name="timeline"
                type="radio"
                checked={f.timeline === option}
                onChange={() => set({ timeline: option })}
              >
                {option}
              </Pill>
            ))}
          </div>
          <FieldError id="timeline-error" message={errs.timeline} />
        </fieldset>
        <Controls left={<BackButton onClick={() => go(1)} />} right={<NextButton>Continue</NextButton>} />
      </form>
    )
  } else if (step === 3) {
    body = (
      <form noValidate onSubmit={next} className="rise-in max-w-3xl">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="name">Your name</FieldLabel>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={f.name}
              onChange={(e) => set({ name: e.target.value })}
              aria-invalid={Boolean(errs.name)}
              aria-describedby={errs.name ? 'name-error' : undefined}
              className={fieldClass}
            />
            <FieldError id="name-error" message={errs.name} />
          </div>
          <div>
            <FieldLabel htmlFor="business" optional="optional">
              Business name
            </FieldLabel>
            <input
              id="business"
              type="text"
              autoComplete="organization"
              value={f.business}
              onChange={(e) => set({ business: e.target.value })}
              aria-invalid={Boolean(errs.business)}
              aria-describedby={errs.business ? 'business-error' : undefined}
              className={fieldClass}
            />
            <FieldError id="business-error" message={errs.business} />
          </div>
          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={f.email}
              onChange={(e) => set({ email: e.target.value })}
              aria-invalid={Boolean(errs.email)}
              aria-describedby={errs.email ? 'email-error' : undefined}
              className={fieldClass}
            />
            <FieldError id="email-error" message={errs.email} />
          </div>
          <div>
            <FieldLabel htmlFor="phone" optional="optional">
              Phone
            </FieldLabel>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={f.phone}
              onChange={(e) => set({ phone: e.target.value })}
              aria-invalid={Boolean(errs.phone)}
              aria-describedby={errs.phone ? 'phone-error' : undefined}
              className={fieldClass}
            />
            <FieldError id="phone-error" message={errs.phone} />
          </div>
        </div>
        <div className="mt-6">
          <FieldLabel htmlFor="site" optional="optional">
            Current website or Instagram
          </FieldLabel>
          <input
            id="site"
            type="text"
            inputMode="url"
            placeholder="yourbusiness.co.uk or @yourhandle"
            value={f.site}
            onChange={(e) => set({ site: e.target.value })}
            aria-invalid={Boolean(errs.site)}
            aria-describedby={errs.site ? 'site-error' : undefined}
            className={fieldClass}
          />
          <FieldError id="site-error" message={errs.site} />
        </div>
        <Controls left={<BackButton onClick={() => go(2)} />} right={<NextButton>Continue</NextButton>} />
      </form>
    )
  } else {
    body = (
      <form action={send} noValidate className="rise-in">
        {state.status === 'error' ? (
          <div
            role="alert"
            className="mb-8 rounded-xl border-l-2 border-accent bg-paper-raised px-5 py-4 text-sm"
          >
            <p>{state.message}</p>
            {state.errors ? (
              <ul className="mt-2 space-y-1">
                {(Object.entries(state.errors) as [BookingField, string][]).map(
                  ([field, message]) => (
                    <li key={field}>
                      {message}{' '}
                      <button
                        type="button"
                        onClick={() => go(stepOfField[field])}
                        className="label text-accent underline-offset-4 hover:underline"
                      >
                        Fix
                      </button>
                    </li>
                  )
                )}
              </ul>
            ) : null}
          </div>
        ) : null}

        <fieldset aria-describedby={errs.day ? 'day-error' : undefined}>
          <legend className="label mb-3 block text-ink">Day</legend>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(5.25rem,1fr))] gap-2.5">
            {days.map(({ iso, date }, i) => (
              <label key={iso} className="relative block">
                <input
                  id={`day-${i}`}
                  type="radio"
                  name="day-pick"
                  checked={f.day === iso}
                  onChange={() => set({ day: iso, slot: '' })}
                  className="peer sr-only"
                />
                <span className="press flex cursor-pointer flex-col items-center rounded-xl border-2 border-line-strong bg-paper-raised px-2 py-3 transition-colors hover:border-accent peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent">
                  <span className="label text-[0.625rem] opacity-80">
                    {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                  </span>
                  <span className="display mt-1 text-2xl">{date.getDate()}</span>
                  <span className="mt-0.5 text-xs opacity-80">
                    {date.toLocaleDateString('en-GB', { month: 'short' })}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <FieldError id="day-error" message={errs.day} />
        </fieldset>

        <fieldset className="mt-8" aria-describedby={errs.slot ? 'slot-error' : undefined}>
          <legend className="label mb-3 block text-ink">
            Time
            {f.day ? (
              <span className="ml-2 text-ink-faint normal-case">· {formatDay(f.day)}</span>
            ) : null}
          </legend>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2.5">
            {slotOptions.map((slot, i) => (
              <label key={slot} className="relative block">
                <input
                  id={`slot-${i}`}
                  type="radio"
                  name="slot-pick"
                  disabled={!f.day}
                  checked={f.slot === slot}
                  onChange={() => set({ slot })}
                  className="peer sr-only"
                />
                <span className="press block cursor-pointer rounded-xl border-2 border-line-strong bg-paper-raised py-3.5 pt-4 text-center text-[15px] font-bold tabular-nums text-ink transition-colors hover:border-accent peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-ink peer-disabled:cursor-not-allowed peer-disabled:opacity-40 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent">
                  {slot}
                </span>
              </label>
            ))}
          </div>
          <FieldError id="slot-error" message={errs.slot} />
          <p className="mt-4 text-xs leading-relaxed text-ink-faint">
            This is a preferred time, not a confirmed one. I check the diary and confirm by
            email. Sending this does not commit you to anything or take payment.
          </p>
        </fieldset>

        {/* The answers travel as hidden fields; the server checks every one again. */}
        {f.help.map((item) => (
          <input key={item} type="hidden" name="help" value={item} />
        ))}
        <input type="hidden" name="other" value={f.other} />
        <input type="hidden" name="budget" value={f.budget} />
        <input type="hidden" name="plan" value={f.plan} />
        <input type="hidden" name="timeline" value={f.timeline} />
        <input type="hidden" name="name" value={f.name} />
        <input type="hidden" name="business" value={f.business} />
        <input type="hidden" name="email" value={f.email} />
        <input type="hidden" name="phone" value={f.phone} />
        <input type="hidden" name="site" value={f.site} />
        <input type="hidden" name="day" value={f.day} />
        <input type="hidden" name="slot" value={f.slot} />

        {/* Honeypot, as on the other forms. */}
        <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Do not fill this in</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Controls left={<BackButton onClick={() => go(3)} />} right={<SendButton />} />
      </form>
    )
  }

  return (
    <div ref={rootRef} className="relative">
      <noscript>
        <p className="mb-8 rounded-xl border border-line bg-paper-sunk p-6 text-[15px]">
          This page needs JavaScript. You can email me at{' '}
          <a className="text-accent underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>{' '}
          instead, and we will find a time.
        </p>
      </noscript>

      <Progress step={step} done={done} />
      <div className="mt-12">{heading}</div>
      <div className="mt-12">{body}</div>
    </div>
  )
}

function Controls({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
}
