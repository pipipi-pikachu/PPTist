<template>
  <div 
    class="base-element text"
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
        textShadow: elementInfo.shadow,
        lineHeight: elementInfo.lineHeight,
        letterSpacing: (elementInfo.letterSpacing || 0) + 'px',
      }"
    >
      <ElementBorder
        :width="elementInfo.width"
        :height="elementInfo.height"
        :borderColor="elementInfo.borderColor"
        :borderWidth="elementInfo.borderWidth"
        :borderStyle="elementInfo.borderStyle"
      />
      <div class="text-content"
        v-html="elementInfo.content" 
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PPTTextElement } from '@/types/slides'
import ElementBorder from '@/views/_common/_element/ElementBorder.vue'

export default defineComponent({
  name: 'base-element-text',
  components: {
    ElementBorder,
  },
  props: {
    elementInfo: {
      type: Object as PropType<PPTTextElement>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.base-element {
  position: absolute;
}

.element-content {
  position: relative;
  padding: 10px;

  .text-content {
    position: relative;
  }
}

::v-deep(.text-content) {
  word-break: break-word;
  font-family: '微软雅黑';
  outline: 0;

  ::selection {
    background-color: rgba(27, 110, 232, 0.3);
    color: inherit;
  }
}
</style>
