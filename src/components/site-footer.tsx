import Link from 'next/link'
import { InstagramIcon, TikTokIcon } from '@/components/graphics'
import { LockupFlat } from '@/components/logo'
import { CurrencySelect } from '@/components/currency-select'
import { ButtonLink, Container } from '@/components/ui'
import { getCurrency } from '@/lib/prefs/server'
import { site } from '@/lib/site'

/**
 * Footer columns.
 *
 * Every href here is a real page or a real on-page anchor — the anchors are
 * created in the pages themselves. The approved footer sketch also listed
 * Insights, Careers, AI Pricing, Privacy, Terms and Cookies; those pages do
 * not exist, and a link to a page that isn't there is worse than an absent
 * link, so they are left out until there is something to point at. Add the
 * entry at the same time as the page, never before.
 */
const columns = [
  {
    heading: 'Northbound.Web',
    links: [
      { href: '/web', label: 'Web services' },
      { href: '/web/work', label: 'Our work' },
      { href: '/web#pricing', label: 'Website packages' },
      { href: '/web#management', label: 'Management' },
      { href: '/web#improvements', label: 'Improvements' },
    ],
  },
  {
    heading: 'Northbound.AI',
    // Marked at the top of the column so the whole division reads as
    // forthcoming, rather than tagging every individual link.
    note: 'Coming soon',
    links: [
      { href: '/ai', label: 'AI employees' },
      { href: '/ai#employees', label: 'Meet the employees' },
      { href: '/ai#how-it-works', label: 'How it will work' },
      { href: '/contact?interest=employees', label: 'Register interest' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/about#process', label: 'Our process' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
]

const socialIcons = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
} as const

export async function SiteFooter() {
  const currency = await getCurrency()

  return (
    <footer className="border-t border-line bg-black text-chalk">
      <Container className="pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr] lg:gap-10">
          <div>
            <Link href="/" aria-label={`${site.name} — home`} className="inline-block">
              <LockupFlat className="h-14 w-auto text-chalk" />
            </Link>
            <p className="mt-7 max-w-xs text-sm leading-relaxed text-chalk-muted">
              Digital infrastructure for modern businesses. Web services now,
              AI employees coming soon.
            </p>
            <ul className="mt-8 flex items-center gap-3">
              {site.socials.map((s) => {
                const Icon = socialIcons[s.label as keyof typeof socialIcons]
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="me noopener noreferrer"
                      // 44px target, per the touch-target minimum.
                      className="inline-flex h-11 w-11 items-center justify-center border border-line text-chalk-muted transition-colors hover:border-chalk hover:text-chalk"
                    >
                      <span className="sr-only">
                        {s.label} — {s.handle}
                      </span>
                      <Icon />
                    </a>
                  </li>
                )
              })}
            </ul>
            <ul className="mt-5 space-y-1">
              {site.socials.map((s) => (
                <li key={s.label} className="text-sm text-chalk-muted">
                  <span className="text-chalk-faint">{s.label}</span>{' '}
                  <a
                    href={s.href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="text-chalk transition-colors hover:text-orange"
                  >
                    {s.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="label text-chalk">{col.heading}</h2>
              {'note' in col && col.note ? (
                <p className="label mt-2 text-yellow">{col.note}</p>
              ) : null}
              <ul className="mt-6 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-chalk-muted transition-colors hover:text-chalk"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="label text-chalk">Let&rsquo;s talk</h2>
            <p className="mt-6 text-sm leading-relaxed text-chalk-muted">
              Have a project, or want to know more about what Northbound is
              building?
            </p>
            <ButtonLink href="/contact" variant="outline" className="mt-7 w-full">
              Get in touch
            </ButtonLink>
            <a
              href={`mailto:${site.email}`}
              className="mt-5 block text-sm text-chalk-muted transition-colors hover:text-chalk"
            >
              {site.email}
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-5">
            <CurrencySelect value={currency} />
          </div>
          <div className="label flex flex-col gap-2 text-chalk-faint sm:flex-row sm:items-center sm:gap-6">
            <p>
              © {new Date().getFullYear()} {site.legalName}. All rights
              reserved.
            </p>
            <p>Built and hosted in the {site.location}</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
