'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { ArrowRight } from '@/components/graphics'
import { buttonClass, cn } from '@/components/ui'
import { submitEnquiry } from '@/lib/contact/actions'
import {
  buildScopeOptions,
  enquiryTypes,
  initialContactState,
  managementPlanOptions,
  projectSizes,
  type EnquiryTypeId,
} from '@/lib/contact/schema'

// No `focus:outline-none` here: it suppressed the global :focus-visible
// ring and left a border tint as the only cue, which is not a visible focus
// indicator for a keyboard user.
const field =
  'w-full border border-line bg-paper-raised px-4 py-3.5 text-[15px] text-ink transition-colors placeholder:text-ink-faint hover:border-line-strong focus:border-accent'

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string
  children: React.ReactNode
  optional?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="label mb-2.5 block text-ink">
      {children}
      {optional ? (
        <span className="ml-2 normal-case text-ink-faint">(optional)</span>
      ) : null}
    </label>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 flex gap-2 text-sm text-ink" role="alert">
      <span aria-hidden className="text-accent-deep">
        ▲
      </span>
      {message}
    </p>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(buttonClass({ size: 'lg' }), 'group/btn w-full sm:w-auto')}
    >
      {pending ? 'Sending…' : 'Send enquiry'}
      {pending ? null : (
        <span className="text-accent-on-ink transition-transform duration-200 group-hover/btn:translate-x-1">
          <ArrowRight />
        </span>
      )}
    </button>
  )
}

