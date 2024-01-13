import type { Directive, DirectiveBinding } from 'vue'

const CTX_CLICK_OUTSIDE_HANDLER = 'CTX_CLICK_OUTSIDE_HANDLER'

interface CustomHTMLElement extends HTMLElement {
  [CTX_CLICK_OUTSIDE_HANDLER]?: (event: MouseEvent) => void
} 

const clickListener = (el: HTMLElement, event: MouseEvent, binding: DirectiveBinding) => {
  const handler = binding.value

  const path = event.composedPath()
  const isClickOutside = path ? path.indexOf(el) < 0 : !el.contains(event.target as HTMLElement)

  if (!isClickOutside) return
  handler(event)
}

const ClickOutsideDirective: Directive = {
  mounted(el: CustomHTMLElement, binding) {
    el[CTX_CLICK_OUTSIDE_HANDLER] = (event: MouseEvent) => clickListener(el, event, binding)
    setTimeout(() => {
      document.addEventListener('click', el[CTX_CLICK_OUTSIDE_HANDLER]!)
    }, 0)
  },
  
  unmounted(el: CustomHTMLElement) {
    if (el[CTX_CLICK_OUTSIDE_HANDLER]) {
      document.removeEventListener('click', el[CTX_CLICK_OUTSIDE_HANDLER])
      delete el[CTX_CLICK_OUTSIDE_HANDLER]
    }
  },
}

export default ClickOutsideDirective