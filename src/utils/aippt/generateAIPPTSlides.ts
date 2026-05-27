import { nanoid } from 'nanoid'
import type { ImageClipDataRange, PPTElement, PPTImageElement, PPTShapeElement, PPTTextElement, Slide, TextType } from '@/types/slides'
import type { AIPPTSlide } from '@/types/AIPPT'

/**
 * AI PPT 图片池项。
 *
 * 功能描述：
 * - 描述可被 AI PPT 模板图片占位消耗的一张图片资源。
 * - 生成过程中会根据图片宽高和模板占位宽高选择更合适的图片。
 *
 * 入参：
 * - 该接口没有运行时入参，只约束调用方传入对象的字段结构。
 *
 * 返回值：
 * - TypeScript 类型接口没有运行时返回值。
 *
 * 异常：
 * - 该接口不会抛出异常。
 *
 * 注意事项：
 * - `id` 会用于移除已使用图片，因此同一批图片内应保持唯一。
 * - `src` 可以是远程 URL、blob URL、base64 或包含 `fileServer` 的后端文件服务相对路径。
 * - 包含 `fileServer` 且不是完整 URL 的 `src` 会在替换图片元素时按当前页面域名补齐为完整路径。
 */
export interface AIPPTImagePoolItem {
  /** 图片池内的唯一 ID，用于取用后移除，避免同一图片重复使用。 */
  id: string
  /** 图片资源地址，可以是 URL、blob URL、base64 字符串，或包含 fileServer 的后端文件服务相对路径。 */
  src: string
  /** 图片原始宽度，用于匹配横图、竖图或方图模板占位。 */
  width: number
  /** 图片原始高度，用于匹配横图、竖图或方图模板占位。 */
  height: number
}

/**
 * AI PPT 幻灯片生成入参。
 *
 * 功能描述：
 * - 把原先 `useAIPPT().AIPPT()` 内部依赖的模板、AI 页面、图片池和过渡页状态显式化。
 * - 让套版逻辑可以在浏览器前端以纯函数形式复用，而不直接接触 Pinia store。
 *
 * 入参：
 * - 该接口没有运行时入参，只约束 `generateAIPPTSlides()` 的 options 对象结构。
 *
 * 返回值：
 * - TypeScript 类型接口没有运行时返回值。
 *
 * 异常：
 * - 该接口不会抛出异常。
 *
 * 注意事项：
 * - `transitionTemplate` 传入非空时会沿用该模板，保证多次流式调用期间过渡页风格一致。
 * - `transitionIndex` 传入当前章节序号，函数返回自增后的最新章节序号。
 */
export interface GenerateAIPPTSlidesOptions {
  /** 可用模板页列表，按 slide.type 区分 cover、contents、transition、content、end。 */
  templateSlides: Slide[]
  /** AI 生成的结构化页面列表，可以是整份 PPT，也可以是流式返回的一页。 */
  aiSlides: AIPPTSlide[]
  /** 当前可用图片池；函数内部会复制一份再消费，避免直接修改调用方数组引用。 */
  imgs: AIPPTImagePoolItem[]
  /** 当前过渡页序号，用于章节页 partNumber 文本。 */
  transitionIndex: number
  /** 本次生成固定使用的过渡页模板；为空时函数会从模板池随机选择。 */
  transitionTemplate: Slide | null
}

/**
 * AI PPT 幻灯片生成结果。
 *
 * 功能描述：
 * - 返回新生成的 PPTist 幻灯片数据以及生成后的状态。
 * - 调用方可以自行决定把 `generatedSlides` 写入 store、追加到文稿，或用于预览/测试。
 *
 * 入参：
 * - 该接口没有运行时入参，只约束 `generateAIPPTSlides()` 的返回值结构。
 *
 * 返回值：
 * - TypeScript 类型接口没有运行时返回值。
 *
 * 异常：
 * - 该接口不会抛出异常。
 *
 * 注意事项：
 * - `remainingImgs` 必须回写到调用方图片池状态，否则流式逐页生成时图片可能重复使用。
 * - `transitionIndex` 和 `transitionTemplate` 必须回写到调用方状态，否则章节编号和过渡页风格会被重置。
 */
export interface GenerateAIPPTSlidesResult {
  /** 套版后生成的幻灯片数据，不包含任何 store 写入副作用。 */
  generatedSlides: Slide[]
  /** 消耗图片占位后的剩余图片池。 */
  remainingImgs: AIPPTImagePoolItem[]
  /** 生成过渡页后更新的章节序号。 */
  transitionIndex: number
  /** 本次生成实际使用的过渡页模板。 */
  transitionTemplate: Slide | null
}

/**
 * 判断元素是否为指定语义类型的文本占位。
 *
 * @param el - 待判断的 PPT 元素。
 * @param type - 需要匹配的文本语义类型，例如 title、content、item。
 * @returns 元素语义类型匹配时返回 true，否则返回 false。
 * @throws 当前函数不主动抛错。
 * @remarks 文本元素使用 `textType`，形状内文本使用 `text.type`，两种模板占位都需要支持。
 */
const checkTextType = (el: PPTElement, type: TextType) => {
  // 普通文本元素通过 textType 匹配；形状文本通过 text.type 匹配。
  return (el.type === 'text' && el.textType === type) || (el.type === 'shape' && el.text && el.text.type === type)
}

/**
 * 从模板列表中筛选适合指定条目数量的模板。
 *
 * @param templates - 候选模板页列表。
 * @param n - 需要容纳的文本条目数量。
 * @param type - 条目文本占位类型。
 * @returns 可用模板列表；若没有精确匹配，会返回占位数量最接近的一组模板。
 * @throws 当前函数不主动抛错；模板列表为空时后续随机取模板会沿用运行时行为。
 * @remarks
 * - n 为 1 时优先选择没有 item、且只有 title/content 的模板，适配单内容页。
 * - 多条目时优先找占位数量大于等于 n 且最接近 n 的模板。
 * - 如果所有模板都放不下 n，则选择占位数量最多的一组模板。
 */
