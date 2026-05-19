import { createVNode, render, type AppContext } from 'vue'
import MessageComponent from '@/components/Message.vue'

/**
 * 创建消息提示时支持的配置项。
 *
 * @property type - 消息类型，影响图标、颜色和展示语义。
 * @property title - 可选标题，适合强调消息主题。
 * @property message - 消息正文文本。
 * @property duration - 自动关闭时长，单位毫秒；通常由 Message 组件内部消费。
 * @property closable - 是否展示可手动关闭能力。
 * @property ctx - Vue 应用上下文，用于让动态渲染组件继承插件、provide/inject 等能力。
 * @property onClose - 消息关闭时触发的回调。
 * @remarks 该接口只描述渲染参数，具体展示细节由 `Message.vue` 组件决定。
 */
export interface MessageOptions {
  type?: 'info' | 'success' | 'warning' | 'error' | 'loading'
  title?: string
  message?: string
  duration?: number
  closable?: boolean
  ctx?: AppContext
  onClose?: () => void
}

/**
 * 便捷类型方法的配置项。
 *
 * @remarks `type` 和 `message` 会由 `success()`、`error()` 等快捷方法自动填入。
 */
export type MessageTypeOptions = Omit<MessageOptions, 'type' | 'message'>

/**
 * 单个消息实例的最小控制接口。
 *
 * @property id - 消息实例唯一标识。
 * @property close - 主动关闭当前消息的函数。
 * @remarks 该对象保存在模块级 `instances` 中，用于支持 `closeAll()`。
 */
export interface MessageIntance {
  id: string
  close: () => void
}

/**
 * 具体消息类型快捷函数签名。
 *
 * @param message - 消息正文文本。
 * @param options - 除 type 和 message 之外的消息配置项。
 * @returns 可用于主动关闭消息的实例对象。
 */
export type MessageFn = (message: string, options?: MessageTypeOptions) => MessageIntance

/**
 * 消息函数对象，既可以直接调用，也可以通过类型快捷方法调用。
 *
 * @remarks 函数对象上挂载 `_context`，用于在插件安装场景下透传 Vue AppContext。
 */
export interface Message {
  (options: MessageOptions): MessageIntance
  info: MessageFn
  success: MessageFn
  error: MessageFn
  warning: MessageFn
  loading: MessageFn
  closeAll: () => void
  _context?: AppContext | null
}

// 保存当前创建过的消息实例，供 closeAll 从后往前依次关闭。
const instances: MessageIntance[] = []
// 消息容器 DOM；全局只创建一个，最后一条消息销毁后会移除并重置为 null。
let wrap: HTMLDivElement | null = null
// 自增种子，用于生成消息实例 id；模块生命周期内递增即可，不需要持久化。
let seed = 0
// 默认消息配置；调用方传入 options 时会覆盖这里的同名字段。
const defaultOptions: MessageOptions = {
  // 默认 3 秒自动关闭，具体定时逻辑由 Message.vue 组件执行。
  duration: 3000,
}

/**
 * 创建并渲染一条全局消息提示。
 *
 * @param options - 消息配置对象，包含类型、内容、持续时间、上下文和关闭回调。
 * @returns 消息实例对象，可通过 `close()` 主动关闭。
 * @throws 当 DOM 不可用、Vue 渲染失败或组件暴露接口不存在时，可能产生运行时异常。
 * @remarks
 * - 该函数通过 `createVNode()` 和 `render()` 动态挂载组件，不依赖调用方模板。
 * - 容器挂载到 `document.body`，因此只能在浏览器环境中调用。
 * - `onDestroy` 会在最后一条消息销毁时移除容器，避免页面残留空节点。
 */
