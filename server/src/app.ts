import { existsSync } from 'node:fs'
import { join } from 'node:path'

import Fastify, { type FastifyError, type FastifyInstance } from 'fastify'
import rateLimit from '@fastify/rate-limit'
import fastifyStatic from '@fastify/static'

import { rateLimitKey } from './auth'
import type { AppConfig } from './config'
import { openDb, type Db } from './db'
import { createDocService } from './docs/service'
import { AppError } from './errors'
import { mcpRoutes } from './mcp/server'
import { closeBrowser } from './render/browser'
import { RenderQueue } from './render/queue'
import { assetsRoutes } from './routes/assets'
import { docsRoutes } from './routes/docs'
import { exportsRoutes } from './routes/exports'

export async function buildApp(config: AppConfig, db?: Db, opts?: { logger?: boolean }): Promise<FastifyInstance> {
  // 测试时可直接传入已打开的 db；否则按 DATA_DIR 打开并随 app 关闭
  const ownDb = db ?? openDb(config.dataDir)
  const service = createDocService({ db: ownDb, config })
  const renderQueue = new RenderQueue(config.exportConcurrency)

  const app = Fastify({
    logger: opts?.logger ?? true,
    bodyLimit: 12 * 1024 * 1024,
  })
  app.addHook('onClose', (instance, done) => {
    if (!db) ownDb.close()
    void closeBrowser().then(() => done())
  })

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error instanceof AppError) {
      reply.status(error.status).send({
        error: error.code,
        message: error.message,
        ...(error.issues !== undefined ? { issues: error.issues } : {}),
      })
      return
    }
    const statusCode = error.statusCode ?? 500
    if (statusCode >= 500) request.log.error(error)
    const code = statusCode === 429
      ? 'rate_limited'
      : statusCode === 400 ? 'validation'
        : statusCode >= 500 ? 'internal_error' : 'bad_request'
    reply.status(statusCode).send({
      error: code,
      message: statusCode >= 500 ? '服务器内部错误' : error.message,
    })
  })

  await app.register(rateLimit, {
    max: config.rateLimitPerMin,
    timeWindow: '1 minute',
    keyGenerator: rateLimitKey,
  })

  app.get('/api/health', () => ({ ok: true }))

  await app.register(docsRoutes({ db: ownDb, config, service }))
  await app.register(assetsRoutes({ db: ownDb, config }))
  await app.register(exportsRoutes({ db: ownDb, config, queue: renderQueue }))
  await app.register(mcpRoutes({ db: ownDb, config, service, queue: renderQueue }))

  // 生产模式：托管前端构建产物。只认包含 index.html 的目录，
  // 开发模式（server 目录下 ./dist 是 esbuild 产物，没有 index.html）自动跳过
  if (existsSync(join(config.staticDir, 'index.html'))) {
    await app.register(fastifyStatic, { root: config.staticDir })

    // SPA fallback：GET 且不属于 API / MCP / 资产 / 导出路径时回退 index.html；
    // 这些保留路径走不到这里时（无匹配路由）仍返回 JSON 404
    app.setNotFoundHandler((req, reply) => {
      const path = (req.raw.url ?? '/').split('?')[0]
      const reserved = path === '/api' || path.startsWith('/api/')
        || path === '/mcp' || path.startsWith('/mcp/')
        || path.startsWith('/assets/') || path.startsWith('/exports/')
      if (req.method === 'GET' && !reserved) {
        return reply.sendFile('index.html')
      }
      reply.status(404).send({ error: 'not_found', message: '资源不存在' })
    })
  }

  return app
}
