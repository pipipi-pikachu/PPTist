<template>
  <div 
    class="base-element-shape"
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
      >
        <SvgWrapper 
          overflow="visible" 
          :width="elementInfo.width"
          :height="elementInfo.height"
        >
          <defs v-if="elementInfo.gradient">
            <GradientDefs
              :id="`base-gradient-${elementInfo.id}`" 
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
              :fill="elementInfo.gradient ? `url(#base-gradient-${elementInfo.id})` : elementInfo.fill"
              :stroke="outlineColor"
              :stroke-width="outlineWidth" 
              :stroke-dasharray="outlineStyle === 'dashed' ? '10 5' : '0 0'" 
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
import useElementOutline from '@/views/components/element/hooks/useElementOutline'
import useElementShadow from '@/views/components/element/hooks/useElementShadow'
import useElementFlip from '@/views/components/element/hooks/useElementFlip'

import GradientDefs from './GradientDefs.vue'

export default defineComponent({
  name: 'base-element-shape',
  components: {
    GradientDefs,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTShapeElement>,
      required: true,
    },
  },
  setup(props) {
    const outline = computed(() => props.elementInfo.outline)
    const { outlineWidth, outlineStyle, outlineColor } = useElementOutline(outline)
    
    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    const flip = computed(() => props.elementInfo.flip)
    const { flipStyle } = useElementFlip(flip)

    return {
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
.base-element-shape {
  position: absolute;
}
.rotate-wrapper {
  width: 100%;
  height: 100%;
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
