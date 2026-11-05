import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { auth, createDoc, createUser, editTokenOf, makeApp, textElement, tokenHeader, type TestContext } from './helpers'

let ctx: TestContext
let alice: { userId: string, key: string }

beforeAll(async () => {
  ctx = await makeApp()
  alice = createUser(ctx, 'alice')
})

afterAll(async () => {
  await ctx.app.close()
})

async function getDoc(docId: string) {
  const res = await ctx.app.inject({ method: 'GET', url: `/api/docs/${docId}`, headers: auth(alice.key) })
  return res.json()
}

function docBody(doc: { title: string, theme: unknown, viewportSize: number, viewportRatio: number, slides: unknown[] }) {
  return { title: doc.title, theme: doc.theme, viewportSize: doc.viewportSize, viewportRatio: doc.viewportRatio, slides: doc.slides }
}

describe('三方合并', () => {
  it('浏览器改第 1 页、Agent 改第 2 页：两边修改都保留', async () => {
    const doc = await createDoc(ctx, alice.key, {
      slides: [
        { id: 's1', elements: [textElement('e1', '第一页旧文本')] },
        { id: 's2', elements: [textElement('e2', '第二页旧文本')] },
      ],
    })
    expect(doc.version).toBe(1)

    // Agent 基于 v1 修改第 2 页 → v2
    const ops = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/ops`,
      headers: auth(alice.key),
      payload: { ops: [{ op: 'updateElements', updates: [{ id: 'e2', props: { content: '<p>第二页新文本</p>' } }] }] },
    })
    expect(ops.statusCode).toBe(200)
    expect(ops.json().version).toBe(2)

    // 浏览器拿着 v1 的快照改第 1 页，PUT baseVersion=1
    const v1 = (await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}`, headers: auth(alice.key) })).json()
    const browserDoc = docBody(v1)
    ;(browserDoc.slides as { id: string, elements: { id: string, content: string }[] }[])[0].elements[0].content = '<p>第一页新文本</p>'

    const put = await ctx.app.inject({
      method: 'PUT',
      url: `/api/docs/${doc.docId}`,
      headers: tokenHeader(editTokenOf(ctx, doc.docId)),
      payload: { baseVersion: 1, doc: browserDoc },
    })
    expect(put.statusCode).toBe(200)
    expect(put.json().merged).toBe(true)
    expect(put.json().version).toBe(3)

    const merged = await getDoc(doc.docId)
    const texts = merged.slides.flatMap((s: { elements: { content: string }[] }) => s.elements.map(e => e.content))
    expect(texts).toContain('<p>第一页新文本</p>')
    expect(texts).toContain('<p>第二页新文本</p>')
  })

  it('两边改同一个元素返回 409 并给出冲突路径', async () => {
    const doc = await createDoc(ctx, alice.key, {
      slides: [{ id: 's1', elements: [textElement('e1', 'base')] }],
    })

    // Agent 改 e1 → v2
    await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/ops`,
      headers: auth(alice.key),
      payload: { ops: [{ op: 'updateElements', updates: [{ id: 'e1', props: { content: '<p>agent 改的</p>' } }] }] },
    })

    // 浏览器基于 v1 也改 e1 → 冲突
    const current = await getDoc(doc.docId)
    const browserDoc = docBody(current)
    ;(browserDoc.slides as { id: string, elements: { id: string, content: string }[] }[])[0].elements[0].content = '<p>user 改的</p>'

    const put = await ctx.app.inject({
      method: 'PUT',
      url: `/api/docs/${doc.docId}`,
      headers: tokenHeader(editTokenOf(ctx, doc.docId)),
      payload: { baseVersion: 1, doc: browserDoc },
    })
    expect(put.statusCode).toBe(409)
    const body = put.json()
    expect(body.error).toBe('conflict')
    expect(body.issues.currentVersion).toBe(2)
    expect(body.issues.conflicts.some((c: string) => c.includes('e1'))).toBe(true)
  })

  it('baseVersion 等于当前版本时 PUT 直接生效', async () => {
    const doc = await createDoc(ctx, alice.key, { slides: [{ id: 's1', elements: [] }] })
    const current = await getDoc(doc.docId)
    const browserDoc = docBody(current)
    browserDoc.title = '网页改标题'

    const put = await ctx.app.inject({
      method: 'PUT',
      url: `/api/docs/${doc.docId}`,
      headers: tokenHeader(editTokenOf(ctx, doc.docId)),
      payload: { baseVersion: current.version, doc: browserDoc },
    })
    expect(put.statusCode).toBe(200)
    expect(put.json().merged).toBe(false)
    expect((await getDoc(doc.docId)).title).toBe('网页改标题')
  })

  it('ops 的 baseVersion 落后时返回 409', async () => {
    const doc = await createDoc(ctx, alice.key, {})
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/ops`,
      headers: auth(alice.key),
      payload: { baseVersion: 99, ops: [{ op: 'setTitle', title: 'x' }] },
    })
    expect(res.statusCode).toBe(409)
  })
})
