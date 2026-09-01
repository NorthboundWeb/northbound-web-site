'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { ArrowRight } from '@/components/graphics'
import { buttonClass, cn } from '@/components/ui'
import { checkUnlock } from './actions'
import { initialUnlockState } from './state'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(buttonClass({ size: 'lg' }), 'group/btn w-full sm:w-auto')}
    >
      {pending ? 'Checking…' : 'Unlock'}
      {pending ? null : (
        <span className="text-accent-on-ink transition-transform duration-200 group-hover/btn:translate-x-1">
          <ArrowRight />
        </span>
      )}
    </button>
  )
}

export function UnlockForm() {
  const [state, action] = useActionState(checkUnlock, initialUnlockState)

  if (state.status === 'valid') {
    return (
      <div className="rise-in border border-accent/40 bg-accent-wash p-8 sm:p-10">
        <p className="label text-accent-deep">Unlocked</p>
        <p className="display mt-4 text-[clamp(2.5rem,7vw,4rem)] text-ink">
          {state.code}
          <span className="text-accent">.</span>
        </p>
        <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-muted">{state.reward}</p>
        <Link
          href={`/contact?unlock=${encodeURIComponent(state.code ?? '')}`}
          className={cn(buttonClass({ size: 'lg' }), 'group/btn mt-8')}
        >
          Start a project
          <span className="text-accent-on-ink transition-transform duration-200 group-hover/btn:translate-x-1">
            <ArrowRight />
          </span>
        </Link>
        <p className="mt-5 text-xs leading-relaxed text-ink-faint">
          Your code travels with the enquiry and is applied to your written quote.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="max-w-lg">
      <label htmlFor="code" className="label block text-ink-faint">
        Enter your code
      </label>
      <input
        id="code"
        name="code"
        type="text"
        required
        autoComplete="off"
        spellCheck={false}
        placeholder="••••••••"
        aria-describedby="unlock-help"
        className="mt-4 w-full border-b-2 border-line-strong bg-transparent pb-4 text-center font-[family-name:var(--font-display)] text-[clamp(2rem,9vw,4rem)] tracking-[0.25em] text-ink uppercase transition-colors placeholder:text-line-strong focus:border-accent focus:outline-none"
      />

      {state.status === 'invalid' ? (
        <p className="rise-in mt-5 text-sm text-ink" role="alert">
          <span aria-hidden className="mr-2 text-accent-deep">
            ▲
          </span>
          That code is not recognised. Check it and try again.
        </p>
      ) : null}
      {state.status === 'throttled' ? (
        <p className="rise-in mt-5 text-sm text-ink" role="alert">
          <span aria-hidden className="mr-2 text-accent-deep">
            ▲
          </span>
          Too many attempts. Try again shortly.
        </p>
      ) : null}

      <div className="mt-8">
        <Submit />
      </div>
      <p id="unlock-help" className="mt-5 text-xs leading-relaxed text-ink-faint">
        Codes appear on Northbound social posts and go out to people I have
        spoken to. They are honoured on your written quote.
      </p>
    </form>
  )
}
