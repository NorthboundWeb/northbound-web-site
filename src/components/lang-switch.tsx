'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { LANGS, LANG_COOKIE } from '@/lib/i18n'
import { useLang, useT } from './lang-provider'

/** The little language chip in the header pill. Opens a short list; the choice sticks for a year. */
export function LangSwitch() {
  const lang = useLang()
  const t = useT()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const here = LANGS.find((l) => l.code === lang) ?? LANGS[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function choose(code: string) {
    document.cookie = `${LANG_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="lang" ref={box}>
      <button
        type="button"
        className="pillbar-chip lang-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('Language')}
        title={t('Language')}
        onClick={() => setOpen((o) => !o)}
      >
        {here.short}
      </button>
      {open && (
        <ul className="lang-pop" role="listbox" aria-label={t('Language')}>
          {LANGS.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button type="button" lang={l.html} onClick={() => choose(l.code)} className={l.code === lang ? 'on' : undefined}>
                {l.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
