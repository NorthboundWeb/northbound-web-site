import { ButtonLink, Container, Display, Label, Section } from '@/components/ui'
import { site } from '@/lib/site'

export default function NotFound() {
  return (
    <Section>
      <Container>
        <Label>Error 404</Label>
        <Display as="h1" size="lg" className="mt-9 text-cream">
          Off the map.
        </Display>
        <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-chalk-muted">
          That page does not exist — it may have moved when the site was
          restructured around the two divisions.
        </p>
        <nav aria-label="Recovery" className="mt-11 flex flex-wrap gap-4">
          <ButtonLink href="/" variant="light">
            Back to home
          </ButtonLink>
          {site.nav.map((item) => (
            <ButtonLink key={item.href} href={item.href} variant="outline">
              {item.label}
            </ButtonLink>
          ))}
        </nav>
      </Container>
    </Section>
  )
}
