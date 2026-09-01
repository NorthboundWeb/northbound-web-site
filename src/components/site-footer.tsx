import Link from 'next/link'
import { CompassDiagram } from '@/components/graphics'
import { Container } from '@/components/ui'
import { employees } from '@/lib/ai/employees'
import { buildScopes, managementPlans } from '@/lib/services'
import { divisions, parentNav, site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="invert-surface relative z-10">
      <Container className="pt-20 pb-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="display display-stack text-[clamp(3.25rem,13vw,11rem)] text-on-invert">
            Always
            <br />
            Moving
            <br />
            North<span className="text-accent">.</span>
          </p>
          <CompassDiagram className="w-32 shrink-0 text-on-invert/60 sm:w-44 lg:w-56" />
        </div>

        <div
          aria-hidden
          className="dotted-rule mt-16 opacity-40"
          style={{ ['--line-strong' as string]: 'rgba(242,235,221,.5)' }}
        />

        <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Divisions">
            <h2 className="label text-on-invert/70">Northbound</h2>
            <ul className="mt-5 space-y-2.5">
              {divisions.map((d) => (
                <li key={d.id}>
                  <Link href={d.href} className="text-[15px] text-on-invert/85 transition-colors hover:text-accent-lit">
                    {d.wordmark}
                  </Link>
                </li>
              ))}
              {parentNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[15px] text-on-invert/85 transition-colors hover:text-accent-lit">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Website builds">
            <h2 className="label text-on-invert/70">Builds</h2>
            <ul className="mt-5 space-y-2.5">
              {buildScopes.map((s) => (
                <li key={s.slug}>
                  <Link href={`/web/services#${s.slug}`} className="text-[15px] text-on-invert/85 transition-colors hover:text-accent-lit">
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/web/services#existing" className="text-[15px] text-on-invert/85 transition-colors hover:text-accent-lit">
                  Existing website help
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Management and employees">
            <h2 className="label text-on-invert/70">Management</h2>
            <ul className="mt-5 space-y-2.5">
              {managementPlans.map((p) => (
                <li key={p.slug}>
                  <Link href={`/web/services#management`} className="text-[15px] text-on-invert/85 transition-colors hover:text-accent-lit">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="label mt-8 text-on-invert/70">Employees</h2>
            <ul className="mt-5 space-y-2.5">
              {employees.map((e) => (
                <li key={e.slug}>
                  <Link href={`/ai/employees/${e.slug}`} className="text-[15px] text-on-invert/85 transition-colors hover:text-accent-lit">
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label text-on-invert/70">Elsewhere</h2>
            <ul className="mt-5 space-y-2.5">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="text-[15px] text-on-invert/85 transition-colors hover:text-accent-lit"
                    rel="me noopener noreferrer"
                    target="_blank"
                  >
                    {s.label} — {s.handle}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="text-[15px] text-accent-lit transition-colors hover:text-on-invert">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="label mt-16 flex flex-col gap-3 border-t border-on-invert/20 pt-8 text-on-invert/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          {/* UNLOCK lives here on purpose: findable, never shouted. */}
          <Link
            href="/unlock"
            className="tracking-[0.35em] text-on-invert/60 transition-colors hover:text-accent-lit"
          >
            UNLOCK
          </Link>
          <p>Built and hosted in the {site.location}</p>
        </div>
      </Container>
    </footer>
  )
}
