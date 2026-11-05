import type { Slide, SlideTheme } from '@/types/slides'

export interface DocData {
  title: string
  theme: SlideTheme
  viewportSize: number
  viewportRatio: number
  slides: Slide[]
}

export interface DocResponse extends DocData {
  id: string
  version: number
  role: 'owner' | 'edit' | 'view'
  editUrl?: string
  viewUrl?: string
}

export interface PutDocResult {
  version: number
  merged?: boolean
  normalized?: boolean
}

export interface DocEvent {
  version: number
  author: 'agent' | 'user'
  summary: string[]
}

export interface AssetResult {
  id: string
  url: string
}

export class DocRequestError extends Error {
  status: number
  code: string
  currentVersion?: number
  conflicts?: string[]

  constructor(status: number, message: string, code = '', currentVersion?: number, conflicts?: string[]) {
    super(message)
    this.status = status
    this.code = code
    this.currentVersion = currentVersion
    this.conflicts = conflicts
  }
}

// App.vue 从链接 #t= 片段读到令牌后写入；所有请求统一携带 X-Doc-Token
let docToken = ''

export function setDocToken(token: string) {
  docToken = token
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'X-Doc-Token': docToken,
      ...(init.headers || {}),
    },
  })
  const body = await res.json().catch(() => null) as {
    error?: string
    message?: string
    issues?: { currentVersion?: number, conflicts?: string[] } | Record<string, unknown>
  } | null
  if (!res.ok) {
    const issues = body?.issues as { currentVersion?: number, conflicts?: string[] } | undefined
    throw new DocRequestError(
      res.status,
      body?.message || `请求失败（${res.status}）`,
      body?.error || '',
      issues?.currentVersion,
      Array.isArray(issues?.conflicts) ? issues.conflicts : undefined,
    )
  }
  return body as T
}

export const getDoc = (id: string) => request<DocResponse>(`/api/docs/${id}`)

export const putDoc = (id: string, baseVersion: number, doc: DocData) =>
  request<PutDocResult>(`/api/docs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ baseVersion, doc }),
  })

export const uploadAsset = async (id: string, file: File) => {
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsDataURL(file)
  })
  return request<AssetResult>(`/api/docs/${id}/assets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  })
}

// SSE 断线重连退避序列（之后固定 30s）
const RETRY_DELAYS = [1000, 2000, 5000, 10000, 20000, 30000]

// EventSource 不支持自定义请求头，用 fetch 流式读取并手动解析 SSE
export function subscribe(id: string, onUpdate: (event: DocEvent) => void): () => void {
  let closed = false
  let retries = 0
  let abort: AbortController | null = null
  let timer: ReturnType<typeof setTimeout> | null = null

  const parseEvent = (raw: string) => {
    let name = 'message'
    const dataLines: string[] = []
    for (const line of raw.split('\n')) {
      if (!line || line.startsWith(':')) continue
      if (line.startsWith('event:')) name = line.slice(6).trim()
      else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim())
    }
    if (name === 'update' && dataLines.length) {
      try {
        onUpdate(JSON.parse(dataLines.join('\n'))) 
      }
      catch { /* 忽略无法解析的事件 */ }
    }
  }

  const connect = async () => {
    if (closed) return
    abort = new AbortController()
    try {
      const res = await fetch(`/api/docs/${id}/events`, {
        headers: { 'X-Doc-Token': docToken },
        signal: abort.signal,
      })
      if (!res.ok || !res.body) throw new Error(`events ${res.status}`)
      retries = 0

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let sep = buffer.indexOf('\n\n')
        while (sep >= 0) {
          parseEvent(buffer.slice(0, sep))
          buffer = buffer.slice(sep + 2)
          sep = buffer.indexOf('\n\n')
        }
      }
    }
    catch { /* 断线走退避重连 */ }
    abort = null
    if (!closed) {
      const delay = RETRY_DELAYS[Math.min(retries, RETRY_DELAYS.length - 1)]
      retries++
      timer = setTimeout(() => void connect(), delay)
    }
  }

  void connect()

  return () => {
    closed = true
    abort?.abort()
    if (timer) clearTimeout(timer)
  }
}
