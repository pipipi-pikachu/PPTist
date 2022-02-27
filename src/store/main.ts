import { defineStore } from 'pinia'
import { CreatingElement } from '@/types/edit'
import { ToolbarStates } from '@/types/toolbar'
import { SYS_FONTS } from '@/configs/font'
import { TextAttrs, defaultRichTextAttrs } from '@/utils/prosemirror/utils'
import { isSupportFont } from '@/utils/font'

import { useSlidesStore } from './slides'

export interface MainState {
  activeElementIdList: string[];
  handleElementId: string;
  activeGroupElementId: string;
  canvasPercentage: number;
  canvasScale: number;
  thumbnailsFocus: boolean;
  editorAreaFocus: boolean;
  disableHotkeys: boolean;
  showGridLines: boolean;
  creatingElement: CreatingElement | null;
  availableFonts: typeof SYS_FONTS;
  toolbarState: ToolbarStates;
  clipingImageElementId: string;
  isScaling: boolean;
  richTextAttrs: TextAttrs;
  selectedTableCells: string[];
  editingShapeElementId: string;
  selectedSlidesIndex: number[];
}

export const useMainStore = defineStore('main', {
  state: (): MainState => ({
    activeElementIdList: [], // 被选中的元素ID集合，包含 handleElementId
    handleElementId: '', // 正在操作的元素ID
    activeGroupElementId: '', // 组合元素成员中，被选中可独立操作的元素ID
    canvasPercentage: 90, // 画布可视区域百分比
    canvasScale: 1, // 画布缩放比例（基于宽度1000px）
    thumbnailsFocus: false, // 左侧导航缩略图区域聚焦
    editorAreaFocus: false, //  编辑区域聚焦
    disableHotkeys: false, // 禁用快捷键
    showGridLines: false, // 显示网格线
    creatingElement: null, // 正在插入的元素信息，需要通过绘制插入的元素（文字、形状、线条）
    availableFonts: [], // 当前环境可用字体
    toolbarState: ToolbarStates.SLIDE_DESIGN, // 右侧工具栏状态
    clipingImageElementId: '', // 当前正在裁剪的图片ID  
    richTextAttrs: defaultRichTextAttrs, // 富文本状态
    selectedTableCells: [], // 选中的表格单元格
    isScaling: false, // 正在进行元素缩放
    editingShapeElementId: '', // 当前正处在编辑文字状态的形状ID  
    selectedSlidesIndex: [], // 当前被选中的页面索引集合
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
  
    setCanvasPercentage(percentage: number) {
      this.canvasPercentage = percentage
    },
  
    setCanvasScale(scale: number) {
      this.canvasScale = scale
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
  
    setGridLinesState(show: boolean) {
      this.showGridLines = show
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
  
    setEditingShapeElementId(ellId: string) {
      this.editingShapeElementId = ellId
    },
    
    updateSelectedSlidesIndex(selectedSlidesIndex: number[]) {
      this.selectedSlidesIndex = selectedSlidesIndex
    },
  },
})