const getUseableTemplates = (templates: Slide[], n: number, type: TextType) => {
  // 单条内容优先使用“标题 + 正文”的特殊模板，而不是列表项模板。
  if (n === 1) {
    // 查找无 item 占位且恰好一个标题、一个正文的模板。
    const list = templates.filter(slide => {
      // 指定类型的条目占位。
      const items = slide.elements.filter(el => checkTextType(el, type))
      // 标题占位。
      const titles = slide.elements.filter(el => checkTextType(el, 'title'))
      // 正文占位。
      const texts = slide.elements.filter(el => checkTextType(el, 'content'))

      // 单内容页模板要求没有 item，占位结构简单明确。
      return !items.length && titles.length === 1 && texts.length === 1
    })

    // 找到单内容模板时直接返回。
    if (list.length) return list
  }

  // 最终选中的目标模板，用于确定需要返回的占位数量组。
  let target: Slide | null = null

  // 先筛选出占位数量足够容纳 n 条内容的模板。
  const list = templates.filter(slide => {
    // 当前模板中指定类型占位数量。
    const len = slide.elements.filter(el => checkTextType(el, type)).length
    // 占位数量足够则可用。
    return len >= n
  })
  // 没有模板能完全容纳时，选择占位最多的模板作为降级目标。
  if (list.length === 0) {
    // 按占位数量升序排序；这里复制数组，避免改变调用方传入的模板池顺序。
    const sorted = [...templates].sort((a, b) => {
      // 模板 a 的占位数量。
      const aLen = a.elements.filter(el => checkTextType(el, type)).length
      // 模板 b 的占位数量。
      const bLen = b.elements.filter(el => checkTextType(el, type)).length
      // 升序排列。
      return aLen - bLen
    })
    // 取占位最多的模板。
    target = sorted[sorted.length - 1]
  }
  // 存在可容纳模板时，选择占位数量最接近 n 的模板。
  else {
    // 在可用模板中寻找最接近 n 的目标模板。
    target = list.reduce((closest, current) => {
      // 当前模板占位数量。
      const currentLen = current.elements.filter(el => checkTextType(el, type)).length
      // 已知最接近模板占位数量。
      const closestLen = closest.elements.filter(el => checkTextType(el, type)).length
      // 选择剩余占位更少的模板。
      return (currentLen - n) <= (closestLen - n) ? current : closest
    })
  }

  // 返回所有占位数量与目标模板一致的模板，后续随机选择以增加版式变化。
  return templates.filter(slide => {
    // 当前模板占位数量。
    const len = slide.elements.filter(el => checkTextType(el, type)).length
    // 目标占位数量。
    const targetLen = target!.elements.filter(el => checkTextType(el, type)).length
    // 占位数量相同即归为同一候选组。
    return len === targetLen
  })
}

/**
 * 根据文本、字体和占位框尺寸计算适配字号。
 *
 * @param options - 字号适配参数。
 * @param options.text - 需要测量的文本。
 * @param options.fontSize - 模板原始字号。
 * @param options.fontFamily - 模板原始字体。
 * @param options.width - 可用文本宽度。
 * @param options.height - 可用文本高度。
 * @param options.lineHeight - 行高比例。
 * @param options.maxLine - 允许的最大行数。
 * @returns 能放进占位框的字号，最低返回 10。
 * @throws 当前函数不主动抛错；canvas 2d 上下文不可用会沿用非空断言后的运行时行为。
 * @remarks
 * - 使用 canvas `measureText()` 估算文本宽度，再推算行数。
 * - 多行文本还会根据行高估算总高度，避免内容纵向溢出。
 */
const getAdaptedFontsize = ({
  text,
  fontSize,
  fontFamily,
  width,
  height,
  lineHeight,
  maxLine,
}: {
  text: string
  fontSize: number
  fontFamily: string
  width: number
  height: number
  lineHeight: number
  maxLine: number
}) => {
  // 创建离屏 canvas 用于测量文本宽度；当前模块仍按浏览器前端运行环境设计。
  const canvas = document.createElement('canvas')
  // 获取 2D 上下文；当前逻辑假设浏览器环境一定可用。
  const context = canvas.getContext('2d')!

  // 从模板原始字号开始尝试。
  let newFontSize = fontSize
  // 最小字号兜底，避免文字缩到不可读。
  const minFontSize = 10

  // 从大到小逐步尝试字号。
  while (newFontSize >= minFontSize) {
    // 设置当前测量字体。
    context.font = `${newFontSize}px ${fontFamily}`
    // 测量单行文本宽度。
    const textWidth = context.measureText(text).width
    // 根据可用宽度估算需要的行数。
    const line = Math.ceil(textWidth / width)

    // 多行文本且有高度约束时，需要同时检查纵向空间。
    if (maxLine > 1 && height) {
      // 估算单行高度，小字号时使用更紧凑行高。
      const heightOfLine = Math.max(newFontSize, 16) * (newFontSize < 15 ? 1.2 : lineHeight) * 1.2
      // 估算总高度。
      const totalHeight = line * heightOfLine
      // 总高度能放下时返回当前字号。
      if (totalHeight <= height) return newFontSize
    }
    // 单行或不检查高度时，只要行数不超过限制即可返回。
    if (line <= maxLine) return newFontSize

    // 小字号阶段每次减 1，大字号阶段每次减 2，加快收敛。
    const step = newFontSize <= 22 ? 1 : 2
    // 尝试更小字号。
    newFontSize = newFontSize - step
  }

  // 所有字号都放不下时返回最小字号。
  return minFontSize
}

/**
 * 从富文本 HTML 中提取字号和字体信息。
 *
 * @param htmlString - 模板文本元素中的 HTML 字符串。
 * @returns 字号和字体名；缺失时返回默认字体信息。
 * @throws 当前函数不主动抛错。
 * @remarks 这里通过正则读取第一处 font-size 和 font-family，作为后续字号自适应的基准。
 */
