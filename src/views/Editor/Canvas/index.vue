<template>
  <div 
    class="canvas" 
    ref="canvasRef"
    @mousewheel="$event => handleMousewheelCanvas($event)"
    @mousedown="$event => handleClickBlankArea($event)"
    v-contextmenu="contextmenus"
    v-click-outside="removeEditorAreaFocus"
  >
    <ElementCreateSelection
      v-if="creatingElement"
      @created="data => insertElementFromCreateSelection(data)"
    />
    <div 
      class="viewport-wrapper"
      :style="{
        width: viewportStyles.width * canvasScale + 'px',
        height: viewportStyles.height * canvasScale + 'px',
        left: viewportStyles.left + 'px',
        top: viewportStyles.top + 'px',
      }"
    >
      <div class="operates">
        <AlignmentLine 
          v-for="(line, index) in alignmentLines" 
          :key="index" 
          :type="line.type" 
          :axis="line.axis" 
          :length="line.length"
        />
        <MultiSelectOperate 
          v-if="activeElementIdList.length > 1"
          :elementList="elementList"
          :scaleMultiElement="scaleMultiElement"
        />
        <Operate
          v-for="element in elementList" 
          :key="element.id"
          :elementInfo="element"
          :isSelected="activeElementIdList.includes(element.id)"
          :isActive="handleElementId === element.id"
          :isActiveGroupElement="activeGroupElementId === element.id"
          :isMultiSelect="activeElementIdList.length > 1"
          :rotateElement="rotateElement"
          :scaleElement="scaleElement"
          :dragLineElement="dragLineElement"
        />
        <ViewportBackground />
      </div>

      <div 
        class="viewport" 
        ref="viewportRef"
        :style="{ transform: `scale(${canvasScale})` }"
      >
        <MouseSelection 
          v-if="mouseSelectionState.isShow"
          :top="mouseSelectionState.top" 
          :left="mouseSelectionState.left" 
          :width="mouseSelectionState.width" 
          :height="mouseSelectionState.height" 
          :quadrant="mouseSelectionState.quadrant"
        />      
        <EditableElement 
          v-for="(element, index) in elementList" 
          :key="element.id"
          :elementInfo="element"
          :elementIndex="index + 1"
          :isMultiSelect="activeElementIdList.length > 1"
          :selectElement="selectElement"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, ref, watch, watchEffect } from 'vue'
import { throttle } from 'lodash'
import { MutationTypes, useStore } from '@/store'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { PPTElement, Slide } from '@/types/slides'
import { AlignmentLineProps } from '@/types/edit'
import { removeAllRanges } from '@/utils/selection'
import { KEYS } from '@/configs/hotkey'

import useViewportSize from './hooks/useViewportSize'
import useMouseSelection from './hooks/useMouseSelection'
import useDropImageOrText from './hooks/useDropImageOrText'
import useRotateElement from './hooks/useRotateElement'
import useScaleElement from './hooks/useScaleElement'
import useSelectElement from './hooks/useSelectElement'
import useDragElement from './hooks/useDragElement'
import useDragLineElement from './hooks/useDragLineElement'
import useInsertFromCreateSelection from './hooks/useInsertFromCreateSelection'

import useDeleteElement from '@/hooks/useDeleteElement'
import useCopyAndPasteElement from '@/hooks/useCopyAndPasteElement'
import useSelectAllElement from '@/hooks/useSelectAllElement'
import useScaleCanvas from '@/hooks/useScaleCanvas'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'

import EditableElement from './EditableElement.vue'
import MouseSelection from './MouseSelection.vue'
import ViewportBackground from './ViewportBackground.vue'
import AlignmentLine from './AlignmentLine.vue'
import ElementCreateSelection from './ElementCreateSelection.vue'
import MultiSelectOperate from './Operate/MultiSelectOperate.vue'
import Operate from './Operate/index.vue'

