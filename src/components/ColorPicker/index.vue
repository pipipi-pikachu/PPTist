<template>
  <div class="color-picker">
    <div class="picker-saturation-wrap">
      <Saturation :value="color" :hue="hue" @colorChange="value => changeColor(value)" />
    </div>
    <div class="picker-controls">
      <div class="picker-color-wrap">
        <div class="picker-current-color" :style="{ background: currentColor }"></div>
        <Checkboard />
      </div>
      <div class="picker-sliders">
        <div class="picker-hue-wrap">
          <Hue :value="color" :hue="hue" @colorChange="value => changeColor(value)" />
        </div>
        <div class="picker-alpha-wrap">
          <Alpha :value="color" @colorChange="value => changeColor(value)" />
        </div>
      </div>
    </div>

    <div class="picker-field">
      <EditableInput class="input" :value="color" @colorChange="value => changeColor(value)" />
      <div class="straw" @click="openEyeDropper()"><IconNeedle /></div>
      <div class="transparent" @click="selectPresetColor('#00000000')">
        <Checkboard />
      </div>
    </div>

    <div class="picker-presets">
      <div
        class="picker-presets-color"
        v-for="c in themeColors"
        :key="c"
        :style="{ background: c }"
        @click="selectPresetColor(c)"
      ></div>
    </div>

    <div class="picker-gradient-presets">
      <div
        class="picker-gradient-col"
        v-for="(col, index) in presetColors"
        :key="index"
      >
        <div class="picker-gradient-color"
          v-for="c in col"
          :key="c"
          :style="{ background: c }"
          @click="selectPresetColor(c)"
        ></div>
      </div>
    </div>

    <div class="picker-presets">
      <div
        v-for="c in standardColors"
        :key="c"
        class="picker-presets-color"
        :style="{ background: c }"
        @click="selectPresetColor(c)"
      ></div>
    </div>

    <div class="recent-colors-title" v-if="recentColors.length">最近使用：</div>
    <div class="picker-presets">
      <div
        v-for="c in recentColors"
        :key="c"
        class="picker-presets-color alpha"
        @click="selectPresetColor(c)"
      >
        <div class="picker-presets-color-content" :style="{ background: c }"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import tinycolor, { type ColorFormats } from 'tinycolor2'
import { debounce } from 'lodash'
import { toCanvas } from 'html-to-image'
import message from '@/utils/message'

import Alpha from './Alpha.vue'
import Checkboard from './Checkboard.vue'
import Hue from './Hue.vue'
import Saturation from './Saturation.vue'
import EditableInput from './EditableInput.vue'

