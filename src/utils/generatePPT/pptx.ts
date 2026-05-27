import useExport from './exportPPTX'
import { generateAIPPTSlides, type AIPPTImagePoolItem as ProjectAIPPTImagePoolItem } from './generateAIPPTSlides'
import type { AIPPTSlide as ProjectAIPPTSlide } from './AIPPT'
import type { Slide, SlideTheme } from './slides'
import type { AIPPTImagePoolItem, AIPPTSlide, GeneratedPPTXFile } from './types'
import { getImageSource, normalizePptxFileName } from './helpers'

/**
 * 将宽松图片池转换成原 AIPPT 套版函数需要的严格图片池。
 *
 * @param imgs - 父项目或测试页传入的图片池。
 * @returns 可交给本目录 `generateAIPPTSlides()` 使用的图片池。
 */
const normalizeImagePool = (imgs: AIPPTImagePoolItem[]): ProjectAIPPTImagePoolItem[] => {
  /**
   * 遍历图片池并规范化字段。
   *
   * 循环变量说明：
   * - item 是父项目传入的原始图片对象，可能只有 src/url/path。
   * - index 用于生成稳定兜底 ID，避免图片使用后无法从池中移除。
   */
  return imgs.map((item, index) => {
    /**
     * imageRecord 是宽松对象视图。
     *
     * 容错说明：
     * - width / height 可能不存在或不是数字。
     * - src 可能使用 url、fileUrl、path 等字段名。
     */
    const imageRecord = item as Record<string, unknown>

    /**
     * src 是套版函数真正使用的图片地址。
     *
     * 说明：
     * - getImageSource 会按 src -> url -> fileUrl -> path 顺序取第一个有效值。
     * - 没有图片地址时保留空字符串，后续过滤掉，避免生成无效图片元素。
     */
    const src = getImageSource(item)

    /**
     * width / height 是图片宽高。
     *
     * 边界说明：
     * - 原套版逻辑会用宽高判断横图、竖图或方图。
     * - 父项目没传尺寸时按 1:1 兜底，至少能稳定参与候选图片筛选。
     */
    const width = typeof imageRecord.width === 'number' && imageRecord.width > 0 ? imageRecord.width : 1
    const height = typeof imageRecord.height === 'number' && imageRecord.height > 0 ? imageRecord.height : 1

    /**
     * id 是图片池内唯一标识。
     *
     * 说明：
     * - 原套版逻辑使用 id 移除已消费图片，避免同一图片重复使用。
     * - 父项目没传 id 时使用下标生成兜底值。
     */
    const id = typeof imageRecord.id === 'string' && imageRecord.id.trim()
      ? imageRecord.id.trim()
      : `generate-ppt-image-${index}`

    return {
      id,
      src,
      width,
      height,
    }
  }).filter(item => !!item.src)
}

/**
 * 使用项目现有 AI 套版流程和导出流程生成 PPTX File。
 *
 * @param aiSlides - 规范化后的 AI 页面数组。
 * @param options - 文件名、模板页和图片池等生成选项。
 * @returns PPTX File 和实际生成页数。
 */
