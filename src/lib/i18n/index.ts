/**
 * Languages. English is the source text: every string on the site is written
 * in English in the code, and `tr()` swaps in a translation when there is one
 * for the chosen language. A missing translation shows the English, never a
 * blank or a key. Translations live in ./dict, one file per language, keyed by
 * the exact English text.
 *
 * The visitor's choice is the `nb_lang` cookie. Search engines send no cookie,
 * so they always see English.
 */
import { es } from './dict/es'
import { fr } from './dict/fr'
import { pl } from './dict/pl'

export const LANGS = [
  { code: 'en', name: 'English', short: 'UK', html: 'en-GB' },
  { code: 'es', name: 'Español', short: 'ES', html: 'es' },
  { code: 'pl', name: 'Polski', short: 'PL', html: 'pl' },
  { code: 'fr', name: 'Français', short: 'FR', html: 'fr' },
] as const

export type Lang = (typeof LANGS)[number]['code']
export const LANG_COOKIE = 'nb_lang'

const DICTS: Record<Exclude<Lang, 'en'>, Record<string, string>> = { es, pl, fr }

export function asLang(v: string | undefined | null): Lang {
  return LANGS.some((l) => l.code === v) ? (v as Lang) : 'en'
}

export function tr(lang: Lang, text: string, vars?: Record<string, string | number>): string {
  let out = lang === 'en' ? text : (DICTS[lang][text] ?? text)
  if (vars) for (const k of Object.keys(vars)) out = out.split(`{${k}}`).join(String(vars[k]))
  return out
}

export type T = (text: string, vars?: Record<string, string | number>) => string
