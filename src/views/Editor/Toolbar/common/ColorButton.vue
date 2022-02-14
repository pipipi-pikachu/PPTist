<template>
  <Button class="color-btn">
    <div 
      class="color-block" 
      :style="{ backgroundColor: color }"
    ></div>
    <IconPlatte class="color-btn-icon" />
  </Button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'color-button',
  props: {
    color: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.color-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}
.color-block {
  height: 20px;
  margin-left: 8px;
  flex: 1;
  outline: 1px dashed rgba($color: #666, $alpha: .12);
}
.color-btn-icon {
  width: 30px;
  font-size: 12px;
  margin-top: 2px;
  color: #bfbfbf;
}
</style>