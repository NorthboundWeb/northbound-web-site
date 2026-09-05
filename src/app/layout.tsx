import type { Metadata } from 'next'
import { Anton, Inter } from 'next/font/google'
import { LogoDefs } from '@/components/logo'
import { MountainDefs } from '@/components/mountain'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { structuredData } from '@/lib/seo'
import { site } from '@/lib/site'
import './globals.css'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={`${body.variable} ${display.variable}`}>
      <body className="relative flex min-h-dvh flex-col bg-black text-chalk">
        {/*
          Structured data. Injected as a script tag rather than through a
          component so it lands in the static HTML for crawlers that do not
          run JavaScript.
        */}
        <script
          type="application/ld+json"
          // The payload is built in this repository from site config — no
          // user input reaches it, so there is nothing here to escape.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />

        {/* Shared SVG paint, declared once per page so no id is duplicated. */}
        <LogoDefs />
        <MountainDefs />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-cream focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="relative z-10 flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
