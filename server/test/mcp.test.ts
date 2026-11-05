import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

import { auth, createUser, makeApp, textElement, tokenFromUrl, type TestContext } from './helpers'

// §九 M2 测试 8：SDK Client + StreamableHTTPClientTransport 调 /mcp
// reply.hijack() 不能走 app.inject，工具流用真实监听端口；401/405 用 inject
const EXPECTED_TOOLS = [
  'get_authoring_guide',
  'create_presentation',
  'list_presentations',
  'get_presentation',
  'get_slide',
  'add_slides',
  'update_slide',
  'delete_slides',
  'move_slide',
  'add_elements',
  'update_elements',
  'delete_elements',
  'batch_edit',
  'set_theme',
  'get_changes',
  'list_comments',
  'add_comment',
  'reply_comment',
  'rotate_links',
  'delete_presentation',
  'upload_image',
  'render_slide',
  'export_presentation',
  'get_export',
]

let ctx: TestContext
let baseUrl = ''
let key = ''

async function connectClient(): Promise<Client> {
  const transport = new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`), {
    requestInit: { headers: { authorization: `Bearer ${key}` } },
  })
  const client = new Client({ name: 'mcp-test', version: '0.0.1' })
  await client.connect(transport)
  return client
}

function resultData(result: Awaited<ReturnType<Client['callTool']>>): Record<string, unknown> {
  const text = (result.content as { type: string, text: string }[])[0]?.text ?? ''
  return JSON.parse(text) as Record<string, unknown>
}

beforeAll(async () => {
  ctx = await makeApp()
  key = createUser(ctx, 'alice').key
  await ctx.app.listen({ port: 0, host: '127.0.0.1' })
  const address = ctx.app.server.address()
  if (typeof address !== 'object' || !address) throw new Error('监听地址不可用')
  baseUrl = `http://127.0.0.1:${address.port}`
})

afterAll(async () => {
  await ctx.app.close()
})

describe('MCP 端点 /mcp', () => {
  it('不带 Key 返回 401', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/mcp',
      payload: { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
    })
    expect(res.statusCode).toBe(401)
    expect(res.json().error).toBe('unauthorized')
  })

  it('GET / DELETE 返回 405', async () => {
    for (const method of ['GET', 'DELETE'] as const) {
      const res = await ctx.app.inject({ method, url: '/mcp', headers: auth(key) })
      expect(res.statusCode).toBe(405)
    }
  })

  it('listTools 包含本期全部工具', async () => {
    const client = await connectClient()
    try {
      const { tools } = await client.listTools()
      const names = tools.map(tool => tool.name)
      for (const name of EXPECTED_TOOLS) expect(names).toContain(name)
    }
    finally {
      await client.close()
    }
  })

  it('create_presentation → 用户编辑 → get_changes 跑通', async () => {
    const client = await connectClient()
    try {
      const created = resultData(await client.callTool({
        name: 'create_presentation',
        arguments: { title: 'MCP 测试文稿' },
      }))
      expect(created.docId).toBeTruthy()
      expect(created.version).toBe(1)
      expect(created.editUrl).toContain('#t=')

      const docId = created.docId as string

      // 错误路径：slideId 不存在 → isError + 可读的错误信息
      const failed = await client.callTool({
        name: 'add_elements',
        arguments: { docId, slideId: 'missing', elements: [textElement('x', 'x')] },
      })
      expect(failed.isError).toBe(true)
      expect((failed.content as { type: string, text: string }[])[0].text).toContain('missing')

      // 先建一页
      const addSlides = resultData(await client.callTool({
        name: 'add_slides',
        arguments: {
          docId,
          slides: [{ elements: [textElement('t1', '你好 MCP')] }],
        },
      }))
      expect(addSlides.version).toBe(2)

      // 大纲能看到新页
      const outline = resultData(await client.callTool({
        name: 'get_presentation',
        arguments: { docId },
      }))
      expect(outline.version).toBe(2)
      expect(outline.slideCount).toBe(1)

      // 模拟用户在网页端修改标题（编辑令牌 PUT）
      const { document: doc } = resultData(await client.callTool({
        name: 'get_presentation',
        arguments: { docId, view: 'full' },
      })) as { document: Record<string, unknown> }
      const editUrl = created.editUrl as string
      const put = await ctx.app.inject({
        method: 'PUT',
        url: `/api/docs/${docId}`,
        headers: { 'x-doc-token': tokenFromUrl(editUrl) },
        payload: { baseVersion: 2, doc: { ...doc, title: '用户改过的标题' } },
      })
      expect(put.statusCode).toBe(200)
      expect(put.json().version).toBe(3)

      const changes = resultData(await client.callTool({
        name: 'get_changes',
        arguments: { docId, sinceVersion: 2 },
      }))
      expect(changes.currentVersion).toBe(3)
      const revisions = changes.changes as { author: string, summary: string[] }[]
      expect(revisions).toHaveLength(1)
      expect(revisions[0].author).toBe('user')
      expect(revisions[0].summary.join('')).toContain('修改标题')
    }
    finally {
      await client.close()
    }
  })

  it('get_authoring_guide 返回目录和章节', async () => {
    const client = await connectClient()
    try {
      const toc = await client.callTool({ name: 'get_authoring_guide', arguments: {} })
      const tocText = (toc.content as { type: string, text: string }[])[0].text
      expect(tocText).toContain('example')
      expect(tocText).toContain('richtext')

      const section = await client.callTool({ name: 'get_authoring_guide', arguments: { section: 'text' } })
      const sectionText = (section.content as { type: string, text: string }[])[0].text
      expect(sectionText).toContain('文本元素')

      const bad = await client.callTool({ name: 'get_authoring_guide', arguments: { section: 'nope' } })
      expect(bad.isError).toBe(true)
    }
    finally {
      await client.close()
    }
  })
})
