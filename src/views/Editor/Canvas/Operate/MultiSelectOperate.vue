<template>
  <div 
    class="multi-select-operate"
    :style="{
      left: range.minX * canvasScale + 'px',
      top: range.minY * canvasScale + 'px',
    }"
  >
    <BorderLine v-for="line in borderLines" :key="line.type" :type="line.type" :style="line.style" />

    <template v-if="!disableResize">
      <ResizeHandler
        v-for="point in resizeHandlers"
        :key="point.direction"
        :type="point.direction"
        :style="point.style"
        @mousedown.stop="scaleMultiElement($event, range, point.direction)"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, PropType, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { PPTElement } from '@/types/slides'
import { getElementListRange } from '@/utils/element'
import { OperateResizeHandlers, MultiSelectRange } from '@/types/edit'
import useCommonOperate from '../hooks/useCommonOperate'

import ResizeHandler from './ResizeHandler.vue'
import BorderLine from './BorderLine.vue'

const props = defineProps({
  elementList: {
    type: Array as PropType<PPTElement[]>,
    required: true,
  },
  scaleMultiElement: {
    type: Function as PropType<(e: MouseEvent, range: MultiSelectRange, command: OperateResizeHandlers) => void>,
    required: true,
  },
})

const { activeElementIdList, canvasScale } = storeToRefs(useMainStore())

const localActiveElementList = computed(() => props.elementList.filter(el => activeElementIdList.value.includes(el.id)))

const range = ref({
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
})

// 根据多选元素整体在画布中的范围，计算边框线和缩放点的位置信息
const width = computed(() => (range.value.maxX - range.value.minX) * canvasScale.value)
const height = computed(() => (range.value.maxY - range.value.minY) * canvasScale.value)
const { resizeHandlers, borderLines } = useCommonOperate(width, height)

// 计算多选元素整体在画布中的范围
const setRange = () => {
  const { minX, maxX, minY, maxY } = getElementListRange(localActiveElementList.value)
  range.value = { minX, maxX, minY, maxY }
}
watchEffect(setRange)

// 禁用多选状态下缩放：仅未旋转的图片和形状可以在多选状态下缩放
const disableResize = computed(() => {
  return localActiveElementList.value.some(item => {
    if (
      (item.type === 'image' || item.type === 'shape') && 
      !item.rotate
    ) return false
    return true
  })
})
</script>

<style lang="scss" scoped>
.multi-select-operate {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 101;
}
</style>