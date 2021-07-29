import { GetterTree } from 'vuex'
import { State } from './state'
import { layouts } from '@/mocks/layout'

export const getters: GetterTree<State, State> = {
  currentSlide(state) {
    return state.slides[state.slideIndex] || null
  },

  currentSlideAnimations(state) {
    const currentSlide = state.slides[state.slideIndex]
    if (!currentSlide) return null
    const animations = currentSlide.animations
    if (!animations) return null

    const els = currentSlide.elements
    const elIds = els.map(el => el.id)
    return animations.filter(animation => elIds.includes(animation.elId))
  },

  layouts(state) {
    const {
      themeColor,
      fontColor,
      fontName,
      backgroundColor,
    } = state.theme

    return layouts.map(layout => {
      const elements = layout.elements.map(el => {
        const props = {}
        for (const key of Object.keys(el)) {
          if (typeof el[key] === 'string') {
            props[key] = (el[key] as string).replace('{{themeColor}}', themeColor).replace('{{fontColor}}', fontColor).replace('{{fontName}}', fontName)
          }
        }
        return { ...el, ...props }
      })
      const background = { ...layout.background, color: backgroundColor }

      return { ...layout, elements, background }
    })
  },

  activeElementList(state) {
    const currentSlide = state.slides[state.slideIndex]
    if (!currentSlide || !currentSlide.elements) return []
    return currentSlide.elements.filter(element => state.activeElementIdList.includes(element.id))
  },

  handleElement(state) {
    const currentSlide = state.slides[state.slideIndex]
    if (!currentSlide || !currentSlide.elements) return null
    return currentSlide.elements.find(element => state.handleElementId === element.id) || null
  },

  canUndo(state) {
    return state.snapshotCursor > 0
  },

  canRedo(state) {
    return state.snapshotCursor < state.snapshotLength - 1
  },

  ctrlOrShiftKeyActive(state) {
    return state.ctrlKeyState || state.shiftKeyState
  },
}