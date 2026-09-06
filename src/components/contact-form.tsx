'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { ArrowRight } from '@/components/graphics'
import { buttonClass, cn } from '@/components/ui'
import type { Dictionary } from '@/i18n/dictionaries'
import { submitEnquiry } from '@/lib/contact/actions'
import {
  EMPLOYEES_INTEREST,
  budgetBands,
  initialContactState,
  projectTypes,
} from '@/lib/contact/schema'

const fieldClass =
  'w-full border border-line-ink bg-white px-4 py-3.5 text-[15px] text-ink transition-colors placeholder:text-ink-faint hover:border-line-ink-strong focus:border-orange focus:outline-none'

function Label({
  htmlFor,
  children,
  optional,
  optionalLabel,
}: {
  htmlFor: string
  children: React.ReactNode
  optional?: boolean
  optionalLabel?: string
}) {
  return (
    <label htmlFor={htmlFor} className="label mb-2.5 block text-ink">
      {children}
      {optional ? (
        <span className="ml-2 text-ink-faint normal-case">{optionalLabel}</span>
      ) : null}
    </label>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 text-sm text-ink" role="alert">
      <span aria-hidden className="mr-1.5 text-orange-ink">
        ▲
      </span>
      {message}
    </p>
  )
}

/**
 * Maps a stored project-type identifier to its label in the reader's language.
 *
 * Package and plan names are product names and stay as they are; only the two
 * generic options and the employees enquiry have translations.
 */
function translateProjectType(type: string, t: Dictionary['contact']): string {
  if (type === 'Not sure yet') return t.form.notSure
  if (type === 'Something else') return t.form.somethingElse
  if (type === EMPLOYEES_INTEREST) return t.form.employeesInterest
  return type
}

function SubmitButton({ labels }: { labels: { submit: string; submitting: string } }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(buttonClass({ variant: 'solid', size: 'lg' }), 'w-full sm:w-auto')}
    >
      {pending ? labels.submitting : labels.submit}
      {pending ? null : (
        <span className="transition-transform duration-200 group-hover/btn:translate-x-1">
          <ArrowRight />
        </span>
      )}
    </button>
  )
}

export function ContactForm({
  defaultProjectType,
  currency = 'GBP',
  language = 'en',
  t,
  privacyHref,
}: {
  /** Preselected from /contact?package=… — the visitor can still change it. */
  defaultProjectType?: string
  /** What the visitor was seeing prices in, sent with the enquiry. */
  currency?: string
  /** The locale the visitor was reading, sent with the enquiry. */
  language?: string
  /** The contact slice of the dictionary — labels, options and messages. */
  t: Dictionary['contact']
  /** Locale-aware path to the privacy notice. */
  privacyHref: string
}) {
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
        className="border border-line-ink bg-cream-sunk p-10 focus:outline-none"
      >
        <p className="label text-orange-ink">{t.form.sentLabel}</p>
        <h2 className="display mt-4 text-4xl text-ink">{t.form.sentHeading}</h2>
        <p className="mt-3 leading-relaxed text-ink-muted">
          {state.message ??
            'Thanks — your message is with me. I normally reply within one working day.'}
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
          <p className="border-l-2 border-orange bg-cream-sunk px-4 py-3 text-sm text-ink">
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">{t.form.name}</Label>
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
          <Label htmlFor="email">{t.form.email}</Label>
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
        <Label htmlFor="business" optional optionalLabel={t.form.optional}>
          {t.form.business}
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
          <Label htmlFor="projectType" optional optionalLabel={t.form.optional}>
            {t.form.projectType}
          </Label>
          <select
            id="projectType"
            name="projectType"
            defaultValue={defaultProjectType ?? ''}
            className={fieldClass}
          >
            <option value="">{t.form.projectTypePlaceholder}</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {/*
                  The value is the stable identifier stored in the enquiry;
                  only the visible label is translated, so a French visitor
                  and an English one produce the same recorded answer.
                */}
                {translateProjectType(type, t)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="budget" optional optionalLabel={t.form.optional}>
            {t.form.budget}
          </Label>
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className={fieldClass}
          >
            <option value="">{t.form.projectTypePlaceholder}</option>
            {budgetBands.map((band, i) => (
              <option key={band} value={band}>
                {t.form.budgets[i] ?? band}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">{t.form.message}</Label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder={t.form.messagePlaceholder}
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={state.errors?.message ? 'message-error' : undefined}
          className={cn(fieldClass, 'resize-y')}
        />
        <FieldError id="message-error" message={state.errors?.message} />
      </div>

      {/*
        Honeypot. Present in the DOM for anything that fills fields
        indiscriminately, but out of sight, out of the tab order and out of the
        accessibility tree for everyone else.

        The position is set inline rather than only through a class: if the
        stylesheet fails to load, a class-only rule would put a field labelled
        "Do not fill this in" in the middle of the form. The inline style is
        part of the document, so it cannot go missing separately.
      */}
      <div
        aria-hidden
        className="absolute left-[-9999px] h-px w-px overflow-hidden"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        <label htmlFor="website">Do not fill this in</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          // Belt and braces: nothing should reach it, but if anything does,
          // it must not be announced or reported as a required field.
          aria-hidden
        />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />
      {/* Context for whoever reads the enquiry: what they saw, in what. */}
      <input type="hidden" name="currency" value={currency} readOnly />
      <input type="hidden" name="language" value={language} readOnly />

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton labels={{ submit: t.form.submit, submitting: t.form.submitting }} />
        <p className="max-w-xs text-xs leading-relaxed text-ink-faint">
          {t.form.privacyNote}{' '}
          <Link href={privacyHref} className="text-orange-ink underline underline-offset-4">
            {t.form.privacyLink}
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
