import type { AiPptFileInfo, AiPptGeneratePayload } from './types'
import { DEFAULT_UPLOAD_URL } from './constants'
import { isNonEmptyString } from './helpers'

/**
 * 从当前页面 URL 中读取父项目透传 token。
 *
 * @returns URL 参数中的 token；没有时返回空字符串。
 */
const getTokenFromUrl = (): string => {
  /**
   * window 存在性判断：
   * - 当前模块主要运行在浏览器 iframe 中。
   * - 如果未来被测试环境或 Node 环境直接调用，没有 window 时不能抛出 ReferenceError。
   */
  if (typeof window === 'undefined') return ''

  /**
   * params 保存当前页面查询参数。
   *
   * 容错说明：
   * - URLSearchParams 对不存在字段会返回 null。
   * - 下方按常见字段名顺序读取，兼容不同父项目命名。
   */
  const params = new URLSearchParams(window.location.search)

  /**
   * token 是第一个可用鉴权字段。
   *
   * 字段说明：
   * - parentToken 是 iframeBridge 当前链路常用字段。
   * - token / access_token / authorization 兼容其他接入方式。
   */
  return params.get('parentToken') || params.get('token') || params.get('access_token') || params.get('authorization') || ''
}

/**
 * 从 payload 中读取可用上传 token。
 *
 * @param payload - 父项目传入的生成载荷。
 * @returns 规范化后的 token；没有时返回空字符串。
 */
const resolveUploadToken = (payload: AiPptGeneratePayload): string => {
  /**
   * rawToken 按优先级读取 token。
   *
   * 设计说明：
   * - payload.token 优先级最高，方便父项目显式指定。
   * - payload.parentToken 兼容父项目按 iframe URL 命名传入。
   * - URL token 作为最后兜底，保持当前 iframe 联调方式可用。
   */
  const rawToken = isNonEmptyString(payload.token)
    ? payload.token
    : isNonEmptyString(payload.parentToken)
      ? payload.parentToken
      : getTokenFromUrl()

  /**
   * token 规范化：
   * - 去掉可能已经存在的 Bearer 前缀。
   * - 最终 headers 中会统一补回 Bearer，避免出现 Bearer Bearer xxx。
   */
  return rawToken.replace(/^Bearer\s+/i, '').trim()
}

/**
 * 解析上传接口地址。
 *
 * @param payload - 父项目传入的生成载荷。
 * @returns 本次上传使用的 URL。
 */
const resolveUploadUrl = (payload: AiPptGeneratePayload): string => {
  /**
   * payload.uploadUrl 优先。
   *
   * 边界说明：
   * - 非空字符串才视为有效地址。
   * - 不在这里强制校验 URL 格式，允许相对路径上传接口。
   */
  if (isNonEmptyString(payload.uploadUrl)) return payload.uploadUrl.trim()

  /**
   * 默认上传接口兜底。
   *
   * 说明：
   * - 保持与当前项目 iframeBridge 联调后端一致。
   * - 后续父项目若有不同环境，可以通过 uploadUrl 覆盖。
   */
  return DEFAULT_UPLOAD_URL
}

/**
 * 规范化上传接口返回的文件信息。
 *
 * @param result - 后端接口完整返回体。
 * @returns 兼容父项目读取习惯的文件信息。
 */
