'use client'

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { useFormStatus } from 'react-dom'
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
import { ADVANCED_MANAGEMENT_PRICE, TIMELINE_TERMS } from '@/lib/services'
import { site } from '@/lib/site'

/**
 * Start a project: four junctions and a review, on a blue sign.
 *
 * The step card is on the left, your route so far (price, deposit, timeline)
 * on the right, and a road along the bottom of the screen with a car that
 * drives from junction to junction as you go. Every answer is checked again on
 * the server when it is sent; nothing here is trusted on its own.
 */

const ROUTE = [
  { code: 'J1', label: 'Your business' },
  { code: 'J2', label: 'Your lane' },
  { code: 'J3', label: 'What it needs' },
  { code: 'J4', label: 'Your details' },
  { code: 'END', label: 'Arrive' },
] as const

/** Where the car stops for each step, as a percentage of the road's width. */
function carAt(step: number) {
  return 10 + Math.min(step, ROUTE.length - 1) * 20
}

/** The element to focus when a step is refused, keyed by the field at fault. */
const focusId: Partial<Record<StartField, string>> = {
  biz: 'biz',
  trade: 'trade-0',
  pkg: 'pkg-pro',
  name: 'name',
  email: 'email',
}

function Err({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <span className="err" id={id} role="alert">
      {message}
    </span>
  )
}

function GoArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function Controls({ onBack, count, next }: { onBack?: () => void; count?: string; next: ReactNode }) {
  return (
    <div className="controls">
      {onBack ? (
        <button className="backbtn" type="button" onClick={onBack}>
          Back
        </button>
      ) : null}
      {count ? <span className="stepcount">{count}</span> : null}
      {next}
    </div>
  )
}

function NextButton({ children }: { children: ReactNode }) {
  return (
    <button className="go" type="submit">
      {children} <GoArrow />
    </button>
  )
}

function SendButton() {
  const { pending } = useFormStatus()
  return (
    <button className="go" type="submit" disabled={pending}>
      {pending ? 'Sending…' : 'Send my enquiry'} {pending ? null : <GoArrow />}
    </button>
  )
}

