import type { Metadata } from 'next'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy policy',
  alternates: { canonical: '/privacy' },
}

/**
 * STARTING POINT ONLY. This must be rewritten to match what this particular
 * site really collects and who the controller is before launch. Under UK GDPR
 * the policy has to describe actual practice, so do not ship it unchanged.
 */
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-5 py-16 sm:py-24">
      <h1 className="text-4xl font-semibold tracking-tight">Privacy policy</h1>

      <p className="text-muted">
        {site.name} respects your privacy. This page explains what personal information this website
        collects and what we do with it.
      </p>

      <h2 className="text-xl font-semibold">What we collect</h2>
      <p>
        If you use the contact form, we receive your name, email address and the message you write. We
        use it only to reply to you. [List anything else the site collects: analytics, cookies, booking
        or payment tools.]
      </p>

      <h2 className="text-xl font-semibold">Who we share it with</h2>
      <p>
        Messages are delivered to us through an email service provider acting on our behalf. [Name each
        provider the site uses and what it receives.]
      </p>

      <h2 className="text-xl font-semibold">How long we keep it</h2>
      <p>[State how long enquiries are kept and why.]</p>

      <h2 className="text-xl font-semibold">Your rights</h2>
      <p>
        You can ask to see, correct or delete the information we hold about you, or object to how we use
        it. Contact us at <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-4">{site.email}</a>.
        You can also complain to the Information Commissioner&apos;s Office at ico.org.uk.
      </p>
    </article>
  )
}
