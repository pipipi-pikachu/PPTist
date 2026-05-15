<template>
  <div class="toolbar-content">
    <Popover
      trigger="click"
      :contentStyle="{ width: '120px' }"
    >
      <template #content>
        <div class="line-style-list">
          <div
            class="line-style-item"
            :class="{ active: handleLineElement.style === item }"
            v-for="item in lineStyleOptions"
            :key="item"
            @click="updateLine({ style: item })"
          >
            <SVGLine :type="item" />
          </div>
        </div>
      </template>
      <button class="toolbar-btn">
        <i-icon-park-outline:connection class="icon" />
        <span>样式</span>
      </button>
    </Popover>
    <Popover trigger="click">
      <template #content>
        <ColorPicker :modelValue="handleLineElement.color" @update:modelValue="value => updateLine({ color: value })" />
      </template>
      <button class="toolbar-btn">
        <i-icon-park-outline:platte class="icon" />
        <span>颜色</span>
      </button>
    </Popover>
    <div class="width-slider">
      <Slider
        :min="1"
        :max="12"
        :step="1"
        :value="handleLineElement.width"
        @update:value="value => updateLine({ width: value as number })"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { LineStyleType, PPTLineElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import SVGLine from '@/views/Editor/Toolbar/common/SVGLine.vue'
import Popover from '@/components/Popover.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Slider from '@/components/Slider.vue'

defineProps<{
  elementInfo: PPTLineElement
}>()

const slidesStore = useSlidesStore()
const { handleElement } = storeToRefs(useMainStore())

const handleLineElement = handleElement as Ref<PPTLineElement>

const lineStyleOptions: LineStyleType[] = ['solid', 'dashed', 'dotted']

const { addHistorySnapshot } = useHistorySnapshot()

const updateLine = (props: Partial<PPTLineElement>) => {
  if (!handleElement.value) return
  slidesStore.updateElement({ id: handleElement.value.id, props })
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
.line-style-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.line-style-item {
  height: 32px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  border-radius: $borderRadius;
  cursor: pointer;

  &:hover {
    background-color: rgba($color: $themeColor, $alpha: .05);
  }
  &.active {
    color: $themeColor;
  }
}
.width-slider {
  width: 120px;
  padding: 0 8px;
  flex-shrink: 0;
}
</style>
