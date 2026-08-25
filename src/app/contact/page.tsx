import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'
import { Container, Display, Label, Section } from '@/components/ui'
import { prefillFromParams } from '@/lib/contact/schema'
import { ENTRY_PRICE } from '@/lib/services'
import { currency, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Start a project',
  description: `Tell ${site.name} what you need. Website builds from ${currency.format(ENTRY_PRICE)}, with a fixed price agreed in writing before anything starts. Replies usually within one working day.`,
  alternates: { canonical: '/contact' },
}

const answers = [
  {
    question: 'What happens after I send this?',
    answer:
      'I read it properly and normally reply within one working day. If it looks like a fit, the next step is a short call to fill in the gaps — no charge and no obligation.',
  },
  {
    question: 'How much will it cost?',
    answer: `Builds start at ${currency.format(ENTRY_PRICE)}. Above that the price follows the amount of work involved, and you get a fixed figure in writing before you commit to anything.`,
  },
  {
    question: 'How does payment work?',
    answer:
      'A 50% deposit secures the project and lets work begin. The remaining 50% is payable once the site is complete and approved, before it goes live.',
  },
  {
    question: 'How long does a build take?',
    answer:
      'Roughly 5–7 working days for a Starter, 7–10 for Business and 10–15 for Extended. Custom is agreed in your quote. The clock starts once the deposit and your content have arrived.',
  },
  {
    question: 'I already have a website — can you help?',
    answer:
      'Yes. Choose "Help with an existing site" or "Website management" above. A short look at your current site is free, and if it is a five-minute fix I will tell you rather than quote for a rebuild.',
  },
  {
    question: 'Do I have to take a management plan?',
    answer:
      'No. Plans are optional and rolling, and the build price does not depend on taking one. The Extended and Custom builds include a complimentary month that does not turn into a paid subscription on its own.',
  },
]

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{
    package?: string | string[]
    type?: string | string[]
    unlock?: string | string[]
  }>
}) {
  const params = await searchParams
  // Resolved on the server so the right branch is already open in the HTML —
  // no flash of the wrong fields, and it works without JavaScript.
  const prefill = prefillFromParams(params)
  const unlock = typeof params.unlock === 'string' ? params.unlock : undefined

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between">
          <Label index="01">Start a project</Label>
          <span className="label text-ink-faint">Reply in 1 working day</span>
        </div>

        <Display as="h1" className="mt-6">
          Begin
        </Display>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
              Tell me what your business does and what you need. The more you
              can say, the more useful my first reply will be — and if you would
              rather just email,{' '}
              <a href={`mailto:${site.email}`} className="text-accent-deep underline-offset-4 hover:underline">
                {site.email}
              </a>{' '}
              reaches the same place.
            </p>

            {unlock ? (
              <p className="mt-8 border-l-2 border-accent bg-accent-wash px-5 py-4 text-sm text-ink">
                <span className="label mr-2 text-accent-deep">Unlock</span>
                Code <strong>{unlock.toUpperCase()}</strong> is attached to this enquiry.
              </p>
            ) : null}

            <div className="mt-12">
              <ContactForm
                defaultType={prefill.enquiryType}
                defaultScope={prefill.scope}
                defaultPlan={prefill.plan}
                defaultUnlock={unlock}
              />
            </div>
          </div>

          <aside>
            <div className="pin-column border border-line bg-paper-sunk p-8">
              <h2 className="label text-ink-faint">Before you ask</h2>
              <dl className="mt-8 divide-y divide-line">
                {answers.map((item, i) => (
                  <div key={item.question} className="py-5 first:pt-0 last:pb-0">
                    <dt className="flex gap-4">
                      <span className="label shrink-0 pt-0.5 text-accent-deep">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-medium text-ink">{item.question}</span>
                    </dt>
                    <dd className="mt-2.5 pl-10 text-[15px] leading-relaxed text-ink-muted">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  )
}
