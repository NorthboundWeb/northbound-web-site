'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { whatsappHref } from '@/lib/contact'
import { CATEGORIES, PRODUCTS, priceLabel, searchProducts, type CategoryId, type Product } from '@/lib/store/catalog'
import { checkDiscount } from '@/app/store/actions'
import { discounted } from '@/lib/store/discounts'
import { useT } from '../lang-provider'
import { Aurora, COOL_PALETTE } from '../aurora'
import { ProductArt } from './product-art'

/**
 * The store (shown only once unlocked; see src/lib/store/gate.ts).
 *
 * Search + category pills at the top (sticky), products grouped by category,
 * a sheet with the details of each product, and a request bar pinned to the
 * bottom: type anything you cannot find, or send the list you have built up.
 * Nothing is charged on the site; the list goes to Che on WhatsApp.
 */

type Line = { id: string; qty: number; option?: string }

const LIST_KEY = 'nb_store_list'

function loadList(): Line[] {
  try {
    const raw = window.localStorage.getItem(LIST_KEY)
    const v = raw ? (JSON.parse(raw) as Line[]) : []
    return Array.isArray(v) ? v.filter((l) => PRODUCTS.some((p) => p.id === l.id)) : []
  } catch {
    return []
  }
}

/** Lean the product picture towards the pointer. */
function lean(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--tx', `${((e.clientX - r.left) / r.width - 0.5).toFixed(3)}`)
  el.style.setProperty('--ty', `${((e.clientY - r.top) / r.height - 0.5).toFixed(3)}`)
}
function unlean(e: React.PointerEvent<HTMLElement>) {
  e.currentTarget.style.removeProperty('--tx')
  e.currentTarget.style.removeProperty('--ty')
}

