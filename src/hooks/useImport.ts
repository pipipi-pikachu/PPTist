import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { parse, type Shape, type Element, type ChartItem, type BaseElement } from 'pptxtojson'
import { nanoid } from 'nanoid'
import tinycolor from 'tinycolor2'
import { useSlidesStore } from '@/store'
import { decrypt } from '@/utils/crypto'
import { isFloatEqual } from '@/utils/common'
import { type ShapePoolItem, SHAPE_LIST, SHAPE_PATH_FORMULAS } from '@/configs/shapes'
import useAddSlidesOrElements from '@/hooks/useAddSlidesOrElements'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from './useHistorySnapshot'
import message from '@/utils/message'
import { getSvgPathRange } from '@/utils/svgPathParser'
import type {
  Slide,
  TableCellStyle,
  TableCell,
  ChartType,
  SlideBackground,
  PPTShapeElement,
  PPTLineElement,
  PPTImageElement,
  TextAlignVertical,
  PPTTextElement,
  ChartOptions,
  Gradient,
} from '@/types/slides'

// PPTX 垂直对齐值到 PPTist 文本垂直对齐值的映射。
const vAlignMap: Record<string, TextAlignVertical> = {
  'mid': 'middle',
  'down': 'bottom',
  'up': 'top',
}

/**
 * 根据导入文件宽高计算画布宽高比。
 *
 * @param width - 导入文件的画布宽度。
 * @param height - 导入文件的画布高度。
 * @returns 画布高度/宽度比例；缺少宽高时兜底为 16:9 的 `0.5625`。
 * @throws 当前函数不主动抛错。
 * @remarks 会把接近常见比例的浮点数规范为固定值，避免导入后比例出现极小误差。
 */
const getAspectRatio = (width: number, height: number) => {
  // 缺少宽高时兜底为 16:9。
  if (!width || !height) return 0.5625

  // 计算高度除以宽度得到画布比例。
  let aspectRatio = height / width
  // 接近 10:16 等比例时规范为 0.625。
  if (isFloatEqual(aspectRatio, 0.625)) aspectRatio = 0.625
  // 接近 4:3 时规范为 0.75。
  else if (isFloatEqual(aspectRatio, 0.75)) aspectRatio = 0.75
  // 接近 16:9 时规范为 0.5625。
  else if (isFloatEqual(aspectRatio, 0.5625)) aspectRatio = 0.5625

  // 返回规范后的比例。
  return aspectRatio
}

/**
 * 向上查找文本节点最近的样式 span。
 *
 * @param textNode - 需要检查的文本节点。
 * @param styleProp - 需要查找的样式属性名。
 * @returns 包含目标样式的 span 元素；找不到时返回 `null`。
 * @throws 当前函数不主动抛错。
 * @remarks 查找会在遇到 li 时停止，避免跨出当前列表项的直接文本样式范围。
 */
const getTextNodeStyleSpan = (textNode: Text, styleProp: 'fontSize' | 'color') => {
  // 从文本节点父元素开始向上查找。
  let parent = textNode.parentElement

  // 持续向上查找直到根节点或列表项边界。
  while (parent) {
    // 找到带目标样式的 span 时返回该元素。
    if (parent.tagName === 'SPAN' && parent.style[styleProp]) return parent
    // 到达 li 后停止，避免把列表容器外层样式误判为当前文本直接样式。
    if (parent.tagName === 'LI') break
    // 继续向上查找父级。
    parent = parent.parentElement
  }

  // 未找到符合条件的 span。
  return null
}

/**
 * 获取列表项内所有直接文本共同拥有的样式值。
 *
 * @param li - 列表项元素。
 * @param styleProp - 样式属性名，支持字体大小和颜色。
 * @returns 当列表项直接文本都来自同一个带样式 span 时返回样式值，否则返回空字符串。
 * @throws DOM TreeWalker 异常会按浏览器行为表现。
 * @remarks 该函数用于把列表项内重复的文本样式提升到 ul/ol 上，减少导入后的 HTML 冗余。
 */
const getListItemStyleValue = (li: HTMLLIElement, styleProp: 'fontSize' | 'color') => {
  // 创建文本节点遍历器，只遍历 li 下的文本节点。
  const walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT)
  // 记录第一个有效文本节点所在的样式 span。
  let styleSpan: HTMLSpanElement | null = null
  // 标记当前 li 是否存在非空文本。
  let hasTextContent = false

  // 读取第一个文本节点。
  let currentNode = walker.nextNode()
  // 遍历所有文本节点。
  while (currentNode) {
    // 将当前节点按文本节点处理。
    const textNode = currentNode as Text
    // 去除空白后判断是否有真实文本内容。
    const textContent = textNode.textContent?.replace(/\s+/g, '')

    // 只处理非空文本。
    if (textContent) {
      // 确认该文本节点属于当前 li，而不是嵌套子 li。
      const parentLi = textNode.parentElement?.closest('li')
      // 仅处理当前列表项的直接文本内容。
      if (parentLi === li) {
        // 标记当前列表项确实有可统计文本。
        hasTextContent = true

        // 查找该文本节点最近的目标样式 span。
        const currentStyleSpan = getTextNodeStyleSpan(textNode, styleProp)
        // 任一文本没有样式 span，则不能提升统一样式。
        if (!currentStyleSpan) return ''
        // 第一次找到样式 span 时记录下来。
        if (!styleSpan) styleSpan = currentStyleSpan as HTMLSpanElement
        // 后续文本必须来自同一个样式 span，否则认为样式不统一。
        else if (styleSpan !== currentStyleSpan) return ''
      }
    }

    // 继续遍历下一个文本节点。
    currentNode = walker.nextNode()
  }

  // 存在文本且找到统一样式 span 时返回对应样式值，否则返回空字符串。
  return hasTextContent && styleSpan ? styleSpan.style[styleProp] : ''
}

/**
 * 将列表项中统一的文本样式提升到列表容器上。
 *
 * @param html - 待处理的富文本 HTML。
 * @returns 处理后的 HTML 字符串。
 * @throws DOMParser 或 DOM 操作异常会按浏览器行为表现。
 * @remarks
 * - 仅在 HTML 中存在 ul/ol 且包含 font-size 或 color 样式时处理。
 * - 当所有 li 的直接文本拥有相同字体大小或颜色时，会把样式写到列表元素上。
 */
const promoteListTextStyle = (html: string) => {
  // 没有列表或没有目标样式时直接返回原 HTML，减少 DOMParser 开销。
  if (!/<(ul|ol)\b/i.test(html) || (!/font-size\s*:/i.test(html) && !/color\s*:/i.test(html))) return html

  // 用 DOMParser 解析 HTML，方便安全地遍历列表结构。
  const parser = new DOMParser()
  // 以 text/html 模式解析导入的富文本片段。
  const doc = parser.parseFromString(html, 'text/html')
  // 查找所有无序和有序列表。
  const lists = doc.body.querySelectorAll<HTMLElement>('ul, ol')

  // 遍历每个列表容器。
  lists.forEach(list => {
    // 只取直接子级 li，避免嵌套列表项干扰当前层级样式判断。
    const listItems = Array.from(list.children).filter(child => child.tagName === 'LI') as HTMLLIElement[]
    // 没有列表项时无需处理。
    if (!listItems.length) return

    // 列表自身没有 font-size 时，尝试从所有 li 中提升统一字体大小。
    if (!list.style.fontSize) {
      // 记录候选字体大小。
      let fontSize = ''
      // 遍历列表项，检查每项字体大小是否一致。
      for (const li of listItems) {
        // 获取当前 li 内直接文本共同字体大小。
        const currentFontSize = getListItemStyleValue(li, 'fontSize')
        // 任一 li 无法确定字体大小，则放弃提升。
        if (!currentFontSize) {
          fontSize = ''
          break
        }
        // 第一个有效字体大小作为基准。
        if (!fontSize) fontSize = currentFontSize
        // 后续字体大小必须与基准一致。
        else if (fontSize !== currentFontSize) {
          fontSize = ''
          break
        }
      }
      // 所有列表项字体大小一致时，写入列表容器。
      if (fontSize) list.style.fontSize = fontSize
    }

    // 列表自身没有 color 时，尝试从所有 li 中提升统一颜色。
    if (!list.style.color) {
      // 记录候选颜色。
      let color = ''
      // 遍历列表项，检查每项颜色是否一致。
      for (const li of listItems) {
        // 获取当前 li 内直接文本共同颜色。
        const currentColor = getListItemStyleValue(li, 'color')
        // 任一 li 无法确定颜色，则放弃提升。
        if (!currentColor) {
          color = ''
          break
        }
        // 第一个有效颜色作为基准。
        if (!color) color = currentColor
        // 后续颜色必须与基准一致。
        else if (color !== currentColor) {
          color = ''
          break
        }
      }
      // 所有列表项颜色一致时，写入列表容器。
      if (color) list.style.color = color
    }
  })

  // 返回处理后的 body 内部 HTML。
  return doc.body.innerHTML
}

/**
 * 转换导入文本 HTML，使其更适合 PPTist 富文本编辑器。
 *
 * @param html - 导入得到的原始 HTML。
 * @param ratio - PPTX 到 PPTist 画布的尺寸缩放比例。
 * @returns 转换后的 HTML。
 * @throws 当前函数不主动抛错；正则替换异常会按 JavaScript 行为表现。
 * @remarks
 * - 会把 pt 字号按比例转换为 px。
 * - 会把 `&nbsp;` 转换为空格。
 * - 对文本渐变色做降级：提取渐变中的颜色并计算平均色，写成普通 color。
 */
const convertTextContent = (html: string, ratio: number) => {
  // 空 HTML 直接返回空字符串。
  if (!html) return ''
  // 先处理字号和 nbsp，再处理 style 中的文本渐变背景。
  const processedHtml = html.replace(/font-size:\s*([\d.]+)pt/g, (match, p1) => {
    // 按导入比例把 pt 字号转换成 px，并向下取整。
    return `font-size: ${Math.floor(parseFloat(p1) * ratio)}px`
  }).replace(/&nbsp;/g, ' ').replace(/style="([^"]*)"/g, (match, styleStr: string) => {
    // 查找 style 中的 linear-gradient 背景。
    const gradientMatch = styleStr.match(/background:\s*(linear-gradient\([^)]+\))/)
    // 没有渐变背景时保持原 style。
    if (!gradientMatch) return match

    // 提取渐变中的颜色值。
    const colorMatches = gradientMatch[1].match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgba?\([^)]+\)/g)
    // 没有可识别颜色时保持原 style。
    if (!colorMatches || !colorMatches.length) return match

    // 使用 tinycolor 解析所有渐变色。
    const colors = colorMatches.map(c => tinycolor(c))
    // 计算所有渐变色 RGB 的平均值。
    const avgColor = colors.reduce((acc, c) => {
      // 获取当前颜色 RGB。
      const rgb = c.toRgb()
      // 按颜色数量平均累加。
      return {
        r: acc.r + rgb.r / colors.length,
        g: acc.g + rgb.g / colors.length,
        b: acc.b + rgb.b / colors.length,
      }
    }, { r: 0, g: 0, b: 0 })
    // 将平均色转换为 hex 字符串。
    const hexColor = tinycolor(avgColor).toHexString()

    // 移除文本渐变相关样式，避免 ProseMirror 或导出流程无法稳定处理。
    let newStyle = styleStr
      .replace(/background:\s*linear-gradient\([^)]+\)\s*;?/g, '')
      .replace(/background-clip:\s*text\s*;?/g, '')
      .replace(/color:\s*transparent\s*;?/g, '')
    // 用平均色写入普通 color，并清理重复分号。
    newStyle = `color: ${hexColor}; ${newStyle}`.replace(/;\s*;/g, ';').replace(/;\s*$/, ';')
    // 返回替换后的 style 属性。
    return `style="${newStyle}"`
  })

  // 进一步把列表项中的统一样式提升到列表容器上。
  return promoteListTextStyle(processedHtml)
}

