import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

/** Consistent page gutter and max measure. */
export function Container({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-6 lg:px-10', className)}>
      {children}
    </div>
  )
}

export function Section({
  className,
  children,
  ...props
}: ComponentProps<'section'>) {
  return (
    <section className={cn('py-20 sm:py-28', className)} {...props}>
      {children}
    </section>
  )
}

/** Small-caps label with a rule — the recurring structural motif. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-3">
      <span aria-hidden className="h-px w-6 bg-line-strong" />
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-5 text-3xl leading-[1.15] font-normal sm:text-4xl">
        {title}
      </h2>
      {lede ? (
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">{lede}</p>
      ) : null}
    </div>
  )
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60'

const buttonVariants = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
  secondary:
    'border border-line-strong text-ink hover:border-ink hover:bg-paper-sunk',
} as const

const buttonSizes = {
  md: 'px-5 py-2.5',
  lg: 'px-6 py-3 text-base',
} as const

type ButtonStyleProps = {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
}

export function buttonClass({
  variant = 'primary',
  size = 'md',
}: ButtonStyleProps = {}) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size])
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: ButtonStyleProps & {
  href: string
  className?: string
  children: ReactNode
}) {
  return (
    <Link href={href} className={cn(buttonClass({ variant, size }), className)}>
      {children}
    </Link>
  )
}

export function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}
