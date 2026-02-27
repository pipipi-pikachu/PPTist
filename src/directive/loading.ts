import type { Directive, DirectiveBinding } from 'vue'

import './loading.scss'

interface BindingValue {
  state: boolean
  text?: string
}

interface CustomHTMLElement extends HTMLElement {
  _vLoadingAddedPosition?: boolean
}

const loadingDirective: Directive = {
  mounted(el: CustomHTMLElement, binding: DirectiveBinding<BindingValue | boolean>) {
    updateLoading(el, binding.value)
  },
  updated(el: CustomHTMLElement, binding: DirectiveBinding<BindingValue | boolean>) {
    updateLoading(el, binding.value)
  },
  unmounted(el: CustomHTMLElement) {
    cleanup(el)
  },
}

const cleanup = (el: CustomHTMLElement) => {
  const overlay = el.querySelector('.directive-loading-overlay')
  if (overlay) overlay.remove()
  if (el._vLoadingAddedPosition) {
    el.style.removeProperty('position')
    delete el._vLoadingAddedPosition
  }
}

const updateLoading = (el: CustomHTMLElement, value: BindingValue | boolean) => {
  let state = false
  let text = ''
  if (typeof value === 'boolean') {
    state = value
  }
  else {
    if (value.text) text = value.text
    state = value.state
  }

  let overlay: CustomHTMLElement | null = el.querySelector('.directive-loading-overlay')

  if (state) {
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative'
      el._vLoadingAddedPosition = true
    }

    if (!overlay) {
      overlay = document.createElement('div')
      overlay.className = 'directive-loading-overlay'
      el.appendChild(overlay)
    }

    if (text) {
      overlay.classList.add('has-text')
      overlay.style.setProperty('--directive-loading-text', `"${text}"`)
    } 
    else {
      overlay.classList.remove('has-text')
      overlay.style.removeProperty('--directive-loading-text')
    }
  }
  else {
    if (overlay) overlay.remove()
    if (el._vLoadingAddedPosition) {
      el.style.removeProperty('position')
      delete el._vLoadingAddedPosition
    }
  }
}

export default loadingDirective