import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { auth, createDoc, createUser, makeApp, type TestContext } from './helpers'

let ctx: TestContext
let alice: { userId: string, key: string }

beforeAll(async () => {
  ctx = await makeApp()
  alice = createUser(ctx, 'alice')
})

afterAll(async () => {
  await ctx.app.close()
})

describe('元素引用维护', () => {
  it('deleteElements 后引用该元素的动画、批注关联和线条连接被清除', async () => {
    const doc = await createDoc(ctx, alice.key, {
      slides: [{
        id: 's1',
        elements: [
          { type: 'shape', id: 'shape1', left: 0, top: 0, width: 100, height: 100, rotate: 0, viewBox: [100, 100], path: 'M0 0L100 0L100 100L0 100Z', fill: '#fff' },
          {
            type: 'line', id: 'line1', left: 0, top: 0, width: 2,
            start: [0, 0], end: [100, 100], style: 'solid', color: '#000', points: ['', 'arrow'],
            startBinding: { elementId: 'shape1', anchor: 'top' },
            endBinding: { elementId: 'shape1', anchor: 'bottom' },
          },
          { type: 'text', id: 't1', left: 0, top: 200, width: 100, height: 40, rotate: 0, content: '<p>hi</p>', defaultFontName: '', defaultColor: '#000' },
        ],
        animations: [
          { id: 'a1', elId: 'shape1', effect: 'fadeIn', type: 'in', duration: 500, trigger: 'click' },
          { id: 'a2', elId: 't1', effect: 'fadeIn', type: 'in', duration: 500, trigger: 'click' },
        ],
        notes: [{ id: 'n1', content: '关联形状的批注', time: 1, user: '我', elId: 'shape1' }],
      }],
    })

    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/ops`,
      headers: auth(alice.key),
      payload: { ops: [{ op: 'deleteElements', ids: ['shape1'] }] },
    })
    expect(res.statusCode).toBe(200)

    const got = await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}`, headers: auth(alice.key) })
    const slide = got.json().slides[0]
    expect(slide.elements.map((e: { id: string }) => e.id)).toEqual(['line1', 't1'])

    // 引用 shape1 的动画被删，引用 t1 的保留
    expect(slide.animations.map((a: { elId: string }) => a.elId)).toEqual(['t1'])
    // 批注保留但 elId 被清空
    expect(slide.notes[0].elId).toBeUndefined()
    // 线条两端绑定被删
    const line = slide.elements.find((e: { id: string }) => e.id === 'line1')
    expect(line.startBinding).toBeUndefined()
    expect(line.endBinding).toBeUndefined()
  })

  it('deleteSlides 后整页连同引用一起移除', async () => {
    const doc = await createDoc(ctx, alice.key, {
      slides: [
        { id: 's1', elements: [{ type: 'text', id: 't1', left: 0, top: 0, width: 1, height: 1, rotate: 0, content: '<p>x</p>', defaultFontName: '', defaultColor: '#000' }] },
        { id: 's2', elements: [] },
      ],
    })
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/ops`,
      headers: auth(alice.key),
      payload: { ops: [{ op: 'deleteSlides', slideIds: ['s1'] }] },
    })
    expect(res.statusCode).toBe(200)
    const got = await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}`, headers: auth(alice.key) })
    expect(got.json().slides.map((s: { id: string }) => s.id)).toEqual(['s2'])
  })

  it('找不到 id 时返回 400 并说明是哪个 id，且整体回滚', async () => {
    const doc = await createDoc(ctx, alice.key, { title: '回滚测试', slides: [{ id: 's1', elements: [] }] })
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/ops`,
      headers: auth(alice.key),
      payload: {
        ops: [
          { op: 'setTitle', title: '不应生效' },
          { op: 'deleteElements', ids: ['ghost'] },
        ],
      },
    })
    expect(res.statusCode).toBe(400)
    expect(res.body).toContain('ghost')

    const got = await ctx.app.inject({ method: 'GET', url: `/api/docs/${doc.docId}`, headers: auth(alice.key) })
    expect(got.json().title).toBe('回滚测试')
    expect(got.json().version).toBe(doc.version)
  })
})
