'use client'

import { createContext, useCallback, useContext } from 'react'
import { tr, type Lang, type T } from '@/lib/i18n'

const Ctx = createContext<Lang>('en')

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)

export function useT(): T {
  const lang = useContext(Ctx)
  return useCallback((text, vars) => tr(lang, text, vars), [lang])
}
