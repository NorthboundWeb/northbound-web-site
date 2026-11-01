import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { COMPLIMENTARY_MONTH_TERMS, commercialTerms, managementTerms } from '@/lib/services'

export const metadata: Metadata = { title: 'Terms' }

/*
  Built from the same wording as the services page (src/lib/services.ts), so the
  terms here can never drift from what is shown next to the prices. Edit the
  terms there, not here.
*/
export default function TermsPage() {
  return (
    <PageShell>
      <section className="page-head wrap">
        <p className="eyebrow">Terms</p>
        <h1 className="section-h big">
          Terms and conditions.
          <span>The same ones shown next to the prices.</span>
        </h1>
      </section>
      <section className="band wrap about-cols">
        <div>
          {commercialTerms.map((g) => (
            <div key={g.title} style={{ marginBottom: 28 }}>
              <h2 className="section-h" style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}>{g.title}</h2>
              <ul style={{ maxWidth: '46rem', paddingLeft: 20, display: 'grid', gap: 8 }}>
                {g.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ marginBottom: 28 }}>
            <h2 className="section-h" style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}>Website management plans</h2>
            <ul style={{ maxWidth: '46rem', paddingLeft: 20, display: 'grid', gap: 8 }}>
              <li>{COMPLIMENTARY_MONTH_TERMS}</li>
              {managementTerms.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <p style={{ maxWidth: '46rem' }}>
            Prices and packages are on the <Link href="/services">services page</Link>. How I handle your details is in the{' '}
            <Link href="/privacy">privacy notice</Link>. Questions about any of this: <Link href="/email">email me</Link>.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Last updated 1 November 2026.</p>
        </div>
      </section>
    </PageShell>
  )
}