const normalizeUploadFileInfo = (result: unknown): AiPptFileInfo => {
  /**
   * responseRecord 是后端返回体的宽松对象视图。
   *
   * 容错说明：
   * - 有些 fetch 响应可能不是对象，这里会退化为空对象。
   * - 后续字段读取都需要防御式处理。
   */
  const responseRecord = result && typeof result === 'object' ? result as Record<string, unknown> : {}

  /**
   * data 是后端返回的数据主体。
   *
   * 兼容说明：
   * - 常见结构是 { code: 200, data: [...] }。
   * - 如果后端直接返回文件对象，也允许使用整个 result 作为文件信息。
   */
  const data = responseRecord.data

  /**
   * fileInfoRaw 是最终文件对象的原始形态。
   *
   * 边界说明：
   * - data 为数组时取第一项，因为当前只上传一个 PPTX 文件。
   * - data 为对象时直接使用。
   * - data 缺失时尝试使用 responseRecord 本身。
   */
  const fileInfoRaw = Array.isArray(data) ? data[0] : data || responseRecord

  /**
   * 文件信息必须是对象。
   *
   * 说明：
   * - 如果后端返回字符串或空值，父项目无法可靠读取文件地址。
   * - 此时抛错比返回残缺对象更容易定位问题。
   */
  if (!fileInfoRaw || typeof fileInfoRaw !== 'object') throw new Error('保存 PPTX 文件失败：接口未返回文件信息')

  /**
   * fileInfo 是可读写的文件对象副本。
   *
   * 设计说明：
   * - 使用浅拷贝保留后端原始字段。
   * - 下方补充 id、fileName、fileUrl 等兼容字段。
   */
  const fileInfo = { ...(fileInfoRaw as Record<string, unknown>) } as AiPptFileInfo

  /**
   * id 兼容字段：
   * - 后端常返回 attaId，父项目也可能读取 id。
   * - 如果 id 已存在则不覆盖，避免破坏后端自定义主键。
   */
  fileInfo.id = fileInfo.id ?? fileInfo.attaId

  /**
   * fileName 兼容字段：
   * - 优先使用已有 fileName。
   * - 没有时使用 name，满足父项目常见显示需求。
   */
  fileInfo.fileName = fileInfo.fileName ?? fileInfo.name

  /**
   * fileUrl 兼容字段：
   * - 优先使用已有 fileUrl。
   * - 没有时使用 url，方便父项目统一按 fileUrl 读取。
   */
  fileInfo.fileUrl = fileInfo.fileUrl ?? fileInfo.url

  return fileInfo
}

/**
 * 上传生成后的 PPTX 文件。
 *
 * @param file - 待上传 PPTX 文件。
 * @param payload - 父项目传入的生成载荷，用于读取上传地址和 token。
 * @returns 后端返回并规范化后的文件信息。
 */
export const uploadPPTXFile = async (file: File, payload: AiPptGeneratePayload): Promise<AiPptFileInfo> => {
  /**
   * uploadUrl 是本次请求地址。
   *
   * 边界说明：
   * - 支持 payload.uploadUrl 覆盖。
   * - 默认地址服务不可用时，fetch 会抛出网络异常，由上层捕获或继续抛出。
   */
  const uploadUrl = resolveUploadUrl(payload)

  /**
   * token 是鉴权令牌。
   *
   * 说明：
   * - token 为空时不设置 Authorization，兼容无需鉴权的本地接口。
   * - token 非空时统一使用 Bearer 格式。
   */
  const token = resolveUploadToken(payload)

  /**
   * formData 是 multipart/form-data 请求体。
   *
   * 重要约定：
   * - 字段名使用 files，保持与当前后端 /file/upload 接口一致。
   * - 只追加一个文件，因为本功能一次只生成一份 PPTX。
   */
  const formData = new FormData()
  formData.append('files', file)

  /**
   * headers 保存可选请求头。
   *
   * 潜在坑点：
   * - 使用 FormData 时不要手动设置 Content-Type，浏览器需要自动附带 boundary。
   * - 这里只有 Authorization，因此不会破坏 multipart 编码。
   */
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined

  /**
   * 发起上传请求。
   *
   * 说明：
   * - fetch 没有内置 timeout；当前实现保持简单稳定，不引入额外 AbortController。
   * - 如果业务需要超时控制，可以在本目录内继续扩展。
   */
  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
    headers,
  })

  /**
   * HTTP 状态保护：
   * - 非 2xx 直接视为上传失败。
   * - 错误消息包含状态码，便于定位网关、鉴权或后端异常。
   */
  if (!response.ok) throw new Error(`保存 PPTX 文件失败：HTTP ${response.status}`)

  /**
   * result 是后端 JSON 返回体。
   *
   * 边界说明：
   * - 上传接口预期返回 JSON。
   * - 如果返回非 JSON，response.json() 会抛错，说明接口协议不匹配。
   */
  const result = await response.json()

  /**
   * 业务状态码保护：
   * - 当前后端常用 code === 200 表示成功。
   * - 如果 code 缺失，则认为接口直接返回文件对象，交给 normalizeUploadFileInfo 处理。
   */
  if (result && typeof result === 'object' && 'code' in result) {
    const code = String((result as Record<string, unknown>).code)
    if (code !== '200') throw new Error('保存 PPTX 文件失败')
  }

  return normalizeUploadFileInfo(result)
}
