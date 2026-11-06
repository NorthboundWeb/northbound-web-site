import Link from 'next/link'
import { messageHref, messageLabel } from '@/lib/contact'
import { getT } from '@/lib/i18n/server'
import { PAGES, SOCIALS } from '@/lib/nav'

export async function SiteFooter() {
  const { t } = await getT()
  return (
    <footer className="site-foot">
      <div className="wrap foot-grid">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark.png" alt="Northbound Web" width={92} height={40} className="foot-mark" />
          <p className="foot-line">{t('Websites for UK small businesses. Priced up front, built properly, yours to keep.')}</p>
        </div>
        <nav aria-label="Footer">
          <p className="label">{t('Pages')}</p>
          <ul>
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link href={p.href}>{t(p.label)}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="label">{t('Get in touch')}</p>
          <ul>
            <li>
              <a href={messageHref()} target="_blank" rel="noopener noreferrer">
                {t(messageLabel)}
              </a>
            </li>
            <li>
              <Link href="/email">{t('Email me')}</Link>
            </li>
            <li>
              <Link href="/portal">{t('Client login')}</Link>
            </li>
            {SOCIALS.map((s) => (
              <li key={s.href}>
                <a href={s.href} rel="noopener noreferrer" target="_blank">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap foot-base">
        <span>{t('© Northbound Web · United Kingdom')}</span>
        <span>{t('Free model, then pay if you like it')}</span>
      </div>
    </footer>
  )
}

/** The floating "Message me" pill at the bottom of the marketing pages. */
export async function MessagePill() {
  const { t } = await getT()
  return (
    <a className="message-pill" href={messageHref()} target="_blank" rel="noopener noreferrer" aria-label={t(messageLabel)}>
      {t('Message me')}
      <span aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4A8 8 0 1 1 20 12z" />
        </svg>
      </span>
    </a>
  )
}
