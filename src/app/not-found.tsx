import { RouteMarker } from '@/components/graphics'
import {
  ArrowLink,
  ButtonLink,
  Container,
  Display,
  Label,
  Section,
} from '@/components/ui'
import { site } from '@/lib/site'

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-xl">
            <Label index="404" />
            <Display as="h1" className="mt-6">
              Lost
            </Display>
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">
              The link may be out of date, or the address slightly off. Nothing
              is broken on your end.
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <ButtonLink href="/" size="lg">
                Back to the homepage
              </ButtonLink>
              <ArrowLink href="/services">See packages</ArrowLink>
            </div>
            <p className="mt-8 text-sm text-ink-faint">
              Or tell me about the broken link —{' '}
              <a
                href={`mailto:${site.email}`}
                className="text-accent underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
            </p>
          </div>
          <RouteMarker className="w-48 justify-self-start text-ink sm:w-64" />
        </div>
      </Container>
    </Section>
  )
}
