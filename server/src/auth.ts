import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type { FastifyRequest } from 'fastify'
import { nanoid } from 'nanoid'

import type { AppConfig } from './config'
import type { ApiKeyRow, Db, DocumentRow, UserRow } from './db'
import { AppError } from './errors'

export type DocRole = 'owner' | 'edit' | 'view'
export type Author = 'agent' | 'user'

export interface DocAccess {
  ownerId: string
  role: DocRole
  author: Author
  keyId?: string
  linkVersion: number
}

export function generateKey(): { key: string, prefix: string, hash: string } {
  const key = 'pk_' + randomBytes(24).toString('base64url')
  return { key, prefix: key.slice(0, 10), hash: hashKey(key) }
}

export function hashKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

// 创建 Key 并入库，明文 Key 只在这里返回一次。
// requestId：调用方幂等令牌（管理台防重试重复创建），有值时受唯一索引约束
export function createApiKey(db: Db, userId: string, label?: string, requestId?: string): { id: string, key: string, prefix: string } {
  const { key, prefix, hash } = generateKey()
  const id = nanoid(12)
  db.prepare(
    'INSERT INTO api_keys (id, user_id, label, prefix, hash, request_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, userId, label ?? null, prefix, hash, requestId ?? null, Date.now())
  return { id, key, prefix }
}

function bearerToken(req: FastifyRequest): string | undefined {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return undefined
  return header.slice(7).trim() || undefined
}

// Bearer Key 鉴权：Key 不存在/已吊销/用户已停用 → 401
export function authenticateKey(db: Db, req: FastifyRequest): { userId: string, keyId: string } {
  const token = bearerToken(req)
  if (!token) throw AppError.unauthorized('缺少 Authorization: Bearer <Key>')

  const row = db.prepare('SELECT * FROM api_keys WHERE hash = ?').get(hashKey(token)) as ApiKeyRow | undefined
  if (!row || row.revoked_at !== null) throw AppError.unauthorized()

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(row.user_id) as UserRow | undefined
  if (!user || user.status !== 'active') throw AppError.unauthorized('账号已停用')

  // last_used_at 最多每分钟更新一次
  const now = Date.now()
  if (row.last_used_at === null || now - row.last_used_at > 60_000) {
    db.prepare('UPDATE api_keys SET last_used_at = ? WHERE id = ?').run(now, row.id)
  }
  return { userId: row.user_id, keyId: row.id }
}

export function signDocToken(secret: Buffer, docId: string, linkVersion: number, kind: 'edit' | 'view'): string {
  return createHmac('sha256', secret)
    .update(`${docId}:${linkVersion}:${kind}`)
    .digest('base64url')
    .slice(0, 32)
}

function verifyDocToken(secret: Buffer, docId: string, linkVersion: number, token: string): 'edit' | 'view' | undefined {
  for (const kind of ['edit', 'view'] as const) {
    const expected = signDocToken(secret, docId, linkVersion, kind)
    const a = Buffer.from(token)
    const b = Buffer.from(expected)
    if (a.length === b.length && timingSafeEqual(a, b)) return kind
  }
  return undefined
}

export function docLinks(config: AppConfig, doc: DocumentRow): { editUrl: string, viewUrl: string } {
  const base = config.publicBaseUrl
  return {
    editUrl: `${base}/?doc=${doc.id}#t=${signDocToken(config.secret, doc.id, doc.link_version, 'edit')}`,
    viewUrl: `${base}/?doc=${doc.id}&mode=view#t=${signDocToken(config.secret, doc.id, doc.link_version, 'view')}`,
  }
}

// 统一入口：Key → owner 角色（作者 agent）；X-Doc-Token → edit/view 角色（作者 user）
// 文档不存在或不属于该 Key 一律 404
export function resolveDocAccess(db: Db, config: AppConfig, req: FastifyRequest, docId: string): DocAccess {
  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId) as DocumentRow | undefined
  if (!doc) throw AppError.notFound()

  if (bearerToken(req)) {
    const { userId, keyId } = authenticateKey(db, req)
    if (doc.owner_id !== userId) throw AppError.notFound()
    return { ownerId: doc.owner_id, role: 'owner', author: 'agent', keyId, linkVersion: doc.link_version }
  }

  const token = req.headers['x-doc-token']
  const tokenStr = Array.isArray(token) ? token[0] : token
  if (tokenStr) {
    const owner = db.prepare('SELECT status FROM users WHERE id = ?').get(doc.owner_id) as { status: string } | undefined
    if (!owner || owner.status !== 'active') throw AppError.unauthorized('文档链接已失效')
    const kind = verifyDocToken(config.secret, doc.id, doc.link_version, tokenStr)
    if (!kind) throw AppError.unauthorized('文档令牌无效或已失效')
    return { ownerId: doc.owner_id, role: kind, author: 'user', linkVersion: doc.link_version }
  }

  throw AppError.unauthorized('缺少访问凭证')
}

// 限流计数键：优先凭证哈希，没有凭证按 IP
export function rateLimitKey(req: FastifyRequest): string {
  const bearer = bearerToken(req)
  const docToken = req.headers['x-doc-token']
  const tokenStr = Array.isArray(docToken) ? docToken[0] : docToken
  const credential = bearer ?? tokenStr
  if (credential) return 'cred:' + createHash('sha256').update(credential).digest('hex')
  return 'ip:' + req.ip
}
