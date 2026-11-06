<template>
  <div class="toolbar-content">
    <TextStyleControls :textAttrs="richTextAttrs" @command="emitRichTextCommand" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import type { PPTTextElement } from '@/types/slides'
import emitter, { EmitterEvents, type RichTextAction } from '@/utils/emitter'

import TextStyleControls from './TextStyleControls.vue'

defineProps<{
  elementInfo: PPTTextElement
}>()

const { richTextAttrs } = storeToRefs(useMainStore())

const emitRichTextCommand = (action: RichTextAction) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action })
}
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
