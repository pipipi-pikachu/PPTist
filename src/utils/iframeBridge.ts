import type { Slide, SlideTheme } from '@/types/slides'
import type { AIPPTSlide } from '@/types/AIPPT'
import { ref } from 'vue'
import axios from '@/services/axios'
import api from '@/services'
import useImport from '@/hooks/useImport'
import useExport from '@/hooks/useExport'
import { generateAIPPTSlides, type AIPPTImagePoolItem } from '@/utils/aippt/generateAIPPTSlides'
import { getParentTokenHeaders, initParentTokenFromUrl } from '@/utils/parentToken'

const SERVER_URL ='https://localhost:8802'  // window.location.origin // 'https://localhost:8803/'


const IFRAME_BRIDGE_LOG_PREFIX = '[PPTist iframeBridge]'

/**
 * 当前编辑器是否已经被父项目以业务 iframe 方式接管使用。
 *
 * 功能说明：
 * - 默认值必须是 false，因为当前项目也可以作为独立页面打开，此时不应该展示“返回父项目”的按钮。
 * - 只有收到父项目下发的 PREVIEW_PPT 或 GENERATE_AIPPT_SLIDES 业务消息后才置为 true，表示当前页面已经进入父项目嵌入使用链路。
 * - 该状态使用 Vue ref 导出，EditorHeader 等组件引用后可以自动响应消息变化，不需要额外事件总线或 Pinia 字段。
 *
 * 边界说明：
 * - 单纯运行在 iframe 中不等于父项目业务嵌入，例如本地调试、第三方预览或测试容器也可能使用 iframe。
 * - READY 是子项目主动发给父项目的消息，不能证明父项目真的把当前页面作为业务页面使用，所以不会在 READY 阶段置为 true。
 * - 一旦收到父项目业务消息，本次页面生命周期内保持 true；关闭或刷新页面后会恢复默认 false。
 */
export const isIframeBridgeParentMode = ref(false)

/** iframe -> 主项目的消息类型。 */
export const AI_PPT_IFRAME_IN_EVENTS = {
  READY: 'AI_PPT_IFRAME_READY',
  PPT_SAVED: 'AI_PPT_SAVED',
  CLOSE: 'AI_PPT_IFRAME_CLOSE',
} as const

/** 主项目 -> iframe 的消息类型。 */
export const AI_PPT_IFRAME_OUT_EVENTS = {
  PREVIEW_PPT: 'AI_PPT_PREVIEW_PPT',
  GENERATE_AIPPT_SLIDES: 'PPTIST_GENERATE_AIPPT_SLIDES',
} as const

/** postMessage 的统一消息结构，对齐父项目 aiPptIframe.ts。 */
interface AiPptIframeMessage<TPayload = any> {
  type: string
  payload: TPayload
  source?: string
}

declare global {
  interface Window {
    /** 本地联调用：直接触发 AI PPT 生成、导出和保存。 */
    mockGenerateAiPptSlides?: (payload?: Partial<AiPptGeneratePayload>) => Promise<AiPptSavedPayload>
    mockPreviewPptx?: (payload?: Partial<AiPptPreviewPayload>) => Promise<void>
  }
}

type AiPptLogId = string | number

/** 通知 iframe 预览 PPT 的参数，对齐父项目 aiPptIframe.ts。 */
interface AiPptPreviewPayload {
  id?: AiPptLogId
  path?: string
  url?: string
  [key: string]: any
}

/** 通知 iframe 生成 PPT 的参数，对齐父项目 aiPptIframe.ts，其他字段用于当前 iframe 套版。 */
interface AiPptGeneratePayload {
  logId: AiPptLogId
  /** 父项目传入的 AI 页面内容：线上链路通常传 JSON 字符串，本地联调也兼容已经解析好的页面数组。 */
  content?: string | AIPPTSlide[]
  templateSlides?: Slide[]
  templateId?: AiPptLogId
  imgs?: AIPPTImagePoolItem[]
  theme?: Partial<SlideTheme>
  title?: string
  viewportRatio?: number
  append?: boolean
  [key: string]: any
}

