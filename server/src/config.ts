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
  mcpRateLimitPerMin: number
  maxAssetBytes: number
  exportConcurrency: number
  exportSyncWaitMs: number
  adminInitialPassword: string | undefined
  adminSessionTtlMs: number
  adminLoginRatePerMin: number
  adminCookieSecure: boolean
  trustProxy: boolean
}

function intEnv(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name]
  if (raw === undefined || raw === '') return fallback
  const value = /^\d+$/.test(raw) ? Number(raw) : NaN
  if (!Number.isSafeInteger(value)) {
    throw new Error(`环境变量 ${name} 不是有效数字: ${raw}`)
  }
  return value
}

// 限流类配置必须为正整数：0/负数/非数字直接拒绝启动，避免意外禁用或绕过
function positiveIntEnv(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name]
  if (raw === undefined || raw === '') return fallback
  const value = /^\d+$/.test(raw) ? Number(raw) : NaN
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(`环境变量 ${name} 必须是正整数: ${raw}`)
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

function boolEnv(env: NodeJS.ProcessEnv, name: string): boolean {
  return env[name] === '1' || env[name] === 'true'
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const port = intEnv(env, 'PORT', 3100)
  const dataDir = resolve(env.DATA_DIR ?? './data')
  mkdirSync(dataDir, { recursive: true })
  const publicBaseUrl = env.PUBLIC_BASE_URL ?? 'http://localhost:5173'

  return {
    port,
    host: env.HOST ?? '0.0.0.0',
    dataDir,
    secret: loadOrCreateSecret(dataDir),
    publicBaseUrl,
    renderBaseUrl: env.RENDER_BASE_URL ?? `http://127.0.0.1:${port}`,
    // 生产模式下前端构建产物目录；目录里没有 index.html 就不启用静态托管（开发模式走 vite）
    staticDir: resolve(env.STATIC_DIR ?? './dist'),
    defaultQuotaDocs: intEnv(env, 'DEFAULT_QUOTA_DOCS', 100),
    defaultQuotaDocBytes: intEnv(env, 'DEFAULT_QUOTA_DOC_MB', 10) * 1024 * 1024,
    defaultQuotaExportsPerDay: intEnv(env, 'DEFAULT_QUOTA_EXPORTS_PER_DAY', 200),
    rateLimitPerMin: intEnv(env, 'RATE_LIMIT_PER_MIN', 120),
    mcpRateLimitPerMin: positiveIntEnv(env, 'MCP_RATE_LIMIT_PER_MIN', 60),
    maxAssetBytes: intEnv(env, 'MAX_ASSET_MB', 10) * 1024 * 1024,
    exportConcurrency: intEnv(env, 'EXPORT_CONCURRENCY', 2),
    exportSyncWaitMs: intEnv(env, 'EXPORT_SYNC_WAIT_MS', 45000),
    // 管理台：首次启动用 ADMIN_INITIAL_PASSWORD 初始化管理员密码（仅在库里还没有密码时生效；
    // 之后改密码用 pptist-admin passwd）。不要写进配置文件或默认值。
    adminInitialPassword: env.ADMIN_INITIAL_PASSWORD || undefined,
    adminSessionTtlMs: positiveIntEnv(env, 'ADMIN_SESSION_TTL_HOURS', 12) * 60 * 60 * 1000,
    adminLoginRatePerMin: positiveIntEnv(env, 'ADMIN_LOGIN_RATE_PER_MIN', 5),
    // HTTPS 部署下自动加 Secure；HTTP 反代/隧道等场景可用 ADMIN_SECURE_COOKIES=1 强制
    adminCookieSecure: boolEnv(env, 'ADMIN_SECURE_COOKIES') || publicBaseUrl.startsWith('https://'),
    // 位于可信反代（Caddy/nginx）之后时置 1，限流与审计按 X-Forwarded-For 取客户端 IP
    trustProxy: boolEnv(env, 'TRUST_PROXY'),
  }
}
