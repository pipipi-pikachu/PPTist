// 管理台 API 客户端：同源 Cookie 会话 + X-CSRF-Token 写防护。
// 绝不把任何完整 Key 放进 URL / query；完整 Key 只在创建响应里出现一次。

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

let csrfToken = ''
const unauthorizedHandlers = new Set<() => void>()

export function setCsrfToken(token: string) {
  csrfToken = token
}

export function onUnauthorized(handler: () => void) {
  unauthorizedHandlers.add(handler)
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown>
  query?: Record<string, string | undefined>
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET'
  const url = new URL(`/api/admin${path}`, window.location.origin)
  for (const [k, v] of Object.entries(options.query ?? {})) {
    if (v !== undefined && v !== '') url.searchParams.set(k, v)
  }

  let res: Response
  try {
    res = await fetch(url, {
      method,
      credentials: 'same-origin',
      headers: {
        ...(options.body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...(method !== 'GET' ? { 'x-csrf-token': csrfToken } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  }
  catch {
    throw new ApiError(0, 'network', '网络请求失败，请检查连接')
  }

  const data = await res.json().catch(() => ({})) as { error?: string, message?: string }
  if (res.status === 401) {
    unauthorizedHandlers.forEach(handler => handler())
    throw new ApiError(401, data.error ?? 'unauthorized', data.message ?? '会话已失效，请重新登录')
  }
  if (!res.ok) {
    throw new ApiError(res.status, data.error ?? 'error', data.message ?? `请求失败（${res.status}）`)
  }
  return data as T
}
