<template>
  <div class="editable-element-shape"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
    }"
    @mousedown="$event => handleSelectElement($event)"
  >
    <div 
      class="element-content" 
      v-contextmenu="contextmenus"
    >
      <EditableTable 
        :data="elementInfo.data"
        :colWidths="elementInfo.colWidths"
        @change="data => updateTableCells(data)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PPTShapeElement, TableCell } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'

import EditableTable from './EditableTable.vue'

export default defineComponent({
  name: 'editable-element-shape',
  components: {
    EditableTable,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTShapeElement>,
      required: true,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTShapeElement, canMove?: boolean) => void>,
      required: true,
    },
    contextmenus: {
      type: Function as PropType<() => ContextmenuItem[]>,
    },
  },
  setup(props) {
    const handleSelectElement = (e: MouseEvent) => {
      if(props.elementInfo.lock) return
      e.stopPropagation()

      props.selectElement(e, props.elementInfo)
    }

    const updateTableCells = (data: TableCell[][]) => {
      console.log(data)
    }

    return {
      handleSelectElement,
      updateTableCells,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element-shape {
  position: absolute;
  cursor: move;

  &.lock .element-content {
    cursor: default;
  }
}

.element-content {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
