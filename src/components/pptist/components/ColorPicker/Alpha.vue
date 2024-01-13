<template>
  <div class="alpha">
    <div class="alpha-checkboard-wrap">
      <Checkboard />
    </div>
    <div class="alpha-gradient" :style="{ background: gradientColor }"></div>
    <div 
      class="alpha-container" 
      ref="alphaRef"
      @mousedown="$event => handleMouseDown($event)"
    >
      <div class="alpha-pointer" :style="{ left: color.a * 100 + '%' }">
        <div class="alpha-picker"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'

import Checkboard from './Checkboard.vue'
import type { ColorFormats } from 'tinycolor2'

const props = defineProps<{
  value: ColorFormats.RGBA
}>()

const emit = defineEmits<{
  (event: 'colorChange', payload: ColorFormats.RGBA): void
}>()

const color = computed(() => props.value)
    
const gradientColor = computed(() => {
  const rgbaStr = [color.value.r, color.value.g, color.value.b].join(',')
  return `linear-gradient(to right, rgba(${rgbaStr}, 0) 0%, rgba(${rgbaStr}, 1) 100%)`
})

const alphaRef = ref<HTMLElement>()
const handleChange = (e: MouseEvent) => {
  e.preventDefault()
  if (!alphaRef.value) return
  const containerWidth = alphaRef.value.clientWidth
  const xOffset = alphaRef.value.getBoundingClientRect().left + window.pageXOffset
  const left = e.pageX - xOffset
  let a

  if (left < 0) a = 0
  else if (left > containerWidth) a = 1
  else a = Math.round(left * 100 / containerWidth) / 100

  if (color.value.a !== a) {
    emit('colorChange', {
      r: color.value.r,
      g: color.value.g,
      b: color.value.b,
      a: a,
    })
  }
}

const unbindEventListeners = () => {
  window.removeEventListener('mousemove', handleChange)
  window.removeEventListener('mouseup', unbindEventListeners)
}
const handleMouseDown = (e: MouseEvent) => {
  handleChange(e)
  window.addEventListener('mousemove', handleChange)
  window.addEventListener('mouseup', unbindEventListeners)
}
onUnmounted(unbindEventListeners)
</script>

<style lang="scss" scoped>
.alpha {
  @include absolute-0();
}
.alpha-checkboard-wrap {
  overflow: hidden;

  @include absolute-0();
}
.alpha-gradient {
  @include absolute-0();
}
.alpha-container {
  cursor: pointer;
  position: relative;
  z-index: 2;
  height: 100%;
  margin: 0 3px;
}
.alpha-pointer {
  z-index: 2;
  position: absolute;
}
.alpha-picker {
  cursor: pointer;
  width: 4px;
  height: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, .6);
  background: #fff;
  margin-top: 1px;
  transform: translateX(-2px);
}
</style>