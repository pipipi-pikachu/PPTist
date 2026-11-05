import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { auth, createDoc, createUser, makeApp, textElement, type TestContext } from './helpers'

let ctx: TestContext
let alice: { userId: string, key: string }

beforeAll(async () => {
  ctx = await makeApp({ DEFAULT_QUOTA_DOCS: '2' })
  alice = createUser(ctx, 'alice')
})

afterAll(async () => {
  await ctx.app.close()
})

describe('配额', () => {
  it('超过文档数上限返回 403 quota_exceeded', async () => {
    await createDoc(ctx, alice.key, { title: 'd1' })
    await createDoc(ctx, alice.key, { title: 'd2' })
    const res = await ctx.app.inject({ method: 'POST', url: '/api/docs', headers: auth(alice.key), payload: { title: 'd3' } })
    expect(res.statusCode).toBe(403)
    expect(res.json().error).toBe('quota_exceeded')
  })

  it('文档超过大小限制返回 413 doc_too_large', async () => {
    // 先放开文档数配额，再把单文档配额压到 4KB
    ctx.db.prepare('UPDATE users SET quota_docs = ?, quota_doc_bytes = ? WHERE id = ?').run(100, 4096, alice.userId)
    const doc = await createDoc(ctx, alice.key, { title: 'small' })

    const big = 'x'.repeat(6000)
    const res = await ctx.app.inject({
      method: 'POST',
      url: `/api/docs/${doc.docId}/ops`,
      headers: auth(alice.key),
      payload: {
        ops: [{ op: 'addSlides', slides: [{ id: 's_big', elements: [textElement('e_big', big)] }] }],
      },
    })
    expect(res.statusCode).toBe(413)
    expect(res.json().error).toBe('doc_too_large')
  })
})
