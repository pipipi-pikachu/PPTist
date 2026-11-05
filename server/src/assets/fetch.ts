import { isIP, type LookupFunction } from 'node:net'
import { lookup } from 'node:dns'
import http from 'node:http'
import https from 'node:https'

import type { AppConfig } from '../config'
import { AppError } from '../errors'

const MAX_REDIRECTS = 3
const TIMEOUT_MS = 10_000

// 内网 / 保留地址段：拒绝 SSRF 目标
export function isBlockedIp(ip: string): boolean {
  let address = ip
  // IPv4 映射地址（::ffff:x.x.x.x）按 IPv4 处理
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(address)
  if (mapped) address = mapped[1]

  const family = isIP(address)
  if (family === 4) {
    const [a, b] = address.split('.').map(part => Number(part))
    if (a === 0) return true // 0.0.0.0/8
    if (a === 10) return true
    if (a === 127) return true
    if (a === 169 && b === 254) return true
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
    if (a === 100 && b >= 64 && b <= 127) return true
    if (a >= 224) return true // 组播 + 保留段
    return false
  }
  if (family === 6) {
    const normalized = address.toLowerCase()
    if (normalized === '::' || normalized === '::1') return true
    if (/^fe[89ab]/.test(normalized)) return true // fe80::/10
    if (/^f[cd]/.test(normalized)) return true // fc00::/7
    return false
  }
  return true // 无法识别的地址一律拒绝
}

export function assertFetchableUrl(raw: string): URL {
  let url: URL
  try {
    url = new URL(raw)
  }
  catch {
    throw AppError.validation('图片地址不是合法的 URL')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw AppError.validation('图片地址只允许 http/https')
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, '')
  if (isIP(hostname) && isBlockedIp(hostname)) {
    throw AppError.forbidden('图片地址指向内网或保留地址，已拒绝')
  }
  return url
}

// 自定义 lookup：连接前校验解析出的 IP，防 DNS rebinding
// 注意 Node ≥20 的 autoSelectFamily 会以 all:true 调用 lookup 并期望返回地址数组，两种形态都要处理
function makeLookup(): LookupFunction {
  return (hostname: string, options, cb) => {
    lookup(hostname, options, (err, address, family) => {
      if (err) {
        cb(err, '', 0)
        return
      }
      if (Array.isArray(address)) {
        if (address.some(item => isBlockedIp(item.address))) {
          cb(AppError.forbidden(`域名 ${hostname} 解析到内网地址，已拒绝`), '', 0)
          return
        }
        cb(null, address)
        return
      }
      if (isBlockedIp(address)) {
        cb(AppError.forbidden(`域名 ${hostname} 解析到内网地址，已拒绝`), '', 0)
        return
      }
      cb(null, address, family)
    })
  }
}

function requestOnce(url: URL, maxBytes: number): Promise<{ status: number, headers: http.IncomingHttpHeaders, body: Buffer }> {
  return new Promise((resolvePromise, rejectPromise) => {
    const client = url.protocol === 'https:' ? https : http
    const req = client.request(url, {
      method: 'GET',
      lookup: makeLookup(),
      timeout: TIMEOUT_MS,
      headers: { 'user-agent': 'pptist-server/0.1', 'accept': 'image/*,*/*;q=0.8' },
    }, res => {
      const chunks: Buffer[] = []
      let size = 0
      let aborted = false
      const fail = (err: Error) => {
        if (aborted) return
        aborted = true
        res.destroy()
        rejectPromise(err)
      }
      const declared = Number(res.headers['content-length'] ?? 0)
      if (declared > maxBytes) {
        fail(AppError.docTooLarge('远程图片超过大小限制'))
        return
      }
      res.on('data', chunk => {
        size += chunk.length
        if (size > maxBytes) {
          fail(AppError.docTooLarge('远程图片超过大小限制'))
          return
        }
        chunks.push(chunk)
      })
      res.on('end', () => {
        if (aborted) return
        resolvePromise({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks) })
      })
      res.on('error', fail)
    })
    req.on('timeout', () => {
      req.destroy(AppError.validation('下载远程图片超时'))
    })
    req.on('error', rejectPromise)
    req.end()
  })
}

// 下载外链图片：只允许 http/https，最多 3 次跳转且每次重新校验，超时 10s，超限立即中断
export async function fetchRemoteAsset(url: string, config: AppConfig): Promise<Buffer> {
  let current = assertFetchableUrl(url)
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await requestOnce(current, config.maxAssetBytes)
    if (res.status >= 300 && res.status < 400 && typeof res.headers.location === 'string') {
      current = assertFetchableUrl(new URL(res.headers.location, current).toString())
      continue
    }
    if (res.status !== 200) {
      throw AppError.validation(`下载远程图片失败（HTTP ${res.status}）`)
    }
    return res.body
  }
  throw AppError.validation('下载远程图片跳转次数过多')
}
