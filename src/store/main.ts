import { customAlphabet } from 'nanoid'
import { defineStore } from 'pinia'
import { ToolbarStates } from '@/types/toolbar'
import type { CreatingElement, ShapeFormatPainter, TextFormatPainter } from '@/types/edit'
import type { DialogForExportTypes } from '@/types/export'
import { type TextAttrs, defaultRichTextAttrs } from '@/utils/prosemirror/utils'
import { SYS_FONTS } from '@/configs/font'
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
  creatingCustomShape: boolean
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
  shapeFormatPainter: ShapeFormatPainter | null
  showSelectPanel: boolean
  showSearchPanel: boolean
  showNotesPanel: boolean
}

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
export const databaseId = nanoid(10)

export const useMainStore = defineStore('main', {
  state: (): MainState => ({
    activeElementIdList: [], // 被选中的元素ID集合，包含 handleElementId
    handleElementId: '', // 正在操作的元素ID
    activeGroupElementId: '', // 组合元素成员中，被选中可独立操作的元素ID
    hiddenElementIdList: [], // 被隐藏的元素ID集合
    canvasPercentage: 90, // 画布可视区域百分比
    canvasScale: 1, // 画布缩放比例（基于宽度{{slidesStore.viewportSize}}像素）
    canvasDragged: false, // 画布被拖拽移动
    thumbnailsFocus: false, // 左侧导航缩略图区域聚焦
    editorAreaFocus: false, //  编辑区域聚焦
    disableHotkeys: false, // 禁用快捷键
    gridLineSize: 0, // 网格线尺寸（0表示不显示网格线）
    showRuler: false, // 显示标尺
    creatingElement: null, // 正在插入的元素信息，需要通过绘制插入的元素（文字、形状、线条）
    creatingCustomShape: false, // 正在绘制任意多边形
    availableFonts: SYS_FONTS, // 当前环境可用字体
    toolbarState: ToolbarStates.SLIDE_DESIGN, // 右侧工具栏状态
    clipingImageElementId: '', // 当前正在裁剪的图片ID  
    richTextAttrs: defaultRichTextAttrs, // 富文本状态
    selectedTableCells: [], // 选中的表格单元格
    isScaling: false, // 正在进行元素缩放
    selectedSlidesIndex: [], // 当前被选中的页面索引集合
    dialogForExport: '', // 导出面板
    databaseId, // 标识当前应用的indexedDB数据库ID
    textFormatPainter: null, // 文字格式刷
    shapeFormatPainter: null, // 形状格式刷
    showSelectPanel: false, // 打开选择面板
    showSearchPanel: false, // 打开查找替换面板
    showNotesPanel: false, // 打开批注面板
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
  
    setCreatingCustomShapeState(state: boolean) {
      this.creatingCustomShape = state
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

    setShapeFormatPainter(shapeFormatPainter: ShapeFormatPainter | null) {
      this.shapeFormatPainter = shapeFormatPainter
    },

    setSelectPanelState(show: boolean) {
      this.showSelectPanel = show
    },

    setSearchPanelState(show: boolean) {
      this.showSearchPanel = show
    },

    setNotesPanelState(show: boolean) {
      this.showNotesPanel = show
    },
  },
})