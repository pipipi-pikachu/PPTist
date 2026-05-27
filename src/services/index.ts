import axios from './axios'
import fetchRequest from './fetch'

// export const SERVER_URL = 'http://localhost:5000'
// 根据 Vite 当前运行模式选择服务端地址；开发环境走本地代理 `/api`，生产环境走线上 PPTist 服务。
export const SERVER_URL = (import.meta.env.MODE === 'development') ? '/api' : 'https://server.pptist.cn'

/**
 * Service 层调试日志前缀。
 *
 * 功能描述：
 * - 统一 services/index.ts 中业务接口封装的控制台输出。
 * - 便于从浏览器控制台确认 AI 大纲、AI PPT 和 AI 写作接口的入参摘要。
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
 * - 日志只输出 content 长度，不输出完整用户内容，避免敏感文案被控制台长期保留。
 */
const SERVICE_DEBUG_PREFIX = '[PPTist Services]'

/**
 * 图片搜索接口的请求参数。
 *
 * @property query - 搜索关键词，通常由用户在图片素材面板中输入。
 * @property orientation - 图片方向筛选条件；缺省时由服务端按默认规则处理。
 * @property locale - 搜索语言环境；用于影响关键词解析和返回结果语言。
 * @property order - 图片排序方式，例如热门优先或最新优先。
 * @property size - 图片尺寸筛选条件。
 * @property image_type - 图片类型筛选条件，例如照片、插画或矢量图。
 * @property page - 分页页码；边界条件由服务端决定，前端只透传。
 * @property per_page - 每页数量；过大时可能被服务端截断或拒绝。
 * @remarks 该类型只描述前端请求体，不代表服务端一定支持所有组合条件。
 */
interface ImageSearchPayload {
  query: string;
  orientation?: 'landscape' | 'portrait' | 'square' | 'all';
  locale?: 'zh' | 'en';
  order?: 'popular' | 'latest';
  size?: 'large' | 'medium' | 'small';
  image_type?: 'all' | 'photo' | 'illustration' | 'vector';
  page?: number;
  per_page?: number;
}

/**
 * AI 生成 PPT 大纲接口的请求参数。
 *
 * @property content - 用户输入的主题、文本材料或生成要求。
 * @property language - 期望输出语言，通常由界面选项传入。
 * @property model - 后端 AI 模型标识，具体可用值由服务端控制。
 * @remarks 该接口默认使用流式返回，调用方需要按 `fetchRequest()` 返回的 Response 读取流。
 */
interface AIPPTOutlinePayload {
  content: string
  language: string
  model: string
}

/**
 * AI 生成完整 PPT 接口的请求参数。
 *
 * @property content - 用户输入的 PPT 主题、材料或大纲内容。
 * @property language - 期望输出语言。
 * @property style - 期望生成的视觉风格或模板风格标识。
 * @property model - 后端 AI 模型标识。
 * @remarks 前端会补充 `stream: true`，因此调用方应按流式结果处理。
 */
interface AIPPTPayload {
  content: string
  language: string
  style: string
  model: string
}

/**
 * AI 写作接口的请求参数。
 *
 * @property content - 待改写、扩写、总结或处理的原始文本。
 * @property command - 写作指令，例如续写、润色、总结等。
 * @remarks 当前模型名称在接口封装内固定为 `glm-4.7-flash`，调用方只需要提供内容和指令。
 */
interface AIWritingPayload {
  content: string
  command: string
}

/**
 * 项目服务接口集合。
 *
 * @remarks
 * - 普通 JSON 接口使用 `axios` 实例，响应拦截器会直接返回 `response.data`。
 * - AI 流式接口使用 `fetchRequest()`，便于调用方读取 SSE 或二进制流。
 * - 所有方法保持原始业务行为，只在此处集中定义请求路径和请求体结构。
 */