function StepTop({
  code,
  title,
  headingRef,
}: {
  code: string
  title: ReactNode
  headingRef: Ref<HTMLHeadingElement>
}) {
  return (
    <div className="step-top">
      <span className="jn">{code}</span>
      <h2 ref={headingRef} tabIndex={-1}>
        {title}
      </h2>
    </div>
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
  return (
    <div className="promo">
      {promo ? (
        <div className={promo.ff ? 'promo-ok ff' : 'promo-ok'} role="status">
          <span className="promo-badge" aria-hidden>
            ✓
          </span>
          <div>
            <span className="promo-code">{promo.code}</span>
            {compact ? null : <span className="promo-tag">{promo.tag}</span>}
            <span className="promo-what">{promo.what}</span>
          </div>
          <button className="edit" type="button" onClick={onRemove}>
            Remove
          </button>
          {compact ? null : <p className="promo-msg">{promo.msg}</p>}
        </div>
      ) : (
        <>
          <label htmlFor={id}>
            Promo code <span className="opt">Optional</span>
          </label>
          <div className="promo-row">
            <input
              id={id}
              className={error ? 'in bad' : 'in'}
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
              aria-describedby={error ? `${id}-err` : undefined}
            />
            <button className="promo-btn" type="button" onClick={onApply} disabled={checking}>
              {checking ? 'Checking…' : 'Apply'}
            </button>
          </div>
          <Err id={`${id}-err`} message={error} />
        </>
      )}
    </div>
  )
}

export function StartFlow({
  initial,
}: {
  /** From /contact?package=…: a lane to preselect and/or management ticked. */
  initial?: { lane?: LaneId; mgmt?: boolean }
}) {
  const [f, setF] = useState<StartInput>({
    ...emptyStart,
    pkg: initial?.lane ?? '',
    mgmt: initial?.mgmt ?? false,
  })
  const [step, setStep] = useState(0)
  const [back, setBack] = useState(false)
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
    setBack(n < step)
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
      feats: f.feats.includes(feature) ? f.feats.filter((x) => x !== feature) : [...f.feats, feature],
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
  const priceText = !lane ? '' : fixed ? money(net) : lane.price > 0 ? money(lane.price) : 'To be advised'
  const half = fixed ? money(net / 2) : 'Set in your quote'
  const advice = step === 2 ? laneAdvice(f) : null
  const needs = [f.pages ? `${f.pages} pages` : '', ...f.feats].filter(Boolean).join(', ') || 'Not specified'
  const mgmtLine = f.mgmt
    ? `Interested: from ${money(ADVANCED_MANAGEMENT_PRICE)} a month, first month free`
    : 'Not now (you can add it later)'
  const firstName = f.name.trim().split(/\s+/)[0] || 'there'

  const signTop = lane ? (fixed ? money(net) : lane.price > 0 ? `from ${money(lane.price)}` : 'TBC') : 'Your route'
  const signSub = lane
    ? `${lane.name}${promo ? ` · ${promo.code}` : ''}${fixed ? ` · ${money(net / 2)} to start` : ''}`
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

  const stepCls = back ? 'card step back' : 'card step'

  // ── Steps ──────────────────────────────────────────────────────────────
  let card: ReactNode

  if (done) {
    card = (
      <div className="done-card step" role="status">
        <h2 ref={headingRef} tabIndex={-1}>
          You&apos;re on your way, {firstName}.
        </h2>
        {state.ref ? <span className="ref">Ref {state.ref}</span> : null}
        {state.message ? <p className="done-msg">{state.message}</p> : null}
        <ol className="next">
          <li>
            <span className="jn">NEXT</span>
            <div>
              <b>We read it properly</b>
              <span className="t">
                And reply with a written quote for {f.biz.trim()}, usually within one working day.
              </span>
            </div>
          </li>
          <li>
            <span className="jn">THEN</span>
            <div>
              <b>A short call, if you want one</b>
              <span className="t">
                To check the details. No charge, and if a smaller package would do, we&apos;ll say so.
              </span>
            </div>
          </li>
          <li>
            <span className="jn">GO</span>
            <div>
              <b>Deposit, and we start</b>
              <span className="t">
                {fixed
                  ? `${half} to begin. The rest only once you've approved the site, before it goes live.`
                  : 'The deposit is set in your quote. The rest only once you’ve approved the site, before it goes live.'}
              </span>
            </div>
          </li>
        </ol>
      </div>
    )
  } else if (step === 0) {
    card = (
      <form key="s0" className={stepCls} noValidate onSubmit={next}>
        <StepTop code="J1" title="Your business" headingRef={headingRef} />
        <div className="field">
          <label htmlFor="biz">Business name</label>
          <input
            id="biz"
            className={errs.biz ? 'in bad' : 'in'}
            type="text"
            autoComplete="organization"
            placeholder="e.g. Thornley Heating"
            value={f.biz}
            onChange={(e) => set({ biz: e.target.value })}
            aria-invalid={Boolean(errs.biz)}
            aria-describedby={errs.biz ? 'biz-err' : undefined}
          />
          <Err id="biz-err" message={errs.biz} />
        </div>
        <fieldset className="field" aria-describedby={errs.trade ? 'trade-err' : undefined}>
          <legend className="legend">What do you do?</legend>
          <div className="chips">
            {tradeOptions.map((trade, i) => (
              <label key={trade} className={f.trade === trade ? 'chip on' : 'chip'}>
                <input
                  id={`trade-${i}`}
                  type="radio"
                  name="trade"
                  checked={f.trade === trade}
                  onChange={() => set({ trade })}
                />
                {trade}
              </label>
            ))}
          </div>
          <Err id="trade-err" message={errs.trade} />
        </fieldset>
        <div className="field">
          <label htmlFor="site">
            Current website <span className="opt-l">optional</span>
          </label>
          <input
            id="site"
            className={errs.site ? 'in bad' : 'in'}
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="yourbusiness.co.uk"
            value={f.site}
            onChange={(e) => set({ site: e.target.value })}
            aria-invalid={Boolean(errs.site)}
          />
          <Err id="site-err" message={errs.site} />
        </div>
        <Controls count="Junction 1 of 4" next={<NextButton>Next junction</NextButton>} />
      </form>
    )
  } else if (step === 1) {
    card = (
      <form key="s1" className={stepCls} noValidate onSubmit={next}>
        <StepTop code="J2" title="Choose your lane" headingRef={headingRef} />
        <p className="hint">
          Fixed prices. Half to start, half once it&apos;s finished and approved, before it goes live.
        </p>
        <fieldset aria-describedby={errs.pkg ? 'pkg-err' : undefined}>
          <legend className="sr-only">Package</legend>
          <div className="lanes">
            {lanes.map((l) => (
              <label key={l.id} className={f.pkg === l.id ? 'lane on' : 'lane'}>
                <input
                  id={`pkg-${l.id}`}
                  type="radio"
                  name="pkg"
                  checked={f.pkg === l.id}
                  onChange={() => set({ pkg: l.id })}
                />
                <span className="mark" aria-hidden />
                <span className="lane-top">
                  <span className="lane-name">{l.name}</span>
                  {l.price > 0 ? (
                    <span className="lane-price">
                      {l.variable ? <small>from</small> : null}
                      {money(l.price)}
                    </span>
                  ) : null}
                </span>
                <span className="lane-sub">{l.summary}</span>
                <span className="lane-time">{l.timeline}</span>
              </label>
            ))}
          </div>
          <Err id="pkg-err" message={errs.pkg} />
        </fieldset>
        <p className="fine">{TIMELINE_TERMS}</p>

        {f.pkg === 'custom' ? (
          <div className="field">
            <label htmlFor="budget">
              Rough budget <span className="opt-l">helps us scope it</span>
            </label>
            <select id="budget" className="in" value={f.budget} onChange={(e) => set({ budget: e.target.value })}>
              <option value="">Not sure yet</option>
              {budgetBands.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <label className={f.mgmt ? 'mgmt on' : 'mgmt'}>
          <input type="checkbox" checked={f.mgmt} onChange={() => set({ mgmt: !f.mgmt })} />
          <span className="box" aria-hidden />
          <span>
            <b>
              Keep it looked after <span className="free-tag">1st month free</span>
            </b>
            <span className="s">
              Management from {money(ADVANCED_MANAGEMENT_PRICE)} a month, hosting included. Up to 2
              hours of updates a month on Pro Management, 4 on Ultimate. Pay annually: twelve months
              for the price of ten. The free month doesn&apos;t turn into a paid plan by itself.
              Optional, and you can decide later.
            </span>
          </span>
        </label>
        <Controls onBack={() => go(0)} count="Junction 2 of 4" next={<NextButton>Next junction</NextButton>} />
      </form>
    )
  } else if (step === 2) {
    card = (
      <form key="s2" className={stepCls} noValidate onSubmit={next}>
        <StepTop code="J3" title="What it needs" headingRef={headingRef} />
        <fieldset>
          <legend className="legend">How many pages, roughly?</legend>
          <div className="chips">
            {pageOptions.map((pages, i) => (
              <label key={pages} className={f.pages === pages ? 'chip on' : 'chip'}>
                <input
                  id={`pages-${i}`}
                  type="radio"
                  name="pages"
                  checked={f.pages === pages}
                  onChange={() => set({ pages })}
                />
                {pages}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="field">
          <legend className="legend">
            What should it do? <span className="opt-l">tick any</span>
          </legend>
          <div className="ticks">
            {featureOptions.map((feature) => {
              const on = f.feats.includes(feature)
              return (
                <label key={feature} className={on ? 'tick on' : 'tick'}>
                  <input type="checkbox" checked={on} onChange={() => toggleFeature(feature)} />
                  <span className="box" aria-hidden />
                  {feature}
                </label>
              )
            })}
          </div>
        </fieldset>
        <fieldset className="field">
          <legend className="legend">Have your words and photos ready?</legend>
          <div className="chips">
            {contentOptions.map((content, i) => (
              <label key={content} className={f.content === content ? 'chip on' : 'chip'}>
                <input
                  id={`content-${i}`}
                  type="radio"
                  name="content"
                  checked={f.content === content}
                  onChange={() => set({ content })}
                />
                {content}
              </label>
            ))}
          </div>
        </fieldset>

        {advice ? (
          <div className="advise" role="status">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FFB21A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3 2 21h20L12 3z" />
              <path d="M12 10v5M12 18h.01" />
            </svg>
            <div>
              <b>Lane change ahead.</b> {advice.text}
              <div>
                <button type="button" onClick={() => set({ pkg: advice.switchTo })}>
                  {advice.switchLabel}
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <Controls onBack={() => go(1)} count="Junction 3 of 4" next={<NextButton>Next junction</NextButton>} />
      </form>
    )
  } else if (step === 3) {
    card = (
      <form key="s3" className={stepCls} noValidate onSubmit={next}>
        <StepTop code="J4" title="Your details" headingRef={headingRef} />
        <div className="two">
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              className={errs.name ? 'in bad' : 'in'}
              type="text"
              autoComplete="name"
              value={f.name}
              onChange={(e) => set({ name: e.target.value })}
              aria-invalid={Boolean(errs.name)}
              aria-describedby={errs.name ? 'name-err' : undefined}
            />
            <Err id="name-err" message={errs.name} />
          </div>
          <div className="field">
            <label htmlFor="phone">
              Phone <span className="opt-l">optional</span>
            </label>
            <input
              id="phone"
              className={errs.phone ? 'in bad' : 'in'}
              type="tel"
              autoComplete="tel"
              value={f.phone}
              onChange={(e) => set({ phone: e.target.value })}
              aria-invalid={Boolean(errs.phone)}
              aria-describedby={errs.phone ? 'phone-err' : undefined}
            />
            <Err id="phone-err" message={errs.phone} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className={errs.email ? 'in bad' : 'in'}
            type="email"
            autoComplete="email"
            value={f.email}
            onChange={(e) => set({ email: e.target.value })}
            aria-invalid={Boolean(errs.email)}
            aria-describedby={errs.email ? 'email-err' : undefined}
          />
          <Err id="email-err" message={errs.email} />
        </div>
        <div className="field">
          <label htmlFor="msg">
            Anything else? <span className="opt-l">optional</span>
          </label>
          <textarea
            id="msg"
            className={errs.msg ? 'in bad' : 'in'}
            placeholder="Deadlines, examples you like, what isn't working now…"
            value={f.msg}
            onChange={(e) => set({ msg: e.target.value })}
            aria-invalid={Boolean(errs.msg)}
            aria-describedby={errs.msg ? 'msg-err' : undefined}
          />
          <Err id="msg-err" message={errs.msg} />
        </div>
        <Controls onBack={() => go(2)} count="Junction 4 of 4" next={<NextButton>Review my route</NextButton>} />
      </form>
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
              : `We'll recommend a package${promo ? ', with your code taken off' : ''}`,
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
      <form key="s4" className={stepCls} action={send}>
        <StepTop code="END" title="Your route" headingRef={headingRef} />

        {state.status === 'error' ? (
          <div className="sendfail" role="alert">
            <p>{state.message}</p>
            {state.errors ? (
              <ul>
                {(Object.entries(state.errors) as [StartField, string][]).map(([field, message]) => (
                  <li key={field}>
                    {message}{' '}
                    <button className="edit" type="button" onClick={() => go(stepOfField[field])}>
                      Fix
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <dl className="rv">
          {rows.map(([label, value, edit]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                {value}
                {edit !== null ? (
                  <button className="edit" type="button" onClick={() => go(edit)}>
                    Edit
                  </button>
                ) : null}
              </dd>
            </div>
          ))}
          {promo ? (
            <div>
              <dt>Promo code</dt>
              <dd>
                {promo.code} · {promo.tag}
              </dd>
            </div>
          ) : null}
        </dl>

        {promoBox('promo')}

        <p className="small">
          Sending this doesn&apos;t commit you to anything or take payment. We reply with a written
          quote, usually within one working day. {TIMELINE_TERMS} You own everything we build.
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
        <div aria-hidden className="hp">
          <label htmlFor="website">Do not fill this in</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Controls onBack={() => go(3)} next={<SendButton />} />
      </form>
    )
  }

  const here = Math.min(shown, ROUTE.length - 1)

  return (
    <div ref={rootRef} className="sflow">
      <noscript>
        <p className="card">
          This form needs JavaScript. You can email{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a> instead.
        </p>
      </noscript>

      <section className="swrap sbody">
        <div>{card}</div>

        <aside className="summary" aria-label="Your route so far">
          <h3>Your route</h3>
          {lane ? (
            <>
              <div className="sum-big">
                {lane.variable && lane.price > 0 ? <small>from</small> : null}
                {priceText}
                {promo && fixed ? <span className="was">{money(lane.price)}</span> : null}
              </div>
              <div className="sum-pkg">{lane.name}</div>
              <dl className="sum-rows">
                {promo ? (
                  <div className="disc">
                    <dt>{promo.code}</dt>
                    <dd>{fixed ? `−${money(lane.price - net)}` : promo.what}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Deposit to start</dt>
                  <dd>{half}</dd>
                </div>
                <div>
                  <dt>Before go-live</dt>
                  <dd>{half}</dd>
                </div>
                <div>
                  <dt>Estimated time</dt>
                  <dd>{lane.timeline}</dd>
                </div>
                <div>
                  <dt>Management</dt>
                  <dd>{f.mgmt ? '1st month free' : 'Not added'}</dd>
                </div>
              </dl>
              <p className="sum-note">
                {fixed ? 'Fixed price. ' : ''}Nothing is charged until you&apos;ve had a written quote.{' '}
                {TIMELINE_TERMS}
              </p>
            </>
          ) : (
            <p className="sum-empty">Pick a lane at Junction 2 and the price, deposit and timeline appear here.</p>
          )}
          {step !== 4 && !done ? promoBox('promo-side', true) : null}
        </aside>
      </section>

      <div className="road">
        <div className="swrap roadwrap">
          <div className="carriage">
            <div className="surface" aria-hidden />
            <ol className="rd" aria-label="Your progress">
              {ROUTE.map((stop, i) => (
                <li
                  key={stop.code}
                  className={i < shown ? 'done' : i === here ? 'here' : undefined}
                  aria-current={i === here ? 'step' : undefined}
                  style={{ left: `${10 + i * 20}%` }}
                >
                  <span className="post" aria-hidden />
                  <span className="plate">{stop.code}</span>
                  <span className="lab">{stop.label}</span>
                </li>
              ))}
            </ol>
            <div
              className={motion ? (motion.rev ? 'car moving rev' : 'car moving') : 'car'}
              aria-hidden
              style={{ left: `${pos}%` }}
            >
              <svg viewBox="0 0 60 28">
                <path d="M3 20V14q0-3 3-3h9l6-7q1-1 3-1h15q2 0 3 1l5 7h8q3 0 3 3v6z" fill="#FFB21A" />
                <path d="M16 11l5-6h9v6zM32 5h7l4.5 6H32z" fill="#121417" opacity=".85" />
                <rect x="55" y="13" width="3" height="3" rx="1" fill="#FFF6D6" />
                <rect x="2.5" y="13" width="2.5" height="3" rx="1" fill="#E5484D" />
                {[14, 46].map((cx) => (
                  <g key={cx} className="wheel">
                    <circle cx={cx} cy="21" r="5.5" fill="#16181B" stroke="#8A929B" strokeWidth="1.5" />
                    <path d={`M${cx} 17v8M${cx - 4} 21h8`} stroke="#9AA1AA" strokeWidth="1.5" />
                    <circle cx={cx} cy="21" r="1.6" fill="#D5D9DE" />
                  </g>
                ))}
              </svg>
            </div>
          </div>
          <div className="psign" aria-hidden>
            <div className="p">{signTop}</div>
            <div className="d">{signSub}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
