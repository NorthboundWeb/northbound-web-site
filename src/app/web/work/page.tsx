import type { Metadata } from 'next'
import Link from 'next/link'
import { MountainPlate } from '@/components/mountain'
import {
  ArrowLink,
  ButtonLink,
  Container,
  Display,
  Label,
  Rail,
  Section,
} from '@/components/ui'
import { standards } from '@/lib/services'
import { WORK_PLACEHOLDER, work, workKindLabel } from '@/lib/work'

export const metadata: Metadata = {
  title: 'Our work',
  description:
    'Selected Northbound.Web projects. Every piece is labelled for what it actually is — client project, concept or internal work — with no invented case studies.',
  alternates: { canonical: '/web/work' },
}

export default function WorkPage() {
  return (
    <>
      <section className="border-b border-line">
        <Container>
          <div className="flex gap-8 lg:gap-14">
            <Rail index="03" />
            <div className="min-w-0 flex-1 pt-14 pb-16 sm:pt-20 lg:pb-24">
              <Label>Recent work</Label>
              <Display as="h1" size="lg" className="mt-9 max-w-3xl text-cream">
                Built for business.
                <br />
                Designed to perform.
              </Display>
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                Northbound is a young studio and the public portfolio is still
                short. What is here is labelled honestly — nothing on this page
                is presented as a client relationship that does not exist.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section className="bg-black">
        <Container>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {work.map((item) => (
              <li key={item.slug} className="group">
                <div className="relative aspect-4/3 overflow-hidden border border-line bg-char">
                  <MountainPlate className="h-full w-full opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                  <span className="label absolute top-3 left-3 border border-line-strong bg-black/80 px-2.5 py-1 text-chalk">
                    {workKindLabel[item.kind]}
                  </span>
                </div>
                <h2 className="display mt-5 text-2xl text-cream">{item.title}</h2>
                <p className="label mt-2 text-chalk-faint">{item.category}</p>
                <p className="mt-4 text-sm leading-relaxed text-chalk-muted">
                  {item.summary}
                </p>
                {item.href ? (
                  <ArrowLink href={item.href} className="mt-5">
                    Visit site
                  </ArrowLink>
                ) : null}
              </li>
            ))}

            <li>
              <Link
                href={WORK_PLACEHOLDER.href}
                className="group flex h-full min-h-64 flex-col justify-between border border-dashed border-line-strong p-7 transition-colors hover:border-chalk"
              >
                <span className="label text-chalk-faint">In progress</span>
                <span>
                  <span className="display block text-2xl text-cream">
                    {WORK_PLACEHOLDER.title}
                  </span>
                  <span className="mt-4 block text-sm leading-relaxed text-chalk-muted">
                    {WORK_PLACEHOLDER.body}
                  </span>
                  <span className="label mt-6 block text-orange">
                    {WORK_PLACEHOLDER.cta}
                  </span>
                </span>
              </Link>
            </li>
          </ul>
        </Container>
      </Section>

      <Section className="bg-cream text-ink">
        <Container>
          <Label tone="light">What you get</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-ink">
            The standard, regardless of package.
          </Display>
          <ul className="mt-14 grid gap-px bg-line-ink sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((s) => (
              <li key={s.title} className="bg-cream p-7 sm:p-8">
                <h3 className="label text-ink">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  {s.body}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap items-center gap-5 border-t border-line-ink pt-10">
            <ButtonLink href="/contact" variant="solid" size="lg">
              Start a project
            </ButtonLink>
            <ArrowLink href="/web#pricing" tone="ink">
              See website packages
            </ArrowLink>
          </div>
        </Container>
      </Section>
    </>
  )
}
