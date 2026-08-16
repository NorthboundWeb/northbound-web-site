import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'
import { Container, Eyebrow, Section } from '@/components/ui'
import { projectTypeFromParam } from '@/lib/contact/schema'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Get a quote',
  description: `Tell ${site.name} about your project and get a written quote with a fixed scope and a fixed price. Replies usually within one working day.`,
  alternates: { canonical: '/contact' },
}

const answers = [
  {
    question: 'What happens after I send this?',
    answer:
      'I read it properly and normally reply within one working day. If it looks like a fit, the next step is a short call to fill in the gaps — no charge and no obligation.',
  },
  {
    question: 'When do I find out the price?',
    answer:
      'You already know it — the package prices are on the services page, and they are what you pay. Only a Custom build varies, and its scope and price are agreed in writing before any work begins.',
  },
  {
    question: 'How does payment work?',
    answer:
      'A 50% deposit secures the project and lets work begin. The remaining 50% is payable once the site is complete and approved, before it goes live.',
  },
  {
    question: 'How long does a build take?',
    answer:
      'Roughly 5–7 working days for Basic, 7–10 for Standard and 10–15 for Advanced. Custom is agreed in your quote. These are estimates: the clock starts once the deposit and your content have arrived, and slow feedback moves the date.',
  },
  {
    question: 'What if I do not know what I need?',
    answer:
      'Then describe the problem rather than the solution — what is not working, or what takes too long. Working out what to build is part of the job.',
  },
  {
    question: 'Do I have to take a management plan?',
    answer:
      'No. Plans are optional and rolling, and the build price does not depend on taking one. The Advanced and Custom builds include a complimentary month of Advanced Management — it does not turn into a paid subscription on its own, so if you do nothing when it ends, nothing is charged.',
  },
]

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string | string[] }>
}) {
  // Resolved on the server so the right option is already selected in the HTML
  // — no flash of an empty select, and it still works without JavaScript.
  const preselected = projectTypeFromParam((await searchParams).package)

  return (
    <Section>
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div>
            <Eyebrow>Get a quote</Eyebrow>
            <h1 className="mt-6 text-4xl leading-[1.1] font-normal sm:text-5xl">
              Tell me what you are trying to do.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
              The more you can tell me about the business and the problem, the
              more useful my first reply will be. If you would rather just email,{' '}
              <a
                href={`mailto:${site.email}`}
                className="text-accent underline-offset-4 hover:underline"
              >
                {site.email}
              </a>{' '}
              reaches the same place.
            </p>

            <div className="mt-12">
              <ContactForm defaultProjectType={preselected} />
            </div>
          </div>

          <aside className="lg:pt-24">
            <div className="rounded-2xl border border-line bg-paper-sunk p-8">
              <h2 className="eyebrow">Before you ask</h2>
              <dl className="mt-7 space-y-7">
                {answers.map((item) => (
                  <div key={item.question}>
                    <dt className="font-medium">{item.question}</dt>
                    <dd className="mt-2 text-[15px] leading-relaxed text-ink-muted">
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
