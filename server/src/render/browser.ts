import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'

import { fetchRemoteAsset } from '../assets/fetch'
import { detectImageType } from '../assets/store'
import type { AppConfig } from '../config'

// 懒启动一个常驻 chromium，崩溃后（disconnected）下次使用时自动重启
let browser: Browser | null = null
let launching: Promise<Browser> | null = null

export function getBrowser(): Promise<Browser> {
  if (browser && browser.isConnected()) return Promise.resolve(browser)
  if (!launching) {
    launching = chromium.launch({ headless: true })
      .then(instance => {
        browser = instance
        instance.on('disconnected', () => {
          if (browser === instance) browser = null
        })
        return instance
      })
      .finally(() => {
        launching = null
      })
  }
  return launching
}

export async function closeBrowser(): Promise<void> {
  const current = browser
  browser = null
  if (current) await current.close().catch(() => {})
}

// 图片/字体以外的跨域请求一律拦截；按内容嗅探回传的 Content-Type
function guessContentType(url: string, body: Buffer): string {
  const image = detectImageType(body)
  if (image) return image.mime
  const head = body.toString('utf8', 0, Math.min(body.length, 256)).trimStart()
  if (head.startsWith('<')) return 'image/svg+xml'
  if (/\.woff2?(\?|$)/i.test(url)) return url.includes('woff2') ? 'font/woff2' : 'font/woff'
  if (/\.ttf(\?|$)/i.test(url)) return 'font/ttf'
  if (/\.otf(\?|$)/i.test(url)) return 'font/otf'
  return 'application/octet-stream'
}

// SSRF 闸门：放行本站（RENDER_BASE_URL 同源）请求；跨域的图片/字体/媒体及 XHR（pptxgenjs 用 XHR 拉图）
// 走 fetch.ts（有 IP 校验）代理；其余一律拦截
// 返回决策结果便于单测，真正 fulfill 在 installRequestGuard 里完成
const PROXYABLE_TYPES = new Set(['image', 'font', 'media', 'xhr', 'fetch'])

export function guardDecision(url: string, resourceType: string, siteOrigin: string): 'allow' | 'proxy' | 'abort' {
  let parsed: URL
  try {
    parsed = new URL(url)
  }
  catch {
    return 'abort'
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return 'allow' // data:/blob: 等
  if (parsed.origin === siteOrigin) return 'allow'
  if (PROXYABLE_TYPES.has(resourceType)) return 'proxy'
  return 'abort'
}

export async function installRequestGuard(page: Page, config: AppConfig): Promise<void> {
  const siteOrigin = new URL(config.renderBaseUrl).origin
  await page.route('**/*', route => {
    const request = route.request()
    const decision = guardDecision(request.url(), request.resourceType(), siteOrigin)
    if (decision === 'allow') return route.continue()
    if (decision === 'abort') return route.abort()

    // 跨域资源：经防 SSRF 下载器代理，失败则拦截；加 CORS 头让页面 XHR/fetch 也能读到
    return fetchRemoteAsset(request.url(), config)
      .then(body => route.fulfill({
        body,
        contentType: guessContentType(request.url(), body),
        headers: { 'access-control-allow-origin': '*' },
      }))
      .catch(() => route.abort())
  })
}

export interface PageOptions {
  viewportSize: number
  viewportRatio: number
  deviceScaleFactor?: number
}

export interface RenderPage {
  context: BrowserContext
  page: Page
}

// 每个任务独立 context/page：viewport 跟随文档尺寸，deviceScaleFactor 决定输出像素密度
export async function newRenderPage(config: AppConfig, options: PageOptions): Promise<RenderPage> {
  const instance = await getBrowser()
  const context = await instance.newContext({
    viewport: {
      width: Math.round(options.viewportSize),
      height: Math.round(options.viewportSize * options.viewportRatio),
    },
    deviceScaleFactor: options.deviceScaleFactor ?? 2,
  })
  const page = await context.newPage()
  await installRequestGuard(page, config)
  return { context, page }
}
