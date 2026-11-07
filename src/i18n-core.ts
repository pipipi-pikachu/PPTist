import supported from './locales.json'

export function resolveLocale(value: string): string {
  const tag = value.toLowerCase().replace(/_/g, '-')
  if (tag === 'zh-tw' || tag === 'zh-hk' || tag.startsWith('zh-hant')) return 'zh-TW'
  if (tag === 'zh' || tag.startsWith('zh-')) return 'zh-CN'
  if (tag === 'pt' || tag.startsWith('pt-')) return 'pt-BR'
  return supported.find(locale => locale.toLowerCase() === tag || locale === tag.split('-')[0]) || 'en'
}

export function createTranslator(english: Record<string, string>, messages: Record<string, string>) {
  return (key: string, parameters: Record<string, string | number> = {}): string => {
    const value = messages[key] ?? english[key] ?? key
    return value.replace(/\{(p\d+)\}/g, (placeholder, name: string) =>
      Object.prototype.hasOwnProperty.call(parameters, name) ? String(parameters[name]) : placeholder)
  }
}
