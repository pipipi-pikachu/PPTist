import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { nanoid } from 'nanoid'

import type { AppConfig } from './config'
import type { AdminSessionRow, Db } from './db'
import { AppError } from './errors'

export const ADMIN_COOKIE = 'pptist_admin'
export const ADMIN_PASSWORD_MIN_LEN = 10

const SCRYPT_N = 16384
const SCRYPT_R = 8
const SCRYPT_P = 1
const KEY_LEN = 32
const META_PASSWORD = 'password_scrypt'

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex')
}

// ---------- 管理员密码（scrypt 散列，存 admin_meta，不进代码/日志） ----------

export function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P })
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('base64url')}$${hash.toString('base64url')}`
}

export function hasAdminPassword(db: Db): boolean {
  return db.prepare('SELECT 1 FROM admin_meta WHERE key = ?').get(META_PASSWORD) !== undefined
}

export function setAdminPassword(db: Db, password: string): void {
  if (password.length < ADMIN_PASSWORD_MIN_LEN) {
    throw new Error(`管理员密码至少 ${ADMIN_PASSWORD_MIN_LEN} 个字符`)
  }
  db.prepare('INSERT INTO admin_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .run(META_PASSWORD, hashPassword(password))
}

// 仅当库里还没有密码时按 ADMIN_INITIAL_PASSWORD 播种；已有时不再覆盖，方便轮换后重启不回退
export function seedAdminPassword(db: Db, password: string): boolean {
  if (hasAdminPassword(db)) return false
  setAdminPassword(db, password)
  return true
}

// 预先算一个散列，库里没配密码时也走完整 scrypt + 等长比较，时序上不暴露「未配置」
const DUMMY_HASH = hashPassword(randomBytes(16).toString('base64url'))

export function verifyAdminPassword(db: Db, password: string): boolean {
  const row = db.prepare('SELECT value FROM admin_meta WHERE key = ?').get(META_PASSWORD) as { value: string } | undefined
  const stored = row?.value ?? DUMMY_HASH
  const m = /^scrypt\$(\d+)\$(\d+)\$(\d+)\$([A-Za-z0-9_-]+)\$([A-Za-z0-9_-]+)$/.exec(stored)
  if (!m) return false
  const salt = Buffer.from(m[4], 'base64url')
  const expected = Buffer.from(m[5], 'base64url')
  const actual = scryptSync(password, salt, KEY_LEN, {
    N: Number(m[1]), r: Number(m[2]), p: Number(m[3]),
  })
  return row !== undefined && actual.length === expected.length && timingSafeEqual(actual, expected)
}

// ---------- Cookie ----------

export function readCookie(req: FastifyRequest, name: string): string | undefined {
  const header = req.headers.cookie
  if (!header) return undefined
  for (const part of header.split(';')) {
    const eq = part.indexOf('=')
    if (eq < 0) continue
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim()
  }
  return undefined
}

function cookieAttrs(config: AppConfig, maxAgeSec: number): string[] {
  const attrs = ['Path=/api/admin', 'HttpOnly', 'SameSite=Strict', `Max-Age=${maxAgeSec}`]
  if (config.adminCookieSecure) attrs.push('Secure')
  return attrs
}

export function sessionCookie(config: AppConfig, token: string): string {
  return `${ADMIN_COOKIE}=${token}; ${cookieAttrs(config, Math.floor(config.adminSessionTtlMs / 1000)).join('; ')}`
}

export function clearSessionCookie(config: AppConfig): string {
  return `${ADMIN_COOKIE}=; ${cookieAttrs(config, 0).join('; ')}`
}

// ---------- 会话（服务端存储；Cookie 里只是随机令牌，库里只存其散列） ----------

export function createSession(db: Db, config: AppConfig, req: FastifyRequest): { token: string, csrfToken: string, expiresAt: number } {
  const now = Date.now()
  // 顺带惰性清理过期会话，不加定时器
  db.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').run(now)

  const token = randomBytes(32).toString('base64url')
  const csrfToken = randomBytes(32).toString('base64url')
  const expiresAt = now + config.adminSessionTtlMs
  db.prepare(
    'INSERT INTO admin_sessions (id, token_hash, csrf_token, created_at, expires_at, last_seen_at, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    nanoid(16), sha256(token), csrfToken, now, expiresAt, now,
    req.ip, String(req.headers['user-agent'] ?? '').slice(0, 200) || null,
  )
  return { token, csrfToken, expiresAt }
}

export function destroySession(db: Db, session: AdminSessionRow): void {
  db.prepare('DELETE FROM admin_sessions WHERE id = ?').run(session.id)
}

export function lookupSession(db: Db, config: AppConfig, req: FastifyRequest): AdminSessionRow | undefined {
  const token = readCookie(req, ADMIN_COOKIE)
  // 令牌为定长 base64url，拒绝其它形状避免无谓查询
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return undefined
  const row = db.prepare('SELECT * FROM admin_sessions WHERE token_hash = ?')
    .get(sha256(token)) as AdminSessionRow | undefined
  if (!row) return undefined

  const now = Date.now()
  if (row.expires_at <= now) {
    destroySession(db, row)
    return undefined
  }
  // 滑动续期：剩余不足一半时续满整个 TTL
  if (row.expires_at - now < config.adminSessionTtlMs / 2) {
    db.prepare('UPDATE admin_sessions SET expires_at = ?, last_seen_at = ? WHERE id = ?')
      .run(now + config.adminSessionTtlMs, now, row.id)
    row.expires_at = now + config.adminSessionTtlMs
  }
  else if (row.last_seen_at === null || now - row.last_seen_at > 60_000) {
    db.prepare('UPDATE admin_sessions SET last_seen_at = ? WHERE id = ?').run(now, row.id)
  }
  return row
}

export function requireAdmin(db: Db, config: AppConfig, req: FastifyRequest): AdminSessionRow {
  const session = lookupSession(db, config, req)
  if (!session) throw AppError.unauthorized('管理员会话无效或已过期')
  return session
}

// ---------- CSRF / Origin ----------

function originHost(req: FastifyRequest): string | undefined {
  // Origin 优先；缺省退回 Referer（部分客户端 POST 不带 Origin）
  const origin = req.headers.origin ?? req.headers.referer
  const str = Array.isArray(origin) ? origin[0] : origin
  if (!str) return undefined
  try {
    return new URL(str).host
  }
  catch {
    return '__invalid__'
  }
}

// 写操作的浏览器侧防护（SameSite=Strict 之外的纵深）：
// Origin/Referer 存在时必须与 Host 或 PUBLIC_BASE_URL 同源，跨站直接 403
export function verifyAdminOrigin(config: AppConfig, req: FastifyRequest): void {
  const host = originHost(req)
  if (host === undefined) return
  let baseHost: string | undefined
  try {
    baseHost = new URL(config.publicBaseUrl).host
  }
  catch { /* publicBaseUrl 不合法时忽略白名单项 */ }
  if (host !== req.headers.host && host !== baseHost) {
    throw AppError.forbidden('请求来源不被允许')
  }
}

// 会话内随机 CSRF 令牌必须经 X-CSRF-Token 头回传（等长比较）
export function verifyAdminCsrf(config: AppConfig, req: FastifyRequest, session: AdminSessionRow): void {
  verifyAdminOrigin(config, req)

  const header = req.headers['x-csrf-token']
  const token = Array.isArray(header) ? header[0] : header
  const a = Buffer.from(token ?? '')
  const b = Buffer.from(session.csrf_token)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw AppError.forbidden('CSRF 令牌无效或缺失')
  }
}

export function setAdminCookie(reply: FastifyReply, config: AppConfig, token: string): void {
  reply.header('set-cookie', sessionCookie(config, token))
}

export function clearAdminCookie(reply: FastifyReply, config: AppConfig): void {
  reply.header('set-cookie', clearSessionCookie(config))
}
