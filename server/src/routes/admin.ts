import type { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { nanoid } from 'nanoid'

import {
  clearAdminCookie,
  createSession,
  destroySession,
  hasAdminPassword,
  requireAdmin,
  setAdminCookie,
  verifyAdminCsrf,
  verifyAdminOrigin,
  verifyAdminPassword,
} from '../adminAuth'
import { createApiKey } from '../auth'
import type { AppConfig } from '../config'
import type { AdminSessionRow, ApiKeyRow, Db, UserRow } from '../db'
import { AppError } from '../errors'
import { FixedWindowRateLimiter } from '../mcp/rateLimit'

interface AdminRoutesDeps {
  db: Db
  config: AppConfig
}

const NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}_.-]{0,63}$/u
const MAX_NOTE_LEN = 200
const MAX_LABEL_LEN = 100
const MAX_REQUEST_ID_LEN = 64

const QUOTA_LIMITS = {
  docs: 1_000_000,
  docMb: 10_240,
  exportsPerDay: 1_000_000,
}

function userId(req: FastifyRequest): string {
  return (req.params as { id: string }).id
}

function strField(body: Record<string, unknown>, field: string, max: number, required = false): string | null {
  const v = body[field]
  if (v === undefined || v === null) {
    if (required) throw AppError.validation(`缺少字段 ${field}`)
    return null
  }
  if (typeof v !== 'string' || v.length > max) {
    throw AppError.validation(`${field} 需为不超过 ${max} 字的字符串`)
  }
  const trimmed = v.trim()
  if (required && !trimmed) throw AppError.validation(`缺少字段 ${field}`)
  return trimmed || null
}

// 配额项：undefined = 不修改；null = 恢复继承默认；非负整数 = 覆盖
function quotaField(body: Record<string, unknown>, field: string, cap: number): number | null | undefined {
  const v = body[field]
  if (v === undefined) return undefined
  if (v === null) return null
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > cap) {
    throw AppError.validation(`${field} 需为 0–${cap} 的整数，或 null 表示继承默认`)
  }
  return v
}

function requestId(body: Record<string, unknown>): string | null {
  const v = body.requestId
  if (v === undefined || v === null) return null
  if (typeof v !== 'string' || v.length > MAX_REQUEST_ID_LEN || !/^[A-Za-z0-9_-]+$/.test(v)) {
    throw AppError.validation('requestId 需为不超过 64 字符的字母数字串')
  }
  return v
}

function keyOut(row: ApiKeyRow) {
  // 绝不返回 hash / 完整 key
  return {
    id: row.id,
    label: row.label,
    prefix: row.prefix,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    revokedAt: row.revoked_at,
  }
}

function mustGetUser(db: Db, id: string): UserRow {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined
  if (!user) throw AppError.notFound('用户不存在')
  return user
}

