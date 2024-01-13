import type { Directive, DirectiveBinding } from 'vue'
import tippy, { type Instance, type Placement } from 'tippy.js'

import './tooltip.scss'

const TOOLTIP_INSTANCE = 'TOOLTIP_INSTANCE'

interface CustomHTMLElement extends HTMLElement {
  [TOOLTIP_INSTANCE]?: Instance
}

type Delay = number | [number | null, number | null]

interface BindingValue {
  content: string
  placement?: Placement
  delay?: Delay
}

const TooltipDirective: Directive = {
  mounted(el: CustomHTMLElement, binding: DirectiveBinding<BindingValue | string>) {
    let content = ''
    let placement: Placement = 'top'
    let delay: Delay = [300, 0]

    if (typeof binding.value === 'string') {
      content = binding.value
    }
    else {
      content = binding.value.content
      if (binding.value.placement !== undefined) placement = binding.value.placement
      if (binding.value.delay !== undefined) delay = binding.value.delay
    }

    el[TOOLTIP_INSTANCE] = tippy(el, {
      content,
      theme: 'tooltip',
      duration: 100,
      animation: 'scale',
      allowHTML: true,
      placement,
      delay,
    })
  },

  updated(el: CustomHTMLElement, binding: DirectiveBinding<BindingValue | string>) {
    let content = ''
    if (typeof binding.value === 'string') {
      content = binding.value
    }
    else {
      content = binding.value.content
    }
    if (el[TOOLTIP_INSTANCE]) el[TOOLTIP_INSTANCE].setContent(content)
  },
  
  unmounted(el: CustomHTMLElement) {
    if (el[TOOLTIP_INSTANCE]) el[TOOLTIP_INSTANCE].destroy()
  },
}

export default TooltipDirective