import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'
import { Container, Eyebrow, Section } from '@/components/ui'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Get a quote',
  description: `Tell ${site.name} about your project and get a written quote with a fixed scope and a fixed price. Replies within one working day.`,
  alternates: { canonical: '/contact' },
}

const answers = [
  {
    question: 'What happens after I send this?',
    answer:
      'I read it properly and reply within one working day. If it looks like a fit, the next step is a short call to fill in the gaps — no charge and no obligation.',
  },
  {
    question: 'When do I find out the price?',
    answer:
      'After that call, in writing, with the scope spelled out alongside it. You will not be asked to commit to anything before you have seen the number.',
  },
  {
    question: 'What if I do not know what I need?',
    answer:
      'Then describe the problem rather than the solution — what is not working, or what takes too long. Working out what to build is part of the job.',
  },
  {
    question: 'Do you take on small jobs?',
    answer:
      'Yes. A single landing page or a fix to an existing site is fine. If it is genuinely too small to be worth either of our time, I will tell you and point you somewhere sensible.',
  },
]

export default function ContactPage() {
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
              <ContactForm />
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
