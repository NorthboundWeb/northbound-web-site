'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitEnquiry } from '@/lib/contact'
import { initialContactState } from '@/lib/contact-state'

const fieldClass =
  'w-full border border-ink/25 bg-white px-4 py-3 text-[15px] text-ink focus:border-accent focus:outline-none'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent px-6 py-3.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send message'}
    </button>
  )
}

export function ContactForm() {
  const [state, action] = useActionState(submitEnquiry, initialContactState)

  if (state.status === 'success') {
    return (
      <p role="status" className="border-l-4 border-accent bg-white px-5 py-4">
        {state.message ?? 'Thanks. Your message is on its way.'}
      </p>
    )
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.status === 'error' && state.message ? (
        <p role="alert" className="border-l-4 border-ink bg-white px-5 py-4 text-sm">
          {state.message}
        </p>
      ) : null}

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Your name
        </label>
        <input id="name" name="name" autoComplete="name" required className={fieldClass} aria-describedby={state.errors?.name ? 'name-error' : undefined} />
        {state.errors?.name ? (
          <p id="name-error" className="mt-1.5 text-sm">
            {state.errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email address
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={fieldClass} aria-describedby={state.errors?.email ? 'email-error' : undefined} />
        {state.errors?.email ? (
          <p id="email-error" className="mt-1.5 text-sm">
            {state.errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          How can we help?
        </label>
        <textarea id="message" name="message" rows={6} required className={fieldClass} aria-describedby={state.errors?.message ? 'message-error' : undefined} />
        {state.errors?.message ? (
          <p id="message-error" className="mt-1.5 text-sm">
            {state.errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: hidden from people and screen readers, filled in by bots. */}
      <div aria-hidden style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Submit />
    </form>
  )
}
