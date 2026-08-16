import Link from 'next/link'
import { CompassDiagram } from '@/components/graphics'
import { Container } from '@/components/ui'
import { buildPackages } from '@/lib/services'
import { site } from '@/lib/site'

const services = [
  'Website design',
  'Website builds',
  'Website management',
]

export function SiteFooter() {
  return (
    <footer className="relative z-10 bg-green text-cream">
      <Container className="pt-20 pb-12">
        {/* The graphic statement — the footer is a poster, not a sitemap. */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="display text-[clamp(3.25rem,13vw,11rem)] text-cream">
            Always
            <br />
            Moving
            <br />
            North<span className="text-accent">.</span>
          </p>
          <CompassDiagram className="w-32 shrink-0 text-cream/60 sm:w-44 lg:w-56" />
        </div>

        <div
          aria-hidden
          className="dotted-rule mt-16 opacity-40"
          style={{ ['--line-strong' as string]: 'rgba(242,235,221,.5)' }}
        />

        <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="label text-cream/50">What I do</h2>
            <ul className="mt-5 space-y-2.5">
              {services.map((s) => (
                <li key={s} className="text-[15px] text-cream/85">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Packages">
            <h2 className="label text-cream/50">Packages</h2>
            <ul className="mt-5 space-y-2.5">
              {buildPackages.map((pkg) => (
                <li key={pkg.slug}>
                  <Link
                    href={`/services#${pkg.slug}`}
                    className="text-[15px] text-cream/85 transition-colors hover:text-accent"
                  >
                    {pkg.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services#management"
                  className="text-[15px] text-cream/85 transition-colors hover:text-accent"
                >
                  Management plans
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Site">
            <h2 className="label text-cream/50">Northbound Web</h2>
            <ul className="mt-5 space-y-2.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-cream/85 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label text-cream/50">Elsewhere</h2>
            <ul className="mt-5 space-y-2.5">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="text-[15px] text-cream/85 transition-colors hover:text-accent"
                    rel="me noopener noreferrer"
                    target="_blank"
                  >
                    {s.label} — {s.handle}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[15px] text-accent transition-colors hover:text-cream"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="label mt-16 flex flex-col gap-3 border-t border-cream/20 pt-8 text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>Built and hosted in the {site.location}</p>
        </div>
      </Container>
    </footer>
  )
}
