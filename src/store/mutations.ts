import { MutationTypes } from './constants'
import { State, SaveState } from './state'
import { Slide, PPTElement } from '@/types/slides'
import { FONT_NAMES } from '@/configs/fontName'
import { isSupportFontFamily } from '@/utils/index'

interface AddSlidesData {
  index?: number;
  slides: Slide[];
}

interface SetSlideData {
  index?: number;
  slide: Slide;
}

type AddSlideData = SetSlideData

interface UpdateSlideData {
  index?: number;
  props: Partial<Slide>;
}

interface UpdateElementData {
  index?: number;
  elId: string | string[];
  props: Partial<PPTElement>;
}

export type Mutations = {
  [MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST](state: State, activeElementIdList: string[]): void;
  [MutationTypes.SET_HANDLE_ELEMENT_ID](state: State, handleElementId: string): void;
  [MutationTypes.SET_EDITOR_AREA_SHOW_SCALE](state: State, scale: number): void;
  [MutationTypes.SET_CANVAS_SCALE](state: State, scale: number): void;
  [MutationTypes.SET_THUMBNAILS_FOCUS](state: State, isFocus: boolean): void;
  [MutationTypes.SET_EDITORAREA_FOCUS](state: State, isFocus: boolean): void;
  [MutationTypes.SET_DISABLE_HOTKEYS_STATE](state: State, disable: boolean): void;
  [MutationTypes.SET_AVAILABLE_FONTS](state: State): void;
  [MutationTypes.SET_SAVE_STATE](state: State, saveState: SaveState ): void;
  [MutationTypes.SET_SLIDES](state: State, slides: Slide[]): void;
  [MutationTypes.ADD_SLIDES](state: State, data: AddSlidesData): void;
  [MutationTypes.SET_SLIDE](state: State, data: SetSlideData): void;
  [MutationTypes.ADD_SLIDE](state: State, data: AddSlideData): void;
  [MutationTypes.UPDATE_SLIDE](state: State, data: UpdateSlideData): void;
  [MutationTypes.DELETE_SLIDE](state: State, slideId: string): void;
  [MutationTypes.UPDATE_SLIDE_INDEX](state: State, index: number): void;
  [MutationTypes.ADD_ELEMENTS](state: State, elements: PPTElement[]): void;
  [MutationTypes.UPDATE_ELEMENT](state: State, data: UpdateElementData): void;
  [MutationTypes.SET_CURSOR](state: State, cursor: number): void;
  [MutationTypes.UNDO](state: State): void;
  [MutationTypes.REDO](state: State): void;
  [MutationTypes.SET_HISTORY_RECORD_LENGTH](state: State, length: number): void;
}

export const mutations: Mutations = {

  // editor

  [MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST](state, activeElementIdList) {
    if(activeElementIdList.length === 1) state.handleElementId = activeElementIdList[0]
    else state.handleElementId = ''
    
    state.activeElementIdList = activeElementIdList
  },
  
  [MutationTypes.SET_HANDLE_ELEMENT_ID](state, handleElementId) {
    state.handleElementId = handleElementId
  },

  [MutationTypes.SET_EDITOR_AREA_SHOW_SCALE](state, scale) {
    state.editorAreaShowScale = scale
  },

  [MutationTypes.SET_CANVAS_SCALE](state, scale) {
    state.canvasScale = scale
  },

  [MutationTypes.SET_THUMBNAILS_FOCUS](state, isFocus) {
    state.thumbnailsFocus = isFocus
  },

  [MutationTypes.SET_EDITORAREA_FOCUS](state, isFocus) {
    state.editorAreaFocus = isFocus
  },

  [MutationTypes.SET_DISABLE_HOTKEYS_STATE](state, disable) {
    state.disableHotkeys = disable
  },

  [MutationTypes.SET_AVAILABLE_FONTS](state) {
    state.availableFonts = FONT_NAMES.filter(font => isSupportFontFamily(font.en))
  },

  [MutationTypes.SET_SAVE_STATE](state, saveState) {
    state.saveState = saveState
  },

  // slides

  [MutationTypes.SET_SLIDES](state, slides) {
    state.slides = slides
  },

  [MutationTypes.ADD_SLIDES](state, {index, slides}) {
    const addIndex = index !== undefined ? index : (state.slideIndex + 1)
    state.slides.splice(addIndex, 0, ...slides)
    state.slideIndex = addIndex
  },

  [MutationTypes.SET_SLIDE](state, {index, slide}) {
    const slideIndex = index !== undefined ? index : state.slideIndex
    state.slides[slideIndex] = slide
  },

  [MutationTypes.ADD_SLIDE](state, {index, slide}) {
    const addIndex = index !== undefined ? index : (state.slideIndex + 1)
    state.slides.splice(addIndex, 0, slide)
    state.slideIndex = addIndex
  },

  [MutationTypes.UPDATE_SLIDE](state, {index, props}) {
    const slideIndex = index !== undefined ? index : state.slideIndex
    state.slides[slideIndex] = { ...state.slides[slideIndex], ...props }
  },

  [MutationTypes.DELETE_SLIDE](state, slideId) {
    const deleteIndex = state.slides.findIndex(item => item.id === slideId)

    if(deleteIndex === state.slides.length - 1) {
      state.slideIndex = deleteIndex - 1
    }
    state.slides.splice(deleteIndex, 1)
  },

  [MutationTypes.UPDATE_SLIDE_INDEX](state, index) {
    state.slideIndex = index
  },

  [MutationTypes.ADD_ELEMENTS](state, elements) {
    const currentSlideEls = state.slides[state.slideIndex].elements
    const newEls = [...currentSlideEls, ...elements]
    state.slides[state.slideIndex].elements = newEls
  },

  [MutationTypes.UPDATE_ELEMENT](state, {index, elId, props}) {
    if(typeof elId === 'string') elId = [elId]

    const slideIndex = index !== undefined ? index : state.slideIndex
    const slide = state.slides[slideIndex]
    const elements = slide.elements.map(el => {
      return elId.includes(el.elId) ? { ...el, ...props } : el
    })
    state.slides[slideIndex].elements = (elements as PPTElement[])
  },

  // history

  [MutationTypes.SET_CURSOR](state, cursor) {
    state.cursor = cursor
  },

  [MutationTypes.UNDO](state) {
    state.cursor -= 1
  },
  
  [MutationTypes.REDO](state) {
    state.cursor += 1
  },

  [MutationTypes.SET_HISTORY_RECORD_LENGTH](state, length) {
    state.historyRecordLength = length
  },
}