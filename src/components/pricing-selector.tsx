'use client'

import { useId, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { ArrowRight } from '@/components/graphics'
import { buttonClass, cn } from '@/components/ui'
import { startCheckout } from '@/lib/checkout/actions'
import {
  ENQUIRY_PROCESS_SUMMARY,
  KLARNA_NOTE,
  ONE_OFF_LABEL,
  buildScopes,
  type BuildScope,
} from '@/lib/services'
import { currency } from '@/lib/site'

/**
 * The build package selector.
 *
 * A real radio group rather than a row of buttons: arrow keys move between
 * packages, Space selects, and a screen reader announces "3 of 4". That is
 * why this is a fieldset of inputs with labels, not divs with click handlers.
 *
 * The CTA is a GET form pointing at the enquiry page, which means the
 * selection travels natively — no JavaScript required — and lands as
 * /contact?type=build&package=pro. With checkout switched on the same
 * component posts to the Stripe action instead; the flag decides, and the
 * visitor never sees checkout language while it is off.
 */

function priceLabel(scope: BuildScope): string {
  const amount = currency.format(scope.price)
  return scope.from ? `From ${amount}` : amount
}

/**
 * The label names the selected package, which React updates on change — but
 * it must also be right without JavaScript, where React cannot re-render.
 * So every package's label is in the DOM and CSS `:has()` reveals the one
 * whose radio is checked. Same mechanism the enquiry form already uses.
 */
function EnquireLabel() {
  return (
    <>
      {buildScopes.map((s) => (
        <span key={s.slug} data-pkg={s.slug}>
          Enquire about {s.name}
        </span>
      ))}
    </>
  )
}

function CheckoutCta() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(buttonClass({ size: 'lg' }), 'group/btn w-full')}
    >
      {pending ? 'Opening…' : 'Continue to secure checkout'}
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
  /** Off unless someone deliberately enabled it. See lib/checkout/flag.ts. */
  checkoutEnabled = false,
  notice,
}: {
  defaultSlug?: string
  checkoutEnabled?: boolean
  notice?: string
}) {
  const groupId = useId()
  const [selected, setSelected] = useState(
    () => buildScopes.find((s) => s.slug === defaultSlug) ?? buildScopes[0]
  )

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

      {/* GET, so the selection travels as a query string with no JavaScript.
          The action swaps to the Stripe server action when checkout is on. */}
      <form
        className="pkg-form"
        {...(checkoutEnabled
          ? { action: startCheckout }
          : { action: '/contact', method: 'get' })}
      >
        {!checkoutEnabled ? (
          <input type="hidden" name="type" value="build" />
        ) : null}

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
                    // `package` when enquiring, `scope` when checking out —
                    // each destination reads the name it expects.
                    name={checkoutEnabled ? 'scope' : 'package'}
                    id={id}
                    value={scope.slug}
                    checked={isSelected}
                    onChange={() => setSelected(scope)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={id}
                    className={cn(
                      'flex min-h-14 cursor-pointer items-center gap-4 border-2 p-5 transition-colors duration-150 sm:gap-5 sm:p-6',
                      'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent',
                      isSelected
                        ? 'border-accent bg-accent-wash'
                        : 'border-line bg-paper hover:border-line-strong hover:bg-paper-raised'
                    )}
                  >
                    {/* Decorative: the radio carries the state. */}
                    <span
                      aria-hidden
                      className={cn(
                        'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-150',
                        isSelected
                          ? 'border-accent bg-accent text-accent-ink'
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
                        {scope.from ? 'Quoted individually' : ONE_OFF_LABEL}
                      </span>
                    </span>
                  </label>
                </div>
              )
            })}
          </div>
        </fieldset>

        {/* What you are enquiring about, stated once, above the single CTA. */}
        <p className="mt-7 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-5">
          <span className="label text-ink">{selected.name}</span>
          <span className="text-right">
            <span className="display text-2xl text-ink">{priceLabel(selected)}</span>
            <span className="ml-2 text-[13px] text-ink-faint">
              {selected.from ? 'quoted individually' : ONE_OFF_LABEL.toLowerCase()}
            </span>
          </span>
        </p>

        <div className="mt-5">
          {checkoutEnabled ? (
            <CheckoutCta />
          ) : (
            <button
              type="submit"
              className={cn(
                buttonClass({ size: 'lg' }),
                'pkg-cta group/btn w-full'
              )}
            >
              <EnquireLabel />
              <span className="text-accent-on-ink transition-transform duration-200 group-hover/btn:translate-x-1">
                <ArrowRight />
              </span>
            </button>
          )}
        </div>
      </form>

      <p className="mt-4 text-center text-[13px] leading-relaxed text-ink-faint">
        {checkoutEnabled ? (
          <>{KLARNA_NOTE}.</>
        ) : (
          <>Nothing is charged now. {ENQUIRY_PROCESS_SUMMARY}</>
        )}
      </p>

      <p className="mt-6 border-t border-line pt-5 text-[13px] leading-relaxed text-ink-faint">
        {selected.summary}{' '}
        <span className="text-ink-muted">{selected.timeline}.</span>
      </p>
    </div>
  )
}
