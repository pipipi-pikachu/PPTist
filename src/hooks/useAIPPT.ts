import { ref } from 'vue'
import type { Slide } from '@/types/slides'
import type { AIPPTSlide } from '@/types/AIPPT'
import { useSlidesStore } from '@/store'
import { generateAIPPTSlides, type AIPPTImagePoolItem } from '@/utils/aippt/generateAIPPTSlides'
import useAddSlidesOrElements from './useAddSlidesOrElements'
import useSlideHandler from './useSlideHandler'

/**
 * AI PPT 套版 hook 调试日志前缀。
 *
 * 功能描述：
 * - 统一 `useAIPPT()` 中图片池、套版生成和 slides 写入的调试输出。
 * - 方便验证 AI 数据是否真正进入 PPTist 页面生成逻辑。
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
 * - 日志只打印数量和标题摘要，不打印完整 Slide 数据，避免控制台输出过大。
 */
const USE_AIPPT_DEBUG_PREFIX = '[PPTist useAIPPT]'

/**
 * 提供 AI PPT 内容套版能力。
 *
 * @returns AI PPT 生成相关方法，包括预设图片池、执行套版和提取 markdown 内容。
 * @throws 当前组合式函数不主动抛错；模板缺失、DOMParser/canvas 不可用等情况沿用运行时行为。
 * @remarks
 * - 该 hook 现在只负责维护生成过程状态，以及把纯函数生成结果写入当前文稿。
 * - 具体套版逻辑已经抽离到 `generateAIPPTSlides()`，便于其他纯前端流程复用。
 * - 生成结果会根据当前文稿是否为空白页决定替换当前文稿或追加到现有文稿。
 */
