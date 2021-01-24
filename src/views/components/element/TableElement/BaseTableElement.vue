<template>
  <div 
    class="base-element-table"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
    }"
  >
    <div class="element-content">
      <StaticTable
        :data="elementInfo.data"
        :width="elementInfo.width"
        :colWidths="elementInfo.colWidths"
        :outline="elementInfo.outline"
        :theme="elementInfo.theme"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PPTTableElement } from '@/types/slides'

import StaticTable from './StaticTable.vue'

export default defineComponent({
  name: 'base-element-table',
  components: {
    StaticTable,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTTableElement>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.base-element-table {
  position: absolute;
}

.element-content {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
