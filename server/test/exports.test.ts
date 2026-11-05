import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { auth, createDoc, createUser, editTokenOf, makeApp, slide, textElement, tokenHeader, viewTokenOf, type TestContext } from './helpers'
import { guardDecision } from '../src/render/browser'

// §九 M4 单测：导出路由、配额、SSRF 闸门、/exports 下载、JSON 导出全链路（json 不走浏览器）
let ctx: TestContext
let alice: { userId: string, keyId: string, key: string }
let docId = ''

beforeAll(async () => {
  // EXPORT_SYNC_WAIT_MS 拉长，保证 json 导出在同步窗口内完成
  ctx = await makeApp({ EXPORT_SYNC_WAIT_MS: '5000', RENDER_BASE_URL: 'http://127.0.0.1:9' })
  alice = createUser(ctx, 'alice')
  const doc = await createDoc(ctx, alice.key, {
    title: '导出测试',
    slides: [slide('s1', [textElement('t1', '第一页')]), slide('s2', [textElement('t2', '第二页')])],
  })
  docId = doc.docId
})

afterAll(async () => {
  await ctx.app.close()
})

async function pollJob(jobId: string, headers: Record<string, string>, tries = 20): Promise<Record<string, unknown>> {
  for (let i = 0; i < tries; i++) {
    const res = await ctx.app.inject({ method: 'GET', url: `/api/exports/${jobId}`, headers })
    expect(res.statusCode).toBe(200)
    const body = res.json() as Record<string, unknown>
    if (body.status === 'done' || body.status === 'failed') return body
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw new Error('导出任务长时间未结束')
}

describe('导出路由', () => {
  it('json 格式同步返回 done + url，文件可下载', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${docId}/exports`,
      headers: auth(alice.key),
      payload: { format: 'json' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json() as { status: string, url?: string }
    expect(body.status).toBe('done')
    expect(body.url).toMatch(/\/exports\/[A-Za-z0-9_-]{21}\.json$/)

    const file = body.url!.split('/exports/')[1]
    const localPath = join(ctx.dir, 'exports', file)
    const exported = JSON.parse(readFileSync(localPath, 'utf8')) as { title: string, slides: unknown[] }
    expect(exported.title).toBe('导出测试')
    expect(exported.slides).toHaveLength(2)

    const download = await ctx.app.inject({ method: 'GET', url: `/exports/${file}` })
    expect(download.statusCode).toBe(200)
    expect(download.headers['content-type']).toContain('application/json')
    expect(download.headers['content-disposition']).toContain('attachment')
  })

  it('slides 子集只导出指定页', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${docId}/exports`,
      headers: auth(alice.key),
      payload: { format: 'json', slides: [1] },
    })
    expect(res.statusCode).toBe(200)
    const file = res.json().url.split('/exports/')[1]
    const exported = JSON.parse(readFileSync(join(ctx.dir, 'exports', file), 'utf8')) as { slides: { id: string }[] }
    expect(exported.slides).toHaveLength(1)
    expect(exported.slides[0].id).toBe('s2')
  })

  it('非法 format / 越界页码返回 400', async () => {
    const badFormat = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${docId}/exports`,
      headers: auth(alice.key),
      payload: { format: 'docx' },
    })
    expect(badFormat.statusCode).toBe(400)

    const badSlide = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${docId}/exports`,
      headers: auth(alice.key),
      payload: { format: 'json', slides: [5] },
    })
    expect(badSlide.statusCode).toBe(400)
  })

  it('只读令牌不能导出，编辑令牌可以', async () => {
    const viewRes = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${docId}/exports`,
      headers: tokenHeader(viewTokenOf(ctx, docId)),
      payload: { format: 'json' },
    })
    expect(viewRes.statusCode).toBe(403)

    const editRes = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${docId}/exports`,
      headers: tokenHeader(editTokenOf(ctx, docId)),
      payload: { format: 'json' },
    })
    expect(editRes.statusCode).toBe(200)
    expect(editRes.json().status).toBe('done')
  })

  it('每日导出配额用完后返回 403 quota_exceeded', async () => {
    const bob = createUser(ctx, 'bob')
    ctx.db.prepare('UPDATE users SET quota_exports_per_day = ? WHERE id = ?').run(1, bob.userId)
    const doc = await createDoc(ctx, bob.key, { title: 'bob', slides: [slide('b1')] })

    const first = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/exports`,
      headers: auth(bob.key),
      payload: { format: 'json' },
    })
    expect(first.statusCode).toBe(200)

    const second = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/exports`,
      headers: auth(bob.key),
      payload: { format: 'json' },
    })
    expect(second.statusCode).toBe(403)
    expect(second.json().error).toBe('quota_exceeded')
  })

  it('他人 Key 查询不到导出任务', async () => {
    // 直接查库拿一个 alice 的 jobId
    const row = ctx.db.prepare('SELECT id FROM export_jobs WHERE doc_id = ? LIMIT 1').get(docId) as { id: string }
    const carol = createUser(ctx, 'carol')
    const query = await ctx.app.inject({ method: 'GET', url: `/api/exports/${row.id}`, headers: auth(carol.key) })
    expect(query.statusCode).toBe(404)
  })

  it('导出失败的任务能在同步窗口外标记为 failed', async () => {
    // RENDER_BASE_URL 指向不可达端口，浏览器任务必然失败
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${docId}/exports`,
      headers: auth(alice.key),
      payload: { format: 'pdf' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json() as { status: string, jobId?: string }
    const jobId = body.jobId ?? (ctx.db.prepare('SELECT id FROM export_jobs ORDER BY created_at DESC LIMIT 1').get() as { id: string }).id
    const final = await pollJob(jobId, auth(alice.key))
    expect(final.status).toBe('failed')
    expect(final.error).toBeTruthy()
  })

  it('/exports/:file 校验文件名与存在性', async () => {
    const traversal = await ctx.app.inject({ method: 'GET', url: '/exports/..%2fsecret' })
    expect(traversal.statusCode).toBe(404)

    const missing = await ctx.app.inject({ method: 'GET', url: '/exports/ABCDEFGHIJKLMNOPQRSTU.json' })
    expect(missing.statusCode).toBe(404)
  })

  it('slides/:index.png 校验页码与 width', async () => {
    const badIndex = await ctx.app.inject({ method: 'GET', url: `/api/docs/${docId}/slides/9.png`, headers: auth(alice.key) })
    expect(badIndex.statusCode).toBe(400)

    const badWidth = await ctx.app.inject({ method: 'GET', url: `/api/docs/${docId}/slides/0.png?width=5`, headers: auth(alice.key) })
    expect(badWidth.statusCode).toBe(400)
  })
})

describe('SSRF 闸门（page.route 决策）', () => {
  const origin = 'http://127.0.0.1:3100'

  it('本站请求放行', () => {
    expect(guardDecision('http://127.0.0.1:3100/?mode=export', 'document', origin)).toBe('allow')
    expect(guardDecision('http://127.0.0.1:3100/assets/x.png', 'image', origin)).toBe('allow')
  })

  it('跨域图片/字体/媒体/XHR 走代理，其余拦截', () => {
    expect(guardDecision('https://example.com/a.png', 'image', origin)).toBe('proxy')
    expect(guardDecision('https://example.com/a.woff2', 'font', origin)).toBe('proxy')
    // pptxgenjs 用 XHR 拉外链图片，必须走代理（代理层有 IP 校验防 SSRF）
    expect(guardDecision('https://example.com/a.png', 'xhr', origin)).toBe('proxy')
    expect(guardDecision('https://example.com/a.js', 'script', origin)).toBe('abort')
    expect(guardDecision('https://example.com/', 'document', origin)).toBe('abort')
    expect(guardDecision('https://example.com/socket', 'websocket', origin)).toBe('abort')
  })

  it('内网地址被拦截：非媒体请求直接 abort，媒体请求经代理层 IP 校验后也会失败', () => {
    expect(guardDecision('http://169.254.169.254/latest/meta-data', 'document', origin)).toBe('abort')
    expect(guardDecision('http://10.0.0.1/admin', 'script', origin)).toBe('abort')
    // 内网图片/XHR 进入 proxy 分支后由 fetchRemoteAsset 的 IP 校验拒绝 → abort
    expect(guardDecision('http://192.168.1.1/a.png', 'image', origin)).toBe('proxy')
    expect(guardDecision('http://127.0.0.1:9999/a.png', 'xhr', origin)).toBe('proxy')
    expect(guardDecision('data:image/png;base64,AAA', 'image', origin)).toBe('allow')
  })
})
