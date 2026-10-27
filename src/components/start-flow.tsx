'use client'

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from 'react'
import { useFormStatus } from 'react-dom'
import { StartRoad, ROUTE, carAt } from '@/components/start-road'
import { Arrow, buttonClass, cn } from '@/components/ui'
import { checkPromo, submitStart } from '@/lib/contact/actions'
import { budgetBands } from '@/lib/contact/schema'
import {
  contentOptions,
  emptyStart,
  featureOptions,
  initialStartState,
  laneAdvice,
  laneById,
  lanes,
  pageOptions,
  stepOfField,
  tradeOptions,
  validateStep,
  type AppliedPromo,
  type LaneId,
  type StartErrors,
  type StartField,
  type StartInput,
} from '@/lib/contact/start'
import { discounted, money } from '@/lib/pricing'
import {
  ADVANCED_MANAGEMENT_PRICE,
  ANNUAL_TERMS,
  COMPLIMENTARY_MONTH_TERMS,
  TIMELINE_TERMS,
} from '@/lib/services'
import { site } from '@/lib/site'

const fieldClass =
  'w-full border border-line bg-paper-raised px-4 py-3.5 text-[15px] text-ink transition-colors placeholder:text-ink-faint hover:border-line-strong focus:border-accent focus:outline-none aria-[invalid=true]:border-accent'

/** The element to focus when a step is refused, keyed by the field at fault. */
const focusId: Partial<Record<StartField, string>> = {
  biz: 'biz',
  trade: 'trade-0',
  pkg: 'pkg-pro',
  name: 'name',
  email: 'email',
}

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string
  children: ReactNode
  optional?: string
}) {
  return (
    <label htmlFor={htmlFor} className="label mb-2.5 block text-ink">
      {children}
      {optional ? (
        <span className="ml-2 text-ink-faint normal-case">({optional})</span>
      ) : null}
    </label>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 text-sm text-ink" role="alert">
      <span aria-hidden className="mr-1.5 text-accent">
        ▲
      </span>
      {message}
    </p>
  )
}

const pickClass =
  'block border border-line-strong px-4 py-2.5 text-sm text-ink transition-colors hover:border-accent peer-checked:border-accent peer-checked:bg-accent-wash peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent'

function Chip({
  id,
  name,
  checked,
  onChange,
  children,
}: {
  id: string
  name: string
  checked: boolean
  onChange: () => void
  children: ReactNode
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className={pickClass}>{children}</span>
    </label>
  )
}

function Tick({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: () => void
  children: ReactNode
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className={cn(pickClass, 'flex items-center gap-3')}>
        <span
          aria-hidden
          className={cn(
            'grid h-4 w-4 shrink-0 place-items-center border text-[10px] leading-none',
            checked
              ? 'border-accent bg-accent text-cream'
              : 'border-line-strong text-transparent'
          )}
        >
          ✓
        </span>
        {children}
      </span>
    </label>
  )
}

function Controls({
  onBack,
  count,
  next,
}: {
  onBack?: () => void
  count?: string
  next: ReactNode
}) {
  return (
    <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="label text-ink-faint underline-offset-4 hover:text-accent hover:underline"
        >
          Back
        </button>
      ) : (
        <span />
      )}
      {count ? <span className="label hidden text-ink-faint sm:inline">{count}</span> : null}
      {next}
    </div>
  )
}

function NextButton({ children }: { children: ReactNode }) {
  return (
    <button type="submit" className={cn(buttonClass({ size: 'lg' }), 'group/btn')}>
      {children}
      <span className="text-accent transition-transform duration-200 group-hover/btn:translate-x-1">
        <Arrow />
      </span>
    </button>
  )
}

function SendButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(buttonClass({ size: 'lg' }), 'group/btn')}
    >
      {pending ? 'Sending…' : 'Send my enquiry'}
      {pending ? null : (
        <span className="text-accent transition-transform duration-200 group-hover/btn:translate-x-1">
          <Arrow />
        </span>
      )}
    </button>
  )
}

