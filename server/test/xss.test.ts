import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { auth, createDoc, createUser, makeApp, PNG_DATA_URL, tokenHeader, editTokenOf, type TestContext } from './helpers'

let ctx: TestContext
let alice: { userId: string, key: string }

beforeAll(async () => {
  ctx = await makeApp()
  alice = createUser(ctx, 'alice')
})

afterAll(async () => {
  await ctx.app.close()
})

describe('XSS 清洗', () => {
  it('script/img onerror/javascript: 链接被清除，白名单样式保留', async () => {
    const dirty = '<p style="text-align:center;"><span style="font-size:32px;color:#0F172A;">标题</span><script>alert(1)</script><img src=x onerror=alert(2)><a href="javascript:alert(3)">x</a></p>'
    const doc = await createDoc(ctx, alice.key, {
      slides: [{
        id: 's1',
        elements: [{
          type: 'text', id: 'e1', left: 0, top: 0, width: 100, height: 50, rotate: 0,
          content: dirty, defaultFontName: '', defaultColor: '#000',
        }],
      }],
    })

    const res = await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}`, headers: auth(alice.key) })
    const content = res.json().slides[0].elements[0].content as string
    expect(content).not.toContain('<script')
    expect(content).not.toContain('alert')
    expect(content).not.toContain('<img')
    expect(content).not.toContain('javascript:')
    expect(content).toContain('text-align:center')
    expect(content).toContain('font-size:32px')
    expect(content).toContain('color:#0F172A')
    expect(content).toContain('标题')
  })

  it('非白名单样式被剥掉，标签被清除', async () => {
    const doc = await createDoc(ctx, alice.key, {
      slides: [{
        id: 's1',
        elements: [{
          type: 'text', id: 'e1', left: 0, top: 0, width: 100, height: 50, rotate: 0,
          content: '<p style="position:fixed;top:0"><span style="color:url(javascript:x)">a</span><b>粗</b><iframe src=x></iframe></p>',
          defaultFontName: '', defaultColor: '#000',
        }],
      }],
    })
    const res = await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}`, headers: auth(alice.key) })
    const content = res.json().slides[0].elements[0].content as string
    expect(content).not.toContain('position')
    expect(content).not.toContain('url(')
    expect(content).not.toContain('<b>')
    expect(content).not.toContain('<iframe')
  })

  it('批注是纯文本，标签被剥掉', async () => {
    const doc = await createDoc(ctx, alice.key, {
      slides: [{ id: 's1', elements: [], notes: [{ content: '<b>加粗</b><script>x</script>', time: 1, user: '我' }] }],
    })
    const res = await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}`, headers: auth(alice.key) })
    const note = res.json().slides[0].notes[0]
    expect(note.content).not.toContain('<')
  })

  it('data: png 被转存为 /assets 地址', async () => {
    const doc = await createDoc(ctx, alice.key, {
      slides: [{
        id: 's1',
        elements: [{
          type: 'image', id: 'img1', left: 0, top: 0, width: 100, height: 100, rotate: 0, src: PNG_DATA_URL,
        }],
      }],
    })
    const res = await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}`, headers: auth(alice.key) })
    const src = res.json().slides[0].elements[0].src as string
    expect(src).toMatch(/^\/assets\/[\w-]+\.png$/)

    const img = await ctx.app.inject({ method: 'GET', url: src })
    expect(img.statusCode).toBe(200)
    expect(img.headers['content-type']).toBe('image/png')
    expect(img.headers['x-content-type-options']).toBe('nosniff')
  })

  it('上传 svg 被拒绝', async () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>').toString('base64')
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/assets',
      headers: auth(alice.key),
      payload: { data: `data:image/svg+xml;base64,${svg}` },
    })
    expect(res.statusCode).toBe(400)

    const res2 = await ctx.app.inject({
      method: 'POST',
      url: '/api/assets',
      headers: auth(alice.key),
      payload: { data: svg },
    })
    expect(res2.statusCode).toBe(400)
  })

  it('非法媒体地址（javascript:/file:）报校验错误', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/docs',
      headers: auth(alice.key),
      payload: {
        slides: [{
          id: 's1',
          elements: [{ type: 'image', id: 'i', left: 0, top: 0, width: 1, height: 1, rotate: 0, src: 'file:///etc/passwd' }],
        }],
      },
    })
    expect(res.statusCode).toBe(400)
    expect(res.json().error).toBe('validation')
  })

  it('网页端可通过编辑令牌上传图片', async () => {
    const doc = await createDoc(ctx, alice.key, {})
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/assets`,
      headers: tokenHeader(editTokenOf(ctx, doc.docId)),
      payload: { data: PNG_DATA_URL },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().url).toMatch(/^\/assets\//)
  })
})
