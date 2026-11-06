#!/usr/bin/env node
/* eslint-disable no-console */
import { parseArgs } from 'node:util'
import { nanoid } from 'nanoid'

import { ADMIN_PASSWORD_MIN_LEN, setAdminPassword } from './adminAuth'
import { createApiKey } from './auth'
import { loadConfig } from './config'
import { openDb, type ApiKeyRow, type Db, type UserRow } from './db'

const USAGE = `用法：
  pptist-admin user create <name> [--note 备注]
  pptist-admin user list
  pptist-admin user disable|enable <name>
  pptist-admin key create <name> [--label 标签]
  pptist-admin key list <name>
  pptist-admin key revoke <keyId>
  pptist-admin quota set <name> [--docs N] [--doc-mb N] [--exports-per-day N]
  pptist-admin passwd
  pptist-admin backup <目标文件>`

function fail(message: string): never {
  console.error(`错误：${message}`)
  process.exit(1)
}

function getUser(db: Db, name: string): UserRow {
  const user = db.prepare('SELECT * FROM users WHERE name = ?').get(name) as UserRow | undefined
  if (!user) fail(`用户 ${name} 不存在`)
  return user
}

function formatTime(ms: number | null): string {
  return ms === null ? '-' : new Date(ms).toISOString()
}

function userCreate(db: Db, args: string[]): void {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: { note: { type: 'string' } },
  })
  const name = positionals[0]
  if (!name) fail('缺少用户名')
  const exists = db.prepare('SELECT id FROM users WHERE name = ?').get(name)
  if (exists) fail(`用户 ${name} 已存在`)

  const userId = nanoid(12)
  db.prepare('INSERT INTO users (id, name, note, status, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(userId, name, values.note ?? null, 'active', Date.now())
  const { id, key, prefix } = createApiKey(db, userId)
  console.log(`已创建用户 ${name}`)
  console.log(`Key（只显示这一次，丢失只能吊销重发）：${key}`)
  console.log(`Key ID：${id}，前缀：${prefix}`)
}

function userList(db: Db): void {
  const rows = db.prepare(`
    SELECT u.id, u.name, u.status, u.note,
      (SELECT COUNT(*) FROM documents d WHERE d.owner_id = u.id) AS docs,
      (SELECT COUNT(*) FROM api_keys k WHERE k.user_id = u.id AND k.revoked_at IS NULL) AS keys,
      (SELECT MAX(k.last_used_at) FROM api_keys k WHERE k.user_id = u.id) AS last_used
    FROM users u ORDER BY u.created_at`
  ).all() as { name: string, status: string, note: string | null, docs: number, keys: number, last_used: number | null }[]
  if (!rows.length) {
    console.log('暂无用户')
    return
  }
  for (const row of rows) {
    console.log(`${row.name}\t${row.status}\t文档 ${row.docs}\tKey ${row.keys}\t最近使用 ${formatTime(row.last_used)}\t${row.note ?? ''}`)
  }
}

function userSetStatus(db: Db, name: string, status: 'active' | 'disabled'): void {
  const user = getUser(db, name)
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, user.id)
  console.log(`用户 ${name} 已${status === 'active' ? '启用' : '停用'}，其所有 Key 和文档链接${status === 'active' ? '恢复' : '立即失效'}`)
}

function keyCreate(db: Db, args: string[]): void {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: { label: { type: 'string' } },
  })
  const name = positionals[0]
  if (!name) fail('缺少用户名')
  const user = getUser(db, name)
  const { id, key, prefix } = createApiKey(db, user.id, values.label)
  console.log(`已为用户 ${name} 创建 Key（只显示这一次）：${key}`)
  console.log(`Key ID：${id}，前缀：${prefix}，标签：${values.label ?? '-'}`)
}

function keyList(db: Db, args: string[]): void {
  const { positionals } = parseArgs({ args, allowPositionals: true })
  const name = positionals[0]
  if (!name) fail('缺少用户名')
  const user = getUser(db, name)
  const rows = db.prepare('SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at').all(user.id) as ApiKeyRow[]
  if (!rows.length) {
    console.log('暂无 Key')
    return
  }
  for (const row of rows) {
    const state = row.revoked_at !== null ? `已吊销(${formatTime(row.revoked_at)})` : '有效'
    console.log(`${row.id}\t${row.prefix}…\t${state}\t标签 ${row.label ?? '-'}\t创建 ${formatTime(row.created_at)}\t最近使用 ${formatTime(row.last_used_at)}`)
  }
}

function keyRevoke(db: Db, args: string[]): void {
  const { positionals } = parseArgs({ args, allowPositionals: true })
  const keyId = positionals[0]
  if (!keyId) fail('缺少 keyId')
  const result = db.prepare('UPDATE api_keys SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL')
    .run(Date.now(), keyId)
  if (!result.changes) fail(`Key ${keyId} 不存在或已吊销`)
  console.log(`Key ${keyId} 已吊销`)
}

