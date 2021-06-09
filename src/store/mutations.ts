import { MutationTree } from 'vuex'
import { omit } from 'lodash'
import { MutationTypes } from './constants'
import { State } from './state'
import { Slide, PPTElement, SlideTheme } from '@/types/slides'
import { CreatingElement } from '@/types/edit'
import { SYS_FONTS } from '@/configs/font'
import { isSupportFont } from '@/utils/font'
import { ToolbarState } from '@/types/toolbar'
import { TextAttrs } from '@/utils/prosemirror/utils'

interface RemoveElementPropData {
  id: string;
  propName: string | string[];
}

interface UpdateElementData {
  id: string | string[];
  props: Partial<PPTElement>;
}

export const mutations: MutationTree<State> = {

  // editor

  [MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST](state, activeElementIdList: string[]) {
    if (activeElementIdList.length === 1) state.handleElementId = activeElementIdList[0]
    else state.handleElementId = ''
    
    state.activeElementIdList = activeElementIdList
  },
  
  [MutationTypes.SET_HANDLE_ELEMENT_ID](state, handleElementId: string) {
    state.handleElementId = handleElementId
  },
  
  [MutationTypes.SET_ACTIVE_GROUP_ELEMENT_ID](state, activeGroupElementId: string) {
    state.activeGroupElementId = activeGroupElementId
  },

  [MutationTypes.SET_CANVAS_PERCENTAGE](state, percentage: number) {
    state.canvasPercentage = percentage
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

  [MutationTypes.SET_GRID_LINES_STATE](state, show: boolean) {
    state.showGridLines = show
  },

  [MutationTypes.SET_CREATING_ELEMENT](state, element: CreatingElement | null) {
    state.creatingElement = element
  },

  [MutationTypes.SET_AVAILABLE_FONTS](state) {
    state.availableFonts = SYS_FONTS.filter(font => isSupportFont(font.value))
  },

  [MutationTypes.SET_TOOLBAR_STATE](state, toolbarState: ToolbarState) {
    state.toolbarState = toolbarState
  },

  [MutationTypes.SET_CLIPING_IMAGE_ELEMENT_ID](state, elId: string) {
    state.clipingImageElementId = elId
  },

  [MutationTypes.SET_RICHTEXT_ATTRS](state, attrs: TextAttrs) {
    state.richTextAttrs = attrs
  },

  [MutationTypes.SET_SELECTED_TABLE_CELLS](state, cells: string[]) {
    state.selectedTableCells = cells
  },

  // slides

  [MutationTypes.SET_THEME](state, themeProps: Partial<SlideTheme>) {
    state.theme = { ...state.theme, ...themeProps }
  },

  [MutationTypes.SET_VIEWPORT_RATIO](state, viewportRatio: number) {
    state.viewportRatio = viewportRatio
  },

  [MutationTypes.SET_SLIDES](state, slides: Slide[]) {
    state.slides = slides
  },

  [MutationTypes.ADD_SLIDE](state, slide: Slide | Slide[]) {
    const slides = Array.isArray(slide) ? slide : [slide]
    const addIndex = state.slideIndex + 1
    state.slides.splice(addIndex, 0, ...slides)
    state.slideIndex = addIndex
  },

  [MutationTypes.UPDATE_SLIDE](state, props: Partial<Slide>) {
    const slideIndex = state.slideIndex
    state.slides[slideIndex] = { ...state.slides[slideIndex], ...props }
  },

  [MutationTypes.DELETE_SLIDE](state, slideId: string | string[]) {
    const slidesId = Array.isArray(slideId) ? slideId : [slideId]

    const deleteSlidesIndex = []
    for (let i = 0; i < slidesId.length; i++) {
      const index = state.slides.findIndex(item => item.id === slidesId[i])
      deleteSlidesIndex.push(index)
    }
    let newIndex = Math.min(...deleteSlidesIndex)

    const maxIndex = state.slides.length - slidesId.length - 1
    if (newIndex > maxIndex) newIndex = maxIndex

    state.slideIndex = newIndex
    state.slides = state.slides.filter(item => !slidesId.includes(item.id))
  },

  [MutationTypes.UPDATE_SLIDE_INDEX](state, index: number) {
    state.slideIndex = index
  },

  [MutationTypes.UPDATE_SELECTED_SLIDES_INDEX](state, selectedSlidesIndex: number[]) {
    state.selectedSlidesIndex = selectedSlidesIndex
  },

  [MutationTypes.ADD_ELEMENT](state, element: PPTElement | PPTElement[]) {
    const elements = Array.isArray(element) ? element : [element]
    const currentSlideEls = state.slides[state.slideIndex].elements
    const newEls = [...currentSlideEls, ...elements]
    state.slides[state.slideIndex].elements = newEls
  },

  [MutationTypes.UPDATE_ELEMENT](state, data: UpdateElementData) {
    const { id, props } = data
    const elIdList = typeof id === 'string' ? [id] : id

    const slideIndex = state.slideIndex
    const slide = state.slides[slideIndex]
    const elements = slide.elements.map(el => {
      return elIdList.includes(el.id) ? { ...el, ...props } : el
    })
    state.slides[slideIndex].elements = (elements as PPTElement[])
  },

  [MutationTypes.REMOVE_ELEMENT_PROPS](state, data: RemoveElementPropData) {
    const { id, propName } = data
    const propsNames = typeof propName === 'string' ? [propName] : propName

    const slideIndex = state.slideIndex
    const slide = state.slides[slideIndex]
    const elements = slide.elements.map(el => {
      return el.id === id ? omit(el, propsNames) : el
    })
    state.slides[slideIndex].elements = (elements as PPTElement[])
  },

  // snapshot

  [MutationTypes.SET_SNAPSHOT_CURSOR](state, cursor: number) {
    state.snapshotCursor = cursor
  },

  [MutationTypes.SET_SNAPSHOT_LENGTH](state, length: number) {
    state.snapshotLength = length
  },

  // keyboard

  [MutationTypes.SET_CTRL_KEY_STATE](state, isActive: boolean) {
    state.ctrlKeyState = isActive
  },
  [MutationTypes.SET_SHIFT_KEY_STATE](state, isActive: boolean) {
    state.shiftKeyState = isActive
  },

  // screen

  [MutationTypes.SET_SCREENING](state, screening) {
    state.screening = screening
  },
}