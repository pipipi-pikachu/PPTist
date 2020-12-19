import { MutationTree } from 'vuex'
import { MutationTypes } from './constants'
import { State } from './index'
import { Slide, PPTElement } from '@/types/slides'
import { FONT_NAMES } from '@/configs/fontName'
import { isSupportFontFamily } from '@/utils/fontFamily'

interface AddSlideData {
  index?: number;
  slide: Slide | Slide[];
}

interface UpdateElementData {
  elId: string | string[];
  props: Partial<PPTElement>;
}

export const mutations: MutationTree<State> = {

  // editor

  [MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST](state, activeElementIdList: string[]) {
    if(activeElementIdList.length === 1) state.handleElementId = activeElementIdList[0]
    else state.handleElementId = ''
    
    state.activeElementIdList = activeElementIdList
  },
  
  [MutationTypes.SET_HANDLE_ELEMENT_ID](state, handleElementId: string) {
    state.handleElementId = handleElementId
  },

  [MutationTypes.SET_EDITOR_AREA_SHOW_SCALE](state, scale: number) {
    state.editorAreaShowScale = scale
  },

  [MutationTypes.SET_CANVAS_SCALE](state, scale: number) {
    state.canvasScale = scale
  },

  [MutationTypes.SET_THUMBNAILS_FOCUS](state, isFocus: boolean) {
    state.thumbnailsFocus = isFocus
  },

  [MutationTypes.SET_EDITORAREA_FOCUS](state, isFocus: boolean) {
    state.editorAreaFocus = isFocus
  },

  [MutationTypes.SET_DISABLE_HOTKEYS_STATE](state, disable: boolean) {
    state.disableHotkeys = disable
  },

  [MutationTypes.SET_AVAILABLE_FONTS](state) {
    state.availableFonts = FONT_NAMES.filter(font => isSupportFontFamily(font.en))
  },

  // slides

  [MutationTypes.SET_SLIDES](state, slides: Slide[]) {
    state.slides = slides
  },

  [MutationTypes.ADD_SLIDE](state, data: AddSlideData) {
    const { index, slide } = data
    const slides = Array.isArray(slide) ? slide : [slide]
    const addIndex = index !== undefined ? index : (state.slideIndex + 1)
    state.slides.splice(addIndex, 0, ...slides)
    state.slideIndex = addIndex
  },

  [MutationTypes.UPDATE_SLIDE](state, props: Partial<Slide>) {
    const slideIndex = state.slideIndex
    state.slides[slideIndex] = { ...state.slides[slideIndex], ...props }
  },

  [MutationTypes.DELETE_SLIDE](state, slideId: string) {
    const deleteIndex = state.slides.findIndex(item => item.id === slideId)

    if(deleteIndex === state.slides.length - 1) {
      state.slideIndex = deleteIndex - 1
    }
    state.slides.splice(deleteIndex, 1)
  },

  [MutationTypes.UPDATE_SLIDE_INDEX](state, index: number) {
    state.slideIndex = index
  },

  [MutationTypes.ADD_ELEMENT](state, element: PPTElement | PPTElement[]) {
    const elements = Array.isArray(element) ? element : [element]
    const currentSlideEls = state.slides[state.slideIndex].elements
    const newEls = [...currentSlideEls, ...elements]
    state.slides[state.slideIndex].elements = newEls
  },

  [MutationTypes.UPDATE_ELEMENT](state, data: UpdateElementData) {
    const { elId, props } = data
    const elIdList = typeof elId === 'string' ? [elId] : elId

    const slideIndex = state.slideIndex
    const slide = state.slides[slideIndex]
    const elements = slide.elements.map(el => {
      return elIdList.includes(el.elId) ? { ...el, ...props } : el
    })
    state.slides[slideIndex].elements = (elements as PPTElement[])
  },

  // history

  [MutationTypes.SET_CURSOR](state, cursor: number) {
    state.cursor = cursor
  },

  [MutationTypes.UNDO](state) {
    state.cursor -= 1
  },
  
  [MutationTypes.REDO](state) {
    state.cursor += 1
  },

  [MutationTypes.SET_HISTORY_RECORD_LENGTH](state, length: number) {
    state.historyRecordLength = length
  },

  // keyBoard

  [MutationTypes.SET_CTRL_KEY_STATE](state, isActive: boolean) {
    state.ctrlKeyState = isActive
  },
  [MutationTypes.SET_SHIFT_KEY_STATE](state, isActive: boolean) {
    state.shiftKeyState = isActive
  },
}