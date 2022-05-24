<template>
  <div 
    class="canvas" 
    ref="canvasRef"
    @wheel="$event => handleMousewheelCanvas($event)"
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
          :openLinkDialog="openLinkDialog"
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
          v-if="mouseSelectionVisible"
          :top="mouseSelection.top" 
          :left="mouseSelection.left" 
          :width="mouseSelection.width" 
          :height="mouseSelection.height" 
          :quadrant="mouseSelectionQuadrant"
        />      
        <EditableElement 
          v-for="(element, index) in elementList" 
          :key="element.id"
          :elementInfo="element"
          :elementIndex="index + 1"
          :isMultiSelect="activeElementIdList.length > 1"
          :selectElement="selectElement"
          :openLinkDialog="openLinkDialog"
        />
      </div>
    </div>

    <div class="drag-mask" v-if="spaceKeyState"></div>

    <Ruler :viewportStyles="viewportStyles" v-if="showRuler" />

    <Modal
      v-model:visible="linkDialogVisible" 
      :footer="null" 
      centered
      :width="540"
      destroyOnClose
    >
      <LinkDialog @close="linkDialogVisible = false" />
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, ref, watch, watchEffect } from 'vue'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore, useKeyboardStore } from '@/store'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { PPTElement } from '@/types/slides'
import { AlignmentLineProps } from '@/types/edit'
import { injectKeySlideScale } from '@/types/injectKey'
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
import Ruler from './Ruler.vue'
import ElementCreateSelection from './ElementCreateSelection.vue'
import MultiSelectOperate from './Operate/MultiSelectOperate.vue'
import Operate from './Operate/index.vue'
import LinkDialog from './LinkDialog.vue'

export default defineComponent({
  name: 'editor-canvas',
  components: {
    EditableElement,
    MouseSelection,
    ViewportBackground,
    AlignmentLine,
    Ruler,
    ElementCreateSelection,
    MultiSelectOperate,
    Operate,
    LinkDialog,
  },
  setup() {
    const mainStore = useMainStore()
    const {
      activeElementIdList,
      activeGroupElementId,
      handleElementId,
      editorAreaFocus,
      showGridLines,
      showRuler,
      creatingElement,
      canvasScale,
    } = storeToRefs(mainStore)
    const { currentSlide } = storeToRefs(useSlidesStore())
    const { ctrlKeyState, spaceKeyState } = storeToRefs(useKeyboardStore())

    const viewportRef = ref<HTMLElement>()
    const alignmentLines = ref<AlignmentLineProps[]>([])

    const linkDialogVisible = ref(false)
    const openLinkDialog = () => linkDialogVisible.value = true

    watch(handleElementId, () => {
      mainStore.setActiveGroupElementId('')
    })

    const elementList = ref<PPTElement[]>([])
    const setLocalElementList = () => {
      elementList.value = currentSlide.value ? JSON.parse(JSON.stringify(currentSlide.value.elements)) : []
    }
    watchEffect(setLocalElementList)

    const canvasRef = ref<HTMLElement>()
    const { dragViewport, viewportStyles } = useViewportSize(canvasRef)

    useDropImageOrText(canvasRef)

    const { mouseSelection, mouseSelectionVisible, mouseSelectionQuadrant, updateMouseSelection } = useMouseSelection(elementList, viewportRef)

    const { dragElement } = useDragElement(elementList, alignmentLines)
    const { dragLineElement } = useDragLineElement(elementList)
    const { selectElement } = useSelectElement(elementList, dragElement)
    const { scaleElement, scaleMultiElement } = useScaleElement(elementList, alignmentLines)
    const { rotateElement } = useRotateElement(elementList, viewportRef)

    const { selectAllElement } = useSelectAllElement()
    const { deleteAllElements } = useDeleteElement()
    const { pasteElement } = useCopyAndPasteElement()
    const { enterScreeningFromStart } = useScreening()
    const { updateSlideIndex } = useSlideHandler()

    // 组件渲染时，如果存在元素焦点，需要清除
    // 这种情况存在于：有焦点元素的情况下进入了放映模式，再退出时，需要清除原先的焦点（因为可能已经切换了页面）
    onMounted(() => {
      if (activeElementIdList.value.length) mainStore.setActiveElementIdList([])
    })

    // 点击画布的空白区域：清空焦点元素、设置画布焦点、清除文字选区
    const handleClickBlankArea = (e: MouseEvent) => {
      mainStore.setActiveElementIdList([])

      if (!spaceKeyState.value) updateMouseSelection(e)
      else dragViewport(e)

      if (!editorAreaFocus.value) mainStore.setEditorareaFocus(true)
      removeAllRanges()
    }

    // 移除画布编辑区域焦点
    const removeEditorAreaFocus = () => {
      if (editorAreaFocus.value) mainStore.setEditorareaFocus(false)
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
    const toggleGridLines = () => {
      mainStore.setGridLinesState(!showGridLines.value)
    }

    // 开关标尺
    const toggleRuler = () => {
      mainStore.setRulerState(!showRuler.value)
    }

    // 在鼠标绘制的范围插入元素
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
          text: '标尺',
          subText: showRuler.value ? '√' : '',
          handler: toggleRuler,
        },
        {
          text: '重置当前页',
          handler: deleteAllElements,
        },
        { divider: true },
        {
          text: '幻灯片放映',
          subText: 'F5',
          handler: enterScreeningFromStart,
        },
      ]
    }

    provide(injectKeySlideScale, canvasScale)

    return {
      elementList,
      activeElementIdList,
      handleElementId,
      activeGroupElementId,
      canvasRef,
      viewportRef,
      viewportStyles,
      canvasScale,
      mouseSelection,
      mouseSelectionVisible,
      mouseSelectionQuadrant,
      creatingElement,
      alignmentLines,
      linkDialogVisible,
      spaceKeyState,
      showRuler,
      openLinkDialog,
      handleClickBlankArea,
      removeEditorAreaFocus,
      insertElementFromCreateSelection,
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
.drag-mask {
  cursor: grab;
  @include absolute-0();
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