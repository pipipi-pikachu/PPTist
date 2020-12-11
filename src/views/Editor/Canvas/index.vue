<template>
  <div 
    class="canvas" 
    ref="canvasRef"
    @mousedown="$event => handleClickBlankArea($event)"
  >
    <div 
      class="viewport" 
      ref="viewportRef"
      :style="{
        width: viewportStyles.width + 'px',
        height: viewportStyles.height + 'px',
        left: viewportStyles.left + 'px',
        top: viewportStyles.top + 'px',
        transform: `scale(${viewportStyles.scale})`,
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
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store/state'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'

import MouseSelection from './MouseSelection.vue'

export default defineComponent({
  name: 'v-canvas',
  components: {
    MouseSelection,
  },
  setup() {
    const viewportStyles = reactive({
      width: VIEWPORT_SIZE,
      height: VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO,
      left: 0,
      top: 0,
      scale: 1,
    })

    const canvasRef = ref<Element | null>(null)
    const canvasScale = ref(1)

    const store = useStore<State>()
    const editorAreaShowScale = computed(() => store.state.editorAreaShowScale)
    const setViewportSize = () => {
      if(!canvasRef.value) return
      const canvasWidth = canvasRef.value.clientWidth
      const canvasHeight = canvasRef.value.clientHeight

      if(canvasHeight / canvasWidth > VIEWPORT_ASPECT_RATIO) {
        const viewportActualWidth = canvasWidth * (editorAreaShowScale.value / 100)
        canvasScale.value = viewportActualWidth / VIEWPORT_SIZE
        viewportStyles.scale = canvasScale.value
        viewportStyles.left = (canvasWidth - viewportActualWidth) / 2
        viewportStyles.top = (canvasHeight - viewportActualWidth * VIEWPORT_ASPECT_RATIO) / 2
      }
      else {
        const viewportActualHeight = canvasHeight * (editorAreaShowScale.value / 100)
        canvasScale.value = viewportActualHeight / (VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO)
        viewportStyles.scale = canvasScale.value
        viewportStyles.left = (canvasWidth - viewportActualHeight / VIEWPORT_ASPECT_RATIO) / 2
        viewportStyles.top = (canvasHeight - viewportActualHeight) / 2
      }
    }

    const resizeObserver = new ResizeObserver(setViewportSize)
    onMounted(() => {
      if(canvasRef.value) resizeObserver.observe(canvasRef.value)
    })
    onUnmounted(() => {
      if(canvasRef.value) resizeObserver.unobserve(canvasRef.value)
    })

    const viewportRef = ref<Element | null>(null)
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
    const handleClickBlankArea = (e: MouseEvent) => {
      updateMouseSelection(e)
    }

    return {
      canvasRef,
      viewportRef,
      viewportStyles,
      mouseSelectionState,
      handleClickBlankArea,
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