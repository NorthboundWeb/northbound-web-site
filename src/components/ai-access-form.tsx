'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { ArrowRight } from '@/components/graphics'
import { buttonClass, cn } from '@/components/ui'
import { submitEnquiry } from '@/lib/contact/actions'
import { aiInterestOptions, initialContactState } from '@/lib/contact/schema'

/**
 * Early access to Northbound.AI.
 *
 * Deliberately not the general enquiry form. Someone on this page has already
 * chosen the AI division, so asking them to pick between "a new website" and
 * "Northbound.AI" is a question they have answered by arriving.
 *
 * It posts to the same server action as every other enquiry, so it inherits
 * the honeypot, the submit-time trap, the rate limit, the server-side zod
 * validation and the delivery fallback rather than growing a second, less
 * tested path. `enquiryType` is fixed to 'ai', which is what marks it as an
 * early-access enquiry in the notification.
 */

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
      <span aria-hidden className="text-accent">
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
      {pending ? 'Sending…' : 'Request early access'}
      {pending ? null : (
        <span className="text-accent-on-ink transition-transform duration-200 group-hover/btn:translate-x-1">
          <ArrowRight />
        </span>
      )}
    </button>
  )
}

export function AiAccessForm({
  defaultInterest,
  defaultMessage,
}: {
  /** Preselected from ?employee= or ?team= on the page. */
  defaultInterest?: string
  defaultMessage?: string
}) {
  const [state, formAction] = useActionState(submitEnquiry, initialContactState)
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // Stamped on mount so the server can reject impossibly fast submissions.
  // Written straight to the DOM: it never affects render, so keeping it out
  // of the server HTML avoids a hydration mismatch. Without JavaScript it
  // stays empty, which the action reads as "no signal" rather than a failure.
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
        <p className="label text-accent">Received</p>
        <h2 className="display mt-4 text-4xl text-ink">
          On the list<span className="text-accent">.</span>
        </h2>
        <p className="mt-4 leading-relaxed text-ink-muted">
          Thanks — a person reads every one of these and normally replies
          within one working day. Nothing is charged, and asking commits you to
          nothing.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-8">
      {/* Fixed: arriving here is the answer to "which division?". */}
      <input type="hidden" name="enquiryType" value="ai" />

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

      <div>
        <Label htmlFor="message">Which job would you hand over first?</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          defaultValue={defaultMessage}
          placeholder="The thing that keeps not getting done. A few sentences is plenty."
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? 'message-error' : undefined}
          className={cn(field, 'resize-y')}
        />
        <FieldError id="message-error" message={state.errors?.message} />
      </div>

      <div>
        <Label htmlFor="interest" optional>
          What interests you?
        </Label>
        <select
          id="interest"
          name="interest"
          defaultValue={defaultInterest ?? ''}
          className={field}
        >
          <option value="">Choose one…</option>
          {aiInterestOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <details className="group border border-line bg-paper-sunk">
        <summary className="label flex cursor-pointer items-center gap-2.5 p-4 text-ink-faint transition-colors hover:text-accent">
          <span aria-hidden className="text-accent transition-transform group-open:rotate-90">
            →
          </span>
          Have an UNLOCK code?
        </summary>
        <div className="px-4 pb-4">
          <input
            id="unlock"
            name="unlock"
            type="text"
            placeholder="UNLOCK"
            autoComplete="off"
            spellCheck={false}
            className={cn(field, 'uppercase tracking-[0.2em]')}
            aria-label="UNLOCK code"
          />
        </div>
      </details>

      {/*
        Spam honeypot. `inert` takes the whole subtree out of the accessibility
        tree AND out of the tab order in one attribute, so a screen reader
        never meets an unlabelled textbox — the previous aria-hidden wrapper
        still exposed it. Positioned off-screen rather than display:none,
        because a field that is not rendered is one a bot can skip.
      */}
      <div inert className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="ai-subject">Do not fill this in</label>
        <input
          id="ai-subject"
          name="subject"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />

      <div className="flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <p className="max-w-xs text-xs leading-relaxed text-ink-faint">
          Your details are used only to reply to this enquiry. Nothing is added
          to a mailing list and nothing is passed on.
        </p>
      </div>
    </form>
  )
}
