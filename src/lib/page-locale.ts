import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary, type Dictionary } from '@/i18n/dictionaries'

/**
 * Resolves the `[locale]` segment for a page.
 *
 * Next types the segment as a plain string — correctly, since anyone can type
 * /xx/web — so it is narrowed here and an unknown prefix 404s rather than
 * blowing up on a missing dictionary. Every page starts with this, so the
 * check cannot be forgotten in one of them.
 */
export async function resolvePage(
  params: Promise<{ locale: string }>
): Promise<{ locale: Locale; t: Dictionary }> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return { locale, t: await getDictionary(locale) }
}

export type LocaleParams = { params: Promise<{ locale: string }> }
