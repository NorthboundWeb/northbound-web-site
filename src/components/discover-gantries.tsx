'use client'

import Link from 'next/link'
import { useState } from 'react'
import { routes, type Route } from '@/lib/discover'

/**
 * Three gantries, one per way of getting a website. Each sign opens to show
 * the same four signs underneath (speed, design, features, price), so the
 * three can be read side by side. Northbound's is open to start with.
 *
 * The panel opens with the grid-rows trick, so nothing is measured, and the
 * gantry posts grow with it to keep the sign held up.
 */
export function DiscoverGantries() {
  const [open, setOpen] = useState<Route['key'] | null>('northbound')

  return (
    <div className="gantries">
      {routes.map((r) => {
        const isOpen = open === r.key
        const panelId = `panel-${r.key}`
        return (
          <article key={r.key} className="dg">
            <span aria-hidden className="dg-post l" style={{ height: isOpen ? '100%' : 186 }} />
            <span aria-hidden className="dg-post r" style={{ height: isOpen ? '100%' : 186 }} />
            <div aria-hidden className="dg-beam" />

            <div className={`dg-sign ${r.tone}${isOpen ? ' is-open' : ''}`}>
              <button
                className="dg-head"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen((o) => (o === r.key ? null : r.key))}
              >
                <span className="dg-shield" aria-hidden>
                  {r.code}
                </span>
                <span className="dg-title">
                  <b>{r.title}</b>
                  <span>{r.sub}</span>
                </span>
                <span className="dg-chev" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>

              <div className={isOpen ? 'dg-panel open' : 'dg-panel'} id={panelId} inert={!isOpen}>
                <div className="dg-panel-in">
                  <div className="dg-panel-body">
                    <div className="dg-rule" aria-hidden />
                    <dl className="dg-rows">
                      <div>
                        <dt>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
                          </svg>
                          Speed
                        </dt>
                        <dd>
                          <span className="dg-big">{r.speed}</span>
                          <span className="dg-note">{r.speedNote}</span>
                        </dd>
                      </div>
                      <div>
                        <dt>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />
                          </svg>
                          Design
                        </dt>
                        <dd>
                          <span className="dg-big">{r.design}</span>
                          <span className="dg-note">{r.designNote}</span>
                        </dd>
                      </div>
                      <div>
                        <dt>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M3 10h18M9 20V10" />
                          </svg>
                          Features
                        </dt>
                        <dd>
                          <span className="dg-big">{r.features}</span>
                          <span className="dg-note">{r.featuresNote}</span>
                        </dd>
                      </div>
                      <div>
                        <dt>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <circle cx="12" cy="12" r="9" />
                            <path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.7 0-3 1-3 2.2 0 2.8 5.5 1.3 5.5 4 0 1.3-1.3 2.3-3 2.3-1.2 0-2.3-.6-2.8-1.6M12 6.5v1.5M12 16.5V18" />
                          </svg>
                          Price
                        </dt>
                        <dd>
                          <span className="dg-big">
                            {r.price}
                            {r.priceUnit ? <small>{r.priceUnit}</small> : null}
                          </span>
                          <span className="dg-note">{r.priceNote}</span>
                        </dd>
                      </div>
                    </dl>
                    <div className="dg-verdict">
                      <span>
                        <b>Best when:</b> {r.bestWhen}
                      </span>
                      {r.tone === 'nb' ? <Link href="/#prices">See the plans</Link> : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
