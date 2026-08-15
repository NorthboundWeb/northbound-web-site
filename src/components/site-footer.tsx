import Link from 'next/link'
import { Wordmark } from '@/components/logo'
import { Container } from '@/components/ui'
import { buildPackages } from '@/lib/services'
import { site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-sunk">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-muted">
              Websites, web applications and automations for small businesses
              across the {site.location}.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-5 inline-block text-sm text-accent underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="Packages">
            <h2 className="eyebrow">Packages</h2>
            <ul className="mt-5 space-y-3">
              {buildPackages.map((pkg) => (
                <li key={pkg.slug}>
                  <Link
                    href={`/services#${pkg.slug}`}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {pkg.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services#management"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  Management plans
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Site">
            <h2 className="eyebrow">Northbound Web</h2>
            <ul className="mt-5 space-y-3">
              {[...site.nav, { href: '/contact', label: 'Contact' }].map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Built and hosted in the {site.location}.</p>
        </div>
      </Container>
    </footer>
  )
}
