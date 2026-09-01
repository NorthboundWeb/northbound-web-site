import type { ReactNode } from 'react'
import { SiteShell } from '@/components/site-shell'

/**
 * Parent-brand pages: the gateway, About, Contact, Unlock. Neutral ground —
 * colour belongs to the divisions, and this is where you choose one.
 *
 * A route group, so the URLs are unchanged: /(parent)/about is still /about.
 */
export default function ParentLayout({ children }: { children: ReactNode }) {
  return <SiteShell division="parent">{children}</SiteShell>
}
