<template>
  <div 
    class="moveable-panel"
    :style="{
      width: width + 'px',
      height: height + 'px',
      left: x + 'px',
      top: y + 'px',
    }"
  >
    <div class="header" @mousedown="$event => startMove($event)">
      <div class="title">{{title}}</div>
      <div class="close-btn" @click="emit('close')"><IconClose /></div>
    </div>

    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  left: {
    type: Number,
    default: 10,
  },
  top: {
    type: Number,
    default: 10,
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const x = ref(0)
const y = ref(0)

onMounted(() => {
  if (props.left >= 0) x.value = props.left
  else x.value = document.body.clientWidth + props.left - props.width

  if (props.top >= 0) y.value = props.top
  else y.value = document.body.clientHeight + props.top - props.height
})

const startMove = (e: MouseEvent) => {
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
    if (top + props.height > clientHeight) top = clientHeight - props.height

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