/** iframe 保存 PPT 到后台后返回的文件信息。 */
interface AiPptFileInfo {
  attaId?: AiPptLogId
  id?: AiPptLogId
  url?: string
  path?: string
  name?: string
  fileName?: string
  fileUrl?: string
  [key: string]: any
}

/** iframe 通知 PPT 已保存时返回的数据，对齐父项目 aiPptIframe.ts。 */
interface AiPptSavedPayload {
  logId: AiPptLogId
  file: AiPptFileInfo
  [key: string]: any
}

/** iframe 请求父项目关闭当前 PPT 编辑窗口时携带的数据。 */
interface AiPptClosePayload {
  /** 是否关闭：固定使用 true，便于父项目做布尔判断并兼容后续扩展字段。 */
  close: boolean
  /** 触发关闭的来源：当前只表示用户点击编辑器头部返回按钮。 */
  reason: 'user_click_back'
  /** 关闭消息触发时间：用于父项目排查多次点击、延迟消息或跨窗口通信顺序问题。 */
  timestamp: number
  [key: string]: any
}

/** iframe 桥接卸载函数。 */
export type DisposeIframeBridge = () => void

/**
 * 向父项目发送消息。
 *
 * @param type - 消息类型。
 * @param payload - 业务数据。
 */
const postToParent = (type: string, payload?: unknown) => {
  if (window.parent === window) return

  const parentOrigin = new URLSearchParams(window.location.search).get('parentOrigin') || '*'
  const message: AiPptIframeMessage = {
    type,
    payload: payload ?? {},
    source: 'pptist-iframe',
  }

  window.parent.postMessage(message, parentOrigin)
}

/**
 * 读取父项目消息业务数据。
 *
 * @param message - 父项目消息。
 * @returns 消息业务数据。
 */
const getMessagePayload = (message: AiPptIframeMessage) => {
  return message.payload ?? {}
}

/**
 * 从文件地址中推断文件名。
 *
 * @param url - 文件 URL 或路径。
 * @returns 文件名，无法推断时返回默认名称。
 */
const getFileNameFromUrl = (url: string) => {
  const cleanUrl = url.split(/[?#]/)[0]
  const fileName = cleanUrl.split('/').filter(Boolean).pop()
  return fileName || 'preview.pptx'
}

/**
 * 下载 PPTX 并包装为 File，复用现有导入逻辑。
 *
 * @param url - PPTX 地址。
 * @param fileName - 文件名。
 * @returns PPTX File 对象。
 * @throws 下载失败时抛错。
 */
const downloadPPTXFile = async (url: string, fileName: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: getParentTokenHeaders(),
  })

  if (!response.ok) throw new Error(`下载 PPTX 文件失败：HTTP ${response.status}`)

  const blob = await response.blob()

  return new File([blob], fileName, {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  })
}

/**
 * 导入 PPTX 文件并等待导入完成。
 *
 * @param file - PPTX 文件。
 * @returns 导入完成 Promise。
 */
const importPPTXFileAndWait = (file: File) => {
  const { importPPTXFile } = useImport()

  return new Promise<void>((resolve, reject) => {
    importPPTXFile([file], {
      cover: true,
      fixedViewport: true,
      onComplete: resolve,
      onError: () => reject(new Error('无法正确读取 / 解析该 PPTX 文件')),
    })
  })
}

/**
 * 处理父项目 PPTX 预览消息。
 *
 * @param payload - 预览载荷。
 */
const handlePreviewPPT = async (payload: AiPptPreviewPayload): Promise<void> => {
  if (!payload.url) throw new Error('文件地址不能为空')
  
  // 尝试获取文件名，此处理论上，父级传入是最合适的 
  const name = payload.name ?? payload.fileName ?? getFileNameFromUrl(payload.url)
  // 下载文件
  const file = await downloadPPTXFile(payload.url, name)

  // 将文件导入
  await importPPTXFileAndWait(file)
}

