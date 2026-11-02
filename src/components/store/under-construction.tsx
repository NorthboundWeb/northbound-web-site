'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { unlockStore, type UnlockState } from '@/app/store/actions'
import { useT } from '../lang-provider'

/** What visitors without the admin code see at /store. Plain, like the rest of the site. */
export function UnderConstruction() {
  const t = useT()
  const [showCode, setShowCode] = useState(false)
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlockStore, { status: 'idle', message: '' })

  return (
    <section className="page-head wrap st-uc" aria-labelledby="st-uc-h">
      <p className="st-status">
        <i aria-hidden="true" />
        {t('Under construction')}
      </p>
      <h1 id="st-uc-h" className="section-h big">
        {t('The store is coming.')}
        <span>{t('Being built right now.')}</span>
      </h1>
      <p className="section-sub">{t('It is not open yet. Everything else on the site works as normal, and you can still start a project or message me today.')}</p>
      <div className="st-uc-actions">
        <Link className="btn dark" href="/services">
          {t('See the packages')}
        </Link>
        <Link className="btn" href="/start">
          {t('Start a project')}
        </Link>
      </div>

      <div className="st-uc-code">
        {!showCode ? (
          <button type="button" className="st-uc-link" onClick={() => setShowCode(true)}>
            {t('Have a code?')}
          </button>
        ) : (
          <form action={action} className="st-uc-form" noValidate>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr" aria-hidden="true" />
            <label htmlFor="st-code" className="sr">
              {t('Admin code')}
            </label>
            <input id="st-code" name="code" type="password" autoComplete="off" autoFocus placeholder={t('Admin code')} />
            <button type="submit" className="btn dark" disabled={pending}>
              {pending ? t('Checking…') : t('Unlock')}
            </button>
            {state.status === 'error' && (
              <p className="st-uc-err" role="alert">
                {state.message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
