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
        v-for="marker in 10" 
        :key="`marker-100-${marker}`"
      >
        <span>{{marker * 100}}</span>
      </div>
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
        v-for="marker in 10" 
        :key="marker" 
        :style="{ height: markerSize + 'px' }"
      >
        <span>{{marker * 100}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'

interface ViewportStyles {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default defineComponent({
  props: {
    viewportStyles: {
      type: Object as PropType<ViewportStyles>,
      required: true,
    },
  },
  setup(props) {
    const { canvasScale } = storeToRefs(useMainStore())

    const markerSize = computed(() => {
      return props.viewportStyles.width * canvasScale.value / 10
    })

    return {
      canvasScale,
      markerSize,
    }
  },
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

  .ruler-marker-100 {
    height: 100%;
    line-height: 20px;
    text-align: right;
    flex: 1;
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