<template>
  <div 
    class="canvas" 
    ref="canvasRef"
    @mousewheel="$event => mousewheelScaleCanvas($event)"
    @mousedown="$event => handleClickBlankArea($event)"
    v-contextmenu="contextmenus"
    v-click-outside="removeEditorAreaFocus"
  >
    <div 
      class="operates"
      :style="{
        left: viewportStyles.left + 'px',
        top: viewportStyles.top + 'px',
      }"
    >
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
      />
    </div>

    <div 
      class="viewport" 
      ref="viewportRef"
      :style="{
        width: viewportStyles.width + 'px',
        height: viewportStyles.height + 'px',
        left: viewportStyles.left + 'px',
        top: viewportStyles.top + 'px',
        transform: `scale(${canvasScale})`,
      }"
    >
      <MouseSelection 
        v-if="mouseSelectionState.isShow"
        :top="mouseSelectionState.top" 
        :left="mouseSelectionState.left" 
        :width="mouseSelectionState.width" 
        :height="mouseSelectionState.height" 
        :quadrant="mouseSelectionState.quadrant"
      />
      <SlideBackground />
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
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import throttle from 'lodash/throttle'
import { State, MutationTypes } from '@/store'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { PPTElement, Slide } from '@/types/slides'
import { AlignmentLineProps } from '@/types/edit'

import useViewportSize from './hooks/useViewportSize'
import useMouseSelection from './hooks/useMouseSelection'
import useDropImageOrText from './hooks/useDropImageOrText'
import useRotateElement from './hooks/useRotateElement'
import useScaleElement from './hooks/useScaleElement'
import useSelectElement from './hooks/useSelectElement'
import useDragElement from './hooks/useDragElement'

import useDeleteElement from '@/hooks/useDeleteElement'
import useCopyAndPasteElement from '@/hooks/useCopyAndPasteElement'
import useSelectAllElement from '@/hooks/useSelectAllElement'
import useScaleCanvas from '@/hooks/useScaleCanvas'

import EditableElement from '@/views/_element/EditableElement.vue'
import MouseSelection from './MouseSelection.vue'
import SlideBackground from './SlideBackground.vue'
import AlignmentLine from './AlignmentLine.vue'
import MultiSelectOperate from './Operate/MultiSelectOperate.vue'
import Operate from './Operate/index.vue'

export default defineComponent({
  name: 'editor-canvas',
  components: {
    EditableElement,
    MouseSelection,
    SlideBackground,
    AlignmentLine,
    MultiSelectOperate,
    Operate,
  },
  setup() {
    const store = useStore<State>()

    const activeElementIdList = computed(() => store.state.activeElementIdList)
    const handleElementId = computed(() => store.state.handleElementId)
    const editorAreaFocus = computed(() => store.state.editorAreaFocus)
    const ctrlKeyState = computed(() => store.state.ctrlKeyState)
    const ctrlOrShiftKeyActive: Ref<boolean> = computed(() => store.getters.ctrlOrShiftKeyActive)

    const viewportRef = ref<HTMLElement | null>(null)
    const isShowGridLines = ref(false)
    const alignmentLines = ref<AlignmentLineProps[]>([])

    const activeGroupElementId = ref('')
    watch(handleElementId, () => activeGroupElementId.value = '')

    const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)
    const elementList = ref<PPTElement[]>([])
    const setLocalElementList = () => {
      elementList.value = currentSlide.value ? JSON.parse(JSON.stringify(currentSlide.value.elements)) : []
    }
    watchEffect(setLocalElementList)

    useDropImageOrText(viewportRef)

    const canvasRef = ref<HTMLElement | null>(null)
    const canvasScale = computed(() => store.state.canvasScale)
    const { viewportStyles } = useViewportSize(canvasRef)

    const { mouseSelectionState, updateMouseSelection } = useMouseSelection(elementList, viewportRef)

    const { dragElement } = useDragElement(elementList, activeGroupElementId, alignmentLines)
    const { selectElement } = useSelectElement(elementList, activeGroupElementId, dragElement)
    const { scaleElement, scaleMultiElement } = useScaleElement(elementList, activeGroupElementId, alignmentLines)
    const { rotateElement } = useRotateElement(elementList, viewportRef)

    const { selectAllElement } = useSelectAllElement()
    const { deleteAllElements } = useDeleteElement()
    const { pasteElement } = useCopyAndPasteElement()

    const handleClickBlankArea = (e: MouseEvent) => {
      store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
      if(!ctrlOrShiftKeyActive.value) updateMouseSelection(e)
      if(!editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, true)
    }

    const removeEditorAreaFocus = () => {
      if(editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, false)
    }

    const { scaleCanvas } = useScaleCanvas()
    const throttleScaleCanvas = throttle(scaleCanvas, 100, { leading: true, trailing: false })

    const mousewheelScaleCanvas = (e: WheelEvent) => {
      if(!ctrlKeyState.value) return

      e.preventDefault()
      if(e.deltaY > 0) throttleScaleCanvas('-')
      else if(e.deltaY < 0) throttleScaleCanvas('+')
    }

    const contextmenus = (): ContextmenuItem[] => {
      return [
        {
          text: '全选',
          subText: 'Ctrl + A',
          handler: selectAllElement,
        },
        {
          text: '粘贴',
          subText: 'Ctrl + V',
          handler: pasteElement,
        },
        {
          text: '清空本页',
          handler: deleteAllElements,
        },
      ]
    }

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
      isShowGridLines,
      alignmentLines,
      selectElement,
      rotateElement,
      scaleElement,
      scaleMultiElement,
      mousewheelScaleCanvas,
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
  background-color: #f9f9f9;
  position: relative;
}
.viewport {
  position: absolute;
  transform-origin: 0 0;
  background-color: #fff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, .1);
}
.operates {
  position: absolute;
}
</style>