<template>
  <div 
    class="moveable-panel"
    ref="moveablePanelRef"
    :style="{
      width: w + 'px',
      height: h ? h + 'px' : 'auto',
      left: x + 'px',
      top: y + 'px',
      zIndex: zIndex,
    }"
  >
    <template v-if="title">
      <div class="header" @mousedown="$event => startMove($event)">
        <div class="title">{{title}}</div>
        <div class="close-btn" @mousedown.stop @click="emit('close')"><IconClose /></div>
      </div>

      <div class="content" :style="contentStyle || {}" @mousedown="$event => bringToFrontPanel($event)">
        <slot></slot>
      </div>
    </template>

    <div
      class="content" 
      :style="contentStyle || {}" 
      @mousedown="$event => startMove($event)"
      v-else
    >
      <slot></slot>
    </div>

    <div class="resizer" v-if="resizeable" @mousedown="$event => startResize($event)"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, useTemplateRef, type CSSProperties } from 'vue'

const Z_INDEX_KEY = '__moveable_panel_z_index__'
const Z_INDEX_BASE = 900
const Z_INDEX_MAX = 999
const ACTIVE_PANELS_KEY = '__moveable_panel_active_count__'

const props = withDefaults(defineProps<{
  width: number
  height: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  left?: number
  top?: number
  title?: string
  moveable?: boolean
  resizeable?: boolean
  contentStyle?: CSSProperties
}>(), {
  minWidth: 20,
  minHeight: 20,
  maxWidth: 500,
  maxHeight: 500,
  left: 10,
  top: 10,
  title: '',
  moveable: true,
  resizeable: false,
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const x = ref(0)
const y = ref(0)
const w = ref(0)
const h = ref(0)
const moveablePanelRef = useTemplateRef<HTMLElement>('moveablePanelRef')
const zIndex = ref(900)

const realHeight = computed(() => {
  if (!h.value) {
    return moveablePanelRef.value?.clientHeight || 0
  }
  return h.value
})

const initGlobalZIndex = () => {
  if (!(window as any)[Z_INDEX_KEY]) (window as any)[Z_INDEX_KEY] = Z_INDEX_BASE
  if (!(window as any)[ACTIVE_PANELS_KEY]) (window as any)[ACTIVE_PANELS_KEY] = 0

  ;(window as any)[ACTIVE_PANELS_KEY]++

  const current = (window as any)[Z_INDEX_KEY]
  if (current >= Z_INDEX_MAX) (window as any)[Z_INDEX_KEY] = Z_INDEX_BASE
  else (window as any)[Z_INDEX_KEY] = current + 1

  return (window as any)[Z_INDEX_KEY]
}

const bringToFront = () => {
  if (!(window as any)[Z_INDEX_KEY]) (window as any)[Z_INDEX_KEY] = Z_INDEX_BASE

  const current = (window as any)[Z_INDEX_KEY]

  if (zIndex.value === current) return current

  if (current >= Z_INDEX_MAX) (window as any)[Z_INDEX_KEY] = Z_INDEX_BASE + 1
  else (window as any)[Z_INDEX_KEY] = current + 1

  return (window as any)[Z_INDEX_KEY]
}

const onPanelClose = () => {
  if (!(window as any)[Z_INDEX_KEY] || !(window as any)[ACTIVE_PANELS_KEY]) return

  const current = (window as any)[Z_INDEX_KEY]

  ;(window as any)[ACTIVE_PANELS_KEY]--

  if (zIndex.value === current && current > Z_INDEX_BASE) {
    (window as any)[Z_INDEX_KEY] = current - 1
  }

  if ((window as any)[ACTIVE_PANELS_KEY] <= 0) {
    (window as any)[Z_INDEX_KEY] = Z_INDEX_BASE
    ;(window as any)[ACTIVE_PANELS_KEY] = 0
  }
}

onMounted(() => {
  if (props.left >= 0) x.value = props.left
  else x.value = document.body.clientWidth + props.left - props.width

  if (props.top >= 0) y.value = props.top
  else y.value = document.body.clientHeight + props.top - (props.height || realHeight.value)

  w.value = props.width
  h.value = props.height

  zIndex.value = initGlobalZIndex()
})

onUnmounted(() => {
  onPanelClose()
})

const bringToFrontPanel = (e: MouseEvent) => {
  if (!props.moveable) return

  e.stopPropagation()
  zIndex.value = bringToFront()
}

const startMove = (e: MouseEvent) => {
  if (!props.moveable) return

  zIndex.value = bringToFront()

  let isMouseDown = true

  const windowWidth = document.body.clientWidth
  const clientHeight = document.body.clientHeight

  const startPageX = e.pageX
  const startPageY = e.pageY

  const originLeft = x.value
  const originTop = y.value

  document.onmousemove = e => {
    if (!isMouseDown) return

    const moveX = e.pageX - startPageX
    const moveY = e.pageY - startPageY

    let left = originLeft + moveX
    let top = originTop + moveY

    if (left < 0) left = 0
    if (top < 0) top = 0
    if (left + w.value > windowWidth) left = windowWidth - w.value
    if (top + realHeight.value > clientHeight) top = clientHeight - realHeight.value

    x.value = left
    y.value = top
  }
  document.onmouseup = () => {
    isMouseDown = false

    document.onmousemove = null
    document.onmouseup = null
  }
}

const startResize = (e: MouseEvent) => {
  if (!props.resizeable) return

  let isMouseDown = true

  const startPageX = e.pageX
  const startPageY = e.pageY

  const originWidth = w.value
  const originHeight = h.value

  document.onmousemove = e => {
    if (!isMouseDown) return

    const moveX = e.pageX - startPageX
    const moveY = e.pageY - startPageY

    let width = originWidth + moveX
    let height = originHeight + moveY

    if (width < props.minWidth) width = props.minWidth
    if (height < props.minHeight) height = props.minHeight
    if (width > props.maxWidth) width = props.maxWidth
    if (height > props.maxHeight) height = props.maxHeight

    w.value = width
    h.value = height
  }
  document.onmouseup = () => {
    isMouseDown = false

    document.onmousemove = null
    document.onmouseup = null
  }
}
</script>

<style lang="scss" scoped>
.moveable-panel {
  position: fixed;
  background-color: #fff;
  box-shadow: $boxShadow;
  border: 1px solid $borderColor;
  border-radius: $borderRadius;
  display: flex;
  flex-direction: column;
}
.resizer {
  width: 10px;
  height: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: se-resize;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    right: -4px;
    transform: rotate(45deg);
    transform-origin: center;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-left-color: #e1e1e1;
  }
}
.header {
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  user-select: none;
  cursor: move;
}
.title {
  flex: 1;
  font-size: 13px;
  padding-left: 10px;
}
.close-btn {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    color: $themeColor;
  }
}
.content {
  flex: 1;
  padding: 10px;
  overflow: auto;
}
</style>