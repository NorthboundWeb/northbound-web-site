import type { Metadata } from 'next'
import { Anton, Inter } from 'next/font/google'
import { LogoDefs } from '@/components/logo'
import { MountainDefs } from '@/components/mountain'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { LOCALES, LOCALE_META, isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getCurrency } from '@/lib/prefs/server'
import { structuredData } from '@/lib/seo'
import { site } from '@/lib/site'
import '../globals.css'

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

// Condensed, heavy, uppercase — the poster voice.
const display = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    'web design',
    'web development',
    'small business website',
    'website maintenance',
    'UK web developer',
    'AI employees',
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  /**
   * Next types the segment as a plain string, which is correct: anyone can
   * type /xx/web. Narrow it here rather than assuming, so an unknown prefix
   * 404s instead of crashing on a missing dictionary.
   */
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = await getDictionary(locale)
  const currency = await getCurrency()
  // Set by the proxy for this request; stamps the inline JSON-LD so the CSP
  // does not have to allow all inline script.
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    <html
      lang={LOCALE_META[locale].tag}
      className={`${body.variable} ${display.variable}`}
    >
      <body className="relative flex min-h-dvh flex-col bg-black text-chalk">
        {/*
          Structured data. Injected as a script tag rather than through a
          component so it lands in the static HTML for crawlers that do not
          run JavaScript.
        */}
        <script
          nonce={nonce}
          type="application/ld+json"
          // The payload is built in this repository from site config — no
          // user input reaches it, so there is nothing here to escape.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(locale)) }}
        />

        {/* Shared SVG paint, declared once per page so no id is duplicated. */}
        <LogoDefs />
        <MountainDefs />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-cream focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
        >
          {t.common.skipToContent}
        </a>
        <SiteHeader
          locale={locale}
          currency={currency}
          labels={{
            nav: t.common.nav,
            letsTalk: t.common.cta.letsTalk,
            openMenu: t.common.openMenu,
            closeMenu: t.common.closeMenu,
            home: t.common.home,
          }}
        />
        <main id="main" tabIndex={-1} className="relative z-10 flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter locale={locale} currency={currency} t={t} />
      </body>
    </html>
  )
}
