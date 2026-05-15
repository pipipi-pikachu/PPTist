<template>
  <div ref="toolbarRef" class="floating-toolbar" :style="toolbarStyle" @mousedown.stop>
    <component
      :is="currentToolbarComponent"
      :elementInfo="elementInfo"
      @resize="measureToolbar()"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, nextTick, type Component } from 'vue'
import {
  ElementTypes,
  type PPTElement,
} from '@/types/slides'

import TextToolbar from './TextToolbar.vue'
import ImageToolbar from './ImageToolbar.vue'
import ShapeToolbar from './ShapeToolbar.vue'
import TableToolbar from './TableToolbar.vue'
import LineToolbar from './LineToolbar.vue'
import LatexToolbar from './LatexToolbar.vue'
import ChartToolbar from './ChartToolbar.vue'

const props = defineProps<{
  elementInfo: PPTElement
  toolbarStyle: Record<string, string>
}>()

const emit = defineEmits<{
  (e: 'measure', width: number): void
}>()

const toolbarRef = ref<HTMLElement | null>(null)

const measureToolbar = () => {
  nextTick(() => {
    if (toolbarRef.value) emit('measure', toolbarRef.value.clientWidth)
  })
}

const currentToolbarComponent = computed<unknown>(() => {
  const toolbarComponentMap: Partial<Record<ElementTypes, Component>> = {
    [ElementTypes.TEXT]: TextToolbar,
    [ElementTypes.IMAGE]: ImageToolbar,
    [ElementTypes.SHAPE]: ShapeToolbar,
    [ElementTypes.TABLE]: TableToolbar,
    [ElementTypes.LINE]: LineToolbar,
    [ElementTypes.CHART]: ChartToolbar,
    [ElementTypes.LATEX]: LatexToolbar,
  }
  return toolbarComponentMap[props.elementInfo.type]
})

onMounted(measureToolbar)
</script>

<style lang="scss" scoped>
.floating-toolbar {
  position: absolute;
  width: max-content;
  height: 40px;
  padding: 0 5px;
  background-color: #fff;
  border: 1px solid rgba($color: #d9d9d9, $alpha: .2);
  box-shadow: $boxShadow;
  border-radius: $borderRadius;
  display: flex;
  align-items: center;
}
</style>
