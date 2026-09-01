import type { Metadata } from 'next'
import { CompassDiagram } from '@/components/graphics'
import { Container, Display, Label, Section } from '@/components/ui'
import { UnlockForm } from './unlock-form'

export const metadata: Metadata = {
  title: 'UNLOCK',
  description: 'Enter a Northbound UNLOCK code.',
  alternates: { canonical: '/unlock' },
  // A code-entry page has nothing useful for search.
  robots: { index: false, follow: false },
}

export default function UnlockPage() {
  return (
    <Section>
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center justify-between">
              <Label>Northbound</Label>
              <span className="label text-accent-deep">Unlock</span>
            </div>
            <Display as="h1" className="mt-8">
              Unlock
            </Display>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-muted">
              Some Northbound offers are not advertised. If you have a code,
              this is where it goes.
            </p>
            <div className="mt-12">
              <UnlockForm />
            </div>
          </div>
          <CompassDiagram className="w-40 justify-self-start text-ink sm:w-64 lg:w-72" />
        </div>
      </Container>
    </Section>
  )
}
