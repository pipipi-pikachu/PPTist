import { createI18n } from 'vue-i18n'
import zh from '../locales/zh.json'
import en from '../locales/en.json'
import fr from '../locales/fr.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: { zh, en, fr },
})

// Standalone t() for use in non-component modules (configs, utils, etc.).
// Inside Vue components/templates prefer useI18n() or $t.
export const t = i18n.global.t as unknown as (key: string, ...args: any[]) => string
