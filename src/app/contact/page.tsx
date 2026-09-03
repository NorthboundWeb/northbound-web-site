import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'
import { Container, Display, Label, Rail, Section } from '@/components/ui'
import { interestFromParam, projectTypeFromParam } from '@/lib/contact/schema'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
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
      'You already know it — the package prices are on the web services page, and they are what you pay. Only a Custom build varies, and its scope and price are agreed in writing before any work begins.',
  },
  {
    question: 'How does payment work?',
    answer:
      'A 50% deposit secures the project and lets work begin. The remaining 50% is payable once the site is complete and approved, before it goes live.',
  },
  {
    question: 'How long does a build take?',
    answer:
      'Roughly 5–7 working days for Starter, 7–10 for Advanced and 10–15 for Pro. Custom is agreed in your quote. These are estimates: the clock starts once the deposit and your content have arrived, and slow feedback moves the date.',
  },
  {
    question: 'Can I hire a Northbound Employee yet?',
    answer:
      'Not yet. Northbound Employees are in development and none of them is available to buy or hire. You can register interest here and I will let you know when that changes.',
  },
  {
    question: 'Do I have to take a management plan?',
    answer:
      'No. Plans are optional and rolling, and the build price does not depend on taking one. The Pro and Custom builds include a complimentary month of Pro Management — it does not turn into a paid subscription on its own, so if you do nothing when it ends, nothing is charged.',
  },
]

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string | string[]; interest?: string | string[] }>
}) {
  const params = await searchParams
  // Resolved on the server so the right option is already selected in the HTML
  // — no flash of an empty select, and it still works without JavaScript.
  // A ?package= from a pricing card wins over a generic ?interest=.
  const preselected =
    projectTypeFromParam(params.package) ?? interestFromParam(params.interest)

  return (
    <>
      <section className="border-b border-line">
        <Container>
          <div className="flex gap-8 lg:gap-14">
            <Rail index="05" />
            <div className="min-w-0 flex-1 pt-14 pb-16 sm:pt-20 lg:pb-24">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Label>Let&rsquo;s talk</Label>
                <span className="label text-chalk-faint">Reply in 1 day</span>
              </div>
              <Display as="h1" size="lg" className="mt-9 text-cream">
                Start a project.
              </Display>
              <p className="mt-9 max-w-xl text-[15px] leading-relaxed text-chalk-muted sm:text-base">
                The more you can tell me about the business and the problem, the
                more useful my first reply will be. If you would rather just
                email,{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="text-orange underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>{' '}
                reaches the same place.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section className="bg-cream text-ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <ContactForm defaultProjectType={preselected} />
            </div>

            <aside>
              <div className="border border-line-ink bg-cream-sunk p-8">
                <h2 className="label text-ink-faint">Before you ask</h2>
                <dl className="mt-8 divide-y divide-line-ink">
                  {answers.map((item, i) => (
                    <div key={item.question} className="py-5 first:pt-0 last:pb-0">
                      <dt className="flex gap-4">
                        <span className="label shrink-0 pt-0.5 text-orange-ink">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-medium text-ink">
                          {item.question}
                        </span>
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
    </>
  )
}