/**
 * 获取 AI 套版模板。
 *
 * @param payload - AI 套版载荷。
 * @returns 模板 slides 和主题。
 */
const getGenerateTemplate = async (payload: AiPptGeneratePayload): Promise<{ slides: Slide[]; theme?: Partial<SlideTheme> }> => {
  const templateSlides = payload.templateSlides
  const theme = payload.theme

  if (templateSlides?.length) return { slides: templateSlides, theme }

  const templateId = String(payload.templateId || 'template_1')
  const template = await api.getMockData(templateId) as { slides?: Slide[]; theme?: Partial<SlideTheme> }

  if (!Array.isArray(template.slides)) throw new Error(`默认模板 ${templateId} 缺少 slides 数组`)

  return { slides: template.slides, theme: theme || template.theme }
}

/**
 * 将生成的 slides 导出为 PPTX 文件。
 *
 * @param slides - 生成后的 PPTist slides。
 * @param fileName - PPTX 文件名。
 * @returns PPTX File 对象。
 */
const createPptxFile = async (slides: Slide[], fileName: string) => {
  const { exportPPTX } = useExport()

  console.info(IFRAME_BRIDGE_LOG_PREFIX, 'createPptxFile:start', {
    fileName,
    slidesCount: slides.length,
  })

  const file = await exportPPTX(slides, false, true, {
    download: false,
    fileName,
  })

  if (!(file instanceof File)) throw new Error('生成 PPTX 文件失败')

  console.info(IFRAME_BRIDGE_LOG_PREFIX, 'createPptxFile:done', {
    fileName: file.name,
    fileSize: file.size,
  })

  return file
}

/**
 * 从 iframe URL 参数读取上传鉴权 token。
 *
 * @returns URL 中的 token；没有时返回空字符串。
 */
const getUploadTokenFromUrl = () => {
  const params = new URLSearchParams(window.location.search)

  return params.get('parentToken') || params.get('token') || params.get('access_token') || params.get('authorization') || ''
}

/**
 * 保存 PPTX 文件到后端。
 *
 * @param file - 待上传的 PPTX 文件。
 * @returns 后端返回的文件信息。
 */
const uploadPptxFile = async (file: File): Promise<AiPptFileInfo> => {
  const formData = new FormData()
  const token = getUploadTokenFromUrl()

  formData.append('files', file)

  console.info(IFRAME_BRIDGE_LOG_PREFIX, 'uploadPptxFile:start', {
    fileName: file.name,
    fileSize: file.size,
    hasToken: !!token,
  })

  const result = await axios.post(`${SERVER_URL}/iccServer/file/upload`, formData, {
    timeout: 1000 * 60 * 5,
    headers: token ? {
      Authorization: `Bearer ${token.replace(/^Bearer\s+/i, '')}`,
    } : undefined,
  }) as any

  if (result?.code + '' !== '200') throw new Error('保存 PPTX 文件失败')

  const fileInfo = Array.isArray(result.data) ? result.data[0] : result.data

  if (!fileInfo) throw new Error('保存 PPTX 文件失败：接口未返回文件信息')

  console.info(IFRAME_BRIDGE_LOG_PREFIX, 'uploadPptxFile:done', {
    code: result?.code,
    attaId: fileInfo.attaId,
    name: fileInfo.name,
    url: fileInfo.url,
  })
  
  /*
    {
      "name": "AI PPT 联调测试.pptx",
      "url": "upload/2026/05/19/d673d73f-ad14-4e11-a8ae-c012a4b400e8.pptx",
      "size": 452,
      "path": "upload/2026/05/19/d673d73f-ad14-4e11-a8ae-c012a4b400e8.pptx",
      "extension": "pptx",
      "attaId": 54531
    }
  */ 
  return {
    ...fileInfo,
    id: fileInfo.attaId,
    url: fileInfo.url,
    path: fileInfo.path,
    name: fileInfo.name,
    fileName: fileInfo.name,
    fileUrl: fileInfo.url,
  }
}

