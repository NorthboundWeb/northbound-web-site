'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from '@/components/graphics'
import { Wordmark } from '@/components/logo'
import { Container, buttonClass, cn } from '@/components/ui'
import { site } from '@/lib/site'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [renderedPath, setRenderedPath] = useState(pathname)
  const [mapOpen, setMapOpen] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  // Close the menus when the route changes. Adjusting state during render is
  // React's recommended alternative to an effect here.
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setOpen(false)
    setMapOpen(false)
  }

  // The route map closes on Escape (returning focus to the wordmark) and on a
  // press anywhere outside it.
  useEffect(() => {
    if (!mapOpen) return
    const onPress = (event: PointerEvent) => {
      if (mapRef.current && !mapRef.current.contains(event.target as Node)) {
        setMapOpen(false)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMapOpen(false)
        mapRef.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('pointerdown', onPress)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPress)
      document.removeEventListener('keydown', onKey)
    }
  }, [mapOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <div ref={mapRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setMapOpen((v) => !v)
                setOpen(false)
              }}
              aria-expanded={mapOpen}
              aria-controls="route-map"
              aria-label={`${site.name} — open the route map`}
              className="press flex items-center gap-2 text-ink"
            >
              <Wordmark />
              <svg
                viewBox="0 0 12 12"
                className={cn(
                  'h-3 w-3 text-accent transition-transform duration-200',
                  mapOpen && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M2 4.5l4 4 4-4" />
              </svg>
            </button>

            {mapOpen ? (
              <nav
                id="route-map"
                aria-label="Route map"
                className="rise-in absolute left-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-3rem))] border border-line-strong bg-paper-raised shadow-[0_18px_40px_-18px_rgba(13,42,36,0.45)]"
              >
                <p className="label border-b border-line px-5 py-3 text-ink-faint">
                  Route map
                </p>
                <ol>
                  {site.routeMap.map((stop) => {
                    const here = pathname === stop.href
                    return (
                      <li key={stop.code} className="border-b border-line last:border-0">
                        <Link
                          href={stop.href}
                          onClick={() => setMapOpen(false)}
                          aria-current={here ? 'page' : undefined}
                          className={cn(
                            'group/stop flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-paper-sunk',
                            stop.go && 'bg-paper-sunk'
                          )}
                        >
                          <span
                            className={cn(
                              'label w-9 shrink-0 border px-1.5 py-1 text-center',
                              stop.go || here
                                ? 'border-accent bg-accent text-cream'
                                : 'border-line-strong text-ink'
                            )}
                          >
                            {stop.code}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-medium text-ink group-hover/stop:text-accent">
                              {stop.label}
                            </span>
                            <span className="block text-[13px] text-ink-muted">
                              {here ? 'You are here' : stop.note}
                            </span>
                          </span>
                          <span
                            aria-hidden
                            className="ml-auto text-accent transition-transform duration-200 group-hover/stop:translate-x-1"
                          >
                            <ArrowRight />
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              </nav>
            ) : null}
          </div>

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
            onClick={() => {
              setOpen((v) => !v)
              setMapOpen(false)
            }}
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
