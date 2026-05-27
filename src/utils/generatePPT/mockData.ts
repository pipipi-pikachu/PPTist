import type { AiPptGeneratePayload } from './types'

/**
 * 数组格式 content 的 AI PPT 生成示例。
 *
 * 使用场景：
 * - 适合前端已经把 AI 输出解析成 JavaScript 数组后直接调用 `handleGenerateAIPPTSlides()`。
 * - 也适合作为单元联调数据，因为每一页都是明确的对象结构，排查字段问题更直观。
 *
 * 注意事项：
 * - `uploadUrl` 请按你的项目后端接口替换；当前值沿用本目录默认联调接口，便于本项目环境直接试跑。
 * - `token` 留空表示不加 Authorization 请求头；如果后端要求鉴权，需要改成真实 token。
 * - `imgs` 为空数组时不会影响 PPT 生成，页面会自动使用文字布局和浅色占位区域。
 */
export const mockArrayContentGeneratePayload: AiPptGeneratePayload = {
  /**
   * logId 是父项目或业务系统的任务 ID。
   *
   * 说明：
   * - 生成成功后会原样出现在返回值里。
   * - 业务侧可以用它把上传后的 PPT 文件关联回数据库记录。
   */
  logId: 'mock-array-content-001',

  /**
   * title 是导出的 PPTX 文件名来源。
   *
   * 边界说明：
   * - 这里不写 `.pptx` 也可以，生成模块会自动补齐后缀。
   * - 文件名中的 Windows 非法字符会被模块替换为空格，避免上传或下载时出错。
   */
  title: 'AI PPT 数组格式示例',

  /**
   * templateId 是模板 JSON 文件名。
   *
   * 读取规则：
   * - 当前值会读取 `./mocks/template_1.json`。
   * - 如果改成 `template_8`，则会读取 `./mocks/template_8.json`。
   */
  templateId: 'template_1',

  /**
   * uploadUrl 是 PPTX 文件上传接口。
   *
   * 使用说明：
   * - 如果你的项目接口不是这个地址，请在调用前覆盖为真实接口。
   * - 上传字段固定为 `files`，后端需要按 multipart/form-data 接收。
   */
  uploadUrl: 'https://localhost:8802/iccServer/file/upload',

  /**
   * token 是上传鉴权令牌。
   *
   * 边界说明：
   * - 空字符串表示不携带 Authorization。
   * - 如果填入 `Bearer xxx`，模块会自动去掉重复前缀后再统一补回 Bearer。
   */
  token: '',

  /**
   * theme 是本次 PPT 的主题配置。
   *
   * 说明：
   * - 颜色可以带 `#`，模块内部会转换为 pptxgenjs 需要的十六进制格式。
   * - 字段缺失时会自动使用默认主题，因此这里只覆盖最常用的几项。
   */
  theme: {
    backgroundColor: '#F7F8FA',
    fontColor: '#1F2937',
    fontName: 'Microsoft YaHei',
    themeColors: ['#2563EB', '#10B981', '#F59E0B', '#EF4444'],
  },

  /**
   * imgs 是图片池。
   *
   * 当前示例说明：
   * - 这里故意使用空数组，保证没有外网图片依赖时也可以稳定生成。
   * - 如果要测试配图，可以添加 `{ src: 'https://example.com/demo.png' }`。
   */
  imgs: [],

  /**
   * content 是标准数组格式 AI 页面数据。
   *
   * 页面顺序说明：
   * - cover：封面页。
   * - contents：目录页。
   * - transition：章节过渡页。
   * - content：正文页，可以有多个。
   * - end：结束页。
   */
  content: [
    {
      type: 'cover',
      data: {
        title: '企业数字化转型路线图',
        text: '从业务洞察、平台建设到组织落地的完整方案',
      },
    },
    {
      type: 'contents',
      data: {
        items: [
          '转型背景与目标',
          '核心能力建设',
          '数据平台与应用场景',
          '组织保障与推进节奏',
        ],
      },
    },
    {
      type: 'transition',
      data: {
        title: '第一部分：转型背景与目标',
        text: '明确业务痛点、战略目标和阶段性成果。',
      },
    },
    {
      type: 'content',
      data: {
        title: '转型背景与目标',
        items: [
          {
            title: '市场竞争加速',
            text: '客户需求变化更快，企业需要更短的响应周期和更高的运营透明度。',
          },
          {
            title: '内部协同成本高',
            text: '多系统、多部门、多流程之间存在信息断点，影响管理效率和决策速度。',
          },
          {
            title: '目标聚焦业务价值',
            text: '数字化转型应围绕收入增长、成本优化、体验提升和风险控制持续推进。',
          },
        ],
      },
    },
    {
      type: 'content',
      data: {
        title: '核心能力建设',
        items: [
          {
            title: '流程在线化',
            text: '把关键业务流程迁移到统一平台，形成可追踪、可分析、可优化的执行链路。',
          },
          {
            title: '数据资产化',
            text: '建立统一指标口径和数据治理机制，让数据能够真正支撑业务经营。',
          },
          {
            title: '应用场景化',
            text: '优先落地高频、高价值、可衡量的业务场景，降低转型试错成本。',
          },
          {
            title: '组织机制化',
            text: '通过跨部门协同机制和持续运营体系，确保数字化能力长期生效。',
          },
        ],
      },
    },
    {
      type: 'end',
      data: {
        title: '谢谢观看',
        text: '数字化转型需要持续迭代，也需要业务与技术共同前进。',
      },
    },
  ],
}

