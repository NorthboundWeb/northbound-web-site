import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { structuredData } from '@/lib/seo'
import { site } from '@/lib/site'
import './globals.css'

const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: { card: 'summary_large_image', title: site.name, description: site.description },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={body.variable}>
      <body className="flex min-h-dvh flex-col">
        <script
          type="application/ld+json"
          // Built from site.ts, never from user input. "<" is escaped so the
          // payload can never close the script tag early.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData()).replace(/</g, '\\u003c'),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <header className="border-b border-ink/10">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              {site.name}
            </Link>
            <nav aria-label="Main" className="flex gap-6 text-sm">
              {site.nav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main id="main" className="flex-1">
          {children}
        </main>
        <footer className="border-t border-ink/10 text-sm text-muted">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-8">
            <p>
              © {new Date().getFullYear()} {site.name}
            </p>
            <p className="flex gap-5">
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-ink">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="hover:text-ink">
                {site.email}
              </a>
              <Link href="/privacy" className="hover:text-ink">
                Privacy
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