const getFontInfo = (htmlString: string) => {
  // 匹配 CSS font-size，单位限定为 px。
  const fontSizeRegex = /font-size:\s*(\d+(?:\.\d+)?)\s*px/i
  // 匹配 CSS font-family，兼容单双引号。
  const fontFamilyRegex = /font-family:\s*['"]?([^'";]+)['"]?\s*(?=;|>|$)/i

  // 模板没有写字体信息时的默认值。
  const defaultInfo = {
    // 默认字号。
    fontSize: 16,
    // 默认字体。
    fontFamily: 'Microsoft Yahei',
  }

  // 查找字号。
  const fontSizeMatch = htmlString.match(fontSizeRegex)
  // 查找字体。
  const fontFamilyMatch = htmlString.match(fontFamilyRegex)

  // 返回解析结果或默认值。
  return {
    // 字号命中时转为数字。
    fontSize: fontSizeMatch ? (+fontSizeMatch[1].trim()) : defaultInfo.fontSize,
    // 字体命中时去掉首尾空白。
    fontFamily: fontFamilyMatch ? fontFamilyMatch[1].trim() : defaultInfo.fontFamily,
  }
}

/**
 * 基于模板文本元素生成替换后的新文本元素。
 *
 * @param options - 文本替换参数。
 * @param options.el - 模板中的文本元素或带文本的形状元素。
 * @param options.text - 需要写入的新文本。
 * @param options.maxLine - 允许的最大行数。
 * @param options.longestText - 同组文本中最长的一条，用于统一计算字号。
 * @param options.digitPadding - 是否对一位数字补 0，常用于目录或章节编号。
 * @returns 替换文本和字号后的新元素，原元素不会被直接修改。
 * @throws 当前函数不主动抛错；HTML 解析失败会沿用 DOMParser 的浏览器行为。
 * @remarks
 * - 为了保留模板样式，只替换第一个文本节点内容，并删除后续文本节点。
 * - 字号会按占位框尺寸和最长文本自动缩小。
 */
const getNewTextElement = ({
  el,
  text,
  maxLine,
  longestText,
  digitPadding,
}: {
  el: PPTTextElement | PPTShapeElement
  text: string
  maxLine: number
  longestText?: string
  digitPadding?: boolean
}): PPTTextElement | PPTShapeElement => {
  // 文本内边距：普通文本取 inset，形状文本取 text.inset，缺失时使用默认值。
  const inset = el.type === 'text' ? (el.inset || [10, 10, 10, 10]) : (el.text?.inset || [10, 10, 10, 10])
  // 文本可用宽度，减去左右内边距和少量安全边距。
  const width = el.width - inset[1] - inset[3] - 2
  // 文本可用高度，减去上下内边距和少量安全边距。
  const height = el.height - inset[0] - inset[2] - 2
  // 普通文本沿用元素行高，形状文本使用固定估算行高。
  const lineHeight = el.type === 'text' ? (el.lineHeight || 1.5) : 1.2
  // 读取模板原始富文本内容。
  let content = el.type === 'text' ? el.content : el.text!.content

  // 提取模板字体信息。
  const fontInfo = getFontInfo(content)
  // 计算适配字号；同组元素可用最长文本统一测量，保证字号一致。
  const size = getAdaptedFontsize({
    text: longestText || text,
    fontSize: fontInfo.fontSize,
    fontFamily: fontInfo.fontFamily,
    width,
    height,
    lineHeight,
    maxLine,
  })

  // 解析模板 HTML，后续保留标签和样式，仅替换文本节点。
  const parser = new DOMParser()
  // 生成 HTML 文档。
  const doc = parser.parseFromString(content, 'text/html')

  // 遍历文档中的文本节点。
  const treeWalker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)

  // 取第一个文本节点作为实际替换位置。
  const firstTextNode = treeWalker.nextNode()
  // 存在文本节点时执行替换。
  if (firstTextNode) {
    // 编号模板原本为两位数字且新文本为一位数字时补 0。
    if (digitPadding && firstTextNode.textContent && firstTextNode.textContent.length === 2 && text.length === 1) {
      firstTextNode.textContent = '0' + text
    }
    // 普通文本直接替换。
    else firstTextNode.textContent = text

    // 删除后续文本节点，避免模板占位残留。
    let node
    while ((node = treeWalker.nextNode())) {
      // 从父节点上移除多余文本节点，保留模板标签和样式结构。
      node.parentNode?.removeChild(node)
    }
  }

  // 模板没有 font-size 时补一个默认字号，便于下面统一替换。
  if (doc.body.innerHTML.indexOf('font-size') === -1) {
    // 优先给第一个段落设置字号。
    const p = doc.querySelector('p')
    // 写入默认字号。
    if (p) p.style.fontSize = '16px'
  }

  // 将 HTML 中所有 font-size 替换为适配字号。
  content = doc.body.innerHTML.replace(/font-size:(.+?)px/g, `font-size: ${size}px`)

  // 普通文本元素写回 content；小字号时同步收紧行高。
  return el.type === 'text' ? { ...el, content, lineHeight: size < 15 ? 1.2 : el.lineHeight } : { ...el, text: { ...el.text!, content } }
}

/**
 * 从图片池中挑选适合模板图片占位比例的图片。
 *
 * @param el - 模板中的图片占位元素。
 * @param imgPool - 当前可用图片池，会在选中图片后返回新的剩余图片池。
 * @returns 匹配到的图片池项和消费后的图片池；图片池为空时图片返回 null。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 方形占位优先选方图，横向占位优先选横图，竖向占位优先选竖图。
 * - 选中的图片会从图片池中移除，降低重复图片出现概率。
 */
