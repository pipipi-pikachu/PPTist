<template>
  <div class="element-opacity">
    <div class="row">
      <div style="flex: 2;">不透明度：</div>
      <Slider
        class="slider"
        :min="0"
        :max="1"
        :step="0.1"
        :value="opacity"
        @change="value => updateOpacity(value as number)" 
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

const slidesStore = useSlidesStore()
const { handleElement } = storeToRefs(useMainStore())

const opacity = ref<number>(1)

watch(handleElement, () => {
  if (!handleElement.value) return
  opacity.value = 'opacity' in handleElement.value && handleElement.value.opacity !== undefined ? handleElement.value.opacity : 1
}, { deep: true, immediate: true })

const { addHistorySnapshot } = useHistorySnapshot()

const updateOpacity = (value: number) => {
  if (!handleElement.value) return
  const props = { opacity: value }
  slidesStore.updateElement({ id: handleElement.value.id, props })
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
.slider {
  flex: 3;
}
</style>