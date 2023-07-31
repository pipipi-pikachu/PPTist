<template>
  <div class="line-style-panel">
    <div class="row">
      <div style="flex: 2;">line style:</div>
      <Select style="flex: 3;" :value="handleLineElement.style"
        @change="value => updateLine({ style: value as 'solid' | 'dashed' })">
        <SelectOption value="solid">solid line</SelectOption>
        <SelectOption value="dashed">dashed line</SelectOption>
      </select>
    </div>
    <div class="row">
      <div style="flex: 2;">line color:</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker :modelValue="handleLineElement.color" @update:modelValue="value => updateLine({ color: value })" />
        </template>
        <ColorButton :color="handleLineElement.color" style="flex: 3;" />
      </Popover>
    </div>
    <div class="row">
      <div style="flex: 2;">line width:</div>
      <InputNumber :value="handleLineElement.width" @change="value => updateLine({ width: value as number })"
        style="flex: 3;" />
    </div>

    <div class="row">
      <div style="flex: 2;">Start style:</div>
      <Select style="flex: 3;" :value="handleLineElement.points[0]"
        @change="value => updateLine({ points: [value as 'arrow' | 'dot', handleLineElement.points[1]] })">
        <SelectOption value="">None</SelectOption>
        <SelectOption value="arrow">Arrow</SelectOption>
        <SelectOption value="dot">Dot</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">End style:</div>
      <Select style="flex: 3;" :value="handleLineElement.points[1]"
        @change="value => updateLine({ points: [handleLineElement.points[0], value as 'arrow' | 'dot'] })">
        <SelectOption value="">None</SelectOption>
        <SelectOption value="arrow">Arrow</SelectOption>
        <SelectOption value="dot">Dot</SelectOption>
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
import ColorPicker from '@/components/ColorPicker/index.vue'
import {
  InputNumber,
  Divider,
  Popover,
  Select,
} from 'ant-design-vue'
const SelectOption = Select.Option

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