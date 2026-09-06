import 'server-only'
import type { Locale } from '@/i18n/config'
import { en, type Dictionary } from './en'

/**
 * Dictionary loading.
 *
 * Each locale is a dynamic import so a French visitor never downloads the
 * German strings. English is imported eagerly because it is also the fallback,
 * and because every other dictionary is type-checked against it.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: async () => en,
  fr: () => import('./fr').then((m) => m.fr),
  de: () => import('./de').then((m) => m.de),
  es: () => import('./es').then((m) => m.es),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}

export type { Dictionary }
