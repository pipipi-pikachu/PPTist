import { EN } from '@/i18n-en'
import { createTranslator, resolveLocale } from './i18n-core'

export let lang = resolveLocale(new URLSearchParams(location.search).get('lang') || navigator.language || 'en')
export let direction = ['ar', 'fa'].includes(lang) ? 'rtl' : 'ltr'
let translate = createTranslator(EN, EN)

export async function initLocale() {
  const catalogs = import.meta.glob<{ default: Record<string, string> }>(['./locales/*.json', '!./locales/en.json'])
  if (lang !== 'en') {
    const load = catalogs[`./locales/${lang}.json`]
    if (load) {
      try {
        const messages = await load()
        translate = createTranslator(EN, messages.default)
      }
      catch {
        lang = 'en'
        direction = 'ltr'
      }
    }
  }
  document.documentElement.lang = lang
}

export function t(key: string, parameters?: Record<string, string | number>): string {
  return translate(key, parameters)
}
