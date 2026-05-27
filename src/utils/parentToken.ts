/**
 * 父级系统 token 在 sessionStorage 中的缓存键。
 *
 * 功能描述：
 * - 保存从 iframe URL query 中读取到的父级鉴权 token。
 * - 让后续 service 请求即使在同一会话内刷新页面，也能继续读取 token。
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
 * - sessionStorage 只在当前浏览器标签页会话内有效，关闭标签页后会自动清理。
 */
const PARENT_TOKEN_STORAGE_KEY = 'PPTIST_PARENT_TOKEN'

/**
 * 父子项目通信调试日志前缀。
 *
 * 功能描述：
 * - 统一父级 token 相关打印的检索关键词。
 * - 方便在浏览器控制台通过 `[PPTist ParentToken]` 过滤父项目鉴权链路。
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
 * - 这里只记录 token 是否存在和长度，不打印 token 原文，避免调试日志泄露鉴权信息。
 */
const PARENT_TOKEN_DEBUG_PREFIX = '[PPTist ParentToken]'

/**
 * 父级系统 token 的内存缓存。
 *
 * 功能描述：
 * - 避免每次请求都重复解析 URL 或访问 sessionStorage。
 * - 在运行时通过 `setParentToken()` 更新后立即对后续请求生效。
 *
 * 入参：
 * - 模块级变量没有入参。
 *
 * 返回值：
 * - 模块级变量没有返回值。
 *
 * 异常：
 * - 变量声明不会抛出异常。
 *
 * 注意事项：
 * - 这里不使用 localStorage，避免 token 在浏览器长期持久化。
 */
let parentToken = ''

/**
 * 从 URL query 中读取父级传入的 token。
 *
 * @returns URL query 中的 token；不存在时返回空字符串。
 * @throws 当前函数不主动抛错；URLSearchParams 读取失败时会走浏览器运行时错误。
 * @remarks
 * - 支持 `parentToken`、`token`、`access_token` 三种常见参数名。
 * - 优先级从更明确的 `parentToken` 到通用的 `token`，再到 OAuth 风格的 `access_token`。
 */
const readParentTokenFromUrl = () => {
  // 解析当前页面 query 参数，iframe 嵌入方可以通过 src 直接传入 token。
  const searchParams = new URLSearchParams(window.location.search)
  // 优先读取语义最明确的 parentToken。
  const explicitParentToken = searchParams.get('parentToken')
  // 读取常见短参数 token，兼容已有业务系统的 URL 规范。
  const token = searchParams.get('token')
  // 读取 OAuth 常见参数 access_token，兼容第三方鉴权回调命名。
  const accessToken = searchParams.get('access_token')

  // 返回第一个非空 token，所有参数都缺失时返回空字符串。
  return explicitParentToken || token || accessToken || ''
}

/**
 * 缓存父级系统 token。
 *
 * @param token - 父级系统传入的鉴权 token；空字符串会清空当前缓存。
 * @returns 无显式返回值。
 * @throws 当前函数不主动抛错；sessionStorage 被浏览器策略禁用时会静默忽略缓存写入失败。
 * @remarks
 * - token 会同时写入内存变量和 sessionStorage。
 * - 该函数不会对 token 做格式校验，Bearer 前缀会在请求头构造阶段统一追加。
 */
export const setParentToken = (token: string) => {
  // 将传入 token 归一化为字符串，避免 null/undefined 在后续请求头里变成字面量。
  parentToken = token || ''
  // 打印 token 更新状态；只展示是否存在和长度，避免完整 token 泄露到控制台。
  console.info(PARENT_TOKEN_DEBUG_PREFIX, 'setParentToken()', {
    // 表示当前调用后是否存在可用父级 token。
    hasToken: !!parentToken,
    // 仅用于排查是否拿到完整字符串，不暴露 token 明文。
    tokenLength: parentToken.length,
  })

  // sessionStorage 可能因隐私模式或浏览器策略不可用，因此缓存写入需要兜底。
  try {
    // 有 token 时写入 sessionStorage，便于同一会话内刷新后继续使用。
    if (parentToken) sessionStorage.setItem(PARENT_TOKEN_STORAGE_KEY, parentToken)
    // 传入空 token 时清理缓存，避免后续请求继续携带旧鉴权。
    else sessionStorage.removeItem(PARENT_TOKEN_STORAGE_KEY)
  }
  catch {
    // 忽略存储失败，内存缓存仍可保障当前页面生命周期内可用。
  }
}

