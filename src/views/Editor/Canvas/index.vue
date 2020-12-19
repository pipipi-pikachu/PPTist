<template>
  <div 
    class="canvas" 
    ref="canvasRef"
    @mousedown="$event => handleClickBlankArea($event)"
    v-contextmenu="contextmenus"
    v-click-outside="removeEditorAreaFocus"
  >
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

      <SlideBackground 
        :background="currentSlide?.background"
        :isShowGridLines="isShowGridLines"
      />

      <AlignmentLine 
        v-for="(line, index) in alignmentLines" :key="index" 
        :type="line.type" :axis="line.axis" :length="line.length"
      />

      <MultiSelectOperate 
        v-if="activeElementIdList.length > 1"
        :elementList="elementList"
        :scaleMultiElement="scaleMultiElement"
      />

      <EditableElement 
        v-for="(element, index) in elementList" 
        :key="element.elId"
        :elementInfo="element"
        :elementIndex="index + 1"
        :isActive="activeElementIdList.includes(element.elId)"
        :isHandleEl="element.elId === handleElementId"
        :isActiveGroupElement="activeGroupElementId === element.elId"
        :isMultiSelect="activeElementIdList.length > 1"
        :selectElement="selectElement"
        :rotateElement="rotateElement"
        :scaleElement="scaleElement"
        :orderElement="orderElement"
        :combineElements="combineElements"
        :uncombineElements="uncombineElements"
        :alignElementToCanvas="alignElementToCanvas"
        :deleteElement="deleteElement"
        :lockElement="lockElement"
        :unlockElement="unlockElement"
        :copyElement="copyElement"
        :cutElement="cutElement"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { PPTElement } from '@/types/slides'
import { AlignmentLineProps } from './types/index'

import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import { getImageDataURL } from '@/utils/image'

import useDropImage from '@/hooks/useDropImage'
import useViewportSize from './hooks/useViewportSize'
import useLockElement from './hooks/useLockElement'
import useDeleteElement from './hooks/useDeleteElement'
import useCombineElement from './hooks/useCombineElement'
import useOrderElement from './hooks/useOrderElement'
import useAlignElementToCanvas from './hooks/useAlignElementToCanvas'
import useCopyAndPasteElement from './hooks/useCopyAndPasteElement'
import useRotateElement from './hooks/useRotateElement'
import useScaleElement from './hooks/useScaleElement'
import useSelectElement from './hooks/useSelectElement'
import useMoveElement from './hooks/useMoveElement'
import useMouseSelection from './hooks/useMouseSelection'

import EditableElement from '@/views/_common/_element/EditableElement.vue'
import MouseSelection from './MouseSelection.vue'
import SlideBackground from './SlideBackground.vue'
import MultiSelectOperate from './MultiSelectOperate.vue'
import AlignmentLine from './AlignmentLine.vue'

export default defineComponent({
  name: 'editor-canvas',
  components: {
    EditableElement,
    MouseSelection,
    SlideBackground,
    MultiSelectOperate,
    AlignmentLine,
  },
  setup() {
    const store = useStore<State>()

    const activeElementIdList = computed(() => store.state.activeElementIdList)
    const activeElementList = computed(() => store.getters.activeElementList)
    const handleElementId = computed(() => store.state.handleElementId)
    const ctrlOrShiftKeyActive = computed(() => store.getters.ctrlOrShiftKeyActive)
    const editorAreaFocus = computed(() => store.state.editorAreaFocus)

    const viewportRef = ref<HTMLElement | null>(null)
    const isShowGridLines = ref(false)
    const alignmentLines = ref<AlignmentLineProps[]>([])

    const activeGroupElementId = ref('')
    watch(handleElementId, () => activeGroupElementId.value = '')

    const currentSlide = computed(() => store.getters.currentSlide)
    const elementList = ref<PPTElement[]>([])
    const setLocalElementList = () => {
      elementList.value = currentSlide.value ? JSON.parse(JSON.stringify(currentSlide.value.elements)) : []
    }
    watchEffect(setLocalElementList)

    const dropImageFile = useDropImage(viewportRef)
    watch(dropImageFile, () => {
      if(dropImageFile.value) {
        getImageDataURL(dropImageFile.value).then(dataURL => {
          console.log(dataURL)
        })
      }
    })

    const canvasRef = ref<HTMLElement | null>(null)
    const { canvasScale, viewportLeft, viewportTop } = useViewportSize(canvasRef)
    const viewportStyles = computed(() => ({
      width: VIEWPORT_SIZE,
      height: VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO,
      left: viewportLeft.value,
      top: viewportTop.value,
    }))

    const { mouseSelectionState, updateMouseSelection } = useMouseSelection(elementList, viewportRef, canvasScale)

    const handleClickBlankArea = (e: MouseEvent) => {
      store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
      if(!ctrlOrShiftKeyActive.value) updateMouseSelection(e)
      if(!editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, true)
    }

    const removeEditorAreaFocus = () => {
      if(editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, false)
    }

    const { moveElement } = useMoveElement(elementList, activeElementIdList, activeGroupElementId, canvasScale, alignmentLines)
    const { selectElement, selectAllElement } = useSelectElement(elementList, activeElementIdList, activeGroupElementId, editorAreaFocus, handleElementId, moveElement)
    const { scaleElement, scaleMultiElement } = useScaleElement(elementList, canvasScale, activeGroupElementId, activeElementIdList, alignmentLines)
    const { rotateElement } = useRotateElement(elementList, viewportRef, canvasScale)  
    const { orderElement } = useOrderElement(elementList)
    const { alignElementToCanvas } = useAlignElementToCanvas(elementList, activeElementList, activeElementIdList)
    const { combineElements, uncombineElements } = useCombineElement(elementList, activeElementList, activeElementIdList)
    const { deleteElement, deleteAllElements } = useDeleteElement(elementList, activeElementIdList)
    const { lockElement, unlockElement } = useLockElement(elementList, activeElementIdList)
    const { copyElement, cutElement, pasteElement } = useCopyAndPasteElement(deleteElement, activeElementList, activeElementIdList)

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
      activeElementList,
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
      orderElement,
      combineElements,
      uncombineElements,
      alignElementToCanvas,
      deleteElement,
      lockElement,
      unlockElement,
      copyElement,
      cutElement,
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
</style>