import Link from 'next/link'
import { site } from '@/lib/site'

export default function HomePage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{site.tagline}</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">{site.description}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/contact"
          className="bg-accent px-6 py-3.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
        >
          Get in touch
        </Link>
        <a
          href={`tel:${site.phone.replace(/\s/g, '')}`}
          className="border border-ink/20 px-6 py-3.5 text-sm font-semibold transition-colors hover:border-ink"
        >
          Call {site.phone}
        </a>
      </div>
    </section>
  )
}
