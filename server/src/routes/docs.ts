import type { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { authenticateKey, docLinks, resolveDocAccess } from '../auth'
import type { AppConfig } from '../config'
import type { Db } from '../db'
import type { DocService } from '../docs/service'
import { AppError } from '../errors'
import { subscribe } from '../events'

interface DocsRoutesDeps {
  db: Db
  config: AppConfig
  service: DocService
}

function docId(req: FastifyRequest): string {
  return (req.params as { id: string }).id
}

export function docsRoutes({ db, config, service }: DocsRoutesDeps): FastifyPluginAsync {
  return app => {
    app.get('/api/docs', req => {
      const { userId } = authenticateKey(db, req)
      return service.listDocs(userId)
    })

    app.post('/api/docs', req => {
      const { userId, keyId } = authenticateKey(db, req)
      const body = (req.body ?? {}) as { title?: string, theme?: never, viewportRatio?: number, slides?: unknown }
      return service.createDoc(userId, body, 'agent', keyId)
    })

    app.delete('/api/docs/:id', req => {
      const access = resolveDocAccess(db, config, req, docId(req))
      if (access.role !== 'owner') throw AppError.notFound()
      service.deleteDoc(docId(req))
      return { ok: true }
    })

    app.post('/api/docs/:id/links/rotate', req => {
      const access = resolveDocAccess(db, config, req, docId(req))
      if (access.role !== 'owner') throw AppError.notFound()
      return service.rotateLinks(docId(req))
    })

    app.post('/api/docs/:id/ops', req => {
      const access = resolveDocAccess(db, config, req, docId(req))
      if (access.role !== 'owner') throw AppError.notFound()
      const body = req.body as { ops?: unknown, baseVersion?: number }
      if (!body || !Array.isArray(body.ops) || !body.ops.length) {
        throw AppError.validation('请求体缺少非空数组 ops')
      }
      return service.applyAgentOps(access, docId(req), body.ops as never[], body.baseVersion)
    })

    app.post('/api/docs/:id/patch', req => {
      const access = resolveDocAccess(db, config, req, docId(req))
      if (access.role !== 'owner') throw AppError.notFound()
      const body = req.body as { baseVersion?: number, ops?: unknown }
      if (!body || typeof body.baseVersion !== 'number' || !Array.isArray(body.ops)) {
        throw AppError.validation('请求体需要 baseVersion 和 ops（RFC6902 数组）')
      }
      return service.applyJsonPatch(access, docId(req), body.baseVersion, body.ops)
    })

    app.get('/api/docs/:id', req => {
      const access = resolveDocAccess(db, config, req, docId(req))
      const { row, data } = service.getDoc(docId(req))
      const links = docLinks(config, row)
      return {
        id: row.id,
        version: row.version,
        role: access.role,
        title: data.title,
        theme: data.theme,
        viewportSize: data.viewportSize,
        viewportRatio: data.viewportRatio,
        slides: data.slides,
        ...(access.role === 'owner' ? { editUrl: links.editUrl } : {}),
        ...(access.role !== 'view' ? { viewUrl: links.viewUrl } : {}),
      }
    })

    app.put('/api/docs/:id', req => {
      const access = resolveDocAccess(db, config, req, docId(req))
      if (access.role !== 'edit') {
        if (access.role === 'view') throw AppError.forbidden('只读链接不能修改文档')
        throw AppError.notFound()
      }
      const body = req.body as { baseVersion?: number, doc?: unknown }
      if (!body || typeof body.baseVersion !== 'number' || body.doc === undefined) {
        throw AppError.validation('请求体需要 baseVersion 和 doc')
      }
      const result = service.putDoc(access, docId(req), body.baseVersion, body.doc)
      return { version: result.version, merged: result.merged, normalized: result.normalized }
    })

    app.get('/api/docs/:id/revisions', req => {
      resolveDocAccess(db, config, req, docId(req))
      const since = Number((req.query as { since?: string }).since ?? 0) || 0
      return service.listRevisions(docId(req), since)
    })

    app.get('/api/docs/:id/events', (req, reply) => {
      resolveDocAccess(db, config, req, docId(req))
      reply.hijack()
      subscribe(docId(req), reply.raw)
    })
    return Promise.resolve()
  }
}
