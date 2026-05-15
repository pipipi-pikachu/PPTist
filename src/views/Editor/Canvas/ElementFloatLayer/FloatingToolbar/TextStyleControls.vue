<template>
  <Select
    class="font-select"
    :value="richTextAttrs.fontname"
    search
    searchLabel="搜索字体"
    @update:value="value => emitRichTextCommand('fontname', value as string)"
    :options="FONTS"
  />
  <Select
    class="fontsize-select"
    :value="richTextAttrs.fontsize"
    search
    searchLabel="搜索字号"
    @update:value="value => emitRichTextCommand('fontsize', value as string)"
    :options="fontSizeOptions.map(item => ({ label: item, value: item }))"
  />

  <div class="divider"></div>

  <Popover trigger="click">
    <template #content>
      <ColorPicker :modelValue="richTextAttrs.color" @update:modelValue="value => emitRichTextCommand('color', value)" />
    </template>
    <button class="toolbar-btn">
      <i-icon-park-outline:platte />
    </button>
  </Popover>
  <button
    class="toolbar-btn"
    :class="{ active: richTextAttrs.bold }"
    @click="emitRichTextCommand('bold')"
  ><i-icon-park-outline:text-bold /></button>
  <button
    class="toolbar-btn"
    :class="{ active: richTextAttrs.em }"
    @click="emitRichTextCommand('em')"
  ><i-icon-park-outline:text-italic /></button>
  <button
    class="toolbar-btn"
    :class="{ active: richTextAttrs.underline }"
    @click="emitRichTextCommand('underline')"
  ><i-icon-park-outline:text-underline /></button>

  <div class="divider"></div>

  <button
    class="toolbar-btn"
    :class="{ active: richTextAttrs.align === 'left' }"
    @click="emitRichTextCommand('align', 'left')"
  ><i-icon-park-outline:align-text-left /></button>
  <button
    class="toolbar-btn"
    :class="{ active: richTextAttrs.align === 'center' }"
    @click="emitRichTextCommand('align', 'center')"
  ><i-icon-park-outline:align-text-center /></button>
  <button
    class="toolbar-btn"
    :class="{ active: richTextAttrs.align === 'right' }"
    @click="emitRichTextCommand('align', 'right')"
  ><i-icon-park-outline:align-text-right /></button>
  <button
    class="toolbar-btn"
    :class="{ active: (richTextAttrs.align as string) === 'justify' }"
    @click="emitRichTextCommand('align', 'justify')"
  ><i-icon-park-outline:align-text-both /></button>

  <div class="divider"></div>

  <button class="toolbar-btn" @click="emitRichTextCommand('clear')">
    <i-icon-park-outline:format />
  </button>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { FONTS } from '@/configs/font'
import emitter, { EmitterEvents } from '@/utils/emitter'

import Select from '@/components/Select.vue'
import Popover from '@/components/Popover.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'

const { richTextAttrs } = storeToRefs(useMainStore())

const fontSizeOptions = [
  '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
  '36px', '40px', '44px', '48px', '54px', '60px', '66px', '72px', '76px',
  '80px', '88px', '96px', '104px', '112px', '120px',
]

const emitRichTextCommand = (command: string, value?: string) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action: { command, value } })
}
</script>

<style lang="scss" scoped>
.toolbar-btn {
  min-width: 30px;
  height: 30px;
  flex-shrink: 0;
  padding: 0 5px;
  border: 0;
  font-size: 16px;
  color: $textColor;
  background-color: transparent;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  border-radius: $borderRadius;
  cursor: pointer;

  &:hover {
    background-color: $lightGray;
  }

  &.active {
    background-color: rgba($color: $themeColor, $alpha: .12);
    color: $themeColor;
  }
}
.font-select {
  width: 110px;
  margin-right: 4px;
}
.fontsize-select {
  width: 80px;
}
.divider {
  width: 1px;
  height: 18px;
  background-color: $borderColor;
  margin: 0 4px;
  flex-shrink: 0;
}

::v-deep(.select) {
  height: 28px;

  .selector {
    height: 26px;
    line-height: 26px;
  }
  .icon {
    height: 26px;
  }
}
</style>
