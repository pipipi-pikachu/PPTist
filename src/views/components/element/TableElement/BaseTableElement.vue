<template>
  <div 
    class="base-element-table"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <div class="element-content">
        <StaticTable
          :data="elementInfo.data"
          :width="elementInfo.width"
          :cellMinHeight="elementInfo.cellMinHeight"
          :colWidths="elementInfo.colWidths"
          :outline="elementInfo.outline"
          :theme="elementInfo.theme"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PPTTableElement } from '@/types/slides'

import StaticTable from './StaticTable.vue'

defineProps<{
  elementInfo: PPTTableElement
}>()
</script>

<style lang="scss" scoped>
.base-element-table {
  position: absolute;
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
