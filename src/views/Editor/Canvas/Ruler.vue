<template>
  <div class="ruler">
    <div 
      class="h"
      :style="{
        width: viewportStyles.width * canvasScale + 'px',
        left: viewportStyles.left + 'px',
      }"
    >
      <div 
        class="ruler-marker-100" 
        :class="{ 'hide': markerSize < 36, 'omit': markerSize < 72 }"
        v-for="marker in 20" 
        :key="`h-marker-100-${marker}`"
        :style="{ width: markerSize + 'px' }"
      >
        <span v-if="marker * 100 <= viewportSize">{{ marker * 100 }}</span>
      </div>

      <div class="range" 
        v-if="elementListRange"
        :style="{
          left: elementListRange.minX * canvasScale + 'px',
          width: (elementListRange.maxX - elementListRange.minX) * canvasScale + 'px',
        }"
      ></div>
    </div>
    <div 
      class="v"
      :style="{
        height: viewportStyles.height * canvasScale + 'px',
        top: viewportStyles.top + 'px',
      }"
    >
      <div 
        class="ruler-marker-100" 
        :class="{ 'hide': markerSize < 36, 'omit': markerSize < 72 }"
        v-for="marker in 20" 
        :key="`v-marker-100-${marker}`"
        :style="{ height: markerSize + 'px' }"
      >
        <span v-if="marker * 100 <= viewportSize * viewportRatio">{{ marker * 100 }}</span>
      </div>

      <div class="range" 
        v-if="elementListRange"
        :style="{
          top: elementListRange.minY * canvasScale + 'px',
          height: (elementListRange.maxY - elementListRange.minY) * canvasScale + 'px',
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { getElementListRange } from '@/utils/element'
import type { PPTElement } from '@/types/slides'

interface ViewportStyles {
  top: number
  left: number
  width: number
  height: number
}

const props = defineProps<{
  viewportStyles: ViewportStyles
  elementList: PPTElement[]
}>()

const { canvasScale, activeElementIdList } = storeToRefs(useMainStore())
const { viewportRatio, viewportSize } = storeToRefs(useSlidesStore())

const elementListRange = ref<null | ReturnType<typeof getElementListRange>>(null)

watchEffect(() => {
  const els = props.elementList.filter(el => activeElementIdList.value.includes(el.id))
  if (!els.length) return elementListRange.value = null
  elementListRange.value = getElementListRange(els)
})

const markerSize = computed(() => {
  return props.viewportStyles.width * canvasScale.value / (viewportSize.value / 100)
})
</script>


<style lang="scss" scoped>
.ruler {
  font-size: 12px;
}
.h {
  position: absolute;
  background-color: #fff;
  border: 1px solid $borderColor;
  height: 20px;
  top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  .range {
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: rgba($color: $themeColor, $alpha: .1);
  }

  .ruler-marker-100 {
    height: 100%;
    line-height: 20px;
    text-align: right;
    flex-shrink: 0;
    padding-right: 5px;
    position: relative;

    &.hide span {
      display: none;
    }
    &.omit::before {
      display: none;
    }

    &:not(:last-child)::after {
      content: '';
      width: .1px;
      height: 12px;
      position: absolute;
      right: 0;
      bottom: 0;
      background-color: #999;
    }
    &::before {
      content: '';
      width: .1px;
      height: 8px;
      position: absolute;
      right: 50%;
      bottom: 0;
      background-color: #999;
    }
  }
}
.v {
  position: absolute;
  background-color: #fff;
  border: 1px solid $borderColor;
  width: 20px;
  left: 5px;
  overflow: hidden;

  .range {
    position: absolute;
    left: 0;
    right: 0;
    background-color: rgba($color: $themeColor, $alpha: .1);
  }

  .ruler-marker-100 {
    width: 100%;
    line-height: 20px;
    text-align: right;
    padding-bottom: 5px;
    position: relative;
    writing-mode: vertical-rl;

    &.hide span {
      display: none;
    }
    &.omit::before {
      display: none;
    }

    &:not(:last-child)::after {
      content: '';
      height: .1px;
      width: 12px;
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #999;
    }
    &::before {
      content: '';
      height: .1px;
      width: 8px;
      position: absolute;
      bottom: 50%;
      right: 0;
      background-color: #999;
    }
  }
}
</style>