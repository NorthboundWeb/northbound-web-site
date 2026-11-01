import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'

export const metadata: Metadata = { title: 'Privacy' }

/*
  Plain-English privacy notice. Only describes what the site actually does.
  If the site starts collecting something new (analytics, a mailing list),
  update this page first.
*/
const sections = [
  {
    title: 'Who I am',
    body: 'Northbound Web is a one-person web design business in the UK, run by Che. If you have a question about your data, email che@northboundweb.co.uk or message me on WhatsApp.',
  },
  {
    title: 'What I collect, and why',
    body: 'If you send a project request or use the Email me form, I receive what you type (your name, contact details and the details of your project) so I can reply and do the work. If you sign in to the client area with Google or an emailed link, I receive your email address so I can show you your own project. Google only tells me your name and email; I never see your Google password.',
  },
  {
    title: 'Where it is kept',
    body: 'Client project details are kept in a private Google Sheet that only I can open, and sign-in emails are sent from my Google account. The site is hosted on Vercel. WhatsApp messages stay in WhatsApp.',
  },
  {
    title: 'Cookies',
    body: 'Only the ones the site needs to work: one that keeps you signed in to the client area, one that remembers your chosen language, and your light or dark choice for the visit. There is no advertising and no tracking across other sites.',
  },
  {
    title: 'What I do not do',
    body: 'I do not sell your details, share them with advertisers, or contact you after a free build unless you say you want to go ahead.',
  },
  {
    title: 'Your rights',
    body: 'You can ask to see, correct or delete what I hold about you at any time by emailing che@northboundweb.co.uk. I keep client details for as long as the project and its support last, and delete them when you ask.',
  },
]

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="page-head wrap">
        <p className="eyebrow">Privacy</p>
        <h1 className="section-h big">
          Your details, kept simple.
          <span>What I hold, and why.</span>
        </h1>
      </section>
      <section className="band wrap about-cols">
        <div>
          {sections.map((s) => (
            <div key={s.title} style={{ marginBottom: 28 }}>
              <h2 className="section-h" style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}>{s.title}</h2>
              <p style={{ maxWidth: '46rem' }}>{s.body}</p>
            </div>
          ))}
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Last updated 1 November 2026.</p>
        </div>
      </section>
    </PageShell>
  )
}
