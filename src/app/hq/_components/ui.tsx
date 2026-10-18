import type { ReactNode } from 'react'

/**
 * Small presentational pieces shared across the HQ pages. Plain server
 * components with no state, built on the site's own colour tokens so HQ looks
 * like part of Northbound rather than a separate admin theme.
 */

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export const inputClass =
  'w-full border border-line-strong bg-char-sunk px-3.5 py-3 text-[15px] text-chalk placeholder:text-chalk-faint transition-colors hover:border-chalk-muted focus:border-orange focus:outline-none'

export const buttonClass =
  'inline-flex items-center justify-center gap-2 bg-orange px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:bg-orange-lit focus-visible:outline-offset-2 disabled:opacity-50'

export const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 border border-line-strong px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-chalk transition-colors hover:border-chalk-muted'

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
}) {
  return (
    <header className="mb-10 border-b border-line pb-8">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="display text-5xl sm:text-6xl">{title}</h1>
      {children ? <div className="mt-4 max-w-2xl text-[15px] text-chalk-muted">{children}</div> : null}
    </header>
  )
}

export function Panel({
  title,
  children,
  className,
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('border border-line bg-char p-6', className)}>
      {title ? (
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-chalk-muted">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  )
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-chalk-muted">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-chalk-faint">{hint}</p> : null}
    </div>
  )
}

export function Notice({
  tone,
  children,
}: {
  tone: 'error' | 'success' | 'info'
  children: ReactNode
}) {
  const styles = {
    error: 'border-orange text-chalk',
    success: 'border-yellow text-chalk',
    info: 'border-line-strong text-chalk-muted',
  }[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('mb-6 border-l-4 bg-char px-4 py-3 text-sm', styles)}>
      {children}
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  lead: 'border-line-strong text-chalk-muted',
  intake: 'border-yellow text-yellow',
  building: 'border-orange text-orange',
  live: 'border-chalk text-chalk',
  paused: 'border-line-strong text-chalk-faint',
  archived: 'border-line text-chalk-faint',
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-block border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em]',
        STATUS_STYLES[status] ?? STATUS_STYLES.lead
      )}
    >
      {status}
    </span>
  )
}
