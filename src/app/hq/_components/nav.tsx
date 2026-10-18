import Link from 'next/link'
import { isHqAuthed } from '@/lib/hq/auth'
import { logout } from '../actions'

const links = [
  { href: '/hq', label: 'Home' },
  { href: '/hq/clients', label: 'Clients' },
  { href: '/hq/intake', label: 'New client' },
  { href: '/hq/audit', label: 'Site audit' },
  { href: '/hq/template', label: 'Starter kit' },
]

export async function HqNav() {
  const authed = await isHqAuthed()

  return (
    <header className="border-b border-line bg-char-sunk">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 sm:px-8">
        <Link href="/hq" className="text-sm font-bold uppercase tracking-[0.22em] text-chalk">
          Northbound <span className="text-orange">HQ</span>
        </Link>
        {authed ? (
          <>
            <nav aria-label="HQ" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-chalk-muted">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-chalk">
                  {link.label}
                </Link>
              ))}
            </nav>
            <form action={logout} className="ml-auto">
              <button type="submit" className="text-sm text-chalk-faint transition-colors hover:text-chalk">
                Sign out
              </button>
            </form>
          </>
        ) : null}
      </div>
    </header>
  )
}
