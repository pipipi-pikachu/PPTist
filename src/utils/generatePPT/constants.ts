/**
 * 当前独立 AI PPT 生成模块的日志前缀。
 *
 * 用途说明：
 * - 所有 console 输出使用统一前缀，方便在父子 iframe 混合日志中快速过滤。
 * - 前缀不包含动态字段，避免日志聚合工具把同一类日志拆成多个维度。
 */
export const GENERATE_PPT_LOG_PREFIX = '[PPTist generatePPT]'

/**
 * 默认上传地址。
 *
 * 边界说明：
 * - 父项目如果通过 payload.uploadUrl 传入地址，会优先使用父项目传入值。
 * - 没有传入时使用当前 iframeBridge 约定的本地后端地址，保持联调链路可直接运行。
 */
export const DEFAULT_UPLOAD_URL = 'https://localhost:8802/iccServer/file/upload'

/**
 * 默认 PPT 文件标题。
 *
 * 用途说明：
 * - payload.title 缺失、为空白字符串或不是字符串时使用该名称。
 * - 后续会统一补齐 .pptx 后缀，因此这里不写扩展名，避免重复处理。
 */
export const DEFAULT_PPT_TITLE = 'AI生成PPT'

/**
 * 默认模板 ID。
 *
 * 用途说明：
 * - 父项目没有传入 templateId 时，按 PPTist 原有链路读取 template_1。
 * - 该值会被拼接成 `./mocks/template_1.json`，路径规则保持和原项目 `api.getMockData()` 一致。
 */
export const DEFAULT_TEMPLATE_ID = 'template_1'

/**
 * PPTX MIME 类型。
 *
 * 用途说明：
 * - 创建 File 对象时指定标准 MIME，后端和浏览器都能更准确识别文件类型。
 * - 该常量只用于文件包装，不参与 pptxgenjs 内部写入。
 */
export const PPTX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
