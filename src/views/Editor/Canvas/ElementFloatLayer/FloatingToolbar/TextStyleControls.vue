<template>
  <Select
    class="font-select"
    :value="textAttrs.fontname"
    search
    :searchLabel="t('搜索字体')"
    @update:value="value => emitTextCommand('fontname', value as string)"
    :options="FONTS"
  />
  <Select
    class="fontsize-select"
    :value="textAttrs.fontsize"
    search
    :searchLabel="t('搜索字号')"
    @update:value="value => emitTextCommand('fontsize', value as string)"
    :options="fontSizeOptions.map(item => ({ label: item, value: item }))"
  />

  <div class="divider"></div>

  <Popover trigger="click">
    <template #content>
      <ColorPicker :modelValue="textAttrs.color" @update:modelValue="value => emitTextCommand('color', value)" />
    </template>
    <button class="toolbar-btn text-color-btn" @mousedown.prevent>
      <i-icon-park-outline:text />
      <span class="text-color-block" :class="{ white: isPureWhiteColor(textAttrs.color) }">
        <span class="text-color-block-content" :style="{ backgroundColor: textAttrs.color }"></span>
      </span>
    </button>
  </Popover>
  <button
    class="toolbar-btn"
    :class="{ active: textAttrs.bold }"
    @mousedown.prevent
    @click="emitTextCommand('bold')"
  ><i-icon-park-outline:text-bold /></button>
  <button
    class="toolbar-btn"
    :class="{ active: textAttrs.em }"
    @mousedown.prevent
    @click="emitTextCommand('em')"
  ><i-icon-park-outline:text-italic /></button>
  <button
    class="toolbar-btn"
    :class="{ active: textAttrs.underline }"
    @mousedown.prevent
    @click="emitTextCommand('underline')"
  ><i-icon-park-outline:text-underline /></button>

  <div class="divider"></div>

  <button
    class="toolbar-btn"
    :class="{ active: textAttrs.align === 'left' }"
    @mousedown.prevent
    @click="emitTextCommand('align', 'left')"
  ><i-icon-park-outline:align-text-left /></button>
  <button
    class="toolbar-btn"
    :class="{ active: textAttrs.align === 'center' }"
    @mousedown.prevent
    @click="emitTextCommand('align', 'center')"
  ><i-icon-park-outline:align-text-center /></button>
  <button
    class="toolbar-btn"
    :class="{ active: textAttrs.align === 'right' }"
    @mousedown.prevent
    @click="emitTextCommand('align', 'right')"
  ><i-icon-park-outline:align-text-right /></button>
  <button
    class="toolbar-btn"
    :class="{ active: textAttrs.align === 'justify' }"
    @mousedown.prevent
    @click="emitTextCommand('align', 'justify')"
  ><i-icon-park-outline:align-text-both /></button>

  <template v-if="showClear">
    <div class="divider"></div>
    <button class="toolbar-btn" @mousedown.prevent @click="emitTextCommand('clear')">
      <i-icon-park-outline:format />
    </button>
  </template>
</template>

<script lang="ts" setup>
import { t } from '@/i18n'
import tinycolor from 'tinycolor2'
import { FONTS } from '@/configs/font'
import type { RichTextAction } from '@/utils/emitter'
import type { TextAttrs } from '@/utils/prosemirror/utils'
import type { TextAlign } from '@/types/slides'

import Select from '@/components/Select.vue'
import Popover from '@/components/Popover.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'

withDefaults(defineProps<{
  textAttrs: Pick<TextAttrs, 'fontname' | 'fontsize' | 'color' | 'bold' | 'em' | 'underline'> & { align: TextAlign }
  showClear?: boolean
}>(), {
  showClear: true,
})

const emit = defineEmits<{
  (event: 'command', payload: RichTextAction): void
}>()

const fontSizeOptions = [
  '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
  '36px', '40px', '44px', '48px', '54px', '60px', '66px', '72px', '76px',
  '80px', '88px', '96px', '104px', '112px', '120px',
]

const emitTextCommand = (command: string, value?: string) => {
  emit('command', { command, value })
}

const isPureWhiteColor = (color?: string) => {
  const rgba = tinycolor(color).toRgb()
  return rgba.r === 255 && rgba.g === 255 && rgba.b === 255 && rgba.a === 1
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
.text-color-btn {
  flex-direction: column;
  font-size: 13px;

  .text-color-block {
    width: 15px;
    height: 4px;
    margin-top: 1px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACdJREFUGFdjfPbs2X8GBgYGSUlJEMXAiCHw//9/sIrnz59DVKALAADNxxVfaiODNQAAAABJRU5ErkJggg==);

    &.white {
      height: 5px;
      border: 1px solid #ddd;
    }
  }

  .text-color-block-content {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.font-select {
  width: 110px;
  margin-right: 1px;
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
  height: 30px;
  border: 0;
  background-color: #f9f9f9;

  .selector {
    height: 30px;
    line-height: 30px;
  }
  .icon {
    height: 30px;
  }
}
</style>
