<template>
  <div 
    class="base-element-text"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      transform: `rotate(${elementInfo.rotate}deg)`,
    }"
  >
    <div class="element-content"
      :style="{
        backgroundColor: elementInfo.fill,
        opacity: elementInfo.opacity,
        textShadow: shadowStyle,
      }"
    >
      <ElementOutline
        :width="elementInfo.width"
        :height="elementInfo.height"
        :outline="elementInfo.outline"
      />
      <div class="text" v-html="elementInfo.content"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { PPTTextElement } from '@/types/slides'
import ElementOutline from '@/views/_common/_element/ElementOutline.vue'

import useElementShadow from '@/views/_common/_element/hooks/useElementShadow'

export default defineComponent({
  name: 'base-element-text',
  components: {
    ElementOutline,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTTextElement>,
      required: true,
    },
  },
  setup(props) {
    const shadow = computed(() => props.elementInfo.shadow)
    const { shadowStyle } = useElementShadow(shadow)

    return {
      shadowStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.base-element-text {
  position: absolute;
}

.element-content {
  position: relative;
  padding: 10px;
  line-height: 1.5;

  .text {
    position: relative;
  }
}

::v-deep(.text) {
  word-break: break-word;
  font-family: '微软雅黑';
  outline: 0;

  ::selection {
    background-color: rgba(27, 110, 232, 0.3);
    color: inherit;
  }
}
</style>
