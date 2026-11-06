import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { loadConfig } from '../src/config'
import { FixedWindowRateLimiter } from '../src/mcp/rateLimit'
import { auth, createUser, makeApp, type TestContext } from './helpers'

const tmpEnv = (env: Record<string, string> = {}): NodeJS.ProcessEnv =>
  ({ DATA_DIR: mkdtempSync(join(tmpdir(), 'pptist-cfg-')), ...env }) as NodeJS.ProcessEnv

describe('MCP_RATE_LIMIT_PER_MIN 配置', () => {
  it('缺省为 60', () => {
    expect(loadConfig(tmpEnv()).mcpRateLimitPerMin).toBe(60)
  })

  it('可配置为正整数', () => {
    expect(loadConfig(tmpEnv({ MCP_RATE_LIMIT_PER_MIN: '5' })).mcpRateLimitPerMin).toBe(5)
  })

  it('0 / 负数 / 非数字拒绝启动', () => {
    for (const bad of ['0', '-3', 'abc', 'NaN']) {
      expect(() => loadConfig(tmpEnv({ MCP_RATE_LIMIT_PER_MIN: bad }))).toThrow(/MCP_RATE_LIMIT_PER_MIN/)
    }
  })

  it('小数 / 后缀等畸形值整体拒绝，不做前缀截断', () => {
    for (const bad of ['5.5', '60oops', '1e2', ' 60', '60 ', '+60', '0x10', '9'.repeat(30)]) {
      expect(() => loadConfig(tmpEnv({ MCP_RATE_LIMIT_PER_MIN: bad }))).toThrow(/MCP_RATE_LIMIT_PER_MIN/)
    }
  })
})

describe('intEnv 通用整数配置', () => {
  it('0 仍是合法值，合法整数可配置', () => {
    expect(loadConfig(tmpEnv({ RATE_LIMIT_PER_MIN: '0' })).rateLimitPerMin).toBe(0)
    expect(loadConfig(tmpEnv({ RATE_LIMIT_PER_MIN: '150' })).rateLimitPerMin).toBe(150)
    expect(loadConfig(tmpEnv({ PORT: '0' })).port).toBe(0)
  })

  it('小数 / 负数 / 后缀等畸形值整体拒绝', () => {
    for (const bad of ['5.5', '120oops', '-1', 'abc', '1e2', ' 150']) {
      expect(() => loadConfig(tmpEnv({ RATE_LIMIT_PER_MIN: bad }))).toThrow(/RATE_LIMIT_PER_MIN/)
    }
  })
})

describe('FixedWindowRateLimiter', () => {
  it('窗口内计数，超限拒绝，不同键互不影响', () => {
    const limiter = new FixedWindowRateLimiter(2)
    const t0 = 1_700_000_000_000
    expect(limiter.check('a', t0)).toBe(true)
    expect(limiter.check('a', t0 + 1)).toBe(true)
    expect(limiter.check('a', t0 + 2)).toBe(false)
    expect(limiter.check('b', t0 + 3)).toBe(true)
  })

  it('跨窗口后重置计数', () => {
    const limiter = new FixedWindowRateLimiter(1)
    const t0 = 1_700_000_000_000
    expect(limiter.check('a', t0)).toBe(true)
    expect(limiter.check('a', t0 + 1)).toBe(false)
    expect(limiter.check('a', t0 + 60_000)).toBe(true)
  })

  it('过期窗口计数会被清理，Map 不无界增长', () => {
    const limiter = new FixedWindowRateLimiter(1)
    const t0 = 1_700_000_000_000
    for (let i = 0; i < 100; i++) limiter.check(`k${i}`, t0)
    expect(limiter.size).toBe(100)
    limiter.check('new', t0 + 60_000)
    expect(limiter.size).toBe(1)
  })
})

// POST /mcp 走 reply.hijack()，与 mcp.test.ts 一样用真实监听端口而不是 inject
describe('/mcp 按 Key 限流', () => {
  let ctx: TestContext
  let baseUrl = ''
  let aliceKey = ''
  let bobKey = ''
  let carolKey = ''

  const mcpPost = (key?: string) => fetch(`${baseUrl}/mcp`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json, text/event-stream',
      ...(key ? auth(key) : {}),
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'rate-limit-test', version: '0.0.1' },
      },
    }),
  })

  beforeAll(async () => {
    ctx = await makeApp({ MCP_RATE_LIMIT_PER_MIN: '3' })
    aliceKey = createUser(ctx, 'alice').key
    bobKey = createUser(ctx, 'bob').key
    carolKey = createUser(ctx, 'carol').key
    await ctx.app.listen({ port: 0, host: '127.0.0.1' })
    const address = ctx.app.server.address()
    if (typeof address !== 'object' || !address) throw new Error('监听地址不可用')
    baseUrl = `http://127.0.0.1:${address.port}`
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('阈值内放行，超过返回 429 { error: rate_limited }，且不进入 MCP transport', async () => {
    for (let i = 0; i < 3; i++) {
      const res = await mcpPost(aliceKey)
      expect(res.status).toBe(200)
      await res.text()
    }
    const res = await mcpPost(aliceKey)
    expect(res.status).toBe(429)
    const body = await res.json() as { error: string, message: string }
    expect(body.error).toBe('rate_limited')
    expect(typeof body.message).toBe('string')
  })

  it('不同 Key 独立计数', async () => {
    const res = await mcpPost(bobKey)
    expect(res.status).toBe(200)
    await res.text()
  })

  it('无 Key / 错误 Key 仍是 401，不计入任何有效用户额度', async () => {
    for (let i = 0; i < 4; i++) {
      expect((await mcpPost()).status).toBe(401)
      expect((await mcpPost('pk_invalid_xxxx')).status).toBe(401)
    }
    // alice 上一窗口已用满 3 次，伪造凭证再多也只走鉴权
    const res = await mcpPost()
    expect(res.status).toBe(401)
  })

  it('固定窗口切换后同 Key 恢复放行', async () => {
    // 独立 Key + 固定时钟，与自然时间的窗口边界无关
    vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-01-01T00:00:00Z') })
    try {
      for (let i = 0; i < 3; i++) {
        const res = await mcpPost(carolKey)
        expect(res.status).toBe(200)
        await res.text()
      }
      expect((await mcpPost(carolKey)).status).toBe(429)
      // 进入下一个自然窗口
      vi.setSystemTime(Date.now() + 61_000)
      const res = await mcpPost(carolKey)
      expect(res.status).toBe(200)
      await res.text()
    }
    finally {
      vi.useRealTimers()
    }
  })
})
