import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { Storefront } from '@/components/store/storefront'
import { UnderConstruction } from '@/components/store/under-construction'
import { storeUnlocked } from '@/lib/store/gate'
import { lockStore } from './actions'

export const metadata: Metadata = {
  title: 'Store',
  description: 'The Northbound Web store is under construction.',
  robots: { index: false, follow: false },
}

/*
  /store — locked behind STORE_CODE while it is being built. Everyone else
  sees the "under construction" screen. The real page lists only the real
  packages and plans from src/lib/services.ts; nothing is sold here directly
  (no payments), it composes an order and hands it to /start or WhatsApp.
*/
export default async function StorePage() {
  const how = await storeUnlocked()
  if (!how) {
    return (
      <PageShell>
        <UnderConstruction />
      </PageShell>
    )
  }
  return (
    <PageShell>
      <div className="st-adminbar wrap" role="status">
        <span>
          <b>Store preview.</b> {how === 'code' ? 'Unlocked with the admin code.' : 'Unlocked because you are signed in as an admin.'} Visitors see “Under construction”.
        </span>
        {how === 'code' && (
          <form action={lockStore}>
            <button type="submit" className="pill sm">
              Lock again
            </button>
          </form>
        )}
      </div>
      <Storefront />
    </PageShell>
  )
}