/**
 * 连续 JSON 对象字符串格式 content 的 AI PPT 生成示例。
 *
 * 使用场景：
 * - 适合后端或大模型输出“一页一个 JSON 对象”，并用换行连接起来的场景。
 * - 也适合验证 `parseAIPPTSlides()` 对非标准 JSON 数组格式的兼容能力。
 *
 * 注意事项：
 * - 该字符串整体不是标准 JSON 数组，但每个片段都是完整 JSON 对象。
 * - 生成模块会通过括号深度扫描拆分这些对象，然后逐个 JSON.parse。
 */
export const mockJsonObjectStreamGeneratePayload: AiPptGeneratePayload = {
  /**
   * logId 是本次字符串流示例的任务标识。
   *
   * 说明：
   * - 使用字符串 ID 便于和数组格式示例区分。
   * - 实际项目中可以替换为数据库数字 ID。
   */
  logId: 'mock-json-object-stream-001',

  /**
   * title 是导出文件名。
   *
   * 说明：
   * - 当前示例标题包含中文，浏览器 File 和 multipart 上传都可以正常处理。
   * - 模块会自动补齐 `.pptx` 后缀。
   */
  title: 'AI PPT 连续 JSON 对象示例',

  /**
   * templateId 是模板 JSON 文件名。
   *
   * 说明：
   * - 当前示例使用 template_8，方便验证不同模板 JSON 的主题色读取效果。
   * - 读取路径保持为 `./mocks/template_8.json`。
   */
  templateId: 'template_8',

  /**
   * uploadUrl 是上传接口地址。
   *
   * 边界说明：
   * - 如果不传该字段，模块会使用 constants.ts 中的默认上传地址。
   * - 这里显式传入是为了让示例数据字段更完整，方便复制后直接修改。
   */
  uploadUrl: 'https://localhost:8802/iccServer/file/upload',

  /**
   * parentToken 用于兼容 iframe 或父项目透传 token 的命名方式。
   *
   * 说明：
   * - 当前示例为空，不会生成 Authorization 请求头。
   * - 如果 token 从 URL 参数传入，也可以删除该字段，让模块从当前页面 URL 中读取。
   */
  parentToken: '',

  /**
   * theme 使用另一组配色，方便和数组格式示例在视觉上区分。
   *
   * 说明：
   * - themeColors 会按页面索引轮换使用。
   * - 背景色使用浅色，保证正文页在投屏和预览中可读性更稳定。
   */
  theme: {
    backgroundColor: '#FAFAF9',
    fontColor: '#111827',
    fontName: 'Microsoft YaHei',
    themeColors: ['#0F766E', '#7C2D12', '#4338CA', '#BE123C'],
  },

  /**
   * imgs 是图片池示例。
   *
   * 当前说明：
   * - 这里仍保持空数组，避免示例依赖外部图片地址。
   * - 如果你的业务已经有图片池，直接把数组赋给该字段即可。
   */
  imgs: [],

  /**
   * content 是连续 JSON 对象字符串。
   *
   * 格式说明：
   * - 每个对象之间可以有一个或多个换行。
   * - 对象内部字符串如果包含换行或括号，解析器会通过字符串状态避免误切分。
   */
  content: [
    '{"type":"cover","data":{"title":"智慧园区建设方案","text":"以数据驱动运营，以平台提升服务，以智能优化管理"}}',
    '',
    '{"type":"contents","data":{"items":["建设目标与总体架构","基础设施与平台能力","运营场景与服务体验","实施计划与保障机制"]}}',
    '',
    '{"type":"transition","data":{"title":"第二部分：基础设施与平台能力","text":"构建统一、开放、可扩展的园区数字底座。"}}',
    '',
    '{"type":"content","data":{"title":"建设目标与总体架构","items":[{"title":"统一入口","text":"面向企业、员工、访客和运营人员提供统一服务入口，减少多系统切换成本。"},{"title":"统一数据","text":"打通门禁、能耗、工单、安防、资产等数据，形成园区运营全景视图。"},{"title":"统一运营","text":"通过指标看板、事件中心和流程引擎，提升园区日常管理效率。"}]}}',
    '',
    '{"type":"content","data":{"title":"运营场景与服务体验","items":[{"title":"智能通行","text":"支持访客预约、车辆识别、门禁联动和异常提醒，提升通行效率与安全性。"},{"title":"能耗管理","text":"通过分项计量和趋势分析识别异常能耗，支持节能策略持续优化。"},{"title":"工单协同","text":"统一受理维修、保洁、安防等事件，自动分派并跟踪处理进度。"},{"title":"企业服务","text":"提供政策通知、空间预约、物业缴费等服务，增强园区企业满意度。"}]}}',
    '',
    '{"type":"end","data":{"title":"谢谢观看","text":"智慧园区的核心，是让运营更高效，让服务更贴近真实需求。"}}',
  ].join('\n'),
}
