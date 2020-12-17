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

      <EditableElement 
        v-for="(element, index) in elementList" 
        :key="element.elId"
        :elementInfo="element"
        :elementIndex="index + 1"
        :isActive="activeElementIdList.includes(element.elId)"
        :isHandleEl="element.elId === handleElementId"
        :isActiveGroupElement="activeGroupElementId === element.elId"
        :isMultiSelect="activeElementIdList.length > 1"
        :canvasScale="canvasScale"
        :selectElement="selectElement"
        :rotateElement="rotateElement"
        :scaleElement="scaleElement"
        :orderElement="orderElement"
        :combineElements="combineElements"
        :uncombineElements="uncombineElements"
        :alignElement="alignElement"
        :deleteElement="deleteElement"
        :lockElement="lockElement"
        :copyElement="copyElement"
        :cutElement="cutElement"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store/state'
import { MutationTypes } from '@/store/constants'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'
import { getImageDataURL } from '@/utils/image'

import useDropImage from '@/hooks/useDropImage'
import useSetViewportSize from './hooks/useSetViewportSize'

import EditableElement from '@/views/_common/_element/EditableElement.vue'
import MouseSelection from './MouseSelection.vue'
import SlideBackground from './SlideBackground.vue'
import AlignmentLine, { AlignmentLineProps } from './AlignmentLine.vue'

export default defineComponent({
  name: 'v-canvas',
  components: {
    EditableElement,
    MouseSelection,
    SlideBackground,
    AlignmentLine,
  },
  setup() {
    const store = useStore<State>()
    const elementList = computed(() => {
      const currentSlide = store.getters.currentSlide
      return currentSlide ? JSON.parse(JSON.stringify(currentSlide.elements)) : []
    })
    const activeElementIdList = computed(() => store.state.activeElementIdList)
    const handleElementId = computed(() => store.state.handleElementId)
    const activeGroupElementId = ref('')

    const viewportRef = ref<HTMLElement | null>(null)
    const isShowGridLines = ref(false)
    const alignmentLines = ref<AlignmentLineProps[]>([])
    const currentSlide = computed(() => store.getters.currentSlide)

    const dropImageFile = useDropImage(viewportRef)
    watch(dropImageFile, () => {
      if(dropImageFile.value) {
        getImageDataURL(dropImageFile.value).then(dataURL => {
          console.log(dataURL)
        })
      }
    })

    const canvasRef = ref<HTMLElement | null>(null)
    const { canvasScale, viewportLeft, viewportTop } = useSetViewportSize(canvasRef)
    const viewportStyles = computed(() => ({
      width: VIEWPORT_SIZE,
      height: VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO,
      left: viewportLeft.value,
      top: viewportTop.value,
    }))

    const mouseSelectionState = reactive({
      isShow: false,
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      quadrant: 1,
    })
    const updateMouseSelection = (e: MouseEvent) => {
      if(!viewportRef.value) return

      let isMouseDown = true
      const viewportRect = viewportRef.value.getBoundingClientRect()

      const minSelectionRange = 5
      
      const startPageX = e.pageX
      const startPageY = e.pageY

      const left = (startPageX - viewportRect.x) / canvasScale.value
      const top = (startPageY - viewportRect.y) / canvasScale.value

      mouseSelectionState.isShow = false
      mouseSelectionState.quadrant = 4
      mouseSelectionState.top = top
      mouseSelectionState.left = left
      mouseSelectionState.width = 0
      mouseSelectionState.height = 0

      document.onmousemove = e => {
        if(!isMouseDown) return

        const currentPageX = e.pageX
        const currentPageY = e.pageY

        const offsetWidth = (currentPageX - startPageX) / canvasScale.value
        const offsetHeight = (currentPageY - startPageY) / canvasScale.value

        const width = Math.abs(offsetWidth)
        const height = Math.abs(offsetHeight)

        if( width < minSelectionRange || height < minSelectionRange ) return
        
        let quadrant = 0
        if( offsetWidth > 0 && offsetHeight > 0 ) quadrant = 4
        else if( offsetWidth < 0 && offsetHeight < 0 ) quadrant = 1
        else if( offsetWidth > 0 && offsetHeight < 0 ) quadrant = 2
        else if( offsetWidth < 0 && offsetHeight > 0 ) quadrant = 3

        mouseSelectionState.isShow = true
        mouseSelectionState.quadrant = quadrant
        mouseSelectionState.width = width
        mouseSelectionState.height = height
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        isMouseDown = false

        mouseSelectionState.isShow = false
      }
    }

    const editorAreaFocus = computed(() => store.state.editorAreaFocus)

    const handleClickBlankArea = (e: MouseEvent) => {
      updateMouseSelection(e)
      if(!editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, true)
    }

    const removeEditorAreaFocus = () => {
      if(editorAreaFocus.value) store.commit(MutationTypes.SET_EDITORAREA_FOCUS, false)
    }

    const selectElement = () => {
      console.log('selectElement')
    }
    const rotateElement = () => {
      console.log('rotateElement')
    }
    const scaleElement = () => {
      console.log('scaleElement')
    }
    const orderElement = () => {
      console.log('orderElement')
    }
    const combineElements = () => {
      console.log('combineElements')
    }
    const uncombineElements = () => {
      console.log('uncombineElements')
    }
    const alignElement = () => {
      console.log('alignElement')
    }
    const deleteElement = () => {
      console.log('deleteElement')
    }
    const lockElement = () => {
      console.log('lockElement')
    }
    const copyElement = () => {
      console.log('copyElement')
    }
    const cutElement = () => {
      console.log('cutElement')
    }

    const contextmenus = (): ContextmenuItem[] => {
      return [
        {
          text: '全选',
          subText: 'Ctrl + A',
        },
        {
          text: '粘贴',
          subText: 'Ctrl + V',
        },
        {
          text: '清空页面',
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
      orderElement,
      combineElements,
      uncombineElements,
      alignElement,
      deleteElement,
      lockElement,
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