export function Storefront() {
  const t = useT()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<CategoryId | 'all'>('all')
  const [open, setOpen] = useState<Product | null>(null)
  const [list, setList] = useState<Line[]>([])
  const [listOpen, setListOpen] = useState(false)
  const [request, setRequest] = useState('')
  const [flash, setFlash] = useState('')
  const [disc, setDisc] = useState<{ code: string; percent: number; label: string } | null>(null)
  const [codeIn, setCodeIn] = useState('')
  const [codeMsg, setCodeMsg] = useState('')
  const loaded = useRef(false)
  const requestBox = useRef<HTMLInputElement>(null)
  const closeSheet = useCallback(() => setOpen(null), [])
  const [hideTools, setHideTools] = useState(false)
  const lastY = useRef(0)
  const focused = useRef(false)

  // Slide the search and categories away when scrolling down. They only come back after a
  // proper scroll up (about 160px), so a small nudge or a bounce does not bring them straight back.
  useEffect(() => {
    lastY.current = window.scrollY
    let up = 0
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - lastY.current
      lastY.current = y
      if (focused.current || y < 160) {
        up = 0
        setHideTools(false)
        return
      }
      if (dy > 0) {
        up = 0
        if (dy > 4) setHideTools(true)
      } else if (dy < 0) {
        up += -dy
        if (up > 160) setHideTools(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      setList(loadList())
      loaded.current = true
    }, 0)
    return () => clearTimeout(id)
  }, [])
  useEffect(() => {
    if (!loaded.current) return
    try {
      window.localStorage.setItem(LIST_KEY, JSON.stringify(list))
    } catch {}
  }, [list])

  const results = useMemo(() => {
    const base = cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)
    return searchProducts(q, base)
  }, [q, cat])

  const grouped = cat === 'all' && !q.trim()
  const count = list.reduce((n, l) => n + l.qty, 0)

  function add(p: Product, qty = 1, option?: string) {
    setList((cur) => {
      const i = cur.findIndex((l) => l.id === p.id && l.option === option)
      if (i === -1) return [...cur, { id: p.id, qty, option }]
      return cur.map((l, j) => (j === i ? { ...l, qty: l.qty + qty } : l))
    })
    setFlash(`${p.name} ${t('added to your basket')}`)
    window.setTimeout(() => setFlash(''), 1800)
  }

  const priceOf = (p: Product) => {
    if (p.price === null) return priceLabel(p)
    const base = disc ? discounted(p.price, disc.percent) : p.price
    return [p.pricePrefix, `£${base.toLocaleString('en-GB')}`, p.priceSuffix].filter(Boolean).join(' ') + (disc ? ` (was £${p.price.toLocaleString('en-GB')})` : '')
  }
  const total = list.reduce((n, l) => {
    const p = PRODUCTS.find((x) => x.id === l.id)
    return p && p.price !== null ? n + (disc ? discounted(p.price, disc.percent) : p.price) * l.qty : n
  }, 0)

  async function applyCode() {
    if (!codeIn.trim()) return
    const r = await checkDiscount(codeIn)
    if (r.ok) {
      setDisc({ code: r.code, percent: r.percent, label: r.label })
      setCodeMsg('')
      setCodeIn('')
    } else setCodeMsg(r.message)
  }

  const listText = list
    .map((l) => {
      const p = PRODUCTS.find((x) => x.id === l.id)
      return p ? `• ${p.name}${l.option ? ` (${l.option})` : ''}${l.qty > 1 ? ` × ${l.qty}` : ''} — ${priceOf(p)}` : ''
    })
    .filter(Boolean)
    .join('\n')

  function send() {
    const parts = ['Hi Che, I found this on the store.']
    if (listText) parts.push(`My list:\n${listText}`)
    if (disc) parts.push(`Discount code: ${disc.code} (${disc.label})`)
    if (request.trim()) parts.push(`I'd also like: ${request.trim()}`)
    window.open(whatsappHref(parts.join('\n\n')), '_blank', 'noopener,noreferrer')
  }

  function askFor(text: string) {
    setRequest(text)
    requestBox.current?.focus()
  }

  return (
    <div className="st">
      <section className="page-head wrap st-head">
        <p className="eyebrow">{t('Store')}</p>
        <h1 className="section-h big">
          {t('Get found. Get tapped.')}
          <span>{t('Get booked.')}</span>
        </h1>
        <p className="section-sub">{t('Websites, NFC business cards, Google review stands and tablet systems for UK small businesses. Add what you like to your list and send it to me; nothing is charged here.')}</p>
      </section>

      {/* ---- search + categories (sticky) ---------------------------------- */}
      <div className={`st-tools${hideTools ? ' away' : ''}`} onFocus={() => { focused.current = true; setHideTools(false) }} onBlur={() => { focused.current = false }}>
        <div className="wrap">
          <div className="st-toolrow">
            <form className="st-search" role="search" onSubmit={(e) => e.preventDefault()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <label htmlFor="st-q" className="sr">
                {t('Search the store')}
              </label>
              <input id="st-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Search the store, e.g. “review”, “metal”, “iPad”')} autoComplete="off" />
              {q && (
                <button type="button" className="st-clear" onClick={() => setQ('')} aria-label={t('Clear search')}>
                  ×
                </button>
              )}
            </form>
            <button
              type="button"
              className="st-basket"
              onClick={() => {
                setListOpen(true)
                document.getElementById('st-request')?.scrollIntoView({ behavior: 'smooth', block: 'end' })
              }}
              aria-label={t('Basket')}
              aria-expanded={listOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 7h12l-1 13H7z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              <span className="st-basket-t">{t('Basket')}</span>
              {count > 0 && <em key={count}>{count}</em>}
            </button>
          </div>
          <div className="st-cats" role="tablist" aria-label={t('Categories')}>
            <button type="button" role="tab" aria-selected={cat === 'all'} className="pill sm" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
              {t('All')}
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} className="pill sm" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                {t(c.label)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---- products ------------------------------------------------------ */}
      <div className="wrap st-body">
        {results.length === 0 ? (
          <div className="st-empty">
            <p className="st-empty-h">{t('Nothing matches “{q}” yet.', { q: q.trim() })}</p>
            <p>{t('If it can be tapped, scanned, booked or built, I can probably make it. Ask for it below.')}</p>
            <button type="button" className="btn dark" onClick={() => askFor(q.trim())}>
              {t('Request “{q}”', { q: q.trim() })}
            </button>
          </div>
        ) : grouped ? (
          CATEGORIES.map((c) => {
            const items = results.filter((p) => p.category === c.id)
            if (!items.length) return null
            return (
              <section key={c.id} className="st-group" aria-labelledby={`st-g-${c.id}`}>
                <div className="st-group-head">
                  <h2 id={`st-g-${c.id}`}>{t(c.label)}</h2>
                  <p>{t(c.blurb)}</p>
                  <button type="button" className="st-more" onClick={() => setCat(c.id)}>
                    {t('See all')} <span aria-hidden="true">→</span>
                  </button>
                </div>
                <Grid items={items} onOpen={setOpen} onAdd={add} />
              </section>
            )
          })
        ) : (
          <>
            <p className="st-count" aria-live="polite">
              {results.length === 1 ? t('1 result') : t('{n} results', { n: results.length })}
            </p>
            <Grid items={results} onOpen={setOpen} onAdd={add} />
          </>
        )}
      </div>

      {open && <Sheet product={open} onClose={closeSheet} onAdd={add} />}

      {/* ---- request bar ---------------------------------------------------- */}
      <div className="st-reqbar" id="st-request">
        <Aurora palette={COOL_PALETTE} />
        <div className="split-grain" aria-hidden="true" />
        <div className="st-reqwrap">
        {listOpen && (
          <div className="st-list" role="dialog" aria-label={t('Your basket')}>
            <div className="st-list-head">
              <b>{t('Your basket')}</b>
              <button type="button" className="st-x" onClick={() => setListOpen(false)} aria-label={t('Close')}>
                ×
              </button>
            </div>
            {list.length === 0 ? (
              <p className="st-small">{t('Nothing in it yet. Tap + on anything to add it.')}</p>
            ) : (
              <ul>
                {list.map((l, i) => {
                  const p = PRODUCTS.find((x) => x.id === l.id)
                  if (!p) return null
                  return (
                    <li key={`${l.id}-${l.option ?? ''}`}>
                      <span>
                        <b>{p.name}</b>
                        <small>
                          {l.option ? `${l.option} · ` : ''}
                          {t(priceOf(p))}
                        </small>
                      </span>
                      <span className="st-qty">
                        <button type="button" aria-label={t('One fewer')} onClick={() => setList((cur) => cur.map((x, j) => (j === i ? { ...x, qty: x.qty - 1 } : x)).filter((x) => x.qty > 0))}>
                          −
                        </button>
                        <em>{l.qty}</em>
                        <button type="button" aria-label={t('One more')} onClick={() => setList((cur) => cur.map((x, j) => (j === i ? { ...x, qty: x.qty + 1 } : x)))}>
                          +
                        </button>
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
            {list.length > 0 && (
              <div className="st-opt">
                {disc ? (
                  <p className="st-small">
                    {t('Code')} <b>{disc.code}</b> · {t(disc.label)}{' '}
                    <button type="button" className="st-x" onClick={() => setDisc(null)} aria-label={t('Remove code')}>
                      ×
                    </button>
                  </p>
                ) : (
                  <form
                    className="st-opt-row"
                    onSubmit={(e) => {
                      e.preventDefault()
                      void applyCode()
                    }}
                  >
                    <input value={codeIn} onChange={(e) => setCodeIn(e.target.value)} placeholder={t('Discount code')} autoComplete="off" autoCapitalize="characters" aria-label={t('Discount code')} />
                    <button type="submit" className="pill sm">
                      {t('Apply')}
                    </button>
                  </form>
                )}
                {codeMsg && <p className="st-small">{t(codeMsg)}</p>}
                {total > 0 && <p className="st-small">{t('Total of priced items')}: £{total.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</p>}
              </div>
            )}
            {list.length > 0 && (
              <div className="st-list-actions">
                <button type="button" className="btn" onClick={() => setList([])}>
                  {t('Clear list')}
                </button>
                <button type="button" className="btn dark" onClick={send}>
                  {t('Send list on WhatsApp')}
                </button>
              </div>
            )}
          </div>
        )}
        <form
          className="st-reqform"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <button type="button" className="st-listbtn" onClick={() => setListOpen((o) => !o)} aria-expanded={listOpen}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 7h12l-1 13H7z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span className="sr">{t('Your list')}</span>
            {count > 0 && <em key={count}>{count}</em>}
          </button>
          <label htmlFor="st-req" className="sr">
            {t('Request something')}
          </label>
          <input ref={requestBox} id="st-req" value={request} onChange={(e) => setRequest(e.target.value)} placeholder={t('Can’t see it? Request anything…')} autoComplete="off" />
          <button type="submit" className="st-send" disabled={!request.trim() && list.length === 0}>
            {t('Send')}
          </button>
        </form>
        </div>
        <p className={`st-flash${flash ? ' show' : ''}`} role="status">
          {flash}
        </p>
      </div>
    </div>
  )
}

function Grid({ items, onOpen, onAdd }: { items: Product[]; onOpen: (p: Product) => void; onAdd: (p: Product) => void }) {
  const t = useT()
  return (
    <ul className="st-grid">
      {items.map((p, i) => (
        <li key={p.id} className="st-item" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
          <button type="button" className="st-item-open" onClick={() => onOpen(p)} onPointerMove={lean} onPointerLeave={unlean}>
            <span className="st-art">
              <ProductArt art={p.art} />
            </span>
            {p.badge && <span className="st-badge">{t(p.badge)}</span>}
            <span className="st-item-name">{t(p.name)}</span>
            <span className="st-item-sum">{t(p.summary)}</span>
            <span className={`st-item-price${p.price === null ? ' ask' : ''}`}>{t(priceLabel(p))}</span>
          </button>
          <button type="button" className="st-add" onClick={() => onAdd(p)} aria-label={t('Add {name} to your list', { name: p.name })}>
            +
          </button>
        </li>
      ))}
    </ul>
  )
}

function Sheet({ product: p, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (p: Product, qty?: number, option?: string) => void }) {
  const t = useT()
  const [option, setOption] = useState(p.options?.choices[0])
  const [qty, setQty] = useState(1)
  const [custom, setCustom] = useState(false)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    closeBtn.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="st-sheet-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="st-sheet" role="dialog" aria-modal="true" aria-labelledby="st-sheet-h">
        <button ref={closeBtn} type="button" className="st-x st-sheet-x" onClick={onClose} aria-label={t('Close')}>
          ×
        </button>
        <div className="st-sheet-art" onPointerMove={lean} onPointerLeave={unlean}>
          <ProductArt art={p.art} large />
        </div>
        <div className="st-sheet-body">
          <p className="eyebrow">{t(CATEGORIES.find((c) => c.id === p.category)?.label ?? '')}</p>
          <h2 id="st-sheet-h">{t(p.name)}</h2>
          <p className={`st-sheet-price${p.price === null ? ' ask' : ''}`}>{t(priceLabel(p))}</p>
          <p>{t(p.summary)}</p>
          <ul className="st-ticks">
            {p.details.map((d) => (
              <li key={d}>{t(d)}</li>
            ))}
          </ul>
          {p.options && (
            <div className="st-opt">
              <p className="label">{t(p.options.label)}</p>
              <div className="st-opt-row">
                {p.options.choices.map((c) => (
                  <button key={c} type="button" className="pill sm" aria-pressed={option === c} onClick={() => setOption(c)}>
                    {t(c)}
                  </button>
                ))}
              </div>
            </div>
          )}
          {p.customDesign && (
            <div className="st-opt">
              <p className="label">{t('Design')}</p>
              <div className="st-opt-row">
                <button type="button" className="pill sm" aria-pressed={!custom} onClick={() => setCustom(false)}>
                  {t('My design')}
                </button>
                <button type="button" className="pill sm" aria-pressed={custom} onClick={() => setCustom(true)}>
                  {t('Custom design (optional)')}
                </button>
              </div>
              <p className="st-small">{custom ? t('You send me your own design or ideas and I make the card to match.') : t('I design the card for you, in Northbound style, with your details.')}</p>
            </div>
          )}
          {p.quantity && (
            <div className="st-opt">
              <p className="label">{t('How many')}</p>
              <span className="st-qty st-qty-lg">
                <button type="button" aria-label={t('One fewer')} onClick={() => setQty((n) => Math.max(1, n - 1))}>
                  −
                </button>
                <em>{qty}</em>
                <button type="button" aria-label={t('One more')} onClick={() => setQty((n) => Math.min(999, n + 1))}>
                  +
                </button>
              </span>
            </div>
          )}
          {p.price === null && <p className="st-small">{t('Prices for this are being finalised. Add it to your list and I will send you a price.')}</p>}
          <div className="st-sheet-actions">
            <button
              type="button"
              className="btn dark"
              onClick={() => {
                onAdd(p, qty, [option, p.customDesign && custom ? 'Custom design' : ''].filter(Boolean).join(' · ') || undefined)
                onClose()
              }}
            >
              {t('Add to my list')}
            </button>
            {p.startHref && (
              <Link className="btn" href={p.startHref}>
                {p.category === 'websites' ? t('Start this build') : t('Ask for a quote')} <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