export default defineComponent({
  name: 'editor-canvas',
  components: {
    EditableElement,
    MouseSelection,
    ViewportBackground,
    AlignmentLine,
    ElementCreateSelection,
    MultiSelectOperate,
    Operate,
  },
  setup() {
    const store = useStore()

    const activeElementIdList = computed(() => store.state.activeElementIdList)
    const handleElementId = computed(() => store.state.handleElementId)
    const activeGroupElementId = computed(() => store.state.activeGroupElementId)
    const editorAreaFocus = computed(() => store.state.editorAreaFocus)
    const ctrlKeyState = computed(() => store.state.ctrlKeyState)
    const ctrlOrShiftKeyActive = computed<boolean>(() => store.getters.ctrlOrShiftKeyActive)

    const viewportRef = ref<HTMLElement>()
    const alignmentLines = ref<AlignmentLineProps[]>([])

    watch(handleElementId, () => {
      store.commit(MutationTypes.SET_ACTIVE_GROUP_ELEMENT_ID, '')
    })

    const currentSlide = computed<Slide>(() => store.getters.currentSlide)
    const elementList = ref<PPTElement[]>([])
    const setLocalElementList = () => {
      elementList.value = currentSlide.value ? JSON.parse(JSON.stringify(currentSlide.value.elements)) : []
    }
    watchEffect(setLocalElementList)

    const canvasRef = ref<HTMLElement>()
    const canvasScale = computed(() => store.state.canvasScale)
    const { viewportStyles } = useViewportSize(canvasRef)

    useDropImageOrText(canvasRef)

    const { mouseSelectionState, updateMouseSelection } = useMouseSelection(elementList, viewportRef)

    const { dragElement } = useDragElement(elementList, alignmentLines)
    const { dragLineElement } = useDragLineElement(elementList)
    const { selectElement } = useSelectElement(elementList, dragElement)
    const { scaleElement, scaleMultiElement } = useScaleElement(elementList, alignmentLines)
    const { rotateElement } = useRotateElement(elementList, viewportRef)

    const { selectAllElement } = useSelectAllElement()
    const { deleteAllElements } = useDeleteElement()
    const { pasteElement } = useCopyAndPasteElement()
    const { enterScreening } = useScreening()
    const { updateSlideIndex } = useSlideHandler()

    // 点击画布的空白区域：清空焦点元素、设置画布焦点、清除文字选区
    const handleClickBlankArea = (e: MouseEvent) => {
      store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
      if (!ctrlOrShiftKeyActive.value) updateMouseSelection(e)
      if (!editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, true)
      removeAllRanges()
    }

    // 移除画布编辑区域焦点
    const removeEditorAreaFocus = () => {
      if (editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, false)
    }

    // 滚动鼠标
    const { scaleCanvas } = useScaleCanvas()
    const throttleScaleCanvas = throttle(scaleCanvas, 100, { leading: true, trailing: false })
    const throttleUpdateSlideIndex = throttle(updateSlideIndex, 300, { leading: true, trailing: false })

    const handleMousewheelCanvas = (e: WheelEvent) => {
      e.preventDefault()

      // 按住Ctrl键时：缩放画布
      if (ctrlKeyState.value) {
        if (e.deltaY > 0) throttleScaleCanvas('-')
        else if (e.deltaY < 0) throttleScaleCanvas('+')
      }
      // 上下翻页
      else {
        if (e.deltaY > 0) throttleUpdateSlideIndex(KEYS.DOWN)
        else if (e.deltaY < 0) throttleUpdateSlideIndex(KEYS.UP)
      }
    }

    // 开关网格线
    const showGridLines = computed(() => store.state.showGridLines)
    const toggleGridLines = () => {
      store.commit(MutationTypes.SET_GRID_LINES_STATE, !showGridLines.value)
    }

    // 在鼠标绘制的范围插入元素
    const creatingElement = computed(() => store.state.creatingElement)
    const { insertElementFromCreateSelection } = useInsertFromCreateSelection(viewportRef)

    const contextmenus = (): ContextmenuItem[] => {
      return [
        {
          text: '粘贴',
          subText: 'Ctrl + V',
          handler: pasteElement,
        },
        {
          text: '全选',
          subText: 'Ctrl + A',
          handler: selectAllElement,
        },
        {
          text: '网格线',
          subText: showGridLines.value ? '√' : '',
          handler: toggleGridLines,
        },
        {
          text: '重置当前页',
          handler: deleteAllElements,
        },
        { divider: true },
        {
          text: '从当前页演示',
          subText: 'Ctrl+F',
          handler: enterScreening,
        },
      ]
    }

    provide('slideScale', canvasScale)

    return {
      elementList,
      activeElementIdList,
      handleElementId,
      activeGroupElementId,
      canvasRef,
      viewportRef,
      viewportStyles,
      canvasScale,
      mouseSelectionState,
      handleClickBlankArea,
      removeEditorAreaFocus,
      currentSlide,
      creatingElement,
      insertElementFromCreateSelection,
      alignmentLines,
      selectElement,
      rotateElement,
      scaleElement,
      dragLineElement,
      scaleMultiElement,
      handleMousewheelCanvas,
      contextmenus,
    }
  },
})
</script>

<style lang="scss" scoped>
.canvas {
  height: 100%;
  user-select: none;
  overflow: hidden;
  background-color: $lightGray;
  position: relative;
}
.viewport-wrapper {
  position: absolute;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
}
.viewport {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
}
</style>