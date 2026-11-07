import { test } from 'node:test'
import { Buffer } from 'node:buffer'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
const built = await build({ entryPoints: ['src/i18n-core.ts'], bundle: true, write: false, format: 'esm', platform: 'node' })
const { resolveLocale, createTranslator } = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString('base64')}`)

test('resolves locale variants and falls back to English for unsupported locales', () => {
  for (const [input, expected] of Object.entries({ 'vi-VN': 'vi', 'es-419': 'es', 'fa-IR': 'fa', 'id-ID': 'id', 'ru-RU': 'ru', 'ar-EG': 'ar', 'uk-UA': 'uk', 'pt-PT': 'pt-BR', 'zh-Hant': 'zh-TW', 'zh_HK': 'zh-TW', 'zh-Hans': 'zh-CN', 'fr-FR': 'fr', 'de-DE': 'en', '': 'en' })) assert.equal(resolveLocale(input), expected)
})
test('uses catalog text, preserves supplied values, and falls back per missing key', () => {
  const t = createTranslator({ done: 'Saved {p0}', fallback: 'Retry' }, { done: 'Đã lưu {p0}' })
  assert.equal(t('done', { p0: 'title {p1} $&' }), 'Đã lưu title {p1} $&')
  assert.equal(t('fallback'), 'Retry')
  assert.equal(t('unknown'), 'unknown')
  assert.equal(t('done'), 'Đã lưu {p0}')
})
