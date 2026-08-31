'use client'

import { useId, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { ArrowRight } from '@/components/graphics'
import { buttonClass, cn } from '@/components/ui'
import { startCheckout } from '@/lib/checkout/actions'
import {
  buildScopes,
  KLARNA_NOTE,
  ONE_OFF_LABEL,
  type BuildScope,
} from '@/lib/services'
import { currency } from '@/lib/site'

/**
 * The build package selector.
 *
 * Built as a real radio group rather than a row of buttons: arrow keys move
 * between packages, Space selects, and a screen reader announces "3 of 4".
 * Getting that free is the whole reason this is a fieldset of inputs with a
 * roving tab stop, not divs with click handlers.
 *
 * The selected package drives one CTA underneath. Fixed-price scopes post to
 * a server action that builds a Stripe session from `services.ts`; Custom is
 * quoted, so it links to the enquiry form instead of pretending £499 is a
 * price you can pay today.
 */

function priceLabel(scope: BuildScope): string {
  const amount = currency.format(scope.price)
  return scope.from ? `From ${amount}` : amount
}

/**
 * Three states, and they are not interchangeable.
 *
 * "Get a custom quote" belongs to Custom, which is genuinely priced on the
 * work. A fixed-price package with payments switched off is a different
 * situation entirely — the price is known, it just cannot be taken online —
 * and labelling that "get a quote" would misdescribe a £249 package.
 *
 * The label never names the selected package. Without JavaScript the radios
 * still post correctly, but React cannot re-render this button, so "Continue
 * with Advanced" would become a lie the moment someone picked Pro. The name
 * sits above the button instead, where the DOM updates natively.
 */
function ctaLabel(scope: BuildScope, checkoutAvailable: boolean): string {
  if (!scope.checkout) return 'Get a custom quote'
  return checkoutAvailable ? 'Continue to secure checkout' : 'Start your project'
}

function Cta({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(buttonClass({ size: 'lg' }), 'group/btn w-full')}
    >
      {pending ? 'Opening…' : label}
      {pending ? null : (
        <span className="text-accent-on-ink transition-transform duration-200 group-hover/btn:translate-x-1">
          <ArrowRight />
        </span>
      )}
    </button>
  )
}

export function PricingSelector({
  defaultSlug = 'advanced',
  checkoutAvailable = true,
  notice,
}: {
  defaultSlug?: string
  /** False when Stripe has no key — the CTA becomes an enquiry instead. */
  checkoutAvailable?: boolean
  notice?: string
}) {
  const groupId = useId()
  const [selected, setSelected] = useState(
    () => buildScopes.find((s) => s.slug === defaultSlug) ?? buildScopes[0]
  )

  /** Custom is never purchasable; nor is anything, without a Stripe key. */
  const purchasable = selected.checkout && checkoutAvailable

  return (
    <div className="mx-auto w-full max-w-xl">
      {notice ? (
        <p
          role="status"
          className="mb-8 border-l-2 border-accent bg-paper-sunk px-5 py-4 text-sm leading-relaxed text-ink"
        >
          {notice}
        </p>
      ) : null}

      <form action={startCheckout}>
      <fieldset className="border-0 p-0">
        <legend className="label mb-5 text-ink-faint">Choose your build</legend>

        <div className="flex flex-col gap-3">
          {buildScopes.map((scope) => {
            const isSelected = scope.slug === selected.slug
            const id = `${groupId}-${scope.slug}`
            return (
              <div key={scope.slug} className="relative">
                <input
                  type="radio"
                  name="scope"
                  id={id}
                  value={scope.slug}
                  checked={isSelected}
                  onChange={() => setSelected(scope)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className={cn(
                    'flex cursor-pointer items-center gap-4 border-2 p-5 transition-colors duration-150 sm:gap-5 sm:p-6',
                    'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent',
                    isSelected
                      ? 'border-accent bg-accent-wash'
                      : 'border-line bg-paper hover:border-line-strong hover:bg-paper-raised'
                  )}
                >
                  {/* The check indicator. Decorative: the radio carries state. */}
                  <span
                    aria-hidden
                    className={cn(
                      'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-150',
                      isSelected
                        ? 'border-accent bg-accent text-cream'
                        : 'border-line-strong text-transparent'
                    )}
                  >
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                      <path
                        d="M2 6.2 4.8 9 10 3.4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="display text-xl text-ink sm:text-2xl">
                        {scope.name}
                      </span>
                      {scope.badge ? (
                        <span className="label text-accent-deep">{scope.badge}</span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-[13px] leading-snug text-ink-faint">
                      {scope.pages} · {scope.revisions}
                    </span>
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="display block text-2xl leading-none text-ink sm:text-3xl">
                      {priceLabel(scope)}
                    </span>
                    <span className="mt-1.5 block text-[11px] leading-tight text-ink-faint">
                      {scope.checkout ? ONE_OFF_LABEL : 'Quoted individually'}
                    </span>
                  </span>
                </label>
              </div>
            )
          })}
        </div>
      </fieldset>

        {/* What you are about to buy, stated once, above the single CTA. */}
        <p className="mt-7 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-5">
          <span className="label text-ink">{selected.name}</span>
          <span className="text-right">
            <span className="display text-2xl text-ink">{priceLabel(selected)}</span>
            <span className="ml-2 text-[13px] text-ink-faint">
              {selected.checkout ? ONE_OFF_LABEL.toLowerCase() : 'quoted individually'}
            </span>
          </span>
        </p>

        <div className="mt-5">
          <Cta label={ctaLabel(selected, checkoutAvailable)} />
        </div>
      </form>

      <p className="mt-4 text-center text-[13px] leading-relaxed text-ink-faint">
        {purchasable ? (
          <>
            {KLARNA_NOTE}. Or{' '}
            <a
              href={`/contact?package=${selected.slug}`}
              className="text-accent-deep underline-offset-4 hover:underline"
            >
              talk it through first
            </a>
            .
          </>
        ) : selected.checkout ? (
          <>
            {currency.format(selected.price)} is the whole price. Card payment
            online is coming shortly — send your details and I will invoice you
            directly in the meantime.
          </>
        ) : (
          <>
            Nothing is charged today. We agree what you need, then you get a
            fixed price in writing.
          </>
        )}
      </p>

      <p className="mt-6 border-t border-line pt-5 text-[13px] leading-relaxed text-ink-faint">
        {selected.summary}{' '}
        <span className="text-ink-muted">{selected.timeline}.</span>
      </p>
    </div>
  )
}
