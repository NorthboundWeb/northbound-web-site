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
    <div className={cn('mx-auto w-full max-w-[1320px] px-[18px] sm:px-10', className)}>
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

/** Junction plate: black, white-bordered, with the junction number in amber. */
export function Label({
  index,
  children,
  className,
}: {
  index?: string
  children?: ReactNode
  className?: string
  /** Accepted for older callers. The plate reads the same on tarmac and on a
   *  blue sign, so it no longer changes anything. */
  tone?: 'dark' | 'light'
}) {
  if (!index && !children) return null
  return (
    <p className={cn('kicker w-fit', className)}>
      {index ? <span className="text-accent">{index}</span> : null}
      {children}
    </p>
  )
}

/**
 * One statement on a motorway sign: a blue panel with the white inset border,
 * set inside the page width rather than bleeding to the edges.
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
    <section id={id} className={cn('py-10 sm:py-14', className)}>
      <Container>
        <div className="sign px-7 py-9 sm:px-12 sm:py-12">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <Label index={index} tone="light">
              {eyebrow}
            </Label>
            {aside ? <span className="label text-accent">{aside}</span> : null}
          </div>
          <p className="display mt-6 text-[clamp(2.5rem,5.4vw,4.5rem)] text-cream">
            {word}
            <span className="text-accent">.</span>
          </p>
          {lede ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#E6EBF2]">
              {lede}
            </p>
          ) : null}
          {children}
        </div>
      </Container>
    </section>
  )
}

/**
 * Page headline, in heavy sign lettering. The amber full stop is optional.
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
        'display text-[clamp(2.5rem,6.2vw,5.25rem)] text-ink',
        className
      )}
    >
      {children}
      {stop ? <span className="text-accent">.</span> : null}
    </As>
  )
}

const base =
  'press group/btn inline-flex items-center justify-center gap-3 rounded-md border-2 pt-1 font-extrabold text-[15px] disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  /** White outline that lights amber — the design's one button. */
  primary: 'border-white/55 text-ink hover:border-accent hover:bg-accent/10 hover:text-accent',
  /** Quieter outline, for a second action beside a primary one. */
  secondary: 'border-line-strong text-ink-muted hover:border-accent hover:text-accent',
  /** On a blue sign: a solid white border. */
  inverse: 'border-white text-white hover:bg-white/12',
} as const

const sizes = {
  md: 'min-h-12 px-[18px]',
  lg: 'min-h-14 px-6 text-base',
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
