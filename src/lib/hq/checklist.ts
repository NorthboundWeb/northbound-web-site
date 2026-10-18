/**
 * The repeatable steps for taking a client from enquiry to live site. Kept as
 * data so the client page and the starter-kit page always show the same list.
 * Order matters; the two that can take a client's site or email offline are
 * flagged so they are never done casually.
 */

export type ChecklistStep = {
  title: string
  detail: string
  risky?: boolean
}

export const onboardingChecklist: ChecklistStep[] = [
  {
    title: 'Agree scope and send the proposal',
    detail:
      'Confirm the package, what is and is not included (copywriting, photography and brand design are not in the fixed packages) and the timeline estimate. Save the proposal in the client\'s Drive folder.',
  },
  {
    title: 'Take the deposit',
    detail: '50% to begin. Work does not start before it has cleared. The balance is due once the site is complete and approved, before go-live.',
  },
  {
    title: 'Create the Drive folder',
    detail: 'Clients → [Client name] with sub-folders: Brief, Brand Assets, Copy, Images, Proposal, Contract, Invoices.',
  },
  {
    title: 'Create the repository from the starter kit',
    detail: 'One private GitHub repo per client, named after the client. Copy templates/client-starter, set the name and details in src/lib/site.ts, commit.',
  },
  {
    title: 'Connect it to Vercel',
    detail: 'Vercel → Add New → Project → import the repo. Use Preview deployments to review everything before the live domain is touched.',
  },
  {
    title: 'Set environment variables',
    detail: 'Vercel → Project → Settings → Environment Variables. Contact form needs RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL. Never commit .env files.',
  },
  {
    title: 'Verify the sending domain in Resend',
    detail: 'Resend → Domains → add the client\'s domain and copy the records it asks for. Until it is verified, enquiries will not send.',
  },
  {
    title: 'Run the pre-launch audit',
    detail: 'Run the Site audit tool on the preview URL and clear every red item. Then check the form end to end on a phone.',
  },
  {
    title: 'Plan the DNS change before making it',
    detail: 'Note the current records first. A wrong change takes the client\'s website or email offline. Do it at a quiet time and keep the old records written down.',
    risky: true,
  },
  {
    title: 'Take the balance, then go live',
    detail: 'Balance cleared, client has approved the preview. Point the domain at Vercel, confirm HTTPS, then test the live form.',
    risky: true,
  },
  {
    title: 'Switch on monitoring',
    detail: 'Sentry for errors and PostHog (EU region) for analytics, configured without collecting personal details you do not need.',
  },
  {
    title: 'Record it in the register',
    detail: 'Domain, registrar, renewal date, Vercel project, GitHub repo and Stripe customer ID, so nothing lives only in your head.',
  },
]

export const driveFolders = [
  'Brief',
  'Brand Assets',
  'Copy',
  'Images',
  'Proposal',
  'Contract',
  'Invoices',
] as const
