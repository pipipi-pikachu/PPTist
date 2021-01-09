<template>
  <div class="line-pool">
    <div class="line-item" v-for="(line, index) in lineList" :key="index">
      <div class="line-content" @click="selectLine(line)">
        <SvgWrapper
          overflow="visible" 
          width="20"
          height="20"
        >
          <defs>
            <LinePointMarker
              v-if="line.points[0]"
              :id="`preset-line-${index}`"
              position="start"
              :type="line.points[0]"
              color="#aaa"
              :baseSize="2"
            />
            <LinePointMarker
              v-if="line.points[1]"
              :id="`preset-line-${index}`"
              position="end"
              :type="line.points[1]"
              color="#999"
              :baseSize="2"
            />
          </defs>
          <path
            :d="line.path" 
            stroke="#aaa" 
            fill="none" 
            stroke-width="2" 
            :stroke-dasharray="line.style === 'solid' ? '0, 0' : '4, 1'"
            stroke-linecap 
            stroke-linejoin 
            stroke-miterlimit 
            :marker-start="line.points[0] ? `url(#${`preset-line-${index}`}-${line.points[0]}-start)` : ''"
            :marker-end="line.points[1] ? `url(#${`preset-line-${index}`}-${line.points[1]}-end)` : ''"
          ></path>
        </SvgWrapper>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { LINE_LIST, LinePoolItem } from '@/configs/lines'

import LinePointMarker from '@/views/components/element/LineElement/LinePointMarker.vue'

export default defineComponent({
  name: 'line-pool',
  components: {
    LinePointMarker,
  },
  setup(props, { emit }) {
    const lineList = LINE_LIST

    const selectLine = (line: LinePoolItem) => {
      emit('select', line)
    }

    return {
      lineList,
      selectLine,
    }
  },
})
</script>

<style lang="scss" scoped>
.line-pool {
  width: 200px;
  margin-bottom: -5px;

  @include grid-layout-wrapper();
}
.line-item {
  @include grid-layout-item(5, 19%);

  height: 0;
  padding-bottom: 19%;
  flex-shrink: 0;
  position: relative;
  display: flex;
  justify-content: center;
  cursor: pointer;
}
.line-content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  svg:not(:root) {
    overflow: visible;
  }
}
</style>