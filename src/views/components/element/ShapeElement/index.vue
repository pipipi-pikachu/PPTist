<template>
  <div class="editable-element-shape"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      transform: `rotate(${elementInfo.rotate}deg)`,
    }"
    @mousedown="$event => handleSelectElement($event)"
  >
    <div 
      class="element-content" 
      v-contextmenu="contextmenus"
      :style="{
        opacity: elementInfo.opacity,
        filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
      }"
    >
      <SvgWrapper overflow="visible" 
        :width="elementInfo.width"
        :height="elementInfo.height"
      >
        <g 
          :transform="`scale(${elementInfo.width / elementInfo.viewBox}, ${elementInfo.height / elementInfo.viewBox}) translate(0,0) matrix(1,0,0,1,0,0)`"
        >
          <path 
            vector-effect="non-scaling-stroke" 
            stroke-linecap="butt" 
            stroke-miterlimit="8"
            stroke-linejoin="" 
            :d="elementInfo.path" 
            :fill="elementInfo.fill"
            :stroke="outlineColor"
            :stroke-width="outlineWidth" 
            :stroke-dasharray="outlineStyle === 'dashed' ? '10 5' : '0 0'" 
          ></path>
        </g>
			</SvgWrapper>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PPTShapeElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import useElementOutline from '@/views/components/element/hooks/useElementOutline'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'

import SvgWrapper from '@/components/SvgWrapper.vue'

export default defineComponent({
  name: 'editable-element-shape',
  components: {
    SvgWrapper,
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

    const outline = computed(() => props.elementInfo.outline)
    const { outlineWidth, outlineStyle, outlineColor } = useElementOutline(outline)
    
    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    return {
      handleSelectElement,
      shadowStyle,
      outlineWidth,
      outlineStyle,
      outlineColor,
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

  svg {
    transform-origin: 0 0;
    overflow: visible;
  }
}
</style>
