'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Lockup, Mark } from '@/components/logo'
import { Container, cn } from '@/components/ui'
import { site } from '@/lib/site'

/** Scroll distance after which the header compacts to the symbol. */
const COMPACT_AT = 120

/**
 * Sticky header carrying the persistent Northbound mark.
 *
 * The logo follows the visitor down the page by compacting *in place* rather
 * than detaching into a floating badge. That is deliberate: a sticky header
 * occupies its own space in the layout, so it can never end up pinned across
 * the middle of the content — which is the failure mode a fixed, free-floating
 * logo produces, and the one this site has hit before. It also reads as
 * permanent wayfinding rather than a plugin someone bolted on.
 *
 * Both logo variants are rendered at once and cross-faded, so the transition
 * costs opacity and transform only — no layout shift, and no reflow on scroll.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const [renderedPath, setRenderedPath] = useState(pathname)
  const frame = useRef(0)

  // Close the mobile menu when the route changes. Adjusting state during
  // render is React's recommended alternative to an effect here.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const onScroll = () => {
      // Coalesce to one read per frame; the listener itself never measures.
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        setCompact(window.scrollY > COMPACT_AT)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  // The open mobile menu owns the viewport: stop the page scrolling behind it,
  // and let Escape close it.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      data-compact={compact ? '' : undefined}
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300',
        compact || open
          ? 'border-b border-line bg-black/95 backdrop-blur-sm'
          : 'border-b border-transparent bg-transparent'
      )}
      style={{
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <Container>
        <div
          className={cn(
            'flex items-center justify-between gap-6 transition-[height] duration-300',
            compact ? 'h-16' : 'h-20 sm:h-24'
          )}
        >
          {/* Always returns to the homepage, in every state. */}
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="relative block shrink-0 focus-visible:outline-offset-8"
          >
            {/*
              A fixed-height box holds both variants so the swap moves no
              layout. Width animates between the lockup's and the mark's
              aspect ratio at that height.
            */}
            <span
              className={cn(
                'relative block transition-all duration-300 ease-out',
                compact
                  ? 'h-8 w-[76px] sm:h-9 sm:w-[86px]'
                  : 'h-12 w-[93px] sm:h-16 sm:w-[124px]'
              )}
            >
              <Lockup
                intensity="ambient"
                className={cn(
                  'absolute inset-0 h-full w-auto transition-opacity duration-300',
                  compact ? 'opacity-0' : 'opacity-100'
                )}
              />
              <Mark
                intensity="ambient"
                className={cn(
                  'absolute inset-0 h-full w-auto transition-opacity duration-300',
                  compact ? 'opacity-100' : 'opacity-0'
                )}
              />
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {site.nav.map((item) => {
              // /web/work must light up "Our Work", not "Web Services", so the
              // longest matching nav href wins rather than the first prefix.
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'label transition-colors hover:text-chalk',
                    active ? 'text-chalk' : 'text-chalk-muted'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/contact"
              className="label border border-line-strong px-6 py-3 text-chalk transition-colors hover:border-chalk hover:bg-chalk hover:text-black"
            >
              Let&rsquo;s talk
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 inline-flex h-12 w-12 items-center justify-center text-chalk lg:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg
              viewBox="0 0 20 20"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
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
          className="border-t border-line bg-black lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <Container className="flex flex-col py-2">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="label border-b border-line py-5 text-chalk"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="label mt-6 mb-4 inline-flex items-center justify-center bg-chalk px-6 py-4 text-black"
            >
              Let&rsquo;s talk
            </Link>
          </Container>
        </nav>
      ) : null}
    </header>
  )
}
