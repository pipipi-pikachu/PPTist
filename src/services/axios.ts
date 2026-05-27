import axios from 'axios'
import message from '@/utils/message'
import { getParentTokenHeaders } from '@/utils/parentToken'

/**
 * Axios 请求调试日志前缀。
 *
 * 功能描述：
 * - 统一 axios 请求链路的浏览器控制台输出。
 * - 帮助验证父级 token 是否被自动合入 mock、图片搜索等 axios 请求。
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
 * - 日志只打印请求头名称，不打印 Authorization 或 x-auth-token 的值。
 */
const AXIOS_DEBUG_PREFIX = '[PPTist Axios]'

// 创建项目统一 axios 实例；超时时间为 5 分钟，用于兼容图片搜索、导入等可能耗时较长的接口。
const instance = axios.create({ timeout: 1000 * 300 })

// 注册请求拦截器，给需要访问父级系统接口的请求自动附加 iframe URL 中传入的 token。
instance.interceptors.request.use(
  /**
   * 处理即将发送的 axios 请求配置。
   *
   * @param config - axios 当前请求配置，包含 headers、url、method 和请求体等信息。
   * @returns 合并父级 token 请求头后的请求配置。
   * @throws 当前函数不主动抛错；getParentTokenHeaders 内部已经对存储读取做了容错。
   * @remarks
   * - 如果 URL 中没有父级 token，则不会额外添加 Authorization。
   * - 调用方显式传入的 Authorization 会被保留，避免覆盖特殊接口的自定义鉴权。
   */
  config => {
    // 读取由 iframe URL 或 postMessage 缓存的父级 token 请求头。
    const tokenHeaders = getParentTokenHeaders()
    // 合并请求头；已有 headers 放在后面，确保调用方可按需覆盖默认 token。
    config.headers = {
      ...tokenHeaders,
      ...config.headers,
    } as typeof config.headers
    // 打印 axios 请求摘要，便于验证接口是否带上父级 token。
    console.info(AXIOS_DEBUG_PREFIX, 'request:start', {
      // 请求地址。
      url: config.url,
      // 请求方法。
      method: config.method,
      // 是否存在父级 token 请求头。
      hasParentTokenHeaders: Object.keys(tokenHeaders).length > 0,
      // 合并后的请求头名称。
      headerNames: Object.keys(config.headers || {}),
    })
    // 返回更新后的请求配置，继续发送真实请求。
    return config
  }
)

// 注册响应拦截器，统一处理成功响应、业务错误提示和网络异常。
instance.interceptors.response.use(
  /**
   * 处理 HTTP 层面成功返回的响应。
   *
   * @param response - axios 返回的完整响应对象，包含状态码、响应头和响应体。
   * @returns 当状态码位于 200 到 399 时返回 `response.data`，否则返回 rejected Promise。
   * @throws 当前函数不主动抛错，而是通过 Promise.reject 交给调用方处理。
   * @remarks axios 默认只会把 2xx 当作成功响应；这里保留 3xx 判断是项目历史容错逻辑。
   */
  response => {
    // 打印 axios 成功响应摘要，便于看到 mock/template 是否正常读取。
    console.info(AXIOS_DEBUG_PREFIX, 'response:success', {
      // 请求地址。
      url: response.config.url,
      // HTTP 状态码。
      status: response.status,
      // 响应顶层字段，避免完整数据刷屏。
      dataKeys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : [],
    })
    // 判断状态码是否落在成功或重定向范围内，保持项目对 2xx/3xx 的宽松处理。
    if (response.status >= 200 && response.status < 400) {
      // 只向业务层返回接口数据本体，隐藏 axios 响应包装结构。
      return Promise.resolve(response.data)
    }

    // 理论上大多数非成功状态会进入 error 分支；这里作为异常兜底提示未知请求错误。
    message.error('未知的请求错误！')
    // 将原始响应作为拒绝原因返回，方便调用方在必要时读取状态码或响应体。
    return Promise.reject(response)
  },
  /**
   * 处理 HTTP 错误、服务端错误和网络超时。
   *
   * @param error - axios 抛出的错误对象，可能包含 `response`、`message` 或底层网络错误。
   * @returns 始终返回 rejected Promise，使调用方可以继续在 catch 中处理。
   * @throws 当前函数不主动抛错，而是用 Promise.reject 传递错误信息。
   * @remarks
   * - 4xx 和 5xx 当前都只 reject `error.message`，不额外弹出提示。
   * - 没有 response 的情况通常代表断网、跨域失败、DNS 失败或请求超时。
   */
  error => {
    // 打印 axios 错误摘要，便于排查父项目接口跨域、鉴权或网络失败。
    console.error(AXIOS_DEBUG_PREFIX, 'response:error', {
      // 请求地址。
      url: error?.config?.url,
      // HTTP 状态码；没有 response 时通常是网络或跨域问题。
      status: error?.response?.status,
      // axios 错误消息。
      message: error?.message,
      // 原始错误对象。
      error,
    })
    // 存在 response 表示服务端已经返回 HTTP 响应，只是状态码不在 axios 默认成功范围内。
    if (error && error.response) {
      // 4xx 通常代表客户端请求问题，例如鉴权失败、参数错误或资源不存在。
      if (error.response.status >= 400 && error.response.status < 500) {
        // 保持既有行为：不弹全局提示，只把错误消息交给调用方。
        return Promise.reject(error.message)
      }
      // 5xx 通常代表服务端内部错误、网关错误或服务不可用。
      else if (error.response.status >= 500) {
        // 保持既有行为：不弹全局提示，只把错误消息交给调用方。
        return Promise.reject(error.message)
      }
      
      // 非常规状态码进入兜底提示，例如某些代理或浏览器特殊状态。
      message.error('服务器遇到未知错误！')
      // 将 axios 错误消息作为拒绝原因返回，避免调用方依赖完整错误对象结构。
      return Promise.reject(error.message)
    }

    // 没有 response 时通常是连接失败、跨域阻断或超时，因此给用户一个通用网络提示。
    message.error('连接到服务器失败 或 服务器响应超时！')
    // 保留原始错误对象，便于调用方或调试工具查看底层错误信息。
    return Promise.reject(error)
  }
)

// 导出统一 axios 实例，供 services 层集中复用。
export default instance