export const createAIPPTFile = async (
  aiSlides: AIPPTSlide[],
  options: {
    fileName?: unknown
    templateId?: string
    templateSlides?: unknown[]
    template?: {
      width?: number
      height?: number
      theme?: unknown
    }
    theme?: unknown
    imgs?: AIPPTImagePoolItem[]
  } = {}
): Promise<GeneratedPPTXFile> => {
  /**
   * templateSlides 是 PPTist 原项目模板 JSON 中的 slides 数组。
   *
   * 重要说明：
   * - 当前函数不再自己用 pptxgenjs 重新画一套页面。
   * - 必须把模板页交给项目现有 `generateAIPPTSlides()`，让它按 PPTist 的模板占位规则完成套版。
   * - 模板为空时继续执行会导致随机取模板或占位替换阶段出现难排查异常，因此提前抛出明确错误。
   */
  const templateSlides = Array.isArray(options.templateSlides) ? options.templateSlides as Slide[] : []
  if (!templateSlides.length) throw new Error('模板 JSON 缺少 slides 数组，无法按现有 PPTist 套版流程生成 PPTX')

  /**
   * fileName 是最终 PPTX 文件名。
   *
   * 边界说明：
   * - 调用方可以传标题或完整文件名。
   * - normalizePptxFileName 会补齐 `.pptx` 后缀并清理明显非法字符。
   */
  const fileName = normalizePptxFileName(options.fileName)

  /**
   * imgs 是项目现有 AIPPT 图片池。
   *
   * 兼容说明：
   * - 项目原始类型要求 id、src、width、height。
   * - 父项目如果不需要图片，传空数组即可，现有套版逻辑会保留模板原图或跳过替换。
   * - 这里做类型转换是为了让 generatePPT 本地 payload 类型保持宽松，同时复用现有严格流程。
   */
  const imgs = Array.isArray(options.imgs) ? normalizeImagePool(options.imgs) : []

  /**
   * result 是本目录内复制的 AI 套版结果。
   *
   * 流程来源：
   * - 该函数已经复制到 `src/utils/generatePPT/generateAIPPTSlides.ts`，不会在运行时引用原目录方法。
   * - 它会按 slide.type 从模板中选择 cover、contents、transition、content、end 等页面。
   * - 它会替换模板中的 title、content、item、itemNumber、图片占位等元素。
   */
  const result = generateAIPPTSlides({
    templateSlides,
    aiSlides: aiSlides as ProjectAIPPTSlide[],
    imgs,
    transitionIndex: 0,
    transitionTemplate: null,
  })

  /**
   * exportPPTX 是复制到本目录内的 PPTist -> PPTX 导出流程。
   *
   * 参数说明：
   * - masterOverwrite: false，保持页面自身背景和元素。
   * - ignoreMedia: true，与 iframeBridge 里现有生成链路保持一致，避免音视频等媒体拖慢或影响导出。
   * - download: false，表示不触发浏览器下载，而是返回 File 对象给上传逻辑或测试页下载链接使用。
   */
  /**
   * templateWidth 和 templateHeight 保存模板 JSON 的画布尺寸。
   *
   * 边界说明：
   * - PPTist 模板通常是 1000 x 562.5。
   * - 如果模板没有提供宽高，按 16:9 默认值兜底，确保比例计算稳定。
   */
  const templateWidth = typeof options.template?.width === 'number' && options.template.width > 0 ? options.template.width : 1000
  const templateHeight = typeof options.template?.height === 'number' && options.template.height > 0 ? options.template.height : 562.5

  /**
   * exportTheme 是导出流程使用的主题。
   *
   * 说明：
   * - 优先使用生成链路合并后的 theme。
   * - 没有 theme 时使用模板自身 theme。
   * - 再没有时使用足够完整的默认主题，避免 masterOverwrite 或导出 JSON 分支访问空字段。
   */
  const exportTheme = (options.theme || options.template?.theme || {
    backgroundColor: '#ffffff',
    themeColors: ['#2563EB'],
    fontColor: '#1F2937',
    fontName: 'Microsoft YaHei',
    outline: {
      width: 1,
      color: '#d1d5db',
      style: 'solid',
    },
    shadow: {
      h: 0,
      v: 0,
      blur: 0,
      color: '#000000',
    },
  }) as SlideTheme

  /**
   * exportPPTX 来自 generatePPT 目录内复制并改造后的导出实现。
   *
   * 重要说明：
   * - 它不读取外部 Pinia store。
   * - 它只使用当前函数传入的临时 slides、模板画布尺寸和主题。
   */
  const { exportPPTX } = useExport({
    title: fileName.replace(/\.pptx$/i, ''),
    theme: exportTheme,
    viewportRatio: templateHeight / templateWidth,
    viewportSize: templateWidth,
  })
  const file = await exportPPTX(result.generatedSlides, false, true, {
    download: false,
    fileName,
  })

  /**
   * File 返回值保护。
   *
   * 边界说明：
   * - 项目导出弹窗场景可能只触发下载并返回 void。
   * - 当前 generatePPT 链路必须拿到 File 才能上传或给测试页生成下载链接，因此这里强校验。
   */
  if (!(file instanceof File)) throw new Error('生成 PPTX 文件失败：项目导出流程未返回 File 对象')

  return {
    file,
    slideCount: result.generatedSlides.length,
  }
}