/**
 * 获取 HTML 中声明的最大 pt 字号。
 *
 * @param html - 待扫描的 HTML 字符串。
 * @param defaultFontSize - 没有匹配到字号时使用的默认字号。
 * @returns 最大字号数值，单位保持为 pt。
 * @throws 当前函数不主动抛错。
 * @remarks 用于段落行高和 margin 估算，帮助导入文本更接近 PPTX 版式。
 */
const getMaxFontSize = (html: string, defaultFontSize: number = 18): number => {
  // 匹配 style 中的 font-size: xxpt。
  const fontSizeRegex = /font-size\s*:\s*(\d+(?:\.\d+)?)\s*pt/gi
  // 初始化字号列表，保证没有匹配时也能返回默认值。
  const fontSizes = [defaultFontSize]

  // 正则循环匹配所有字号。
  let match
  while ((match = fontSizeRegex.exec(html)) !== null) {
    // 转成浮点数。
    const size = parseFloat(match[1])
    // 只记录正数字号。
    if (size > 0) fontSizes.push(size)
  }

  // 返回最大字号。
  return Math.max(...fontSizes)
}

/**
 * 从段落 HTML 中估算行高和段落间距。
 *
 * @param html - 原始或转换前的富文本 HTML。
 * @param ratio - PPTX 到 PPTist 画布的尺寸缩放比例。
 * @returns 行高倍数和段落间距；无间距时 margin 为 null。
 * @throws 当前函数不主动抛错。
 * @remarks
 * - 会扫描 div/p/li 开始标签上的 style。
 * - line-height 为 pt 时会除以段落最大字号，转换成倍数。
 * - margin-top/margin-bottom 支持 pt 和 em，并按 ratio 转为 PPTist 坐标尺度。
 */
