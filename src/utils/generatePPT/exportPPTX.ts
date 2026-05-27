import { computed, ref } from 'vue'
import { saveAs } from 'file-saver'
import pptxgen from 'pptxgenjs'
import tinycolor from 'tinycolor2'
import { toPng, toJpeg } from 'html-to-image'
import type { PPTElementOutline, PPTElementShadow, PPTElementLink, Slide, SlideTheme } from './slides'
import { getElementRange, getLineElementPath, getTableSubThemeColor } from './element'
import { type AST, toAST } from './htmlParser'
import { type SvgPoints, toPoints } from './svgPathParser'
import { encrypt } from './crypto'

interface ExportImageConfig {
  /** 导出图片质量；对 JPEG 更敏感，对 PNG 主要用于兼容 html-to-image 配置。 */
  quality: number
  /** 导出图片目标宽度，越大导出越清晰但内存占用也越高。 */
  width: number
  /** WebFont 内联 CSS；传空字符串可跳过字体嵌入以规避跨域或字体解析问题。 */
  fontEmbedCSS?: string
}

/**
 * generatePPT 本地导出上下文。
 *
 * 设计说明：
 * - 这是从原 `useExport()` 依赖 Pinia store 的导出逻辑中抽出来的最小运行上下文。
 * - generatePPT 目录内生成的是临时 slides，不应该读取当前编辑器 store，避免测试页或 iframe 生成时污染现有文稿。
 */
export interface GeneratePPTExportContext {
  /** 文稿标题，用于 JSON/PPTist 下载兜底；PPTX 可通过 options.fileName 单独指定。 */
  title: string
  /** 导出主题，主要用于母版背景覆盖和 JSON/PPTist 结构兼容。 */
  theme: SlideTheme
  /** 画布比例，高度 / 宽度；PPTist 默认 16:9 是 0.5625。 */
  viewportRatio: number
  /** 画布宽度，PPTist 模板常见值是 1000。 */
  viewportSize: number
}

/**
 * 创建一个最小响应式引用。
 *
 * @param value - 初始值。
 * @returns 带 value 字段的对象。
 */
const createLocalRef = <T>(value: T) => {
  /**
   * 返回对象刻意只实现 value 字段。
   *
   * 说明：
   * - 原导出代码大量使用 `theme.value` / `viewportSize.value`。
   * - 这里用同形对象承接原代码，最大限度减少复制代码的结构性改动。
   */
  return { value }
}

/**
 * 提供当前演示文稿的图片、JSON、PPTist 和 PPTX 导出能力。
 *
 * @returns 导出状态和多个导出函数；调用方可根据菜单动作触发对应导出流程。
 * @throws 本组合式函数本身不主动抛错；具体导出失败会在 Promise catch 中恢复状态并提示用户。
 * @remarks
 * - 所有 PPTX 坐标都需要从编辑器像素坐标转换为英寸或磅，转换比例依赖当前画布宽度。
 * - 导出函数会复用当前 Pinia store 中的标题、主题、页面比例和页面数据。
 * - 大部分导出逻辑是浏览器端完成的，图片和 PPTX 导出可能受到跨域图片、字体和媒体资源限制。
 */
