<template>
  <Button class="text-color-btn">
    <slot></slot>
    <div class="text-color-block">
      <div class="text-color-block-content" :style="{ backgroundColor: color }"></div>
    </div>
  </Button>
</template>

<script lang="ts" setup>
import Button from './Button.vue'

defineProps<{
  color: string
}>()
</script>

<style lang="scss" scoped>
.text-color-btn {
  width: 100%;
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.text-color-block {
  width: 17px;
  height: 4px;
  margin-top: 1px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACdJREFUGFdjfPbs2X8GBgYGSUlJEMXAiCHw//9/sIrnz59DVKALAADNxxVfaiODNQAAAABJRU5ErkJggg==);

  .text-color-block-content {
    width: 100%;
    height: 100%;
  }
}
</style>