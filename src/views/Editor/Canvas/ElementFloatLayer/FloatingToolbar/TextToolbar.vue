<template>
  <div class="toolbar-content">
    <TextStyleControls />
  </div>
</template>

<script lang="ts" setup>
import type { PPTTextElement } from '@/types/slides'
import TextStyleControls from './TextStyleControls.vue'

defineProps<{
  elementInfo: PPTTextElement
}>()
</script>

<style lang="scss" scoped>
.toolbar-content {
  width: max-content;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  gap: 4px;
}
</style>
