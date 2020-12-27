<template>
  <div 
    class="base-element"
    :style="{ zIndex: elementIndex }"
  >
    <component
      :is="currentElementComponent"
      :elementInfo="elementInfo"
    ></component>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PPTElement } from '@/types/slides'

import BaseImageElement from '@/views/components/element/ImageElement/BaseImageElement.vue'
import BaseTextElement from '@/views/components/element/TextElement/BaseTextElement.vue'
import BaseShapeElement from '@/views/components/element/ShapeElement/BaseShapeElement.vue'
import BaseLineElement from '@/views/components/element/LineElement/BaseLineElement.vue'

export default defineComponent({
  name: 'base-element',
  props: {
    elementInfo: {
      type: Object as PropType<PPTElement>,
      required: true,
    },
    elementIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const currentElementComponent = computed(() => {
      const elementTypeMap = {
        'image': BaseImageElement,
        'text': BaseTextElement,
        'shape': BaseShapeElement,
        'line': BaseLineElement,
      }
      return elementTypeMap[props.elementInfo.type] || null
    })

    return {
      currentElementComponent,
    }
  },
})
</script>