function StepCard({
  code,
  title,
  headingRef,
  children,
  ...props
}: {
  code: string
  title: string
  headingRef: React.Ref<HTMLHeadingElement>
  children: ReactNode
} & React.ComponentProps<'form'>) {
  return (
    <form
      noValidate
      className="rise-in border border-line bg-paper-sunk p-6 sm:p-9"
      {...props}
    >
      <div className="flex items-baseline gap-4">
        <span className="label text-accent">{code}</span>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="display text-3xl text-ink focus:outline-none sm:text-4xl"
        >
          {title}
        </h2>
      </div>
      {children}
    </form>
  )
}

function PromoBox({
  id,
  promo,
  input,
  error,
  checking,
  onInput,
  onApply,
  onRemove,
  compact,
}: {
  id: string
  promo: AppliedPromo | null
  input: string
  error: string
  checking: boolean
  onInput: (value: string) => void
  onApply: () => void
  onRemove: () => void
  compact?: boolean
}) {
  if (promo) {
    return (
      <div
        role="status"
        className={cn(
          'flex flex-wrap items-center gap-x-4 gap-y-1 border bg-paper-raised px-4 py-3 text-sm',
          promo.ff ? 'border-accent' : 'border-line-strong'
        )}
      >
        <span aria-hidden className="text-accent">
          ✓
        </span>
        <span className="font-medium tracking-[0.08em] text-ink">{promo.code}</span>
        {compact ? null : <span className="label text-accent">{promo.tag}</span>}
        <span className="text-ink-muted">{promo.what}</span>
        <button
          type="button"
          onClick={onRemove}
          className="label ml-auto text-ink-faint underline-offset-4 hover:text-accent hover:underline"
        >
          Remove
        </button>
        {compact ? null : (
          <p className="basis-full text-[13px] leading-relaxed text-ink-muted">{promo.msg}</p>
        )}
      </div>
    )
  }
  return (
    <div>
      <FieldLabel htmlFor={id} optional="optional">
        Promo code
      </FieldLabel>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder={compact ? 'Got a code?' : 'Got a code? Enter it here'}
          value={input}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onApply()
            }
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={fieldClass}
        />
        <button
          type="button"
          onClick={onApply}
          disabled={checking}
          className={cn(buttonClass({ variant: 'secondary' }), 'shrink-0')}
        >
          {checking ? 'Checking…' : 'Apply'}
        </button>
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

export function StartFlow({
  initial,
  aside,
}: {
  /** From /contact?package=…: a lane to preselect and/or management ticked. */
  initial?: { lane?: LaneId; mgmt?: boolean }
  /** Extra content under the summary, rendered by the server (the FAQ). */
  aside?: ReactNode
}) {
  const [f, setF] = useState<StartInput>({
    ...emptyStart,
    pkg: initial?.lane ?? '',
    mgmt: initial?.mgmt ?? false,
  })
  const [step, setStep] = useState(0)
  const [errs, setErrs] = useState<StartErrors>({})
  const [promo, setPromo] = useState<AppliedPromo | null>(null)
  const [promoInput, setPromoInput] = useState('')
  const [promoErr, setPromoErr] = useState('')
  const [checking, startCheck] = useTransition()
  const [state, formAction] = useActionState(submitStart, initialStartState)

  const done = state.status === 'success'
  const shown = done ? ROUTE.length : step

  // The car drives whenever its stop changes. Own state adjusted during render
  // (React's recommended alternative to an effect), then cleared on a timer.
  const [lastPos, setLastPos] = useState(carAt(shown))
  const [motion, setMotion] = useState<{ rev: boolean } | null>(null)
  const pos = carAt(shown)
  if (pos !== lastPos) {
    setLastPos(pos)
    setMotion({ rev: pos < lastPos })
  }
  useEffect(() => {
    if (!motion) return
    const id = window.setTimeout(() => setMotion(null), 820)
    return () => window.clearTimeout(id)
  }, [motion])

  const rootRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const startedAtRef = useRef(0)
  const firstRun = useRef(true)

  useEffect(() => {
    startedAtRef.current = Date.now()
  }, [])

  // Move focus to the new step's heading so a keyboard or screen-reader user
  // lands where the content changed. Skipped on the first render.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [shown])

  const set = (patch: Partial<StartInput>) => {
    setF((prev) => ({ ...prev, ...patch }))
    setErrs((prev) => {
      const rest = { ...prev }
      for (const key of Object.keys(patch) as StartField[]) delete rest[key]
      return rest
    })
  }

  const scrollToFlow = () => {
    requestAnimationFrame(() => {
      const el = rootRef.current
      if (el && el.getBoundingClientRect().top < 0) {
        const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' })
      }
    })
  }

  const go = (n: number) => {
    setStep(n)
    setErrs({})
    scrollToFlow()
  }

  const next = (event: FormEvent) => {
    event.preventDefault()
    const found = validateStep(step, f)
    const first = (Object.keys(found) as StartField[])[0]
    if (first) {
      setErrs(found)
      requestAnimationFrame(() => {
        const id = focusId[first]
        if (id) document.getElementById(id)?.focus()
      })
      return
    }
    go(step + 1)
  }

  const toggleFeature = (feature: string) =>
    set({
      feats: f.feats.includes(feature)
        ? f.feats.filter((x) => x !== feature)
        : [...f.feats, feature],
    })

  const applyPromo = () => {
    const code = promoInput.trim()
    if (!code) {
      setPromoErr('Type a code first, or leave it blank.')
      return
    }
    startCheck(async () => {
      const result = await checkPromo(code)
      if (result.ok) {
        setPromo(result.promo)
        setPromoErr('')
        setPromoInput('')
      } else {
        setPromoErr(result.message)
      }
    })
  }
  const removePromo = () => {
    setPromo(null)
    setPromoErr('')
  }
  const onPromoInput = (value: string) => {
    setPromoInput(value)
    setPromoErr('')
  }

  const send = (formData: FormData) => {
    formData.set('startedAt', String(startedAtRef.current))
    formAction(formData)
  }

  // ── Derived figures ────────────────────────────────────────────────────
  const lane = laneById(f.pkg)
  const fixed = Boolean(lane && lane.price > 0 && !lane.variable)
  const net = lane && fixed ? discounted(lane.price, promo) : (lane?.price ?? 0)
  const priceText = !lane
    ? ''
    : fixed
      ? money(net)
      : lane.price > 0
        ? money(lane.price)
        : 'To be advised'
  const half = fixed ? money(net / 2) : 'Set in your quote'
  const advice = step === 2 ? laneAdvice(f) : null
  const needs =
    [f.pages ? `${f.pages} pages` : '', ...f.feats].filter(Boolean).join(', ') ||
    'Not specified'
  const mgmtLine = f.mgmt
    ? `Interested: from ${money(ADVANCED_MANAGEMENT_PRICE)} a month, first month free`
    : 'Not now (you can add it later)'
  const firstName = f.name.trim().split(/\s+/)[0] || 'there'

  const signTop = lane ? (fixed ? money(net) : lane.price > 0 ? `from ${money(lane.price)}` : 'TBC') : 'Your route'
  const signSub = lane
    ? `${lane.name}${fixed ? ` · ${money(net / 2)} to start` : ''}`
    : done
      ? 'Sent'
      : `Junction ${Math.min(step + 1, 4)} of 4`

  const promoBox = (id: string, compact?: boolean) => (
    <PromoBox
      id={id}
      compact={compact}
      promo={promo}
      input={promoInput}
      error={promoErr}
      checking={checking}
      onInput={onPromoInput}
      onApply={applyPromo}
      onRemove={removePromo}
    />
  )

  // ── Steps ──────────────────────────────────────────────────────────────
  let card: ReactNode

  if (done) {
    card = (
      <div
        role="status"
        className="rise-in border border-line bg-paper-sunk p-6 sm:p-9"
      >
        <p className="label text-accent">Sent</p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="display mt-4 text-4xl text-ink focus:outline-none sm:text-5xl"
        >
          You are on your way, {firstName}
          <span className="text-accent">.</span>
        </h2>
        {state.ref ? <p className="label mt-4 text-ink-faint">Ref {state.ref}</p> : null}
        <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{state.message}</p>
        <ol className="mt-8 divide-y divide-line border-y border-line">
          {[
            [
              'Next',
              'I read it properly',
              `And reply with a written quote for ${f.biz.trim()}, normally within one working day.`,
            ],
            [
              'Then',
              'A short call, if you want one',
              'To check the details. No charge, and if a smaller package would do, I will say so.',
            ],
            [
              'Go',
              'Deposit, and work begins',
              fixed
                ? `${half} to begin. The rest only once you have approved the site, before it goes live.`
                : 'The deposit is set in your quote. The rest is only due once you have approved the site, before it goes live.',
            ],
          ].map(([tag, head, body]) => (
            <li key={tag} className="grid grid-cols-[3.5rem_1fr] gap-3 py-4">
              <span className="label pt-0.5 text-accent">{tag}</span>
              <div>
                <p className="font-medium text-ink">{head}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    )
  } else if (step === 0) {
    card = (
      <StepCard code="J1" title="Your business" headingRef={headingRef} onSubmit={next}>
        <div className="mt-8 space-y-7">
          <div>
            <FieldLabel htmlFor="biz">Business name</FieldLabel>
            <input
              id="biz"
              type="text"
              autoComplete="organization"
              placeholder="e.g. Thornley Heating"
              value={f.biz}
              onChange={(e) => set({ biz: e.target.value })}
              aria-invalid={Boolean(errs.biz)}
              aria-describedby={errs.biz ? 'biz-error' : undefined}
              className={fieldClass}
            />
            <FieldError id="biz-error" message={errs.biz} />
          </div>

          <fieldset aria-describedby={errs.trade ? 'trade-error' : undefined}>
            <legend className="label mb-2.5 block text-ink">What do you do?</legend>
            <div className="flex flex-wrap gap-2.5">
              {tradeOptions.map((trade, i) => (
                <Chip
                  key={trade}
                  id={`trade-${i}`}
                  name="trade"
                  checked={f.trade === trade}
                  onChange={() => set({ trade })}
                >
                  {trade}
                </Chip>
              ))}
            </div>
            <FieldError id="trade-error" message={errs.trade} />
          </fieldset>

          <div>
            <FieldLabel htmlFor="site" optional="optional">
              Current website
            </FieldLabel>
            <input
              id="site"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="yourbusiness.co.uk"
              value={f.site}
              onChange={(e) => set({ site: e.target.value })}
              aria-invalid={Boolean(errs.site)}
              className={fieldClass}
            />
            <FieldError id="site-error" message={errs.site} />
          </div>
        </div>
        <Controls count="Junction 1 of 4" next={<NextButton>Next junction</NextButton>} />
      </StepCard>
    )
  } else if (step === 1) {
    card = (
      <StepCard code="J2" title="Choose your lane" headingRef={headingRef} onSubmit={next}>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
          Fixed prices. Half to start, half once the site is finished and approved, before it
          goes live.
        </p>

        <fieldset className="mt-7" aria-describedby={errs.pkg ? 'pkg-error' : undefined}>
          <legend className="sr-only">Package</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {lanes.map((l) => (
              <label key={l.id} className="relative block cursor-pointer">
                <input
                  id={`pkg-${l.id}`}
                  type="radio"
                  name="pkg"
                  checked={f.pkg === l.id}
                  onChange={() => set({ pkg: l.id })}
                  className="peer sr-only"
                />
                <span className="block h-full border border-line-strong bg-paper-raised p-5 transition-colors hover:border-accent peer-checked:border-accent peer-checked:bg-accent-wash peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="display text-3xl text-ink">{l.name}</span>
                    {l.price > 0 ? (
                      <span className="font-medium text-ink">
                        {l.variable ? <span className="label mr-1.5 text-ink-faint">from</span> : null}
                        {money(l.price)}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-3 block text-sm leading-relaxed text-ink-muted">
                    {l.summary}
                  </span>
                  <span className="label mt-3 block text-ink-faint">{l.timeline}</span>
                </span>
              </label>
            ))}
          </div>
          <FieldError id="pkg-error" message={errs.pkg} />
        </fieldset>
        <p className="mt-4 text-xs leading-relaxed text-ink-faint">{TIMELINE_TERMS}</p>

        {f.pkg === 'custom' ? (
          <div className="mt-7">
            <FieldLabel htmlFor="budget" optional="helps me scope it">
              Rough budget
            </FieldLabel>
            <select
              id="budget"
              value={f.budget}
              onChange={(e) => set({ budget: e.target.value })}
              className={fieldClass}
            >
              <option value="">Choose one…</option>
              {budgetBands.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <label className="relative mt-8 block cursor-pointer">
          <input
            type="checkbox"
            checked={f.mgmt}
            onChange={() => set({ mgmt: !f.mgmt })}
            className="peer sr-only"
          />
          <span className="flex gap-4 border border-line-strong bg-paper-raised p-5 transition-colors hover:border-accent peer-checked:border-accent peer-checked:bg-accent-wash peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
            <span
              aria-hidden
              className={cn(
                'mt-0.5 grid h-5 w-5 shrink-0 place-items-center border text-xs leading-none',
                f.mgmt
                  ? 'border-accent bg-accent text-cream'
                  : 'border-line-strong text-transparent'
              )}
            >
              ✓
            </span>
            <span>
              <span className="block font-medium text-ink">
                Tell me about looking after it
                <span className="label ml-3 text-accent">1st month free</span>
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-ink-muted">
                Management is from {money(ADVANCED_MANAGEMENT_PRICE)} a month. It is optional,
                and the build price does not depend on it. {COMPLIMENTARY_MONTH_TERMS}{' '}
                {ANNUAL_TERMS}
              </span>
            </span>
          </span>
        </label>

        <Controls
          onBack={() => go(0)}
          count="Junction 2 of 4"
          next={<NextButton>Next junction</NextButton>}
        />
      </StepCard>
    )
  } else if (step === 2) {
    card = (
      <StepCard code="J3" title="What it needs" headingRef={headingRef} onSubmit={next}>
        <div className="mt-8 space-y-8">
          <fieldset>
            <legend className="label mb-2.5 block text-ink">How many pages, roughly?</legend>
            <div className="flex flex-wrap gap-2.5">
              {pageOptions.map((pages, i) => (
                <Chip
                  key={pages}
                  id={`pages-${i}`}
                  name="pages"
                  checked={f.pages === pages}
                  onChange={() => set({ pages })}
                >
                  {pages}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label mb-2.5 block text-ink">
              What should it do?
              <span className="ml-2 text-ink-faint normal-case">(tick any)</span>
            </legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {featureOptions.map((feature) => (
                <Tick
                  key={feature}
                  checked={f.feats.includes(feature)}
                  onChange={() => toggleFeature(feature)}
                >
                  {feature}
                </Tick>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label mb-2.5 block text-ink">
              Have your words and photos ready?
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {contentOptions.map((content, i) => (
                <Chip
                  key={content}
                  id={`content-${i}`}
                  name="content"
                  checked={f.content === content}
                  onChange={() => set({ content })}
                >
                  {content}
                </Chip>
              ))}
            </div>
          </fieldset>
        </div>

        {advice ? (
          <div
            role="status"
            className="mt-8 flex gap-4 border-l-2 border-accent bg-paper-raised px-5 py-4"
          >
            <span aria-hidden className="text-accent">
              ▲
            </span>
            <div className="text-sm leading-relaxed text-ink-muted">
              <p>
                <strong className="font-medium text-ink">Lane change ahead.</strong>{' '}
                {advice.text}
              </p>
              <button
                type="button"
                onClick={() => set({ pkg: advice.switchTo })}
                className="label mt-2 text-accent underline-offset-4 hover:underline"
              >
                {advice.switchLabel}
              </button>
            </div>
          </div>
        ) : null}

        <Controls
          onBack={() => go(1)}
          count="Junction 3 of 4"
          next={<NextButton>Next junction</NextButton>}
        />
      </StepCard>
    )
  } else if (step === 3) {
    card = (
      <StepCard code="J4" title="Your details" headingRef={headingRef} onSubmit={next}>
        <div className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="name">Your name</FieldLabel>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={f.name}
                onChange={(e) => set({ name: e.target.value })}
                aria-invalid={Boolean(errs.name)}
                aria-describedby={errs.name ? 'name-error' : undefined}
                className={fieldClass}
              />
              <FieldError id="name-error" message={errs.name} />
            </div>
            <div>
              <FieldLabel htmlFor="phone" optional="optional">
                Phone
              </FieldLabel>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={f.phone}
                onChange={(e) => set({ phone: e.target.value })}
                aria-invalid={Boolean(errs.phone)}
                aria-describedby={errs.phone ? 'phone-error' : undefined}
                className={fieldClass}
              />
              <FieldError id="phone-error" message={errs.phone} />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={f.email}
              onChange={(e) => set({ email: e.target.value })}
              aria-invalid={Boolean(errs.email)}
              aria-describedby={errs.email ? 'email-error' : undefined}
              className={fieldClass}
            />
            <FieldError id="email-error" message={errs.email} />
          </div>
          <div>
            <FieldLabel htmlFor="msg" optional="optional">
              Anything else?
            </FieldLabel>
            <textarea
              id="msg"
              rows={5}
              placeholder="Deadlines, examples you like, what is not working now…"
              value={f.msg}
              onChange={(e) => set({ msg: e.target.value })}
              aria-invalid={Boolean(errs.msg)}
              aria-describedby={errs.msg ? 'msg-error' : undefined}
              className={cn(fieldClass, 'resize-y')}
            />
            <FieldError id="msg-error" message={errs.msg} />
          </div>
        </div>
        <Controls
          onBack={() => go(2)}
          count="Junction 4 of 4"
          next={<NextButton>Review my route</NextButton>}
        />
      </StepCard>
    )
  } else {
    const rows: [string, string, number | null][] = [
      ['Business', `${f.biz.trim()} · ${f.trade}`, 0],
      ['Lane', lane?.name ?? '—', 1],
      [
        'Price',
        !lane
          ? '—'
          : fixed
            ? `${money(net)}, fixed${promo ? ` (was ${money(lane.price)})` : ''}`
            : lane.price > 0
              ? `From ${money(lane.price)}, quoted in writing${promo ? ', with your code taken off' : ''}`
              : `I will recommend a package${promo ? ', with your code taken off' : ''}`,
        null,
      ],
      ['Deposit to start', half, null],
      ['Before it goes live', half, null],
      ['Estimated time', lane?.timeline ?? '—', null],
      ['Management', mgmtLine, 1],
      ['Needs', needs, 2],
      ['Contact', `${f.name.trim()} · ${f.email.trim()}`, 3],
    ]
    card = (
      <form
        action={send}
        className="rise-in border border-line bg-paper-sunk p-6 sm:p-9"
      >
        <div className="flex items-baseline gap-4">
          <span className="label text-accent">END</span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="display text-3xl text-ink focus:outline-none sm:text-4xl"
          >
            Your route
          </h2>
        </div>

        {state.status === 'error' ? (
          <div
            role="alert"
            className="mt-6 border-l-2 border-accent bg-paper-raised px-4 py-3 text-sm"
          >
            <p>{state.message}</p>
            {state.errors ? (
              <ul className="mt-2 space-y-1">
                {(Object.entries(state.errors) as [StartField, string][]).map(
                  ([field, message]) => (
                    <li key={field}>
                      {message}{' '}
                      <button
                        type="button"
                        onClick={() => go(stepOfField[field])}
                        className="label text-accent underline-offset-4 hover:underline"
                      >
                        Fix
                      </button>
                    </li>
                  )
                )}
              </ul>
            ) : null}
          </div>
        ) : null}

        <dl className="mt-7 divide-y divide-line border-y border-line">
          {rows.map(([label, value, edit]) => (
            <div key={label} className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="label pt-0.5 text-ink-faint">{label}</dt>
              <dd className="flex items-start justify-between gap-4 text-[15px] text-ink">
                <span>{value}</span>
                {edit !== null ? (
                  <button
                    type="button"
                    onClick={() => go(edit)}
                    className="label shrink-0 text-accent underline-offset-4 hover:underline"
                  >
                    Edit
                  </button>
                ) : null}
              </dd>
            </div>
          ))}
          {promo ? (
            <div className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="label pt-0.5 text-ink-faint">Promo code</dt>
              <dd className="text-[15px] text-ink">
                {promo.code} · {promo.tag}
              </dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-ink-faint">{TIMELINE_TERMS}</p>

        <div className="mt-7">{promoBox('promo')}</div>

        <p className="mt-7 text-sm leading-relaxed text-ink-muted">
          Sending this does not commit you to anything or take payment. I reply with a written
          quote, normally within one working day. You own everything I build.
        </p>

        {/* The answers travel as hidden fields; the server checks every one again. */}
        <input type="hidden" name="biz" value={f.biz} />
        <input type="hidden" name="trade" value={f.trade} />
        <input type="hidden" name="site" value={f.site} />
        <input type="hidden" name="pkg" value={f.pkg} />
        <input type="hidden" name="budget" value={f.pkg === 'custom' ? f.budget : ''} />
        {f.mgmt ? <input type="hidden" name="mgmt" value="on" /> : null}
        <input type="hidden" name="pages" value={f.pages} />
        {f.feats.map((feature) => (
          <input key={feature} type="hidden" name="feats" value={feature} />
        ))}
        <input type="hidden" name="content" value={f.content} />
        <input type="hidden" name="name" value={f.name} />
        <input type="hidden" name="phone" value={f.phone} />
        <input type="hidden" name="email" value={f.email} />
        <input type="hidden" name="msg" value={f.msg} />
        <input type="hidden" name="promo" value={promo?.code ?? ''} />

        {/* Honeypot, as on the plain enquiry form. */}
        <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Do not fill this in</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Controls onBack={() => go(3)} next={<SendButton />} />
      </form>
    )
  }

  return (
    <div ref={rootRef}>
      <noscript>
        <p className="border border-line bg-paper-sunk p-6 text-[15px]">
          This form needs JavaScript. You can email me at{' '}
          <a className="text-accent underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>{' '}
          instead.
        </p>
      </noscript>

      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div className="min-w-0">{card}</div>

        <aside aria-label="Your route so far" className="min-w-0">
          <div className="border border-line bg-paper-sunk p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="label text-ink-faint">Your route</h2>
            {lane ? (
              <>
                <p className="display mt-5 text-5xl text-ink">
                  {lane.variable && lane.price > 0 ? (
                    <span className="label mr-2 align-middle text-ink-faint">from</span>
                  ) : null}
                  {priceText}
                  {promo && fixed ? (
                    <span className="label ml-3 align-middle text-ink-faint line-through decoration-accent">
                      {money(lane.price)}
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">{lane.name}</p>
                <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
                  {promo ? (
                    <div className="flex justify-between gap-4 py-2.5 text-accent">
                      <dt>{promo.code}</dt>
                      <dd>{fixed ? `−${money(lane.price - net)}` : promo.what}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-ink-faint">Deposit to start</dt>
                    <dd className="text-ink">{half}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-ink-faint">Before go-live</dt>
                    <dd className="text-ink">{half}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-ink-faint">Estimated time</dt>
                    <dd className="text-right text-ink">{lane.timeline}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2.5">
                    <dt className="text-ink-faint">Management</dt>
                    <dd className="text-ink">{f.mgmt ? '1st month free' : 'Not added'}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-ink-faint">
                  Fixed price. Nothing is charged until you have had a written quote.{' '}
                  {TIMELINE_TERMS}
                </p>
              </>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-ink-muted">
                Pick a lane at Junction 2 and the price, deposit and timeline appear here.
              </p>
            )}
            {step !== 4 && !done ? <div className="mt-6">{promoBox('promo-side', true)}</div> : null}
          </div>
          {aside ? <div className="mt-8">{aside}</div> : null}
        </aside>
      </div>

      <StartRoad step={shown} motion={motion} signTop={signTop} signSub={signSub} />
    </div>
  )
}
