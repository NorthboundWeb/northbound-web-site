import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
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
import { founderPhoto, founderStory, purpose } from '@/lib/founder'
import { process, standards } from '@/lib/services'
import { divisions, site } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description: 'Northbound builds and manages websites for UK businesses, and is building Northbound Employees — AI workers designed around real business jobs.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line">
        <Container>
          <div className="flex gap-8 lg:gap-14">
            <Rail index="04" />
            <div className="min-w-0 flex-1 pt-14 pb-16 sm:pt-20 lg:pb-24">
              <Label>About Northbound</Label>
              <Display as="h1" size="lg" className="mt-9 max-w-3xl text-cream">
                {founderStory.heading}
              </Display>
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                {founderStory.lede}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------ story */}
      <Section className="bg-cream text-ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_0.72fr] lg:gap-20">
            <div>
              <Label tone="light">The story</Label>
              <div className="mt-9 max-w-2xl space-y-5">
                {founderStory.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-relaxed text-ink-muted sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/*
              A real photograph goes here when there is one. Until then the
              column carries the pull-quote instead, so the layout reads as
              finished rather than as a missing image.
            */}
            <aside className="lg:pt-16">
              {founderPhoto ? (
                <figure className="border border-line-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={founderPhoto.src}
                    alt={founderPhoto.alt}
                    width={founderPhoto.width}
                    height={founderPhoto.height}
                    className="h-auto w-full"
                  />
                </figure>
              ) : (
                <blockquote className="border-l-2 border-orange pl-7">
                  <p className="display text-[clamp(1.5rem,3vw,2.25rem)] text-ink">
                    Spending more than £1,000 on even a basic website simply
                    wasn’t realistic.
                  </p>
                  <footer className="label mt-6 text-ink-faint">
                    Why Northbound exists
                  </footer>
                </blockquote>
              )}
            </aside>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- purpose */}
      <Section className="bg-black">
        <Container>
          <Label>What Northbound is for</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-cream">
            The service I needed.
          </Display>
          <ul className="mt-14 grid gap-px bg-line lg:grid-cols-3">
            {purpose.map((item) => (
              <li key={item.title} className="bg-black p-7 sm:p-8">
                <h3 className="display text-xl text-cream">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-chalk-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* -------------------------------------------------------- divisions */}
      <Section className="bg-cream text-ink">
        <Container>
          <Label tone="light">Two divisions</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-ink">
            One Northbound.
          </Display>
          <ul className="mt-14 grid gap-px bg-line-ink lg:grid-cols-2">
            {divisions.map((d) => (
              <li key={d.id} className="bg-cream p-8 sm:p-10">
                <span
                  className={
                    d.accent === 'orange'
                      ? 'label text-orange-ink'
                      : 'label text-ink-faint'
                  }
                >
                  {d.index}
                </span>
                <Display as="h3" size="sm" className="mt-6 text-ink">
                  {d.name}
                </Display>
                {!d.available ? <ComingSoon tone="light" className="mt-5" /> : null}
                <p className="mt-6 text-sm leading-relaxed text-ink-muted">
                  {d.body}
                </p>
                <ArrowLink
                  href={d.href}
                  tone={d.accent === 'orange' ? 'orangeInk' : 'ink'}
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
      <Section id="process" className="scroll-mt-24 bg-black">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label>Our process</Label>
              <Display as="h2" size="md" className="mt-8 text-cream">
                How a project
                <br />
                actually runs.
              </Display>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-chalk-muted">
              Six steps, in the order they happen. No stage is a surprise and no
              stage is skipped to hit a date.
            </p>
          </div>

          <ol className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {process.map((step) => (
              <li key={step.step} className="bg-black p-7 sm:p-8">
                <span className="label text-orange">{step.step}</span>
                <h3 className="display mt-5 text-2xl text-cream">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-chalk-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* -------------------------------------------------------- standards */}
      <Section className="bg-cream text-ink">
        <Container>
          <Label tone="light">Standards</Label>
          <Display as="h2" size="md" className="mt-8 max-w-2xl text-ink">
            What does not get traded away.
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

          <div className="mt-16 flex flex-wrap items-center gap-5 border-t border-line-ink pt-10">
            <ButtonLink href="/contact" variant="solid" size="lg">
              Discuss a project
            </ButtonLink>
            <ArrowLink href="/web#pricing" tone="ink">
              See website packages
            </ArrowLink>
            <a
              href={`mailto:${site.email}`}
              className="label text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {site.email}
            </a>
          </div>
        </Container>
      </Section>
    </>
  )
}
