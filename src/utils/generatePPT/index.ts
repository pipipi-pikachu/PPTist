import type { AiPptGeneratePayload, AiPptSavedPayload } from './types'
import { GENERATE_PPT_LOG_PREFIX } from './constants'
import { parseAIPPTSlides } from './parse'
import { createAIPPTFile } from './pptx'
import { resolveGeneratePPTTemplate } from './template'
import { uploadPPTXFile } from './upload'

export type {
  AIPPTContentItem,
  AIPPTImagePoolItem,
  AIPPTSlide,
  AiPptFileInfo,
  AiPptGeneratePayload,
  AiPptSavedPayload,
  GeneratePPTLogId,
  GeneratePPTTheme,
  GeneratePPTTemplate,
  GeneratePPTTemplateContext,
  GeneratedPPTXFile,
} from './types'

/**
 * 根据父项目 AI 数据生成 PPTX 并上传保存。
 *
 * @param payload - 父项目传入的 AI PPT 生成载荷。
 * @returns 可直接用于 AI_PPT_SAVED 消息的保存结果。
 */
export const handleGenerateAIPPTSlides = async (payload: AiPptGeneratePayload): Promise<AiPptSavedPayload> => {
  /**
   * payload 是父项目传入的完整任务载荷。
   *
   * 重要说明：
   * - 当前函数不读取、不修改 iframeBridge.ts，也不依赖编辑器 store。
   * - 所有生成、导出、上传逻辑都在 generatePPT 目录内闭环完成。
   */
  if (!payload || typeof payload !== 'object') throw new Error('PPTIST_GENERATE_AIPPT_SLIDES payload 不能为空')

  /**
   * logId 是父项目用于关联生成任务的唯一标识。
   *
   * 边界说明：
   * - 0 在数据库 ID 中不常见，但仍可能作为合法测试 ID，因此这里只拒绝 null、undefined 和空字符串。
   * - 没有 logId 时父项目无法把上传结果关联回任务，必须提前抛错。
   */
  if (payload.logId === null || payload.logId === undefined || payload.logId === '') {
    throw new Error('PPTIST_GENERATE_AIPPT_SLIDES payload.logId 不能为空')
  }

  console.info(GENERATE_PPT_LOG_PREFIX, 'handleGenerateAIPPTSlides:start', {
    logId: payload.logId,
    contentType: typeof payload.content,
    templateId: payload.templateId || 'template_1',
    hasTheme: !!payload.theme,
    imgsCount: Array.isArray(payload.imgs) ? payload.imgs.length : 0,
  })

  /**
   * templateContext 是本次生成使用的模板上下文。
   *
   * 读取规则：
   * - 父项目传入 templateSlides 时优先使用父项目数据。
   * - 未传 templateSlides 时按 `./mocks/${templateId || 'template_1'}.json` 读取模板 JSON。
   * - payload.theme 会覆盖模板 JSON 中的同名 theme 字段。
   */
  const templateContext = await resolveGeneratePPTTemplate(payload)

  console.info(GENERATE_PPT_LOG_PREFIX, 'resolveGeneratePPTTemplate:done', {
    logId: payload.logId,
    templateId: templateContext.templateId,
    templateSource: templateContext.source,
    templateSlidesCount: templateContext.slides.length,
    hasResolvedTheme: !!templateContext.theme,
  })

  /**
   * aiSlides 是规范化后的 AI 页面数组。
   *
   * 容错能力：
   * - 支持父项目直接传数组。
   * - 支持标准 JSON 数组字符串。
   * - 支持多个 JSON 对象连续拼接或 JSONL 字符串。
   */
  const aiSlides = parseAIPPTSlides(payload.content)

  console.info(GENERATE_PPT_LOG_PREFIX, 'parseAIPPTSlides:done', {
    logId: payload.logId,
    slideCount: aiSlides.length,
  })

  /**
   * generated 保存本次生成的 PPTX File 和页数。
   *
   * 设计说明：
   * - 文件生成不依赖 PPTist 现有导出 hook，满足“只在本文件夹新增自己的文件”的约束。
   * - 页数来自 aiSlides 长度，和实际 addSlide 次数一一对应。
   */
  const generated = await createAIPPTFile(aiSlides, {
    fileName: payload.title,
    theme: templateContext.theme,
    imgs: payload.imgs,
    templateId: templateContext.templateId,
    templateSlides: templateContext.slides,
    template: templateContext.template,
  })

  console.info(GENERATE_PPT_LOG_PREFIX, 'createAIPPTFile:done', {
    logId: payload.logId,
    fileName: generated.file.name,
    fileSize: generated.file.size,
    slideCount: generated.slideCount,
  })

  /**
   * fileInfo 是上传接口返回的文件信息。
   *
   * 边界说明：
   * - 上传地址默认使用本目录常量，也允许 payload.uploadUrl 覆盖。
   * - token 可从 payload 或当前 URL 查询参数读取。
   */
  const fileInfo = await uploadPPTXFile(generated.file, payload)

  console.info(GENERATE_PPT_LOG_PREFIX, 'uploadPPTXFile:done', {
    logId: payload.logId,
    fileId: fileInfo.id,
    fileName: fileInfo.fileName || fileInfo.name,
    fileUrl: fileInfo.fileUrl || fileInfo.url,
  })

  /**
   * 返回父项目需要的保存结果。
   *
   * 说明：
   * - logId 原样回传。
   * - file 保留后端原始字段并补齐兼容字段。
   * - slideCount 用于父项目展示、验收或日志排查。
   */
  return {
    logId: payload.logId,
    file: fileInfo,
    slideCount: generated.slideCount,
  }
}
