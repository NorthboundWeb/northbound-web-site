import type { Metadata } from 'next'
import { requireHq } from '@/lib/hq/auth'
import { driveFolders, onboardingChecklist } from '@/lib/hq/checklist'
import { PageHeader, Panel, cn } from '../_components/ui'

export const metadata: Metadata = { title: 'Starter kit' }

const kitContents = [
  ['src/lib/site.ts', 'Name, URL, contact details, nav. The one file to edit per client.'],
  ['src/lib/contact.ts', 'Contact form server action: honeypot, rate limit, zod validation, escaped email via Resend.'],
  ['src/lib/seo.ts', 'LocalBusiness structured data built from site.ts.'],
  ['src/app/layout.tsx', 'Metadata, skip link, header, footer, JSON-LD.'],
  ['src/app/contact, privacy', 'Contact page and form; privacy policy skeleton that must be rewritten per site.'],
  ['robots.ts, sitemap.ts, not-found.tsx, icon.svg', 'Crawl basics and a proper 404.'],
  ['next.config.ts', 'Security headers. HSTS is commented out until the domain is live on HTTPS.'],
  ['.env.example', 'RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, NEXT_PUBLIC_SITE_URL.'],
]

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto border border-line bg-char-sunk p-4 text-[13px] leading-relaxed text-chalk">
      <code>{children}</code>
    </pre>
  )
}

export default async function TemplatePage() {
  await requireHq()

  return (
    <>
      <PageHeader eyebrow="Tool 01" title="Starter kit">
        A reusable base for every client site, kept in <code>templates/client-starter</code> in this repo. It is
        excluded from this site&apos;s own build and lint.
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Start a new client site">
          <Code>{`# from the root of this repo
./templates/client-starter/scripts/new-client.sh acme-plumbing "Acme Plumbing"
cd ../acme-plumbing
git init -b main && git add -A && git commit -m "Initial site from starter"
gh repo create NorthboundWeb/acme-plumbing --private --source=. --push`}</Code>
          <p className="mt-4 text-sm text-chalk-muted">
            Then edit <code>src/lib/site.ts</code>, import the repo in Vercel and set the environment variables.
          </p>
        </Panel>

        <Panel title="What is in it">
          <ul className="space-y-3 text-sm">
            {kitContents.map(([file, what]) => (
              <li key={file}>
                <code className="text-orange">{file}</code>
                <span className="text-chalk-muted"> {what}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Launch checklist" className="lg:col-span-2">
          <ol className="space-y-4">
            {onboardingChecklist.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="mt-0.5 w-6 shrink-0 text-sm font-semibold text-chalk-faint">{index + 1}</span>
                <div>
                  <h3 className={cn('text-[15px] font-semibold', step.risky ? 'text-orange' : 'text-chalk')}>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-chalk-muted">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Drive folder layout" className="lg:col-span-2">
          <p className="text-sm text-chalk-muted">Clients → [Client name] → {driveFolders.join(' · ')}</p>
        </Panel>
      </div>
    </>
  )
}
