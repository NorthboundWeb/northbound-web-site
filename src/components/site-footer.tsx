import Link from 'next/link'
import { InstagramIcon, TikTokIcon } from '@/components/graphics'
import { LockupFlat } from '@/components/logo'
import { CurrencySelect } from '@/components/currency-select'
import { LanguageSelect } from '@/components/language-select'
import { ButtonLink, Container } from '@/components/ui'
import { localePath, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Currency } from '@/lib/money/currency'
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
/**
 * Footer columns, built from the dictionary so the labels translate while the
 * destinations stay in one place.
 *
 * Every href here is a real page or a real on-page anchor. The approved footer
 * sketch also listed Insights, Careers, AI Pricing, Terms and Cookies; those
 * pages do not exist, and a link to a page that is not there is worse than an
 * absent link, so they are left out until there is something to point at.
 */
function buildColumns(t: Dictionary) {
  return [
    {
      heading: t.footer.columns.web,
      note: null as string | null,
      links: [
        { href: '/web', label: t.footer.links.webServices },
        { href: '/web/work', label: t.footer.links.ourWork },
        { href: '/web#pricing', label: t.footer.links.packages },
        { href: '/web#management', label: t.footer.links.management },
        { href: '/web#improvements', label: t.footer.links.improvements },
      ],
    },
    {
      heading: t.footer.columns.ai,
      // Marked at the top of the column so the whole division reads as
      // forthcoming, rather than tagging every individual link.
      note: t.common.comingSoon,
      links: [
        { href: '/ai', label: t.footer.links.aiEmployees },
        { href: '/ai#employees', label: t.footer.links.meetEmployees },
        { href: '/ai#how-it-works', label: t.footer.links.howItWorks },
        { href: '/contact?interest=employees', label: t.footer.links.registerInterest },
      ],
    },
    {
      heading: t.footer.columns.company,
      note: null as string | null,
      links: [
        { href: '/about', label: t.footer.links.about },
        { href: '/about#process', label: t.footer.links.process },
        { href: '/contact', label: t.footer.links.contact },
        { href: '/privacy', label: t.footer.links.privacy },
      ],
    },
  ]
}

const socialIcons = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
} as const

export function SiteFooter({
  locale,
  currency,
  t,
}: {
  locale: Locale
  currency: Currency
  t: Dictionary
}) {
  const columns = buildColumns(t)

  return (
    <footer className="border-t border-line bg-black text-chalk">
      <Container className="pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr] lg:gap-10">
          <div>
            <Link
              href={localePath(locale, '/')}
              aria-label={`${site.name} — ${t.common.home}`}
              className="inline-block"
            >
              <LockupFlat className="h-14 w-auto text-chalk" />
            </Link>
            <p className="mt-7 max-w-xs text-sm leading-relaxed text-chalk-muted">
              {t.footer.blurb}
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
              {col.note ? (
                <p className="label mt-2 text-yellow">{col.note}</p>
              ) : null}
              <ul className="mt-6 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localePath(locale, link.href)}
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
            <h2 className="label text-chalk">{t.footer.columns.talk}</h2>
            <p className="mt-6 text-sm leading-relaxed text-chalk-muted">
              {t.footer.talkBlurb}
            </p>
            <ButtonLink
              href={localePath(locale, '/contact')}
              variant="outline"
              className="mt-7 w-full"
            >
              {t.common.cta.getInTouch}
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
            <LanguageSelect value={locale} />
            <CurrencySelect value={currency} />
          </div>
          <div className="label flex flex-col gap-2 text-chalk-faint sm:flex-row sm:items-center sm:gap-6">
            <p>
              © {new Date().getFullYear()} {site.legalName}. {t.footer.rights}
            </p>
            <p>{t.footer.builtIn}</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
