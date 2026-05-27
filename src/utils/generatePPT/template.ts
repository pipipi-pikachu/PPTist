import { DEFAULT_TEMPLATE_ID, GENERATE_PPT_LOG_PREFIX } from './constants'
import type { AiPptGeneratePayload, GeneratePPTTemplate, GeneratePPTTemplateContext, GeneratePPTTheme } from './types'

/**
 * 把任意模板 ID 转成可安全读取 public/mocks 的文件名。
 *
 * @param templateId - 父项目传入的模板 ID。
 * @returns 可用于 `./mocks/${id}.json` 的模板 ID。
 */
const normalizeTemplateId = (templateId: unknown): string => {
  /**
   * rawTemplateId 保存模板 ID 的字符串形态。
   *
   * 容错说明：
   * - templateId 为空时使用默认模板。
   * - 数字 ID 会转成字符串，兼容父项目用数字枚举模板的情况。
   */
  const rawTemplateId = templateId === null || templateId === undefined || templateId === ''
    ? DEFAULT_TEMPLATE_ID
    : String(templateId).trim()

  /**
   * emptyFallback 是空白字符串兜底。
   *
   * 边界说明：
   * - String(templateId).trim() 后仍可能为空。
   * - 空模板 ID 无法拼出有效文件名，因此回退到 template_1。
   */
  const emptyFallback = rawTemplateId || DEFAULT_TEMPLATE_ID

  /**
   * 合法模板文件名分支。
   *
   * 安全说明：
   * - 只允许字母、数字、下划线和短横线，避免 `../` 这类路径穿越。
   * - public/mocks 下现有模板是 template_1 到 template_8，这个规则也兼容后续 template_x 命名。
   */
  if (/^[a-zA-Z0-9_-]+$/.test(emptyFallback)) return emptyFallback

  /**
   * 非法模板 ID 兜底。
   *
   * 处理说明：
   * - 这里选择抛错，而不是静默回退。
   * - 静默回退会让父项目误以为指定模板已生效，排查更困难。
   */
  throw new Error(`templateId 包含非法字符，无法读取模板 JSON：${emptyFallback}`)
}

/**
 * 合并模板主题和父项目主题。
 *
 * @param templateTheme - 模板 JSON 中的主题。
 * @param payloadTheme - 父项目传入的主题。
 * @returns 合并后的主题。
 */
const mergeTheme = (templateTheme?: GeneratePPTTheme, payloadTheme?: GeneratePPTTheme): GeneratePPTTheme | undefined => {
  /**
   * 两个主题都缺失的分支。
   *
   * 说明：
   * - 返回 undefined，让 pptx.ts 继续使用本地默认导出主题。
   * - 这样不会制造一个空对象影响下游默认值判断。
   */
  if (!templateTheme && !payloadTheme) return undefined

  /**
   * mergedTheme 保存最终主题。
   *
   * 优先级说明：
   * - 模板 theme 提供基础视觉风格。
   * - payload.theme 覆盖模板字段，方便父项目针对单次任务定制。
   * - 这里只做浅合并，themeColors 作为数组整体覆盖，避免颜色顺序被意外拼接。
   */
  const mergedTheme: GeneratePPTTheme = {
    ...(templateTheme || {}),
    ...(payloadTheme || {}),
  }

  return mergedTheme
}

/**
 * 从 public/mocks 读取模板 JSON。
 *
 * @param templateId - 已规范化的模板 ID。
 * @returns 模板 JSON 对象。
 */
