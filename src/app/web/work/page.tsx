import type { Metadata } from 'next'
import Link from 'next/link'
import { BrowserFrame, CropMarks, Wireframe } from '@/components/graphics'
import { ArrowLink, ButtonLink, Container, Display, Label, Section } from '@/components/ui'
import { standards } from '@/lib/services'
import { divisions, site } from '@/lib/site'

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

/**
 * The one thing there is honest evidence for: this site.
 *
 * Every claim below is verifiable by looking at the pages named. No client,
 * no testimonial, no metric — not "40% faster", not "3x conversions", because
 * there is nothing to measure it against yet. What it shows is the thinking
 * and the standard of the build, which is what someone hiring a new studio is
 * actually trying to assess.
 */
const internalStudy = {
  label: 'Internal project',
  name: 'Northbound digital platform',
  status: 'Active internal platform, continuing to evolve',
  problem:
    'One parent brand had to explain two very different businesses. Northbound.Web sells websites at a fixed price to people who want a thing built. Northbound.AI is a division still in development, selling specialists that do a job. Put them on one site badly and each one makes the other harder to understand.',
  decision:
    'A shared design system with two distinct environments. Every page declares the same colour tokens, so a component asks for the ink colour and gets whichever division it is standing in — cream and burnt orange for Web, charcoal and signal yellow for AI. The typography, spacing and editorial structure stay identical across both, which is what holds the parent brand together while the two divisions look nothing alike.',
  built: [
    { thing: 'A gateway homepage', where: '/', detail: 'Two full-environment panels rather than two cards, so the choice between divisions is the first interaction.' },
    { thing: 'Service and package selection', where: '/web/services', detail: 'A keyboard-operable selector that carries the chosen package into the enquiry form.' },
    { thing: 'An enquiry flow', where: '/contact', detail: 'Validated on the server, working without JavaScript, with a fallback if delivery fails so no enquiry is lost.' },
    { thing: 'The employee roster', where: '/ai/employees', detail: 'Six specialists rendered from one data file, each carrying an honest development status.' },
    { thing: 'Employee and team pages', where: '/ai/services', detail: 'Generated per employee and per team, so adding a seventh is one entry rather than a new page.' },
  ],
} as const

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

      {/* ── The one project there is honest evidence for ───────── */}
      <Section className="border-b border-line">
        <Container>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <Label index="02">{internalStudy.label}</Label>
            <span className="label text-ink-faint">{internalStudy.status}</span>
          </div>

          <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-20">
            <div>
              <h2 className="display text-[clamp(2.5rem,8vw,4.5rem)] text-ink">
                {internalStudy.name}
              </h2>

              <div className="mt-10 space-y-8">
                <div>
                  <h3 className="label text-accent-deep">The problem</h3>
                  <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-ink-muted">
                    {internalStudy.problem}
                  </p>
                </div>
                <div>
                  <h3 className="label text-accent-deep">The decision</h3>
                  <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-ink-muted">
                    {internalStudy.decision}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-line bg-paper-sunk p-6 sm:p-8">
              <p className="label text-ink-faint">Two divisions, one system</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {divisions.map((d) => (
                  <div
                    key={d.id}
                    data-division={d.id}
                    className="border border-line bg-paper p-4"
                  >
                    <p className="label text-ink-faint">{d.index}</p>
                    <p className="display mt-2 text-lg text-ink">{d.name}</p>
                    <span
                      aria-hidden
                      className="mt-3 block h-1 w-8 bg-accent"
                    />
                  </div>
                ))}
              </div>
              <Wireframe className="mt-8 w-full text-ink-faint" />
            </div>
          </div>

          <h3 className="label mt-16 text-ink-faint">What was built</h3>
          <ul className="mt-6 border-t border-line">
            {internalStudy.built.map((b) => (
              <li
                key={b.thing}
                className="step-in grid gap-2 border-b border-line py-5 sm:grid-cols-[16rem_1fr] sm:items-baseline sm:gap-8"
              >
                <Link
                  href={b.where}
                  className="label min-h-11 inline-flex items-center text-ink underline-offset-4 hover:text-accent hover:underline"
                >
                  {b.thing}
                </Link>
                <p className="max-w-2xl text-[15px] leading-relaxed text-ink-muted">
                  {b.detail}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-faint">
            No client results are claimed here, because there are none to claim
            yet. This is the platform Northbound runs on, and every page named
            above is one you can open and judge for yourself.
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
                className="label inline-flex min-h-11 items-center text-ink-muted underline-offset-4 hover:text-accent-deep hover:underline"
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
