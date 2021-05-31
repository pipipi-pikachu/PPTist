<template>
  <div 
    class="editable-element-shape"
    :class="{ 'lock': elementInfo.lock }"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <div 
        class="element-content" 
        :style="{
          opacity: elementInfo.opacity,
          filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
          transform: flipStyle,
        }"
        v-contextmenu="contextmenus"
        @mousedown="$event => handleSelectElement($event)"
      >
        <SvgWrapper 
          overflow="visible" 
          :width="elementInfo.width"
          :height="elementInfo.height"
        >
          <defs v-if="elementInfo.gradient">
            <GradientDefs
              :id="`editabel-gradient-${elementInfo.id}`" 
              :type="elementInfo.gradient.type"
              :color1="elementInfo.gradient.color[0]"
              :color2="elementInfo.gradient.color[1]"
              :rotate="elementInfo.gradient.rotate"
            />
          </defs>
          <g 
            :transform="`scale(${elementInfo.width / elementInfo.viewBox}, ${elementInfo.height / elementInfo.viewBox}) translate(0,0) matrix(1,0,0,1,0,0)`"
          >
            <path 
              vector-effect="non-scaling-stroke" 
              stroke-linecap="butt" 
              stroke-miterlimit="8"
              stroke-linejoin="" 
              :d="elementInfo.path" 
              :fill="elementInfo.gradient ? `url(#editabel-gradient-${elementInfo.id})` : elementInfo.fill"
              :stroke="outlineColor"
              :stroke-width="outlineWidth" 
              :stroke-dasharray="outlineStyle === 'dashed' ? '10 6' : '0 0'" 
            ></path>
          </g>
        </SvgWrapper>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PPTShapeElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'
import useElementOutline from '@/views/components/element/hooks/useElementOutline'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import useElementFlip from '@/views/components/element/hooks/useElementFlip'

import GradientDefs from './GradientDefs.vue'

export default defineComponent({
  name: 'editable-element-shape',
  components: {
    GradientDefs,
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
      if (props.elementInfo.lock) return
      e.stopPropagation()

      props.selectElement(e, props.elementInfo)
    }

    const outline = computed(() => props.elementInfo.outline)
    const { outlineWidth, outlineStyle, outlineColor } = useElementOutline(outline)
    
    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    const flip = computed(() => props.elementInfo.flip)
    const { flipStyle } = useElementFlip(flip)

    return {
      handleSelectElement,
      shadowStyle,
      outlineWidth,
      outlineStyle,
      outlineColor,
      flipStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-element-shape {
  position: absolute;

  &.lock .element-content {
    cursor: default;
  }
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
}
.element-content {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: move;

  svg {
    transform-origin: 0 0;
    overflow: visible;
  }
}
</style>
