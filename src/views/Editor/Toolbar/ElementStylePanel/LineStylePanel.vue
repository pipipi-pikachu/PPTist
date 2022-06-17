<template>
  <div class="line-style-panel">
    <div class="row">
      <div style="flex: 2;">线条样式：</div>
      <Select 
        style="flex: 3;" 
        :value="handleLineElement.style" 
        @change="value => updateLine({ style: value as 'solid' | 'dashed' })"
      >
        <SelectOption value="solid">实线</SelectOption>
        <SelectOption value="dashed">虚线</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">线条颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="handleLineElement.color"
            @update:modelValue="value => updateLine({ color: value })"
          />
        </template>
        <ColorButton :color="handleLineElement.color" style="flex: 3;" />
      </Popover>
    </div>
    <div class="row">
      <div style="flex: 2;">线条宽度：</div>
      <InputNumber 
        :value="handleLineElement.width" 
        @change="value => updateLine({ width: value as number })" 
        style="flex: 3;" 
      />
    </div>
    
    <div class="row">
      <div style="flex: 2;">起点样式：</div>
      <Select 
        style="flex: 3;" 
        :value="handleLineElement.points[0]" 
        @change="value => updateLine({ points: [value as 'arrow' | 'dot', handleLineElement.points[1]] })"
      >
        <SelectOption value="">无</SelectOption>
        <SelectOption value="arrow">箭头</SelectOption>
        <SelectOption value="dot">圆点</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">终点样式：</div>
      <Select 
        style="flex: 3;" 
        :value="handleLineElement.points[1]" 
        @change="value => updateLine({ points: [handleLineElement.points[0], value as 'arrow' | 'dot'] })"
      >
        <SelectOption value="">无</SelectOption>
        <SelectOption value="arrow">箭头</SelectOption>
        <SelectOption value="dot">圆点</SelectOption>
      </Select>
    </div>

    <Divider />
    <ElementShadow />
  </div>
</template>

<script lang="ts" setup>
import { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTLineElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementShadow from '../common/ElementShadow.vue'
import ColorButton from '../common/ColorButton.vue'

const slidesStore = useSlidesStore()
const { handleElement } = storeToRefs(useMainStore())

const handleLineElement = handleElement as Ref<PPTLineElement>

const { addHistorySnapshot } = useHistorySnapshot()

const updateLine = (props: Partial<PPTLineElement>) => {
  if (!handleElement.value) return
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
.line-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 !important;

  .line-wrapper {
    margin-left: 8px;
  }
}
.line-wrapper {
  overflow: visible;
}
.line-btn-icon {
  width: 30px;
  font-size: 12px;
  margin-top: 2px;
  color: #bfbfbf;
}
.preset-point-style {
  padding: 0 10px;

  & + .preset-point-style {
    margin-top: 10px;
  }
}
</style>