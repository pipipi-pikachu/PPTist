<template>
  <div class="viewport-size-setting">
    <div class="title">{{ t('自定义画布尺寸') }}</div>
    <div class="row">
      <div class="label">{{ t('宽度：') }}</div>
      <NumberInput 
        v-model:value="customViewportWidth"
        :min="VIEWPORT_SIZE_MIN"
        :max="VIEWPORT_SIZE_MAX"
        style="flex: 1;"
        @enter="applyCustomViewportSize()"
      />
    </div>
    <div class="row">
      <div class="label">{{ t('高度：') }}</div>
      <NumberInput 
        v-model:value="customViewportHeight"
        :min="VIEWPORT_SIZE_MIN"
        :max="VIEWPORT_SIZE_MAX"
        style="flex: 1;"
        @enter="applyCustomViewportSize()"
      />
    </div>
    <div class="tip">{{ t('宽高范围：500 ~ 2000') }}</div>
    <div class="btns">
      <Button type="primary" @click="applyCustomViewportSize()">{{ t('确认') }}</Button>
      <Button style="margin-left: 10px;" @click="emit('close')">{{ t('取消') }}</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { t } from '@/i18n'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import message from '@/utils/message'
import { toFixed } from '@/utils/common'

import NumberInput from '@/components/NumberInput.vue'
import Button from '@/components/Button.vue'

const emit = defineEmits<{
  (event: 'close'): void
}>()

const VIEWPORT_SIZE_MIN = 500
const VIEWPORT_SIZE_MAX = 2000

const slidesStore = useSlidesStore()
const { viewportRatio, viewportSize } = storeToRefs(slidesStore)

const customViewportWidth = ref(toFixed(viewportSize.value))
const customViewportHeight = ref(toFixed(viewportSize.value * viewportRatio.value))

const applyCustomViewportSize = () => {
  const width = customViewportWidth.value
  const height = customViewportHeight.value
  if (
    width < VIEWPORT_SIZE_MIN ||
    width > VIEWPORT_SIZE_MAX ||
    height < VIEWPORT_SIZE_MIN ||
    height > VIEWPORT_SIZE_MAX
  ) return message.warning(t('Canvas width and height must each be between {p0} and {p1}.', { p0: VIEWPORT_SIZE_MIN, p1: VIEWPORT_SIZE_MAX }))

  slidesStore.setViewportSize(width)
  slidesStore.setViewportRatio(height / width)
  emit('close')
}
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 17px;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.label {
  width: 50px;
  font-size: 13px;
}
.tip {
  margin-bottom: 18px;
  font-size: 12px;
  color: #888;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
