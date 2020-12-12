import { Directive, App, createVNode, render, DirectiveBinding } from 'vue'
import ContextmenuComponent from '@/components/Contextmenu/index.vue'

const CTX_CONTEXTMENU_HANDLER = 'CTX_CONTEXTMENU_HANDLER'

const contextmenuListener = (el: HTMLElement, event: MouseEvent, binding: DirectiveBinding) => {
  event.stopPropagation()
  event.preventDefault()

  const menus = binding.value(el)
  if(!menus) return
  const isDark = binding.modifiers.dark

  let container: HTMLDivElement | null = null

  const removeContextMenu = () => {
    if(container) {
      document.body.removeChild(container)
      container = null
    }
    el.classList.remove('contextmenu-active')
    document.body.removeEventListener('scroll', removeContextMenu)  
    window.removeEventListener('resize', removeContextMenu)
  }

  const options = {
    axis: { x: event.x, y: event.y },
    el,
    menus,
    isDark,
    removeContextMenu,
  }
  container = document.createElement('div')
  const vm = createVNode(ContextmenuComponent, options, null)
  render(vm, container)
  document.body.appendChild(container)

  el.classList.add('contextmenu-active')

  document.body.addEventListener('scroll', removeContextMenu)
  window.addEventListener('resize', removeContextMenu)
}

const ContextmenuDirective: Directive = {
  mounted(el: HTMLElement, binding) {
    el[CTX_CONTEXTMENU_HANDLER] = (event: MouseEvent) => contextmenuListener(el, event, binding)
    el.addEventListener('contextmenu', el[CTX_CONTEXTMENU_HANDLER])
  },

  unmounted(el: HTMLElement) {
    if(el && el[CTX_CONTEXTMENU_HANDLER]) {
      el.removeEventListener('contextmenu', el[CTX_CONTEXTMENU_HANDLER])
      delete el[CTX_CONTEXTMENU_HANDLER]
    }
  },
}

export default {
  install(app: App) {
    app.directive('contextmenu', ContextmenuDirective)
  }
}