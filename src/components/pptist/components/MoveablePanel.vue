<template>
  <div 
    class="moveable-panel"
    ref="moveablePanelRef"
    :style="{
      width: width + 'px',
      height: height ? height + 'px' : 'auto',
      left: x + 'px',
      top: y + 'px',
    }"
  >
    <template v-if="title">
      <div class="header" @mousedown="$event => startMove($event)">
        <div class="title">{{title}}</div>
        <div class="close-btn" @click="emit('close')"><IconClose /></div>
      </div>

      <div class="content">
        <slot></slot>
      </div>
    </template>

    <div v-else class="content" @mousedown="$event => startMove($event)">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  width: number
  height: number
  left?: number
  top?: number
  title?: string
  moveable?: boolean
}>(), {
  left: 10,
  top: 10,
  title: '',
  moveable: true,
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const x = ref(0)
const y = ref(0)
const moveablePanelRef = ref<HTMLElement>()
const realHeight = computed(() => {
  if (!props.height) {
    return moveablePanelRef.value?.clientHeight || 0
  }
  return props.height
})

onMounted(() => {
  if (props.left >= 0) x.value = props.left
  else x.value = document.body.clientWidth + props.left - props.width

  if (props.top >= 0) y.value = props.top
  else y.value = document.body.clientHeight + props.top - realHeight.value
})

const startMove = (e: MouseEvent) => {
  if (!props.moveable) return

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
    if (left + props.width > windowWidth) left = windowWidth - props.width
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
</script>

<style lang="scss" scoped>
.moveable-panel {
  position: fixed;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(56, 56, 56, .15);
  border: 1px solid $borderColor;
  border-radius: $borderRadius;
  display: flex;
  flex-direction: column;
  z-index: 999;
}
.header {
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
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
  font-size: 12px;
  cursor: pointer;
}
.content {
  flex: 1;
  padding: 10px;
  overflow: auto;
}
</style>