const getUseableImage = (el: PPTImageElement, imgPool: AIPPTImagePoolItem[]) => {
  // 图片池为空时没有可消费资源，直接返回原图片池。
  if (!imgPool.length) return { img: null, imgPool }

  // 最终选中的图片。
  let img: AIPPTImagePoolItem | null = null

  // 候选图片列表。
  let imgs: AIPPTImagePoolItem[] = []

  // 方形占位优先匹配方形图片。
  if (el.width === el.height) imgs = imgPool.filter(img => img.width === img.height)
  // 横向占位优先匹配横图。
  else if (el.width > el.height) imgs = imgPool.filter(img => img.width > img.height)
  // 竖向占位优先匹配竖图或近似竖图。
  else imgs = imgPool.filter(img => img.width <= img.height)
  // 没有符合比例的图片时退回全部图片池。
  if (!imgs.length) imgs = imgPool

  // 从候选图片中随机取一张。
  img = imgs[Math.floor(Math.random() * imgs.length)]
  // 移除已使用图片，避免后续重复使用。
  const nextImgPool = imgPool.filter(item => item.id !== img!.id)

  // 返回选中的图片以及消费后的图片池。
  return { img, imgPool: nextImgPool }
}

/**
 * 规范化图片池图片地址。
 *
 * @param src - 图片池中取出的原始图片地址。
 * @returns 可直接写入 PPT 图片元素的图片地址。
 * @throws 当前函数不主动抛错；URL 解析失败时会返回原始地址，避免阻断 PPT 生成。
 * @remarks
 * - 仅处理包含 `fileServer` 的相对路径，避免误改 Pexels、blob、dataURL 等现有图片源。
 * - 已经是 `http://`、`https://` 或其他带协议的完整地址时保持不变。
 * - 浏览器运行环境下使用 `window.location.origin` 补齐域名，保证图片元素拿到完整可访问路径。
 */
const normalizeImageSrc = (src: string) => {
  // 原始图片地址做 trim，避免父项目传入前后空格导致 URL 判断误判。
  const trimmedSrc = src.trim()
  // `fileServer` 路径判断只面向后端文件服务路径；不包含该片段的图片地址沿用原逻辑。
  const isFileServerPath = trimmedSrc.includes('fileServer')
  // 完整协议地址判断：覆盖 http、https、blob、data 等标准 URL 形式，避免重复拼接域名。
  const hasUrlScheme = /^[a-z][a-z\d+\-.]*:/i.test(trimmedSrc)
  // 协议相对地址判断：例如 `//example.com/fileServer/a.png` 已经包含域名，只缺当前页面协议。
  const isProtocolRelativeUrl = trimmedSrc.startsWith('//')

  // 非 fileServer 地址、已经带协议的完整地址，或者空字符串，都保持原样返回。
  if (!trimmedSrc || !isFileServerPath || hasUrlScheme) return trimmedSrc

  // 非浏览器环境没有 window.location，无法可靠推导当前域名，因此保持原始地址交给调用方环境处理。
  if (typeof window === 'undefined') return trimmedSrc

  // 协议相对地址包含域名但缺少协议，使用当前页面协议补齐，避免导出或预览时被当成普通相对路径。
  if (isProtocolRelativeUrl) {
    // 当前页面协议，浏览器正常环境下通常是 `http:` 或 `https:`。
    const protocol = window.location.protocol
    // 拼出带协议的完整地址。
    return `${protocol}${trimmedSrc}`
  }

  try {
    // 当前页面源站，作为相对 fileServer 路径的基准域名。
    const origin = window.location.origin
    // 把 Windows 反斜杠统一成 URL 正斜杠，兼容后端偶发返回 `fileServer\xxx` 的路径格式。
    const normalizedPath = trimmedSrc.replace(/\\/g, '/')
    // 使用 URL 标准构造器处理开头是否带 `/`、`./` 等边界，避免手工拼接多斜杠或漏斜杠。
    return new URL(normalizedPath, origin).href
  }
  catch {
    // 极端环境下 window 或 URL 不可用时兜底返回原始地址，保证套版流程不会因为路径补全失败而中断。
    return trimmedSrc
  }
}

/**
 * 基于模板图片占位生成替换后的图片元素。
 *
 * @param el - 模板图片占位元素。
 * @param imgPool - 当前可用图片池，会在选图后返回新的剩余图片池。
 * @returns 替换图片源和裁剪信息后的图片元素，以及消费后的图片池；没有可用图片时返回原元素。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 会根据图片和占位框宽高比计算 cover 裁剪区域。
 * - 原占位的裁剪形状会被保留，例如圆形或其他 clip shape。
 */
const getNewImgElement = (el: PPTImageElement, imgPool: AIPPTImagePoolItem[]) => {
  // 从图片池中获取可用图片。
  const { img, imgPool: nextImgPool } = getUseableImage(el, imgPool)
  // 没有图片时保持模板原图不变，同时原样返回图片池。
  if (!img) return { el, imgPool: nextImgPool }

  // 缩放比例。
  let scale = 1
  // 图片按占位高度/宽度缩放后的宽度。
  let w = el.width
  // 图片按占位高度/宽度缩放后的高度。
  let h = el.height
  // 图片裁剪范围，使用百分比坐标。
  let range: ImageClipDataRange = [[0, 0], [0, 0]]
  // 占位框宽高比。
  const radio = el.width / el.height
  // 图片比占位更宽或同样宽时，按高度铺满并左右裁剪。
  if (img.width / img.height >= radio) {
    // 以高度为基准缩放图片。
    scale = img.height / el.height
    // 缩放后图片宽度。
    w = img.width / scale
    // 左右多出的比例差值。
    const diff = (w - el.width) / 2 / w * 100
    // 裁剪左右，保留中间区域。
    range = [[diff, 0], [100 - diff, 100]]
  }
  // 图片比占位更窄时，按宽度铺满并上下裁剪。
  else {
    // 以宽度为基准缩放图片。
    scale = img.width / el.width
    // 缩放后图片高度。
    h = img.height / scale
    // 上下多出的比例差值。
    const diff = (h - el.height) / 2 / h * 100
    // 裁剪上下，保留中间区域。
    range = [[0, diff], [100, 100 - diff]]
  }
  // 保留模板原裁剪形状，缺失时使用矩形。
  const clipShape = (el.clip && el.clip.shape) ? el.clip.shape : 'rect'
  // 新裁剪配置。
  const clip = { range, shape: clipShape }
  // 新图片源：包含 fileServer 的相对路径需要补齐域名，完整 URL 和普通图片源保持原样。
  const src = normalizeImageSrc(img.src)

  // 返回替换后的图片元素以及消费后的图片池。
  return { el: { ...el, src, clip }, imgPool: nextImgPool }
}

