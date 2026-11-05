import { describe, expect, it } from 'vitest'

import { RenderQueue } from '../src/render/queue'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('渲染队列', () => {
  it('并发数不超过上限', async () => {
    const queue = new RenderQueue(2, 10_000, 20)
    let active = 0
    let maxActive = 0
    const task = async () => {
      active++
      maxActive = Math.max(maxActive, active)
      await sleep(30)
      active--
    }
    await Promise.all(Array.from({ length: 6 }, () => queue.run(task)))
    expect(maxActive).toBe(2)
  })

  it('等待位超过上限返回 429', async () => {
    const queue = new RenderQueue(1, 10_000, 3)
    const blocker = queue.run(() => sleep(200))
    for (let i = 0; i < 3; i++) void queue.run(() => sleep(10)).catch(() => {})
    await expect(queue.run(() => sleep(1))).rejects.toMatchObject({ status: 429, code: 'rate_limited' })
    await blocker
  })

  it('单任务超时返回 export_failed', async () => {
    const queue = new RenderQueue(1, 50, 20)
    await expect(queue.run(() => sleep(5000))).rejects.toMatchObject({ code: 'export_failed' })
    // 超时后槽位释放，后续任务正常执行
    await expect(queue.run(() => Promise.resolve('ok'))).resolves.toBe('ok')
  })
})
