'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { WHATSAPP_NUMBER, whatsappHref } from '@/lib/contact'
import { Aurora, COOL_PALETTE } from './aurora'
import { useT } from './lang-provider'

/**
 * The panel after the home page's first screen. Left: type a message (or tap
 * an idea), watch it appear as a WhatsApp bubble, and send it straight to Che.
 * Right: start a free build; anywhere on the panel goes to /start, and each
 * chip goes to the matching heading there. Both halves have a living aurora
 * behind them (warm on the left, cool on the right) that leans towards the
 * cursor.
 */
const DISPLAY_NUMBER = WHATSAPP_NUMBER.replace(/^44/, '0').replace(/^(\d{5})(\d{6})$/, '$1 $2')

const IDEAS = ['I need a new website', 'I want online booking', 'I want a Shopify shop', 'I need a landing page', 'I need a system for my business']
const WORDS = ['website', 'booking system', 'Shopify shop', 'landing page', 'web app']
const JUMPS = [
  { label: 'New website', build: 'website' },
  { label: 'Landing page', build: 'landing' },
  { label: 'Online booking', build: 'booking' },
  { label: 'Online shop', build: 'shop' },
  { label: 'Web app or system', build: 'system' },
  { label: 'Something else', build: 'other' },
]

function spot(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function ContactSplit() {
  const t = useT()
  const router = useRouter()
  const [text, setText] = useState('')
  const [word, setWord] = useState(0)
  const btn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % WORDS.length), 2200)
    return () => clearInterval(id)
  }, [])

  function send(e: React.FormEvent) {
    e.preventDefault()
    window.open(whatsappHref(text.trim() || undefined), '_blank', 'noopener,noreferrer')
  }

  function magnet(e: React.PointerEvent<HTMLButtonElement>) {
    const el = btn.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) / r.width
    const y = (e.clientY - (r.top + r.height / 2)) / r.height
    el.style.transform = `translate(${x * 14}px, ${y * 10}px)`
  }

  const shown = text.trim()
  const [pre, post] = t('Get a free model of your {word} built').split('{word}')

  return (
    <section id="contact" className="split" aria-label={t('Get in touch')}>
      <div className="split-text" onPointerMove={spot}>
        <Aurora />
        <div className="split-grain" aria-hidden="true" />
        <div className="split-in">
          <p className="split-k">{t('Message me directly · {n}', { n: DISPLAY_NUMBER })}</p>

          <div className="split-ideas" role="group" aria-label={t('Quick ideas')}>
            {IDEAS.map((idea) => (
              <button key={idea} type="button" className="split-idea" aria-pressed={text === idea} onClick={() => setText(text === idea ? '' : idea)}>
                {t(idea)}
              </button>
            ))}
          </div>

          <div className="split-bubble" aria-hidden="true">
            <span className="split-bubble-who">{t('You → Che')}</span>
            {shown ? (
              <p key="t">{shown}</p>
            ) : (
              <p key="d" className="typing">
                <i />
                <i />
                <i />
              </p>
            )}
          </div>

          <form className="split-form" onSubmit={send} noValidate>
            <label htmlFor="split-msg" className="sr">
              {t('Your message')}
            </label>
            <input id="split-msg" type="text" placeholder={t('Or type your own message…')} value={text} onChange={(e) => setText(e.target.value)} autoComplete="off" />
            <button
              ref={btn}
              type="submit"
              className="split-go"
              onPointerMove={magnet}
              onPointerLeave={() => {
                if (btn.current) btn.current.style.transform = ''
              }}
            >
              {t('Message me')} <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="split-note">{t('Opens WhatsApp with your message ready to send. No calls.')}</p>
        </div>
      </div>

      <div
        className="split-start"
        onPointerMove={spot}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a,button')) return
          router.push('/start')
        }}
      >
        <Aurora palette={COOL_PALETTE} />
        <div className="split-grain" aria-hidden="true" />
        <div className="split-spot" aria-hidden="true" />
        <p className="split-k" aria-live="off">
          {pre}
          <span key={word} className="split-word">
            {t(WORDS[word])}
          </span>
          {post}
        </p>
        <Link href="/start" className="split-big">
          {t('Start a project')} <span aria-hidden="true">→</span>
        </Link>
        <p className="split-sub">{t('Free model, no deposit. Like it? Buy the final site. Don’t? I won’t contact you again.')}</p>
        <div className="split-jumps" role="group" aria-label={t('Jump straight to what you need')}>
          {JUMPS.map((j) => (
            <Link key={j.build} href={`/start?build=${j.build}`} className="split-jump">
              {t(j.label)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
