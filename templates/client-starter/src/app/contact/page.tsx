import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact-form'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${site.name}.`,
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 sm:py-24 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-5 text-muted">
          Send a message and we will reply as soon as we can, or contact us directly.
        </p>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="font-semibold">Phone</dt>
            <dd>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="text-accent underline underline-offset-4">
                {site.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Email</dt>
            <dd>
              <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-4">
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Address</dt>
            <dd>
              {site.address.street}, {site.address.city} {site.address.postcode}
            </dd>
          </div>
        </dl>
      </div>
      <ContactForm />
    </section>
  )
}
