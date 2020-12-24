<template>
  <div 
    class="multi-select-operate"
    :style="{
      left: minX + 'px',
      top: minY + 'px',
      transform: `scale(${1 / canvasScale})`,
    }"
  >
    <BorderLine v-for="line in borderLines" :key="line.type" :type="line.type" :style="line.style" />

    <template v-if="!disableResize">
      <ResizeHandler
        v-for="point in resizeHandlers"
        :key="point.direction"
        :type="point.direction"
        :style="point.style"
        @mousedown.stop="scaleMultiElement($event, { minX, maxX, minY, maxY }, point.direction)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, PropType, watchEffect, toRefs } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'
import { PPTElement, ElementTypes } from '@/types/slides'
import { getElementListRange } from '@/utils/element'
import { OperateResizeHandler, MultiSelectRange } from '@/types/edit'
import useCommonOperate from '@/views/_common/_element/hooks/useCommonOperate'

import ResizeHandler from '@/views/_common/_operate/ResizeHandler.vue'
import BorderLine from '@/views/_common/_operate/BorderLine.vue'

export default defineComponent({
  name: 'multi-select-operate',
  components: {
    ResizeHandler,
    BorderLine,
  },
  props: {
    elementList: {
      type: Array as PropType<PPTElement[]>,
      required: true,
    },
    scaleMultiElement: {
      type: Function as PropType<(e: MouseEvent, range: MultiSelectRange, command: OperateResizeHandler) => void>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore<State>()
    const activeElementIdList = computed(() => store.state.activeElementIdList)
    const canvasScale = computed(() => store.state.canvasScale)
    const localActiveElementList = computed(() => props.elementList.filter(el => activeElementIdList.value.includes(el.id)))

    const range = reactive({
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    })

    const width = computed(() => (range.maxX - range.minX) * canvasScale.value)
    const height = computed(() => (range.maxY - range.minY) * canvasScale.value)
    const { resizeHandlers, borderLines } = useCommonOperate(width, height)

    const disableResize = computed(() => {
      return localActiveElementList.value.some(item => {
        if(
          (item.type === ElementTypes.IMAGE || item.type === ElementTypes.SHAPE) && 
          !item.rotate
        ) return false
        return true
      })
    })

    const setRange = () => {
      const { minX, maxX, minY, maxY } = getElementListRange(localActiveElementList.value)
      range.minX = minX
      range.maxX = maxX
      range.minY = minY
      range.maxY = maxY
    }

    watchEffect(setRange)

    return {
      ...toRefs(range),
      canvasScale,
      borderLines,
      disableResize,
      resizeHandlers,
    }
  },
})
</script>

<style lang="scss" scoped>
.multi-select-operate {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>