'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LOCALES, LOCALE_META, localePath, splitLocale, type Locale } from '@/i18n/config'
import { LOCALE_COOKIE, PREF_COOKIE_ATTRS } from '@/lib/prefs/cookies'
import { PrefsSelect } from './prefs-select'

/**
 * Language selector.
 *
 * Switching navigates to the same page in the new language rather than
 * bouncing to the homepage — someone reading the pricing page in English
 * wants the pricing page in French, not to start again. The cookie is written
 * first so the proxy honours the choice on any later unprefixed URL.
 */
export function LanguageSelect({
  value,
  className,
}: {
  value: Locale
  className?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <PrefsSelect
      label="Language"
      name="language"
      value={value}
      className={className}
      refreshOnChange={false}
      options={LOCALES.map((code) => ({
        value: code,
        // Each language names itself. A reader looking for German is looking
        // for "Deutsch".
        label: LOCALE_META[code].name,
      }))}
      onCommit={(next) => {
        document.cookie = `${LOCALE_COOKIE}=${next}; ${PREF_COOKIE_ATTRS}`
        const { path } = splitLocale(pathname)
        router.push(localePath(next as Locale, path))
      }}
    />
  )
}