/**
 * 根据父项目 AI 数据生成 PPTX 并保存到后端。
 *
 * @param payload - AI 套版载荷。
 * @returns AI_PPT_SAVED 回包载荷。
 */
const handleGenerateAIPPTSlides = async (payload: AiPptGeneratePayload): Promise<AiPptSavedPayload> => {
  /*
    payload 是父项目通过 postMessage 传入的 AI PPT 生成参数，对应消息类型：
    PPTIST_GENERATE_AIPPT_SLIDES。

    必填字段：
    - logId：父项目生成任务的唯一标识。iframe 生成、导出、上传完成后，会原样放到AI_PPT_SAVED 回包里，方便父项目把保存结果关联回对应任务。

    内容字段：
    - content：AI 生成的结构化页面数组，会直接传给 generateAIPPTSlides() 作为 aiSlides 使用。
    - templateSlides：PPTist 模板页面数据。父项目直接传 templateSlides 时优先使用它。
    - imgs：AI 内容里引用的图片池，只从 payload.imgs 读取。
    - theme：模板主题配置，只从 payload.theme 读取。

    模板字段：
    - templateId：当父项目没有直接传 templateSlides 时，用 templateId 去读取本地 mock 模板；
      不传时默认使用 template_1。

    文件字段：
    - title：导出 PPTX 的文件名来源，不传时使用“AI生成PPT”。如果 title 没有 .pptx 后缀，会自动补上。

    返回结果：
    - 成功后返回 AI_PPT_SAVED payload，包含 logId、上传后的 file 信息和 slideCount。
    - file 信息来自后端上传接口，当前固定按 name、url、path、attaId 等字段处理。
  */
  // 必须判断logId 若没有记录id,无法触发父页面的回调
  if (!payload.logId) throw new Error('PPTIST_GENERATE_AIPPT_SLIDES payload.logId 不能为空')
  /*
    content 是套版生成的核心页面数据：
    - 父项目联调时通常通过 postMessage 传入 JSON 字符串，必须先 JSON.parse 后才能交给 generateAIPPTSlides。
    - 本地 mock 或后续直接调用函数时可能传入已经解析好的数组，这里直接复用数组，避免重复 JSON.parse 导致报错。
    - content 为空时无法生成任何有效 PPT 页面，因此提前抛出明确错误，避免后续模板逻辑拿到空数据后产生难排查的异常。
  */
  let content: AIPPTSlide[] = []
  try {
    if (!payload.content) throw new Error('content 不能为空')
    content = typeof payload.content === 'string' ? JSON.parse(payload.content) : payload.content
  }
  catch (error) {
    console.error(IFRAME_BRIDGE_LOG_PREFIX, 'parseContent:error', {
      logId: payload.logId,
      contentType: typeof payload.content,
      error,
    })
    throw new Error('用于生成pptx的内容格式有误：' +content)
  }
  console.info(IFRAME_BRIDGE_LOG_PREFIX, 'parseContent:done', {
    logId: payload.logId,
    contentCount: content.length,
  })
  
  // 获取模版
  const template = await getGenerateTemplate(payload)
  console.info(IFRAME_BRIDGE_LOG_PREFIX, 'getTemplate:done', {
    logId: payload.logId,
    templateSlidesCount: template.slides.length,
  })

  const result = generateAIPPTSlides({
    templateSlides: template.slides,
    aiSlides: content,
    imgs: payload.imgs || [],
    transitionIndex: 0,
    transitionTemplate: null,
  })
  console.info(IFRAME_BRIDGE_LOG_PREFIX, 'generateSlides:done', {
    logId: payload.logId,
    generatedSlidesCount: result.generatedSlides.length,
  })

  // title理论上，确实应该是父级传入
  const title = payload.title || 'AI生成PPT'
  const fileName = title.endsWith('.pptx') ? title : `${title}.pptx`
  const file = await createPptxFile(result.generatedSlides, fileName)
  const fileInfo = await uploadPptxFile(file)

  return {
    logId: payload.logId,
    file: fileInfo,
    slideCount: result.generatedSlides.length, // pptx 页数
  }
}

