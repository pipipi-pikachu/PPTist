import { PPTElement, Slide, PPTAnimation } from '@/types/slides'
import { State } from './state'

export type Getters = {
  currentSlide(state: State): Slide | null;
  currentSlideAnimations(state: State): PPTAnimation[] | null;
  activeElementList(state: State): PPTElement[];
  handleElement(state: State): PPTElement | null;
  canUndo(state: State): boolean;
  canRedo(state: State): boolean;
}

export const getters: Getters = {
  currentSlide(state) {
    return state.slides[state.slideIndex] || null
  },

  currentSlideAnimations(state) {
    const currentSlide = state.slides[state.slideIndex]
    if(!currentSlide) return null
    const animations = currentSlide.animations
    if(!animations) return null

    const els = currentSlide.elements
    const elIds = els.map(el => el.elId)
    return animations.filter(animation => elIds.includes(animation.elId))
  },

  activeElementList(state) {
    const currentSlide = state.slides[state.slideIndex]
    if(!currentSlide || !currentSlide.elements) return []
    return currentSlide.elements.filter(element => state.activeElementIdList.includes(element.elId))
  },

  handleElement(state) {
    const currentSlide = state.slides[state.slideIndex]
    if(!currentSlide || !currentSlide.elements) return null
    return currentSlide.elements.find(element => state.handleElementId === element.elId) || null
  },

  canUndo(state) {
    return state.cursor > 0
  },

  canRedo(state) {
    return state.cursor < state.historyRecordLength - 1
  },
}