const fetchTemplateJson = async (templateId: string): Promise<GeneratePPTTemplate> => {
  /**
   * templatePath 是模板 JSON 的静态资源路径。
   *
   * 路径说明：
   * - 保持和原项目 `api.getMockData(filename)` 一致，即 `./mocks/${filename}.json`。
   * - Vite 会把 public 目录作为站点根静态资源，因此运行时可以直接请求该路径。
   */
  const templatePath = `./mocks/${templateId}.json`

  /**
   * response 是模板 JSON 请求响应。
   *
   * 边界说明：
   * - 文件不存在时通常返回 404。
   * - 服务器异常、跨域或离线时 fetch 会抛错或返回非 ok 状态。
   */
  const response = await fetch(templatePath, {
    method: 'GET',
  })

  /**
   * HTTP 状态保护。
   *
   * 说明：
   * - 模板是生成 PPT 的视觉基础，读取失败应明确中断。
   * - 错误里包含路径和状态码，便于确认是 templateId 错误还是静态资源未部署。
   */
  if (!response.ok) throw new Error(`读取模板 JSON 失败：${templatePath}，HTTP ${response.status}`)

  /**
   * template 是解析后的模板对象。
   *
   * 注意事项：
   * - response.json() 会在 JSON 格式错误时抛错。
   * - public/mocks/template_x.json 文件较大，但浏览器解析该级别 JSON 一般可接受。
   */
  const template = await response.json()

  /**
   * 模板对象结构保护。
   *
   * 边界说明：
   * - 如果文件内容不是对象，后续读取 theme/slides 没有意义。
   * - 这里不强制 slides 必须存在，因为父项目可能只想复用 theme。
   */
  if (!template || typeof template !== 'object' || Array.isArray(template)) {
    throw new Error(`模板 JSON 格式错误：${templatePath}`)
  }

  return template as GeneratePPTTemplate
}

/**
 * 获取本次生成使用的模板上下文。
 *
 * @param payload - 父项目传入的生成载荷。
 * @returns 模板上下文，包含模板 ID、来源、slides 和合并主题。
 */
export const resolveGeneratePPTTemplate = async (payload: AiPptGeneratePayload): Promise<GeneratePPTTemplateContext> => {
  /**
   * templateId 是本次任务的模板 ID。
   *
   * 规则说明：
   * - 父项目传入 payload.templateId 时优先使用。
   * - 未传时使用 DEFAULT_TEMPLATE_ID，也就是 template_1。
   */
  const templateId = normalizeTemplateId(payload.templateId)

  /**
   * 父项目直接传入 templateSlides 的分支。
   *
   * 说明：
   * - 这种情况下不再请求 public/mocks，避免重复网络请求。
   * - 主题仍然只使用 payload.theme，因为没有完整模板 JSON 可读。
   */
  if (Array.isArray(payload.templateSlides) && payload.templateSlides.length) {
    console.info(GENERATE_PPT_LOG_PREFIX, 'resolveTemplate:from payload', {
      templateId,
      templateSlidesCount: payload.templateSlides.length,
      hasPayloadTheme: !!payload.theme,
    })

    return {
      templateId,
      source: 'payload',
      slides: payload.templateSlides,
      theme: payload.theme,
    }
  }

  /**
   * 默认模板 JSON 读取分支。
   *
   * 说明：
   * - 路径保持 `./mocks/${templateId}.json`。
   * - 读取后的 theme 会与 payload.theme 合并。
   */
  const template = await fetchTemplateJson(templateId)

  /**
   * templateSlides 保存模板中的 slides 数组。
   *
   * 容错说明：
   * - slides 缺失或不是数组时使用空数组，并通过日志暴露异常形态。
   * - 当前生成链路不会因为 slides 为空中断，因为主题仍可参与生成。
   */
  const templateSlides = Array.isArray(template.slides) ? template.slides : []

  /**
   * theme 是模板主题和父项目主题合并后的结果。
   *
   * 说明：
   * - payload.theme 优先级更高。
   * - 模板 theme 可以让不同 template_x.json 的颜色和字体参与生成结果。
   */
  const theme = mergeTheme(template.theme, payload.theme)

  console.info(GENERATE_PPT_LOG_PREFIX, 'resolveTemplate:from mock-json', {
    templateId,
    templateSlidesCount: templateSlides.length,
    hasTemplateTheme: !!template.theme,
    hasPayloadTheme: !!payload.theme,
  })

  return {
    templateId,
    source: 'mock-json',
    template,
    slides: templateSlides,
    theme,
  }
}