export default () => {
  // 幻灯片 store，用于切换页面和写入生成结果。
  const slidesStore = useSlidesStore()
  // 追加页面能力，用于当前文稿已有内容时追加 AI 生成页面。
  const { addSlidesFromData } = useAddSlidesOrElements()
  // 判断当前文稿是否为空白页。
  const { isEmptySlide } = useSlideHandler()

  // 可用图片池；图片被使用后会根据纯函数返回值回写，减少重复。
  const imgPool = ref<AIPPTImagePoolItem[]>([])
  // 过渡页序号，用于章节页 partNumber 文本。
  const transitionIndex = ref(0)
  // 本次生成固定使用的过渡页模板，保证章节过渡页风格一致。
  const transitionTemplate = ref<Slide | null>(null)

  /**
   * 从 AI 返回内容中提取 markdown 正文。
   *
   * @param content - AI 原始返回文本。
   * @returns 去掉 ```markdown 代码围栏后的内容。
   * @throws 当前函数不主动抛错。
   * @remarks 兼容完整 fenced markdown 和只有部分围栏标记的返回格式。
   */
  const getMdContent = (content: string) => {
    // 匹配 ```markdown ... ``` 包裹的内容。
    const regex = /```markdown([^```]*)```/
    // 尝试提取代码块。
    const match = content.match(regex)
    // 完整命中时返回代码块内部文本。
    if (match) return match[1].trim()
    // 未完整命中时移除可能残留的围栏标记。
    return content.replace('```markdown', '').replace('```', '')
  }

  /**
   * 预设 AI PPT 可用图片池。
   *
   * @param imgs - 可供模板图片占位替换的图片列表。
   * @returns 无显式返回值。
   * @throws 当前函数不主动抛错。
   * @remarks 调用方可先注入图片池，再调用 AIPPT 生成页面。
   */
  const presetImgPool = (imgs: AIPPTImagePoolItem[]) => {
    // 覆盖当前图片池。
    imgPool.value = imgs
    // 打印图片池预置数量，验证配图输入是否进入套版逻辑。
    console.info(USE_AIPPT_DEBUG_PREFIX, 'presetImgPool()', {
      // 图片数量。
      imgsCount: imgs.length,
    })
  }

  /**
   * 将 AI 生成的结构化页面套入 PPTist 模板并写入当前文稿。
   *
   * @param templateSlides - 可用模板页列表，按 slide.type 区分 cover、contents、transition、content、end。
   * @param aiSlides - AI 生成的结构化页面列表。
   * @param imgs - 可选图片池；传入后会覆盖当前 imgPool。
   * @returns 无显式返回值；会替换空白文稿或向当前文稿追加生成页面。
   * @throws 当前函数不主动抛错；模板分类为空、模板元素缺失等情况沿用运行时行为。
   * @remarks
   * - 为保持 `createPPT()` 现有行为，调用前仍会把当前页切到文稿最后一页。
   * - 纯套版函数不会写 store，因此这里负责把 `generatedSlides` 写入或追加到当前文稿。
   * - 纯套版函数返回的图片池和过渡页状态会回写到 ref，保证流式逐页调用时状态连续。
   */
  const AIPPT = (templateSlides: Slide[], aiSlides: AIPPTSlide[], imgs?: AIPPTImagePoolItem[]) => {
    // 打印套版入口摘要，确认最终生成流是否调用到了页面生成 hook。
    console.info(USE_AIPPT_DEBUG_PREFIX, 'AIPPT:start', {
      // 模板页数量。
      templateSlidesCount: templateSlides.length,
      // AI 页面数量。
      aiSlidesCount: aiSlides.length,
      // AI 页面标题摘要。
      aiSlideTitles: aiSlides.map(slide => 'data' in slide && 'title' in slide.data ? slide.data.title : '').filter(Boolean),
      // 当前 store 页面数量。
      currentSlidesCount: slidesStore.slides.length,
      // 调用方是否传入新图片池。
      hasIncomingImgs: !!imgs,
      // 当前图片池数量。
      imgPoolCount: imgPool.value.length,
      // 当前章节过渡索引。
      transitionIndex: transitionIndex.value,
    })
    // 先切到当前文稿最后一页，追加生成结果时位置更符合用户预期。
    slidesStore.updateSlideIndex(slidesStore.slides.length - 1)

    // 如果调用方传入图片池，则覆盖当前图片池。
    if (imgs) imgPool.value = imgs

    // 调用纯前端套版函数生成幻灯片和最新状态。
    const result = generateAIPPTSlides({
      // 模板页面列表。
      templateSlides,
      // AI 结构化页面列表。
      aiSlides,
      // 当前图片池状态。
      imgs: imgPool.value,
      // 当前章节过渡页序号。
      transitionIndex: transitionIndex.value,
      // 当前固定过渡页模板。
      transitionTemplate: transitionTemplate.value,
    })
    // 打印纯函数生成结果摘要。
    console.info(USE_AIPPT_DEBUG_PREFIX, 'AIPPT:generated', {
      // 生成页面数量。
      generatedSlidesCount: result.generatedSlides.length,
      // 剩余图片数量。
      remainingImgsCount: result.remainingImgs.length,
      // 新的章节索引。
      transitionIndex: result.transitionIndex,
      // 是否已经固定过渡页模板。
      hasTransitionTemplate: !!result.transitionTemplate,
    })

    // 回写剩余图片池，避免后续流式页面重复使用已消费图片。
    imgPool.value = result.remainingImgs
    // 回写章节序号，保证下一次 AIPPT() 调用继续递增。
    transitionIndex.value = result.transitionIndex
    // 回写固定过渡页模板，保证本次生成过渡页风格一致。
    transitionTemplate.value = result.transitionTemplate

    // 当前文稿为空白页时直接替换文稿内容。
    if (isEmptySlide.value) {
      // 打印写入模式：替换空白文稿。
      console.info(USE_AIPPT_DEBUG_PREFIX, 'AIPPT:write mode setSlides', {
        // 写入页面数。
        generatedSlidesCount: result.generatedSlides.length,
      })
      // 空白文稿直接替换为生成结果。
      slidesStore.setSlides(result.generatedSlides)
    }
    // 当前文稿已有内容时追加 AI 生成页面。
    else {
      // 打印写入模式：追加到当前文稿。
      console.info(USE_AIPPT_DEBUG_PREFIX, 'AIPPT:write mode addSlidesFromData', {
        // 追加页面数。
        generatedSlidesCount: result.generatedSlides.length,
        // 追加前页面数。
        beforeSlidesCount: slidesStore.slides.length,
      })
      // 追加生成结果。
      addSlidesFromData(result.generatedSlides)
    }
    // 打印写入后页面数量。
    console.info(USE_AIPPT_DEBUG_PREFIX, 'AIPPT:done', {
      // 当前 store 页面数量。
      slidesCount: slidesStore.slides.length,
    })
  }

  // 暴露 AI PPT 生成相关方法。
  return {
    // 预设图片池。
    presetImgPool,
    // 执行 AI PPT 套版生成。
    AIPPT,
    // 提取 markdown 内容。
    getMdContent,
  }
}
