import type { Metadata } from 'next'
import {
  ArrowLink,
  ButtonLink,
  ComingSoon,
  Container,
  Display,
  Label,
  Rail,
  Section,
} from '@/components/ui'
import { process, standards } from '@/lib/services'
import { divisions, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Northbound builds and manages websites for UK businesses, and is building Northbound Employees — AI workers designed around real business jobs.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line">
        <Container>
          <div className="flex gap-8 lg:gap-14">
            <Rail index="04" />
            <div className="min-w-0 flex-1 pt-14 pb-16 sm:pt-20 lg:pb-24">
              <Label>About</Label>
              <Display as="h1" size="lg" className="mt-9 max-w-3xl text-cream">
                Two divisions.
                <br />
                One Northbound.
              </Display>
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                Northbound is a UK studio building digital infrastructure for
                small businesses. One division is trading today; the other is
                being built, and this site says which is which on every page.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* -------------------------------------------------------- divisions */}
      <Section className="bg-black">
        <Container>
          <ul className="grid gap-px bg-line lg:grid-cols-2">
            {divisions.map((d) => (
              <li key={d.id} className="bg-black p-8 sm:p-10">
                <span
                  className={
                    d.accent === 'orange'
                      ? 'label text-orange'
                      : 'label text-yellow'
                  }
                >
                  {d.index}
                </span>
                <Display as="h2" size="sm" className="mt-6 text-cream">
                  {d.name}
                </Display>
                {!d.available ? <ComingSoon className="mt-5" /> : null}
                <p className="mt-6 text-sm leading-relaxed text-chalk-muted">
                  {d.body}
                </p>
                <ArrowLink
                  href={d.href}
                  tone={d.accent === 'orange' ? 'orange' : 'yellow'}
                  className="mt-8"
                >
                  {d.cta}
                </ArrowLink>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- process */}
      <Section id="process" className="scroll-mt-24 bg-cream text-ink">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label tone="light">Our process</Label>
              <Display as="h2" size="md" className="mt-8 text-ink">
                How a project
                <br />
                actually runs.
              </Display>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
              Six steps, in the order they happen. No stage is a surprise and no
              stage is skipped to hit a date.
            </p>
          </div>

          <ol className="mt-14 grid gap-px bg-line-ink sm:grid-cols-2 lg:grid-cols-3">
            {process.map((step) => (
              <li key={step.step} className="bg-cream p-7 sm:p-8">
                <span className="label text-orange-ink">{step.step}</span>
                <h3 className="display mt-5 text-2xl text-ink">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* -------------------------------------------------------- standards */}
      <Section className="bg-black">
        <Container>
          <Label>Standards</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-cream">
            What does not get traded away.
          </Display>
          <ul className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((s) => (
              <li key={s.title} className="bg-black p-7 sm:p-8">
                <h3 className="label text-cream">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-chalk-muted">
                  {s.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-wrap items-center gap-5 border-t border-line pt-10">
            <ButtonLink href="/contact" variant="light" size="lg">
              Get in touch
            </ButtonLink>
            <a
              href={`mailto:${site.email}`}
              className="label text-chalk-muted underline-offset-4 transition-colors hover:text-chalk hover:underline"
            >
              {site.email}
            </a>
          </div>
        </Container>
      </Section>
    </>
  )
}
