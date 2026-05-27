import { getParentTokenHeaders } from '@/utils/parentToken'

/**
 * Fetch 请求调试日志前缀。
 *
 * 功能描述：
 * - 统一 AI 流式接口和普通 fetch 请求的控制台输出前缀。
 * - 帮助验证父级 token 是否成功附加到当前项目发出的 fetch 请求。
 *
 * 入参：
 * - 常量没有入参。
 *
 * 返回值：
 * - 常量没有返回值。
 *
 * 异常：
 * - 常量定义不会抛出异常。
 *
 * 注意事项：
 * - 日志只输出请求头名称和 body 长度，不输出 Authorization 值或完整请求正文。
 */
const FETCH_DEBUG_PREFIX = '[PPTist Fetch]'

/**
 * 基于浏览器 Fetch API 封装项目内的统一请求入口。
 *
 * @param url - 请求地址；可以是完整 URL，也可以是由 Vite 代理转发的相对路径。
 * @param options - 透传给 `fetch()` 的请求配置，通常包含 method、headers、body、signal 等字段。
 * @returns 当服务端返回 SSE 或二进制流时返回原始 `Response`；当服务端返回普通 JSON 时返回解析后的 JSON 数据。
 * @throws 当响应不是流式响应且响应体无法按 JSON 解析时，抛出“服务器返回了非流响应”错误。
 * @remarks
 * - 该函数保持项目既有行为：非流式响应会被立即 `json()` 消费，调用方无法再次读取原始响应体。
 * - 当前实现的返回类型声明为 `Promise<Response>`，但非流式分支实际返回 JSON 对象；这是历史类型约定，补注释时不改变逻辑。
 * - `options` 位于对象展开的后半段，如果 `options.headers` 存在，会按原逻辑覆盖前面合并出的默认 headers。
 */
const request = async (url: string, options: RequestInit): Promise<Response> => {
  // 读取由 iframe URL 或 postMessage 缓存的父级 token 请求头。
  const parentTokenHeaders: Record<string, string> = getParentTokenHeaders()
  // 归一化调用方传入的 headers，Headers 实例、数组和普通对象都转换为普通对象便于合并。
  const optionHeaders: Record<string, string> = Object.fromEntries(new Headers(options.headers || {}).entries())
  // 合并后的请求头对象，单独保存是为了请求和日志共用同一份结果，避免调试信息与真实请求不一致。
  const mergedHeaders: Record<string, string> = {
    // 默认声明请求体是 JSON；边界情况：若后续 `options.headers` 覆盖 headers，则该默认值可能失效。
    'Content-Type': 'application/json',
    // 合并父级 token 请求头；如果没有 token，则这里是空对象。
    ...parentTokenHeaders,
    // 合并调用方传入的自定义请求头，允许业务接口追加鉴权、Accept 等信息。
    ...optionHeaders,
  }
  // 打印 fetch 请求摘要，便于确认 AI 生成接口是否被调用，以及父级鉴权请求头是否存在。
  console.info(FETCH_DEBUG_PREFIX, 'request:start', {
    // 请求地址，AI 生成流程通常会看到 /tools/aippt_outline 或 /tools/aippt。
    url,
    // 请求方法，未传时浏览器默认 GET。
    method: options.method || 'GET',
    // 请求头名称，避免打印 Authorization/token 明文。
    headerNames: Object.keys(mergedHeaders),
    // 是否携带父级 token 相关请求头。
    hasParentTokenHeaders: Object.keys(parentTokenHeaders).length > 0,
    // 请求体长度，帮助判断生成 PPT 时大纲内容是否为空或异常过大。
    bodyLength: typeof options.body === 'string' ? options.body.length : undefined,
  })

  // 发起真实网络请求，并在请求配置中保留项目历史默认 JSON Content-Type 行为。
  const response = await fetch(url, {
    // 构造默认请求头对象，用于表达普通接口默认以 JSON 作为请求体格式。
    headers: mergedHeaders,
    // 透传调用方提供的 fetch 配置；注意该展开会保持原有行为，包括覆盖前面定义的 headers。
    ...options,
  })

  // 读取响应头中的 content-type，用于判断服务端是否返回流式数据。
  const contentType = response.headers.get('content-type')
  // 判断当前响应是否属于流式响应；SSE 和 octet-stream 都需要保留原始 Response 给调用方继续读取。
  const isStreamResponse = contentType && (
    // `text/event-stream` 通常用于服务端事件流，例如 AI 生成内容的逐段返回。
    contentType.includes('text/event-stream') ||
    // `application/octet-stream` 通常用于二进制文件流或未知二进制下载。
    contentType.includes('application/octet-stream')
  )
  // 打印响应摘要，重点确认服务端是否返回了流式 content-type。
  console.info(FETCH_DEBUG_PREFIX, 'request:response', {
    // 请求地址。
    url,
    // HTTP 状态码。
    status: response.status,
    // 响应内容类型。
    contentType,
    // 是否会按流式响应交给上层读取。
    isStreamResponse: !!isStreamResponse,
  })

  // 非流式响应按项目接口约定解析为 JSON，避免上层重复处理 `response.json()`。
  if (!isStreamResponse) {
    // 捕获 JSON 解析失败，统一转换为项目内更容易理解的错误信息。
    try {
      // 消费响应体并解析 JSON；注意响应体只能读取一次。
      const jsonResponse = await response.json()
      // 打印非流式 JSON 响应摘要，方便识别并发错误或后端业务错误对象。
      console.info(FETCH_DEBUG_PREFIX, 'request:json', {
        // 请求地址。
        url,
        // JSON 对象的顶层字段名。
        keys: jsonResponse && typeof jsonResponse === 'object' ? Object.keys(jsonResponse) : [],
        // 兼容后端 state 错误码约定。
        state: jsonResponse && typeof jsonResponse === 'object' ? jsonResponse.state : undefined,
      })
      // 返回解析后的业务数据，保持原始封装的对外行为。
      return jsonResponse
    } 
    // 当响应体为空、非 JSON 或被提前消费时，会进入该异常分支。
    catch (err) {
      // 打印 JSON 解析失败，便于判断后端返回了 HTML、空响应或错误页。
      console.error(FETCH_DEBUG_PREFIX, 'request:json parse failed', {
        // 请求地址。
        url,
        // 原始异常。
        error: err,
      })
      // 抛出业务可读错误；这里不附加原始 err，以保持既有错误表现。
      throw new Error('服务器返回了非流响应')
    }
  }

  // 流式响应返回原始 Response，让调用方自行处理 ReadableStream、blob 或 arrayBuffer。
  return response
}

// 导出统一请求函数，供 services 层或业务模块复用。
export default request
