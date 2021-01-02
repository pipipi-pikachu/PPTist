<template>
  <div class="slide-style-panel">
    <Popover trigger="click">
      <template v-slot:content>
        <ColorPicker v-model="color" />
      </template>
      <button>Hover me</button>
    </Popover>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import ColorPicker from '@/components/ColorPicker/index.vue'
import { Popover } from 'ant-design-vue'

export default defineComponent({
  name: 'slide-style-panel',
  components: {
    ColorPicker,
    Popover,
  },
  setup() {
    const color = ref('#888')

    return {
      color,
    }
  },
})
</script>