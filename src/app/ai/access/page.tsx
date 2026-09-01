import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'
import { Container, Display, Label, Section } from '@/components/ui'
import { AI_STATUS_NOTE, employeeBySlug } from '@/lib/ai/employees'
import { teamBySlug } from '@/lib/ai/teams'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Early access',
  description:
    'Northbound.AI is in development. Early access is how the first businesses get an employee working on a real job — and shape what it does next.',
  alternates: { canonical: '/ai/access' },
}

const TERMS = [
  'Nothing is charged. There is no price yet because there is nothing finished to sell.',
  'You will hear from a person, not an automated sequence, usually within one working day.',
  'You are not committing to anything by asking. If nothing fits your business yet, we will tell you.',
  'Access is granted a few businesses at a time, so the ones using it get looked after properly.',
]

/**
 * The way in. Deliberately the same enquiry form the rest of the site uses —
 * one validated, rate-limited, spam-trapped path rather than a second one
 * built for the AI division.
 */
export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ employee?: string; team?: string }>
}) {
  const { employee: employeeSlug, team: teamSlug } = await searchParams
  const employee = employeeSlug ? employeeBySlug(employeeSlug) : undefined
  const team = teamSlug ? teamBySlug(teamSlug) : undefined

  // Carried in from wherever they clicked, so nobody retypes it.
  const context = employee
    ? `I am interested in ${employee.name} (${employee.role}).\n\n`
    : team
      ? `I am interested in the ${team.name}.\n\n`
      : undefined

  return (
    <Section>
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <Label index="01">Northbound.AI</Label>
              <span className="label text-accent">Early access</span>
            </div>
            <Display as="h1" className="mt-6">
              Get in early
            </Display>

            {employee ? (
              <p className="mt-8 max-w-lg text-[clamp(1.25rem,4vw,1.75rem)] leading-snug text-ink">
                You are asking about{' '}
                <span style={{ color: `var(${employee.colourVar})` }}>
                  {employee.name}
                </span>{' '}
                — {employee.purpose.toLowerCase()}
              </p>
            ) : team ? (
              <p className="mt-8 max-w-lg text-[clamp(1.25rem,4vw,1.75rem)] leading-snug text-ink">
                You are asking about the {team.name} — {team.outcome.toLowerCase()}
              </p>
            ) : (
              <p className="mt-8 max-w-lg text-[clamp(1.25rem,4vw,1.75rem)] leading-snug text-ink">
                Tell us which job you would hand over first.
              </p>
            )}

            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-muted">
              {AI_STATUS_NOTE}
            </p>

            <ul className="mt-10 border-t border-line">
              {TERMS.map((t, i) => (
                <li key={t} className="flex gap-5 border-b border-line py-4">
                  <span className="label shrink-0 pt-0.5 text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] leading-relaxed text-ink-muted">{t}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-ink-faint">
              Or email{' '}
              <a
                href={`mailto:${site.email}`}
                className="text-accent underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
            </p>
          </div>

          <div className="border border-line bg-paper-raised p-6 sm:p-8">
            <ContactForm defaultType="ai" defaultMessage={context} />
          </div>
        </div>
      </Container>
    </Section>
  )
}