/**
 * 创建本地联调用的 AI PPT 生成载荷。
 *
 * @param payload - 可覆盖默认字段的局部载荷。
 * @returns 可直接传给 handleGenerateAIPPTSlides 的测试载荷。
 */
const createMockGeneratePayload = (payload?: Partial<AiPptGeneratePayload>): AiPptGeneratePayload => {
  const defaultPayload: AiPptGeneratePayload = {
    logId: `mock-log-${Date.now()}`,
    title: 'AI PPT 联调测试',
    templateId: 'template_1',
    content: [
      {
        type: 'cover',
        data: {
          title: 'AI PPT 联调测试',
          text: '用于验证 iframe 生成 PPTX、上传保存、回传 AI_PPT_SAVED 的完整链路',
        },
      },
      {
        type: 'contents',
        data: {
          items: ['生成 PPTist 页面', '导出 PPTX 文件', '上传保存并回传'],
        },
      },
      {
        type: 'transition',
        data: {
          title: '第一部分',
          text: '生成与导出',
        },
      },
      {
        type: 'content',
        data: {
          title: '生成 PPTist 页面',
          items: [
            {
              title: '接收数据',
              text: '读取 logId、模板、AI 页面和图片池等输入字段。',
            },
            {
              title: '套版生成',
              text: '调用 generateAIPPTSlides 将结构化内容转换为 PPTist slides。',
            },
            {
              title: '保持隔离',
              text: '生成过程中不写 slidesStore，避免多个任务互相覆盖编辑器状态。',
            },
          ],
        },
      },
      {
        type: 'content',
        data: {
          title: '上传保存并回传',
          items: [
            {
              title: '导出文件',
              text: '通过 exportPPTX 的非下载模式生成浏览器 File 对象。',
            },
            {
              title: '保存后端',
              text: '使用 FormData 的 files 字段上传到 /file/upload。',
            },
            {
              title: '通知父页面',
              text: '保存成功后回传 AI_PPT_SAVED，payload 中包含 logId 和 file。',
            },
          ],
        },
      },
      {
        type: 'end',
      },
    ],
  }

  return {
    ...defaultPayload,
    ...payload,
  }
}

const createMockPreviewPayload = (payload?: Partial<AiPptPreviewPayload>): AiPptPreviewPayload => {
  return {
    logId: `mock-preview-${Date.now()}`,
    id: 54531,
    name: 'AI PPT 联调测试.pptx',
    url: `${SERVER_URL}/upload/2026/05/19/d673d73f-ad14-4e11-a8ae-c012a4b400e8.pptx`,
    ...payload,
  }
}

/**
 * 安装本地联调方法。
 */
const installIframeBridgeDebugMethods = () => {
  if (typeof window === 'undefined') return

  window.mockGenerateAiPptSlides = payload => handleGenerateAIPPTSlides(createMockGeneratePayload(payload))
  window.mockPreviewPptx = payload => handlePreviewPPT(createMockPreviewPayload(payload))
}

/**
 * 分发父项目消息并回包。
 *
 * @param message - 父项目 postMessage 数据。
 */
