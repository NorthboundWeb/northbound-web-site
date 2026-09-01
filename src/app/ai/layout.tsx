import type { ReactNode } from 'react'
import { SiteShell } from '@/components/site-shell'

export default function AiLayout({ children }: { children: ReactNode }) {
  return <SiteShell division="ai">{children}</SiteShell>
}
