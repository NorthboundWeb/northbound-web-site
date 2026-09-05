'use client'

import { useRouter } from 'next/navigation'
import { useId, useTransition } from 'react'
import { cn } from '@/components/ui'

/**
 * A preference dropdown — currency, language.
 *
 * A native <select> on purpose. It is keyboard-operable, announced correctly
 * by screen readers, works with a touch keyboard, and needs no roving
 * tabindex, focus trap or listbox ARIA that could be got wrong. The visible
 * label is text, never a flag: a flag names a country, not a language.
 *
 * Selecting writes the cookie and refreshes the server render, so the new
 * value arrives in HTML rather than being patched in afterwards.
 */
export function PrefsSelect({
  label,
  name,
  value,
  options,
  onCommit,
  className,
}: {
  label: string
  name: string
  value: string
  options: { value: string; label: string }[]
  /** Persists the choice. Runs before the refresh. */
  onCommit: (next: string) => void
  className?: string
}) {
  const id = useId()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <label htmlFor={id} className="label text-chalk-faint">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        disabled={pending}
        onChange={(event) => {
          onCommit(event.target.value)
          startTransition(() => router.refresh())
        }}
        className="label min-h-11 cursor-pointer border border-line bg-transparent px-2.5 py-2 text-chalk transition-colors hover:border-chalk-faint focus-visible:border-chalk disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-black text-chalk">
            {option.label}
          </option>
        ))}
      </select>
    </span>
  )
}
