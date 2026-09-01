import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import type { ThemeId } from '@/lib/site'

/**
 * The frame every page sits in.
 *
 * `data-division` is the single switch for the whole identity: it is declared
 * once here and every colour token below it resolves to that environment's
 * palette. Because it is set by a server layout rather than by a hook, the
 * correct theme is in the first byte of HTML — there is no flash of the
 * parent brand before the division's own.
 *
 * Header and footer live inside the wrapper rather than above it, so they are
 * themed too. Adding a third division means one layout file and one palette
 * block in globals.css; nothing here changes.
 */
export function SiteShell({
  division,
  children,
}: {
  division: ThemeId
  children: ReactNode
}) {
  return (
    <div
      data-division={division}
      className="relative flex min-h-dvh flex-col bg-paper text-ink"
    >
      {/* Print grain, drawn once over the whole page. */}
      <div aria-hidden className="grain-overlay" />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-ink"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="relative z-10 flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
