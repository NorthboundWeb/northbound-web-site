import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 text-center">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">That page does not exist</h1>
      <p className="mt-4 text-muted">It may have moved, or the address may have a typo.</p>
      <Link href="/" className="mt-8 inline-block bg-accent px-6 py-3.5 text-sm font-semibold text-paper">
        Back to the homepage
      </Link>
    </section>
  )
}
