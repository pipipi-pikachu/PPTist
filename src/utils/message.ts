import { createVNode, render, type AppContext } from 'vue'
import MessageComponent from '@/components/Message.vue'

export interface MessageOptions {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message?: string
  duration?: number
  closable?: boolean
  ctx?: AppContext
  onClose?: () => void
}

export type MessageTypeOptions = Omit<MessageOptions, 'type' | 'message'>
export interface MessageIntance {
  id: string
  close: () => void
}

export type MessageFn = (message: string, options?: MessageTypeOptions) => MessageIntance
export interface Message {
  (options: MessageOptions): MessageIntance
  info: MessageFn
  success: MessageFn
  error: MessageFn
  warning: MessageFn
  closeAll: () => void
  _context?: AppContext | null
}

const instances: MessageIntance[] = []
let wrap: HTMLDivElement | null = null
let seed = 0
const defaultOptions: MessageOptions = {
  duration: 3000,
}

const message: Message = (options: MessageOptions) => {
  const id = 'message-' + seed++
  const props = {
    ...defaultOptions,
    ...options,
    id,
  }

  if (!wrap) {
    wrap = document.createElement('div')
    wrap.className = 'message-wrap'
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
    document.body.appendChild(wrap)
  }

  const vm = createVNode(MessageComponent, props, null)
  const div = document.createElement('div')

  vm.appContext = options.ctx || message._context || null
  vm.props!.onClose = options.onClose
  vm.props!.onDestroy = () => {
    if (wrap && wrap.childNodes.length <= 1) {
      wrap.remove()
      wrap = null
    }
    render(null, div)
  }

  render(vm, div)
  wrap.appendChild(div.firstElementChild!)

  const instance = {
    id,
    close: () => vm?.component?.exposed?.close(),
  }

  instances.push(instance)
  return instance
}

message.success = (msg: string, options?: MessageTypeOptions) => message({ ...options, type: 'success', message: msg })
message.info = (msg: string, options?: MessageTypeOptions) => message({ ...options, type: 'info', message: msg })
message.warning = (msg: string, options?: MessageTypeOptions) => message({ ...options, type: 'warning', message: msg })
message.error = (msg: string, options?: MessageTypeOptions) => message({ ...options, type: 'error', message: msg })

message.closeAll = function() {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close()
  }
}

export default message