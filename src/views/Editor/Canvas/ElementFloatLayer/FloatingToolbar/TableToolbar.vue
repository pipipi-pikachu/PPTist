<template>
  <div class="toolbar-content">
    <Popover trigger="click">
      <template #content>
        <ColorPicker :modelValue="cellBackcolor" @update:modelValue="value => updateCellBackcolor(value)" />
      </template>
      <button class="toolbar-btn">
        <i-icon-park-outline:fill class="icon" />
        <span>填充</span>
      </button>
    </Popover>
    <BorderPanel />
  </div>
</template>

<script lang="ts" setup>
import { computed, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTTableElement, TableCell, TableCellStyle } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import BorderPanel from './BorderPanel.vue'
import Popover from '@/components/Popover.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'

defineProps<{
  elementInfo: PPTTableElement
}>()

const slidesStore = useSlidesStore()
const { handleElement, handleElementId, selectedTableCells } = storeToRefs(useMainStore())

const handleTableElement = handleElement as Ref<PPTTableElement>

const cellBackcolor = computed(() => {
  const el = handleTableElement.value
  if (!el || el.type !== 'table') return ''

  let rowIndex = 0
  let colIndex = 0
  if (selectedTableCells.value.length) {
    const selected = selectedTableCells.value[0]
    rowIndex = +selected.split('_')[0]
    colIndex = +selected.split('_')[1]
  }
  return el.data[rowIndex]?.[colIndex]?.style?.backcolor || ''
})

const { addHistorySnapshot } = useHistorySnapshot()

const updateCellBackcolor = (backcolor: string) => {
  const el = handleTableElement.value
  if (!el || el.type !== 'table') return

  const data: TableCell[][] = JSON.parse(JSON.stringify(el.data))
  const selected = selectedTableCells.value
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (!selected.length || selected.includes(`${i}_${j}`)) {
        const style: TableCellStyle = data[i][j].style || {}
        data[i][j].style = { ...style, backcolor }
      }
    }
  }
  slidesStore.updateElement({ id: handleElementId.value, props: { data } })
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
</style>
