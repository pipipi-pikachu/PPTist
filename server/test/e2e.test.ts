import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { auth, createDoc, createUser, makeApp, slide, textElement, type TestContext } from './helpers'

// §九 M4 端到端：真实 Chromium 走无头导出页导出 PDF / PPTX / PNG
// 默认跳过；E2E=1 且 RENDER_BASE_URL 指向可达的 PPTist 前端（vite dev 或已构建的静态托管）时运行
const E2E = process.env.E2E === '1'
const RENDER_BASE_URL = process.env.RENDER_BASE_URL ?? 'http://127.0.0.1:5173'

describe.skipIf(!E2E)('e2e 导出（需要无头 Chromium + 可达前端）', () => {
  let ctx: TestContext
  let key = ''
  let docId = ''

  beforeAll(async () => {
    ctx = await makeApp({ EXPORT_SYNC_WAIT_MS: '55000', RENDER_BASE_URL })
    key = createUser(ctx, 'e2e').key
    const doc = await createDoc(ctx, key, {
      title: 'e2e 导出',
      slides: [slide('e1', [textElement('t1', '端到端导出测试')])],
    })
    docId = doc.docId
  }, 60_000)

  afterAll(async () => {
    await ctx.app.close()
  })

  it('PDF 导出成功', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${docId}/exports`,
      headers: auth(key),
      payload: { format: 'pdf' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json() as { status: string, url?: string }
    expect(body.status).toBe('done')
    const file = readFileSync(join(ctx.dir, 'exports', body.url!.split('/exports/')[1]))
    expect(file.subarray(0, 5).toString()).toBe('%PDF-')
  }, 90_000)

  it('PPTX 导出成功', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${docId}/exports`,
      headers: auth(key),
      payload: { format: 'pptx' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json() as { status: string, url?: string }
    expect(body.status).toBe('done')
    const file = readFileSync(join(ctx.dir, 'exports', body.url!.split('/exports/')[1]))
    expect(file.subarray(0, 2).toString()).toBe('PK')
  }, 90_000)

  it('单页 PNG 截图成功', async () => {
    const res = await ctx.app.inject({
      method: 'GET',
      url: `/api/docs/${docId}/slides/0.png?width=1000`,
      headers: auth(key),
    })
    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toBe('image/png')
    expect(res.rawPayload.subarray(0, 4)).toEqual(Buffer.from([0x89, 0x50, 0x4E, 0x47]))
  }, 90_000)
})
