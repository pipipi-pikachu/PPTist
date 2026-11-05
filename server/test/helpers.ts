import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { nanoid } from 'nanoid'
import type { FastifyInstance } from 'fastify'

import { buildApp } from '../src/app'
import { createApiKey, signDocToken } from '../src/auth'
import { loadConfig, type AppConfig } from '../src/config'
import { openDb, type Db } from '../src/db'

export interface TestContext {
  app: FastifyInstance
  db: Db
  config: AppConfig
  dir: string
}

// 每个测试文件一个独立 DATA_DIR
export async function makeApp(env: Record<string, string> = {}): Promise<TestContext> {
  const dir = mkdtempSync(join(tmpdir(), 'pptist-test-'))
  const config = loadConfig({ DATA_DIR: dir, PUBLIC_BASE_URL: 'http://test.local', ...env } as NodeJS.ProcessEnv)
  const db = openDb(dir)
  const app = await buildApp(config, db, { logger: false })
  return { app, db, config, dir }
}

export function createUser(ctx: TestContext, name: string): { userId: string, keyId: string, key: string } {
  const userId = nanoid(12)
  ctx.db.prepare('INSERT INTO users (id, name, status, created_at) VALUES (?, ?, ?, ?)')
    .run(userId, name, 'active', Date.now())
  const { id, key } = createApiKey(ctx.db, userId)
  return { userId, keyId: id, key }
}

export function auth(key: string): { authorization: string } {
  return { authorization: `Bearer ${key}` }
}

export async function createDoc(ctx: TestContext, key: string, body: Record<string, unknown> = {}) {
  const res = await ctx.app.inject({
    method: 'POST',
    url: '/api/docs',
    headers: auth(key),
    payload: body,
  })
  if (res.statusCode !== 200) throw new Error(`createDoc 失败: ${res.statusCode} ${res.body}`)
  return res.json() as { docId: string, version: number, editUrl: string, viewUrl: string }
}

export function tokenFromUrl(url: string): string {
  return new URL(url).hash.slice(3) // '#t=...'
}

export function editTokenOf(ctx: TestContext, docId: string): string {
  const row = ctx.db.prepare('SELECT link_version FROM documents WHERE id = ?').get(docId) as { link_version: number }
  return signDocToken(ctx.config.secret, docId, row.link_version, 'edit')
}

export function viewTokenOf(ctx: TestContext, docId: string): string {
  const row = ctx.db.prepare('SELECT link_version FROM documents WHERE id = ?').get(docId) as { link_version: number }
  return signDocToken(ctx.config.secret, docId, row.link_version, 'view')
}

export function tokenHeader(token: string): { 'x-doc-token': string } {
  return { 'x-doc-token': token }
}

export function textElement(id: string, text: string, extra: Record<string, unknown> = {}) {
  return {
    type: 'text',
    id,
    left: 10,
    top: 10,
    width: 200,
    height: 50,
    rotate: 0,
    content: `<p>${text}</p>`,
    defaultFontName: '',
    defaultColor: '#000',
    ...extra,
  }
}

export function slide(id: string, elements: unknown[] = []) {
  return { id, elements }
}

// 1x1 PNG
export const PNG_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
