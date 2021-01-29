<template>
  <div 
    class="element-create-selection"
    ref="selectionRef"
    @mousedown.stop="$event => createSelection($event)"
  >
    <div :class="['selection', creatingElement.type]" v-if="start && end" :style="position">

      <!-- 绘制线条专用 -->
      <SvgWrapper
        v-if="creatingElement.type === 'line' && lineData"
        overflow="visible" 
        :width="lineData.svgWidth"
        :height="lineData.svgHeight"
      >
				<path
          :d="lineData.path" 
          stroke="#888" 
          fill="none" 
          stroke-width="1" 
          stroke-linecap 
          stroke-linejoin 
          stroke-miterlimit 
        ></path>
			</SvgWrapper>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { MutationTypes, useStore } from '@/store'

export default defineComponent({
  name: 'element-create-selection',
  setup(props, { emit }) {
    const store = useStore()
    const ctrlOrShiftKeyActive = computed<boolean>(() => store.getters.ctrlOrShiftKeyActive)
    const creatingElement = computed(() => store.state.creatingElement)

    const start = ref<[number, number] | null>(null)
    const end = ref<[number, number] | null>(null)

    const selectionRef = ref<HTMLElement>()
    const offset = reactive({
      x: 0,
      y: 0,
    })
    onMounted(() => {
      if(!selectionRef.value) return
      const { x, y } = selectionRef.value.getBoundingClientRect()
      offset.x = x
      offset.y = y
    })

    const createSelection = (e: MouseEvent) => {
      let isMouseDown = true

      const startPageX = e.pageX
      const startPageY = e.pageY
      start.value = [startPageX, startPageY]

      document.onmousemove = e => {
        if(!creatingElement.value || !isMouseDown) return

        let currentPageX = e.pageX
        let currentPageY = e.pageY

        if(ctrlOrShiftKeyActive.value) {
          const moveX = currentPageX - startPageX
          const moveY = currentPageY - startPageY

          const absX = Math.abs(moveX)
          const absY = Math.abs(moveY)

          if(creatingElement.value.type === 'shape') {
            // moveX和moveY一正一负
            const isOpposite = (moveY > 0 && moveX < 0) || (moveY < 0 && moveX > 0)

            if(absX > absY) {
              currentPageY = isOpposite ? startPageY - moveX : startPageY + moveX
            }
            else {
              currentPageX = isOpposite ? startPageX - moveY : startPageX + moveY
            }
          }

          else if(creatingElement.value.type === 'line') {
            if(absX > absY) currentPageY = startPageY
            else currentPageX = startPageX
          }
        }

        end.value = [currentPageX, currentPageY]
      }

      document.onmouseup = e => {
        document.onmousemove = null
        document.onmouseup = null
        isMouseDown = false

        const endPageX = e.pageX
        const endPageY = e.pageY

        const minSize = 30

        if(Math.abs(endPageX - startPageX) >= minSize || Math.abs(endPageY - startPageY) >= minSize) {
          emit('created', {
            start: start.value,
            end: end.value,
          })
        }
        else store.commit(MutationTypes.SET_CREATING_ELEMENT, null)
      }
    }

    const lineData = computed(() => {
      if(!start.value || !end.value) return null
      if(!creatingElement.value || creatingElement.value.type !== 'line') return null

      const [_startX, _startY] = start.value
      const [_endX, _endY] = end.value
      const minX = Math.min(_startX, _endX)
      const maxX = Math.max(_startX, _endX)
      const minY = Math.min(_startY, _endY)
      const maxY = Math.max(_startY, _endY)

      const svgWidth = maxX - minX >= 24 ? maxX - minX : 24
      const svgHeight = maxY - minY >= 24 ? maxY - minY : 24

      const startX = _startX === minX ? 0 : maxX - minX
      const startY = _startY === minY ? 0 : maxY - minY
      const endX = _endX === minX ? 0 : maxX - minX
      const endY = _endY === minY ? 0 : maxY - minY

      const path = `M${startX}, ${startY} L${endX}, ${endY}`

      return {
        svgWidth,
        svgHeight,
        startX,
        startY,
        endX,
        endY,
        path,
      }
    })

    const position = computed(() => {
      if(!start.value || !end.value) return {}

      const [startX, startY] = start.value
      const [endX, endY] = end.value
      const minX = Math.min(startX, endX)
      const maxX = Math.max(startX, endX)
      const minY = Math.min(startY, endY)
      const maxY = Math.max(startY, endY)

      const width = maxX - minX
      const height = maxY - minY

      return {
        left: minX - offset.x + 'px',
        top: minY - offset.y + 'px',
        width: width + 'px',
        height: height + 'px',
      }
    })

    return {
      selectionRef,
      start,
      end,
      creatingElement,
      createSelection,
      lineData,
      position,
    }
  },
})
</script>

<style lang="scss" scoped>
.element-create-selection {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  cursor: crosshair;
}
.selection {
  position: absolute;

  &:not(.line) {
    border: 1px solid #888;
  }
}
</style>