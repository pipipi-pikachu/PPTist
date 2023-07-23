<template>
  <div class="hue">
    <div 
      class="hue-container"
      ref="hueRef"
      @mousedown="$event => handleMouseDown($event)"
    >
      <div 
        class="hue-pointer"
        :style="{ left: pointerLeft }"
      >
        <div class="hue-picker"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import tinycolor, { type ColorFormats } from 'tinycolor2'

const props = defineProps<{
  value: ColorFormats.RGBA
  hue: number
}>()

const emit = defineEmits<{
  (event: 'colorChange', payload: ColorFormats.HSLA): void
}>()

const oldHue = ref(0)
const pullDirection = ref('')

const color = computed(() => {
  const hsla = tinycolor(props.value).toHsl()
  if (props.hue !== -1) hsla.h = props.hue
  return hsla
})

const pointerLeft = computed(() => {
  if (color.value.h === 0 && pullDirection.value === 'right') return '100%'
  return color.value.h * 100 / 360 + '%'
})

watch(() => props.value, () => {
  const hsla = tinycolor(props.value).toHsl()
  const h = hsla.s === 0 ? props.hue : hsla.h
  if (h !== 0 && h - oldHue.value > 0) pullDirection.value = 'right'
  if (h !== 0 && h - oldHue.value < 0) pullDirection.value = 'left'
  oldHue.value = h
})

const hueRef = ref<HTMLElement>()
const handleChange = (e: MouseEvent) => {
  e.preventDefault()
  if (!hueRef.value) return

  const containerWidth = hueRef.value.clientWidth
  const xOffset = hueRef.value.getBoundingClientRect().left + window.pageXOffset
  const left = e.pageX - xOffset
  let h, percent
  
  if (left < 0) h = 0
  else if (left > containerWidth) h = 360
  else {
    percent = left * 100 / containerWidth
    h = 360 * percent / 100
  }
  if (props.hue === -1 || color.value.h !== h) {
    emit('colorChange', {
      h,
      l: color.value.l,
      s: color.value.s,
      a: color.value.a,
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
.hue {
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);

  @include absolute-0();
}
.hue-container {
  cursor: pointer;
  margin: 0 2px;
  position: relative;
  height: 100%;
}
.hue-pointer {
  z-index: 2;
  position: absolute;
  top: 0;
}
.hue-picker {
  cursor: pointer;
  margin-top: 1px;
  width: 4px;
  height: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, .6);
  background: #fff;
  transform: translateX(-2px);
}
</style>