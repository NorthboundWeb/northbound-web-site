import type { Metadata } from 'next'
import Link from 'next/link'
import { BookingFlow } from '@/components/booking-flow'
import { Container, Section } from '@/components/ui'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Book a call',
  description: `Book a free 20-minute discovery call with ${site.name}: tell me what you need, your working budget and your timeline, then pick a time that suits you.`,
  alternates: { canonical: '/booking' },
}

const points = [
  {
    head: 'Your current site or socials',
    text: 'If you have them. What is working, what is not, and what customers ask that the site does not answer.',
  },
  {
    head: 'What the new site needs to do',
    text: 'Bookings, a price list, a gallery, showing up locally. Working out what to build is part of the job.',
  },
  {
    head: 'A written quote afterwards',
    text: 'Fixed scope, fixed price, normally within one working day of the call. No obligation.',
  },
]

export default function BookingPage() {
  return (
    <Section>
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1fr_minmax(0,20rem)] lg:gap-24">
          <div className="min-w-0">
            <BookingFlow />
          </div>

          <aside aria-label="About the call" className="min-w-0">
            <div className="rounded-2xl border border-line bg-paper-sunk p-7 lg:sticky lg:top-24">
              <h2 className="label text-ink-faint">On the call</h2>
              <ol className="mt-6 space-y-5">
                {points.map((point, i) => (
                  <li key={point.head} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="label pt-0.5 text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="font-medium text-ink">{point.head}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{point.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-7 border-t border-line pt-5 text-sm leading-relaxed text-ink-muted">
                Would rather skip the call and go straight to a quote?{' '}
                <Link href="/contact" className="text-accent underline-offset-4 hover:underline">
                  Start a project
                </Link>{' '}
                instead. Or email{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  )
}
