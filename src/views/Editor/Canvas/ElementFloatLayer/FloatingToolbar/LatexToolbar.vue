<template>
  <div class="toolbar-content">
    <button class="toolbar-btn" @click="openLatexEditor()">
      <i-icon-park-outline:edit class="icon" />
      <span>编辑 LaTeX</span>
    </button>
    <Popover trigger="click">
      <template #content>
        <ColorPicker :modelValue="handleLatexElement.color" @update:modelValue="value => updateLatex({ color: value })" />
      </template>
      <button class="toolbar-btn">
        <i-icon-park-outline:platte class="icon" />
        <span>颜色</span>
      </button>
    </Popover>
  </div>
</template>

<script lang="ts" setup>
import { type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTLatexElement } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import Popover from '@/components/Popover.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'

defineProps<{
  elementInfo: PPTLatexElement
}>()

const slidesStore = useSlidesStore()
const { handleElement } = storeToRefs(useMainStore())

const handleLatexElement = handleElement as Ref<PPTLatexElement>

const { addHistorySnapshot } = useHistorySnapshot()

const updateLatex = (props: Partial<PPTLatexElement>) => {
  if (!handleElement.value) return
  slidesStore.updateElement({ id: handleElement.value.id, props })
  addHistorySnapshot()
}

const openLatexEditor = () => {
  emitter.emit(EmitterEvents.OPEN_LATEX_EDITOR)
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
</style>
