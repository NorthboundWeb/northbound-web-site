'use client'

import { useActionState, useState } from 'react'
import { unlockStore, type UnlockState } from '@/app/store/actions'
import { useT } from '../lang-provider'

/**
 * What everyone without the admin code sees at /store: a quiet "under
 * construction" screen with a moving hazard stripe and a drifting grid, and a
 * tucked-away box for the code.
 */
export function UnderConstruction() {
  const t = useT()
  const [showCode, setShowCode] = useState(false)
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlockStore, { status: 'idle', message: '' })

  return (
    <section className="st-uc" aria-labelledby="st-uc-h">
      <div className="st-uc-bg" aria-hidden="true">
        <svg className="st-uc-grid" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice">
          {Array.from({ length: 21 }, (_, i) => {
            const x = i * 50
            return <line key={`v${i}`} x1={500 + (x - 500) * 0.18} y1="0" x2={500 + (x - 500) * 2.2} y2="600" />
          })}
        </svg>
        <div className="st-uc-rows" />
        <div className="st-uc-glow" />
      </div>
      <div className="st-uc-in">
        <p className="eyebrow">{t('Store')}</p>
        <h1 id="st-uc-h" className="section-h big">
          {t('Under construction.')}
          <span>{t('Something is being built here.')}</span>
        </h1>
        <div className="st-uc-tape" aria-hidden="true">
          <span>
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i}>{t('Under construction')} · </i>
            ))}
          </span>
          <span>
            {Array.from({ length: 8 }, (_, i) => (
              <i key={i}>{t('Under construction')} · </i>
            ))}
          </span>
        </div>
        <p className="st-uc-p">{t('The store is not open yet. Everything else on the site works as normal.')}</p>
        <div className="st-uc-actions">
          <a className="btn dark" href="/services">
            {t('See the packages')}
          </a>
          <a className="btn" href="/">
            {t('Back home')}
          </a>
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
      </div>
    </section>
  )
}
