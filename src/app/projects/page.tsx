import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import {
  BookingDemo,
  ColoursDemo,
  HoursDemo,
  MenuDemo,
  QuoteDemo,
  RedesignDemo,
} from '@/components/project-demos'
import {
  ArrowLink,
  ButtonLink,
  Container,
  Display,
  Label,
  Section,
  cn,
} from '@/components/ui'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Projects',
  description: `Six things a small-business website can do, working on the page: book a haircut, drag a redesign, price a window clean. Try them. Every business shown is made up.`,
  alternates: { canonical: '/projects' },
}

type Bay = {
  id: string
  title: string
  why: string
  tag: string
  note: ReactNode
  wide?: boolean
  demo: ReactNode
}

const bays: Bay[] = [
  {
    id: 'booking',
    title: 'Online booking',
    why: 'Customers book themselves in at 11pm instead of ringing you mid-job. Pick a service, a barber, a day and a time.',
    tag: 'Pro & Ultimate',
    wide: true,
    demo: <BookingDemo />,
    note: (
      <>
        <strong className="font-medium text-ink">Pro</strong> sets booking up for one staff
        calendar, with email confirmations.{' '}
        <strong className="font-medium text-ink">Ultimate</strong> covers several staff
        calendars, reminders, booking payments, cancelling and rescheduling. It is configured on
        an established booking service rather than built from scratch, and a bespoke booking
        system is quoted separately. Nothing here is saved or sent.
      </>
    ),
  },
  {
    id: 'redesign',
    title: 'The redesign',
    why: 'Same café, same menu, same phone number. Drag the handle to see what fifteen years does to a first impression.',
    tag: 'Pro or Ultimate',
    wide: true,
    demo: <RedesignDemo />,
    note: (
      <>
        The Harbour Café is made up. A rebuild is just a build: Pro or Ultimate, at the same
        fixed price. You supply the words and photos. Copywriting and photography are not part
        of the fixed packages.
      </>
    ),
  },
  {
    id: 'quote',
    title: 'Instant quotes',
    why: 'Answer the question every customer asks before they have picked up the phone.',
    tag: 'Custom',
    demo: <QuoteDemo />,
    note: (
      <>
        Clearview Window Cleaning and its prices are made up. A calculator that runs on your own
        pricing rules is scoped as a Custom build and quoted in writing before any work begins.
      </>
    ),
  },
  {
    id: 'menu',
    title: 'Menus & price lists',
    why: 'A real menu instead of a 4MB PDF, so people can read it on a phone and find what they can eat.',
    tag: 'In your pages',
    demo: <MenuDemo />,
    note: (
      <>
        The Harbour Café’s menu is made up. Your menu, services or price list go in as proper
        page content rather than a PDF.
      </>
    ),
  },
  {
    id: 'hours',
    title: 'Live opening hours',
    why: 'It reads the visitor’s clock, so “are they open?” gets answered before anyone rings.',
    tag: 'Ask about this one',
    demo: <HoursDemo />,
    note: <>Kestrel Barbers’ hours are made up. This is live right now, from your own device’s clock.</>,
  },
  {
    id: 'colours',
    title: 'Your colours',
    why: 'The site is built around your brand, not squeezed into a template’s. Pick a palette.',
    tag: 'Built around your brand',
    demo: <ColoursDemo />,
    note: (
      <>
        I build with the colours and logo you already have. Logo and brand design are not part of
        the fixed packages.
      </>
    ),
  },
]

export default function ProjectsPage() {
  return (
    <>
      <Section className="pb-12 sm:pb-16">
        <Container>
          <div className="flex items-start justify-between">
            <Label index="J3">Projects</Label>
            <span className="label text-ink-faint">Six working demos</span>
          </div>

          <Display as="h1" className="mt-6">
            Have a go
          </Display>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Do not look at screenshots. These are six things a small-business website can do,
            built properly and working on this page. Book a haircut, drag a redesign, price a
            window clean. The businesses are made up. The features are real.
          </p>

          <nav aria-label="Demos on this page" className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {bays.map((bay, i) => (
              <a
                key={bay.id}
                href={`#${bay.id}`}
                className="label flex items-center gap-3 text-ink transition-colors hover:text-accent"
              >
                <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                {bay.title}
              </a>
            ))}
          </nav>
        </Container>
      </Section>

      <Container className="pb-24 sm:pb-32">
        <div className="grid gap-8 lg:grid-cols-2">
          {bays.map((bay, i) => (
            <section
              key={bay.id}
              id={bay.id}
              aria-labelledby={`${bay.id}-heading`}
              className={cn(
                'scroll-mt-24 border border-line bg-paper-sunk p-6 sm:p-9',
                bay.wide && 'lg:col-span-2'
              )}
            >
              <div className="flex flex-wrap items-start gap-x-6 gap-y-3 sm:flex-nowrap">
                <span className="label order-1 pt-2 text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className="label order-2 ml-auto border border-line-strong px-3 py-1.5 text-ink-faint sm:order-3 sm:ml-0">
                  {bay.tag}
                </span>
                <div className="order-3 w-full min-w-0 sm:order-2 sm:w-auto sm:flex-1">
                  <h2 id={`${bay.id}-heading`} className="display text-4xl text-ink sm:text-5xl">
                    {bay.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
                    {bay.why}
                  </p>
                </div>
              </div>

              <div className="mt-8">{bay.demo}</div>

              <p className="mt-8 max-w-3xl border-t border-line pt-5 text-sm leading-relaxed text-ink-muted">
                {bay.note}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 border-t border-line pt-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label text-accent">J6</p>
            <p className="display mt-3 text-4xl text-ink sm:text-5xl">
              Want one of these on your site?
            </p>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-muted">
              Start a project, tell me what you need and see the price as you go.
            </p>
          </div>
          <div className="flex flex-col items-start gap-5">
            <ButtonLink href="/contact" size="lg">
              Start a project
            </ButtonLink>
            <ArrowLink href="/discover">See how the options compare</ArrowLink>
          </div>
        </div>

        <p className="mt-12 max-w-3xl text-xs leading-relaxed text-ink-faint">
          Every business on this page is made up for the demos: Kestrel Barbers, The Harbour Café
          and Clearview Window Cleaning are not {site.name} clients. The features are real and
          working.
        </p>
      </Container>
    </>
  )
}
