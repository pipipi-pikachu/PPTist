import type { AIPPTContentItem, AIPPTSlide } from './types'
import { toDisplayText } from './helpers'

/**
 * 从字符串中提取多个完整 JSON 对象或数组片段。
 *
 * @param source - 父项目传入的原始字符串。
 * @returns 可独立 JSON.parse 的片段数组。
 */
const extractJsonChunks = (source: string): string[] => {
  /**
   * chunks 用于保存已经识别出来的 JSON 片段。
   *
   * 用途说明：
   * - 父项目注释中的 content 是多个 JSON 对象用空行拼接，不是合法 JSON 数组。
   * - 这里通过括号深度扫描，把连续 JSON 对象拆成可解析的独立片段。
   */
  const chunks: string[] = []

  /**
   * startIndex 记录当前 JSON 片段的起始位置。
   *
   * 边界说明：
   * - -1 表示当前尚未进入 JSON 对象或数组。
   * - 只有遇到第一层 { 或 [ 时才会设置，避免开头空白影响截取。
   */
  let startIndex = -1

  /**
   * depth 记录 JSON 对象 / 数组嵌套深度。
   *
   * 潜在坑点：
   * - 不能简单按换行切分，因为正文 text 内可能包含换行。
   * - 只有 depth 从 1 回到 0 时，才说明一个完整 JSON 片段结束。
   */
  let depth = 0

  /**
   * inString 标记扫描位置是否位于 JSON 字符串内部。
   *
   * 设计说明：
   * - 字符串内部的 {、}、[、] 都只是文本，不能影响 depth。
   * - 该状态配合 escaped 处理 \" 这种转义引号。
   */
  let inString = false

  /**
   * escaped 标记当前字符是否被反斜杠转义。
   *
   * 边界说明：
   * - JSON 字符串里可能出现 \\ 或 \"。
   * - 被转义的引号不能切换 inString，否则会提前结束片段。
   */
  let escaped = false

  /**
   * 逐字符扫描原始字符串。
   *
   * 循环变量说明：
   * - index 是当前字符下标，用于截取完整 JSON 片段。
   * - char 是当前字符，所有状态判断都基于它。
   */
  for (let index = 0; index < source.length; index++) {
    const char = source[index]

    /**
     * 字符串状态处理：
     * - 如果当前已经在字符串内部，需要优先处理转义和引号。
     * - 字符串内部除引号和反斜杠外的字符不会改变结构深度。
     */
    if (inString) {
      if (escaped) {
        escaped = false
      }
      else if (char === '\\') {
        escaped = true
      }
      else if (char === '"') {
        inString = false
      }
      continue
    }

    /**
     * 字符串开始分支：
     * - 只有不在字符串内部时，双引号才表示字符串开始。
     * - 进入字符串后继续下一轮，避免引号参与括号深度计算。
     */
    if (char === '"') {
      inString = true
      continue
    }

    /**
     * JSON 结构开始分支：
     * - { 和 [ 都可能作为一个完整 JSON 片段的起点。
     * - depth 为 0 时记录 startIndex，表示新片段从这里开始。
     */
    if (char === '{' || char === '[') {
      if (depth === 0) startIndex = index
      depth++
      continue
    }

    /**
     * JSON 结构结束分支：
     * - } 和 ] 会让深度减一。
     * - 当 depth 回到 0 且 startIndex 有效时，可以截取一个完整片段。
     */
    if (char === '}' || char === ']') {
      depth--
      if (depth === 0 && startIndex >= 0) {
        chunks.push(source.slice(startIndex, index + 1))
        startIndex = -1
      }
    }
  }

  /**
   * 返回扫描结果。
   *
   * 容错说明：
   * - 如果字符串括号不平衡，未闭合片段不会进入 chunks。
   * - 调用方会在 chunks 为空时抛出更明确的内容格式错误。
   */
  return chunks
}

/**
 * 把未知值规范化为正文条目数组。
 *
 * @param items - AI 输出的 items 字段。
 * @returns 可安全渲染的正文条目数组。
 */