export default (context: GeneratePPTExportContext) => {
  /**
   * slides 是本地导出上下文中的页面引用。
   *
   * 说明：
   * - 原 useExport 会从 Pinia store 读取当前文稿 slides。
   * - generatePPT 的 PPTX 导出会通过 exportPPTX(_slides) 显式传入页面，因此这里保留空数组只服务其他复制来的导出函数兜底。
   */
  const slides = createLocalRef<Slide[]>([])

  /**
   * theme 是本地主题引用。
   *
   * 说明：
   * - 来自模板 JSON 的 theme 或默认 theme。
   * - 不读取外部 store，保证 generatePPT 文件夹可独立迁移。
   */
  const theme = createLocalRef(context.theme)

  /**
   * viewportRatio 是本地画布比例引用。
   *
   * 边界说明：
   * - public/mocks/template_x.json 中存在 width / height。
   * - 调用方会把 height / width 传进来；缺失时使用 16:9。
   */
  const viewportRatio = createLocalRef(context.viewportRatio)

  /**
   * title 是本地标题引用。
   *
   * 用途说明：
   * - 主要保留给复制来的 JSON/PPTist/图片导出函数。
   * - PPTX 文件名优先使用 exportPPTX options.fileName。
   */
  const title = createLocalRef(context.title)

  /**
   * viewportSize 是本地画布宽度引用。
   *
   * 说明：
   * - 原导出逻辑按 `viewportSize / 960` 计算像素到英寸的比例。
   * - 使用模板 JSON 宽度能和模板元素坐标保持一致。
   */
  const viewportSize = createLocalRef(context.viewportSize)

  // pptxgenjs 文本默认字号，列表缩进缺失字号时使用该值兜底。
  const defaultFontSize = 16

  // 像素到英寸的换算基准；960px 宽画布对应 96px/in，画布缩放后按比例调整。
  const ratioPx2Inch = computed(() => {
    // 返回当前画布下 1 英寸对应的像素数量。
    return 96 * (viewportSize.value / 960)
  })
  // 像素到磅的换算基准；PPT 字号、线宽等通常以 pt 表示。
  const ratioPx2Pt = computed(() => {
    // 96px 等于 72pt，因此使用 96/72 并结合当前画布宽度缩放。
    return 96 / 72 * (viewportSize.value / 960)
  })

  // 导出中状态，用于界面显示 loading 或禁用重复操作。
  const exporting = ref(false)

  /**
   * 将单个页面 DOM 导出为图片文件。
   *
   * @param domRef - 当前需要截图导出的页面 DOM 根节点。
   * @param format - 图片格式，当前调用侧通常传入 png 或 jpeg。
   * @param quality - 导出质量，范围由 html-to-image 库解释。
   * @param ignoreWebfont - 是否跳过 WebFont 嵌入；默认跳过以减少字体跨域失败概率。
   * @returns 无显式返回值；导出成功后会触发浏览器下载。
   * @throws 函数内部通过 Promise catch 消化错误并提示“导出图片失败”。
   * @remarks
   * - 导出前会移除 foreignObject 内部节点的 xmlns 属性，规避部分浏览器序列化 SVG 时的命名空间问题。
   * - 使用 setTimeout 延迟 200ms，给 UI 状态、字体和 DOM 渲染一个短暂稳定窗口。
   */
  const exportImage = (domRef: HTMLElement, format: string, quality: number, ignoreWebfont = true) => {
    // 标记导出开始。
    exporting.value = true
    // 根据目标格式选择 html-to-image 的转换函数。
    const toImage = format === 'png' ? toPng : toJpeg

    // 找到 SVG foreignObject 内带 xmlns 的子节点。
    const foreignObjectSpans = domRef.querySelectorAll('foreignObject [xmlns]')
    // 移除命名空间属性，避免序列化后的图片在部分环境中出现渲染异常。
    foreignObjectSpans.forEach(spanRef => spanRef.removeAttribute('xmlns'))

    // 延迟执行截图，等待 DOM 状态稳定。
    setTimeout(() => {
      // 图片导出配置。
      const config: ExportImageConfig = {
        // 图片质量。
        quality,
        // 固定导出宽度为 1600，保证导出图片比编辑区预览更清晰。
        width: 1600,
      }

      // 跳过字体嵌入时传入空 CSS，减少跨域字体导致导出失败的风险。
      if (ignoreWebfont) config.fontEmbedCSS = ''

      // 将页面 DOM 转换为 dataURL。
      toImage(domRef, config).then(dataUrl => {
        // 成功后关闭导出状态。
        exporting.value = false
        // 保存图片文件，文件名使用当前文稿标题。
        saveAs(dataUrl, `${title.value}.${format}`)
      }).catch(() => {
        // 失败后也必须关闭导出状态，避免界面永久 loading。
        exporting.value = false
        // 提示用户导出失败。
        console.error('[generatePPT exportPPTX] 导出图片失败')
      })
    }, 200)
  }

  /**
   * 将多个页面 DOM 逐页截图，并打包为图片版 PPTX。
   *
   * @param domRefs - 需要导出的页面 DOM 节点列表，顺序即为 PPTX 页面顺序。
   * @returns 无显式返回值；导出成功后会触发 PPTX 文件下载。
   * @throws 函数内部通过 Promise catch 消化图片转换或写文件失败，并提示“导出失败”。
   * @remarks
   * - 图片版 PPTX 不保留可编辑元素，只把每页作为整页图片写入 PPTX。
   * - 该模式兼容性高，适合复杂元素无法完整还原为原生 PPTX 对象的场景。
   */
  const exportImagePPTX = (domRefs: NodeListOf<Element>) => {
    // 标记导出开始。
    exporting.value = true
    
    // 延迟执行截图，等待 DOM 和字体渲染稳定。
    setTimeout(() => {
      // 创建 pptxgenjs 实例。
      const pptx = new pptxgen()

      // 导出图片的统一配置。
      const config: ExportImageConfig = {
        // 最高质量。
        quality: 1,
        // 固定截图宽度。
        width: 1600,
      }

      // 收集每页截图任务，使用函数形式保存以便统一触发。
      const promiseArr = []
      // 遍历所有页面 DOM。
      for (const domRef of domRefs) {
        // 找到 foreignObject 内带命名空间的节点。
        const foreignObjectSpans = domRef.querySelectorAll('foreignObject [xmlns]')
        // 移除 xmlns，避免 SVG 序列化后渲染异常。
        foreignObjectSpans.forEach(spanRef => spanRef.removeAttribute('xmlns'))

        // 构造当前页面转 JPEG 的任务函数。
        const promiseFunc = () => toJpeg((domRef as HTMLElement), config)
        // 加入任务列表。
        promiseArr.push(promiseFunc)
      }

      // 并发执行所有页面截图任务。
      Promise.all(promiseArr.map(func => func())).then(imgs => {
        // 遍历每页截图结果。
        for (const data of imgs) {
          // 创建一页 PPTX 幻灯片。
          const pptxSlide = pptx.addSlide()
          // 将截图铺满当前 PPTX 页面。
          pptxSlide.addImage({
            // 图片 dataURL。
            data,
            // 左上角 x 坐标，单位英寸。
            x: 0,
            // 左上角 y 坐标，单位英寸。
            y: 0,
            // 页面宽度由编辑器像素宽度换算成英寸。
            w: viewportSize.value / ratioPx2Inch.value,
            // 页面高度由宽度和页面比例换算成英寸。
            h: viewportSize.value * viewportRatio.value / ratioPx2Inch.value,
          })
        }
        // 写出 PPTX 文件；完成后关闭导出状态。
        pptx.writeFile({ fileName: `${title.value}.pptx` }).then(() => exporting.value = false)
      }).catch(() => {
        // 截图或写文件失败时关闭导出状态。
        exporting.value = false
        // 提示用户导出失败。
        console.error('[generatePPT exportPPTX] 导出失败')
      })
    }, 200)
  }
  
  /**
   * 导出 PPTist 私有格式文件。
   *
   * @param _slides - 需要导出的幻灯片列表，允许调用方传入筛选后的页面。
   * @returns 无显式返回值；会触发 `.pptist` 文件下载。
   * @throws 当前函数不主动抛错；浏览器保存失败由 file-saver 处理。
   * @remarks
   * - `.pptist` 文件内容会先序列化为 JSON，再通过 encrypt 加密/混淆后保存。
   * - 该格式用于保留 PPTist 内部元素数据，和普通 PPTX 导出目标不同。
   */
  const exportSpecificFile = (_slides: Slide[]) => {
    // 组装 PPTist 私有文件数据。
    const json = {
      // 文稿标题。
      title: title.value,
      // 画布宽度。
      width: viewportSize.value,
      // 画布高度。
      height: viewportSize.value * viewportRatio.value,
      // 当前主题。
      theme: theme.value,
      // 传入的页面数据。
      slides: _slides,
    }
    // 将 JSON 字符串加密后写入 Blob。
    const blob = new Blob([encrypt(JSON.stringify(json))], { type: '' })
    // 保存为 .pptist 文件。
    saveAs(blob, `${title.value}.pptist`)
  }
  
  /**
   * 导出未加密的 JSON 文稿文件。
   *
   * @returns 无显式返回值；会触发 `.json` 文件下载。
   * @throws 当前函数不主动抛错；浏览器保存失败由 file-saver 处理。
   * @remarks
   * - JSON 导出直接暴露内部数据结构，适合调试、二次处理或数据迁移。
   * - 与 `.pptist` 不同，该导出不会调用 encrypt。
   */
  const exportJSON = () => {
    // 组装当前完整文稿数据。
    const json = {
      // 文稿标题。
      title: title.value,
      // 画布宽度。
      width: viewportSize.value,
      // 画布高度。
      height: viewportSize.value * viewportRatio.value,
      // 当前主题。
      theme: theme.value,
      // 当前全部幻灯片。
      slides: slides.value,
    }
    // 直接序列化为 JSON Blob。
    const blob = new Blob([JSON.stringify(json)], { type: '' })
    // 保存为 .json 文件。
    saveAs(blob, `${title.value}.json`)
  }

  /**
   * 将 CSS 颜色字符串转换为 pptxgenjs 更容易使用的颜色和透明度。
   *
   * @param _color - 任意 tinycolor 支持的颜色字符串，例如 hex、rgb、rgba。
   * @returns 包含 alpha 和不透明 hex 颜色的对象。
   * @throws 当前函数不主动抛错；非法颜色会按 tinycolor 的解析结果继续处理。
   * @remarks
   * - pptxgenjs 的颜色通常需要不带 alpha 的 hex，透明度则通过单独字段表达。
   * - alpha 为 0 时把颜色置为白色，避免透明颜色在某些 PPT 查看器中显示成黑色。
   */
  const formatColor = (_color: string) => {
    // 空颜色按完全透明黑色输入处理，并提供黑色兜底。
    if (!_color) {
      return {
        // 完全透明。
        alpha: 0,
        // 兜底颜色。
        color: '#000000',
      }
    }

    // 使用 tinycolor 统一解析 CSS 颜色。
    const c = tinycolor(_color)
    // 读取透明度。
    const alpha = c.getAlpha()
    // 透明色在 PPT 中使用白色兜底；非透明色则去掉 alpha，仅保留 hex。
    const color = alpha === 0 ? '#ffffff' : c.setAlpha(1).toHexString()
    // 返回透明度和 hex 颜色。
    return {
      alpha,
      color,
    }
  }

  type FormatColor = ReturnType<typeof formatColor>

  /**
   * 将 PPTist 富文本 HTML 转换为 pptxgenjs 的文本片段数组。
   *
   * @param html - PPTist 文本元素或形状文本中的 HTML 字符串。
   * @returns pptxgenjs `addText()` 可接收的富文本片段数组。
   * @throws 当前函数不主动抛错；HTML 解析依赖 `toAST`，异常输入按解析器行为处理。
   * @remarks
   * - 核心思路是把嵌套 HTML AST 扁平化为文本 slice，并让子节点继承祖先样式。
   * - 块级标签会通过前一个 slice 的 `breakLine` 表达换行。
   * - 列表、缩进、上下标、超链接和常见字体样式会映射到 pptxgenjs 的 TextPropsOptions。
   */
  const formatHTML = (html: string) => {
    // 将 HTML 字符串解析成轻量 AST。
    const ast = toAST(html)
    // 标记当前文本节点是否是列表项的首个文本片段。
    let bulletFlag = false
    // 暂存段落缩进等级，遇到文本片段后写入 options 并清零。
    let indent = 0

    // pptxgenjs 富文本片段数组。
    const slices: pptxgen.TextProps[] = []
    /**
     * 递归解析 AST 节点并生成 pptxgenjs 文本片段。
     *
     * @param obj - 当前层级 AST 节点数组。
     * @param baseStyleObj - 从祖先节点继承下来的 CSS 样式对象。
     * @returns 无显式返回值；解析结果会追加到外层 `slices`。
     * @throws 当前函数不主动抛错；异常样式值按现有解析逻辑跳过或直接写入。
     * @remarks
     * - 每深入一层都会复制父级样式，避免兄弟节点相互污染样式。
     * - 只有真正遇到文本节点时才创建 pptxgenjs 文本片段。
     */
    const parse = (obj: AST[], baseStyleObj: Record<string, string> = {}) => {

      // 遍历当前层级所有 AST 节点。
      for (const item of obj) {
        // 判断当前节点是否为会在 PPT 文本中产生换行语义的块级标签。
        const isBlockTag = 'tagName' in item && ['div', 'li', 'p'].includes(item.tagName)

        // 块级标签前如果已经存在文本片段，则让上一片段换行。
        if (isBlockTag && slices.length) {
          // 取最后一个片段。
          const lastSlice = slices[slices.length - 1]
          // 确保 options 存在，便于写入 breakLine。
          if (!lastSlice.options) lastSlice.options = {}
          // pptxgenjs 使用 breakLine 表达片段后的换行。
          lastSlice.options.breakLine = true
        }

        // 复制祖先样式，当前节点新增样式只影响自身和子节点。
        const styleObj = { ...baseStyleObj }
        // 读取 style 属性。
        const styleAttr = 'attributes' in item ? item.attributes.find(attr => attr.key === 'style') : null
        // 存在行内样式时解析 CSS 声明。
        if (styleAttr && styleAttr.value) {
          // 标记当前 style 中是否出现文字渐变。
          let hasGradient = false
          // 按分号拆分 CSS 声明。
          const styleArr = styleAttr.value.split(';')
          // 遍历每条 CSS 声明。
          for (const styleItem of styleArr) {
            // 提取 `key: value` 结构。
            const match = styleItem.match(/([^:]+):\s*(.+)/)
            // 仅处理格式合法的 CSS 声明。
            if (match) {
              // 清理属性名和值两侧空白。
              const [key, value] = [match[1].trim(), match[2].trim()]
              // 属性名和值都存在时才继续处理。
              if (key && value) {
                // 文字渐变在 PPTX 中无法直接映射为文本渐变，这里提取平均颜色近似。
                if (key === 'background' && value.includes('linear-gradient')) {
                  // 标记后续 background-clip/color: transparent 可跳过。
                  hasGradient = true
                  // 从渐变字符串中提取可解析颜色。
                  const colorMatches = value.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgba?\([^)]+\)/g)
                  // 只有成功提取颜色时才计算平均色。
                  if (colorMatches && colorMatches.length > 0) {
                    // 转为 tinycolor 对象，统一 rgb 读取。
                    const colors = colorMatches.map(c => tinycolor(c))
                    // 计算所有渐变色的平均 RGB，作为 PPT 文本颜色近似值。
                    const avgColor = colors.reduce((acc, c) => {
                      // 读取当前颜色 RGB。
                      const rgb = c.toRgb()
                      // 按颜色数量累加平均贡献。
                      return {
                        r: acc.r + rgb.r / colors.length,
                        g: acc.g + rgb.g / colors.length,
                        b: acc.b + rgb.b / colors.length,
                      }
                    }, { r: 0, g: 0, b: 0 })
                    // 将平均 RGB 写入 color 样式。
                    styleObj['color'] = tinycolor(avgColor).toHexString()
                  }
                }
                // 渐变文字通常会带 background-clip 和透明 color，这些中间样式不应覆盖平均色。
                else if (hasGradient && (key === 'background-clip' || key === '-webkit-background-clip' || (key === 'color' && value === 'transparent'))) {
                  continue
                }
                // 普通 CSS 声明直接写入当前样式对象。
                else styleObj[key] = value
              }
            }
          }
        }

        // 标签节点可通过标签语义补充样式。
        if ('tagName' in item) {
          // em 映射为斜体。
          if (item.tagName === 'em') {
            styleObj['font-style'] = 'italic'
          }
          // strong 映射为加粗。
          if (item.tagName === 'strong') {
            styleObj['font-weight'] = 'bold'
          }
          // sup 映射为上标。
          if (item.tagName === 'sup') {
            styleObj['vertical-align'] = 'super'
          }
          // sub 映射为下标。
          if (item.tagName === 'sub') {
            styleObj['vertical-align'] = 'sub'
          }
          // a 标签提取 href，后续转换为 pptxgenjs hyperlink。
          if (item.tagName === 'a') {
            // 读取链接地址属性。
            const attr = item.attributes.find(attr => attr.key === 'href')
            // 缺失 href 时保留空字符串，避免访问 undefined。
            styleObj['href'] = attr?.value || ''
          }
          // 无序列表标记。
          if (item.tagName === 'ul') {
            styleObj['list-type'] = 'ul'
          }
          // 有序列表标记。
          if (item.tagName === 'ol') {
            styleObj['list-type'] = 'ol'
          }
          // li 节点表示下一个文本片段需要写入 bullet 配置。
          if (item.tagName === 'li') {
            bulletFlag = true
          }
          // p 标签可能携带编辑器写入的 data-indent。
          if (item.tagName === 'p') {
            // 只有元素节点才有 attributes。
            if ('attributes' in item) {
              // 查找缩进等级属性。
              const dataIndentAttr = item.attributes.find(attr => attr.key === 'data-indent')
              // 有值时转成数字暂存。
              if (dataIndentAttr && dataIndentAttr.value) indent = +dataIndentAttr.value
            }
          }
        }

        // br 标签直接生成一个空文本换行片段。
        if ('tagName' in item && item.tagName === 'br') {
          slices.push({ text: '', options: { breakLine: true } })
        }
        // 文本节点：把继承后的样式转换为 pptxgenjs 文本选项。
        else if ('content' in item) {
          // 解码常见 HTML 实体并去掉换行符，保持 PPT 文本片段连续。
          const text = item.content.replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/\n/g, '')
          // 当前文本片段的 pptxgenjs 选项。
          const options: pptxgen.TextPropsOptions = {}

          // 字号从 CSS px 转成 PPT pt。
          if (styleObj['font-size']) {
            options.fontSize = parseInt(styleObj['font-size']) / ratioPx2Pt.value
          }
          // 文本颜色转换为 pptxgenjs 可用 hex。
          if (styleObj['color']) {
            options.color = formatColor(styleObj['color']).color
          }
          // 背景色转换为高亮色。
          if (styleObj['background-color']) {
            options.highlight = formatColor(styleObj['background-color']).color
          }
          // text-decoration-line 可能同时包含下划线和删除线。
          if (styleObj['text-decoration-line']) {
            // 下划线转换为单线。
            if (styleObj['text-decoration-line'].indexOf('underline') !== -1) {
              options.underline = {
                // 下划线颜色优先跟随文字色。
                color: options.color || '#000000',
                // 单下划线。
                style: 'sng',
              }
            }
            // 删除线转换为单删除线。
            if (styleObj['text-decoration-line'].indexOf('line-through') !== -1) {
              options.strike = 'sngStrike'
            }
          }
          // 兼容 text-decoration 简写属性。
          if (styleObj['text-decoration']) {
            // 下划线转换。
            if (styleObj['text-decoration'].indexOf('underline') !== -1) {
              options.underline = {
                // 下划线颜色。
                color: options.color || '#000000',
                // 单下划线。
                style: 'sng',
              }
            }
            // 删除线转换。
            if (styleObj['text-decoration'].indexOf('line-through') !== -1) {
              options.strike = 'sngStrike'
            }
          }
          // 上下标转换。
          if (styleObj['vertical-align']) {
            // 上标。
            if (styleObj['vertical-align'] === 'super') options.superscript = true
            // 下标。
            if (styleObj['vertical-align'] === 'sub') options.subscript = true
          }
          // 水平对齐直接映射给 pptxgenjs。
          if (styleObj['text-align']) options.align = styleObj['text-align'] as pptxgen.HAlign
          // 加粗转换。
          if (styleObj['font-weight']) options.bold = styleObj['font-weight'] === 'bold'
          // 斜体转换。
          if (styleObj['font-style']) options.italic = styleObj['font-style'] === 'italic'
          // 字体名转换。
          if (styleObj['font-family']) options.fontFace = styleObj['font-family']
          // 超链接转换。
          if (styleObj['href']) options.hyperlink = { url: styleObj['href'] }

          // 有序列表首个文本片段写入编号 bullet 配置。
          if (bulletFlag && styleObj['list-type'] === 'ol') {
            // 缩进根据当前字号估算，缺失字号时使用默认字号。
            options.bullet = { type: 'number', indent: (options.fontSize || defaultFontSize) * 1.25 }
            // 列表段前距使用小值，避免 PPTX 中列表过于拥挤。
            options.paraSpaceBefore = 0.1
            // 当前 li 的 bullet 已消费。
            bulletFlag = false
          }
          // 无序列表首个文本片段写入项目符号配置。
          if (bulletFlag && styleObj['list-type'] === 'ul') {
            // 缩进根据字号估算。
            options.bullet = { indent: (options.fontSize || defaultFontSize) * 1.25 }
            // 列表段前距。
            options.paraSpaceBefore = 0.1
            // 当前 li 的 bullet 已消费。
            bulletFlag = false
          }
          // 段落缩进写入当前文本片段。
          if (indent) {
            // pptxgenjs 使用 indentLevel 表达缩进级别。
            options.indentLevel = indent
            // 缩进只作用于当前段落首个文本片段。
            indent = 0
          }

          // 追加文本片段。
          slices.push({ text, options })
        }
        // 容器节点递归解析子节点，并传递当前累积样式。
        else if ('children' in item) parse(item.children, styleObj)
      }
    }
    // 从根 AST 开始解析。
    parse(ast)
    // 返回 pptxgenjs 文本片段。
    return slices
  }

  type Points = Array<
    | { x: number; y: number; moveTo?: boolean }
    | { x: number; y: number; curve: { type: 'arc'; hR: number; wR: number; stAng: number; swAng: number } }
    | { x: number; y: number; curve: { type: 'quadratic'; x1: number; y1: number } }
    | { x: number; y: number; curve: { type: 'cubic'; x1: number; y1: number; x2: number; y2: number } }
    | { close: true }
  >

  /**
   * 将解析后的 SVG 路径点转换为 pptxgenjs 自定义几何路径点。
   *
   * @param points - `toPoints()` 解析出的 SVG 路径点数组。
   * @param scale - x/y 方向缩放比例，用于把 viewBox 坐标映射到实际元素尺寸。
   * @returns pptxgenjs custGeom 可使用的点数组。
   * @throws 当前函数不主动抛错；不支持的曲线类型会按普通点兜底。
   * @remarks
   * - SVG path 使用像素坐标，pptxgenjs 需要英寸坐标，因此需要除以 `ratioPx2Inch`。
   * - 当前实现显式支持 close、moveTo、三次贝塞尔和二次贝塞尔。
   */
  const formatPoints = (points: SvgPoints, scale = { x: 1, y: 1 }): Points => {
    // 将每个 SVG 路径点映射为 pptxgenjs 点。
    return points.map(point => {
      // close 命令表示闭合当前路径。
      if (point.close !== undefined) {
        // pptxgenjs 使用 close: true 表示路径闭合。
        return { close: true }
      }
      // M 命令表示移动到新起点。
      else if (point.type === 'M') {
        return {
          // x 坐标从 px 转英寸，并应用横向缩放。
          x: point.x / ratioPx2Inch.value * scale.x,
          // y 坐标从 px 转英寸，并应用纵向缩放。
          y: point.y / ratioPx2Inch.value * scale.y,
          // 标记为移动起点，而不是绘制线段。
          moveTo: true,
        }
      }
      // 曲线点需要转换控制点。
      else if (point.curve) {
        // 三次贝塞尔曲线。
        if (point.curve.type === 'cubic') {
          return {
            // 曲线终点 x。
            x: point.x / ratioPx2Inch.value * scale.x,
            // 曲线终点 y。
            y: point.y / ratioPx2Inch.value * scale.y,
            // 曲线控制点配置。
            curve: {
              // pptxgenjs 曲线类型。
              type: 'cubic',
              // 第一个控制点 x。
              x1: (point.curve.x1 as number) / ratioPx2Inch.value * scale.x,
              // 第一个控制点 y。
              y1: (point.curve.y1 as number) / ratioPx2Inch.value * scale.y,
              // 第二个控制点 x。
              x2: (point.curve.x2 as number) / ratioPx2Inch.value * scale.x,
              // 第二个控制点 y。
              y2: (point.curve.y2 as number) / ratioPx2Inch.value * scale.y,
            },
          }
        }
        // 二次贝塞尔曲线。
        else if (point.curve.type === 'quadratic') {
          return {
            // 曲线终点 x。
            x: point.x / ratioPx2Inch.value * scale.x,
            // 曲线终点 y。
            y: point.y / ratioPx2Inch.value * scale.y,
            // 曲线控制点配置。
            curve: {
              // pptxgenjs 曲线类型。
              type: 'quadratic',
              // 控制点 x。
              x1: (point.curve.x1 as number) / ratioPx2Inch.value * scale.x,
              // 控制点 y。
              y1: (point.curve.y1 as number) / ratioPx2Inch.value * scale.y,
            },
          }
        }
      }
      // 普通直线点或暂未支持的曲线点按直线终点处理。
      return {
        // x 坐标从 px 转英寸。
        x: point.x / ratioPx2Inch.value * scale.x,
        // y 坐标从 px 转英寸。
        y: point.y / ratioPx2Inch.value * scale.y,
      }
    })
  }

  /**
   * 将 PPTist 阴影配置转换为 pptxgenjs 阴影配置。
   *
   * @param shadow - PPTist 元素阴影配置。
   * @returns pptxgenjs `ShadowProps` 对象。
   * @throws 当前函数不主动抛错；颜色解析由 `formatColor` 兜底。
   * @remarks
   * - PPTist 阴影用水平/垂直偏移表示，pptxgenjs 使用角度和距离表示。
   * - 这里根据 h/v 所在象限估算阴影角度，并用较大的偏移作为距离。
   */
  const getShadowOption = (shadow: PPTElementShadow): pptxgen.ShadowProps => {
    // 转换阴影颜色和透明度。
    const c = formatColor(shadow.color)
    // 读取水平和垂直偏移。
    const { h, v } = shadow

    // 默认阴影距离。
    let offset = 4
    // 默认阴影角度。
    let angle = 45

    // 无偏移时使用默认右下角阴影。
    if (h === 0 && v === 0) {
      offset = 4
      angle = 45
    }
    // 只有垂直偏移时，根据正负判断向下或向上。
    else if (h === 0) {
      // v > 0 表示向下。
      if (v > 0) {
        offset = v
        angle = 90
      }
      // v < 0 表示向上。
      else {
        offset = -v
        angle = 270
      }
    }
    // 只有水平偏移时，根据正负判断向右或向左。
    else if (v === 0) {
      // h > 0 表示向右。
      if (h > 0) {
        offset = h
        angle = 1
      }
      // h < 0 表示向左。
      else {
        offset = -h
        angle = 180
      }
    }
    // 第四象限视觉方向：右下。
    else if (h > 0 && v > 0) {
      offset = Math.max(h, v)
      angle = 45
    }
    // 第一象限视觉方向：右上。
    else if (h > 0 && v < 0) {
      offset = Math.max(h, -v)
      angle = 315
    }
    // 第三象限视觉方向：左下。
    else if (h < 0 && v > 0) {
      offset = Math.max(-h, v)
      angle = 135
    }
    // 第二象限视觉方向：左上。
    else if (h < 0 && v < 0) {
      offset = Math.max(-h, -v)
      angle = 225
    }

    // 返回 pptxgenjs 外阴影配置。
    return {
      // PPTist 当前阴影对应外阴影。
      type: 'outer',
      // pptxgenjs 阴影颜色不需要 #。
      color: c.color.replace('#', ''),
      // 透明度沿用 alpha。
      opacity: c.alpha,
      // 模糊半径从 px 转 pt。
      blur: shadow.blur / ratioPx2Pt.value,
      // 阴影距离。
      offset,
      // 阴影角度。
      angle,
    }
  }

  // PPTist 线型到 pptxgenjs dashType 的映射表。
  const dashTypeMap = {
    // 实线。
    'solid': 'solid',
    // 虚线。
    'dashed': 'dash',
    // 点线。
    'dotted': 'sysDot',
  }

  /**
   * 将 PPTist 边框配置转换为 pptxgenjs 线条配置。
   *
   * @param outline - PPTist 元素边框配置。
   * @returns pptxgenjs `ShapeLineProps` 对象。
   * @throws 当前函数不主动抛错；缺失边框颜色和宽度会使用默认值。
   * @remarks
   * - 颜色透明度需要拆成 color 和 transparency。
   * - 线宽从编辑器 px 转为 PPT pt。
   */
  const getOutlineOption = (outline: PPTElementOutline): pptxgen.ShapeLineProps => {
    // 转换边框颜色，缺失时黑色兜底。
    const c = formatColor(outline?.color || '#000000')
    
    // 返回 pptxgenjs 线条配置。
    return {
      // 边框颜色。
      color: c.color, 
      // pptxgenjs 使用 0-100 的 transparency 表示透明度。
      transparency: (1 - c.alpha) * 100,
      // 边框宽度从 px 转 pt。
      width: (outline.width || 1) / ratioPx2Pt.value, 
      // 边框线型，缺失时使用实线。
      dashType: outline.style ? dashTypeMap[outline.style] as 'solid' | 'dash' | 'sysDot' : 'solid',
    }
  }

  /**
   * 将 PPTist 超链接配置转换为 pptxgenjs 超链接配置。
   *
   * @param link - PPTist 元素链接配置。
   * @returns pptxgenjs 超链接配置；无法解析目标时返回 null。
   * @throws 当前函数不主动抛错。
   * @remarks
   * - web 链接直接导出为 URL。
   * - slide 链接需要把目标 slide id 转换为 PPTX 中从 1 开始的页码。
   */
  const getLinkOption = (link: PPTElementLink): pptxgen.HyperlinkProps | null => {
    // 解构链接类型和目标。
    const { type, target } = link
    // 外部网页链接。
    if (type === 'web') return { url: target }
    // 内部页面跳转链接。
    if (type === 'slide') {
      // 查找目标 slide 在当前文稿中的索引。
      const index = slides.value.findIndex(slide => slide.id === target)
      // pptxgenjs slide 编号从 1 开始。
      if (index !== -1) return { slide: index + 1 }
    }

    // 未找到目标页面或未知类型时不导出链接，避免生成坏链接。
    return null
  }

  /**
   * 判断地址是否为 base64 图片 data URL。
   *
   * @param url - 待判断的图片地址。
   * @returns 是 base64 图片则返回 true，否则返回 false。
   * @throws 当前函数不主动抛错。
   * @remarks 该判断用于决定 pptxgenjs `addImage` 应使用 data 还是 path。
   */
  const isBase64Image = (url: string) => {
    // 匹配 data:image/xxx;base64, 前缀。
    const regex = /^data:image\/[^;]+;base64,/
    // 正则匹配成功则认为是 base64 图片。
    return url.match(regex) !== null
  }

  /**
   * 判断地址是否为 SVG 图片。
   *
   * @param url - 待判断的图片地址。
   * @returns 是 SVG base64 或 .svg URL 则返回 true，否则返回 false。
   * @throws 当前函数不主动抛错。
   * @remarks SVG 图片在 PPTX 导出时通常需要转成位图或特殊处理，否则兼容性较弱。
   */
  const isSVGImage = (url: string) => {
    // 判断 SVG base64 data URL。
    const isSVGBase64 = /^data:image\/svg\+xml;base64,/.test(url)
    // 判断以 .svg 结尾的普通 URL。
    const isSVGUrl = /\.svg$/.test(url)
    // 任一条件满足即认为是 SVG。
    return isSVGBase64 || isSVGUrl
  }

  /**
   * 将 PPTist 页面数据导出为可编辑的 PPTX 文件。
   *
   * @param _slides - 需要导出的幻灯片列表，允许调用方传入全部页面或筛选页面。
   * @param masterOverwrite - 是否使用当前主题背景覆盖 PPTX 母版背景。
   * @param ignoreMedia - 是否忽略音视频媒体元素，避免浏览器端打包大文件或不兼容资源。
   * @returns 无显式返回值；导出成功后会触发 PPTX 文件下载。
   * @throws 函数内部通过 Promise catch 消化写文件失败，并恢复导出状态、提示用户。
   * @remarks
   * - 该函数尽量把 PPTist 内部元素转换为 pptxgenjs 原生元素，以便导出的 PPTX 后续可编辑。
   * - 坐标、尺寸、线宽、字号、边距等都需要从编辑器像素换算为 PPTX 使用的英寸或磅。
   * - 对 PPTX 原生能力不完全支持的内容，例如渐变背景、特殊形状、LaTeX，会采用近似色或图片化方式兜底。
   */
  const exportPPTX = (_slides: Slide[], masterOverwrite: boolean, ignoreMedia: boolean, options?: { download?: boolean; fileName?: string }) => {
    // 标记导出开始，避免用户重复点击导出。
    exporting.value = true
    /**
     * 将本次显式传入的导出页面写入本地 slides 引用。
     *
     * 这样做的原因：
     * - 原导出代码的 `getLinkOption()` 会通过 `slides.value` 查找页面内跳转链接。
     * - generatePPT 不读取外部 store，因此需要在每次导出时把临时页面列表同步到本地引用。
     */
    slides.value = _slides
    let resolveExport!: (value: File | void) => void
    let rejectExport!: (reason?: unknown) => void
    const exportPromise = new Promise<File | void>((resolve, reject) => {
      resolveExport = resolve
      rejectExport = reject
    })
    // 创建 pptxgenjs 文档实例。
    const pptx = new pptxgen()

    // 16:10 画布比例映射到 pptxgenjs 内置布局。
    if (viewportRatio.value === 0.625) pptx.layout = 'LAYOUT_16x10'
    // 4:3 画布比例映射到 pptxgenjs 内置布局。
    else if (viewportRatio.value === 0.75) pptx.layout = 'LAYOUT_4x3'
    // A3 横版比例没有内置布局，需要自定义尺寸。
    else if (viewportRatio.value === 0.70710678) {
      // 定义 A3 横版布局，单位为英寸。
      pptx.defineLayout({ name: 'A3', width: 10, height: 7.0710678 })
      // 启用自定义 A3 横版布局。
      pptx.layout = 'A3'
    }
    // A3 竖版比例没有内置布局，需要自定义尺寸。
    else if (viewportRatio.value === 1.41421356) {
      // 定义 A3 竖版布局，单位为英寸。
      pptx.defineLayout({ name: 'A3_V', width: 10, height: 14.1421356 })
      // 启用自定义 A3 竖版布局。
      pptx.layout = 'A3_V'
    }
    // 其他比例默认按 16:9 导出，这是项目最常用的编辑比例。
    else pptx.layout = 'LAYOUT_16x9'

    // 需要覆盖母版背景时，用当前主题背景色定义统一母版。
    if (masterOverwrite) {
      // 将主题背景色转换为 pptxgenjs 可用颜色和透明度。
      const { color: bgColor, alpha: bgAlpha } = formatColor(theme.value.backgroundColor)
      // 定义 PPTX 母版，后续页面可继承该背景。
      pptx.defineSlideMaster({
        // 母版名称。
        title: 'PPTIST_MASTER',
        // 母版背景色和透明度。
        background: { color: bgColor, transparency: (1 - bgAlpha) * 100 },
      })
    }

    // 逐页导出幻灯片。
    for (const slide of _slides) {
      // 新建一页 PPTX 幻灯片。
      const pptxSlide = pptx.addSlide()

      // 导出页面背景。
      if (slide.background) {
        // 当前 PPTist 页面背景配置。
        const background = slide.background
        // 图片背景：根据资源类型选择 addImage、data 背景或 path 背景。
        if (background.type === 'image' && background.image) {
          // SVG 背景使用 addImage 铺满页面，避免直接 background 对 SVG 兼容性不足。
          if (isSVGImage(background.image.src)) {
            pptxSlide.addImage({
              // SVG data URL 或路径。
              data: background.image.src,
              // 背景从页面左上角开始。
              x: 0,
              // 背景从页面顶部开始。
              y: 0,
              // 背景宽度铺满页面。
              w: viewportSize.value / ratioPx2Inch.value,
              // 背景高度按页面比例铺满页面。
              h: viewportSize.value * viewportRatio.value / ratioPx2Inch.value,
            })
          }
          // base64 位图可以作为 slide background data 写入。
          else if (isBase64Image(background.image.src)) {
            pptxSlide.background = { data: background.image.src }
          }
          // 普通 URL 或本地路径使用 path 写入背景。
          else {
            pptxSlide.background = { path: background.image.src }
          }
        }
        // 纯色背景直接转换为 PPTX 背景色。
        else if (background.type === 'solid' && background.color) {
          // 转换背景颜色和透明度。
          const c = formatColor(background.color)
          // 写入 PPTX 页面背景。
          pptxSlide.background = { color: c.color, transparency: (1 - c.alpha) * 100 }
        }
        // 渐变背景在 pptxgenjs 背景中不能完整表达，这里混合首尾颜色近似。
        else if (background.type === 'gradient' && background.gradient) {
          // 渐变色标。
          const colors = background.gradient.colors
          // 取第一个色标颜色。
          const color1 = colors[0].color
          // 取最后一个色标颜色。
          const color2 = colors[colors.length - 1].color
          // 将首尾颜色混合成一个近似纯色。
          const color = tinycolor.mix(color1, color2).toHexString()
          // 转换近似颜色和透明度。
          const c = formatColor(color)
          // 写入近似背景色。
          pptxSlide.background = { color: c.color, transparency: (1 - c.alpha) * 100 }
        }
      }
      // 导出备注内容。
      if (slide.remark) {
        // 备注以 HTML 保存，先解析为 DOM。
        const doc = new DOMParser().parseFromString(slide.remark, 'text/html')
        // 按段落提取备注文本。
        const pList = doc.body.querySelectorAll('p')
        // PPTX 备注纯文本行数组。
        const text = []
        // 遍历备注段落。
        for (const p of pList) {
          // 提取段落纯文本。
          const textContent = p.textContent
          // 空段落保留为空行，避免备注结构被完全压缩。
          text.push(textContent || '')
        }
        // 将备注行写入 PPTX notes。
        pptxSlide.addNotes(text.join('\n'))
      }

      // 没有元素的页面只导出背景和备注。
      if (!slide.elements) continue

      // 逐个导出当前页元素。
      for (const el of slide.elements) {
        // 文本元素：转换为 pptxgenjs 富文本框。
        if (el.type === 'text') {
          // 将 PPTist HTML 富文本转换成 pptxgenjs 文本片段。
          const textProps = formatHTML(el.content)
          // 文本内边距缺失时使用默认 10px。
          const inset = el.inset || [10, 10, 10, 10]

          // 文本框基础配置。
          const options: pptxgen.TextPropsOptions = {
            // 左坐标从 px 转英寸。
            x: el.left / ratioPx2Inch.value,
            // 上坐标从 px 转英寸。
            y: el.top / ratioPx2Inch.value,
            // 宽度从 px 转英寸。
            w: el.width / ratioPx2Inch.value,
            // 高度从 px 转英寸。
            h: el.height / ratioPx2Inch.value,
            // 默认字号从 px/逻辑字号转 PPT pt。
            fontSize: defaultFontSize / ratioPx2Pt.value,
            // 默认字体，后续可被元素默认字体覆盖。
            fontFace: '微软雅黑',
            // 默认文字颜色，后续可被元素默认颜色覆盖。
            color: '#000000',
            // 文本元素默认顶部对齐。
            valign: 'top',
            // PPTist inset 顺序为上右下左，pptxgenjs margin 顺序按左右下上写入当前既有逻辑。
            margin: [inset[3], inset[1], inset[2], inset[0]].map(item => item / ratioPx2Pt.value) as [number, number, number, number],
            // 默认段前距。
            paraSpaceBefore: 5 / ratioPx2Pt.value,
            // 默认行距倍数。
            lineSpacingMultiple: 1.5 / 1.25,
            // 开启自动适配，减少导出后文本溢出。
            autoFit: true,
          }
          // 保留文本旋转角。
          if (el.rotate) options.rotate = el.rotate
          // 字间距从 px 转 pt。
          if (el.wordSpace) options.charSpacing = el.wordSpace / ratioPx2Pt.value
          // 行高转换为 pptxgenjs 行距倍数。
          if (el.lineHeight) options.lineSpacingMultiple = el.lineHeight / 1.25
          // 文本背景填充。
          if (el.fill) {
            // 转换填充颜色。
            const c = formatColor(el.fill)
            // 元素透明度缺失时按完全不透明处理。
            const opacity = el.opacity === undefined ? 1 : el.opacity
            // 组合颜色 alpha 和元素 opacity 后写入透明度。
            options.fill = { color: c.color, transparency: (1 - c.alpha * opacity) * 100 }
          }
          // 默认文字颜色覆盖基础颜色。
          if (el.defaultColor) options.color = formatColor(el.defaultColor).color
          // 默认字体覆盖基础字体。
          if (el.defaultFontName) options.fontFace = el.defaultFontName
          // 导出文本阴影。
          if (el.shadow) options.shadow = getShadowOption(el.shadow)
          // 导出文本框边框。
          if (el.outline?.width) options.line = getOutlineOption(el.outline)
          // 元素整体透明度。
          if (el.opacity !== undefined) options.transparency = (1 - el.opacity) * 100
          // 段落间距从 px 转 pt。
          if (el.paragraphSpace !== undefined) options.paraSpaceBefore = el.paragraphSpace / ratioPx2Pt.value
          // 竖排文字映射为东亚竖排。
          if (el.vertical) options.vert = 'eaVert'

          // 写入 PPTX 文本框。
          pptxSlide.addText(textProps, options)
        }

        // 图片元素：转换为 pptxgenjs 图片，并尽量保留翻转、旋转、链接、透明度和裁剪。
        else if (el.type === 'image') {
          // 图片基础配置。
          const options: pptxgen.ImageProps = {
            // 左坐标从 px 转英寸。
            x: el.left / ratioPx2Inch.value,
            // 上坐标从 px 转英寸。
            y: el.top / ratioPx2Inch.value,
            // 宽度从 px 转英寸。
            w: el.width / ratioPx2Inch.value,
            // 高度从 px 转英寸。
            h: el.height / ratioPx2Inch.value,
          }
          // base64 图片写入 data 字段。
          if (isBase64Image(el.src)) options.data = el.src
          // 普通图片路径或 URL 写入 path 字段。
          else options.path = el.src

          // 保留水平翻转。
          if (el.flipH) options.flipH = el.flipH
          // 保留垂直翻转。
          if (el.flipV) options.flipV = el.flipV
          // 保留旋转角。
          if (el.rotate) options.rotate = el.rotate
          // 保留图片链接。
          if (el.link) {
            // 转换链接配置。
            const linkOption = getLinkOption(el.link)
            // 只有有效链接才写入 PPTX。
            if (linkOption) options.hyperlink = linkOption
          }
          // 图片滤镜透明度导出为 PPTX transparency。
          if (el.filters?.opacity) options.transparency = 100 - parseInt(el.filters?.opacity)
          // 图片裁剪配置。
          if (el.clip) {
            // 椭圆裁剪用 pptxgenjs rounding 近似。
            if (el.clip.shape === 'ellipse') options.rounding = true

            // 裁剪范围起点和终点。
            const [start, end] = el.clip.range
            // 裁剪起点 x/y。
            const [startX, startY] = start
            // 裁剪终点 x/y。
            const [endX, endY] = end

            // 根据可见区域比例反推原始图片宽度。
            const originW = el.width / ((endX - startX) / ratioPx2Inch.value)
            // 根据可见区域比例反推原始图片高度。
            const originH = el.height / ((endY - startY) / ratioPx2Inch.value)

            // addImage 的外层图片宽度调整为原始宽度。
            options.w = originW / ratioPx2Inch.value
            // addImage 的外层图片高度调整为原始高度。
            options.h = originH / ratioPx2Inch.value

            // pptxgenjs crop 区域配置。
            options.sizing = {
              // 使用裁剪模式。
              type: 'crop',
              // 裁剪区域左坐标。
              x: startX / ratioPx2Inch.value * originW / ratioPx2Inch.value,
              // 裁剪区域上坐标。
              y: startY / ratioPx2Inch.value * originH / ratioPx2Inch.value,
              // 裁剪区域宽度。
              w: (endX - startX) / ratioPx2Inch.value * originW / ratioPx2Inch.value,
              // 裁剪区域高度。
              h: (endY - startY) / ratioPx2Inch.value * originH / ratioPx2Inch.value,
            }
          }

          // 写入 PPTX 图片。
          pptxSlide.addImage(options)
        }

        // 形状元素：普通形状尽量导出为自定义几何，特殊形状或复杂填充会使用图片化兜底。
        else if (el.type === 'shape') {
          // 特殊形状通常依赖 Vue 组件渲染，pptxgenjs 无法直接表达，导出为 SVG 图片。
          if (el.special) {
            // generatePPT 独立目录不再引用编辑器 Vue 元素组件，避免把整套组件树和 store 依赖带入新项目。
            // 特殊形状无法由 pptxgenjs 原生表达时先跳过；普通形状仍按自定义几何导出。
            continue
          }
          // 普通形状：将 SVG path 转成 pptxgenjs 自定义几何。
          else {
            // 将形状实际尺寸与 viewBox 尺寸换算成路径缩放比例。
            const scale = {
              // x 方向缩放。
              x: el.width / el.viewBox[0],
              // y 方向缩放。
              y: el.height / el.viewBox[1],
            }
            // 解析 SVG path 并转换为 pptxgenjs 点数组。
            const points = formatPoints(toPoints(el.path), scale)
  
            // 默认使用形状纯色填充。
            let fillColor = formatColor(el.fill)
            // 渐变填充无法完整映射到 pptxgenjs 自定义几何时，混合首尾色近似。
            if (el.gradient) {
              // 渐变色标。
              const colors = el.gradient.colors
              // 首个渐变色。
              const color1 = colors[0].color
              // 最后一个渐变色。
              const color2 = colors[colors.length - 1].color
              // 混合为近似纯色。
              const color = tinycolor.mix(color1, color2).toHexString()
              // 转换近似填充色。
              fillColor = formatColor(color)
            }
            // 图片填充后面会额外叠加图片，这里的几何填充先设为透明。
            if (el.pattern) fillColor = formatColor('#00000000')
            // 元素整体透明度，缺失时按不透明处理。
            const opacity = el.opacity === undefined ? 1 : el.opacity
  
            // 自定义几何基础配置。
            const options: pptxgen.ShapeProps = {
              // 左坐标从 px 转英寸。
              x: el.left / ratioPx2Inch.value,
              // 上坐标从 px 转英寸。
              y: el.top / ratioPx2Inch.value,
              // 宽度从 px 转英寸。
              w: el.width / ratioPx2Inch.value,
              // 高度从 px 转英寸。
              h: el.height / ratioPx2Inch.value,
              // 填充色和透明度。
              fill: { color: fillColor.color, transparency: (1 - fillColor.alpha * opacity) * 100 },
              // 自定义几何路径点。
              points,
            }
            // 保留水平翻转。
            if (el.flipH) options.flipH = el.flipH
            // 保留垂直翻转。
            if (el.flipV) options.flipV = el.flipV
            // 保留阴影。
            if (el.shadow) options.shadow = getShadowOption(el.shadow)
            // 保留边框。
            if (el.outline?.width) options.line = getOutlineOption(el.outline)
            // 保留旋转角。
            if (el.rotate) options.rotate = el.rotate
            // 保留形状链接。
            if (el.link) {
              // 转换链接配置。
              const linkOption = getLinkOption(el.link)
              // 有效链接才写入 PPTX。
              if (linkOption) options.hyperlink = linkOption
            }

            // 写入 PPTX 自定义几何形状。
            pptxSlide.addShape('custGeom' as pptxgen.ShapeType, options)
          }
          // 形状内嵌文本单独以文本框形式叠加导出。
          if (el.text) {
            // 转换形状内富文本。
            const textProps = formatHTML(el.text.content)
            // 读取形状文本内边距，缺失时使用默认 10px。
            const inset = el.text.inset || [10, 10, 10, 10]

            // 形状内文本配置。
            const options: pptxgen.TextPropsOptions = {
              // 左坐标从 px 转英寸。
              x: el.left / ratioPx2Inch.value,
              // 上坐标从 px 转英寸。
              y: el.top / ratioPx2Inch.value,
              // 宽度从 px 转英寸。
              w: el.width / ratioPx2Inch.value,
              // 高度从 px 转英寸。
              h: el.height / ratioPx2Inch.value,
              // 默认字号。
              fontSize: defaultFontSize / ratioPx2Pt.value,
              // 默认字体。
              fontFace: '微软雅黑',
              // 默认文字颜色。
              color: '#000000',
              // 默认段前距。
              paraSpaceBefore: 5 / ratioPx2Pt.value,
              // 文本内边距。
              margin: [inset[3], inset[1], inset[2], inset[0]].map(item => item / ratioPx2Pt.value) as [number, number, number, number],
              // 形状文本垂直对齐。
              valign: el.text.align,
            }
            // 形状文本跟随形状旋转。
            if (el.rotate) options.rotate = el.rotate
            // 覆盖默认文字颜色。
            if (el.text.defaultColor) options.color = formatColor(el.text.defaultColor).color
            // 覆盖默认字体。
            if (el.text.defaultFontName) options.fontFace = el.text.defaultFontName

            // 将形状内文本叠加到形状上方。
            pptxSlide.addText(textProps, options)
          }
          // 图片填充需要额外叠加一张图片来近似 pattern 效果。
          if (el.pattern) {
            // 图片填充基础配置。
            const options: pptxgen.ImageProps = {
              // 左坐标从 px 转英寸。
              x: el.left / ratioPx2Inch.value,
              // 上坐标从 px 转英寸。
              y: el.top / ratioPx2Inch.value,
              // 宽度从 px 转英寸。
              w: el.width / ratioPx2Inch.value,
              // 高度从 px 转英寸。
              h: el.height / ratioPx2Inch.value,
            }
            // base64 图片填充写入 data。
            if (isBase64Image(el.pattern)) options.data = el.pattern
            // 普通 URL 或路径写入 path。
            else options.path = el.pattern
  
            // 保留水平翻转。
            if (el.flipH) options.flipH = el.flipH
            // 保留垂直翻转。
            if (el.flipV) options.flipV = el.flipV
            // 保留旋转角。
            if (el.rotate) options.rotate = el.rotate
            // 保留链接。
            if (el.link) {
              // 转换链接配置。
              const linkOption = getLinkOption(el.link)
              // 有效链接才写入 PPTX。
              if (linkOption) options.hyperlink = linkOption
            }

            // 将图片填充叠加到形状区域。
            pptxSlide.addImage(options)
          }
        }

        // 线条元素：转换为 pptxgenjs 自定义几何线条，保留箭头、线型、阴影等样式。
        else if (el.type === 'line') {
          // 根据 PPTist 线条类型生成 SVG path。
          const path = getLineElementPath(el)
          // 将 SVG path 转成 pptxgenjs 自定义几何点。
          const points = formatPoints(toPoints(path))
          // 获取线条元素的实际外接范围，用于确定 PPTX 中的宽高。
          const { minX, maxX, minY, maxY } = getElementRange(el)
          // 转换线条颜色和透明度。
          const c = formatColor(el.color)

          // 线条自定义几何配置。
          const options: pptxgen.ShapeProps = {
            // 左坐标从 px 转英寸。
            x: el.left / ratioPx2Inch.value,
            // 上坐标从 px 转英寸。
            y: el.top / ratioPx2Inch.value,
            // 宽度使用外接范围宽度并转英寸。
            w: (maxX - minX) / ratioPx2Inch.value,
            // 高度使用外接范围高度并转英寸。
            h: (maxY - minY) / ratioPx2Inch.value,
            // 线条样式配置。
            line: {
              // 线条颜色。
              color: c.color, 
              // 线条透明度。
              transparency: (1 - c.alpha) * 100,
              // 线宽从 px 转 pt。
              width: el.width / ratioPx2Pt.value, 
              // 线型映射为 pptxgenjs dashType。
              dashType: dashTypeMap[el.style] as 'solid' | 'dash' | 'sysDot',
              // 起点箭头。
              beginArrowType: el.points[0] ? 'arrow' : 'none',
              // 终点箭头。
              endArrowType: el.points[1] ? 'arrow' : 'none',
            },
            // 线条路径点。
            points,
          }
          // 保留线条阴影。
          if (el.shadow) options.shadow = getShadowOption(el.shadow)

          // 使用自定义几何写入 PPTX。
          pptxSlide.addShape('custGeom' as pptxgen.ShapeType, options)
        }

        // 图表元素：转换为 pptxgenjs 原生图表，尽量保留类型、颜色、图例和堆叠配置。
        else if (el.type === 'chart') {
          // pptxgenjs 图表数据数组。
          const chartData = []
          // 遍历每个数据系列。
          for (let i = 0; i < el.data.series.length; i++) {
            // 当前系列数值。
            const item = el.data.series[i]
            // 追加系列数据。
            chartData.push({
              // 系列名称；当前导出使用统一中文序号命名。
              name: `系列${i + 1}`,
              // 分类标签。
              labels: el.data.labels,
              // 系列值。
              values: item,
            })
          }

          // 图表色板，最终需要扩展到足够的颜色数量。
          let chartColors: string[] = []
          // 已有 10 个主题色时直接转换。
          if (el.themeColors.length === 10) chartColors = el.themeColors.map(color => formatColor(color).color)
          // 只有 1 个主题色时，通过 analogous 生成一组近似色。
          else if (el.themeColors.length === 1) chartColors = tinycolor(el.themeColors[0]).analogous(10).map(color => formatColor(color.toHexString()).color)
          // 主题色数量介于 2 到 9 时，保留已有颜色并从最后一个颜色补足近似色。
          else {
            // 当前主题色数量。
            const len = el.themeColors.length
            // 根据最后一个颜色生成补充色。
            const supplement = tinycolor(el.themeColors[len - 1]).analogous(10 + 1 - len).map(color => color.toHexString())
            // 合并原主题色和补充色，并转换为 PPTX 颜色。
            chartColors = [...el.themeColors.slice(0, len - 1), ...supplement].map(color => formatColor(color).color)
          }
          
          // 图表基础配置。
          const options: pptxgen.IChartOpts = {
            // 左坐标从 px 转英寸。
            x: el.left / ratioPx2Inch.value,
            // 上坐标从 px 转英寸。
            y: el.top / ratioPx2Inch.value,
            // 宽度从 px 转英寸。
            w: el.width / ratioPx2Inch.value,
            // 高度从 px 转英寸。
            h: el.height / ratioPx2Inch.value,
            // 饼图/环图需要为每个扇区提供颜色，其他图表按系列数量截取颜色。
            chartColors: (el.chartType === 'pie' || el.chartType === 'ring') ? chartColors : chartColors.slice(0, el.data.series.length),
          }

          // 图表文字颜色。
          const textColor = formatColor(el.textColor || '#000000').color
          // 分类轴标签颜色。
          options.catAxisLabelColor = textColor
          // 数值轴标签颜色。
          options.valAxisLabelColor = textColor

          // 坐标轴和图例字号。
          const fontSize = 14 / ratioPx2Pt.value
          // 分类轴标签字号。
          options.catAxisLabelFontSize = fontSize
          // 数值轴标签字号。
          options.valAxisLabelFontSize = fontSize
          
          // 图表绘图区填充或边框。
          if (el.fill || el.outline) {
            // 绘图区填充和边框配置。
            const plotArea: pptxgen.IChartPropsFillLine = {}
            // 绘图区填充色。
            if (el.fill) {
              plotArea.fill = { color: formatColor(el.fill).color }
            }
            // 绘图区边框。
            if (el.outline) {
              plotArea.border = {
                // 边框宽度从 px 转 pt。
                pt: el.outline.width! / ratioPx2Pt.value,
                // 边框颜色。
                color: formatColor(el.outline.color!).color,
              }
            }
            // 写入绘图区配置。
            options.plotArea = plotArea
          }

          // 多系列图表、饼图和环图显示图例。
          if ((el.data.series.length > 1 && el.chartType !== 'scatter') || el.chartType === 'pie' || el.chartType === 'ring') {
            // 显示图例。
            options.showLegend = true
            // 图例位于底部。
            options.legendPos = 'b'
            // 图例文字颜色。
            options.legendColor = textColor
            // 图例字号。
            options.legendFontSize = fontSize
          }

          // 默认图表类型为 bar，避免未知类型导致没有导出。
          let type = pptx.ChartType.bar
          // 条形图。
          if (el.chartType === 'bar') {
            type = pptx.ChartType.bar
            // 当前项目中 bar 映射为列方向。
            options.barDir = 'col'
            // 堆叠配置。
            if (el.options?.stack) options.barGrouping = 'stacked'
          }
          // 柱状图。
          else if (el.chartType === 'column') {
            type = pptx.ChartType.bar
            // 当前项目中 column 映射为条方向，保留既有逻辑。
            options.barDir = 'bar'
            // 堆叠配置。
            if (el.options?.stack) options.barGrouping = 'stacked'
          }
          // 折线图。
          else if (el.chartType === 'line') {
            type = pptx.ChartType.line
            // 平滑折线配置。
            if (el.options?.lineSmooth) options.lineSmooth = true
          }
          // 面积图。
          else if (el.chartType === 'area') {
            type = pptx.ChartType.area
          }
          // 雷达图。
          else if (el.chartType === 'radar') {
            type = pptx.ChartType.radar
          }
          // 散点图。
          else if (el.chartType === 'scatter') {
            type = pptx.ChartType.scatter
            // 散点图不显示连线。
            options.lineSize = 0
          }
          // 饼图。
          else if (el.chartType === 'pie') {
            type = pptx.ChartType.pie
          }
          // 环图。
          else if (el.chartType === 'ring') {
            type = pptx.ChartType.doughnut
            // 环图中心孔大小。
            options.holeSize = 60
          }
          
          // 写入 PPTX 图表。
          pptxSlide.addChart(type, chartData, options)
        }

        // 表格元素：转换为 pptxgenjs 表格，处理合并单元格、主题样式、边框和列宽。
        else if (el.type === 'table') {
          // 被合并覆盖的单元格坐标列表，避免重复写入。
          const hiddenCells = []
          // 遍历表格行，用于识别合并单元格。
          for (let i = 0; i < el.data.length; i++) {
            // 当前行数据。
            const rowData = el.data[i]

            // 遍历当前行单元格。
            for (let j = 0; j < rowData.length; j++) {
              // 当前单元格。
              const cell = rowData[j]
              // 只有跨行或跨列的单元格才会隐藏其覆盖范围内的其他单元格。
              if (cell.colspan > 1 || cell.rowspan > 1) {
                // 遍历被当前单元格覆盖的行。
                for (let row = i; row < i + cell.rowspan; row++) {
                  // 第一行从当前列后一列开始隐藏，其余行从当前列开始隐藏。
                  for (let col = row === i ? j + 1 : j; col < j + cell.colspan; col++) hiddenCells.push(`${row}_${col}`)
                }
              }
            }
          }

          // pptxgenjs 表格数据。
          const tableData = []

          // 表格主题配置。
          const theme = el.theme
          // 主主题色。
          let themeColor: FormatColor | null = null
          // 派生主题色，用于隔行或普通单元格填充。
          let subThemeColors: FormatColor[] = []
          // 存在主题时预先计算主色和派生色。
          if (theme) {
            // 主主题色。
            themeColor = formatColor(theme.color)
            // 根据主题色计算浅色变体。
            subThemeColors = getTableSubThemeColor(theme.color).map(item => formatColor(item))
          }

          // 遍历表格每一行。
          for (let i = 0; i < el.data.length; i++) {
            // PPTist 当前行。
            const row = el.data[i]
            // pptxgenjs 当前行。
            const _row = []

            // 遍历当前行每个单元格。
            for (let j = 0; j < row.length; j++) {
              // PPTist 单元格。
              const cell = row[j]
              // pptxgenjs 单元格样式。
              const cellOptions: pptxgen.TableCellProps = {
                // 横向合并列数。
                colspan: cell.colspan,
                // 纵向合并行数。
                rowspan: cell.rowspan,
                // 加粗。
                bold: cell.style?.bold || false,
                // 斜体。
                italic: cell.style?.em || false,
                // 下划线。
                underline: { style: cell.style?.underline ? 'sng' : 'none' },
                // 水平对齐。
                align: cell.style?.align || 'left',
                // 垂直对齐，当前统一居中。
                valign: 'middle',
                // 字体。
                fontFace: cell.style?.fontname || '微软雅黑',
                // 字号从 px 字符串转 pt。
                fontSize: (cell.style?.fontsize ? parseInt(cell.style?.fontsize) : 14) / ratioPx2Pt.value,
              }
              // 应用表格主题填充。
              if (theme && themeColor) {
                // 当前单元格最终主题色。
                let c: FormatColor
                // 偶数行使用第二个派生色。
                if (i % 2 === 0) c = subThemeColors[1]
                // 奇数行使用第一个派生色。
                else c = subThemeColors[0]

                // 行表头使用主主题色。
                if (theme.rowHeader && i === 0) c = themeColor
                // 行表尾使用主主题色。
                else if (theme.rowFooter && i === el.data.length - 1) c = themeColor
                // 列表头使用主主题色。
                else if (theme.colHeader && j === 0) c = themeColor
                // 列表尾使用主主题色。
                else if (theme.colFooter && j === row.length - 1) c = themeColor

                // 写入单元格主题填充。
                cellOptions.fill = { color: c.color, transparency: (1 - c.alpha) * 100 }
              }
              // 单元格自定义背景色优先于主题色。
              if (cell.style?.backcolor) {
                // 转换单元格背景色。
                const c = formatColor(cell.style.backcolor)
                // 写入单元格填充。
                cellOptions.fill = { color: c.color, transparency: (1 - c.alpha) * 100 }
              }
              // 单元格文字颜色。
              if (cell.style?.color) cellOptions.color = formatColor(cell.style.color).color

              // 被合并覆盖的单元格不写入，避免 pptxgenjs 表格结构错位。
              if (!hiddenCells.includes(`${i}_${j}`)) {
                // 追加可见单元格。
                _row.push({
                  // 单元格文本。
                  text: cell.text,
                  // 单元格样式。
                  options: cellOptions,
                })
              }
            }
            // 只有存在可见单元格的行才写入表格数据。
            if (_row.length) tableData.push(_row)
          }

          // 表格整体配置。
          const options: pptxgen.TableProps = {
            // 左坐标从 px 转英寸。
            x: el.left / ratioPx2Inch.value,
            // 上坐标从 px 转英寸。
            y: el.top / ratioPx2Inch.value,
            // 宽度从 px 转英寸。
            w: el.width / ratioPx2Inch.value,
            // 高度从 px 转英寸。
            h: el.height / ratioPx2Inch.value,
            // 列宽按表格宽度和列宽比例转换为英寸。
            colW: el.colWidths.map(item => el.width * item / ratioPx2Inch.value),
          }
          // 存在主题时设置白色底色，避免默认透明背景影响主题呈现。
          if (el.theme) options.fill = { color: '#ffffff' }
          // 表格外框配置。
          if (el.outline.width && el.outline.color) {
            options.border = {
              // pptxgenjs 表格边框只区分 solid/dash。
              type: el.outline.style === 'solid' ? 'solid' : 'dash',
              // 边框宽度从 px 转 pt。
              pt: el.outline.width / ratioPx2Pt.value,
              // 边框颜色。
              color: formatColor(el.outline.color).color,
            }
          }

          // 写入 PPTX 表格。
          pptxSlide.addTable(tableData, options)
        }
        
        // LaTeX 元素：通过 Vue 组件渲染成 SVG，再作为图片写入 PPTX。
        else if (el.type === 'latex') {
          // generatePPT 独立目录不引用编辑器 LaTeX Vue 组件，避免迁移时额外复制公式渲染依赖。
          // AI 套版模板通常不包含 LaTeX 元素，因此这里跳过不影响常规 AIPPT 生成。
          continue
        }
        
        // 音视频媒体元素：在未忽略媒体时导出为 pptxgenjs media。
        else if (!ignoreMedia && (el.type === 'video' || el.type === 'audio')) {
          // 媒体基础配置。
          const options: pptxgen.MediaProps = {
            // 左坐标从 px 转英寸。
            x: el.left / ratioPx2Inch.value,
            // 上坐标从 px 转英寸。
            y: el.top / ratioPx2Inch.value,
            // 宽度从 px 转英寸。
            w: el.width / ratioPx2Inch.value,
            // 高度从 px 转英寸。
            h: el.height / ratioPx2Inch.value,
            // 媒体资源路径。
            path: el.src,
            // 媒体类型。
            type: el.type,
          }
          // 视频封面图。
          if (el.type === 'video' && el.poster) options.cover = el.poster

          // 尝试从 URL 或文件名中提取扩展名。
          const extMatch = el.src.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/)
          // 优先使用路径中的扩展名。
          if (extMatch && extMatch[1]) options.extn = extMatch[1]
          // 路径无扩展名时使用元素中保存的扩展名。
          else if (el.ext) options.extn = el.ext
          
          // pptxgenjs 支持的视频扩展名白名单。
          const videoExts = ['avi', 'mp4', 'm4v', 'mov', 'wmv']
          // pptxgenjs 支持的音频扩展名白名单。
          const audioExts = ['mp3', 'm4a', 'mp4', 'wav', 'wma']
          // 只有扩展名受支持时才写入媒体，避免生成无法打开的 PPTX。
          if (options.extn && [...videoExts, ...audioExts].includes(options.extn)) {
            // 写入 PPTX 媒体元素。
            pptxSlide.addMedia(options)
          }
        }
      }
    }

    // 延迟写文件，给浏览器完成前面离屏渲染和资源处理的时间。
    setTimeout(() => {
      const fileName = options?.fileName || `${title.value}.pptx`

      if (options?.download === false) {
        pptx.write({ outputType: 'blob' }).then(data => {
          const blob = data instanceof Blob ? data : new Blob([data as BlobPart], {
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          })
          exporting.value = false
          resolveExport(new File([blob], fileName, {
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          }))
        }).catch(err => {
          exporting.value = false
          console.error('[generatePPT exportPPTX] 导出失败', err)
          rejectExport(err)
        })
      }
      else {
        // 写出 PPTX 文件。
        pptx.writeFile({ fileName }).then(() => {
          exporting.value = false
          resolveExport()
        }).catch(err => {
          // 写文件失败时恢复导出状态。
          exporting.value = false
          // 提示用户导出失败。
          console.error('[generatePPT exportPPTX] 导出失败', err)
          rejectExport(err)
        })
      }
    }, 200)
    return exportPromise
  }

  // 暴露导出状态和导出方法给调用方。
  return {
    // 导出中状态。
    exporting,
    // 图片导出。
    exportImage,
    // 图片版 PPTX 导出。
    exportImagePPTX,
    // JSON 导出。
    exportJSON,
    // PPTist 私有文件导出。
    exportSpecificFile,
    // 可编辑 PPTX 导出。
    exportPPTX,
  }
}
