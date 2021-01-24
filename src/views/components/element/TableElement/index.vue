<template>
  <div 
    class="editable-element-table"
    ref="elementRef"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
    }"
  >
    <div 
      class="element-content" 
      v-contextmenu="contextmenus"
    >
      <div 
        class="table-mask" 
        :class="{ 'lock': elementInfo.lock }"
        v-if="!editable || elementInfo.lock"
        @dblclick="startEdit()"
        @mousedown="$event => handleSelectElement($event)"
      >
        <div class="mask-tip" :style="{ transform: `scale(${ 1 / canvasScale })` }">双击编辑</div>
      </div>

      <EditableTable 
        @mousedown.stop
        :data="elementInfo.data"
        :width="elementInfo.width"
        :colWidths="elementInfo.colWidths"
        :outline="elementInfo.outline"
        :theme="elementInfo.theme"
        :editable="editable"
        @change="data => updateTableCells(data)"
        @changeColWidths="widths => updateColWidths(widths)"
        @changeSelectedCells="cells => updateSelectedCells(cells)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { PPTTableElement, TableCell, TableCellStyle } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import EditableTable from './EditableTable.vue'

export default defineComponent({
  name: 'editable-element-table',
  components: {
    EditableTable,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTTableElement>,
      required: true,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTTableElement, canMove?: boolean) => void>,
      required: true,
    },
    contextmenus: {
      type: Function as PropType<() => ContextmenuItem[]>,
    },
  },
  setup(props) {
    const store = useStore<State>()
    const canvasScale = computed(() => store.state.canvasScale)

    const { addHistorySnapshot } = useHistorySnapshot()

    const handleSelectElement = (e: MouseEvent) => {
      if(props.elementInfo.lock) return
      e.stopPropagation()

      props.selectElement(e, props.elementInfo)
    }
    const editable = ref(false)
    const handleElementId = computed(() => store.state.handleElementId)

    watch(handleElementId, () => {
      if(handleElementId.value !== props.elementInfo.id) editable.value = false
    })

    watch(editable, () => {
      store.commit(MutationTypes.SET_DISABLE_HOTKEYS_STATE, editable.value)
    })
    
    const elementRef = ref<HTMLElement>()

    const isScaling = ref(false)
    const realHeightCache = ref(-1)

    const scaleElementStateListener = (state: boolean) => {
      isScaling.value = state

      if(state) editable.value = false

      if(!state && realHeightCache.value !== -1) {
        store.commit(MutationTypes.UPDATE_ELEMENT, {
          id: props.elementInfo.id,
          props: { height: realHeightCache.value },
        })
        realHeightCache.value = -1
      }
    }

    emitter.on(EmitterEvents.SCALE_ELEMENT_STATE, state => scaleElementStateListener(state))
    onUnmounted(() => {
      emitter.off(EmitterEvents.SCALE_ELEMENT_STATE, state => scaleElementStateListener(state))
    })

    const updateTableElementHeight = (entries: ResizeObserverEntry[]) => {
      const contentRect = entries[0].contentRect
      if(!elementRef.value) return

      const realHeight = contentRect.height

      if(props.elementInfo.height !== realHeight) {
        if(!isScaling.value) {
          store.commit(MutationTypes.UPDATE_ELEMENT, {
            id: props.elementInfo.id,
            props: { height: realHeight },
          })
        }
        else realHeightCache.value = realHeight
      }
    }

    const resizeObserver = new ResizeObserver(updateTableElementHeight)

    onMounted(() => {
      if(elementRef.value) resizeObserver.observe(elementRef.value)
    })
    onUnmounted(() => {
      if(elementRef.value) resizeObserver.unobserve(elementRef.value)
    })

    const updateTableCells = (data: TableCell[][]) => {
      store.commit(MutationTypes.UPDATE_ELEMENT, {
        id: props.elementInfo.id, 
        props: { data },
      })
      addHistorySnapshot()
    }
    const updateColWidths = (widths: number[]) => {
      const width = widths.reduce((a, b) => a + b)
      const colWidths = widths.map(item => item / width)

      store.commit(MutationTypes.UPDATE_ELEMENT, {
        id: props.elementInfo.id, 
        props: { width, colWidths },
      })
      addHistorySnapshot()
    }

    const selectedCells = ref<string[]>([])

    const emitUpdateTextAttrsState = () => {
      let rowIndex = 0
      let colIndex = 0
      if(selectedCells.value.length) {
        const selectedCell = selectedCells.value[0]
        rowIndex = +selectedCell.split('_')[0]
        colIndex = +selectedCell.split('_')[1]
      }
      emitter.emit(EmitterEvents.UPDATE_TABLE_TEXT_STATE, props.elementInfo.data[rowIndex][colIndex].style)
    }

    const updateTextAttrs = (textAttrProp: Partial<TableCellStyle>) => {
      const data: TableCell[][] = JSON.parse(JSON.stringify(props.elementInfo.data))

      for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].length; j++) {
          if(!selectedCells.value.length || selectedCells.value.includes(`${i}_${j}`)) {
            const style = data[i][j].style || {}
            data[i][j].style = { ...style, ...textAttrProp }
          }
        }
      }

      store.commit(MutationTypes.UPDATE_ELEMENT, {
        id: props.elementInfo.id, 
        props: { data },
      })

      addHistorySnapshot()
      nextTick(emitUpdateTextAttrsState)
    }

    const updateSelectedCells = (cells: string[]) => {
      selectedCells.value = cells
      nextTick(emitUpdateTextAttrsState)
    }

    emitter.on(EmitterEvents.EXEC_TABLE_TEXT_COMMAND, state => updateTextAttrs(state))
    onUnmounted(() => {
      emitter.off(EmitterEvents.EXEC_TABLE_TEXT_COMMAND, state => updateTextAttrs(state))
    })

    const startEdit = () => {
      if(!props.elementInfo.lock) editable.value = true
    }

    return {
      elementRef,
      canvasScale,
      handleSelectElement,
      updateTableCells,
      updateColWidths,
      editable,
      startEdit,
      selectedCells,
      updateSelectedCells,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element-table {
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
.table-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  opacity: 0;
  transition: opacity .2s;

  .mask-tip {
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: rgba($color: #000, $alpha: .5);
    color: #fff;
    padding: 6px 12px;
    font-size: 12px;
    transform-origin: 0 0;
  }

  &:hover:not(.lock) {
    opacity: .9;
  }
}
</style>