const normalizeContentItems = (items: unknown): AIPPTContentItem[] => {
  /**
   * 非数组兜底分支：
   * - AI 可能把 items 输出成字符串或对象。
   * - 渲染层需要数组结构，因此无效值直接变成空数组。
   */
  if (!Array.isArray(items)) return []

  /**
   * 遍历 AI 条目数组并规范化每一项。
   *
   * 循环变量说明：
   * - item 是父项目或 AI 给出的原始条目。
   * - 字符串条目会放到 text 中，避免直接丢失信息。
   */
  return items.map(item => {
    /**
     * 字符串条目兼容分支：
     * - 有些模型会输出 ["内容1", "内容2"]。
     * - 这种情况下没有小标题，正文直接使用字符串本身。
     */
    if (typeof item === 'string') {
      return {
        title: '',
        text: toDisplayText(item),
      }
    }

    /**
     * 对象条目兼容分支：
     * - 标准结构是 { title, text }。
     * - 缺失字段会变为空字符串，避免渲染时出现 undefined。
     */
    if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>
      return {
        title: toDisplayText(record.title),
        text: toDisplayText(record.text),
      }
    }

    /**
     * 其他类型兜底分支：
     * - number / boolean 等值转成正文文本。
     * - 这样能最大限度保留 AI 输出信息，同时不破坏页面结构。
     */
    return {
      title: '',
      text: toDisplayText(item),
    }
  })
}

/**
 * 把未知对象规范化为 AI PPT 页面。
 *
 * @param value - 单页原始对象。
 * @returns 合法页面对象；无法识别时返回 null。
 */
const normalizeSlide = (value: unknown): AIPPTSlide | null => {
  /**
   * 非对象兜底分支：
   * - 单页必须至少有 type 字段。
   * - null、字符串、数字等都无法作为页面结构，直接跳过。
   */
  if (!value || typeof value !== 'object') return null

  /**
   * record 是宽松对象视图。
   *
   * 用途说明：
   * - AI 输出和父项目传参不一定完全符合 TypeScript 类型。
   * - 通过 Record 读取字段后再逐个规范化，可以提升容错能力。
   */
  const record = value as Record<string, unknown>

  /**
   * type 是页面类型。
   *
   * 边界说明：
   * - 不是字符串时无法分发到具体页面模板。
   * - 会统一转小写，兼容 Cover / CONTENT 等大小写不稳定输出。
   */
  const type = typeof record.type === 'string' ? record.type.toLowerCase() : ''

  /**
   * data 是页面业务数据。
   *
   * 容错说明：
   * - data 缺失或不是对象时使用空对象。
   * - 后续按页面类型读取字段并设置默认值。
   */
  const data = record.data && typeof record.data === 'object' ? record.data as Record<string, unknown> : {}

  /**
   * 封面页分支：
   * - 标准字段是 title / text。
   * - 缺失值规范化为空字符串，真正兜底文案由 PPT 渲染层决定。
   */
  if (type === 'cover') {
    return {
      type: 'cover',
      data: {
        title: toDisplayText(data.title),
        text: toDisplayText(data.text),
      },
    }
  }

  /**
   * 目录页分支：
   * - items 只保留字符串列表。
   * - 非字符串项会通过 toDisplayText 转换，避免数字序号等信息丢失。
   */
  if (type === 'contents') {
    const rawItems = Array.isArray(data.items) ? data.items : []
    const items = rawItems.map(item => toDisplayText(item)).filter(Boolean)
    return {
      type: 'contents',
      data: { items },
      offset: typeof record.offset === 'number' ? record.offset : undefined,
    }
  }

  /**
   * 章节过渡页分支：
   * - 章节标题和说明都允许为空。
   * - 空文本不会阻止页面生成，保证章节节奏不被破坏。
   */
  if (type === 'transition') {
    return {
      type: 'transition',
      data: {
        title: toDisplayText(data.title),
        text: toDisplayText(data.text),
      },
    }
  }

  /**
   * 正文页分支：
   * - items 统一规范化成 { title, text }[]。
   * - offset 保留给调用方调试或后续扩展，不影响当前布局。
   */
  if (type === 'content') {
    return {
      type: 'content',
      data: {
        title: toDisplayText(data.title),
        items: normalizeContentItems(data.items),
      },
      offset: typeof record.offset === 'number' ? record.offset : undefined,
    }
  }

  /**
   * 结束页分支：
   * - 标准 end 页没有 data，但这里兼容 title / text。
   * - 可让父项目在结束页写入“谢谢观看”等自定义内容。
   */
  if (type === 'end') {
    return {
      type: 'end',
      data: {
        title: toDisplayText(data.title),
        text: toDisplayText(data.text),
      },
    }
  }

  /**
   * 未知页面类型兜底分支：
   * - 直接返回 null，由上层过滤。
   * - 不抛错是为了允许 AI 偶尔输出额外说明对象时仍能生成有效页面。
   */
  return null
}