const handleIframeMessage = async (message: AiPptIframeMessage) => {
  const type = message.type
  const payload = getMessagePayload(message)

  if (type === AI_PPT_IFRAME_OUT_EVENTS.PREVIEW_PPT) {
    // 收到父项目的 PPT 预览业务消息后，标记当前编辑器已经处于父项目嵌入使用模式。
    isIframeBridgeParentMode.value = true
    await handlePreviewPPT(payload as AiPptPreviewPayload)
  }
  else if (type === AI_PPT_IFRAME_OUT_EVENTS.GENERATE_AIPPT_SLIDES) {
    // 收到父项目的 AI 生成业务消息后，标记当前编辑器已经处于父项目嵌入使用模式。
    isIframeBridgeParentMode.value = true
    console.info(IFRAME_BRIDGE_LOG_PREFIX, 'message:generate-received', {
      logId: (payload as AiPptGeneratePayload).logId,
      hasContent: !!(payload as AiPptGeneratePayload).content,
      templateSlidesCount: (payload as AiPptGeneratePayload).templateSlides?.length || 0,
    })
    /*
      content: "{\"type\":\"cover\",\"data\":{\"title\":\"科技兴国：驱动国家发展的核心引擎\",\"text\":\"战略路径、关键领域与未来展望\"}}\n\n{\"type\":\"contents\",\"data\":{\"items\":[\"战略背景与时代使命\",\"核心领域布局与突破\",\"创新体系构建与人才支撑\",\"产业融合与数字化转型\",\"国际合作与开放生态\",\"实施路径与保障措施\"]}}\n\n{\"type\":\"content\",\"data\":{\"title\":\"战略背景与时代使命\",\"items\":[{\"title\":\"国际竞争格局变化\",\"text\":\"全球科技博弈加剧，核心技术成为大国竞争的战略制高点。\"},{\"title\":\"国家发展核心需求\",\"text\":\"突破发展瓶颈，实现高质量发展必须依靠科技原始创新。\"},{\"title\":\"科技自立自强意义\",\"text\":\"掌握关键核心技术，确保产业链供应链安全与国家战略自主。\"},{\"title\":\"历史机遇与挑战\",\"text\":\"新一轮科技革命窗口期稍纵即逝，需以时不我待的紧迫感破局。\"}]}}\n\n{\"type\":\"content\",\"data\":{\"title\":\"核心领域布局与突破\",\"items\":[{\"title\":\"人工智能与大数据\",\"text\":\"聚焦通用大模型与行业应用，打造数据驱动的智能决策新范式。\"},{\"title\":\"量子信息与通信\",\"text\":\"攻克量子计算与加密通信难题，构建未来信息安全与算力新基石。\"},{\"title\":\"生物技术与医药\",\"text\":\"突破基因编辑与合成生物学，引领生命健康领域原始创新。\"},{\"title\":\"新能源与绿色技术\",\"text\":\"加速氢能、储能技术迭代，支撑国家“双碳”目标与能源转型。\"}]}}\n\n{\"type\":\"content\",\"data\":{\"title\":\"创新体系构建与人才支撑\",\"items\":[{\"title\":\"新型举国体制优势\",\"text\":\"集中力量办大事，高效统筹国家战略科技力量攻克“卡脖子”技术。\"},{\"title\":\"企业创新主体地位\",\"text\":\"强化企业主导的产学研深度融合，激发市场主体创新活力。\"},{\"title\":\"高水平人才队伍建设\",\"text\":\"实施更加开放的人才政策，培养造就战略科学家与卓越工程师。\"},{\"title\":\"科研评价机制改革\",\"text\":\"破除“唯论文”导向，建立以创新价值、能力、贡献为核心的评价体系。\"}]}}\n\n{\"type\":\"content\",\"data\":{\"title\":\"产业融合与数字化转型\",\"items\":[{\"title\":\"传统产业升级路径\",\"text\":\"利用数字技术重塑生产流程，推动制造业向高端化、智能化迈进。\"},{\"title\":\"数字经济新业态\",\"text\":\"培育平台经济与共享经济新模式，释放数据要素乘数效应。\"},{\"title\":\"智能制造与工业互联网\",\"text\":\"构建全链条工业互联网平台，实现生产要素的实时互联与协同优化。\"},{\"title\":\"数字社会建设\",\"text\":\"推进智慧政务与数字民生，提升社会治理现代化与服务效能。\"}]}}\n\n{\"type\":\"content\",\"data\":{\"title\":\"国际合作与开放生态\",\"items\":[{\"title\":\"全球科技合作网络\",\"text\":\"深化多边与双边合作，构建互利共赢的国际大科学计划。\"},{\"title\":\"国际标准制定参与\",\"text\":\"主动参与国际标准制定，提升我国在关键技术领域的话语权。\"},{\"title\":\"跨境创新资源流动\",\"text\":\"畅通人才、技术、资本跨境流动，打造全球创新资源集聚高地。\"},{\"title\":\"构建开放创新生态\",\"text\":\"坚持开放包容，在自主可控基础上融入全球创新链条。\"}]}}\n\n{\"type\":\"content\",\"data\":{\"title\":\"实施路径与保障措施\",\"items\":[{\"title\":\"顶层设计与规划\",\"text\":\"绘制科技发展路线图，明确阶段性目标与重点突破任务。\"},{\"title\":\"资金投入与政策扶持\",\"text\":\"建立多元化投入机制，加大基础研究经费与税收优惠支持力度。\"},{\"title\":\"法律法规与伦理规范\",\"text\":\"完善科技立法，强化科技伦理治理，确保技术向善发展。\"},{\"title\":\"监测评估与动态调整\",\"text\":\"建立全周期监测评估机制，动态优化政策工具与实施策略。\"}]}}\n\n{\"type\":\"end\"}"
      logId: 30783
    */ 
    const savedPayload = await handleGenerateAIPPTSlides(payload as AiPptGeneratePayload)

    console.info(IFRAME_BRIDGE_LOG_PREFIX, 'message:post-saved', {
      logId: savedPayload.logId,
      fileId: savedPayload.file?.id,
      slideCount: savedPayload.slideCount,
    })
    // 
    postToParent(AI_PPT_IFRAME_IN_EVENTS.PPT_SAVED, savedPayload)
  }
}

