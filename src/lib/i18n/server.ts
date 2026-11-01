import { cookies } from 'next/headers'
import { asLang, LANG_COOKIE, tr, type Lang, type T } from './index'

export async function getLang(): Promise<Lang> {
  return asLang((await cookies()).get(LANG_COOKIE)?.value)
}

export async function getT(): Promise<{ t: T; lang: Lang }> {
  const lang = await getLang()
  return { lang, t: (text, vars) => tr(lang, text, vars) }
}
