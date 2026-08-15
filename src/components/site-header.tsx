'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Wordmark } from '@/components/logo'
import { Container, buttonClass, cn } from '@/components/ui'
import { site } from '@/lib/site'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [renderedPath, setRenderedPath] = useState(pathname)

  // Close the mobile menu whenever the route changes, otherwise it stays open
  // over the new page. Adjusting state during render is React's recommended
  // alternative to an effect here — it re-renders before the browser paints,
  // so the open menu is never shown against the new route.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="rounded-sm text-ink"
            aria-label={`${site.name} — home`}
          >
            <Wordmark />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {site.nav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'text-sm transition-colors hover:text-ink',
                    active ? 'text-ink' : 'text-ink-muted'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link href="/contact" className={buttonClass()}>
              Get a quote
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-ink md:hidden"
          >
            <span className="sr-only">
              {open ? 'Close menu' : 'Open menu'}
            </span>
            <svg
              viewBox="0 0 20 20"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 6h14M3 13h14" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-line bg-paper md:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="rounded-md px-1 py-3 text-base text-ink-muted hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={cn(buttonClass({ size: 'lg' }), 'mt-3')}
            >
              Get a quote
            </Link>
          </Container>
        </nav>
      ) : null}
    </header>
  )
}