/**
 * 替换图片占位并同步消费图片池。
 *
 * @param el - 当前正在处理的 PPT 元素。
 * @param imgPool - 当前可用图片池。
 * @returns 处理后的元素与最新图片池；非图片占位会原样返回。
 * @throws 当前函数不主动抛错。
 * @remarks 该函数把“图片元素替换”和“图片池状态更新”放在同一处，避免 map 回调里遗漏状态回写。
 */
const replaceImageElementIfNeeded = (el: PPTElement, imgPool: AIPPTImagePoolItem[]) => {
  // 仅处理带 imageType 的图片占位；普通图片和其他元素保持不变。
  if (el.type !== 'image' || !el.imageType || !imgPool.length) return { el, imgPool }
  // 生成新的图片元素并返回消费后的图片池。
  return getNewImgElement(el, imgPool)
}

/**
 * 预处理 AI 页面，拆分条目过多的目录页和内容页。
 *
 * @param aiSlides - AI 生成的原始结构化页面列表。
 * @returns 拆分后的页面列表。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 保持原 `useAIPPT().AIPPT()` 的拆页阈值不变。
 * - 拆分页会写入 offset，用于目录或内容项编号继续递增。
 */
const splitLongAISlides = (aiSlides: AIPPTSlide[]) => {
  // 预处理后的 AI 页面列表。
  const splitSlides: AIPPTSlide[] = []

  // 遍历 AI 原始页面，拆分过长页面。
  for (const template of aiSlides) {
    // 正文内容页：条目过多时拆成多页。
    if (template.type === 'content') {
      // 当前内容页条目列表。
      const items = template.data.items
      // 5-6 条拆成 3 + 剩余。
      if (items.length === 5 || items.length === 6) {
        // 第一页 3 条。
        const items1 = items.slice(0, 3)
        // 第二页剩余条目。
        const items2 = items.slice(3)
        // 追加第一页。
        splitSlides.push({ ...template, data: { ...template.data, items: items1 } })
        // 追加第二页，并记录编号偏移。
        splitSlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 3 })
      }
      // 7-8 条拆成 4 + 剩余。
      else if (items.length === 7 || items.length === 8) {
        // 第一页 4 条。
        const items1 = items.slice(0, 4)
        // 第二页剩余条目。
        const items2 = items.slice(4)
        // 追加第一页。
        splitSlides.push({ ...template, data: { ...template.data, items: items1 } })
        // 追加第二页，编号从第 5 条开始。
        splitSlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 4 })
      }
      // 9-10 条拆成 3 + 3 + 剩余。
      else if (items.length === 9 || items.length === 10) {
        // 第一页 3 条。
        const items1 = items.slice(0, 3)
        // 第二页 3 条。
        const items2 = items.slice(3, 6)
        // 第三页剩余条目。
        const items3 = items.slice(6)
        // 追加第一页。
        splitSlides.push({ ...template, data: { ...template.data, items: items1 } })
        // 追加第二页，编号偏移 3。
        splitSlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 3 })
        // 追加第三页，编号偏移 6。
        splitSlides.push({ ...template, data: { ...template.data, items: items3 }, offset: 6 })
      }
      // 超过 10 条拆成 4 + 4 + 剩余。
      else if (items.length > 10) {
        // 第一页 4 条。
        const items1 = items.slice(0, 4)
        // 第二页 4 条。
        const items2 = items.slice(4, 8)
        // 第三页剩余条目。
        const items3 = items.slice(8)
        // 追加第一页。
        splitSlides.push({ ...template, data: { ...template.data, items: items1 } })
        // 追加第二页，编号偏移 4。
        splitSlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 4 })
        // 追加第三页，编号偏移 8。
        splitSlides.push({ ...template, data: { ...template.data, items: items3 }, offset: 8 })
      }
      // 条目数量较少时保持原页面。
      else {
        splitSlides.push(template)
      }
    }
    // 目录页：条目过多时拆成多页。
    else if (template.type === 'contents') {
      // 当前目录条目。
      const items = template.data.items
      // 11 条拆成 6 + 5。
      if (items.length === 11) {
        // 第一页 6 条。
        const items1 = items.slice(0, 6)
        // 第二页剩余条目。
        const items2 = items.slice(6)
        // 追加第一页。
        splitSlides.push({ ...template, data: { ...template.data, items: items1 } })
        // 追加第二页，编号偏移 6。
        splitSlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 6 })
      }
      // 超过 11 条拆成 10 + 剩余。
      else if (items.length > 11) {
        // 第一页 10 条。
        const items1 = items.slice(0, 10)
        // 第二页剩余条目。
        const items2 = items.slice(10)
        // 追加第一页。
        splitSlides.push({ ...template, data: { ...template.data, items: items1 } })
        // 追加第二页，编号偏移 10。
        splitSlides.push({ ...template, data: { ...template.data, items: items2 }, offset: 10 })
      }
      // 目录条目较少时保持原页面。
      else {
        splitSlides.push(template)
      }
    }
    // 其他页面类型不需要拆分。
    else splitSlides.push(template)
  }

  // 返回拆分后的 AI 页面列表。
  return splitSlides
}

