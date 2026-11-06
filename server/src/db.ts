import Database from 'better-sqlite3'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

export type Db = Database.Database

export interface UserRow {
  id: string
  name: string
  note: string | null
  status: 'active' | 'disabled'
  quota_docs: number | null
  quota_doc_bytes: number | null
  quota_exports_per_day: number | null
  created_at: number
}

export interface ApiKeyRow {
  id: string
  user_id: string
  label: string | null
  prefix: string
  hash: string
  request_id: string | null
  created_at: number
  last_used_at: number | null
  revoked_at: number | null
}

export interface AdminSessionRow {
  id: string
  token_hash: string
  csrf_token: string
  created_at: number
  expires_at: number
  last_seen_at: number | null
  ip: string | null
  user_agent: string | null
}

export interface DocumentRow {
  id: string
  owner_id: string
  title: string
  data: string
  version: number
  size: number
  link_version: number
  created_at: number
  updated_at: number
}

export interface RevisionRow {
  doc_id: string
  version: number
  author: string
  key_id: string | null
  summary: string
  snapshot: Buffer | null
  created_at: number
}

export interface AssetRow {
  id: string
  owner_id: string
  mime: string
  size: number
  sha256: string
  created_at: number
}

export type ExportJobStatus = 'pending' | 'running' | 'done' | 'failed'

export interface ExportJobRow {
  id: string
  owner_id: string
  doc_id: string
  version: number
  format: string
  status: ExportJobStatus
  file: string | null
  error: string | null
  created_at: number
  finished_at: number | null
}

// user_version 顺序迁移；新增表结构时追加下一段并把版本号 +1
const MIGRATIONS: string[] = [
  // v1：多用户、Key、文档、修订、资产
  `
  CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, note TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    quota_docs INTEGER, quota_doc_bytes INTEGER, quota_exports_per_day INTEGER,
    created_at INTEGER NOT NULL);
  CREATE TABLE api_keys (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
    label TEXT, prefix TEXT NOT NULL, hash TEXT UNIQUE NOT NULL,
    created_at INTEGER NOT NULL, last_used_at INTEGER, revoked_at INTEGER);
  CREATE TABLE documents (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL, data TEXT NOT NULL,
    version INTEGER NOT NULL, size INTEGER NOT NULL, link_version INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
  CREATE INDEX documents_owner ON documents(owner_id, updated_at);
  CREATE TABLE revisions (doc_id TEXT NOT NULL, version INTEGER NOT NULL,
    author TEXT NOT NULL,
    key_id TEXT, summary TEXT NOT NULL,
    snapshot BLOB,
    created_at INTEGER NOT NULL, PRIMARY KEY (doc_id, version));
  CREATE TABLE assets (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, mime TEXT NOT NULL,
    size INTEGER NOT NULL, sha256 TEXT NOT NULL, created_at INTEGER NOT NULL,
    UNIQUE (owner_id, sha256));
  `,
  // v2：导出任务
  `
  CREATE TABLE export_jobs (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, doc_id TEXT NOT NULL,
    version INTEGER NOT NULL, format TEXT NOT NULL, status TEXT NOT NULL,
    file TEXT, error TEXT, created_at INTEGER NOT NULL, finished_at INTEGER);
  CREATE INDEX export_jobs_owner ON export_jobs(owner_id, created_at);
  `,
  // v3：管理台——管理员会话、管理员元数据（密码散列等）、Key 幂等创建
  `
  ALTER TABLE api_keys ADD COLUMN request_id TEXT;
  CREATE UNIQUE INDEX api_keys_request_id ON api_keys(request_id) WHERE request_id IS NOT NULL;
  CREATE TABLE admin_sessions (id TEXT PRIMARY KEY, token_hash TEXT UNIQUE NOT NULL,
    csrf_token TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL,
    last_seen_at INTEGER, ip TEXT, user_agent TEXT);
  CREATE INDEX admin_sessions_expiry ON admin_sessions(expires_at);
  CREATE TABLE admin_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  `,
]

export function openDb(dataDir: string): Db {
  mkdirSync(dataDir, { recursive: true })
  const db = new Database(resolve(dataDir, 'app.db'))
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  const current = db.pragma('user_version', { simple: true }) as number
  if (current < MIGRATIONS.length) {
    const migrate = db.transaction(() => {
      for (let version = current; version < MIGRATIONS.length; version++) {
        db.exec(MIGRATIONS[version])
      }
      db.pragma(`user_version = ${MIGRATIONS.length}`)
    })
    migrate()
  }
  return db
}
