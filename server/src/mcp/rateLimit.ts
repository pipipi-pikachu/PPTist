interface WindowCounter {
  windowStart: number
  count: number
}

// 固定窗口限流器：当前自然时间窗口内按计数键计数。
// 单进程内存实现，计数不跨副本共享；每个窗口切换时顺带清理过期计数，
// 避免长期多 Key 下 Map 无界增长。
export class FixedWindowRateLimiter {
  private readonly counters = new Map<string, WindowCounter>()
  private lastSweepWindow = Number.NEGATIVE_INFINITY

  constructor(
    private readonly maxPerWindow: number,
    private readonly windowMs = 60_000,
  ) {}

  // 本窗口未超限返回 true 并计数；已超限返回 false
  check(key: string, now = Date.now()): boolean {
    const windowStart = Math.floor(now / this.windowMs) * this.windowMs
    if (windowStart !== this.lastSweepWindow) {
      for (const [k, counter] of this.counters) {
        if (counter.windowStart !== windowStart) this.counters.delete(k)
      }
      this.lastSweepWindow = windowStart
    }

    const counter = this.counters.get(key)
    if (!counter || counter.windowStart !== windowStart) {
      this.counters.set(key, { windowStart, count: 1 })
      return true
    }
    if (counter.count >= this.maxPerWindow) return false
    counter.count += 1
    return true
  }

  get size(): number {
    return this.counters.size
  }
}
