<template>
  <div class="export-pptx-dialog">
    <div class="configs">
      <div class="row">
        <div class="title">Export Range:</div>
        <RadioGroup
          class="config-item"
          v-model:value="rangeType"
        >
          <RadioButton style="width: 33.33%;" value="all">All</RadioButton>
          <RadioButton style="width: 33.33%;" value="current">Current Page</RadioButton>
          <RadioButton style="width: 33.33%;" value="custom">Custom</RadioButton>
        </RadioGroup>
      </div>
      <div class="row" v-if="rangeType === 'custom'">
        <div class="title" :data-range="`（${range[0]} ~ ${range[1]}）`">Custom Scope:</div>
        <Slider
          class="config-item"
          range
          :min="1"
          :max="slides.length"
          :step="1"
          v-model:value="range"
        />
      </div>
      <div class="row">
        <div class="title">Mute Audio/Video：</div>
        <div class="config-item">
          <Switch v-model:value="ignoreMedia" v-tooltip="'Audio and video are ignored by default when exporting. If your slides contain audio and video elements and you want to export them to a PPTX file, you can choose to turn off the [Ignore Audio and Video] option, but please note that this will significantly increase the export time.'" />
        </div>
      </div>
      <div class="row">
        <div class="title">Override the default master:</div>
        <div class="config-item">
          <Switch v-model:value="masterOverwrite" />
        </div>
      </div>

      <div class="tip" v-if="!ignoreMedia">
        hint: 1. Supported export formats: avi、mp4、mov、wmv、mp3、wav, 2. Cross-origin resources cannot be exported.
      </div>
    </div>
    <div class="btns">
      <Button class="btn export" type="primary" @click="exportPPTX(selectedSlides, masterOverwrite, ignoreMedia)">Export PPTX</Button>
      <Button class="btn close" @click="emit('close')">Close</Button>
    </div>

    <FullscreenSpin :loading="exporting" tip="Exporting..." />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useExport from '@/hooks/useExport'

import FullscreenSpin from '@/components/FullscreenSpin.vue'
import Switch from '@/components/Switch.vue'
import Slider from '@/components/Slider.vue'
import Button from '@/components/Button.vue'
import RadioButton from '@/components/RadioButton.vue'
import RadioGroup from '@/components/RadioGroup.vue'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { slides, currentSlide } = storeToRefs(useSlidesStore())

const { exportPPTX, exporting } = useExport()

const rangeType = ref<'all' | 'current' | 'custom'>('all')
const range = ref<[number, number]>([1, slides.value.length])
const masterOverwrite = ref(true)
const ignoreMedia = ref(true)

const selectedSlides = computed(() => {
  if (rangeType.value === 'all') return slides.value
  if (rangeType.value === 'current') return [currentSlide.value]
  return slides.value.filter((item, index) => {
    const [min, max] = range.value
    return index >= min - 1 && index <= max - 1
  })
})
</script>

<style lang="scss" scoped>
.export-pptx-dialog {
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
    margin-top: 10px;
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