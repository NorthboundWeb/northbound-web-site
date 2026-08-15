import { ButtonLink, Container, Eyebrow, Section } from '@/components/ui'
import { site } from '@/lib/site'

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div className="max-w-xl py-16">
          <Eyebrow>404</Eyebrow>
          <h1 className="mt-6 text-4xl leading-tight font-normal sm:text-5xl">
            That page has gone north.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-muted">
            The link may be out of date, or the address slightly off. Nothing is
            broken on your end.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ButtonLink href="/" size="lg">
              Back to the homepage
            </ButtonLink>
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
            >
              Tell me about the broken link
            </a>
          </div>
        </div>
      </Container>
    </Section>
  )
}
