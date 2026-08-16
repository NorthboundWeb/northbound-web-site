import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { ArrowRight } from '@/components/graphics'

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function Container({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[88rem] px-6 lg:px-12', className)}>
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
    <section className={cn('py-24 sm:py-32', className)} {...props}>
      {children}
    </section>
  )
}

/** Technical annotation: a rule, an index number, a label. */
export function Label({
  index,
  children,
  className,
}: {
  index?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <p className={cn('label flex items-center gap-3 text-ink-faint', className)}>
      {index ? <span className="text-accent">{index}</span> : null}
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      {children}
    </p>
  )
}

/**
 * Poster headline. Renders as one enormous condensed word with an orange full
 * stop — the single most recognisable element of the system.
 */
export function Display({
  children,
  stop = true,
  as: As = 'h2',
  className,
}: {
  children: ReactNode
  /** The orange full stop. Off for headlines that continue in a sentence. */
  stop?: boolean
  as?: 'h1' | 'h2' | 'p'
  className?: string
}) {
  return (
    <As
      className={cn(
        'display text-[clamp(3.5rem,15vw,13rem)] text-ink',
        className
      )}
    >
      {children}
      {stop ? <span className="text-accent">.</span> : null}
    </As>
  )
}

const base =
  'group/btn inline-flex items-center justify-center gap-3 text-sm font-medium uppercase tracking-[0.12em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  /** Deep green block, cream text, orange arrow. */
  primary: 'bg-ink text-paper hover:bg-accent hover:text-cream',
  /** Outlined, for secondary weight. */
  secondary: 'border border-line-strong text-ink hover:border-accent hover:text-accent',
  /** Cream on green sections. */
  inverse: 'bg-cream text-green hover:bg-accent hover:text-cream',
} as const

const sizes = {
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-[0.9375rem]',
} as const

type StyleProps = { variant?: keyof typeof variants; size?: keyof typeof sizes }

export function buttonClass({
  variant = 'primary',
  size = 'md',
}: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size])
}

export function ButtonLink({
  href,
  variant = 'primary',
  size,
  className,
  children,
}: StyleProps & { href: string; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={cn(buttonClass({ variant, size }), className)}>
      {children}
      <span
        className={cn(
          'transition-transform duration-200 group-hover/btn:translate-x-1',
          variant === 'primary' || variant === 'inverse'
            ? 'text-accent group-hover/btn:text-current'
            : 'text-accent'
        )}
      >
        <ArrowRight />
      </span>
    </Link>
  )
}

/** Text link with the orange arrow — secondary actions. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group/link label inline-flex items-center gap-2.5 text-ink hover:text-accent',
        className
      )}
    >
      {children}
      <span className="text-accent transition-transform duration-200 group-hover/link:translate-x-1">
        <ArrowRight />
      </span>
    </Link>
  )
}

/**
 * Call to action that also makes its whole card clickable.
 *
 * The card is the positioned ancestor; this link's ::after stretches across it,
 * so a mouse or thumb can hit anywhere on the card. Screen readers and keyboard
 * users still get one short, meaningful link ("Choose Standard") rather than a
 * link whose name is every word in the card.
 *
 * The card needs `group relative`; other interactive elements inside it need
 * `relative z-10` to sit above the overlay.
 */
export function CardCta({
  href,
  children,
  className,
  tone = 'dark',
}: {
  href: string
  children: ReactNode
  className?: string
  /**
   * Which surface the card sits on. Passed as a prop rather than overridden
   * through className: two text colour utilities have equal specificity, so
   * the stylesheet's order decides the winner, not the class attribute's —
   * which silently rendered cream CTAs in near-invisible green.
   */
  tone?: 'dark' | 'light'
}) {
  return (
    <Link
      href={href}
      className={cn(
        "label inline-flex items-center gap-2.5 after:absolute after:inset-0 after:content-[''] group-hover:text-accent",
        tone === 'light' ? 'text-cream' : 'text-ink',
        className
      )}
    >
      {children}
      <span className="text-accent transition-transform duration-200 group-hover:translate-x-1">
        <ArrowRight />
      </span>
    </Link>
  )
}

/** Back-compat alias — some pages still import Arrow. */
export { ArrowRight as Arrow }
