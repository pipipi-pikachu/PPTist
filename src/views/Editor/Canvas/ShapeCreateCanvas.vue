<template>
  <div 
    class="shape-create-canvas"
    ref="shapeCanvasRef"
    @mousedown.stop="$event => addPoint($event)"
    @mousemove="$event => updateMousePosition($event)"
    @contextmenu.stop.prevent="close()"
  >
    <svg overflow="visible">
			<path
        :d="path" 
        stroke="#d14424" 
        :fill="closed ? 'rgba(226, 83, 77, 0.15)' : 'none'" 
        stroke-width="2" 
      ></path>
		</svg>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useKeyboardStore, useMainStore } from '@/store'
import type { CreateCustomShapeData } from '@/types/edit'
import { KEYS } from '@/configs/hotkey'
import message from '@/utils/message'

const emit = defineEmits<{
  (event: 'created', payload: CreateCustomShapeData): void
}>()
const mainStore = useMainStore()
const { ctrlOrShiftKeyActive } = storeToRefs(useKeyboardStore())

const shapeCanvasRef = ref<HTMLElement>()
const offset = ref({
  x: 0,
  y: 0,
})
onMounted(() => {
  if (!shapeCanvasRef.value) return
  const { x, y } = shapeCanvasRef.value.getBoundingClientRect()
  offset.value = { x, y }
})

const mousePosition = ref<[number, number]>()
const points = ref<[number, number][]>([])
const closed = ref(false)

const getPoint = (e: MouseEvent) => {
  let pageX = e.pageX - offset.value.x
  let pageY = e.pageY - offset.value.y

  if (ctrlOrShiftKeyActive.value && points.value.length) {
    const [lastPointX, lastPointY] = points.value[points.value.length - 1]
    if (Math.abs(lastPointX - pageX) - Math.abs(lastPointY - pageY) > 0) {
      pageY = lastPointY
    }
    else pageX = lastPointX
  }
  return { pageX, pageY }
}

const updateMousePosition = (e: MouseEvent) => {
  const { pageX, pageY } = getPoint(e)
  mousePosition.value = [pageX, pageY]

  if (points.value.length >= 2) {
    const [firstPointX, firstPointY] = points.value[0]
    if (Math.abs(firstPointX - pageX) < 5 && Math.abs(firstPointY - pageY) < 5) {
      closed.value = true
    }
    else closed.value = false
  }
  else closed.value = false
}

const path = computed(() => {
  let d = ''
  for (let i = 0; i < points.value.length; i++) {
    const point = points.value[i]
    if (i === 0) d += `M ${point[0]} ${point[1]} `
    else d += `L ${point[0]} ${point[1]} `
  }
  if (points.value.length && mousePosition.value) {
    d += `L ${mousePosition.value[0]} ${mousePosition.value[1]}`
  }
  return d
})

const addPoint = (e: MouseEvent) => {
  const { pageX, pageY } = getPoint(e)

  if (closed.value) {
    const xList = points.value.map(item => item[0])
    const yList = points.value.map(item => item[1])
    const minX = Math.min(...xList)
    const minY = Math.min(...yList)
    const maxX = Math.max(...xList)
    const maxY = Math.max(...yList)

    const formatedPoints = points.value.map(point => {
      return [point[0] - minX, point[1] - minY]
    })
    let path = ''
    for (let i = 0; i < formatedPoints.length; i++) {
      const point = formatedPoints[i]
      if (i === 0) path += `M ${point[0]} ${point[1]} `
      else path += `L ${point[0]} ${point[1]} `
    }
    path += 'Z'
    
    emit('created', {
      start: [minX + offset.value.x, minY + offset.value.y],
      end: [maxX + offset.value.x, maxY + offset.value.y],
      path,
      viewBox: [maxX - minX, maxY - minY],
    })
  }
  else points.value.push([pageX, pageY])
}

const close = () => {
  mainStore.setCreatingCustomShapeState(false)
}

const keydownListener = (e: KeyboardEvent) => {
  const key = e.key.toUpperCase()
  if (key === KEYS.ESC) close()
}
onMounted(() => {
  message.success('点击开始绘制任意多边形，首尾闭合完成绘制，按 ESC 键或鼠标右键关闭')
  document.addEventListener('keydown', keydownListener)
})
onUnmounted(() => document.removeEventListener('keydown', keydownListener))
</script>

<style lang="scss" scoped>
.shape-create-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  cursor: crosshair;

  svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }
}
</style>