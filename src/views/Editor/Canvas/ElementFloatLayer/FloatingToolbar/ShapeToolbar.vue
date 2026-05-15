<template>
  <div class="toolbar-content">
    <Popover trigger="click" :placement="submenuPlacement === 'top' ? 'top' : 'bottom'">
      <template #content>
        <ColorPicker :modelValue="fill" @update:modelValue="value => updateFill(value)" />
      </template>
      <button class="toolbar-btn">
        <i-icon-park-outline:fill class="icon" />
        <span>填充</span>
      </button>
    </Popover>
    <BorderPanel :submenuPlacement="submenuPlacement" />
    <template v-if="handleShapeElement.text?.content">
      <div class="divider"></div>
      <TextStyleControls :submenuPlacement="submenuPlacement" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { type Ref, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTShapeElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import BorderPanel from './BorderPanel.vue'
import TextStyleControls from './TextStyleControls.vue'
import Popover from '@/components/Popover.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'

defineProps<{
  elementInfo: PPTShapeElement
  submenuPlacement: 'top' | 'bottom'
}>()

const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(useMainStore())

const handleShapeElement = handleElement as Ref<PPTShapeElement>

const fill = ref('#fff')

watch(handleShapeElement, () => {
  if (!handleShapeElement.value || handleShapeElement.value.type !== 'shape') return
  fill.value = handleShapeElement.value.fill || '#fff'
}, { deep: true, immediate: true })

const { addHistorySnapshot } = useHistorySnapshot()

const updateFill = (value: string) => {
  slidesStore.removeElementProps({ id: handleElementId.value, propName: ['gradient', 'pattern'] })
  slidesStore.updateElement({ id: handleElementId.value, props: { fill: value } })
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.toolbar-content {
  width: max-content;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  gap: 4px;
}
.toolbar-btn {
  min-width: 30px;
  height: 30px;
  flex-shrink: 0;
  padding: 0 5px;
  border: 0;
  color: $textColor;
  background-color: transparent;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  border-radius: $borderRadius;
  cursor: pointer;

  &:hover {
    background-color: $lightGray;
  }

  .icon {
    flex-shrink: 0;
    font-size: 16px;
  }
  span {
    flex-shrink: 0;
    font-size: 12px;
    margin-left: 5px;
  }
}
.divider {
  width: 1px;
  height: 18px;
  background-color: $borderColor;
  margin: 0 4px;
  flex-shrink: 0;
}
</style>
