<template>
  <div class="slide-style-panel">
    <ColorPicker v-model="color" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ColorPicker from '@/components/ColorPicker/index.vue'

export default defineComponent({
  name: 'slide-style-panel',
  components: {
    ColorPicker,
  },
  setup() {
    const color = ref('#888')

    return {
      color,
    }
  },
})
</script>