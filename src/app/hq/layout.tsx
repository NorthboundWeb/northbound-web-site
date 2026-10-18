import type { Metadata } from 'next'
import { Anton, Inter } from 'next/font/google'
import { HqNav } from './_components/nav'
import '../globals.css'

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const display = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

/**
 * Private workspace. Everything under /hq is for the owner only: it is kept
 * out of search results here as well as by the proxy's X-Robots-Tag header, so
 * a misconfigured header alone could not expose it.
 */
export const metadata: Metadata = {
  title: { default: 'Northbound HQ', template: '%s — Northbound HQ' },
  robots: { index: false, follow: false, nocache: true },
}

export default function HqLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${body.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-black text-chalk">
        <HqNav />
        <main id="main" className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 sm:px-8">
          {children}
        </main>
      </body>
    </html>
  )
}
