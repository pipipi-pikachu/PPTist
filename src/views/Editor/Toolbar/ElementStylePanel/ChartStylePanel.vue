<template>
  <div class="chart-style-panel">
    <ElementOutline />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ElementOutline from '../common/ElementOutline.vue'

export default defineComponent({
  name: 'chart-style-panel',
  components: {
    ElementOutline,
  },
})
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>