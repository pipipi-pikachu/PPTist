import { randomBytes } from 'node:crypto'
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export interface AppConfig {
  port: number
  host: string
  dataDir: string
  secret: Buffer
  publicBaseUrl: string
  renderBaseUrl: string
  staticDir: string
  defaultQuotaDocs: number
  defaultQuotaDocBytes: number
  defaultQuotaExportsPerDay: number
  rateLimitPerMin: number
  maxAssetBytes: number
  exportConcurrency: number
  exportSyncWaitMs: number
}

function intEnv(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name]
  if (raw === undefined || raw === '') return fallback
  const value = Number.parseInt(raw, 10)
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`环境变量 ${name} 不是有效数字: ${raw}`)
  }
  return value
}

function loadOrCreateSecret(dataDir: string): Buffer {
  const secretPath = resolve(dataDir, 'secret')
  if (existsSync(secretPath)) return readFileSync(secretPath)

  const secret = randomBytes(32)
  try {
    writeFileSync(secretPath, secret, { flag: 'wx', mode: 0o600 })
    chmodSync(secretPath, 0o600)
    return secret
  }
  catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'EEXIST') return readFileSync(secretPath)
    throw err
  }
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const port = intEnv(env, 'PORT', 3100)
  const dataDir = resolve(env.DATA_DIR ?? './data')
  mkdirSync(dataDir, { recursive: true })

  return {
    port,
    host: env.HOST ?? '0.0.0.0',
    dataDir,
    secret: loadOrCreateSecret(dataDir),
    publicBaseUrl: env.PUBLIC_BASE_URL ?? 'http://localhost:5173',
    renderBaseUrl: env.RENDER_BASE_URL ?? `http://127.0.0.1:${port}`,
    // 生产模式下前端构建产物目录；目录里没有 index.html 就不启用静态托管（开发模式走 vite）
    staticDir: resolve(env.STATIC_DIR ?? './dist'),
    defaultQuotaDocs: intEnv(env, 'DEFAULT_QUOTA_DOCS', 100),
    defaultQuotaDocBytes: intEnv(env, 'DEFAULT_QUOTA_DOC_MB', 10) * 1024 * 1024,
    defaultQuotaExportsPerDay: intEnv(env, 'DEFAULT_QUOTA_EXPORTS_PER_DAY', 200),
    rateLimitPerMin: intEnv(env, 'RATE_LIMIT_PER_MIN', 120),
    maxAssetBytes: intEnv(env, 'MAX_ASSET_MB', 10) * 1024 * 1024,
    exportConcurrency: intEnv(env, 'EXPORT_CONCURRENCY', 2),
    exportSyncWaitMs: intEnv(env, 'EXPORT_SYNC_WAIT_MS', 45000),
  }
}
