import type { Metadata } from 'next'
import { BrowserFrame, CropMarks } from '@/components/graphics'
import { ArrowLink, ButtonLink, Container, Display, Label, Section } from '@/components/ui'
import { standards } from '@/lib/services'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Northbound Web project showcases. Built to show real work, real decisions and real outcomes — with nothing invented in the meantime.',
  alternates: { canonical: '/web/work' },
  // Nothing to index until there is real work here.
  robots: { index: false, follow: true },
}

/**
 * The showcase architecture exists; the case studies do not yet.
 *
 * Deliberately empty rather than padded with invented clients. When a real
 * project ships, add it as an entry and the page fills in — no rebuild. Never
 * fabricate a client, a metric or a testimonial to make this look busier.
 */
type Project = {
  slug: string
  client: string
  summary: string
  year: string
}

const projects: Project[] = []

export default function WorkPage() {
  return (
    <>
      <Section className="border-b border-line">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="01">Work</Label>
            <span className="label text-ink-faint">Northbound Web</span>
          </div>
          <Display as="h1" className="mt-6">
            Soon
          </Display>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Northbound Web is new. Rather than pad this page with stock
            screenshots or borrowed numbers, it stays empty until there is real
            work to show — then each project gets a proper write-up: the
            problem, the decisions, what changed.
          </p>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-faint">
            If you are weighing up whether to trust a studio with no public
            portfolio yet, that is fair. Judge the thing you are reading: this
            site is the work.
          </p>
        </Container>
      </Section>

      {projects.length > 0 ? null : (
        <Section className="border-b border-line">
          <Container>
            <div className="relative grid gap-12 border border-line p-10 sm:p-16 lg:grid-cols-[1fr_auto] lg:items-center">
              <CropMarks className="opacity-40" />
              <div>
                <Label index="02">In the meantime</Label>
                <h2 className="display mt-6 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
                  Judge the standards
                </h2>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-muted">
                  Every build is held to the same set of rules, whatever it
                  costs. They are the part a portfolio screenshot never shows.
                </p>
                <ArrowLink href="/web/process" className="mt-8">
                  Read the standards
                </ArrowLink>
              </div>
              <BrowserFrame className="w-full max-w-sm text-ink" />
            </div>

            <div className="mt-14 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
              {standards.slice(0, 3).map((s) => (
                <div key={s.title} className="border-r border-b border-line p-8">
                  <h3 className="display text-2xl text-ink">{s.title}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <div className="max-w-3xl">
            <Display>First</Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              Someone has to be the first project on this page. If you would
              like it to be yours, the first conversation is free and there is
              no pitch at the end of it.
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
              <a
                href={`mailto:${site.email}`}
                className="label text-ink-muted underline-offset-4 hover:text-accent-deep hover:underline"
              >
                {site.email}
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
