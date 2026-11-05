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

describe('修订摘要', () => {
  it('Agent 修改文本后摘要包含「修改文本」和新旧内容，作者为 agent', async () => {
    const doc = await createDoc(ctx, alice.key, {
      slides: [{ id: 's1', elements: [textElement('e1', '旧文本内容')] }],
    })

    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/ops`,
      headers: auth(alice.key),
      payload: { ops: [{ op: 'updateElements', updates: [{ id: 'e1', props: { content: '<p>新文本内容</p>' } }] }] },
    })
    expect(res.statusCode).toBe(200)
    const summary = res.json().summary as string[]
    const line = summary.find(item => item.includes('修改文本'))
    expect(line, JSON.stringify(summary)).toBeTruthy()
    expect(line).toContain('旧文本内容')
    expect(line).toContain('新文本内容')

    const revs = await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}/revisions`, headers: auth(alice.key) })
    const last = revs.json().at(-1)
    expect(last.author).toBe('agent')
    expect(last.version).toBe(2)
  })

  it('编辑令牌 PUT 生成的修订作者为 user', async () => {
    const doc = await createDoc(ctx, alice.key, {
      slides: [{ id: 's1', elements: [textElement('e1', '原文')] }],
    })
    const get = await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}`, headers: auth(alice.key) })
    const doc2 = get.json()
    const body = {
      title: doc2.title,
      theme: doc2.theme,
      viewportSize: doc2.viewportSize,
      viewportRatio: doc2.viewportRatio,
      slides: doc2.slides,
    }
    body.slides[0].elements[0].content = '<p>用户改的文本</p>'

    const put = await ctx.app.inject({
      method: 'PUT',
      url: `/api/docs/${doc.docId}`,
      headers: tokenHeader(editTokenOf(ctx, doc.docId)),
      payload: { baseVersion: doc2.version, doc: body },
    })
    expect(put.statusCode).toBe(200)

    const revs = await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}/revisions`, headers: auth(alice.key) })
    const last = revs.json().at(-1)
    expect(last.author).toBe('user')
    expect(last.summary.join('\n')).toContain('修改文本')
  })

  it('新增/删除页面和标题修改有对应摘要', async () => {
    const doc = await createDoc(ctx, alice.key, { title: '原标题', slides: [{ id: 's1', elements: [] }] })
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/ops`,
      headers: auth(alice.key),
      payload: {
        ops: [
          { op: 'setTitle', title: '新标题' },
          { op: 'addSlides', slides: [{ id: 's2', elements: [textElement('e2', '新增页文本')] }] },
          { op: 'deleteSlides', slideIds: ['s1'] },
        ],
      },
    })
    expect(res.statusCode).toBe(200)
    const summary = res.json().summary.join('\n')
    expect(summary).toContain('修改标题')
    expect(summary).toContain('原标题')
    expect(summary).toContain('新标题')
    expect(summary).toContain('新增第')
    expect(summary).toContain('删除第')
  })

  it('内容没有变化时不产生新修订', async () => {
    const doc = await createDoc(ctx, alice.key, { title: 't', slides: [] })
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/ops`,
      headers: auth(alice.key),
      payload: { ops: [{ op: 'setTitle', title: 't' }] },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().version).toBe(doc.version)

    const revs = await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}/revisions`, headers: auth(alice.key) })
    expect(revs.json()).toHaveLength(1)
  })
})
