'use client'

import { CURRENCIES, CURRENCY_LABELS, type Currency } from '@/lib/money/currency'
import { CURRENCY_COOKIE, PREF_COOKIE_ATTRS } from '@/lib/prefs/cookies'
import { PrefsSelect } from './prefs-select'

export function CurrencySelect({
  value,
  className,
}: {
  value: Currency
  className?: string
}) {
  return (
    <PrefsSelect
      label="Currency"
      name="currency"
      value={value}
      className={className}
      options={CURRENCIES.map((code) => ({
        value: code,
        label: CURRENCY_LABELS[code],
      }))}
      onCommit={(next) => {
        document.cookie = `${CURRENCY_COOKIE}=${next}; ${PREF_COOKIE_ATTRS}`
      }}
    />
  )
}
