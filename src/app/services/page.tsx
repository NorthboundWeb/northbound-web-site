import type { Metadata } from 'next'
import {
  Arrow,
  ButtonLink,
  Container,
  Eyebrow,
  Section,
} from '@/components/ui'
import { services } from '@/lib/services'
import { currency, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Services and prices',
  description:
    'Business websites, landing pages, redesigns, web applications, automations and ongoing care plans. Example starting prices, with every project quoted properly.',
  alternates: { canonical: '/services' },
}

export default function ServicesPage() {
  return (
    <>
      <Section className="border-b border-line pb-16 sm:pb-20">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Services</Eyebrow>
            <h1 className="mt-6 text-4xl leading-[1.1] font-normal sm:text-5xl">
              What it costs, before you have to ask.
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-ink-muted">
              Every figure below is an example starting price — enough to tell
              you whether we are in the same ballpark without a call. What you
              actually pay comes from a written quote with a fixed scope, because
              the best thing to build depends on your business, and I would
              rather work that out than sell you a package that nearly fits.
            </p>
          </div>
        </Container>
      </Section>

      {services.map((service, index) => (
        <section
          key={service.slug}
          id={service.slug}
          className={
            index % 2 === 1
              ? 'scroll-mt-24 border-b border-line bg-paper-sunk py-16 sm:py-20'
              : 'scroll-mt-24 border-b border-line py-16 sm:py-20'
          }
        >
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <div>
                <h2 className="text-3xl leading-tight">{service.title}</h2>
                <p className="mt-5 text-[17px] leading-relaxed text-ink-muted">
                  {service.summary}
                </p>

                <div className="mt-8 border-t border-line pt-6">
                  <p className="eyebrow">Example price</p>
                  <p className="mt-3 font-serif text-4xl text-accent">
                    From {currency.format(service.fromPrice)}
                  </p>
                  <p className="mt-2 text-sm text-ink-faint">
                    {service.priceNote} · quoted properly before we start
                  </p>
                </div>

                <p className="mt-8 text-[15px] leading-relaxed text-ink-muted">
                  <span className="font-medium text-ink">Best for: </span>
                  {service.bestFor}
                </p>
              </div>

              <div className="lg:pt-2">
                <h3 className="eyebrow">What is included</h3>
                <ul className="mt-6 space-y-4">
                  {service.includes.map((item) => (
                    <li key={item} className="flex gap-3.5">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="text-[15px] leading-relaxed text-ink-muted">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>
      ))}

      <Section>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl leading-tight sm:text-4xl">
              Not sure which of these you need?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              That is normal, and it is my job rather than yours. Describe the
              business and what is not working, and I will tell you what I would
              build and what it would cost.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <ButtonLink href="/contact" size="lg">
                Get a quote <Arrow />
              </ButtonLink>
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                or email {site.email}
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
