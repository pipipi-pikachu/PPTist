import { PPTElement } from '@/types/slides'
import { State } from './state'

export type Getters = {
  activeElementList(state: State): PPTElement[];
  handleElement(state: State): PPTElement | null;
  canUndo(state: State): boolean;
  canRedo(state: State): boolean;
}

export const getters: Getters = {
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