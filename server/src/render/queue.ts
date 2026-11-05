import { AppError } from '../errors'

const TASK_TIMEOUT_MS = 120_000
const MAX_QUEUED = 20

// 渲染队列：并发数有限，等待位超过上限返回 429，单任务超时强行失败
export class RenderQueue {
  private running = 0
  private waiting: (() => void)[] = []

  constructor(
    private concurrency: number,
    private taskTimeoutMs = TASK_TIMEOUT_MS,
    private maxQueued = MAX_QUEUED,
  ) {}

  get runningCount(): number {
    return this.running
  }

  get queuedCount(): number {
    return this.waiting.length
  }

  run<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this.waiting.length >= this.maxQueued) {
        reject(new AppError(429, 'rate_limited', '导出队列已满，请稍后重试'))
        return
      }
      this.waiting.push(() => void this.execute(task, resolve, reject))
      this.pump()
    })
  }

  private pump() {
    while (this.running < this.concurrency && this.waiting.length) {
      const next = this.waiting.shift()!
      next()
    }
  }

  private async execute<T>(task: () => Promise<T>, resolve: (v: T) => void, reject: (e: unknown) => void) {
    this.running++
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      const result = await Promise.race([
        task(),
        new Promise<never>((_, rejectTimeout) => {
          timer = setTimeout(() => rejectTimeout(new AppError(500, 'export_failed', '导出超时')), this.taskTimeoutMs)
        }),
      ])
      resolve(result)
    }
    catch (err) {
      reject(err)
    }
    finally {
      clearTimeout(timer)
      this.running--
      this.pump()
    }
  }
}
