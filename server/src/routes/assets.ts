import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { fetchRemoteAsset } from '../assets/fetch'
import { dataUrlToAsset, saveAsset } from '../assets/store'
import { authenticateKey, resolveDocAccess } from '../auth'
import type { AppConfig } from '../config'
import type { AssetRow, Db } from '../db'
import { AppError } from '../errors'

interface AssetsRoutesDeps {
  db: Db
  config: AppConfig
}

async function saveFromBody(db: Db, config: AppConfig, req: FastifyRequest, ownerId: string) {
  const body = (req.body ?? {}) as { url?: string, data?: string }
  if (typeof body.data === 'string' && body.data) {
    const saved = dataUrlToAsset(db, config, ownerId, body.data)
    if (!saved) {
      // 允许不带 data: 前缀的纯 base64
      const buffer = Buffer.from(body.data.replace(/\s/g, ''), 'base64')
      return saveAsset(db, config, ownerId, buffer)
    }
    return saved
  }
  if (typeof body.url === 'string' && body.url) {
    const buffer = await fetchRemoteAsset(body.url, config)
    return saveAsset(db, config, ownerId, buffer)
  }
  throw AppError.validation('请求体需要 url 或 data（base64）')
}

export function assetsRoutes({ db, config }: AssetsRoutesDeps): FastifyPluginAsync {
  return app => {
    // Key：Agent 上传/转存图片
    app.post('/api/assets', req => {
      const { userId } = authenticateKey(db, req)
      return saveFromBody(db, config, req, userId)
    })

    // 编辑令牌：网页端上传图片，资产归属于文档所有者
    app.post('/api/docs/:id/assets', req => {
      const docId = (req.params as { id: string }).id
      const access = resolveDocAccess(db, config, req, docId)
      if (access.role !== 'edit') {
        if (access.role === 'view') throw AppError.forbidden('只读链接不能上传图片')
        throw AppError.notFound()
      }
      return saveFromBody(db, config, req, access.ownerId)
    })

    // 文件名不可猜，无需凭证；按库里记录的 mime 返回
    app.get('/assets/:file', (req, reply) => {
      const file = (req.params as { file: string }).file
      if (!/^[\w-]+\.[a-z0-9]+$/i.test(file)) throw AppError.notFound()
      const id = file.slice(0, file.lastIndexOf('.'))
      const row = db.prepare('SELECT * FROM assets WHERE id = ?').get(id) as AssetRow | undefined
      if (!row) throw AppError.notFound()
      const path = join(config.dataDir, 'assets', file)
      if (!existsSync(path)) throw AppError.notFound()
      reply
        .header('cache-control', 'public, max-age=31536000, immutable')
        .header('x-content-type-options', 'nosniff')
        .type(row.mime)
      return reply.send(readFileSync(path))
    })
    return Promise.resolve()
  }
}
