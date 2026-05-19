import mitt, { type Emitter } from 'mitt'

/**
 * 全局事件总线的事件名称枚举。
 *
 * @remarks
 * - 使用 const enum 可以在编译后内联字符串，减少运行时代码。
 * - 事件名称集中管理，避免跨模块手写字符串造成拼写不一致。
 */
export const enum EmitterEvents {
  // 向当前富文本编辑器发送命令，例如加粗、对齐、颜色等。
  RICH_TEXT_COMMAND = 'RICH_TEXT_COMMAND',
  // 通知富文本编辑器把当前文本属性同步到 Pinia store。
  SYNC_RICH_TEXT_ATTRS_TO_STORE = 'SYNC_RICH_TEXT_ATTRS_TO_STORE',
  // 请求打开图表数据编辑弹窗。
  OPEN_CHART_DATA_EDITOR = 'OPEN_CHART_DATA_EDITOR',
  // 请求打开 LaTeX 公式编辑弹窗。
  OPEN_LATEX_EDITOR = 'OPEN_LATEX_EDITOR',
}

/**
 * 单个富文本操作动作。
 *
 * @property command - 富文本命令名称，通常对应 ProseMirror 或项目封装命令。
 * @property value - 命令携带的可选值，例如颜色、字号、链接等。
 * @remarks 不同 command 对 value 的类型和含义可能不同，这里保持字符串约束以匹配现有调用。
 */
export interface RichTextAction {
  command: string
  value?: string
}

/**
 * 富文本命令事件的载荷结构。
 *
 * @property target - 可选目标标识，用于指定命令作用的编辑器或区域。
 * @property action - 单个动作或动作数组，支持一次事件触发多个富文本操作。
 * @remarks 当 action 为数组时，监听方需要按顺序执行以保持用户操作语义。
 */
export interface RichTextCommand {
  target?: string
  action: RichTextAction | RichTextAction[]
}

/**
 * mitt 事件名称到事件载荷的类型映射。
 *
 * @remarks
 * - `void` 表示事件只承担通知作用，不携带额外数据。
 * - 通过该映射创建 `Emitter<Events>` 后，emit/on 都能获得 TypeScript 类型校验。
 */
type Events = {
  [EmitterEvents.RICH_TEXT_COMMAND]: RichTextCommand
  [EmitterEvents.SYNC_RICH_TEXT_ATTRS_TO_STORE]: void
  [EmitterEvents.OPEN_CHART_DATA_EDITOR]: void
  [EmitterEvents.OPEN_LATEX_EDITOR]: void
} 

// 创建项目级事件总线实例，用于解耦跨组件、跨层级的轻量事件通信。
const emitter: Emitter<Events> = mitt<Events>()

// 导出事件总线单例，业务模块可通过 `on`、`off`、`emit` 订阅和触发事件。
export default emitter
