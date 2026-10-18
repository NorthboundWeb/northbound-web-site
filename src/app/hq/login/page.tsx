import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isHqAuthed } from '@/lib/hq/auth'
import { readHqConfig } from '@/lib/hq/session'
import { login } from '../actions'
import { Notice, buttonClass, inputClass } from '../_components/ui'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (await isHqAuthed()) redirect('/hq')

  const { error } = await searchParams
  const configured = readHqConfig() !== null

  return (
    <div className="mx-auto max-w-md pt-10">
      <h1 className="display mb-8 text-5xl">Sign in</h1>

      {!configured ? (
        <Notice tone="info">
          <p className="mb-2 font-semibold text-chalk">HQ is locked until it has a password.</p>
          <p className="mb-2">
            In Vercel, open <strong>Project → Settings → Environment Variables</strong> and add:
          </p>
          <ul className="mb-2 list-disc space-y-1 pl-5">
            <li>
              <code>HQ_PASSWORD</code>: at least 12 characters
            </li>
            <li>
              <code>HQ_SESSION_SECRET</code>: a random string of at least 32 characters
            </li>
          </ul>
          <p>Then redeploy. Nothing is stored in the code, and until both are set nobody can sign in.</p>
        </Notice>
      ) : null}

      {error === 'wait' ? (
        <Notice tone="error">Too many attempts. Wait a few minutes and try again.</Notice>
      ) : error ? (
        <Notice tone="error">That did not work. Check the password and try again.</Notice>
      ) : null}

      <form action={login} className="space-y-5">
        <div>
          <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-chalk-muted">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </div>
        <button type="submit" className={buttonClass}>
          Sign in
        </button>
      </form>
    </div>
  )
}
