<template>
  <div class="slider" :class="{ 'disabled': disabled }" ref="sliderRef" @mousedown="$event => handleMousedown($event)">
    <div class="bar">
      <template v-if="!range">
        <div class="track" :style="{ width: `${percentage}%` }"></div>
        <div class="thumb" :style="{ left: `${percentage}%` }" :data-tooltip="tooltipValue"></div>
      </template>
      <template v-else>
        <div class="track" :style="{ width: `${end - start}%`, left: `${start}%` }"></div>
        <div class="thumb" :style="{ left: `${start}%` }" :data-tooltip="tooltipRangeStartValue"></div>
        <div class="thumb" :style="{ left: `${end}%` }" :data-tooltip="tooltipRangeEndValue"></div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import NP from 'number-precision'

const getBoundingClientRectViewLeft = (element: HTMLElement) => {
  return element.getBoundingClientRect().left
}

const props = withDefaults(defineProps<{
  value: number | [number, number]
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  range?: boolean
}>(), {
  disabled: false,
  min: 0,
  max: 100,
  step: 1,
  range: false,
})

const emit = defineEmits<{
  (event: 'update:value', payload: number | [number, number]): void
}>()

const sliderRef = ref<HTMLElement>()
const percentage = ref(0)
const start = ref(0)
const end = ref(0)
const handler = ref<'start' | 'end'>('end')

const getNewValue = (percentage: number) => {
  let diff = percentage / 100 * (props.max - props.min)
  if (props.step >= 1) diff = Math.fround(diff)
  else {
    const str = props.step.toString()
    const match = str.match(/^[0.]*([1-9])/)

    if (match) {
      const targetNumber = match[1]
      const position = str.indexOf(targetNumber) - 1
      if (position > 0) {
        const accuracy = Math.pow(10, position)
        diff = Math.fround(diff * accuracy) / accuracy
      }
    }
  }
  return NP.plus(diff, props.min)
}

const tooltipValue = computed(() => {
  return getNewValue(percentage.value)
})
const tooltipRangeStartValue = computed(() => {
  return getNewValue(start.value)
})
const tooltipRangeEndValue = computed(() => {
  return getNewValue(end.value)
})

watch(() => props.value, () => {
  if (props.max === props.min) return
  if (typeof props.value === 'number') {
    percentage.value = (props.value - props.min) / (props.max - props.min) * 100
  }
  else {
    start.value = (props.value[0] - props.min) / (props.max - props.min) * 100
    end.value = (props.value[1] - props.min) / (props.max - props.min) * 100
  }
}, {
  immediate: true,
})

const getPercentage = (e: MouseEvent | TouchEvent) => {
  if (!sliderRef.value) return 0
  const clientX = 'clientX' in e ? e.clientX : e.changedTouches[0].clientX
  let progress = (clientX - getBoundingClientRectViewLeft(sliderRef.value)) / sliderRef.value.clientWidth
  progress = Math.max(progress, 0)
  progress = Math.min(progress, 1)

  let _percentage = progress * 100
  const step = props.step / (props.max - props.min) * 100
  const remainder = _percentage % step

  if (remainder > 0) {
    if (remainder <= step / 2) _percentage = _percentage - remainder
    else _percentage = _percentage - remainder + step
  }
  return _percentage
}

// 双滑块（范围）模式
const updateRange = (e: MouseEvent | TouchEvent) => {
  const value = getPercentage(e)

  if (handler.value === 'start') start.value = value
  else end.value = value
}

const updateRangeEnd = (e: MouseEvent | TouchEvent) => {
  updatePercentage(e)
  const newValue = getNewValue(percentage.value)
  const oldValueArr = props.value as [number, number]
  const newValueArr: [number, number] = handler.value === 'start' ? [newValue, oldValueArr[1]] : [oldValueArr[0], newValue]
  if (newValueArr[0] > newValueArr[1]) {
    [newValueArr[0], newValueArr[1]] = [newValueArr[1], newValueArr[0]]
  }

  emit('update:value', newValueArr)

  document.removeEventListener('mousemove', updateRange)
  document.removeEventListener('touchmove', updateRange)
  document.removeEventListener('mouseup', updateRangeEnd)
  document.removeEventListener('touchend', updateRangeEnd)
}

// 单滑块模式
const updatePercentage = (e: MouseEvent | TouchEvent) => {
  percentage.value = getPercentage(e)
}

const updatePercentageEnd = (e: MouseEvent | TouchEvent) => {
  updatePercentage(e)
  const newValue = getNewValue(percentage.value)

  emit('update:value', newValue)

  document.removeEventListener('mousemove', updatePercentage)
  document.removeEventListener('touchmove', updatePercentage)
  document.removeEventListener('mouseup', updatePercentageEnd)
  document.removeEventListener('touchend', updatePercentageEnd)
}

const handleMousedown = (e: MouseEvent | TouchEvent) => {
  if (props.disabled) return

  if (props.range) {
    const _percentage = getPercentage(e)
    
    if (Math.abs(_percentage - start.value) < Math.abs(_percentage - end.value)) {
      handler.value = 'start'
    }
    else handler.value = 'end'

    document.addEventListener('mousemove', updateRange)
    document.addEventListener('touchmove', updateRange)
    document.addEventListener('mouseup', updateRangeEnd)
    document.addEventListener('touchend', updateRangeEnd)
  }
  else {
    document.addEventListener('mousemove', updatePercentage)
    document.addEventListener('touchmove', updatePercentage)
    document.addEventListener('mouseup', updatePercentageEnd)
    document.addEventListener('touchend', updatePercentageEnd)
  }
}
</script>

<style scoped lang="scss">
.slider {
  width: 100%;
  height: 12px;
  padding: 4px 0;
  user-select: none;

  &.disabled {
    .track {
      background-color: #b4b4b4;
    }

    .thumb {
      outline: 2px solid #b4b4b4;
    }
  }
}
.slider:not(.disabled) {
  cursor: pointer;

  .bar {
    &:hover {
      background-color: #f0f0f0;
    }
  }

  .track {
    &:hover {
      background-color: $themeHoverColor;
    }
  }

  .thumb {
    &:hover, &:active {
      outline: 4px solid $themeColor;
    }
  }
}

.bar {
  width: calc(100% - 10px);
  margin-left: 5px;
  height: 4px;
  border-radius: 2px;
  position: relative;
  background-color: #f5f5f5;
  user-select: none;
  transition: background-color .2s;
}

.track {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: $themeColor;
  transition: background-color .2s;
}

.thumb {
  position: absolute;
  top: 50%;
  left: 0;
  width: 10px;
  height: 10px;
  background-color: #fff;
  outline: 2px solid $themeColor;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  z-index: 100;

  &:hover, &:active {
    &::before, &::after {
      display: block;
    }
  }

  &::before {
    content: attr(data-tooltip);
    min-width: 28px;
    display: none;
    position: absolute;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    background-color: #262626;
    text-align: center;
    color: #fff;
    border-radius: $borderRadius;
    padding: 6px 5px;
    font-size: 12px;
  }
  &::after {
    content: '';
    display: none;
    position: absolute;
    left: 50%;
    bottom: 15px;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #262626;
  }
}
</style>