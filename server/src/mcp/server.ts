import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import type { FastifyPluginAsync } from 'fastify'

import { authenticateKey } from '../auth'
import type { AppConfig } from '../config'
import type { Db } from '../db'
import type { DocService } from '../docs/service'
import type { RenderQueue } from '../render/queue'
import { buildMcpServer } from './tools'

interface McpRoutesDeps {
  db: Db
  config: AppConfig
  service: DocService
  queue: RenderQueue
}

// 远程 MCP 端点：无状态模式，每个 POST 先按 Bearer Key 鉴权，再新建 server + transport 处理
export function mcpRoutes({ db, config, service, queue }: McpRoutesDeps): FastifyPluginAsync {
  return app => {
    for (const method of ['GET', 'DELETE'] as const) {
      app.route({
        method,
        url: '/mcp',
        handler: (_req, reply) => {
          reply.status(405).send({ error: 'method_not_allowed', message: '/mcp 仅支持 POST（无状态 Streamable HTTP）' })
        },
      })
    }

    app.post('/mcp', async (req, reply) => {
      const { userId, keyId } = authenticateKey(db, req)
      reply.hijack()

      const mcpServer = buildMcpServer({ db, config, service, queue, ownerId: userId, keyId })
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
      reply.raw.on('close', () => {
        void transport.close()
        void mcpServer.close()
      })
      await mcpServer.connect(transport)
      // Fastify 已解析好 JSON body，直接交给 transport
      await transport.handleRequest(req.raw, reply.raw, req.body)
    })
    return Promise.resolve()
  }
}