const message: Message = (options: MessageOptions) => {
  // 生成当前消息唯一 id，方便调试和组件内部定位。
  const id = 'message-' + seed++
  // 合并默认配置、调用方配置和自动 id；调用方配置优先级高于默认配置。
  const props = {
    ...defaultOptions,
    ...options,
    id,
  }

  // 如果全局消息容器尚未创建，则创建并插入 document.body。
  if (!wrap) {
    // 创建用于承载所有消息实例的根容器。
    wrap = document.createElement('div')
    // 设置类名，便于全局样式或调试工具识别。
    wrap.className = 'message-wrap'
    // 直接写入关键布局样式，确保动态挂载的消息无需额外父组件即可在顶部居中显示。
    wrap.style.cssText = `
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 6000;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 15px;
      background-color: rgba(255, 255, 255, 0);
      transition: all 1s ease-in-out;
      align-items: center;
    `
    // 将容器挂载到 body，使消息提示浮在应用其他内容之上。
    document.body.appendChild(wrap)
  }

  // 创建 Message.vue 的虚拟节点，props 会作为组件入参传入。
  const vm = createVNode(MessageComponent, props, null)
  // 创建临时渲染容器，Vue render 需要一个真实 DOM 作为挂载点。
  const div = document.createElement('div')

  // 透传调用方指定上下文、全局消息上下文或 null，保证动态组件能访问应用级依赖。
  vm.appContext = options.ctx || message._context || null
  // 注入关闭回调；使用非空断言是因为 createVNode 后 props 应存在。
  vm.props!.onClose = options.onClose
  // 注入销毁回调，供 Message.vue 在离场动画完成后清理 DOM 和 Vue 实例。
  vm.props!.onDestroy = () => {
    // 当容器存在且当前消息是最后一个子节点时，移除全局容器。
    if (wrap && wrap.childNodes.length <= 1) {
      // 从 document.body 中移除容器节点，避免空容器拦截层级或残留样式影响页面。
      wrap.remove()
      // 重置容器引用，下次创建消息时重新生成。
      wrap = null
    }
    // 卸载当前 Vue 虚拟节点，释放组件实例、响应式副作用和事件监听。
    render(null, div)
  }

  // 将虚拟节点渲染到临时容器中，生成真实消息 DOM。
  render(vm, div)
  // 把渲染出的第一个真实元素追加到全局容器；Message.vue 应保证根元素存在。
  wrap.appendChild(div.firstElementChild!)

  // 构造对外暴露的消息实例控制对象。
  const instance = {
    // 保存 id，便于外部或调试时识别具体消息。
    id,
    // 调用组件通过 expose 暴露的 close 方法；可选链避免组件未挂载时直接报错。
    close: () => vm?.component?.exposed?.close(),
  }

  // 将实例加入全局列表，以便 closeAll 能统一关闭。
  instances.push(instance)
  // 返回实例给调用方，支持精确关闭当前消息。
  return instance
}

// 成功消息快捷方法，自动填充 type 和 message 字段。
message.success = (msg: string, options?: MessageTypeOptions) => message({ ...options, type: 'success', message: msg })
// 普通信息消息快捷方法，自动填充 type 和 message 字段。
message.info = (msg: string, options?: MessageTypeOptions) => message({ ...options, type: 'info', message: msg })
// 警告消息快捷方法，自动填充 type 和 message 字段。
message.warning = (msg: string, options?: MessageTypeOptions) => message({ ...options, type: 'warning', message: msg })
// 错误消息快捷方法，自动填充 type 和 message 字段。
message.error = (msg: string, options?: MessageTypeOptions) => message({ ...options, type: 'error', message: msg })
// 加载消息快捷方法，自动填充 type 和 message 字段。
message.loading = (msg: string, options?: MessageTypeOptions) => message({ ...options, type: 'loading', message: msg })

/**
 * 关闭当前记录的所有消息实例。
 *
 * @returns 无显式返回值。
 * @throws 当某个消息实例的 close 方法内部抛错时，异常会向上透传并中断后续关闭。
 * @remarks
 * - 从后往前关闭可以优先关闭最新消息，也避免遍历过程中数组顺序变化带来的影响。
 * - 当前实现不会从 `instances` 中移除实例，保持项目既有行为。
 */
message.closeAll = function() {
  // 从最后一个实例开始遍历，优先关闭最新创建的消息。
  for (let i = instances.length - 1; i >= 0; i--) {
    // 调用实例暴露的关闭方法，实际关闭动画和销毁由 Message.vue 控制。
    instances[i].close()
  }
}

// 导出全局消息函数对象，供工具层、服务层和业务组件直接调用。
export default message
