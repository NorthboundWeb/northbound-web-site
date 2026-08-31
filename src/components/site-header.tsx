'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight } from '@/components/graphics'
import { Wordmark } from '@/components/logo'
import { Container, buttonClass, cn } from '@/components/ui'
import { divisionFor, divisions, parentNav, site } from '@/lib/site'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [renderedPath, setRenderedPath] = useState(pathname)

  // Close the mobile menu on navigation. Adjusting state during render is
  // React's recommended alternative to an effect here.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setOpen(false)
  }

  const division = divisionFor(pathname)
  const links = division ? division.nav : divisions.map((d) => ({ href: d.href, label: d.wordmark }))
  const cta = division?.id === 'ai'
    ? { href: '/ai/full-access', label: 'Request Full Access' }
    : { href: '/contact', label: 'Start a project' }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-ink" aria-label={`${site.name} — home`}>
              <Wordmark />
            </Link>
            {division ? (
              <>
                <span aria-hidden className="h-4 w-px bg-line-strong" />
                <Link
                  href={division.href}
                  className="label text-accent-deep transition-colors hover:text-ink"
                >
                  {division.name}
                </Link>
              </>
            ) : null}
          </div>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {links.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'label transition-colors hover:text-accent-deep',
                    active ? 'text-accent-deep' : 'text-ink'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            {parentNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={cn(
                  'label transition-colors hover:text-accent-deep',
                  pathname === item.href ? 'text-accent-deep' : 'text-ink-faint'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href={cta.href} className={cn(buttonClass(), 'group/btn')}>
              {cta.label}
              <span className="text-accent-on-ink transition-transform duration-200 group-hover/btn:translate-x-1">
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
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
              {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 13h14" />}
            </svg>
          </button>
        </div>
      </Container>

      {open ? (
        <nav id="mobile-nav" aria-label="Main" className="rise-in border-t border-line bg-paper lg:hidden">
          <Container className="flex flex-col py-3">
            {/* Division switcher first — the parent brand is the frame. */}
            <div className="mb-2 grid grid-cols-2 gap-px border border-line bg-line">
              {divisions.map((d) => (
                <Link
                  key={d.id}
                  href={d.href}
                  className={cn(
                    'label bg-paper px-4 py-4 text-center',
                    division?.id === d.id ? 'text-accent-deep' : 'text-ink'
                  )}
                >
                  {d.name}
                </Link>
              ))}
            </div>
            {[...links, ...parentNav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="label border-b border-line py-4 text-ink last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link href={cta.href} className={cn(buttonClass({ size: 'lg' }), 'group/btn mt-5 mb-2')}>
              {cta.label}
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