const getParagraphMetrics = (html: string, ratio: number) => {
  // 匹配 div、p、li 开始标签，避免把 div2 这类标签误匹配。
  const tagRegex = /<(div|p|li)(?![a-z0-9])[^>]*>/gi

  // 收集每个段落的行高倍数。
  const lineHeights = []
  // 收集段落间距值。
  const margins = []
  // 段落数量。
  let paragraphCount = 0

  // 遍历所有段落类标签。
  let match
  // 当前段落索引。
  let paragraphIndex = 0
  while ((match = tagRegex.exec(html)) !== null) {
    // 完整开始标签文本。
    const fullTag = match[0]
    // 计数段落。
    paragraphCount++

    // 匹配 style 属性。
    const styleRegex = /\bstyle\s*=\s*(['"])(.*?)\1/i
    // 从开始标签中提取 style。
    const styleMatch = fullTag.match(styleRegex)

    // 当前标签 style 内容。
    let styleContent = ''
    // 如果存在 style 属性，则读取属性值。
    if (styleMatch && styleMatch[2]) {
      styleContent = styleMatch[2]
    }

    /**
     * 从当前标签 style 中读取指定 CSS 属性值。
     *
     * @param propName - CSS 属性名。
     * @returns 属性值；不存在时返回 null。
     */
    const getProp = (propName: string) => {
      // 没有 style 时直接返回 null。
      if (!styleContent) return null
      // 构造属性匹配正则。
      const propRegex = new RegExp(`${propName}\\s*:\\s*([^;]+)`, 'i')
      // 查找属性值。
      const propMatch = styleContent.match(propRegex)
      // 返回去除首尾空白后的属性值。
      return propMatch ? propMatch[1].trim() : null
    }

    // 读取段落上外边距。
    const marginTop = getProp('margin-top')
    // 读取段落下外边距。
    const marginBottom = getProp('margin-bottom')
    // 读取行高。
    const lineHeight = getProp('line-height')

    // 当前段落开始标签在 HTML 中的位置。
    const tagStartIndex = match.index
    // 当前段落标签名。
    const tagName = match[1]
    // 查找当前段落结束标签位置。
    let tagEndIndex = html.indexOf('</' + tagName + '>', tagStartIndex)
    // 没有结束标签时，退化为仅使用开始标签长度。
    if (tagEndIndex === -1) tagEndIndex = tagStartIndex + fullTag.length

    // 当前段落 HTML 片段。
    const paragraphHtml = html.substring(tagStartIndex, tagEndIndex)
    // 当前段落最大字号，用于把 pt 行高换算成倍数。
    const maxFontSize = getMaxFontSize(paragraphHtml, 18)

    // 当前段落默认行高倍数为 1。
    let lineHeightValue = 1
    // 如果段落声明了 line-height，则按单位转换。
    if (lineHeight) {
      // pt 行高需要除以最大字号，转换成富文本编辑器使用的行高倍数。
      if (lineHeight.indexOf('pt') !== -1) {
        lineHeightValue = parseFloat(lineHeight.replace('pt', '')) / maxFontSize
      }
      // 非 pt 时按普通数值行高处理。
      else {
        lineHeightValue = parseFloat(lineHeight)
      }
    }
    // 记录当前段落行高。
    lineHeights.push(lineHeightValue)

    // 判断当前段落是否是第一个段落，首段 margin-top 不计入段间距。
    const isFirstParagraph = paragraphIndex === 0
    // 判断当前段落是否近似为最后一个同名段落，末段 margin-bottom 不计入段间距。
    const isLastParagraph = match.index + fullTag.length >= html.lastIndexOf('</' + tagName + '>')

    // 非首段的 margin-top 可作为段间距候选。
    if (marginTop && !isFirstParagraph) {
      // 当前上外边距的 pt 近似值。
      let marginTopValue = 0
      // pt 单位直接读取数值。
      if (marginTop.indexOf('pt') !== -1) {
        marginTopValue = parseFloat(marginTop.replace('pt', ''))
      }
      // em 单位按当前段落最大字号换算。
      else if (marginTop.indexOf('em') !== -1) {
        marginTopValue = parseFloat(marginTop.replace('em', '')) * maxFontSize
      }
      // 只保留正向间距。
      if (marginTopValue > 0) margins.push(marginTopValue)
    }

    // 非末段的 margin-bottom 可作为段间距候选。
    if (marginBottom && !isLastParagraph) {
      // 当前下外边距的 pt 近似值。
      let marginBottomValue = 0
      // pt 单位直接读取数值。
      if (marginBottom.indexOf('pt') !== -1) {
        marginBottomValue = parseFloat(marginBottom.replace('pt', ''))
      }
      // em 单位按当前段落最大字号换算。
      else if (marginBottom.indexOf('em') !== -1) {
        marginBottomValue = parseFloat(marginBottom.replace('em', '')) * maxFontSize
      }
      // 只保留正向间距。
      if (marginBottomValue > 0) margins.push(marginBottomValue)
    }

    // 推进段落索引。
    paragraphIndex++
  }

  // 默认行高倍数。
  let lineHeight = 1
  // 如果统计到行高，则使用平均行高并保留两位小数。
  if (lineHeights.length) {
    lineHeight = +(lineHeights.reduce((sum, height) => sum + height, 0) / paragraphCount).toFixed(2)
  }

  // 默认段间距。
  let margin = 0
  // 多段落且存在 margin 时，按段间隔数量计算平均间距。
  if (margins.length && paragraphCount > 1) {
    margin = margins.reduce((sum, margin) => sum + margin, 0) / (paragraphCount - 1)
  }

  // 返回文本段落度量；margin 会按导入缩放比例转换到 PPTist 坐标尺度。
  return {
    lineHeight,
    margin: margin ? +(margin * ratio).toFixed(1) : null,
  }
}

/**
 * 提供 JSON、PPTist 专用文件和 PPTX 文件导入能力。
 *
 * @returns 导入状态和导入方法集合。
 * @throws 当前 composable 不主动抛错；文件读取、PPTX 解析、store 更新和历史快照写入异常会按对应流程表现。
 * @remarks 当前批次注释覆盖通用文本处理工具和 JSON/PPTist 文件导入入口，PPTX 元素解析后续继续细化。
 */
export default () => {
  // 获取幻灯片 store，用于导入后写入页面、主题、标题和画布配置。
  const slidesStore = useSlidesStore()
  // 当前主题、画布比例和画布宽度。
  const { theme, viewportRatio, viewportSize } = storeToRefs(slidesStore)

  // 获取历史快照写入方法。
  const { addHistorySnapshot } = useHistorySnapshot()
  // 获取追加页面数据的方法，用于非覆盖导入。
  const { addSlidesFromData } = useAddSlidesOrElements()
  // 获取当前演示文稿是否是一张空白页。
  const { isEmptySlide } = useSlideHandler()

  // 导入过程状态，供 UI 显示加载中或禁用重复操作。
  const exporting = ref(false)

  /**
   * 导入普通 JSON 文件。
   *
   * @param files - 文件列表，使用第一个文件作为导入源。
   * @param cover - 是否覆盖当前演示文稿。
   * @returns 无显式返回值。
   * @throws 文件读取异常会按浏览器行为表现；解析失败会显示错误消息。
   * @remarks
   * - JSON 文件预期包含 `title`、`slides`、`theme`、`width`、`height` 字段。
   * - cover 为 true 时覆盖当前内容；当前文稿为空白页时也直接替换；否则追加导入页面。
   */
  const importJSON = (files: FileList | File[], cover = false) => {
    // 只使用第一个文件。
    const file = files[0]

    // 创建文件读取器。
    const reader = new FileReader()
    // 文件读取完成后解析 JSON。
    reader.addEventListener('load', () => {
      // 捕获解析或数据写入异常，并提示用户。
      try {
        // 从 JSON 中读取演示文稿基础数据。
        const { title, slides, theme, width, height } = JSON.parse(reader.result as string)
        // 根据导入文件宽高计算画布比例。
        const aspectRatio = getAspectRatio(width, height)

        // 覆盖导入：替换当前演示文稿。
        if (cover) {
          // 覆盖后回到第一页。
          slidesStore.updateSlideIndex(0)
          // 写入页面和主题。
          slidesStore.setSlides(slides, (theme || {}))
          // 同步标题。
          if (title) slidesStore.setTitle(title)
          // 同步画布比例。
          if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
          // 同步画布宽度；这里保留既有比较逻辑。
          if (width && width !== viewportSize) slidesStore.setViewportSize(width)
          // 记录历史快照。
          addHistorySnapshot()
        }
        // 当前是空白页时，直接用导入内容替换空白页。
        else if (isEmptySlide.value) {
          // 写入页面和主题。
          slidesStore.setSlides(slides, (theme || {}))
          // 同步画布比例。
          if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
          // 同步画布宽度；这里保留既有比较逻辑。
          if (width && width !== viewportSize) slidesStore.setViewportSize(width)
          // 记录历史快照。
          addHistorySnapshot()
        }
        // 非覆盖且当前文稿非空时，追加页面并重建 ID。
        else addSlidesFromData(slides)
      }
      // JSON 无法读取或结构不符合预期时提示用户。
      catch {
        message.error('无法正确读取 / 解析该文件')
      }
    })
    // 以文本方式读取文件。
    reader.readAsText(file)
  }

  /**
   * 导入 PPTist 专用文件。
   *
   * @param files - 文件列表，使用第一个文件作为导入源。
   * @param cover - 是否覆盖当前演示文稿。
   * @returns 无显式返回值。
   * @throws 文件读取异常会按浏览器行为表现；解密或解析失败会显示错误消息。
   * @remarks PPTist 文件是加密 JSON，解密后的字段结构与普通 JSON 导入一致。
   */
  const importSpecificFile = (files: FileList | File[], cover = false) => {
    // 只使用第一个文件。
    const file = files[0]

    // 创建文件读取器。
    const reader = new FileReader()
    // 文件读取完成后解密并解析 JSON。
    reader.addEventListener('load', () => {
      // 捕获解密、解析或数据写入异常。
      try {
        // 解密文件内容并解析演示文稿数据。
        const { title, slides, theme, width, height } = JSON.parse(decrypt(reader.result as string))
        // 根据导入文件宽高计算画布比例。
        const aspectRatio = getAspectRatio(width, height)

        // 覆盖导入：替换当前演示文稿。
        if (cover) {
          // 覆盖后回到第一页。
          slidesStore.updateSlideIndex(0)
          // 写入页面和主题。
          slidesStore.setSlides(slides, (theme || {}))
          // 同步标题。
          if (title) slidesStore.setTitle(title)
          // 同步画布比例。
          if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
          // 同步画布宽度；这里保留既有比较逻辑。
          if (width && width !== viewportSize) slidesStore.setViewportSize(width)
          // 记录历史快照。
          addHistorySnapshot()
        }
        // 当前是空白页时，直接用导入内容替换空白页。
        else if (isEmptySlide.value) {
          // 写入页面和主题。
          slidesStore.setSlides(slides, (theme || {}))
          // 同步画布比例。
          if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
          // 同步画布宽度；这里保留既有比较逻辑。
          if (width && width !== viewportSize) slidesStore.setViewportSize(width)
          // 记录历史快照。
          addHistorySnapshot()
        }
        // 非覆盖且当前文稿非空时，追加页面并重建 ID。
        else addSlidesFromData(slides)
      }
      // 文件无法解密、解析或结构不符合预期时提示用户。
      catch {
        message.error('无法正确读取 / 解析该文件')
      }
    })
    // 以文本方式读取文件。
    reader.readAsText(file)
  }

  /**
   * 旋转导入后的线条局部起终点，并计算元素外接框位置偏移。
   *
   * @param line - PPTist 线条元素数据。
   * @param angleDeg - 旋转角度，单位为度。
   * @returns 旋转后的局部起点、终点，以及外接框左上角相对旋转前的偏移。
   * @throws 当前函数不主动抛错；非法坐标或角度会按 JavaScript 数学规则产生 `NaN`。
   * @remarks
   * - PPTist 线条用 `left/top + 局部 start/end` 建模。
   * - 旋转后需要重新把起终点归一到新的局部坐标系，并把外接框偏移补回 left/top。
   */
  const rotateLine = (line: PPTLineElement, angleDeg: number) => {
    // 读取线条局部起点和终点。
    const { start, end } = line
      
    // 将角度从度转换为弧度。
    const angleRad = angleDeg * Math.PI / 180
    
    // 计算起终点中点，作为线段旋转中心。
    const midX = (start[0] + end[0]) / 2
    // 计算起终点中点 y。
    const midY = (start[1] + end[1]) / 2
    
    // 将起点平移到以中点为原点的坐标系。
    const startTransX = start[0] - midX
    // 起点相对中点的 y 偏移。
    const startTransY = start[1] - midY
    // 将终点平移到以中点为原点的坐标系。
    const endTransX = end[0] - midX
    // 终点相对中点的 y 偏移。
    const endTransY = end[1] - midY
    
    // 预计算 cos 值。
    const cosA = Math.cos(angleRad)
    // 预计算 sin 值。
    const sinA = Math.sin(angleRad)
    
    // 使用二维旋转矩阵计算起点旋转后的相对 x。
    const startRotX = startTransX * cosA - startTransY * sinA
    // 使用二维旋转矩阵计算起点旋转后的相对 y。
    const startRotY = startTransX * sinA + startTransY * cosA
    
    // 使用二维旋转矩阵计算终点旋转后的相对 x。
    const endRotX = endTransX * cosA - endTransY * sinA
    // 使用二维旋转矩阵计算终点旋转后的相对 y。
    const endRotY = endTransX * sinA + endTransY * cosA
    
    // 将旋转后的起点平移回原局部坐标系。
    const startNewX = startRotX + midX
    // 将旋转后的起点 y 平移回原局部坐标系。
    const startNewY = startRotY + midY
    // 将旋转后的终点 x 平移回原局部坐标系。
    const endNewX = endRotX + midX
    // 将旋转后的终点 y 平移回原局部坐标系。
    const endNewY = endRotY + midY
    
    // 旋转前局部外接框最小 x。
    const beforeMinX = Math.min(start[0], end[0])
    // 旋转前局部外接框最小 y。
    const beforeMinY = Math.min(start[1], end[1])
    
    // 旋转后外接框最小 x。
    const afterMinX = Math.min(startNewX, endNewX)
    // 旋转后外接框最小 y。
    const afterMinY = Math.min(startNewY, endNewY)
    
    // 将旋转后起点归一到新外接框局部坐标系。
    const startAdjustedX = startNewX - afterMinX
    // 将旋转后起点 y 归一到新外接框局部坐标系。
    const startAdjustedY = startNewY - afterMinY
    // 将旋转后终点 x 归一到新外接框局部坐标系。
    const endAdjustedX = endNewX - afterMinX
    // 将旋转后终点 y 归一到新外接框局部坐标系。
    const endAdjustedY = endNewY - afterMinY
    
    // 组装新的局部起点。
    const startAdjusted: [number, number] = [startAdjustedX, startAdjustedY]
    // 组装新的局部终点。
    const endAdjusted: [number, number] = [endAdjustedX, endAdjustedY]
    // 计算旋转后外接框相对旋转前外接框的位置偏移。
    const offset = [afterMinX - beforeMinX, afterMinY - beforeMinY]
    
    // 返回旋转后的局部起终点和 left/top 修正偏移。
    return {
      start: startAdjusted,
      end: endAdjusted,
      offset,
    }
  }

  /**
   * 将 PPTX 解析出的连接线 Shape 转换为 PPTist 线条元素。
   *
   * @param el - pptxtojson 输出的形状数据。
   * @param ratio - PPTX 坐标到 PPTist 坐标的缩放比例。
   * @returns PPTist 线条元素。
   * @throws ID 生成异常会按运行时错误表现。
   * @remarks
   * - PPTX 连接线翻转会影响起终点方向，需要先根据 flip 状态确定 start/end。
   * - bentConnector 转换为双折线，curvedConnector 转换为三次贝塞尔曲线。
   */
  const parseLineElement = (el: Shape, ratio: number) => {
    // 初始化线条起点。
    let start: [number, number] = [0, 0]
    // 初始化线条终点。
    let end: [number, number] = [0, 0]

    // 未翻转时，连接线从左上到右下。
    if (!el.isFlipV && !el.isFlipH) { // 右下
      start = [0, 0]
      end = [el.width, el.height]
    }
    // 同时水平和垂直翻转时，连接线从右下到左上。
    else if (el.isFlipV && el.isFlipH) { // 左上
      start = [el.width, el.height]
      end = [0, 0]
    }
    // 垂直翻转时，连接线从左下到右上。
    else if (el.isFlipV && !el.isFlipH) { // 右上
      start = [0, el.height]
      end = [el.width, 0]
    }
    // 水平翻转时，连接线从右上到左下。
    else { // 左下
      start = [el.width, 0]
      end = [0, el.height]
    }

    // 构造基础线条元素。
    const data: PPTLineElement = {
      type: 'line',
      id: nanoid(10),
      // 线宽按导入比例缩放并保留两位小数。
      width: +((el.borderWidth || 1) * ratio).toFixed(2),
      left: el.left,
      top: el.top,
      start,
      end,
      style: el.borderType,
      color: el.borderColor,
      points: ['', /straightConnector/.test(el.shapType) ? 'arrow' : '']
    }
    // PPTX 线条存在旋转角度时，需要重算局部起终点和元素位置。
    if (el.rotate) {
      // 旋转线条局部点位。
      const { start, end, offset } = rotateLine(data, el.rotate)

      // 写入旋转后的起点。
      data.start = start
      // 写入旋转后的终点。
      data.end = end
      // 用旋转外接框偏移修正元素 left。
      data.left = data.left + offset[0]
      // 用旋转外接框偏移修正元素 top。
      data.top = data.top + offset[1]
    }
    // 折线连接器转换为 PPTist 双折线控制点。
    if (/bentConnector/.test(el.shapType)) {
      // 初始控制点放在线条局部外接框中心。
      data.broken2 = [
        Math.abs(data.start[0] - data.end[0]) / 2,
        Math.abs(data.start[1] - data.end[1]) / 2,
      ]
    }
    // 曲线连接器转换为 PPTist 三次贝塞尔控制点。
    if (/curvedConnector/.test(el.shapType)) {
      // 初始两个控制点都放在线条局部外接框中心。
      const cubic: [number, number] = [
        Math.abs(data.start[0] - data.end[0]) / 2,
        Math.abs(data.start[1] - data.end[1]) / 2,
      ]
      // PPTist 三次贝塞尔需要两个控制点。
      data.cubic = [cubic, cubic]
    }

    // 返回转换后的线条元素。
    return data
  }

  /**
   * 翻转一组元素的位置。
   *
   * @param elements - 需要翻转的元素列表。
   * @param axis - 翻转轴；`x` 表示上下翻转，`y` 表示左右翻转。
   * @returns 翻转后的元素列表。
   * @throws 当 elements 为空时会产生无穷范围，这是当前既有行为。
   * @remarks
   * - 该函数只处理元素 left/top 的镜像位置，不改写元素自身旋转和内部点位。
   * - 翻转中心是整个元素组的外接矩形中心。
   */
  const flipGroupElements = (elements: BaseElement[], axis: 'x' | 'y') => {
    // 计算元素组最小 x。
    const minX = Math.min(...elements.map(el => el.left))
    // 计算元素组最大 x。
    const maxX = Math.max(...elements.map(el => el.left + el.width))
    // 计算元素组最小 y。
    const minY = Math.min(...elements.map(el => el.top))
    // 计算元素组最大 y。
    const maxY = Math.max(...elements.map(el => el.top + el.height))

    // 元素组水平中心。
    const centerX = (minX + maxX) / 2
    // 元素组垂直中心。
    const centerY = (minY + maxY) / 2

    // 遍历并返回翻转后的元素拷贝。
    return elements.map(element => {
      // 浅拷贝元素，避免直接修改原对象。
      const newElement = { ...element }

      // y 轴翻转表示左右镜像，需要根据组水平中心重算 left。
      if (axis === 'y') newElement.left = 2 * centerX - element.left - element.width
      // x 轴翻转表示上下镜像，需要根据组垂直中心重算 top。
      if (axis === 'x') newElement.top = 2 * centerY - element.top - element.height
  
      // 返回翻转后的元素。
      return newElement
    })
  }

  /**
   * 计算子元素在旋转父元素坐标系中的画布位置。
   *
   * @param ax - 父元素 A 的 x 坐标。
   * @param ay - 父元素 A 的 y 坐标。
   * @param aw - 父元素 A 的宽度。
   * @param ah - 父元素 A 的高度。
   * @param bx - 子元素 B 相对 A 的 x 坐标。
   * @param by - 子元素 B 相对 A 的 y 坐标。
   * @param bw - 子元素 B 的宽度。
   * @param bh - 子元素 B 的高度。
   * @param ak - 父元素 A 的旋转角度，单位为度。
   * @param bk - 子元素 B 的旋转角度，单位为度。
   * @returns 子元素旋转后的画布左上角坐标和全局旋转角度。
   * @throws 当前函数不主动抛错；非法数字会产生 `NaN`。
   * @remarks 用于 PPTX 组合元素导入时，把组内相对坐标换算为画布绝对坐标。
   */
  const calculateRotatedPosition = (
    ax: number, // A 的 x
    ay: number, // A 的 y
    aw: number, // A 的宽
    ah: number, // A 的高
    bx: number, // B 相对 A 的 x (ox)
    by: number, // B 相对 A 的 y (oy)
    bw: number, // B 的宽
    bh: number, // B 的高
    ak: number, // A 的旋转角度（度，正顺时针）
    bk: number, // B 的旋转角度（度，正顺时针）
  ) => {
    // 将父元素旋转角度转换为弧度。
    const aRadians = ak * (Math.PI / 180)
    // 父元素旋转角 cos 值。
    const aCos = Math.cos(aRadians)
    // 父元素旋转角 sin 值。
    const aSin = Math.sin(aRadians)

    // 父元素中心 x。
    const aCenterX = ax + aw / 2
    // 父元素中心 y。
    const aCenterY = ay + ah / 2

    // 子元素在父元素局部坐标中的四个角点。
    const corners = [
      { ox: bx, oy: by },
      { ox: bx + bw, oy: by },
      { ox: bx + bw, oy: by + bh },
      { ox: bx, oy: by + bh },
    ]

    // 子元素四角旋转后外接框最小 x。
    let minX = Infinity
    // 子元素四角旋转后外接框最小 y。
    let minY = Infinity

    // 遍历子元素四个角点，计算旋转后的画布坐标。
    for (const corner of corners) {
      // 将子元素角点转换为相对父元素中心的 x。
      const relativeX = corner.ox - aw / 2
      // 将子元素角点转换为相对父元素中心的 y。
      const relativeY = corner.oy - ah / 2

      // 按父元素旋转角计算旋转后的相对 x。
      const rotatedX = relativeX * aCos + relativeY * aSin
      // 按父元素旋转角计算旋转后的相对 y；保留当前 PPTX 坐标转换约定。
      const rotatedY = -relativeX * aSin + relativeY * aCos

      // 平移到画布绝对 x。
      const graphicX = aCenterX + rotatedX
      // 平移到画布绝对 y。
      const graphicY = aCenterY + rotatedY

      // 更新外接框最小 x。
      minX = Math.min(minX, graphicX)
      // 更新外接框最小 y。
      minY = Math.min(minY, graphicY)
    }

    // 子元素全局旋转角为父旋转加子自身旋转。
    const globalRotation = (bk + ak) % 360

    // 返回子元素画布左上角和全局旋转角。
    return { x: minX, y: minY, globalRotation }
  }

  /**
   * 导入 PPTX 文件。
   *
   * @param files - 文件列表，使用第一个文件作为导入源。
   * @param options - 导入选项；cover 表示覆盖当前演示文稿，fixedViewport 表示固定 PPTist 画布宽度。
   * @param options.onComplete - 可选导入完成回调，主要给 iframe 消息桥接等待预览完成使用。
   * @param options.onError - 可选导入失败回调，主要给 iframe 消息桥接回传失败状态使用。
   * @returns 无显式返回值。
   * @throws 文件读取异常会按浏览器行为表现；PPTX 解析失败会显示错误消息并结束导入。
   * @remarks
   * - PPTX 会先通过 `pptxtojson` 解析为 JSON，再转换为 PPTist Slide/Element 数据。
   * - 元素解析细节在后续代码块中完成，当前函数同时负责主题色、背景和画布尺寸初始化。
   */
  const importPPTXFile = (files: FileList | File[], options?: { cover?: boolean; fixedViewport?: boolean; onComplete?: () => void; onError?: () => void }) => {
    // 默认导入选项。
    const defaultOptions = {
      cover: false,
      fixedViewport: false, 
      onComplete: undefined as (() => void) | undefined,
      onError: undefined as (() => void) | undefined,
    }
    // 合并调用方选项。
    const { cover, fixedViewport, onComplete, onError } = { ...defaultOptions, ...options }

    // 只使用第一个文件。
    const file = files[0]
    // 没有文件时直接返回。
    if (!file) {
      // 没有文件时触发失败回调，便于 iframe bridge 给父级返回明确错误。
      onError?.()
      // 结束导入流程。
      return
    }

    // 标记导入中。
    exporting.value = true

    // 展开形状配置池，后续 PPTX shape 匹配会使用。
    const shapeList: ShapePoolItem[] = []
    // 遍历形状分类。
    for (const item of SHAPE_LIST) {
      // 收集分类下的全部形状。
      shapeList.push(...item.children)
    }
    
    // 创建文件读取器，后续以 ArrayBuffer 读取 PPTX。
    const reader = new FileReader()
    // 文件读取完成后开始解析 PPTX。
    reader.onload = async e => {
      // pptxtojson 解析结果。
      let json = null
      // 尝试调用 pptxtojson 解析 PPTX 文件。
      try {
        // 将 ArrayBuffer 解析为包含尺寸、主题色、页面和元素的 JSON。
        json = await parse(e.target!.result as ArrayBuffer, {
          // 图片以 base64 形式输出，便于直接写入 PPTist 图片元素。
          imageMode: 'base64',
          // 视频以 blob 形式输出，便于创建本地播放 URL。
          videoMode: 'blob',
          // 音频以 blob 形式输出，便于创建本地播放 URL。
          audioMode: 'blob',
        })
      }
      // 解析失败时结束导入并提示用户。
      catch {
        // 清除导入中状态。
        exporting.value = false
        // 显示导入失败提示。
        message.error('无法正确读取 / 解析该文件')
        // 通知调用方导入失败，便于 iframe bridge 回传错误。
        onError?.()
        return
      }

      // 默认按 PowerPoint 点单位到浏览器像素的 96/72 比例转换。
      let ratio = 96 / 72
      // PPTX 页面原始宽度。
      const width = json.size.width
      // PPTX 页面原始高度。
      const height = json.size.height

      // 根据 PPTX 尺寸计算画布比例。
      const aspectRatio = getAspectRatio(width, height)
      
      // fixedViewport 模式下固定 PPTist 画布宽度为 1000，并反推缩放比例。
      if (fixedViewport) ratio = 1000 / width
      // 非固定模式下按 PPTX 原始宽度乘转换比例设置画布宽度。
      else slidesStore.setViewportSize(width * ratio)

      // 使用 PPTX 中解析出的主题色作为当前主题色。
      slidesStore.setTheme({ themeColors: json.themeColors })

      // 存储转换后的 PPTist 页面。
      const slides: Slide[] = []
      // 遍历 PPTX 页面。
      for (const item of json.slides) {
        // 读取页面背景填充类型和值。
        const { type, value } = item.fill
        // PPTist 页面背景配置。
        let background: SlideBackground
        // 图片背景转换为 PPTist 图片背景。
        if (type === 'image') {
          background = {
            type: 'image',
            image: {
              src: value.base64,
              size: 'cover',
            },
          }
        }
        // 渐变背景转换为 PPTist 渐变背景。
        else if (type === 'gradient') {
          background = {
            type: 'gradient',
            gradient: {
              // PPTX path 为 line 时按线性渐变，否则按径向渐变。
              type: value.path === 'line' ? 'linear' : 'radial',
              // 转换渐变色标，并把位置转为数字。
              colors: value.colors.map(item => ({
                ...item,
                pos: parseInt(item.pos),
              })),
              // 保留 PPTX 渐变旋转角度。
              rotate: value.rot,
            },
          }
        }
        // 图案背景当前降级为白色纯色背景。
        else if (type === 'pattern') {
          background = {
            type: 'solid',
            color: '#fff',
          }
        }
        // 其他背景按纯色背景处理，并兜底白色。
        else {
          background = {
            type: 'solid',
            color: value || '#fff',
          }
        }

        // 构造 PPTist 幻灯片基础数据。
        const slide: Slide = {
          id: nanoid(10),
          elements: [],
          background,
          remark: item.note || '',
        }

        /**
         * 将 pptxtojson 解析出的元素列表转换为 PPTist 内部元素并追加到当前幻灯片。
         *
         * @param elements - 当前页面、版式、组合或图示中的 PPTX 原始元素列表。
         * @returns 无显式返回值；转换结果会直接追加到当前闭包中的 `slide.elements`。
         * @throws 当前函数不主动抛出异常；若上游元素结构缺失关键字段，可能沿用运行时访问行为。
         * @remarks
         * - 该函数会原地修改传入元素的 `width/height/left/top`，把 PPTX 原始单位缩放为 PPTist 画布像素。
         * - 组合元素和图示元素会递归调用本函数，因此入口必须保持对普通页面元素和嵌套元素都兼容。
         * - 所有元素都按 `order` 排序后插入，保证导入后的层级顺序尽量贴近 PPTX 原文件。
         */
        const parseElements = (elements: Element[]) => {
          // 按 PPTX 中的绘制顺序排序，避免元素叠放关系在导入后反转。
          const sortedElements = elements.sort((a, b) => a.order - b.order)

          // 逐个转换排序后的原始元素。
          for (const el of sortedElements) {
            // 记录缩放前的宽度；为 0 或空时兜底为 1，避免后续 viewBox 比例计算除以 0。
            const originWidth = el.width || 1
            // 记录缩放前的高度；为 0 或空时兜底为 1，避免自定义路径比例计算异常。
            const originHeight = el.height || 1
            // 记录缩放前的左坐标；组合元素子级定位需要使用原始坐标系。
            const originLeft = el.left
            // 记录缩放前的上坐标；组合元素子级定位需要使用原始坐标系。
            const originTop = el.top

            // 将 PPTX 原始宽度转换为 PPTist 画布宽度。
            el.width = el.width * ratio
            // 将 PPTX 原始高度转换为 PPTist 画布高度。
            el.height = el.height * ratio
            // 将 PPTX 原始左坐标转换为 PPTist 画布左坐标。
            el.left = el.left * ratio
            // 将 PPTX 原始上坐标转换为 PPTist 画布上坐标。
            el.top = el.top * ratio
  
            // 文本元素：根据是否存在 PPTX 自动适配文字逻辑，分别转成带文本的形状或纯文本元素。
            if (el.type === 'text') {
              // PowerPoint 的文本自动适配依赖形状文本框能力，这里转换成 PPTist 形状文本以保留框体表现。
              if (el.autoFit && el.autoFit.type === 'text') {
                // 自动适配文字会额外改变字号比例，需要把 PPTX 缩放比例和 autoFit 比例共同折算。
                const fontScale = ratio * (el.autoFit.fontScale || 100) / 100
                // 读取段落级行高和段后距，尽量保留原始文本排版。
                const metrics = getParagraphMetrics(el.content, fontScale)
                // 构造矩形形状承载文本；这样可以同时保留填充、边框、垂直对齐和文本内容。
                const shapeEl: PPTShapeElement = {
                  // PPTist 内部元素类型。
                  type: 'shape',
                  // 新生成内部元素 ID，避免和其他导入元素冲突。
                  id: nanoid(10),
                  // 使用缩放后的宽度。
                  width: el.width,
                  // 使用缩放后的高度。
                  height: el.height,
                  // 使用缩放后的左坐标。
                  left: el.left,
                  // 使用缩放后的上坐标。
                  top: el.top,
                  // 保留 PPTX 文本框旋转角度。
                  rotate: el.rotate,
                  // 默认矩形路径使用 200x200 坐标系，便于后续保持比例渲染。
                  viewBox: [200, 200],
                  // 使用基础矩形路径作为文本承载形状。
                  path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
                  // 仅在 PPTX 填充为纯色时写入 fill，其他类型在该分支暂不转换。
                  fill: el.fill?.type === 'color' ? el.fill.value : '',
                  // 文本框矩形允许自由缩放。
                  fixedRatio: false,
                  // 转换边框配置，边框宽度同样需要按画布比例缩放。
                  outline: {
                    // 边框颜色。
                    color: el.borderColor,
                    // 缩放边框宽度并保留两位小数，避免浮点数过长污染数据。
                    width: +(el.borderWidth * ratio).toFixed(2),
                    // 保留 PPTX 边框线型。
                    style: el.borderType,
                  },
                  // 形状内嵌文本配置。
                  text: {
                    // 把 PPTX HTML 文本片段转换为 PPTist 富文本内容。
                    content: convertTextContent(el.content, fontScale),
                    // 缺省字体使用当前主题字体。
                    defaultFontName: theme.value.fontName,
                    // 缺省文字颜色使用当前主题字体颜色。
                    defaultColor: theme.value.fontColor,
                    // 把 PPTX 垂直对齐转换为 PPTist 对齐值；无法识别时居中兜底。
                    align: vAlignMap[el.vAlign] || 'middle',
                    // 默认行高先置为 1，后续若解析到段落行高会覆盖。
                    lineHeight: 1,
                  },
                }
                // 保留网页链接；PPTist 链接模型用 web 类型承载外部 URL。
                if (el.link) shapeEl.link = { type: 'web', target: el.link }
                // 保留文本框内边距，顺序为上、右、下、左。
                if (el.textInset) shapeEl.text!.inset = [el.textInset.t, el.textInset.r, el.textInset.b, el.textInset.l]
                // 若段落解析得到有效行高，则覆盖默认行高。
                if (metrics.lineHeight) shapeEl.text!.lineHeight = metrics.lineHeight
                // 若段落解析得到段后距，则写入 PPTist 段落间距。
                if (metrics.margin) shapeEl.text!.paragraphSpace = metrics.margin
                // 把转换后的形状文本加入当前幻灯片。
                slide.elements.push(shapeEl)
              }
              // 普通文本框：不需要形状外壳，直接转换为 PPTist 文本元素。
              else {
                // 读取普通文本的段落排版指标。
                const metrics = getParagraphMetrics(el.content, ratio)
                // 构造 PPTist 文本元素。
                const textEl: PPTTextElement = {
                  // PPTist 内部元素类型。
                  type: 'text',
                  // 新生成内部元素 ID。
                  id: nanoid(10),
                  // 使用缩放后的宽度。
                  width: el.width,
                  // 使用缩放后的高度。
                  height: el.height,
                  // 使用缩放后的左坐标。
                  left: el.left,
                  // 使用缩放后的上坐标。
                  top: el.top,
                  // 保留 PPTX 旋转角。
                  rotate: el.rotate,
                  // 缺省字体使用当前主题字体。
                  defaultFontName: theme.value.fontName,
                  // 缺省颜色使用当前主题字体颜色。
                  defaultColor: theme.value.fontColor,
                  // 将 PPTX HTML 文本内容转换为 PPTist 富文本。
                  content: convertTextContent(el.content, ratio),
                  // 默认行高为 1，若段落中解析出行高会在下面覆盖。
                  lineHeight: 1,
                  // 转换文本框边框配置。
                  outline: {
                    // 边框颜色。
                    color: el.borderColor,
                    // 边框宽度按导入比例缩放。
                    width: +(el.borderWidth * ratio).toFixed(2),
                    // 边框线型。
                    style: el.borderType,
                  },
                  // 纯色填充写入文本元素背景；非纯色填充在此分支保持空值。
                  fill: el.fill?.type === 'color' ? el.fill.value : '',
                  // 保留竖排文本标记。
                  vertical: el.isVertical,
                }
                // 保留文字阴影，阴影偏移和模糊半径需要随画布比例缩放。
                if (el.shadow) {
                  textEl.shadow = {
                    // 水平阴影偏移。
                    h: el.shadow.h * ratio,
                    // 垂直阴影偏移。
                    v: el.shadow.v * ratio,
                    // 阴影模糊半径。
                    blur: el.shadow.blur * ratio,
                    // 阴影颜色。
                    color: el.shadow.color,
                  }
                }
                // 保留网页链接。
                if (el.link) textEl.link = { type: 'web', target: el.link }
                // 保留文本内边距。
                if (el.textInset) textEl.inset = [el.textInset.t, el.textInset.r, el.textInset.b, el.textInset.l]
                // 使用段落解析得到的行高覆盖默认行高。
                if (metrics.lineHeight) textEl.lineHeight = metrics.lineHeight
                // 使用段落解析得到的段后距。
                if (metrics.margin) textEl.paragraphSpace = metrics.margin
                // 把文本元素加入当前幻灯片。
                slide.elements.push(textEl)
              }
            }
            // 图片元素：转换图片源、尺寸、旋转、翻转、边框和裁剪形状。
            else if (el.type === 'image') {
              // 构造 PPTist 图片元素基础数据。
              const element: PPTImageElement = {
                // PPTist 内部元素类型。
                type: 'image',
                // 新生成内部元素 ID。
                id: nanoid(10),
                // pptxtojson 已输出 base64 图片，可直接作为图片源。
                src: el.base64,
                // 使用缩放后的宽度。
                width: el.width,
                // 使用缩放后的高度。
                height: el.height,
                // 使用缩放后的左坐标。
                left: el.left,
                // 使用缩放后的上坐标。
                top: el.top,
                // 图片默认固定宽高比，避免用户后续缩放时失真。
                fixedRatio: true,
                // 保留 PPTX 旋转角。
                rotate: el.rotate,
                // 保留水平翻转。
                flipH: el.isFlipH,
                // 保留垂直翻转。
                flipV: el.isFlipV,
              }
              // 仅当 PPTX 图片存在边框宽度时写入边框，避免为无边框图片生成多余 outline。
              if (el.borderWidth) {
                element.outline = {
                  // 图片边框颜色。
                  color: el.borderColor,
                  // 图片边框宽度按导入比例缩放。
                  width: +(el.borderWidth * ratio).toFixed(2),
                  // 图片边框线型。
                  style: el.borderType,
                }
              }
              // PPTist 当前可作为图片裁剪蒙版的形状白名单。
              const clipShapeTypes = [
                'rect',
                'snip1Rect',
                'snip2DiagRect',
                'roundRect',
                'ellipse',
                'triangle',
                'rtTriangle',
                'diamond',
                'pentagon',
                'hexagon',
                'heptagon',
                'octagon',
                'chevron',
                'homePlate',
                'rightArrow',
                'parallelogram',
                'trapezoid'
              ]
              // 默认图片裁剪形状为矩形，保证未知形状也可以正常展示。
              let geom = el.geom || 'rect'
              // pptxtojson 对自定义形状可能带 custom: 前缀，这里去掉前缀以匹配 PPTist 的裁剪形状名。
              if (geom.indexOf('custom:') !== -1) geom = geom.replace('custom:', '')
              // 超出白名单的裁剪形状降级为矩形，避免渲染端拿到不支持的 shape。
              if (!clipShapeTypes.includes(geom)) geom = 'rect'

              // PPTX 图片存在裁剪矩形时，转换为 PPTist 百分比裁剪范围。
              if (el.rect) {
                element.clip = {
                  // 裁剪蒙版形状。
                  shape: geom,
                  // 裁剪范围使用百分比坐标，左上和右下分别描述可见区域。
                  range: [
                    [
                      // 左侧裁剪百分比，缺失时从 0 开始。
                      el.rect.l || 0,
                      // 顶部裁剪百分比，缺失时从 0 开始。
                      el.rect.t || 0,
                    ],
                    [
                      // 右侧通过 100 - r 转为右下角 x。
                      100 - (el.rect.r || 0),
                      // 底部通过 100 - b 转为右下角 y。
                      100 - (el.rect.b || 0),
                    ],
                  ]
                }
              }
              // 没有裁剪矩形但存在几何形状时，使用完整范围套用形状蒙版。
              else if (el.geom) {
                element.clip = {
                  // 裁剪蒙版形状。
                  shape: geom,
                  // 完整图片范围。
                  range: [[0, 0], [100, 100]]
                }
              }

              // 保留图片上的网页链接。
              if (el.link) element.link = { type: 'web', target: el.link }
              // 把图片加入当前幻灯片。
              slide.elements.push(element)
            }
            // 公式元素：PPTX 公式在解析后以图片承载，这里转换为普通图片元素。
            else if (el.type === 'math') {
              slide.elements.push({
                // PPTist 使用 image 类型展示公式图片。
                type: 'image',
                // 新生成内部元素 ID。
                id: nanoid(10),
                // 公式渲染后的 base64 图片。
                src: el.picBase64,
                // 使用缩放后的宽度。
                width: el.width,
                // 使用缩放后的高度。
                height: el.height,
                // 使用缩放后的左坐标。
                left: el.left,
                // 使用缩放后的上坐标。
                top: el.top,
                // 公式图片默认固定宽高比。
                fixedRatio: true,
                // 公式图片分支不继承旋转，沿用原有导入行为置 0。
                rotate: 0,
              })
            }
            // 音频元素：只有存在 blob 时才导入，避免生成不可播放的空音频。
            else if (el.type === 'audio' && el.blob) {
              slide.elements.push({
                // PPTist 内部音频元素类型。
                type: 'audio',
                // 新生成内部元素 ID。
                id: nanoid(10),
                // 本地 blob URL 或 Blob 数据，由解析器提供。
                src: el.blob,
                // 使用缩放后的宽度。
                width: el.width,
                // 使用缩放后的高度。
                height: el.height,
                // 使用缩放后的左坐标。
                left: el.left,
                // 使用缩放后的上坐标。
                top: el.top,
                // 音频控件不继承 PPTX 旋转，沿用项目当前行为。
                rotate: 0,
                // 音频控件允许自由缩放。
                fixedRatio: false,
                // 音频控件主题色使用当前主题主色。
                color: theme.value.themeColors[0],
                // 默认不循环播放，避免导入后自动改变播放体验。
                loop: false,
                // 默认不自动播放，符合浏览器播放策略和用户预期。
                autoplay: false,
              })
            }
            // 视频元素：只有存在 blob 时才导入，避免生成不可播放的视频占位。
            else if (el.type === 'video' && el.blob) {
              slide.elements.push({
                // PPTist 内部视频元素类型。
                type: 'video',
                // 新生成内部元素 ID。
                id: nanoid(10),
                // 本地 blob URL 或 Blob 数据，由解析器提供。
                src: el.blob,
                // 使用缩放后的宽度。
                width: el.width,
                // 使用缩放后的高度。
                height: el.height,
                // 使用缩放后的左坐标。
                left: el.left,
                // 使用缩放后的上坐标。
                top: el.top,
                // 视频分支沿用当前导入行为，不继承 PPTX 旋转。
                rotate: 0,
                // 默认不自动播放，避免导入后立即触发媒体播放。
                autoplay: false,
              })
            }
            // 形状元素：包含线条、连接符、普通几何形状、自定义路径和可编辑关键点形状。
            else if (el.type === 'shape') {
              // 线条和连接符需要转换为 PPTist 的 line 元素，而不是普通 shape。
              if (el.shapType === 'line' || /straightConnector/.test(el.shapType) || /bentConnector/.test(el.shapType) || /curvedConnector/.test(el.shapType)) {
                // 调用专用线条解析器，统一处理端点、箭头、线宽和旋转。
                const lineElement = parseLineElement(el, ratio)
                // 把转换后的线条加入当前幻灯片。
                slide.elements.push(lineElement)
              }
              // 普通形状分支：尽量匹配内置形状池，匹配不到时使用 PPTX 自带 SVG 路径。
              else {
                // 根据 PPTX shape 类型查找项目内置形状定义。
                const shape = shapeList.find(item => item.pptxShapeType === el.shapType)

                // 渐变填充：仅当 PPTX 填充类型为 gradient 时转换。
                const gradient: Gradient | undefined = el.fill?.type === 'gradient' ? {
                  // PPTX line 渐变映射为线性渐变，其余路径类型映射为径向渐变。
                  type: el.fill.value.path === 'line' ? 'linear' : 'radial',
                  // 转换渐变色标，并把位置从字符串转成数字。
                  colors: el.fill.value.colors.map(item => ({
                    // 保留色标的颜色等其他字段。
                    ...item,
                    // PPTist 渐变位置使用 number。
                    pos: parseInt(item.pos),
                  })),
                  // 保留 PPTX 渐变旋转角。
                  rotate: el.fill.value.rot,
                } : undefined

                // 图片填充：PPTist shape 使用 pattern 存放图片 base64。
                const pattern: string | undefined = el.fill?.type === 'image' ? el.fill.value.base64 : undefined

                // 纯色填充：非纯色填充时 fill 留空，由 gradient/pattern 分别承载。
                const fill = el.fill?.type === 'color' ? el.fill.value : ''

                // 读取形状内嵌文本的段落行高和段距。
                const metrics = getParagraphMetrics(el.content, ratio)
                
                // 构造 PPTist 形状元素基础结构。
                const element: PPTShapeElement = {
                  // PPTist 内部元素类型。
                  type: 'shape',
                  // 新生成内部元素 ID。
                  id: nanoid(10),
                  // 使用缩放后的宽度。
                  width: el.width,
                  // 使用缩放后的高度。
                  height: el.height,
                  // 使用缩放后的左坐标。
                  left: el.left,
                  // 使用缩放后的上坐标。
                  top: el.top,
                  // 默认 viewBox 使用 200x200，后续若匹配到具体形状会覆盖。
                  viewBox: [200, 200],
                  // 默认路径为矩形，作为无法匹配形状时的安全兜底。
                  path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
                  // 纯色填充。
                  fill,
                  // 渐变填充。
                  gradient,
                  // 图片填充。
                  pattern,
                  // 普通形状允许自由缩放。
                  fixedRatio: false,
                  // 保留 PPTX 旋转角。
                  rotate: el.rotate,
                  // 转换形状边框。
                  outline: {
                    // 边框颜色。
                    color: el.borderColor,
                    // 边框宽度随导入比例缩放。
                    width: +(el.borderWidth * ratio).toFixed(2),
                    // 边框线型。
                    style: el.borderType,
                  },
                  // 形状内嵌文本配置。
                  text: {
                    // 转换形状内的富文本内容。
                    content: convertTextContent(el.content, ratio),
                    // 缺省字体使用当前主题字体。
                    defaultFontName: theme.value.fontName,
                    // 缺省颜色使用当前主题字体颜色。
                    defaultColor: theme.value.fontColor,
                    // 形状文本垂直对齐兜底为居中。
                    align: vAlignMap[el.vAlign] || 'middle',
                  },
                  // 保留水平翻转。
                  flipH: el.isFlipH,
                  // 保留垂直翻转。
                  flipV: el.isFlipV,
                }
                // 保留形状链接。
                if (el.link) element.link = { type: 'web', target: el.link }
                // 保留形状文本内边距。
                if (el.textInset) element.text!.inset = [el.textInset.t, el.textInset.r, el.textInset.b, el.textInset.l]
                // 写入段落行高。
                if (metrics.lineHeight) element.text!.lineHeight = metrics.lineHeight
                // 写入段落间距。
                if (metrics.margin) element.text!.paragraphSpace = metrics.margin

                // 保留形状阴影。
                if (el.shadow) {
                  element.shadow = {
                    // 水平阴影偏移。
                    h: el.shadow.h * ratio,
                    // 垂直阴影偏移。
                    v: el.shadow.v * ratio,
                    // 阴影模糊半径。
                    blur: el.shadow.blur * ratio,
                    // 阴影颜色。
                    color: el.shadow.color,
                  }
                }
    
                // 如果在内置形状池中找到对应形状，则优先使用项目内置路径。
                if (shape) {
                  // 使用内置 SVG path。
                  element.path = shape.path
                  // 使用内置 viewBox。
                  element.viewBox = shape.viewBox
    
                  // 带 pathFormula 的形状需要按当前元素宽高实时生成路径。
                  if (shape.pathFormula) {
                    // 记录公式名，便于编辑端后续重新计算形状。
                    element.pathFormula = shape.pathFormula
                    // 公式形状的 viewBox 使用真实宽高坐标系。
                    element.viewBox = [el.width, el.height]
    
                    // 读取具体公式定义。
                    const pathFormula = SHAPE_PATH_FORMULAS[shape.pathFormula]
                    // 可编辑公式需要把 PPTX adj 参数转换为 PPTist keypoints。
                    if ('editable' in pathFormula && pathFormula.editable) {
                      // 默认关键点使用公式定义的默认值。
                      let keypointValues = pathFormula.defaultValue
                      // 如果 PPTX 提供了关键点参数，则尝试按形状类型换算。
                      if (el.keypoints) {
                        // 单关键点形状的目标关键点值。
                        let keypoint = 0
                        // 圆角矩形：PPTX adj 描述圆角大小，这里折半映射到 PPTist 关键点。
                        if (el.shapType === 'roundRect') {
                          // 缺省值与 PPTX 默认圆角接近。
                          const val = el.keypoints.adj === undefined ? 0.334 : el.keypoints.adj
                          // PPTist 关键点范围采用半比例。
                          keypoint = val * 0.5
                        }
                        // 单切角矩形：使用 adj 控制切角尺寸。
                        if (el.shapType === 'snip1Rect') {
                          // 缺省切角比例。
                          const val = el.keypoints.adj === undefined ? 0.334 : el.keypoints.adj
                          // 转换为 PPTist 半比例关键点。
                          keypoint = val * 0.5
                        }
                        // 同侧双切角矩形：使用 adj1 控制切角。
                        if (el.shapType === 'snip2SameRect') {
                          // 缺省切角比例。
                          const val = el.keypoints.adj1 === undefined ? 0.334 : el.keypoints.adj1
                          // 转换为半比例关键点。
                          keypoint = val * 0.5
                        }
                        // 对角双切角矩形：使用 adj2 控制切角。
                        if (el.shapType === 'snip2DiagRect') {
                          // 缺省切角比例。
                          const val = el.keypoints.adj2 === undefined ? 0.334 : el.keypoints.adj2
                          // 转换为半比例关键点。
                          keypoint = val * 0.5
                        }
                        // 切角圆角混合矩形：取两个 adj 的平均值近似保留外观。
                        if (el.shapType === 'snipRoundRect') {
                          // 切角参数。
                          const val1 = el.keypoints.adj1 === undefined ? 0.334 : el.keypoints.adj1
                          // 圆角参数。
                          const val2 = el.keypoints.adj2 === undefined ? 0.334 : el.keypoints.adj2
                          // 取平均后转为半比例关键点。
                          keypoint = ((val1 + val2) / 2) * 0.5
                        }
                        // 单圆角矩形：使用 adj 控制圆角。
                        if (el.shapType === 'round1Rect') {
                          // 缺省圆角比例。
                          const val = el.keypoints.adj === undefined ? 0.334 : el.keypoints.adj
                          // 转换为半比例关键点。
                          keypoint = val * 0.5
                        }
                        // 同侧双圆角矩形：使用 adj1 控制圆角。
                        if (el.shapType === 'round2SameRect') {
                          // 缺省圆角比例。
                          const val = el.keypoints.adj1 === undefined ? 0.334 : el.keypoints.adj1
                          // 转换为半比例关键点。
                          keypoint = val * 0.5
                        }
                        // 对角双圆角矩形：使用 adj1 控制圆角。
                        if (el.shapType === 'round2DiagRect') {
                          // 缺省圆角比例。
                          const val = el.keypoints.adj1 === undefined ? 0.334 : el.keypoints.adj1
                          // 转换为半比例关键点。
                          keypoint = val * 0.5
                        }
                        // 三角形：使用 adj 控制顶点水平位置。
                        if (el.shapType === 'triangle') {
                          // PowerPoint 默认顶点居中偏右侧表达为 1。
                          const val = el.keypoints.adj === undefined ? 1 : el.keypoints.adj
                          // 转换到 PPTist 关键点区间。
                          keypoint = val * 0.5
                        }
                        // 梯形：使用 adj 控制上边宽度。
                        if (el.shapType === 'trapezoid') {
                          // 缺省梯形关键点。
                          const val = el.keypoints.adj === undefined ? 0.5 : el.keypoints.adj
                          // 转换为半比例关键点。
                          keypoint = val * 0.5
                        }
                        // 框形：使用 adj1 控制框体厚度。
                        if (el.shapType === 'frame') {
                          // 缺省框体厚度。
                          const val = el.keypoints.adj1 === undefined ? 0.25 : el.keypoints.adj1
                          // 转换为半比例关键点。
                          keypoint = val * 0.5
                        }
                        // 折角：取两个 adj 的平均值近似表达角部尺寸。
                        if (el.shapType === 'corner') {
                          // 第一个角部参数。
                          const val1 = el.keypoints.adj1 === undefined ? 1 : el.keypoints.adj1
                          // 第二个角部参数。
                          const val2 = el.keypoints.adj2 === undefined ? 1 : el.keypoints.adj2
                          // 平均后转换为半比例关键点。
                          keypoint = ((val1 + val2) / 2) * 0.5
                        }
                        // 斜条形：使用 adj 控制斜条宽度。
                        if (el.shapType === 'diagStripe') {
                          // 缺省斜条参数。
                          const val = el.keypoints.adj === undefined ? 1 : el.keypoints.adj
                          // 转换为半比例关键点。
                          keypoint = val * 0.5
                        }
                        // 圆环：使用 adj 控制内圆半径。
                        if (el.shapType === 'donut') {
                          // 缺省内圆比例。
                          const val = el.keypoints.adj === undefined ? 0.5 : el.keypoints.adj
                          // 转换为半比例关键点。
                          keypoint = val * 0.5
                        }
                        // 加号：PPTX adj 与 PPTist 关键点方向相反，这里做反向映射。
                        if (el.shapType === 'plus') {
                          // 缺省加号臂宽。
                          const val = el.keypoints.adj === undefined ? 0.5 : el.keypoints.adj
                          // 反向映射以保持视觉宽度接近原文件。
                          keypoint = 1 - val
                        }
                        // 若公式定义了最小值，则夹紧到最小值，避免生成非法路径。
                        if (pathFormula.range && keypoint < pathFormula.range[0][0]) keypoint = pathFormula.range[0][0]
                        // 若公式定义了最大值，则夹紧到最大值，避免生成超出形状边界的路径。
                        if (pathFormula.range && keypoint > pathFormula.range[0][1]) keypoint = pathFormula.range[0][1]
                        // PPTist keypoints 使用数组结构存储。
                        keypointValues = [keypoint]
                      }
                      // 用当前宽高和关键点重新生成最终 path。
                      element.path = pathFormula.formula(el.width, el.height, keypointValues)
                      // 写回关键点，供编辑器后续交互调整。
                      element.keypoints = keypointValues
                    }
                    // 不可编辑公式只需要按当前宽高生成路径。
                    else element.path = pathFormula.formula(el.width, el.height)
                  }
                }
                // 未匹配到内置形状但 PPTX 自带有效 SVG path 时，直接使用原路径。
                else if (el.path && el.path.indexOf('NaN') === -1) {
                  // 计算 SVG path 的最大坐标范围，供 viewBox 推导使用。
                  const { maxX, maxY } = getSvgPathRange(el.path)
                  // 保留 PPTX 原始路径。
                  element.path = el.path
                  // 路径横向更宽时，以 maxX 为基准补齐 viewBox 高度。
                  if ((maxX / maxY) > (originWidth / originHeight)) {
                    element.viewBox = [maxX, maxX * originHeight / originWidth]
                  }
                  // 路径纵向更高时，以 maxY 为基准补齐 viewBox 宽度。
                  else {
                    element.viewBox = [maxY * originWidth / originHeight, maxY]
                  }
                }
                // 自定义形状需要额外处理 NaN path 和 viewBox 计算。
                if (el.shapType === 'custom') {
                  // PPTX 转换自定义路径时偶尔会出现 NaN，导入时用 0 兜底避免 SVG 无法渲染。
                  if (el.path!.indexOf('NaN') !== -1) {
                    // 宽度为 0 会导致编辑器无法选中或渲染，使用极小值兜底。
                    if (element.width === 0) element.width = 0.1
                    // 高度为 0 会导致编辑器无法选中或渲染，使用极小值兜底。
                    if (element.height === 0) element.height = 0.1
                    // 将非法数值替换为 0，尽量保留路径结构。
                    element.path = el.path!.replace(/NaN/g, '0')
                  }
                  // 自定义路径无 NaN 时直接保留。
                  else {
                    element.path = el.path!
                  }
                  // 重新计算自定义路径坐标范围。
                  const { maxX, maxY } = getSvgPathRange(element.path)
                  // 横向更宽时按原始元素比例补齐 viewBox 高度。
                  if ((maxX / maxY) > (originWidth / originHeight)) {
                    element.viewBox = [maxX, maxX * originHeight / originWidth]
                  }
                  // 纵向更高时按原始元素比例补齐 viewBox 宽度。
                  else {
                    element.viewBox = [maxY * originWidth / originHeight, maxY]
                  }
                }
    
                // 仅当 path 和 viewBox 都有效时加入幻灯片，避免渲染层收到无法绘制的形状。
                if (element.path && element.viewBox[0] && element.viewBox[1]) slide.elements.push(element)
              }
            }
            // 表格元素：将 PPTX 表格二维数据转换为 PPTist 表格数据和列宽比例。
            else if (el.type === 'table') {
              // 表格行数。
              const row = el.data.length
              // 表格列数；默认取第一行长度，要求上游表格数据为规整二维数组。
              const col = el.data[0].length
  
              // 单元格默认样式，缺省字体和颜色来自当前主题。
              const style: TableCellStyle = {
                // 默认字体名。
                fontname: theme.value.fontName,
                // 默认文字颜色。
                color: theme.value.fontColor,
              }
              // PPTist 表格单元格二维数组。
              const data: TableCell[][] = []
              // 遍历每一行。
              for (let i = 0; i < row; i++) {
                // 当前行转换后的单元格列表。
                const rowCells: TableCell[] = []
                // 遍历当前行的每一列。
                for (let j = 0; j < col; j++) {
                  // 读取 PPTX 单元格原始数据。
                  const cellData = el.data[i][j]

                  // 创建临时 DOM 用于解析 pptxtojson 输出的 HTML 文本样式。
                  let textDiv: HTMLDivElement | null = document.createElement('div')
                  // 写入 HTML 内容，使后续可以通过 querySelector 读取段落和 span 样式。
                  textDiv.innerHTML = cellData.text
                  // 读取首个段落节点，主要用于提取水平对齐。
                  const p = textDiv.querySelector('p')
                  // 提取文本对齐；缺失时按左对齐兜底。
                  const align = p?.style.textAlign || 'left'

                  // 读取首个 span，主要用于提取字号、字体和颜色。
                  const span = textDiv.querySelector('span')
                  // 字号需要从 PPTX 像素值按导入比例缩放，缺失时保持空字符串。
                  const fontsize = span?.style.fontSize ? (parseInt(span?.style.fontSize) * ratio).toFixed(1) + 'px' : ''
                  // 字体名优先使用 span 样式，缺失时交给默认样式兜底。
                  const fontname = span?.style.fontFamily || ''
                  // 字体颜色优先使用 span 样式，其次使用单元格原始字体颜色。
                  const color = span?.style.color || cellData.fontColor

                  // 追加转换后的 PPTist 单元格。
                  rowCells.push({
                    // 单元格 ID。
                    id: nanoid(10),
                    // 横向合并列数，缺失时为 1。
                    colspan: cellData.colSpan || 1,
                    // 纵向合并行数，缺失时为 1。
                    rowspan: cellData.rowSpan || 1,
                    // 使用 DOM innerText 提取纯文本，避免保留 HTML 标签。
                    text: textDiv.innerText,
                    // 单元格样式。
                    style: {
                      // 先继承默认样式。
                      ...style,
                      // 垂直对齐映射，无法识别时居中兜底。
                      vAlign: vAlignMap[cellData.vAlign] || 'middle',
                      // 水平对齐只接受 PPTist 支持的 left/right/center，其他值降级左对齐。
                      align: ['left', 'right', 'center'].includes(align) ? (align as 'left' | 'right' | 'center') : 'left',
                      // 单元格字号。
                      fontsize,
                      // 单元格字体。
                      fontname,
                      // 单元格文字颜色。
                      color,
                      // 加粗状态。
                      bold: cellData.fontBold,
                      // 单元格背景色。
                      backcolor: cellData.fillColor,
                    },
                  })
                  // 手动断开临时 DOM 引用，降低大量表格导入时的内存滞留风险。
                  textDiv = null
                }
                // 追加当前行。
                data.push(rowCells)
              }
  
              // 计算所有列宽总和，用于转换成相对比例。
              const allWidth = el.colWidths.reduce((a, b) => a + b, 0)
              // PPTist 表格列宽使用比例数组。
              const colWidths: number[] = el.colWidths.map(item => item / allWidth)

              // 读取第一个单元格，用于推断整张表默认边框。
              const firstCell = el.data[0][0]
              // 按单元格边框优先、表格边框兜底的顺序挑选一个可用边框。
              const border = firstCell.borders.top ||
                firstCell.borders.bottom ||
                el.borders.top ||
                el.borders.bottom ||
                firstCell.borders.left ||
                firstCell.borders.right ||
                el.borders.left ||
                el.borders.right
              // 边框宽度缺失时先记为 0，后续写入元素时有默认兜底。
              const borderWidth = border?.borderWidth || 0
              // 边框线型缺失时按 solid 处理。
              const borderStyle = border?.borderType || 'solid'
              // 边框颜色缺失时使用 Office 常见浅色边框兜底。
              const borderColor = border?.borderColor || '#eeece1'
  
              // 追加 PPTist 表格元素。
              slide.elements.push({
                // PPTist 内部表格元素类型。
                type: 'table',
                // 新生成内部元素 ID。
                id: nanoid(10),
                // 使用缩放后的宽度。
                width: el.width,
                // 使用缩放后的高度。
                height: el.height,
                // 使用缩放后的左坐标。
                left: el.left,
                // 使用缩放后的上坐标。
                top: el.top,
                // 列宽比例。
                colWidths,
                // 表格导入暂不继承旋转，沿用当前项目行为。
                rotate: 0,
                // 转换后的单元格数据。
                data,
                // 表格外框样式。
                outline: {
                  // 边框宽度按比例缩放；若原值为 0，则使用 2 作为可见默认值。
                  width: +(borderWidth * ratio || 2).toFixed(2),
                  // 边框线型。
                  style: borderStyle,
                  // 边框颜色。
                  color: borderColor,
                },
                // 单元格最小高度优先取首行高度并缩放，缺失时使用 36。
                cellMinHeight: el.rowHeights[0] ? el.rowHeights[0] * ratio : 36,
              })
            }
            // 图表元素：将 PPTX 图表数据结构转换为 PPTist 支持的 chartType、labels、legends 和 series。
            else if (el.type === 'chart') {
              // 图表横轴标签。
              let labels: string[]
              // 图例名称。
              let legends: string[]
              // 图表系列数据。
              let series: number[][]
  
              // 散点图和气泡图的数据结构与普通分类图不同，原始二维数组即为坐标系列。
              if (el.chartType === 'scatterChart' || el.chartType === 'bubbleChart') {
                // 为每个坐标点生成展示标签。
                labels = el.data[0].map((item, index) => `坐标${index + 1}`)
                // 坐标图固定使用 X/Y 作为图例。
                legends = ['X', 'Y']
                // 直接沿用坐标数据。
                series = el.data
              }
              // 普通分类图：从 ChartItem 中拆出 xlabels、key 和 y 值。
              else {
                // 断言为普通图表数据结构。
                const data = el.data as ChartItem[]
                // 使用首个系列的 xlabels 作为横轴标签。
                labels = Object.values(data[0].xlabels)
                // 每个系列的 key 作为图例。
                legends = data.map(item => item.key)
                // 每个系列的 values.y 作为数值序列。
                series = data.map(item => item.values.map(v => v.y))
              }

              // PPTist 图表配置；例如堆叠图会在下面写入 stack。
              const options: ChartOptions = {}
  
              // 默认按柱状图导入，无法识别的类型也能有基本展示。
              let chartType: ChartType = 'bar'

              // 根据 PPTX 图表类型映射为 PPTist 图表类型。
              switch (el.chartType) {
                // PowerPoint barChart/bar3DChart 根据 barDir 区分横向条形和纵向柱状。
                case 'barChart':
                case 'bar3DChart':
                  // 默认映射为横向条形图。
                  chartType = 'bar'
                  // barDir 为 bar 时在当前项目中映射为 column，保持既有逻辑。
                  if (el.barDir === 'bar') chartType = 'column'
                  // stacked/percentStacked 都启用堆叠显示。
                  if (el.grouping === 'stacked' || el.grouping === 'percentStacked') options.stack = true
                  break
                // 折线图。
                case 'lineChart':
                case 'line3DChart':
                  // 折线图保留堆叠配置。
                  if (el.grouping === 'stacked' || el.grouping === 'percentStacked') options.stack = true
                  // 映射为 PPTist 折线图。
                  chartType = 'line'
                  break
                // 面积图。
                case 'areaChart':
                case 'area3DChart':
                  // 面积图保留堆叠配置。
                  if (el.grouping === 'stacked' || el.grouping === 'percentStacked') options.stack = true
                  // 映射为 PPTist 面积图。
                  chartType = 'area'
                  break
                // 散点图和气泡图统一映射为 scatter。
                case 'scatterChart':
                case 'bubbleChart':
                  chartType = 'scatter'
                  break
                // 饼图。
                case 'pieChart':
                case 'pie3DChart':
                  chartType = 'pie'
                  break
                // 雷达图。
                case 'radarChart':
                  chartType = 'radar'
                  break
                // 圆环图。
                case 'doughnutChart':
                  chartType = 'ring'
                  break
                // 未覆盖类型保持默认 bar，避免导入失败。
                default:
              }
  
              // 追加 PPTist 图表元素。
              slide.elements.push({
                // PPTist 内部图表元素类型。
                type: 'chart',
                // 新生成内部元素 ID。
                id: nanoid(10),
                // 映射后的图表类型。
                chartType: chartType,
                // 使用缩放后的宽度。
                width: el.width,
                // 使用缩放后的高度。
                height: el.height,
                // 使用缩放后的左坐标。
                left: el.left,
                // 使用缩放后的上坐标。
                top: el.top,
                // 图表导入暂不继承旋转。
                rotate: 0,
                // 优先使用 PPTX 图表色板，缺失时使用当前主题色。
                themeColors: el.colors.length ? el.colors : theme.value.themeColors,
                // 图表文本颜色使用当前主题字体颜色。
                textColor: theme.value.fontColor,
                // 图表数据。
                data: {
                  // 横轴或分类标签。
                  labels,
                  // 图例。
                  legends,
                  // 系列值。
                  series,
                },
                // 图表配置。
                options,
              })
            }
            // 组合元素：先把子元素坐标转换到页面坐标系，再递归走普通元素转换。
            else if (el.type === 'group') {
              // 将组合内子元素展开为带绝对坐标的元素列表。
              let elements: BaseElement[] = el.elements.map(_el => {
                // 子元素左坐标先加上组合原始左坐标。
                let left = _el.left + originLeft
                // 子元素上坐标先加上组合原始上坐标。
                let top = _el.top + originTop

                // 子元素默认旋转角为 0。
                let rotate = 0
                // 若子元素自身带 rotate 字段，则读取其旋转角。
                if ('rotate' in _el) rotate = _el.rotate

                // 组合本身存在旋转时，需要重新计算子元素在页面上的外接位置和全局旋转。
                if (el.rotate) {
                  // 计算旋转后子元素位置。
                  const { x, y, globalRotation } = calculateRotatedPosition(
                    // 组合原始左坐标。
                    originLeft,
                    // 组合原始上坐标。
                    originTop,
                    // 组合原始宽度。
                    originWidth,
                    // 组合原始高度。
                    originHeight,
                    // 子元素在组合内的左坐标。
                    _el.left,
                    // 子元素在组合内的上坐标。
                    _el.top,
                    // 子元素原始宽度。
                    _el.width,
                    // 子元素原始高度。
                    _el.height,
                    // 组合旋转角。
                    el.rotate,
                    // 子元素自身旋转角。
                    rotate
                  )
                  // 使用旋转计算后的绝对左坐标。
                  left = x
                  // 使用旋转计算后的绝对上坐标。
                  top = y
                  // 使用组合旋转和子元素旋转叠加后的全局旋转角。
                  rotate = globalRotation
                }

                // 基于原始子元素复制，并覆盖绝对坐标。
                const element = {
                  // 保留子元素原始属性。
                  ..._el,
                  // 写入绝对左坐标。
                  left,
                  // 写入绝对上坐标。
                  top,
                }
                // 组合水平翻转时，把支持水平翻转的子元素标记为水平翻转。
                if (el.isFlipH && 'isFlipH' in element) element.isFlipH = true
                // 组合垂直翻转时，把支持垂直翻转的子元素标记为垂直翻转。
                if (el.isFlipV && 'isFlipV' in element) element.isFlipV = true
                // 组合旋转时，把支持 rotate 的子元素写入全局旋转角。
                if ('rotate' in element && el.rotate) element.rotate = rotate

                // 返回转换后的子元素，后续递归解析。
                return element
              })
              // 组合水平翻转需要按组合坐标系沿 y 轴镜像子元素。
              if (el.isFlipH) elements = flipGroupElements(elements, 'y')
              // 组合垂直翻转需要按组合坐标系沿 x 轴镜像子元素。
              if (el.isFlipV) elements = flipGroupElements(elements, 'x')
              // 递归解析展开后的组合子元素。
              parseElements(elements)
            }
            // 图示元素：结构类似组合，但当前只做坐标平移后递归解析。
            else if (el.type === 'diagram') {
              // 将图示子元素坐标从局部坐标转换到页面坐标。
              const elements = el.elements.map(_el => ({
                // 保留图示子元素原始属性。
                ..._el,
                // 左坐标加上图示容器左坐标。
                left: _el.left + originLeft,
                // 上坐标加上图示容器上坐标。
                top: _el.top + originTop,
              }))
              // 递归解析图示子元素。
              parseElements(elements)
            }
          }
        }
        // 页面元素和版式元素合并后解析，保证母版/版式元素也出现在导入结果中。
        parseElements([...item.elements, ...item.layoutElements])
        // 当前页面转换完成后加入结果列表。
        slides.push(slide)
      }

      // cover 模式：用导入结果完全替换当前演示文稿。
      if (cover) {
        // 替换前切回第一页，避免旧索引超出新页面数量。
        slidesStore.updateSlideIndex(0)
        // 写入导入后的幻灯片列表。
        slidesStore.setSlides(slides)
        // 如果 PPTX 页面比例与当前画布比例不同，则同步画布比例。
        if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
        // 记录历史快照，支持撤销导入覆盖。
        addHistorySnapshot()
      }
      // 当前文稿为空白页时，直接替换为空白页内容，体验上等同新建后导入。
      else if (isEmptySlide.value) {
        // 写入导入后的幻灯片列表。
        slidesStore.setSlides(slides)
        // 根据 PPTX 页面比例调整画布。
        if (aspectRatio !== viewportRatio.value) slidesStore.setViewportRatio(aspectRatio)
        // 记录历史快照。
        addHistorySnapshot()
      }
      // 非覆盖且当前文稿已有内容时，把导入页面追加到现有文稿。
      else addSlidesFromData(slides)

      // 导入流程完成，关闭导入中状态。
      exporting.value = false
      // 通知调用方导入完成，普通 UI 调用不传该回调时不会改变现有行为。
      onComplete?.()
    }
    // 以 ArrayBuffer 读取 PPTX 文件，读取完成后触发 reader.onload。
    reader.readAsArrayBuffer(file)
  }

  return {
    importSpecificFile,
    importJSON,
    importPPTXFile,
    exporting,
  }
}