export function ContactForm({
  defaultType = 'build',
  defaultScope,
  defaultPlan,
  defaultUnlock,
  defaultMessage,
}: {
  defaultType?: EnquiryTypeId
  defaultScope?: string
  defaultPlan?: string
  defaultUnlock?: string
  /** Lets a page carry context in — the employee someone arrived from. */
  defaultMessage?: string
}) {
  const [state, formAction] = useActionState(submitEnquiry, initialContactState)
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // Stamped on mount so the server can reject impossibly fast submissions.
  // Written straight to the DOM: it never affects render, and keeping it out
  // of the server HTML avoids a hydration mismatch. Without JS it stays empty,
  // which the action treats as "no signal" rather than a failure.
  const startedAtRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now())
  }, [])

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
    if (state.status !== 'idle') statusRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rise-in border border-line bg-paper-sunk p-10 focus:outline-none"
      >
        <p className="label text-accent-deep">Received</p>
        <h2 className="display mt-4 text-4xl text-ink">
          Enquiry sent<span className="text-accent">.</span>
        </h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          {state.message ??
            'Thanks — your enquiry is with me. I normally reply within one working day.'}
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="enquiry space-y-10">
      <div
        ref={statusRef}
        tabIndex={-1}
        role="alert"
        aria-live="polite"
        className="focus:outline-none"
      >
        {state.status === 'error' && state.message ? (
          <div className="rise-in border-l-2 border-accent bg-paper-sunk px-5 py-4">
            <p className="text-sm leading-relaxed text-ink">{state.message}</p>
            {state.fallbackMailto ? (
              <a
                href={state.fallbackMailto}
                className={cn(buttonClass({ size: 'md' }), 'group/btn mt-4')}
              >
                Send it from your email app
                <span className="text-accent-on-ink transition-transform duration-200 group-hover/btn:translate-x-1">
                  <ArrowRight />
                </span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* 01 — what they need. Drives every conditional field below via CSS. */}
      <fieldset>
        <legend className="label mb-4 text-ink-faint">
          <span className="mr-3 text-accent-deep">01</span> What do you need?
        </legend>
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {enquiryTypes.map((t) => (
            <div key={t.id} className="bg-paper">
              <input
                type="radio"
                name="enquiryType"
                id={`type-${t.id}`}
                value={t.id}
                defaultChecked={t.id === defaultType}
                className="peer sr-only"
              />
              <label
                htmlFor={`type-${t.id}`}
                className="flex h-full cursor-pointer flex-col p-6 transition-colors hover:bg-paper-raised peer-checked:bg-accent-wash peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent"
              >
                <span className="label flex items-center gap-2.5 text-ink">
                  <span
                    aria-hidden
                    className="dot inline-block h-2 w-2 shrink-0 rounded-full border border-line-strong transition-colors"
                  />
                  {t.label}
                </span>
                <span className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                  {t.blurb}
                </span>
              </label>
            </div>
          ))}
          {/* The grid is drawn by its own background showing through 1px gaps,
              so an unfilled cell would render as a solid block of rule colour.
              Five options never fill a row of two or three. */}
          <div aria-hidden className="hidden bg-paper sm:block" />
        </div>
      </fieldset>

      {/* 02 — who they are. Always shown. */}
      <fieldset className="space-y-6">
        <legend className="label mb-4 text-ink-faint">
          <span className="mr-3 text-accent-deep">02</span> About you
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Your name</Label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-invalid={Boolean(state.errors?.name)}
              aria-describedby={state.errors?.name ? 'name-error' : undefined}
              className={field}
            />
            <FieldError id="name-error" message={state.errors?.name} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(state.errors?.email)}
              aria-describedby={state.errors?.email ? 'email-error' : undefined}
              className={field}
            />
            <FieldError id="email-error" message={state.errors?.email} />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="business" optional>
              Business name
            </Label>
            <input
              id="business"
              name="business"
              type="text"
              autoComplete="organization"
              className={field}
            />
          </div>
          <div>
            <Label htmlFor="phone" optional>
              Phone
            </Label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              className={field}
            />
          </div>
        </div>
      </fieldset>

      {/* 03 — branching. Hidden groups are display:none via CSS :has(). */}
      <fieldset className="space-y-6">
        <legend className="label mb-4 text-ink-faint">
          <span className="mr-3 text-accent-deep">03</span> About the project
        </legend>

        <div data-when="build" className="rise-in grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="scope" optional>
              Which scope looks right?
            </Label>
            <select id="scope" name="scope" defaultValue={defaultScope ?? ''} className={field}>
              <option value="">Choose one…</option>
              {buildScopeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="size" optional>
              Roughly how big?
            </Label>
            <select id="size" name="size" defaultValue="" className={field}>
              <option value="">Choose one…</option>
              {projectSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div data-when="management" className="rise-in">
          <Label htmlFor="plan" optional>
            Which plan looks right?
          </Label>
          <select id="plan" name="plan" defaultValue={defaultPlan ?? ''} className={field}>
            <option value="">Choose one…</option>
            {managementPlanOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div data-when="management help" className="rise-in">
          <Label htmlFor="existingUrl" optional>
            Your current website
          </Label>
          <input
            id="existingUrl"
            name="existingUrl"
            type="text"
            inputMode="url"
            placeholder="yourbusiness.co.uk"
            className={field}
          />
        </div>

        <div>
          <Label htmlFor="message">
            <span data-when="build">What does your business do, and what is the site for?</span>
            <span data-when="management">What would you want looking after?</span>
            <span data-when="help">What is going wrong?</span>
            <span data-when="ai">Which job would you hand over first?</span>
            <span data-when="other">What do you need?</span>
          </Label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            defaultValue={defaultMessage}
            placeholder="A few sentences is plenty. Include a deadline if you have one."
            aria-invalid={Boolean(state.errors?.message)}
            aria-describedby={state.errors?.message ? 'message-error' : undefined}
            className={cn(field, 'resize-y')}
          />
          <FieldError id="message-error" message={state.errors?.message} />
        </div>

        <details className="group border border-line bg-paper-sunk">
          <summary className="label flex cursor-pointer items-center gap-2.5 p-4 text-ink-faint transition-colors hover:text-accent-deep">
            <span aria-hidden className="text-accent-deep transition-transform group-open:rotate-90">
              →
            </span>
            Have an UNLOCK code?
          </summary>
          <div className="px-4 pb-4">
            <input
              id="unlock"
              name="unlock"
              type="text"
              defaultValue={defaultUnlock ?? ''}
              placeholder="UNLOCK"
              autoComplete="off"
              spellCheck={false}
              className={cn(field, 'uppercase tracking-[0.2em]')}
              aria-label="UNLOCK code"
            />
            <p className="mt-2.5 text-xs leading-relaxed text-ink-faint">
              Applied to your written quote. Codes are checked when I read your enquiry.
            </p>
          </div>
        </details>
      </fieldset>

      {/*
        Spam honeypot, named so no password manager or browser autofill
        targets it.

        `inert` removes the whole subtree from the accessibility tree AND the
        tab order in one attribute. The previous `aria-hidden` wrapper did
        not: it still surfaced as "Do not fill this in" followed by an
        unnamed textbox, because aria-hidden around a focusable control is
        invalid and assistive technology does not reliably honour it.

        Still positioned off-screen rather than display:none — a field that
        is never rendered is one a bot can cheaply learn to skip — and still
        posted, so the server-side check is unchanged.
      */}
      <div inert className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="subject">Do not fill this in</label>
        <input id="subject" name="subject" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />

      <div className="flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <p className="max-w-xs text-xs leading-relaxed text-ink-faint">
          Your details are used only to reply to this enquiry. Nothing is added to a
          mailing list and nothing is passed on.
        </p>
      </div>
    </form>
  )
}