export function adminRoutes({ db, config }: AdminRoutesDeps): FastifyPluginAsync {
  const loginLimiter = new FixedWindowRateLimiter(config.adminLoginRatePerMin, 60_000)

  const quotaOf = (user: UserRow) => ({
    docs: user.quota_docs ?? config.defaultQuotaDocs,
    docMb: Math.round((user.quota_doc_bytes ?? config.defaultQuotaDocBytes) / 1024 / 1024),
    exportsPerDay: user.quota_exports_per_day ?? config.defaultQuotaExportsPerDay,
  })

  const userOut = (row: {
    id: string, name: string, note: string | null, status: string, created_at: number,
    docs: number, active_keys: number, last_used: number | null,
    quota_docs: number | null, quota_doc_bytes: number | null, quota_exports_per_day: number | null,
    key_prefix: string | null,
  }) => {
    const user = row as unknown as UserRow
    return {
      id: row.id,
      name: row.name,
      note: row.note,
      status: row.status,
      createdAt: row.created_at,
      docs: row.docs,
      activeKeys: row.active_keys,
      lastUsedAt: row.last_used,
      keyPrefix: row.key_prefix,
      quota: quotaOf(user),
      quotaCustom: {
        docs: user.quota_docs,
        docMb: user.quota_doc_bytes === null ? null : Math.round(user.quota_doc_bytes / 1024 / 1024),
        exportsPerDay: user.quota_exports_per_day,
      },
    }
  }

  const USER_SELECT = `
    SELECT u.*,
      (SELECT COUNT(*) FROM documents d WHERE d.owner_id = u.id) AS docs,
      (SELECT COUNT(*) FROM api_keys k WHERE k.user_id = u.id AND k.revoked_at IS NULL) AS active_keys,
      (SELECT MAX(k.last_used_at) FROM api_keys k WHERE k.user_id = u.id) AS last_used,
      (SELECT k.prefix FROM api_keys k WHERE k.user_id = u.id AND k.revoked_at IS NULL
        ORDER BY k.last_used_at DESC LIMIT 1) AS key_prefix
    FROM users u`

  return app => {
    // 写操作统一防线：Origin/Referer 跨站核对（登录也在内）；登录之外还必须过会话 + CSRF 令牌
    app.addHook('preHandler', (req, _reply, done) => {
      if (req.method === 'GET' || req.method === 'HEAD') {
        done()
        return
      }
      const path = (req.raw.url ?? '').split('?')[0]
      if (path === '/api/admin/login') {
        try {
          verifyAdminOrigin(config, req)
          done()
        }
        catch (err) {
          done(err as Error)
        }
        return
      }
      try {
        const session = requireAdmin(db, config, req)
        verifyAdminCsrf(config, req, session)
        ;(req as FastifyRequest & { adminSession?: AdminSessionRow }).adminSession = session
        done()
      }
      catch (err) {
        done(err as Error)
      }
    })

    const sessionOf = (req: FastifyRequest): AdminSessionRow =>
      (req as FastifyRequest & { adminSession?: AdminSessionRow }).adminSession
      ?? requireAdmin(db, config, req)

    app.post('/api/admin/login', (req, reply) => {
      if (!loginLimiter.check('ip:' + req.ip)) {
        throw AppError.rateLimited('登录尝试过于频繁，请稍后重试')
      }
      if (!hasAdminPassword(db)) {
        throw AppError.unavailable('管理员密码未配置：请用 ADMIN_INITIAL_PASSWORD 环境变量首次启动，或 pptist-admin passwd 设置')
      }
      const body = (req.body ?? {}) as Record<string, unknown>
      const password = typeof body.password === 'string' ? body.password : ''
      // 统一「密码错误」，不区分未配置以外的任何情形，防止信息枚举
      if (!password || !verifyAdminPassword(db, password)) {
        throw AppError.unauthorized('密码错误')
      }
      const { token, csrfToken, expiresAt } = createSession(db, config, req)
      setAdminCookie(reply, config, token)
      return { ok: true, csrfToken, expiresAt }
    })

    app.post('/api/admin/logout', (req, reply) => {
      const session = sessionOf(req)
      destroySession(db, session)
      clearAdminCookie(reply, config)
      return { ok: true }
    })

    app.get('/api/admin/session', req => {
      const session = sessionOf(req)
      return { authenticated: true, csrfToken: session.csrf_token, expiresAt: session.expires_at }
    })

    app.get('/api/admin/overview', req => {
      sessionOf(req)
      const users = db.prepare(
        "SELECT COUNT(*) AS total, SUM(status = 'active') AS active FROM users"
      ).get() as { total: number, active: number | null }
      const keys = db.prepare(
        'SELECT COUNT(*) AS total, SUM(revoked_at IS NULL) AS active FROM api_keys'
      ).get() as { total: number, active: number | null }
      const docs = db.prepare('SELECT COUNT(*) AS n FROM documents').get() as { n: number }
      const midnight = new Date()
      midnight.setHours(0, 0, 0, 0)
      const exportsToday = db.prepare('SELECT COUNT(*) AS n FROM export_jobs WHERE created_at >= ?')
        .get(midnight.getTime()) as { n: number }
      return {
        users: { total: users.total, active: users.active ?? 0 },
        keys: { total: keys.total, active: keys.active ?? 0 },
        docs: docs.n,
        exportsToday: exportsToday.n,
      }
    })

    app.get('/api/admin/users', req => {
      sessionOf(req)
      const q = ((req.query as { q?: string }).q ?? '').trim().slice(0, 100)
      const status = (req.query as { status?: string }).status ?? 'all'
      const clauses: string[] = []
      const params: unknown[] = []
      if (q) {
        clauses.push('(u.name LIKE ? ESCAPE \'\\\' OR u.note LIKE ? ESCAPE \'\\\')')
        const like = `%${q.replace(/[\\%_]/g, c => '\\' + c)}%`
        params.push(like, like)
      }
      if (status === 'active' || status === 'disabled') {
        clauses.push('u.status = ?')
        params.push(status)
      }
      const rows = db.prepare(
        `${USER_SELECT}${clauses.length ? ' WHERE ' + clauses.join(' AND ') : ''} ORDER BY u.created_at LIMIT 500`
      ).all(...params)
      return { users: (rows as Parameters<typeof userOut>[0][]).map(userOut) }
    })

    app.post('/api/admin/users', req => {
      sessionOf(req)
      const body = (req.body ?? {}) as Record<string, unknown>
      const name = strField(body, 'name', 64, true)!
      if (!NAME_PATTERN.test(name)) {
        throw AppError.validation('用户名需以字母或数字开头，仅含字母、数字、_、.、-（最长 64 字符）')
      }
      const note = strField(body, 'note', MAX_NOTE_LEN)
      try {
        db.prepare('INSERT INTO users (id, name, note, status, created_at) VALUES (?, ?, ?, ?, ?)')
          .run(nanoid(12), name, note, 'active', Date.now())
      }
      catch (err) {
        if ((err as { code?: string }).code?.startsWith('SQLITE_CONSTRAINT')) {
          throw AppError.conflict('该用户名已存在')
        }
        throw err
      }
      const row = db.prepare(`${USER_SELECT} WHERE u.name = ?`).get(name) as Parameters<typeof userOut>[0]
      return { user: userOut(row) }
    })

    app.patch('/api/admin/users/:id', req => {
      sessionOf(req)
      const user = mustGetUser(db, userId(req))
      const body = (req.body ?? {}) as Record<string, unknown>
      const docs = quotaField(body, 'quotaDocs', QUOTA_LIMITS.docs)
      const docMb = quotaField(body, 'quotaDocMb', QUOTA_LIMITS.docMb)
      const exportsPerDay = quotaField(body, 'quotaExportsPerDay', QUOTA_LIMITS.exportsPerDay)
      if (docs === undefined && docMb === undefined && exportsPerDay === undefined) {
        throw AppError.validation('至少给出一个配额项（quotaDocs / quotaDocMb / quotaExportsPerDay）')
      }
      const write = db.transaction(() => {
        if (docs !== undefined) db.prepare('UPDATE users SET quota_docs = ? WHERE id = ?').run(docs, user.id)
        if (docMb !== undefined) {
          db.prepare('UPDATE users SET quota_doc_bytes = ? WHERE id = ?')
            .run(docMb === null ? null : docMb * 1024 * 1024, user.id)
        }
        if (exportsPerDay !== undefined) {
          db.prepare('UPDATE users SET quota_exports_per_day = ? WHERE id = ?').run(exportsPerDay, user.id)
        }
      })
      write()
      const row = db.prepare(`${USER_SELECT} WHERE u.id = ?`).get(user.id) as Parameters<typeof userOut>[0]
      return { user: userOut(row) }
    })

    app.post('/api/admin/users/:id/status', req => {
      sessionOf(req)
      const user = mustGetUser(db, userId(req))
      const body = (req.body ?? {}) as Record<string, unknown>
      const status = body.status
      if (status !== 'active' && status !== 'disabled') {
        throw AppError.validation('status 需为 active 或 disabled')
      }
      const already = user.status === status
      if (!already) db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, user.id)
      return { ok: true, status, already }
    })

    app.get('/api/admin/users/:id/keys', req => {
      sessionOf(req)
      const user = mustGetUser(db, userId(req))
      const rows = db.prepare('SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at')
        .all(user.id) as ApiKeyRow[]
      return { keys: rows.map(keyOut) }
    })

    app.post('/api/admin/users/:id/keys', req => {
      sessionOf(req)
      const user = mustGetUser(db, userId(req))
      if (user.status !== 'active') throw AppError.conflict('用户已停用，请先恢复后再创建 Key')
      const body = (req.body ?? {}) as Record<string, unknown>
      const label = strField(body, 'label', MAX_LABEL_LEN)
      const reqId = requestId(body)

      // 幂等：同一 requestId 直接返回已建记录（不再返回明文 Key）
      if (reqId) {
        const existing = db.prepare('SELECT * FROM api_keys WHERE request_id = ?').get(reqId) as ApiKeyRow | undefined
        if (existing) {
          if (existing.user_id !== user.id) throw AppError.conflict('requestId 已被使用')
          return { id: existing.id, prefix: existing.prefix, duplicated: true }
        }
      }
      try {
        const { id, key, prefix } = createApiKey(db, user.id, label ?? undefined, reqId ?? undefined)
        return { id, key, prefix, duplicated: false }
      }
      catch (err) {
        if (reqId && (err as { code?: string }).code?.startsWith('SQLITE_CONSTRAINT')) {
          const existing = db.prepare('SELECT * FROM api_keys WHERE request_id = ?').get(reqId) as ApiKeyRow | undefined
          if (existing) return { id: existing.id, prefix: existing.prefix, duplicated: true }
        }
        throw err
      }
    })

    app.post('/api/admin/keys/:id/revoke', req => {
      sessionOf(req)
      const keyId = userId(req)
      const result = db.prepare('UPDATE api_keys SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL')
        .run(Date.now(), keyId)
      if (!result.changes) {
        const exists = db.prepare('SELECT 1 FROM api_keys WHERE id = ?').get(keyId)
        if (!exists) throw AppError.notFound('Key 不存在')
        return { ok: true, alreadyRevoked: true }
      }
      return { ok: true, alreadyRevoked: false }
    })

    return Promise.resolve()
  }
}
