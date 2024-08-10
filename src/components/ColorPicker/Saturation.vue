<template>
  <div 
    class="saturation"
    ref="saturationRef"
    :style="{ background: bgColor }"
    @mousedown="$event => handleMouseDown($event)"
  >
    <div class="saturation-white"></div>
    <div class="saturation-black"></div>
    <div class="saturation-pointer" 
      :style="{
        top: pointerTop,
        left: pointerLeft,
      }"
    >
      <div class="saturation-circle"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import tinycolor, { type ColorFormats } from 'tinycolor2'
import { throttle, clamp } from 'lodash'

const props = defineProps<{
  value: ColorFormats.RGBA
  hue: number
}>()

const emit = defineEmits<{
  (event: 'colorChange', payload: ColorFormats.HSVA): void
}>()

const color = computed(() => {
  const hsva = tinycolor(props.value).toHsv()
  if (props.hue !== -1) hsva.h = props.hue
  return hsva
})

const bgColor = computed(() => `hsl(${color.value.h}, 100%, 50%)`)
const pointerTop = computed(() => (-(color.value.v * 100) + 1) + 100 + '%')
const pointerLeft = computed(() => color.value.s * 100 + '%')

const emitChangeEvent = throttle(function(param: ColorFormats.HSVA) {
  emit('colorChange', param)
}, 20, { leading: true, trailing: false })

const saturationRef = ref<HTMLElement>()
const handleChange = (e: MouseEvent) => {
  e.preventDefault()
  if (!saturationRef.value) return
  
  const containerWidth = saturationRef.value.clientWidth
  const containerHeight = saturationRef.value.clientHeight
  const xOffset = saturationRef.value.getBoundingClientRect().left + window.pageXOffset
  const yOffset = saturationRef.value.getBoundingClientRect().top + window.pageYOffset
  const left = clamp(e.pageX - xOffset, 0, containerWidth)
  const top = clamp(e.pageY - yOffset, 0, containerHeight)
  const saturation = left / containerWidth
  const bright = clamp(-(top / containerHeight) + 1, 0, 1)

  emitChangeEvent({
    h: color.value.h,
    s: saturation,
    v: bright,
    a: color.value.a,
  })
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
.saturation,
.saturation-white,
.saturation-black {
  @include absolute-0();

  cursor: pointer;
}
.saturation-white {
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
}
.saturation-black {
  background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
}
.saturation-pointer {
  cursor: pointer;
  position: absolute;
}
.saturation-circle {
  width: 4px;
  height: 4px;
  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, .3), 0 0 1px 2px rgba(0, 0, 0, .4);
  border-radius: 50%;
  transform: translate(-2px, -2px);
}
</style>