/**
 * 将 AI 生成的结构化页面套入 PPTist 模板。
 *
 * @param options - AI PPT 纯前端套版参数。
 * @param options.templateSlides - 可用模板页列表，按 slide.type 区分 cover、contents、transition、content、end。
 * @param options.aiSlides - AI 生成的结构化页面列表。
 * @param options.imgs - 当前可用图片池。
 * @param options.transitionIndex - 当前章节过渡页序号。
 * @param options.transitionTemplate - 本次生成固定使用的过渡页模板。
 * @returns 生成的幻灯片、剩余图片池和更新后的过渡页状态。
 * @throws 当前函数不主动抛错；模板分类为空、模板元素缺失等情况沿用原运行时行为。
 * @remarks
 * - 该函数不读取 slidesStore，不调用 addSlidesFromData，也不修改调用方传入的图片池数组。
 * - 该函数仍使用 document、DOMParser 和 canvas，因此目前只面向浏览器前端环境。
 * - 随机选模板和随机选图片的行为与原 `useAIPPT().AIPPT()` 保持一致。
 */
export const generateAIPPTSlides = ({
  templateSlides,
  aiSlides,
  imgs,
  transitionIndex,
  transitionTemplate,
}: GenerateAIPPTSlidesOptions): GenerateAIPPTSlidesResult => {
  // 复制图片池，确保函数消费图片时不会直接修改调用方持有的数组对象。
  let imgPool = [...imgs]
  // 复制过渡页序号，函数内部自增后通过返回值交还调用方。
  let nextTransitionIndex = transitionIndex
  // 复制过渡页模板引用，必要时从模板池中随机选择并通过返回值交还调用方。
  let nextTransitionTemplate = transitionTemplate
  // 预处理 AI 页面，拆分条目过多的页面。
  const AISlides = splitLongAISlides(aiSlides)

  // 封面模板池。
  const coverTemplates = templateSlides.filter(slide => slide.type === 'cover')
  // 目录模板池。
  const contentsTemplates = templateSlides.filter(slide => slide.type === 'contents')
  // 过渡页模板池。
  const transitionTemplates = templateSlides.filter(slide => slide.type === 'transition')
  // 正文模板池。
  const contentTemplates = templateSlides.filter(slide => slide.type === 'content')
  // 结束页模板池。
  const endTemplates = templateSlides.filter(slide => slide.type === 'end')

  // 本次生成尚未确定过渡页模板时随机取一个。
  if (!nextTransitionTemplate) {
    // 从过渡页模板池随机取模板。
    const _transitionTemplate = transitionTemplates[Math.floor(Math.random() * transitionTemplates.length)]
    // 缓存本次使用的过渡模板，保证多个章节页风格一致。
    nextTransitionTemplate = _transitionTemplate
  }

  // 生成后的幻灯片列表。
  const slides: Slide[] = []

  // 按预处理后的 AI 页面顺序逐页套版。
  for (const item of AISlides) {
    // 封面页：随机选封面模板并填充标题/正文/图片。
    if (item.type === 'cover') {
      // 从封面模板池随机取一个模板。
      const coverTemplate = coverTemplates[Math.floor(Math.random() * coverTemplates.length)]
      // 替换模板元素。
      const elements = coverTemplate.elements.map(el => {
        // 图片占位且图片池可用时替换图片。
        const imageResult = replaceImageElementIfNeeded(el, imgPool)
        // 回写图片池，保证同一页后续图片占位不会重复使用同一张图。
        imgPool = imageResult.imgPool
        // 图片占位处理完成后直接返回替换后的图片元素。
        if (el.type === 'image' && el.imageType) return imageResult.el
        // 非文本/形状元素保持不变。
        if (el.type !== 'text' && el.type !== 'shape') return el
        // 标题占位写入封面标题。
        if (checkTextType(el, 'title') && item.data.title) {
          return getNewTextElement({ el, text: item.data.title, maxLine: 1 })
        }
        // 正文占位写入封面说明。
        if (checkTextType(el, 'content') && item.data.text) {
          return getNewTextElement({ el, text: item.data.text, maxLine: 3 })
        }
        // 其他文本占位保持模板原样。
        return el
      })
      // 追加生成后的封面页。
      slides.push({
        // 继承模板页其他配置。
        ...coverTemplate,
        // 生成新 ID，避免复用模板 ID。
        id: nanoid(10),
        // 写入替换后的元素。
        elements,
      })
    }
    // 目录页：根据目录项数量选择模板，填充目录项和编号。
    else if (item.type === 'contents') {
      // 选择适合当前目录项数量的模板列表。
      const _contentsTemplates = getUseableTemplates(contentsTemplates, item.data.items.length, 'item')
      // 从可用目录模板中随机取一个。
      const contentsTemplate = _contentsTemplates[Math.floor(Math.random() * _contentsTemplates.length)]

      // 目录编号占位元素。
      const sortedNumberItems = contentsTemplate.elements.filter(el => checkTextType(el, 'itemNumber'))
      // 对编号占位排序，得到编号写入顺序。
      const sortedNumberItemIds = sortedNumberItems.sort((a, b) => {
        // 编号数量较多时优先尝试按模板中的数字内容排序。
        if (sortedNumberItems.length > 6) {
          // a 元素原始编号文本。
          let aContent = ''
          // b 元素原始编号文本。
          let bContent = ''
          // 普通文本元素内容。
          if (a.type === 'text') aContent = a.content
          // 形状文本内容。
          if (a.type === 'shape') aContent = a.text!.content
          // 普通文本元素内容。
          if (b.type === 'text') bContent = b.content
          // 形状文本内容。
          if (b.type === 'shape') bContent = b.text!.content

          // 两个元素都有内容时按数字排序。
          if (aContent && bContent) {
            // a 编号。
            const aIndex = parseInt(aContent)
            // b 编号。
            const bIndex = parseInt(bContent)

            // 数字升序。
            return aIndex - bIndex
          }
        }
        // 内容不可解析时按位置排序。
        const aIndex = a.left + a.top * 2
        // b 的位置权重。
        const bIndex = b.left + b.top * 2
        // 从左到右、从上到下的近似顺序。
        return aIndex - bIndex
      }).map(el => el.id)

      // 目录正文占位元素。
      const sortedItems = contentsTemplate.elements.filter(el => checkTextType(el, 'item'))
      // 对目录正文占位排序，得到目录项写入顺序。
      const sortedItemIds = sortedItems.sort((a, b) => {
        // 条目较多时，优先按同组编号元素排序。
        if (sortedItems.length > 6) {
          // a 对应的编号元素。
          const aItemNumber = sortedNumberItems.find(item => item.groupId === a.groupId)
          // b 对应的编号元素。
          const bItemNumber = sortedNumberItems.find(item => item.groupId === b.groupId)

          // 两个条目都能找到编号元素时按编号排序。
          if (aItemNumber && bItemNumber) {
            // a 编号文本。
            let aContent = ''
            // b 编号文本。
            let bContent = ''
            // 读取 a 编号内容。
            if (aItemNumber.type === 'text') aContent = aItemNumber.content
            if (aItemNumber.type === 'shape') aContent = aItemNumber.text!.content
            // 读取 b 编号内容。
            if (bItemNumber.type === 'text') bContent = bItemNumber.content
            if (bItemNumber.type === 'shape') bContent = bItemNumber.text!.content

            // 两个编号都存在时按数字排序。
            if (aContent && bContent) {
              // a 编号。
              const aIndex = parseInt(aContent)
              // b 编号。
              const bIndex = parseInt(bContent)

              // 数字升序。
              return aIndex - bIndex
            }
          }
        }

        // 无法按编号排序时按位置排序。
        const aIndex = a.left + a.top * 2
        // b 的位置权重。
        const bIndex = b.left + b.top * 2
        // 返回位置排序。
        return aIndex - bIndex
      }).map(el => el.id)

      // 找到当前目录项中最长文本，用于统一目录字号。
      const longestText = item.data.items.reduce((longest, current) => current.length > longest.length ? current : longest, '')

      // 没有对应内容的占位元素 ID，后续过滤掉。
      const unusedElIds: string[] = []
      // 没有对应内容的占位元素所在组 ID，组内装饰元素也一起过滤。
      const unusedGroupIds: string[] = []
      // 替换目录模板元素。
      const elements = contentsTemplate.elements.map(el => {
        // 图片占位且图片池可用时替换图片。
        const imageResult = replaceImageElementIfNeeded(el, imgPool)
        // 回写图片池，保证后续占位不会复用同一张图片。
        imgPool = imageResult.imgPool
        // 图片占位处理完成后直接返回替换后的图片元素。
        if (el.type === 'image' && el.imageType) return imageResult.el
        // 非文本/形状元素保持不变。
        if (el.type !== 'text' && el.type !== 'shape') return el
        // 目录项文本占位。
        if (checkTextType(el, 'item')) {
          // 当前位置对应目录项索引。
          const index = sortedItemIds.findIndex(id => id === el.id)
          // 当前目录项文本。
          const itemTitle = item.data.items[index]
          // 有对应文本时替换。
          if (itemTitle) return getNewTextElement({ el, text: itemTitle, maxLine: 1, longestText })

          // 没有对应文本时记录该占位，后续从页面中移除。
          unusedElIds.push(el.id)
          // 有 groupId 时整组移除，避免留下编号或装饰。
          if (el.groupId) unusedGroupIds.push(el.groupId)
        }
        // 目录项编号占位。
        if (checkTextType(el, 'itemNumber')) {
          // 当前编号占位对应索引。
          const index = sortedNumberItemIds.findIndex(id => id === el.id)
          // 拆分页的编号偏移。
          const offset = item.offset || 0
          // 写入编号，必要时补 0。
          return getNewTextElement({ el, text: index + offset + 1 + '', maxLine: 1, digitPadding: true })
        }
        // 其他元素保持不变。
        return el
      // 移除无内容占位及其组合元素。
      }).filter(el => !unusedElIds.includes(el.id) && !(el.groupId && unusedGroupIds.includes(el.groupId)))
      // 追加生成后的目录页。
      slides.push({
        // 继承模板配置。
        ...contentsTemplate,
        // 生成新页面 ID。
        id: nanoid(10),
        // 写入替换后的元素。
        elements,
      })
    }
    // 过渡页：使用本次固定过渡模板，填充章节标题、正文和章节编号。
    else if (item.type === 'transition') {
      // 章节序号自增。
      nextTransitionIndex = nextTransitionIndex + 1
      // 替换过渡页模板元素。
      const elements = nextTransitionTemplate!.elements.map(el => {
        // 图片占位且图片池可用时替换图片。
        const imageResult = replaceImageElementIfNeeded(el, imgPool)
        // 回写图片池，保证后续占位不会复用同一张图片。
        imgPool = imageResult.imgPool
        // 图片占位处理完成后直接返回替换后的图片元素。
        if (el.type === 'image' && el.imageType) return imageResult.el
        // 非文本/形状元素保持不变。
        if (el.type !== 'text' && el.type !== 'shape') return el
        // 章节标题占位。
        if (checkTextType(el, 'title') && item.data.title) {
          return getNewTextElement({ el, text: item.data.title, maxLine: 1 })
        }
        // 章节说明占位。
        if (checkTextType(el, 'content') && item.data.text) {
          return getNewTextElement({ el, text: item.data.text, maxLine: 3 })
        }
        // 章节编号占位。
        if (checkTextType(el, 'partNumber')) {
          return getNewTextElement({ el, text: nextTransitionIndex + '', maxLine: 1, digitPadding: true })
        }
        // 其他元素保持不变。
        return el
      })
      // 追加生成后的过渡页。
      slides.push({
        // 继承过渡模板配置。
        ...nextTransitionTemplate!,
        // 生成新页面 ID。
        id: nanoid(10),
        // 写入替换后的元素。
        elements,
      })
    }
    // 正文页：根据内容条目数量选择模板，填充条目标题、条目正文、编号和页面标题。
    else if (item.type === 'content') {
      // 选择适合当前内容项数量的模板列表。
      const _contentTemplates = getUseableTemplates(contentTemplates, item.data.items.length, 'item')
      // 随机取一个正文模板。
      const contentTemplate = _contentTemplates[Math.floor(Math.random() * _contentTemplates.length)]

      // 条目标题占位按页面位置排序。
      const sortedTitleItemIds = contentTemplate.elements.filter(el => checkTextType(el, 'itemTitle')).sort((a, b) => {
        // a 的位置权重。
        const aIndex = a.left + a.top * 2
        // b 的位置权重。
        const bIndex = b.left + b.top * 2
        // 从左到右、从上到下近似排序。
        return aIndex - bIndex
      }).map(el => el.id)

      // 条目正文占位按页面位置排序。
      const sortedTextItemIds = contentTemplate.elements.filter(el => checkTextType(el, 'item')).sort((a, b) => {
        // a 的位置权重。
        const aIndex = a.left + a.top * 2
        // b 的位置权重。
        const bIndex = b.left + b.top * 2
        // 位置升序。
        return aIndex - bIndex
      }).map(el => el.id)

      // 条目编号占位按页面位置排序。
      const sortedNumberItemIds = contentTemplate.elements.filter(el => checkTextType(el, 'itemNumber')).sort((a, b) => {
        // a 的位置权重。
        const aIndex = a.left + a.top * 2
        // b 的位置权重。
        const bIndex = b.left + b.top * 2
        // 位置升序。
        return aIndex - bIndex
      }).map(el => el.id)

      // 当前页全部条目标题，用于计算统一字号。
      const itemTitles = []
      // 当前页全部条目正文，用于计算统一字号。
      const itemTexts = []

      // 收集条目标题和正文。
      for (const _item of item.data.items) {
        // 存在标题时加入标题列表。
        if (_item.title) itemTitles.push(_item.title)
        // 存在正文时加入正文列表。
        if (_item.text) itemTexts.push(_item.text)
      }
      // 找到最长标题，保证同组标题字号一致。
      const longestTitle = itemTitles.reduce((longest, current) => current.length > longest.length ? current : longest, '')
      // 找到最长正文，保证同组正文字号一致。
      const longestText = itemTexts.reduce((longest, current) => current.length > longest.length ? current : longest, '')

      // 替换正文模板元素。
      const elements = contentTemplate.elements.map(el => {
        // 图片占位且图片池可用时替换图片。
        const imageResult = replaceImageElementIfNeeded(el, imgPool)
        // 回写图片池，保证后续占位不会复用同一张图片。
        imgPool = imageResult.imgPool
        // 图片占位处理完成后直接返回替换后的图片元素。
        if (el.type === 'image' && el.imageType) return imageResult.el
        // 非文本/形状元素保持不变。
        if (el.type !== 'text' && el.type !== 'shape') return el
        // 单条内容页通常使用 content 占位承载正文。
        if (item.data.items.length === 1) {
          // 唯一内容项。
          const contentItem = item.data.items[0]
          // 正文占位写入内容正文。
          if (checkTextType(el, 'content') && contentItem.text) {
            return getNewTextElement({ el, text: contentItem.text, maxLine: 6 })
          }
        }
        // 多条内容页按 itemTitle/item/itemNumber 分别填充。
        else {
          // 条目标题占位。
          if (checkTextType(el, 'itemTitle')) {
            // 当前标题占位对应的条目索引。
            const index = sortedTitleItemIds.findIndex(id => id === el.id)
            // 当前内容项。
            const contentItem = item.data.items[index]
            // 有标题时写入条目标题。
            if (contentItem && contentItem.title) {
              return getNewTextElement({ el, text: contentItem.title, longestText: longestTitle, maxLine: 1 })
            }
          }
          // 条目正文占位。
          if (checkTextType(el, 'item')) {
            // 当前正文占位对应的条目索引。
            const index = sortedTextItemIds.findIndex(id => id === el.id)
            // 当前内容项。
            const contentItem = item.data.items[index]
            // 有正文时写入条目正文。
            if (contentItem && contentItem.text) {
              return getNewTextElement({ el, text: contentItem.text, longestText, maxLine: 4 })
            }
          }
          // 条目编号占位。
          if (checkTextType(el, 'itemNumber')) {
            // 当前编号占位对应索引。
            const index = sortedNumberItemIds.findIndex(id => id === el.id)
            // 拆分页编号偏移。
            const offset = item.offset || 0
            // 写入编号，必要时补 0。
            return getNewTextElement({ el, text: index + offset + 1 + '', maxLine: 1, digitPadding: true })
          }
        }
        // 页面标题占位。
        if (checkTextType(el, 'title') && item.data.title) {
          return getNewTextElement({ el, text: item.data.title, maxLine: 1 })
        }
        // 其他元素保持不变。
        return el
      })
      // 追加生成后的正文页。
      slides.push({
        // 继承模板配置。
        ...contentTemplate,
        // 生成新页面 ID。
        id: nanoid(10),
        // 写入替换后的元素。
        elements,
      })
    }
    // 结束页：随机选结束模板，主要替换图片占位。
    else if (item.type === 'end') {
      // 从结束模板池随机取一个。
      const endTemplate = endTemplates[Math.floor(Math.random() * endTemplates.length)]
      // 替换结束页元素。
      const elements = endTemplate.elements.map(el => {
        // 图片占位且图片池可用时替换图片。
        const imageResult = replaceImageElementIfNeeded(el, imgPool)
        // 回写图片池，保证后续占位不会复用同一张图片。
        imgPool = imageResult.imgPool
        // 图片占位处理完成后直接返回替换后的图片元素。
        if (el.type === 'image' && el.imageType) return imageResult.el
        // 其他元素保持不变。
        return el
      })
      // 追加结束页。
      slides.push({
        // 继承结束模板配置。
        ...endTemplate,
        // 生成新页面 ID。
        id: nanoid(10),
        // 写入替换后的元素。
        elements,
      })
    }
  }

  // 返回生成结果和需要调用方保存的状态。
  return {
    // 生成后的幻灯片列表。
    generatedSlides: slides,
    // 消费后剩余图片池。
    remainingImgs: imgPool,
    // 更新后的过渡页序号。
    transitionIndex: nextTransitionIndex,
    // 更新后的过渡页模板。
    transitionTemplate: nextTransitionTemplate,
  }
}