export default {
  /**
   * 读取 public/mocks 目录下的演示数据。
   *
   * @param filename - mock 文件名，不包含 `.json` 后缀。
   * @returns 解析后的 mock JSON 数据。
   * @throws 当文件不存在、JSON 无法解析或网络请求失败时，异常由 axios 拦截器向上抛出。
   * @remarks 路径使用相对地址 `./mocks`，适配 Vite public 静态资源访问规则。
   */
  getMockData(filename: string): Promise<any> {
    // 打印 mock 数据读取动作，便于验证模板和测试图片是否被成功请求。
    console.info(SERVICE_DEBUG_PREFIX, 'getMockData()', {
      // mock 文件名。
      filename,
    })
    // 拼接 public 静态资源路径，按项目既有约定从 mocks 目录读取 JSON 文件。
    return axios.get(`./mocks/${filename}.json`)
  },

  /**
   * 根据关键词和筛选条件搜索图片素材。
   *
   * @param body - 图片搜索请求体，包含关键词、方向、尺寸、类型和分页信息。
   * @returns 服务端返回的图片搜索结果。
   * @throws 当接口返回非 2xx/3xx 状态或网络失败时，异常由 axios 拦截器统一处理。
   * @remarks 该接口依赖 `SERVER_URL`，开发环境通常通过 Vite 代理转发到后端。
   */
  searchImage(body: ImageSearchPayload): Promise<any> {
    // 打印图片搜索请求摘要。
    console.info(SERVICE_DEBUG_PREFIX, 'searchImage()', {
      // 搜索关键词长度。
      queryLength: body.query.length,
      // 图片方向筛选。
      orientation: body.orientation,
      // 页码。
      page: body.page,
      // 每页数量。
      perPage: body.per_page,
    })
    // 将调用方筛选条件原样提交给后端图片搜索接口，避免前端重复实现搜索规则。
    return axios.post(`${SERVER_URL}/tools/img_search`, body)
  },

  /**
   * 请求 AI 生成 PPT 大纲。
   *
   * @param payload - 大纲生成参数，包含内容、语言和模型。
   * @returns 流式响应或解析后的结果，具体取决于 `fetchRequest()` 对响应 content-type 的判断。
   * @throws 当请求失败、服务端返回非 JSON 且非流式响应，或浏览器 fetch 抛错时，异常向上透传。
   * @remarks
   * - 请求体会固定追加 `stream: true`，服务端通常以 SSE 方式逐段返回。
   * - 调用方需要注意流式响应只能读取一次。
   */
  AIPPT_Outline({
    content,
    language,
    model,
  }: AIPPTOutlinePayload): Promise<any> {
    // 打印 AI 大纲生成请求摘要，验证生成 PPT 前置链路是否发起。
    console.info(SERVICE_DEBUG_PREFIX, 'AIPPT_Outline()', {
      // 接口地址。
      url: `${SERVER_URL}/tools/aippt_outline`,
      // 用户输入长度。
      contentLength: content.length,
      // 输出语言。
      language,
      // 模型名称。
      model,
      // 固定流式输出。
      stream: true,
    })
    // 使用 fetch 封装而不是 axios，是为了保留流式响应的原始 Response 读取能力。
    return fetchRequest(`${SERVER_URL}/tools/aippt_outline`, {
      // AI 大纲生成需要提交 JSON 请求体，因此使用 POST。
      method: 'POST',
      // 将结构化参数序列化为 JSON；边界情况：content 过长时可能由服务端限制。
      body: JSON.stringify({
        // 用户输入内容是生成大纲的核心上下文。
        content,
        // 输出语言交给服务端模型提示词或后处理逻辑使用。
        language,
        // 模型标识由调用方选择并透传给服务端。
        model,
        // 固定请求流式返回，便于前端实时展示 AI 生成过程。
        stream: true,
      }),
    })
  },

  /**
   * 请求 AI 根据内容、语言和风格生成完整 PPT 数据。
   *
   * @param payload - 完整 PPT 生成参数，包含内容、语言、风格和模型。
   * @returns 流式响应或解析后的结果，具体取决于 `fetchRequest()` 对响应 content-type 的判断。
   * @throws 当请求失败、服务端返回异常格式或浏览器 fetch 抛错时，异常向上透传。
   * @remarks 该接口只负责服务请求，生成结果到 PPTist Slide 数据的适配由业务层处理。
   */
  AIPPT({
    content,
    language,
    style,
    model,
  }: AIPPTPayload): Promise<any> {
    // 打印完整 PPT 生成请求摘要，验证点击“生成”后是否进入最终生成接口。
    console.info(SERVICE_DEBUG_PREFIX, 'AIPPT()', {
      // 接口地址。
      url: `${SERVER_URL}/tools/aippt`,
      // 大纲内容长度。
      contentLength: content.length,
      // 输出语言。
      language,
      // 视觉风格。
      style,
      // 模型名称。
      model,
      // 固定流式输出。
      stream: true,
    })
    // 使用 fetch 封装发起流式生成请求，避免 axios 对响应体做默认缓冲处理。
    return fetchRequest(`${SERVER_URL}/tools/aippt`, {
      // 完整 PPT 生成是有请求体的写操作，按服务端约定使用 POST。
      method: 'POST',
      // 序列化请求体，保持字段名与后端接口约定一致。
      body: JSON.stringify({
        // 用户输入的主题、素材或大纲内容。
        content,
        // 生成语言，影响文本内容和可能的模板文案。
        language,
        // AI 模型标识，服务端负责校验可用性。
        model,
        // PPT 风格标识，用于指导后端生成更匹配的页面结构和视觉描述。
        style,
        // 固定启用流式输出，让界面可以边生成边反馈进度。
        stream: true,
      }),
    })
  },

  /**
   * 请求 AI 对文本执行写作类操作。
   *
   * @param payload - 写作请求参数，包含待处理文本和写作指令。
   * @returns 流式响应或解析后的结果，具体取决于 `fetchRequest()` 对响应 content-type 的判断。
   * @throws 当请求失败、服务端响应异常或浏览器 fetch 抛错时，异常向上透传。
   * @remarks 当前封装固定使用轻量写作模型，若未来支持模型选择，需要同步扩展 `AIWritingPayload`。
   */
  AI_Writing({
    content,
    command,
  }: AIWritingPayload): Promise<any> {
    // 打印 AI 写作请求摘要，辅助区分写作流和 PPT 生成流。
    console.info(SERVICE_DEBUG_PREFIX, 'AI_Writing()', {
      // 文本长度。
      contentLength: content.length,
      // 写作指令。
      command,
      // 固定模型。
      model: 'glm-4.7-flash',
    })
    // 通过 fetch 封装发起流式写作请求，便于上层实时消费生成文本。
    return fetchRequest(`${SERVER_URL}/tools/ai_writing`, {
      // 写作任务需要提交文本和命令，按服务端约定使用 POST。
      method: 'POST',
      // 构造服务端需要的 JSON 请求体。
      body: JSON.stringify({
        // 待处理文本，例如需要润色、扩写或总结的内容。
        content,
        // 写作指令，服务端会据此选择提示词或处理流程。
        command,
        // 当前写作接口固定模型；注意该值硬编码在前端，服务端仍可能做二次校验。
        model: 'glm-4.7-flash',
        // 固定请求流式输出，适配 AI 文本逐段生成体验。
        stream: true,
      }),
    })
  },
}
