'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight } from '@/components/graphics'
import { Wordmark } from '@/components/logo'
import { Container, buttonClass, cn } from '@/components/ui'
import { site } from '@/lib/site'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [renderedPath, setRenderedPath] = useState(pathname)

  // Close the mobile menu when the route changes. Adjusting state during
  // render is React's recommended alternative to an effect here.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="text-ink" aria-label={`${site.name} — home`}>
            <Wordmark />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
            {site.nav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'label transition-colors hover:text-accent',
                    active ? 'text-accent' : 'text-ink'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link href="/contact" className={cn(buttonClass(), 'group/btn')}>
              Start a project
              <span className="text-accent transition-transform duration-200 group-hover/btn:translate-x-1">
                <ArrowRight />
              </span>
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg
              viewBox="0 0 20 20"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 13h14" />}
            </svg>
          </button>
        </div>
      </Container>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-line bg-paper lg:hidden"
        >
          <Container className="flex flex-col py-3">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="label border-b border-line py-4 text-ink last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={cn(buttonClass({ size: 'lg' }), 'mt-5 mb-2 group/btn')}
            >
              Start a project
              <span className="text-accent">
                <ArrowRight />
              </span>
            </Link>
          </Container>
        </nav>
      ) : null}
    </header>
  )
}
