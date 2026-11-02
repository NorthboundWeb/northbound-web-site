'use client'

import type { Art } from '@/lib/store/catalog'

/**
 * Small drawn-in-CSS pictures for each product, so the store needs no photos
 * yet. The card and stand pictures lean towards the pointer (see `.pa` and
 * the --tx/--ty variables set by the parent card).
 */
export function ProductArt({ art, large = false }: { art: Art; large?: boolean }) {
  const cls = `pa pa-${art.kind}${large ? ' pa-lg' : ''}`
  switch (art.kind) {
    case 'site':
      return (
        <div className={`${cls} pa-site-${art.tone}`} aria-hidden="true">
          <div className="pa-browser">
            <div className="pa-bar">
              <i />
              <i />
              <i />
            </div>
            <div className="pa-page">
              <b />
              <span />
              <span />
              <em />
              <div className="pa-cols">
                <u />
                <u />
                {art.tone !== 'pro' && <u />}
              </div>
            </div>
          </div>
        </div>
      )
    case 'plan':
      return (
        <div className={cls} aria-hidden="true">
          <div className="pa-shield">
            <svg viewBox="0 0 48 56">
              <path d="M24 3l19 7v15c0 13-8 23-19 28C13 48 5 38 5 25V10z" />
              <path className="pa-tick" d="M15 28l7 7 12-14" />
            </svg>
          </div>
          <div className="pa-dots">
            {[1, 2, 3].map((n) => (
              <i key={n} className={n <= art.level ? 'on' : undefined} />
            ))}
          </div>
        </div>
      )
    case 'card':
      return (
        <div className={`${cls} pa-${art.material}`} aria-hidden="true">
          <div className="pa-cardface">
            <span className="pa-chip" />
            <span className="pa-wave">
              <i />
              <i />
              <i />
            </span>
            <b>Your Name</b>
            <small>Your business</small>
            <i className="pa-shine" />
          </div>
        </div>
      )
    case 'stand':
      return (
        <div className={cls} aria-hidden="true">
          <div className="pa-standface">
            {art.stars && <span className="pa-stars">★★★★★</span>}
            <span className="pa-phone" />
            <b>{art.label}</b>
            <span className="pa-qr" />
            <i className="pa-shine" />
          </div>
          <div className="pa-base" />
        </div>
      )
    case 'plaque':
      return (
        <div className={cls} aria-hidden="true">
          <div className="pa-plaqueface">
            <span className="pa-stars">★★★★★</span>
            <b>Loved us?</b>
            <small>Tap or scan to review</small>
            <span className="pa-qr" />
            <i className="pa-shine" />
          </div>
        </div>
      )
    case 'tag':
      return (
        <div className={cls} aria-hidden="true">
          <div className="pa-disc">
            <span className="pa-wave">
              <i />
              <i />
              <i />
            </span>
            <b>{art.label}</b>
          </div>
        </div>
      )
    case 'tablet':
      return (
        <div className={`${cls} pa-tab-${art.mode}`} aria-hidden="true">
          <div className="pa-ipad">
            <div className="pa-screen">
              {art.mode === 'menu' && (
                <>
                  <div className="pa-tabs">
                    <i className="on" />
                    <i />
                    <i />
                  </div>
                  <div className="pa-items">
                    {[0, 1, 2, 3].map((n) => (
                      <span key={n} style={{ animationDelay: `${n * 0.6}s` }}>
                        <u />
                        <em />
                      </span>
                    ))}
                  </div>
                  <div className="pa-cta">Order</div>
                </>
              )}
              {art.mode === 'booking' && (
                <>
                  <div className="pa-cal">
                    {Array.from({ length: 21 }, (_, n) => (
                      <i key={n} className={n === 9 ? 'pick' : n % 5 === 3 ? 'off' : undefined} />
                    ))}
                  </div>
                  <div className="pa-slots">
                    <span />
                    <span className="on" />
                    <span />
                  </div>
                  <div className="pa-cta">Book</div>
                </>
              )}
              {art.mode === 'checkin' && (
                <>
                  <div className="pa-form">
                    <span />
                    <span />
                    <span className="pa-sign" />
                  </div>
                  <div className="pa-cta">Check in</div>
                </>
              )}
            </div>
          </div>
        </div>
      )
  }
}
