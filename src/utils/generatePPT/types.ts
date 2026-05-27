/**
 * AI PPT 生成任务的日志 ID 类型。
 *
 * 设计说明：
 * - 父项目通常会把数据库记录 ID 作为数字传入，也可能为了前端联调传入字符串。
 * - 当前模块只负责原样回传，不对 ID 做数学运算，因此允许 string / number 两类稳定可序列化值。
 */
export type GeneratePPTLogId = string | number

/**
 * AI 生成的封面页结构。
 *
 * 边界说明：
 * - title 是封面主标题，缺失时渲染层会使用兜底文案，避免 PPTX 出现空白首页。
 * - text 是封面副标题，缺失时允许为空字符串，因为有些业务只需要主标题。
 */
export interface AIPPTCoverSlide {
  type: 'cover'
  data?: {
    title?: string
    text?: string
  }
}

/**
 * AI 生成的目录页结构。
 *
 * 边界说明：
 * - items 允许缺失或不是数组，解析后会被规范化为空数组，渲染层再使用兜底目录项。
 * - offset 兼容 PPTist 原有 AIPPT 数据结构，当前独立生成链路不依赖它做布局计算。
 */
export interface AIPPTContentsSlide {
  type: 'contents'
  data?: {
    items?: string[]
  }
  offset?: number
}

/**
 * AI 生成的章节过渡页结构。
 *
 * 边界说明：
 * - title 用于章节名，text 用于章节说明；任一字段为空时都不会阻断生成。
 * - 过渡页在 PPTX 中按独立页面渲染，便于父项目生成的章节结构完整保留。
 */
export interface AIPPTTransitionSlide {
  type: 'transition'
  data?: {
    title?: string
    text?: string
  }
}

/**
 * AI 生成的正文页条目结构。
 *
 * 边界说明：
 * - title 作为条目小标题，text 作为条目正文。
 * - 字段缺失时会转为空字符串，避免渲染函数访问 undefined 后拼接出异常文本。
 */
export interface AIPPTContentItem {
  title?: string
  text?: string
}

/**
 * AI 生成的正文页结构。
 *
 * 边界说明：
 * - items 可能过长，PPTX 渲染层会裁剪到单页可读数量，避免文字互相重叠。
 * - offset 兼容原有 PPTist 数据结构，当前独立生成链路保留但不主动使用。
 */
export interface AIPPTContentSlide {
  type: 'content'
  data?: {
    title?: string
    items?: AIPPTContentItem[]
  }
  offset?: number
}

/**
 * AI 生成的结束页结构。
 *
 * 设计说明：
 * - end 页通常没有 data 字段。
 * - 为了兼容不同后端输出，渲染层会允许 data 中存在 title / text 并优先使用。
 */
export interface AIPPTEndSlide {
  type: 'end'
  data?: {
    title?: string
    text?: string
  }
}

/** AI PPT 支持的页面联合类型。 */
export type AIPPTSlide = AIPPTCoverSlide | AIPPTContentsSlide | AIPPTTransitionSlide | AIPPTContentSlide | AIPPTEndSlide

/**
 * 图片池条目。
 *
 * 兼容说明：
 * - src / url / path / fileUrl 都可能来自不同父项目字段命名，渲染层会按顺序取第一个有效地址。
 * - type 用于未来区分背景图、页面配图、条目配图；当前实现只做温和兼容，不强依赖该字段。
 */
export interface AIPPTImagePoolItem {
  src?: string
  url?: string
  path?: string
  fileUrl?: string
  type?: string
  [key: string]: unknown
}

/**
 * 主题入参。
 *
 * 说明：
 * - 字段命名兼容 PPTist 常见 theme 结构。
 * - 所有字段都是可选值，生成时会与本目录内置默认主题合并，保证任意缺失字段都不会阻断流程。
 */
export interface GeneratePPTTheme {
  backgroundColor?: string
  themeColors?: string[]
  fontColor?: string
  fontName?: string
  [key: string]: unknown
}

/**
 * PPTist 模板 JSON 的最小结构。
 *
 * 说明：
 * - public/mocks/template_x.json 中包含大量 PPTist slide/elements 字段。
 * - 当前 generatePPT 目录只在类型层声明本功能真正需要读取的最小字段，其他字段通过索引签名保留。
 */
export interface GeneratePPTTemplate {
  /** 模板标题，主要用于日志或未来兜底文件名。 */
  title?: string
  /** 模板画布宽度，单位是 PPTist 内部像素坐标。 */
  width?: number
  /** 模板画布高度，单位是 PPTist 内部像素坐标。 */
  height?: number
  /** 模板主题，当前会与 payload.theme 合并后参与生成。 */
  theme?: GeneratePPTTheme
  /** 模板 slide 列表，当前保留给后续完整元素级套版扩展。 */
  slides?: unknown[]
  /** 其他模板字段，保持原始 JSON 兼容。 */
  [key: string]: unknown
}

/**
 * 已解析的模板上下文。
 *
 * 说明：
 * - handleGenerateAIPPTSlides 会先构建模板上下文，再进入 PPTX 生成。
 * - 这样可以保证“读取模板 JSON”是生成链路中的明确步骤，而不是调用方的隐式工作。
 */
export interface GeneratePPTTemplateContext {
  templateId: string
  source: 'payload' | 'mock-json'
  template?: GeneratePPTTemplate
  slides: unknown[]
  theme?: GeneratePPTTheme
}

/**
 * 父项目调用 AI PPT 生成的载荷。
 *
 * 重要约束：
 * - logId 是必填字段，生成成功后会原样回传，父项目依赖它关联异步任务。
 * - content 是核心页面数据，支持数组、JSON 数组字符串、JSONL 字符串和连续 JSON 对象字符串。
 * - title 用于导出文件名，缺失时会使用中文默认文件名。
 */
export interface AiPptGeneratePayload {
  logId: GeneratePPTLogId
  content?: string | AIPPTSlide[] | unknown[]
  templateSlides?: unknown[]
  templateId?: GeneratePPTLogId
  imgs?: AIPPTImagePoolItem[]
  theme?: GeneratePPTTheme
  title?: string
  viewportRatio?: number
  append?: boolean
  uploadUrl?: string
  token?: string
  parentToken?: string
  [key: string]: unknown
}

/**
 * 上传接口返回的文件信息。
 *
 * 兼容说明：
 * - 后端常见字段包括 attaId、id、url、path、name。
 * - 当前模块会保留后端原始字段，并额外补齐 fileName / fileUrl 方便父项目读取。
 */
export interface AiPptFileInfo {
  attaId?: GeneratePPTLogId
  id?: GeneratePPTLogId
  url?: string
  path?: string
  name?: string
  fileName?: string
  fileUrl?: string
  [key: string]: unknown
}

/**
 * AI PPT 保存成功后的回包结构。
 *
 * 说明：
 * - logId 原样来自入参。
 * - file 是上传后的后端文件对象。
 * - slideCount 是实际写入 PPTX 的页数，用于父项目展示或排查生成质量。
 */
export interface AiPptSavedPayload {
  logId: GeneratePPTLogId
  file: AiPptFileInfo
  slideCount: number
  [key: string]: unknown
}

/**
 * PPTX 生成后的浏览器文件信息。
 *
 * 说明：
 * - file 是最终上传接口需要的 File 对象。
 * - slideCount 是渲染阶段统计出的页面数量，避免上传后再反解析 PPTX。
 */
export interface GeneratedPPTXFile {
  file: File
  slideCount: number
}