/**
 * 从 URL 初始化父级系统 token。
 *
 * @returns 初始化后的 token；不存在时返回当前缓存或空字符串。
 * @throws 当前函数不主动抛错；sessionStorage 不可用时会静默降级为内存缓存。
 * @remarks
 * - 应用启动时调用一次即可。
 * - 如果 URL 中存在 token，会覆盖 sessionStorage 中的旧 token。
 */
export const initParentTokenFromUrl = () => {
  // 从 iframe URL 中读取父级传入的 token。
  const tokenFromUrl = readParentTokenFromUrl()
  // URL 带 token 时立即覆盖缓存，确保父级最新 token 生效。
  if (tokenFromUrl) setParentToken(tokenFromUrl)
  // 读取最终可用 token，可能来自 URL、sessionStorage 或内存缓存。
  const token = getParentToken()
  // 打印初始化结果，帮助确认 iframe 首次加载时父项目是否把 token 带进来了。
  console.info(PARENT_TOKEN_DEBUG_PREFIX, 'initParentTokenFromUrl()', {
    // 标记 URL query 中是否直接带了 token。
    hasTokenFromUrl: !!tokenFromUrl,
    // 标记当前最终缓存中是否已有 token。
    hasToken: !!token,
    // 只打印长度用于排查截断问题，不打印真实 token。
    tokenLength: token.length,
  })
  // 返回最终可用 token，方便调用方上报 ready 状态时附带 hasToken。
  return token
}

/**
 * 获取当前父级系统 token。
 *
 * @returns 当前可用 token；没有 token 时返回空字符串。
 * @throws 当前函数不主动抛错；sessionStorage 不可用时会静默降级为空字符串。
 * @remarks
 * - 优先返回内存缓存。
 * - 内存缓存为空时尝试读取 sessionStorage，兼容页面刷新后的请求。
 */
export const getParentToken = () => {
  // 内存缓存命中时直接返回，避免频繁访问 sessionStorage。
  if (parentToken) return parentToken

  // sessionStorage 读取可能受浏览器策略影响，需要异常兜底。
  try {
    // 读取同一标签页会话内缓存的 token。
    const tokenFromStorage = sessionStorage.getItem(PARENT_TOKEN_STORAGE_KEY)
    // 有缓存时同步回内存变量，后续请求可以更快读取。
    if (tokenFromStorage) parentToken = tokenFromStorage
  }
  catch {
    // 忽略读取失败，返回空字符串即可。
  }

  // 返回最终 token；没有可用值时为空字符串。
  return parentToken
}

/**
 * 构造父级 token 请求头。
 *
 * @returns 包含 Authorization 的请求头对象；没有 token 时返回空对象。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 当前同时使用 `Authorization: Bearer <token>` 和 `x-auth-token: <token>`。
 * - `x-auth-token` 的拼写对齐外部项目请求拦截器，便于后续直接调用同一套后端接口。
 */
export const getParentTokenHeaders = (): Record<string, string> => {
  // 读取当前 token，可能来自 URL、sessionStorage 或运行时 postMessage。
  const token = getParentToken()
  // 没有 token 时返回空对象，避免污染无需鉴权的请求。
  if (!token) {
    // 打印无 token 状态，便于验证父项目未传 token 时请求头不会被误加。
    console.debug(PARENT_TOKEN_DEBUG_PREFIX, 'getParentTokenHeaders(): empty')
    // 返回空对象，保持原始请求不附加鉴权头。
    return {}
  }

  // 返回标准 Bearer 鉴权头，后续 axios/fetch 会合并到请求 headers。
  const headers = {
    // 对齐外部项目中 `headers['Authorization'] = 'Bearer ' + token` 的写法。
    Authorization: `Bearer ${token}`,
    // 对齐外部项目中 `headers['x-auth-token'] = storageLocal.getItem("xwAuth")` 的写法。
    'x-auth-token': token,
  }
  // 打印实际会附加的请求头名称，不输出请求头值，便于确认父项目鉴权是否进入接口请求。
  console.debug(PARENT_TOKEN_DEBUG_PREFIX, 'getParentTokenHeaders(): attached', {
    // 只展示 header key，避免 Authorization 值出现在日志里。
    headerNames: Object.keys(headers),
    // 只展示 token 长度用于排查是否缺失或截断。
    tokenLength: token.length,
  })
  // 返回父级鉴权请求头。
  return headers
}
