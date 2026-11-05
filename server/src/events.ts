import type { ServerResponse } from 'node:http'

export interface DocEvent {
  version: number
  author: 'agent' | 'user'
  summary: string[]
}

// 单进程内存订阅表：docId → 一组 SSE 响应流
const subscribers = new Map<string, Set<ServerResponse>>()

export function publish(docId: string, event: DocEvent): void {
  const targets = subscribers.get(docId)
  if (!targets) return
  const payload = `event: update\ndata: ${JSON.stringify(event)}\n\n`
  for (const res of targets) {
    try {
      res.write(payload)
    }
    catch {
      targets.delete(res)
    }
  }
  if (!targets.size) subscribers.delete(docId)
}

export function subscriberCount(docId: string): number {
  return subscribers.get(docId)?.size ?? 0
}

// 由路由调用：接管原始响应流，注册心跳（25s）与断开清理
export function subscribe(docId: string, res: ServerResponse): void {
  res.writeHead(200, {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-cache',
    'x-accel-buffering': 'no',
    'connection': 'keep-alive',
  })
  res.write(': connected\n\n')

  let targets = subscribers.get(docId)
  if (!targets) {
    targets = new Set()
    subscribers.set(docId, targets)
  }
  targets.add(res)

  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n')
    }
    catch {
      // 连接已断开，交给 close 清理
    }
  }, 25_000)

  const cleanup = () => {
    clearInterval(heartbeat)
    targets.delete(res)
    if (!targets.size) subscribers.delete(docId)
  }
  res.on('close', cleanup)
  res.on('error', cleanup)
}
