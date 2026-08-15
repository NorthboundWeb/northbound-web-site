'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Arrow, buttonClass, cn } from '@/components/ui'
import { submitEnquiry } from '@/lib/contact/actions'
import {
  budgetBands,
  initialContactState,
  projectTypes,
} from '@/lib/contact/schema'

const fieldClass =
  'w-full rounded-lg border border-line bg-paper-raised px-4 py-3 text-[15px] text-ink transition-colors placeholder:text-ink-faint hover:border-line-strong focus:border-accent focus:outline-none'

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
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
      {children}
      {optional ? (
        <span className="ml-1.5 font-normal text-ink-faint">(optional)</span>
      ) : null}
    </label>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 text-sm text-ink" role="alert">
      <span aria-hidden className="mr-1.5 text-accent">
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
      className={cn(buttonClass({ size: 'lg' }), 'w-full sm:w-auto')}
    >
      {pending ? 'Sending…' : 'Send enquiry'}
      {pending ? null : <Arrow />}
    </button>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitEnquiry, initialContactState)
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // Stamped when the form mounts, so the server can reject submissions that
  // arrive impossibly fast. Written straight to the DOM rather than held in
  // state: it never affects what React renders, and keeping it out of the
  // server-rendered HTML avoids a hydration mismatch on the timestamp.
  //
  // With JavaScript disabled the field stays empty, which the action treats as
  // "no signal" rather than a failure — so the form still works without JS.
  const startedAtRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now())
    }
  }, [])

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
    }
    if (state.status !== 'idle') {
      statusRef.current?.focus()
    }
  }, [state])

  if (state.status === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-accent/30 bg-accent-wash p-8 focus:outline-none"
      >
        <h2 className="font-serif text-2xl">Message sent</h2>
        <p className="mt-3 leading-relaxed text-ink-muted">
          {state.message ??
            'Thanks — your message is with me. I reply within one working day.'}
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-6">
      <div
        ref={statusRef}
        tabIndex={-1}
        role="alert"
        aria-live="polite"
        className="focus:outline-none"
      >
        {state.status === 'error' && state.message ? (
          <p className="rounded-lg border border-line-strong bg-paper-sunk px-4 py-3 text-sm">
            {state.message}
          </p>
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
            className={fieldClass}
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
            className={fieldClass}
          />
          <FieldError id="email-error" message={state.errors?.email} />
        </div>
      </div>

      <div>
        <Label htmlFor="business" optional>
          Business name
        </Label>
        <input
          id="business"
          name="business"
          type="text"
          autoComplete="organization"
          className={fieldClass}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="projectType" optional>
            What do you need?
          </Label>
          <select
            id="projectType"
            name="projectType"
            defaultValue=""
            className={fieldClass}
          >
            <option value="">Choose one…</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="budget" optional>
            Rough budget
          </Label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className={fieldClass}
          >
            <option value="">Choose one…</option>
            {budgetBands.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">About the project</Label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="What does your business do, what is the site or system for, and is there a date you need it by?"
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? 'message-error' : undefined}
          className={cn(fieldClass, 'resize-y')}
        />
        <FieldError id="message-error" message={state.errors?.message} />
      </div>

      {/* Honeypot. Hidden from sight and from assistive tech, but present in
          the DOM for anything that fills fields indiscriminately. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Do not fill this in</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <p className="max-w-xs text-xs leading-relaxed text-ink-faint">
          Your details are used only to reply to this enquiry. Nothing is added
          to a mailing list and nothing is passed on.
        </p>
      </div>
    </form>
  )
}
