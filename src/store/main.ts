import { customAlphabet } from 'nanoid'
import { defineStore } from 'pinia'
import { CreatingElement, TextFormatPainter } from '@/types/edit'
import { ToolbarStates } from '@/types/toolbar'
import { DialogForExportTypes } from '@/types/export'
import { SYS_FONTS } from '@/configs/font'
import { TextAttrs, defaultRichTextAttrs } from '@/utils/prosemirror/utils'
import { isSupportFont } from '@/utils/font'

import { useSlidesStore } from './slides'

export interface MainState {
  activeElementIdList: string[]
  handleElementId: string
  activeGroupElementId: string
  hiddenElementIdList: string[]
  canvasPercentage: number
  canvasScale: number
  canvasDragged: boolean
  thumbnailsFocus: boolean
  editorAreaFocus: boolean
  disableHotkeys: boolean
  gridLineSize: number
  showRuler: boolean
  creatingElement: CreatingElement | null
  availableFonts: typeof SYS_FONTS
  toolbarState: ToolbarStates
  clipingImageElementId: string
  isScaling: boolean
  richTextAttrs: TextAttrs
  selectedTableCells: string[]
  selectedSlidesIndex: number[]
  dialogForExport: DialogForExportTypes
  databaseId: string
  textFormatPainter: TextFormatPainter | null
  showSelectPanel: boolean
}

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
export const databaseId = nanoid(10)

export const useMainStore = defineStore('main', {
  state: (): MainState => ({
    activeElementIdList: [], // Selected element ID collection, including handleElementId
    handleElementId: '', // ID of the element being operated
    activeGroupElementId: '', // Among the group element members, the ID of the selected element that can be operated independently
    hiddenElementIdList: [], // collection of hidden element IDs
    canvasPercentage: 90, // Canvas visible area percentage
    canvasScale: 1, // Canvas scaling (based on width 1000px)
    canvasDragged: false, // the canvas is dragged and moved
    thumbnailsFocus: false, // The left navigation thumbnail area is focused
    editorAreaFocus: false, // editor area focus
    disableHotkeys: false, // disable hotkeys
    gridLineSize: 0, // Grid line size (0 means no grid lines are displayed)
    showRuler: false, // show ruler
    creatingElement: null, // The element information being inserted, which needs to be inserted by drawing the element (text, shape, line)
    availableFonts: SYS_FONTS, // Fonts available in the current environment
    toolbarState: ToolbarStates.SLIDE_DESIGN, // Right toolbar state
    clipingImageElementId: '', // ID of the image currently being clipped
    richTextAttrs: defaultRichTextAttrs, // rich text status
    selectedTableCells: [], // selected table cells
    isScaling: false, // Element scaling is in progress
    selectedSlidesIndex: [], // currently selected page index collection
    dialogForExport: '', // export panel
    databaseId, // Identify the indexedDB database ID of the current application
    textFormatPainter: null, // text format painter
    showSelectPanel: false, // open select panel
  }),

  getters: {
    activeElementList(state) {
      const slidesStore = useSlidesStore()
      const currentSlide = slidesStore.currentSlide
      if (!currentSlide || !currentSlide.elements) return []
      return currentSlide.elements.filter(element => state.activeElementIdList.includes(element.id))
    },

    handleElement(state) {
      const slidesStore = useSlidesStore()
      const currentSlide = slidesStore.currentSlide
      if (!currentSlide || !currentSlide.elements) return null
      return currentSlide.elements.find(element => state.handleElementId === element.id) || null
    },
  },

  actions: {
    setActiveElementIdList(activeElementIdList: string[]) {
      if (activeElementIdList.length === 1) this.handleElementId = activeElementIdList[0]
      else this.handleElementId = ''

      this.activeElementIdList = activeElementIdList
    },

    setHandleElementId(handleElementId: string) {
      this.handleElementId = handleElementId
    },

    setActiveGroupElementId(activeGroupElementId: string) {
      this.activeGroupElementId = activeGroupElementId
    },

    setHiddenElementIdList(hiddenElementIdList: string[]) {
      this.hiddenElementIdList = hiddenElementIdList
    },

    setCanvasPercentage(percentage: number) {
      this.canvasPercentage = percentage
    },

    setCanvasScale(scale: number) {
      this.canvasScale = scale
    },

    setCanvasDragged(isDragged: boolean) {
      this.canvasDragged = isDragged
    },

    setThumbnailsFocus(isFocus: boolean) {
      this.thumbnailsFocus = isFocus
    },

    setEditorareaFocus(isFocus: boolean) {
      this.editorAreaFocus = isFocus
    },

    setDisableHotkeysState(disable: boolean) {
      this.disableHotkeys = disable
    },

    setGridLineSize(size: number) {
      this.gridLineSize = size
    },

    setRulerState(show: boolean) {
      this.showRuler = show
    },

    setCreatingElement(element: CreatingElement | null) {
      this.creatingElement = element
    },

    setAvailableFonts() {
      this.availableFonts = SYS_FONTS.filter(font => isSupportFont(font.value))
    },

    setToolbarState(toolbarState: ToolbarStates) {
      this.toolbarState = toolbarState
    },

    setClipingImageElementId(elId: string) {
      this.clipingImageElementId = elId
    },

    setRichtextAttrs(attrs: TextAttrs) {
      this.richTextAttrs = attrs
    },

    setSelectedTableCells(cells: string[]) {
      this.selectedTableCells = cells
    },

    setScalingState(isScaling: boolean) {
      this.isScaling = isScaling
    },

    updateSelectedSlidesIndex(selectedSlidesIndex: number[]) {
      this.selectedSlidesIndex = selectedSlidesIndex
    },

    setDialogForExport(type: DialogForExportTypes) {
      this.dialogForExport = type
    },

    setTextFormatPainter(textFormatPainter: TextFormatPainter | null) {
      this.textFormatPainter = textFormatPainter
    },

    setSelectPanelState(show: boolean) {
      this.showSelectPanel = show
    },
  },
})