/**
 * 通知父项目 iframe 已准备就绪。
 */
export const notifyIframeBridgeReady = () => {
  const token = initParentTokenFromUrl()

  postToParent(AI_PPT_IFRAME_IN_EVENTS.READY, {
    ready: true,
    hasParentToken: !!token,
  })
}

/**
 * 通知父项目关闭当前 iframe。
 *
 * @remarks
 * - 当前函数只负责向父窗口发送关闭意图，不直接关闭浏览器窗口，也不修改编辑器本地状态。
 * - 当页面不在 iframe 中运行时，postToParent 内部会直接返回，因此本地开发点击按钮不会抛错。
 * - 父项目需要监听 AI_PPT_IFRAME_CLOSE，并在父项目上下文中执行关闭弹窗、销毁 iframe 或路由返回。
 */
export const notifyIframeBridgeClose = () => {
  const payload: AiPptClosePayload = {
    close: true,
    reason: 'user_click_back',
    timestamp: Date.now(),
  }

  postToParent(AI_PPT_IFRAME_IN_EVENTS.CLOSE, payload)
}

/**
 * 安装 iframe 消息监听。
 *
 * @returns 卸载监听函数。
 */
export const installIframeBridge = (): DisposeIframeBridge => {
  initParentTokenFromUrl()

  const handleMessage = (event: MessageEvent) => {
    if (!event.data || typeof event.data !== 'object') return

    const message = event.data as AiPptIframeMessage

    if (!message.type) return

    ;(async () => {
      try {
        await handleIframeMessage(message)
      }
      catch (error) {
        console.error(IFRAME_BRIDGE_LOG_PREFIX, 'message:handle-error', {
          type: message.type,
          error,
        })
        // 父项目参考协议没有错误事件，这里只阻止异常冒泡影响全局 message 监听。
      }
    })()
  }

  window.addEventListener('message', handleMessage)

  return () => {
    window.removeEventListener('message', handleMessage)
  }
}

installIframeBridgeDebugMethods()