function quotaSet(db: Db, args: string[]): void {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      'docs': { type: 'string' },
      'doc-mb': { type: 'string' },
      'exports-per-day': { type: 'string' },
    },
  })
  const name = positionals[0]
  if (!name) fail('缺少用户名')
  const user = getUser(db, name)

  const num = (v: string | undefined, label: string): number | null => {
    if (v === undefined) return null
    const n = Number(v)
    if (!Number.isFinite(n) || n < 0) fail(`${label} 不是有效数字: ${v}`)
    return n
  }
  const docs = num(values.docs, '--docs')
  const docMb = num(values['doc-mb'], '--doc-mb')
  const exportsPerDay = num(values['exports-per-day'], '--exports-per-day')
  if (docs === null && docMb === null && exportsPerDay === null) fail('至少给出一个配额项')

  if (docs !== null) db.prepare('UPDATE users SET quota_docs = ? WHERE id = ?').run(docs, user.id)
  if (docMb !== null) db.prepare('UPDATE users SET quota_doc_bytes = ? WHERE id = ?').run(docMb * 1024 * 1024, user.id)
  if (exportsPerDay !== null) db.prepare('UPDATE users SET quota_exports_per_day = ? WHERE id = ?').run(exportsPerDay, user.id)
  console.log(`已更新用户 ${name} 的配额`)
}

// 新密码来源：ADMIN_NEW_PASSWORD 环境变量 > 管道 stdin > TTY 不回显输入
async function readNewPassword(): Promise<string> {
  if (process.env.ADMIN_NEW_PASSWORD) return process.env.ADMIN_NEW_PASSWORD

  if (!process.stdin.isTTY) {
    const chunks: Buffer[] = []
    for await (const chunk of process.stdin) chunks.push(chunk as Buffer)
    return Buffer.concat(chunks).toString('utf8').split('\n')[0].trim()
  }

  return await new Promise<string>((resolve, reject) => {
    process.stdout.write(`新管理员密码（至少 ${ADMIN_PASSWORD_MIN_LEN} 字符，输入不回显）：`)
    const stdin = process.stdin
    stdin.setRawMode(true)
    stdin.resume()
    let raw = Buffer.alloc(0)
    const finish = (err?: Error, value?: string) => {
      stdin.setRawMode(false)
      stdin.pause()
      stdin.off('data', onData)
      process.stdout.write('\n')
      if (err) reject(err)
      else resolve(value!)
    }
    const onData = (chunk: Buffer) => {
      if (chunk.includes(3)) return finish(new Error('已取消'))
      const nl = chunk.findIndex(b => b === 13 || b === 10)
      if (nl >= 0) {
        raw = Buffer.concat([raw, chunk.subarray(0, nl)])
        return finish(undefined, raw.toString('utf8'))
      }
      // 退格：删掉最后一个 UTF-8 字符（近似处理，丢弃残缺的结尾字节）
      if (chunk.includes(127) || chunk.includes(8)) {
        const text = (raw.toString('utf8') + chunk.toString('utf8').replace(/\p{Cc}/gu, '')).slice(0, -1)
        raw = Buffer.from(text, 'utf8')
        return
      }
      raw = Buffer.concat([raw, chunk])
    }
    stdin.on('data', onData)
  })
}

async function passwd(db: Db): Promise<void> {
  const password = await readNewPassword()
  setAdminPassword(db, password)
  console.log('管理员密码已更新，旧的登录会话不受影响（可要求重新登录验证）')
}

async function main(): Promise<void> {
  const [resource, action, ...rest] = process.argv.slice(2)
  // backup 只有一个参数（目标文件），passwd 无参数，其余命令都是 <resource> <action> [...args]
  if (!resource || (resource !== 'backup' && resource !== 'passwd' && !action)) {
    console.log(USAGE)
    process.exit(resource ? 1 : 0)
  }

  const config = loadConfig()
  const db = openDb(config.dataDir)
  try {
    if (resource === 'user' && action === 'create') userCreate(db, rest)
    else if (resource === 'user' && action === 'list') userList(db)
    else if (resource === 'user' && action === 'disable') userSetStatus(db, rest[0] ?? fail('缺少用户名'), 'disabled')
    else if (resource === 'user' && action === 'enable') userSetStatus(db, rest[0] ?? fail('缺少用户名'), 'active')
    else if (resource === 'key' && action === 'create') keyCreate(db, rest)
    else if (resource === 'key' && action === 'list') keyList(db, rest)
    else if (resource === 'key' && action === 'revoke') keyRevoke(db, rest)
    else if (resource === 'quota' && action === 'set') quotaSet(db, rest)
    else if (resource === 'passwd') {
      if (action) fail('passwd 不接受参数（新密码从 ADMIN_NEW_PASSWORD 环境变量、stdin 或交互输入读取）')
      await passwd(db)
    }
    else if (resource === 'backup') {
      const target = action ?? fail('缺少目标文件路径')
      if (rest.length) fail('backup 只接受一个目标文件参数')
      await db.backup(target)
      console.log(`已备份数据库到 ${target}`)
    }
    else {
      console.log(USAGE)
      process.exit(1)
    }
  }
  finally {
    db.close()
  }
}

main().catch(err => {
  console.error(`错误：${err instanceof Error ? err.message : err}`)
  process.exit(1)
})