const props = withDefaults(defineProps<{
  modelValue?: string
}>(), {
  modelValue: '#e86b99',
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const RECENT_COLORS = 'RECENT_COLORS'

const presetColorConfig = [
  ['#7f7f7f', '#f2f2f2'],
  ['#0d0d0d', '#808080'],
  ['#1c1a10', '#ddd8c3'],
  ['#0e243d', '#c6d9f0'],
  ['#233f5e', '#dae5f0'],
  ['#632623', '#f2dbdb'],
  ['#4d602c', '#eaf1de'],
  ['#3f3150', '#e6e0ec'],
  ['#1e5867', '#d9eef3'],
  ['#99490f', '#fee9da'],
]

const gradient = (startColor: string, endColor: string, step: number) => {
  const _startColor = tinycolor(startColor).toRgb()
  const _endColor = tinycolor(endColor).toRgb()

  const rStep = (_endColor.r - _startColor.r) / step
  const gStep = (_endColor.g - _startColor.g) / step
  const bStep = (_endColor.b - _startColor.b) / step
  const gradientColorArr = []

  for (let i = 0; i < step; i++) {
    const gradientColor = tinycolor({
      r: _startColor.r + rStep * i,
      g: _startColor.g + gStep * i,
      b: _startColor.b + bStep * i,
    }).toRgbString()
    gradientColorArr.push(gradientColor)
  }
  return gradientColorArr
}

const getPresetColors = () => {
  const presetColors = []
  for (const color of presetColorConfig) {
    presetColors.push(gradient(color[1], color[0], 5))
  }
  return presetColors
}

const themeColors = ['#000000', '#ffffff', '#eeece1', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c']
const standardColors = ['#c21401', '#ff1e02', '#ffc12a', '#ffff3a', '#90cf5b', '#00af57', '#00afee', '#0071be', '#00215f', '#72349d']

const hue = ref(-1)
const recentColors = ref<string[]>([])

const color = computed({
  get() {
    return tinycolor(props.modelValue).toRgb()
  },
  set(rgba: ColorFormats.RGBA) {
    const rgbaString = `rgba(${[rgba.r, rgba.g, rgba.b, rgba.a].join(',')})`
    emit('update:modelValue', rgbaString)
  },
})

const presetColors = getPresetColors()

const currentColor = computed(() => {
  return `rgba(${[color.value.r, color.value.g, color.value.b, color.value.a].join(',')})`
})

const selectPresetColor = (colorString: string) => {
  hue.value = tinycolor(colorString).toHsl().h
  emit('update:modelValue', colorString)
}

// 每次选择非预设颜色时，需要将该颜色加入到最近使用列表中
const updateRecentColorsCache = debounce(function() {
  const _color = tinycolor(color.value).toRgbString()
  if (!recentColors.value.includes(_color)) {
    recentColors.value = [_color, ...recentColors.value]

    const maxLength = 10
    if (recentColors.value.length > maxLength) {
      recentColors.value = recentColors.value.slice(0, maxLength)
    }
  }
}, 300, { trailing: true })

onMounted(() => {
  const recentColorsCache = localStorage.getItem(RECENT_COLORS)
  if (recentColorsCache) recentColors.value = JSON.parse(recentColorsCache)
})

watch(recentColors, () => {
  const recentColorsCache = JSON.stringify(recentColors.value)
  localStorage.setItem(RECENT_COLORS, recentColorsCache)
})

const changeColor = (value: ColorFormats.RGBA | ColorFormats.HSLA | ColorFormats.HSVA) => {
  if ('h' in value) {
    hue.value = value.h
    color.value = tinycolor(value).toRgb()
  }
  else {
    hue.value = tinycolor(value).toHsl().h
    color.value = value
  }

  updateRecentColorsCache()
}

// 打开取色吸管
// 检查环境是否支持原生取色吸管，支持则使用原生吸管，否则使用自定义吸管
const openEyeDropper = () => {
  const isSupportedEyeDropper = 'EyeDropper' in window

  if (isSupportedEyeDropper) browserEyeDropper()
  else customEyeDropper()
}

// 原生取色吸管
const browserEyeDropper = () => {
  message.success('按 ESC 键关闭取色吸管', { duration: 0 })

  // eslint-disable-next-line
  const eyeDropper = new (window as any).EyeDropper()
  eyeDropper.open().then((result: { sRGBHex: string }) => {
    const tColor = tinycolor(result.sRGBHex)
    hue.value = tColor.toHsl().h
    color.value = tColor.toRgb()

    message.closeAll()
    updateRecentColorsCache()
  }).catch(() => {
    message.closeAll()
  })
}

// 基于 Canvas 的自定义取色吸管
const customEyeDropper = () => {
  const targetRef: HTMLElement | null = document.querySelector('.canvas')
  if (!targetRef) return

  const maskRef = document.createElement('div')
  maskRef.style.cssText = 'position: fixed; top: 0; left: 0; bottom: 0; right: 0; z-index: 9999; cursor: wait;'
  document.body.appendChild(maskRef)

  const colorBlockRef = document.createElement('div')
  colorBlockRef.style.cssText = 'position: absolute; top: -100px; left: -100px; width: 16px; height: 16px; border: 1px solid #000; z-index: 999'
  maskRef.appendChild(colorBlockRef)

  const { left, top, width, height } = targetRef.getBoundingClientRect()

  const filter = (node: HTMLElement) => {
    if (node.tagName && node.tagName.toUpperCase() === 'FOREIGNOBJECT') return false
    if (node.classList && node.classList.contains('operate')) return false
    return true
  }

  toCanvas(targetRef, { filter, fontEmbedCSS: '', width, height, canvasWidth: width, canvasHeight: height, pixelRatio: 1 }).then(canvasRef => {
    canvasRef.style.cssText = `position: absolute; top: ${top}px; left: ${left}px; cursor: crosshair;`
    maskRef.style.cursor = 'default'
    maskRef.appendChild(canvasRef)

    const ctx = canvasRef.getContext('2d')
    if (!ctx) return

    let currentColor = ''
    const handleMousemove = (e: MouseEvent) => {
      const x = e.x
      const y = e.y

      const mouseX = x - left
      const mouseY = y - top

      const [r, g, b, a] = ctx.getImageData(mouseX, mouseY, 1, 1).data
      currentColor = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`

      colorBlockRef.style.left = x + 10 + 'px'
      colorBlockRef.style.top = y + 10 + 'px'
      colorBlockRef.style.backgroundColor = currentColor
    }
    const handleMouseleave = () => {
      currentColor = ''
      colorBlockRef.style.left = '-100px'
      colorBlockRef.style.top = '-100px'
      colorBlockRef.style.backgroundColor = ''
    }
    const handleMousedown = (e: MouseEvent) => {
      if (currentColor && e.button === 0) {
        const tColor = tinycolor(currentColor)
        hue.value = tColor.toHsl().h
        color.value = tColor.toRgb()

        updateRecentColorsCache()
      }
      document.body.removeChild(maskRef)
      
      canvasRef.removeEventListener('mousemove', handleMousemove)
      canvasRef.removeEventListener('mouseleave', handleMouseleave)
      window.removeEventListener('mousedown', handleMousedown)
    }

    canvasRef.addEventListener('mousemove', handleMousemove)
    canvasRef.addEventListener('mouseleave', handleMouseleave)
    window.addEventListener('mousedown', handleMousedown)
  }).catch(() => {
    message.error('取色吸管初始化失败')
    document.body.removeChild(maskRef)
  })
}
</script>

<style lang="scss" scoped>
.color-picker {
  position: relative;
  width: 240px;
  background: #fff;
  user-select: none;
  margin-bottom: -10px;
}
.picker-saturation-wrap {
  width: 100%;
  padding-bottom: 50%;
  position: relative;
  overflow: hidden;
}
.picker-controls {
  display: flex;
}
.picker-sliders {
  padding: 4px 0;
  flex: 1;
}
.picker-hue-wrap {
  position: relative;
  height: 10px;
}
.picker-alpha-wrap {
  position: relative;
  height: 10px;
  margin-top: 4px;
  overflow: hidden;
}
.picker-color-wrap {
  width: 24px;
  height: 24px;
  position: relative;
  margin-top: 4px;
  margin-right: 4px;
  outline: 1px dashed rgba($color: #666, $alpha: .12);

  .checkerboard {
    background-size: auto;
  }
}
.picker-current-color {
  @include absolute-0();

  z-index: 2;
}

.picker-field {
  display: flex;
  margin-bottom: 8px;

  .transparent {
    width: 24px;
    height: 24px;
    margin-top: 4px;
    margin-left: 8px;
    position: relative;
    cursor: pointer;

    &::after {
      content: '';
      width: 26px;
      height: 2px;
      position: absolute;
      top: 11px;
      left: -1px;
      transform: rotate(-45deg);
      background-color: #f00;
    }

    .checkerboard {
      background-size: auto;
    }
  }

  .straw {
    width: 24px;
    height: 24px;
    margin-top: 4px;
    margin-left: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    background-color: #f5f5f5;
    outline: 1px solid #f1f1f1;
    cursor: pointer;
  }
  .input {
    flex: 1;
  }
}

.picker-presets {
  @include flex-grid-layout();
}
.picker-presets-color {
  @include flex-grid-layout-children(10, 7%);

  height: 0;
  padding-bottom: 7%;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;

  &.alpha {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADBJREFUOE9jfPbs2X8GPEBSUhKfNAPjqAHDIgz+//+PNx08f/4cfzoYNYCBceiHAQC5flV5JzgrxQAAAABJRU5ErkJggg==);
  }
}
.picker-presets-color-content {
  @include absolute-0();
}
.picker-gradient-presets {
  @include flex-grid-layout();
}
.picker-gradient-col {
  @include flex-grid-layout-children(10, 7%);

  display: flex;
  flex-direction: column;
}
.picker-gradient-color {
  width: 100%;
  height: 16px;
  position: relative;
  cursor: pointer;
}

.recent-colors-title {
  font-size: 12px;
  margin-bottom: 4px;
}
</style>