<template>
  <div class="export-super-ppt-dialog">
    <div class="configs">
      <div class="row">
        <div class="title">Export range:</div>
        <RadioGroup
          class="config-item"
          v-model:value="rangeType"
        >
          <RadioButton value="all">All</RadioButton>
          <RadioButton value="current">Current page</RadioButton>
          <RadioButton value="custom">Custom</RadioButton>
        </RadioGroup>
      </div>
      <div class="row" v-if="rangeType === 'custom'">
        <div class="title" :data-range="`(${range[0]} ~ ${range[1]})`">Custom range:</div>
        <Slider
          class="config-item"
          range
          :min="1"
          :max="slides.length"
          :step="1"
          v-model:value="range"
        />
      </div>
      <div class="tip">
        Tip: .super-ppt is the unique file suffix of this application, and it supports importing this type of file back into the application.
      </div>
    </div>
    <div class="btns">
      <Button class="btn export" type="primary" @click="exportSpecificFile(selectedSlides)">Export .super-ppt file</Button>
      <Button class="btn close" @click="emit('close')">Close</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useExport from '@/hooks/useExport'

import {
  Button,
  Slider,
  Radio,
} from 'ant-design-vue'
const { Group: RadioGroup, Button: RadioButton } = Radio

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { slides, currentSlide } = storeToRefs(useSlidesStore())

const { exportSpecificFile } = useExport()

const rangeType = ref<'all' | 'current' | 'custom'>('all')
const range = ref<[number, number]>([1, slides. value. length])

const selectedSlides = computed(() => {
  if (rangeType.value === 'all') return slides.value
  if (rangeType.value === 'current') return [currentSlide.value]
  return slides. value. filter((item, index) => {
    const [min, max] = range. value
    return index >= min - 1 && index <= max - 1
  })
})
</script>

<style lang="scss" scoped>
.export-super-ppt-dialog {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.configs {
  width: 350px;
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 25px;
  }

  .title {
    width: 100px;
    position: relative;

    &::after {
      content: attr(data-range);
      position: absolute;
      top: 20px;
      left: 0;
    }
  }
  .config-item {
    flex: 1;
  }

  .tip {
    font-size: 12px;
    color: #aaa;
    line-height: 1.8;
    margin-top: 25px;
  }
}
.btns {
  width: 300px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  .export {
    flex: 1;
  }
  .close {
    width: 100px;
    margin-left: 10px;
  }
}
</style>