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
    <div className={cn('mx-auto w-full max-w-[90rem] px-6 lg:px-12', className)}>
      {children}
    </div>
  )
}

export function Section({ className, children, ...props }: ComponentProps<'section'>) {
  return (
    <section className={cn('py-20 sm:py-28 lg:py-32', className)} {...props}>
      {children}
    </section>
  )
}

/**
 * Editorial eyebrow: a small tracked label closed by a thin rule.
 *
 * `tone` names the surface rather than being overridden through className —
 * two colour utilities of equal specificity are resolved by stylesheet order,
 * not by the order they appear in the class attribute.
 */
export function Label({
  children,
  className,
  tone = 'dark',
}: {
  children: ReactNode
  className?: string
  /** 'dark' = on the near-black ground. 'light' = on cream. */
  tone?: 'dark' | 'light'
}) {
  return (
    <p
      className={cn(
        'label flex items-center gap-4',
        tone === 'light' ? 'text-ink-faint' : 'text-chalk-muted',
        className
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          'h-px w-10 sm:w-16',
          tone === 'light' ? 'bg-line-ink-strong' : 'bg-line-strong'
        )}
      />
    </p>
  )
}

/** Poster headline — condensed, uppercase, tight. */
export function Display({
  children,
  as: As = 'h2',
  size = 'md',
  className,
}: {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'p'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizes = {
    sm: 'text-[clamp(1.75rem,4.5vw,2.75rem)]',
    md: 'text-[clamp(2.25rem,6vw,4rem)]',
    lg: 'text-[clamp(2.75rem,7.5vw,5.5rem)]',
  }
  return <As className={cn('display', sizes[size], className)}>{children}</As>
}

/**
 * "Coming soon" marker.
 *
 * Used wherever Northbound Employees appear. Deliberately looks deliberate —
 * a bordered technical badge in the division's own yellow, not a greyed-out
 * disabled state that reads as broken.
 */
export function ComingSoon({
  children = 'Coming soon',
  tone = 'dark',
  className,
}: {
  children?: ReactNode
  /**
   * Which surface the badge sits on. Signal yellow is the Northbound.AI accent
   * and reads correctly on the near-black ground, but it is only 1.6:1 on
   * cream — nowhere near legible. On cream the badge keeps its shape and
   * deliberate look in ink, and yellow survives only as the marker square,
   * which carries no information on its own.
   */
  tone?: 'dark' | 'light'
  className?: string
}) {
  const light = tone === 'light'
  return (
    <span
      className={cn(
        'label inline-flex items-center gap-2 border px-3 py-1.5',
        light
          ? 'border-line-ink-strong text-ink'
          : 'border-yellow/50 text-yellow',
        className
      )}
    >
      <span
        aria-hidden
        className={cn('h-1.5 w-1.5', light ? 'bg-orange' : 'bg-yellow')}
      />
      {children}
    </span>
  )
}

const base =
  'group/btn inline-flex items-center justify-center gap-3 label transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  /** Near-black block with cream text — the primary action on cream. */
  solid: 'bg-black text-cream hover:bg-char-raised',
  /** Cream block with dark text — the primary action on the dark ground. */
  light: 'bg-cream text-black hover:bg-white',
  /** Signal yellow — Northbound.AI only. */
  yellow: 'bg-yellow text-black hover:bg-yellow-lit',
  /** Outlined on the dark ground. */
  outline:
    'border border-line-strong text-chalk hover:border-chalk hover:bg-chalk hover:text-black',
  /** Outlined on cream. */
  outlineInk:
    'border border-line-ink-strong text-ink hover:border-ink hover:bg-black hover:text-cream',
} as const

const sizes = {
  md: 'px-6 py-3.5',
  lg: 'px-8 py-4.5',
} as const

type StyleProps = { variant?: keyof typeof variants; size?: keyof typeof sizes }

export function buttonClass({ variant = 'solid', size = 'md' }: StyleProps = {}) {
  return cn(base, variants[variant], sizes[size])
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  arrow = false,
}: StyleProps & {
  href: string
  className?: string
  children: ReactNode
  arrow?: boolean
}) {
  return (
    <Link href={href} className={cn(buttonClass({ variant, size }), className)}>
      {children}
      {arrow ? (
        <span className="transition-transform duration-200 group-hover/btn:translate-x-1">
          <ArrowRight />
        </span>
      ) : null}
    </Link>
  )
}

/** Text link closed with the directional arrow — secondary actions. */
export function ArrowLink({
  href,
  children,
  className,
  tone = 'orange',
}: {
  href: string
  children: ReactNode
  className?: string
  /** 'orange' is for the dark ground only; on cream use 'orangeInk'. */
  tone?: 'orange' | 'orangeInk' | 'chalk' | 'ink' | 'yellow'
}) {
  const tones = {
    orange: 'text-orange hover:text-orange-lit',
    orangeInk: 'text-orange-ink hover:text-orange',
    yellow: 'text-yellow hover:text-yellow-lit',
    chalk: 'text-chalk hover:text-chalk-muted',
    ink: 'text-ink hover:text-ink-muted',
  }
  return (
    <Link
      href={href}
      className={cn(
        'group/link label inline-flex items-center gap-3 transition-colors',
        tones[tone],
        className
      )}
    >
      {children}
      <span className="transition-transform duration-200 group-hover/link:translate-x-1">
        <ArrowRight />
      </span>
    </Link>
  )
}

/**
 * Call to action that also makes its whole card clickable.
 *
 * The card is the positioned ancestor; this link's ::after stretches across
 * it, so a mouse or thumb can hit anywhere on the card. Screen readers and
 * keyboard users still get one short, meaningful link rather than one whose
 * name is every word in the card.
 *
 * The card needs `group relative`; anything else interactive inside it needs
 * `relative z-10` to sit above the overlay.
 */
export function CardCta({
  href,
  children,
  className,
  tone = 'ink',
}: {
  href: string
  children: ReactNode
  className?: string
  tone?: 'ink' | 'chalk'
}) {
  return (
    <Link
      href={href}
      className={cn(
        "label inline-flex items-center gap-3 after:absolute after:inset-0 after:content-['']",
        tone === 'chalk' ? 'text-chalk' : 'text-ink',
        className
      )}
    >
      {children}
    </Link>
  )
}

/**
 * The numbered left rail from the approved composition — an index number and
 * tick marks running down a hairline. Decorative, so hidden from assistive
 * technology and dropped entirely on small screens where there is no room.
 */
export function Rail({ index, className }: { index: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('hidden w-px flex-col items-center bg-line lg:flex', className)}
    >
      <span className="h-16 w-px bg-line" />
      <span className="label -rotate-0 bg-black py-3 text-yellow">{index}</span>
      <span className="h-24 w-px bg-line" />
      <span className="h-px w-3 bg-line-strong" />
      <span className="h-8 w-px bg-line" />
      <span className="h-px w-3 bg-line-strong" />
      <span className="flex-1 w-px bg-line" />
    </div>
  )
}