/**
 * 解析父项目传入的 AI 页面内容。
 *
 * @param content - 支持数组、JSON 数组字符串、JSONL 字符串或连续 JSON 对象字符串。
 * @returns 规范化后的 AI PPT 页面数组。
 */
export const parseAIPPTSlides = (content: unknown): AIPPTSlide[] => {
  /**
   * parsedValues 保存初步解析出的原始页面值。
   *
   * 用途说明：
   * - 数组输入可以直接复用。
   * - 字符串输入需要先解析为数组或多个对象。
   */
  let parsedValues: unknown[] = []

  /**
   * 数组输入分支：
   * - 本地联调或父项目已解析 JSON 时会走这里。
   * - 使用浅拷贝，避免后续规范化时让调用方误以为原数组被当前模块接管。
   */
  if (Array.isArray(content)) {
    parsedValues = [...content]
  }
  else if (typeof content === 'string') {
    /**
     * text 保存去除首尾空白后的内容字符串。
     *
     * 边界说明：
     * - 空字符串没有任何可生成页面，直接抛出明确错误。
     * - trim 不会改变 JSON 字符串内部正文内容。
     */
    const text = content.trim()
    if (!text) throw new Error('content 不能为空')

    try {
      /**
       * directParsed 优先尝试标准 JSON.parse。
       *
       * 支持场景：
       * - 标准 JSON 数组字符串：[{"type":"cover",...}]
       * - 单个 JSON 对象字符串：{"type":"cover",...}
       */
      const directParsed = JSON.parse(text)
      parsedValues = Array.isArray(directParsed) ? directParsed : [directParsed]
    }
    catch {
      /**
       * chunks 兼容 JSONL 或连续 JSON 对象。
       *
       * 重要说明：
       * - 父项目历史注释里出现过多个 JSON 对象用空行拼接的 content。
       * - 这种格式不是合法 JSON，但可以通过括号扫描拆成多个合法对象。
       */
      const chunks = extractJsonChunks(text)
      if (!chunks.length) throw new Error('content 不是合法 JSON、JSONL 或连续 JSON 对象')

      /**
       * 遍历 JSON 片段并逐个解析。
       *
       * 循环变量说明：
       * - chunk 是 extractJsonChunks 提取出的完整 JSON 字符串。
       * - 解析失败会抛出异常，提示调用方 content 格式仍有问题。
       */
      parsedValues = chunks.flatMap(chunk => {
        const value = JSON.parse(chunk)
        return Array.isArray(value) ? value : [value]
      })
    }
  }
  else {
    /**
     * 其他输入类型兜底分支：
     * - undefined、null、number、object 都不是当前协议支持的 content 根结构。
     * - 直接抛错能让父项目尽早发现传参问题。
     */
    throw new Error('content 不能为空')
  }

  /**
   * slides 保存规范化后的页面数组。
   *
   * 处理说明：
   * - normalizeSlide 返回 null 的未知对象会被过滤。
   * - 保留合法页面顺序，确保目录、章节、正文的叙事顺序不变。
   */
  const slides = parsedValues
    .map(value => normalizeSlide(value))
    .filter((slide): slide is AIPPTSlide => !!slide)

  /**
   * 空结果保护：
   * - content 可能是合法 JSON，但没有任何支持的页面类型。
   * - 这种情况下继续生成只会得到空 PPT，因此提前抛出明确错误。
   */
  if (!slides.length) throw new Error('content 中没有可生成的 AI PPT 页面')

  return slides
}
