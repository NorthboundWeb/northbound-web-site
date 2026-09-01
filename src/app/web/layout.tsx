import type { ReactNode } from 'react'
import { SiteShell } from '@/components/site-shell'

export default function WebLayout({ children }: { children: ReactNode }) {
  return <SiteShell division="web">{children}</SiteShell>
}
