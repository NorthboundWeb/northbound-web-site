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
  tone = 'dark',
}: {
  index?: string
  children?: ReactNode
  className?: string
  /** Same reason as CardCta's tone: colour utilities of equal specificity are
   *  resolved by stylesheet order, so the surface is declared, not overridden. */
  tone?: 'dark' | 'light'
}) {
  return (
    <p
      className={cn(
        'label flex items-center gap-3',
        tone === 'light' ? 'text-on-invert/60' : 'text-ink-faint',
        className
      )}
    >
      {index ? (
        <span className={tone === 'light' ? 'text-accent-lit' : 'text-accent-deep'}>
          {index}
        </span>
      ) : null}
      <span
        aria-hidden
        className={cn(
          'h-px w-8',
          tone === 'light' ? 'bg-on-invert/40' : 'bg-line-strong'
        )}
      />
      {children}
    </p>
  )
}

/**
 * A compact full-bleed green band carrying one statement.
 *
 * Green is used as punctuation between cream sections rather than as a field
 * behind dense content: the band states the idea, and the grid that follows
 * sits on paper. That keeps the page light while preserving a hard
 * cream → green → cream rhythm.
 */
export function StatementBand({
  index,
  eyebrow,
  word,
  lede,
  aside,
  children,
  id,
  className,
}: {
  index?: string
  eyebrow?: string
  word: string
  lede?: ReactNode
  aside?: string
  children?: ReactNode
  id?: string
  className?: string
}) {
  return (
    <section id={id} className={cn('invert-surface', className)}>
      <Container className="py-16 sm:py-20">
        <div className="flex items-start justify-between gap-6">
          <Label index={index} tone="light">
            {eyebrow}
          </Label>
          {aside ? <span className="label text-accent-lit">{aside}</span> : null}
        </div>
        <p className="display mt-6 text-[clamp(3rem,11vw,8.5rem)] text-on-invert">
          {word}
          <span className="text-accent">.</span>
        </p>
        {lede ? (
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-on-invert/80">
            {lede}
          </p>
        ) : null}
        {children}
      </Container>
    </section>
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
  primary: 'bg-ink text-paper hover:bg-accent hover:text-on-invert',
  /** Outlined, for secondary weight. */
  secondary:
    'border border-line-strong text-ink hover:border-accent hover:text-accent-deep',
  /** Cream on green sections. */
  inverse: 'bg-on-invert text-invert hover:bg-accent hover:text-on-invert',
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
            ? 'text-accent-on-ink group-hover/btn:text-current'
            : 'text-accent-deep'
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
        // min-h-11 gives a 44px hit area. The type is 11px, so the box is
        // 17px tall on its own — under the 24px target-size floor.
        'group/link label inline-flex min-h-11 items-center gap-2.5 text-ink hover:text-accent-deep',
        className
      )}
    >
      {children}
      <span className="text-accent-deep transition-transform duration-200 group-hover/link:translate-x-1">
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
 * users still get one short, meaningful link ("Choose Ultimate Management") rather than a
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
        "label inline-flex min-h-11 items-center gap-2.5 after:absolute after:inset-0 after:content-['']",
        tone === 'light'
          ? 'text-on-invert group-hover:text-accent-lit'
          : 'text-ink group-hover:text-accent-deep',
        className
      )}
    >
      {children}
      <span
        className={cn(
          'transition-transform duration-200 group-hover:translate-x-1',
          tone === 'light' ? 'text-accent-lit' : 'text-accent-deep'
        )}
      >
        <ArrowRight />
      </span>
    </Link>
  )
}

/** Back-compat alias — some pages still import Arrow. */
export { ArrowRight as Arrow }
