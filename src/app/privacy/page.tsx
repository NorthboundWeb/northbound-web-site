import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { Container, Display, Label, Rail, Section } from '@/components/ui'
import {
  awaitingOwner,
  confirmed,
  dataRights,
  privacyIsComplete,
} from '@/lib/privacy'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'Privacy',
  description: `How ${site.legalName} handles the information you send through this website, and the rights you have over it.`,
  path: '/privacy',
})

function Block({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-line-ink pt-8">
      <h2 className="display text-2xl text-ink">{heading}</h2>
      <div className="mt-5 max-w-2xl space-y-4 text-[15px] leading-relaxed text-ink-muted">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <>
      <section className="border-b border-line">
        <Container>
          <div className="flex gap-8 lg:gap-14">
            <Rail index="06" />
            <div className="min-w-0 flex-1 pt-14 pb-16 sm:pt-20 lg:pb-24">
              <Label>Privacy</Label>
              <Display as="h1" size="lg" className="mt-9 text-cream">
                Your information.
              </Display>
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                What this website collects when you send an enquiry, why it is
                collected, who else sees it, and what you can ask for.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section className="bg-cream text-ink">
        <Container>
          <div className="max-w-3xl space-y-12">
            {/*
              Honest gap notice. Publishing an invented lawful basis, retention
              period or registered address would be a false legal statement, so
              the sections that depend on owner decisions are absent rather than
              filled with plausible text — and the page says so plainly.
            */}
            {!privacyIsComplete ? (
              <div className="border-l-2 border-orange bg-cream-sunk p-6">
                <p className="label text-orange-ink">Being finalised</p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                  Parts of this notice — the registered business details, the
                  lawful basis relied on, how long enquiries are kept and
                  whether any data leaves the UK — are being confirmed before
                  launch and are deliberately not stated here yet rather than
                  guessed at.
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                  In the meantime, you can ask what is held about you, or ask
                  for it to be deleted, by emailing{' '}
                  <a
                    href={`mailto:${site.email}`}
                    className="text-orange-ink underline underline-offset-4"
                  >
                    {site.email}
                  </a>
                  . That request will be honoured whether or not this page is
                  finished.
                </p>
              </div>
            ) : null}

            <Block heading="Who this is about">
              <p>
                This website is operated by {site.legalName}, based in the{' '}
                {site.location}. For anything to do with your data, contact{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="text-orange-ink underline underline-offset-4"
                >
                  {site.email}
                </a>
                .
              </p>
              {awaitingOwner.legalIdentity ? (
                <p>{awaitingOwner.legalIdentity}</p>
              ) : null}
              {awaitingOwner.postalAddress ? (
                <p>{awaitingOwner.postalAddress}</p>
              ) : null}
            </Block>

            <Block heading="What is collected">
              <p>
                The only place this site asks you for anything is the enquiry
                form. It collects:
              </p>
              <ul className="space-y-2">
                {confirmed.formFields.map((field) => (
                  <li key={field} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-orange" />
                    {field}
                  </li>
                ))}
              </ul>
              <p>Alongside that, one technical detail is recorded:</p>
              <ul className="space-y-2">
                {confirmed.technicalData.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-orange" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                There is no advertising tracking on this site, and no account to
                create.
              </p>
            </Block>

            <Block heading="Why it is collected">
              <p>
                To read your enquiry, reply to it, and carry on the conversation
                about the work you are asking about. The IP address is used only
                to stop the form being abused by automated submissions.
              </p>
              {awaitingOwner.lawfulBasis ? <p>{awaitingOwner.lawfulBasis}</p> : null}
            </Block>

            <Block heading="Who else sees it">
              <p>
                Your enquiry is not sold, and it is not shared for marketing.
                Two services necessarily handle it in order for the form to
                work at all:
              </p>
              <ul className="space-y-3">
                {confirmed.processors.map((p) => (
                  <li key={p.name} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-orange" />
                    <span>
                      <strong className="font-semibold text-ink">{p.name}</strong>{' '}
                      — {p.role}
                    </span>
                  </li>
                ))}
              </ul>
              {awaitingOwner.internationalTransfers ? (
                <p>{awaitingOwner.internationalTransfers}</p>
              ) : null}
            </Block>

            {awaitingOwner.retention ? (
              <Block heading="How long it is kept">
                <p>{awaitingOwner.retention}</p>
              </Block>
            ) : null}

            <Block heading="Your rights">
              <p>Under UK data protection law you can:</p>
              <ul className="space-y-2">
                {dataRights.map((right) => (
                  <li key={right} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-orange" />
                    {right}
                  </li>
                ))}
              </ul>
              <p>
                To exercise any of them, email{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="text-orange-ink underline underline-offset-4"
                >
                  {site.email}
                </a>
                . You do not have to give a reason.
              </p>
            </Block>

            <Block heading="Complaining">
              <p>
                If you think your data has been handled badly, you can complain
                to the Information Commissioner&rsquo;s Office, the UK&rsquo;s
                data protection regulator, at{' '}
                <a
                  href="https://ico.org.uk/make-a-complaint/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-ink underline underline-offset-4"
                >
                  ico.org.uk
                </a>
                . Raising it with Northbound first is welcome but not required.
              </p>
              {awaitingOwner.icoRegistration ? (
                <p>{awaitingOwner.icoRegistration}</p>
              ) : null}
            </Block>
          </div>
        </Container>
      </Section>
    </>
  )
}
