<template>
  <div class="element-flip">
    <ButtonGroup class="row">
      <CheckboxButton 
        style="flex: 1;"
        :checked="flipV"
        @click="updateFlip({ flipV: !flipV })"
      ><IconFlipVertically /> 垂直翻转</CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="flipH"
        @click="updateFlip({ flipH: !flipH })"
      ><IconFlipHorizontally /> 水平翻转</CheckboxButton>
    </ButtonGroup>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { ImageOrShapeFlip } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import CheckboxButton from '@/components/CheckboxButton.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'

const slidesStore = useSlidesStore()
const { handleElement } = storeToRefs(useMainStore())

const flipH = ref(false)
const flipV = ref(false)

watch(handleElement, () => {
  if (handleElement.value && (handleElement.value.type === 'image' || handleElement.value.type === 'shape')) {
    flipH.value = !!handleElement.value.flipH
    flipV.value = !!handleElement.value.flipV
  }
}, { deep: true, immediate: true })

const { addHistorySnapshot } = useHistorySnapshot()

const updateFlip = (flipProps: ImageOrShapeFlip) => {
  if (!handleElement.value) return
  slidesStore.updateElement({ id: handleElement.value.id, props: flipProps })
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>