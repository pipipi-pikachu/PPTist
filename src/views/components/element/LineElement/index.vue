<template>
  <div 
    class="editable-element-shape"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
    }"
  >
    <div 
      class="element-content" 
      :style="{ filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '' }"
    >
      <SvgWrapper
        overflow="visible" 
        :width="svgWidth"
        :height="svgHeight"
      >
        <defs>
          <LinePointMarker
            v-if="elementInfo.points[0]"
            :id="elementInfo.id"
            position="start"
            :type="elementInfo.points[0]"
            :color="elementInfo.color"
            :baseSize="elementInfo.width"
          />
          <LinePointMarker
            v-if="elementInfo.points[1]"
            :id="elementInfo.id"
            position="end"
            :type="elementInfo.points[1]"
            :color="elementInfo.color"
            :baseSize="elementInfo.width"
          />
        </defs>
				<path
          :d="path" 
          :stroke="elementInfo.color" 
          :stroke-width="elementInfo.width" 
          :stroke-dasharray="lineDashArray"
          fill="none" 
          stroke-linecap 
          stroke-linejoin 
          stroke-miterlimit 
          :marker-start="elementInfo.points[0] ? `url(#${elementInfo.id}-${elementInfo.points[0]}-start)` : ''"
          :marker-end="elementInfo.points[1] ? `url(#${elementInfo.id}-${elementInfo.points[1]}-end)` : ''"
        ></path>
				<path
          class="line-path"
          :d="path" 
          stroke="transparent" 
          stroke-width="20" 
          fill="none" 
          @mousedown="$event => handleSelectElement($event)"
          v-contextmenu="contextmenus"
        ></path>
			</SvgWrapper>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PPTLineElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'

import LinePointMarker from './LinePointMarker.vue'

export default defineComponent({
  name: 'editable-element-shape',
  components: {
    LinePointMarker,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTLineElement>,
      required: true,
    },
    selectElement: {
      type: Function as PropType<(e: MouseEvent, element: PPTLineElement, canMove?: boolean) => void>,
      required: true,
    },
    contextmenus: {
      type: Function as PropType<() => ContextmenuItem[]>,
    },
  },
  setup(props) {
    const handleSelectElement = (e: MouseEvent) => {
      if (props.elementInfo.lock) return
      e.stopPropagation()

      props.selectElement(e, props.elementInfo)
    }
    
    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    const svgWidth = computed(() => {
      const width = Math.abs(props.elementInfo.start[0] - props.elementInfo.end[0])
      return width < 24 ? 24 : width
    })
    const svgHeight = computed(() => {
      const height = Math.abs(props.elementInfo.start[1] - props.elementInfo.end[1])
      return height < 24 ? 24 : height
    })

    const lineDashArray = computed(() => props.elementInfo.style === 'dashed' ? '10 6' : '0 0')

    const path = computed(() => {
      const start = props.elementInfo.start.join(',')
      const end = props.elementInfo.end.join(',')
      if (props.elementInfo.broken) {
        const mid = props.elementInfo.broken.join(',')
        return `M${start} L${mid} L${end}`
      }
      if (props.elementInfo.curve) {
        const mid = props.elementInfo.curve.join(',')
        return `M${start} Q${mid} ${end}`
      }
      return `M${start} L${end}`
    })

    return {
      handleSelectElement,
      shadowStyle,
      svgWidth,
      svgHeight,
      lineDashArray,
      path,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element-shape {
  position: absolute;

  &.lock .line-path {
    cursor: default;
  }
}

.element-content {
  width: 100%;
  height: 100%;
  position: relative;

  svg {
    transform-origin: 0 0;
    overflow: visible;
  }
}
.line-path {
  cursor: move;
}
</style>
