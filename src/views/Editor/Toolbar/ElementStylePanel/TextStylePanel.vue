<template>
  <div class="text-style-panel">
    <div class="preset-style">
      <div 
        class="preset-style-item"
        v-for="item in presetStyles"
        :key="item.label"
        :style="item.style"
        @click="emitBatchRichTextCommand(item.cmd)"
      >{{item.label}}</div>
    </div>

    <Divider />
    <RichTextBase />
    <Divider />

    <div class="row">
      <div style="width: 40%;">行间距：</div>
      <Select style="width: 60%;"
        :value="lineHeight || 1"
        @update:value="value => updateLineHeight(value as number)"
        :options="lineHeightOptions.map(item => ({
          label: item + '倍', value: item
        }))"
      >
        <template #icon>
          <IconRowHeight />
        </template>
      </Select>
    </div>
    <div class="row">
      <div style="width: 40%;">段间距：</div>
      <Select style="width: 60%;"
        :value="paragraphSpace || 0"
        @update:value="value => updateParagraphSpace(value as number)"
        :options="paragraphSpaceOptions.map(item => ({
          label: item + 'px', value: item
        }))"
      >
        <template #icon>
          <IconVerticalSpacingBetweenItems />
        </template>
      </Select>
    </div>
    <div class="row">
      <div style="width: 40%;">字间距：</div>
      <Select style="width: 60%;"
        :value="wordSpace || 0"
        @update:value="value => updateWordSpace(value as number)"
        :options="wordSpaceOptions.map(item => ({
          label: item + 'px', value: item
        }))"
      >
        <template #icon>
          <IconFullwidth />
        </template>
      </Select>
    </div>
    <div class="row">
      <div style="width: 40%;">文本框填充：</div>
      <Popover trigger="click" style="width: 60%;">
        <template #content>
          <ColorPicker
            :modelValue="fill"
            @update:modelValue="value => updateFill(value)"
          />
        </template>
        <ColorButton :color="fill" />
      </Popover>
    </div>

    <Divider />
    <ElementOutline />
    <Divider />
    <ElementShadow />
    <Divider />
    <ElementOpacity />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTTextElement } from '@/types/slides'
import emitter, { EmitterEvents, type RichTextAction } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOpacity from '../common/ElementOpacity.vue'
import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'
import RichTextBase from '../common/RichTextBase.vue'
import ColorButton from '@/components/ColorButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Divider from '@/components/Divider.vue'
import Select from '@/components/Select.vue'
import Popover from '@/components/Popover.vue'

// 注意，存在一个未知原因的BUG，如果文本加粗后文本框高度增加，画布的可视区域定位会出现错误
// 因此在执行预置样式命令时，将加粗命令放在尽可能靠前的位置，避免字号增大后再加粗
const presetStyles = [
  {
    label: '大标题',
    style: {
      fontSize: '26px',
      fontWeight: 700,
    },
    cmd: [
      { command: 'clear' },
      { command: 'bold' },
      { command: 'fontsize', value: '66px' },
      { command: 'align', value: 'center' },
    ],
  },
  {
    label: '小标题',
    style: {
      fontSize: '22px',
      fontWeight: 700,
    },
    cmd: [
      { command: 'clear' },
      { command: 'bold' },
      { command: 'fontsize', value: '40px' },
      { command: 'align', value: 'center' },
    ],
  },
  {
    label: '正文',
    style: {
      fontSize: '20px',
    },
    cmd: [
      { command: 'clear' },
      { command: 'fontsize', value: '20px' },
    ],
  },
  {
    label: '正文[小]',
    style: {
      fontSize: '18px',
    },
    cmd: [
      { command: 'clear' },
      { command: 'fontsize', value: '18px' },
    ],
  },
  {
    label: '注释 1',
    style: {
      fontSize: '16px',
      fontStyle: 'italic',
    },
    cmd: [
      { command: 'clear' },
      { command: 'fontsize', value: '16px' },
      { command: 'em' },
    ],
  },
  {
    label: '注释 2',
    style: {
      fontSize: '16px',
      textDecoration: 'underline',
    },
    cmd: [
      { command: 'clear' },
      { command: 'fontsize', value: '16px' },
      { command: 'underline' },
    ],
  },
]

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(mainStore)

const { addHistorySnapshot } = useHistorySnapshot()

const updateElement = (props: Partial<PPTTextElement>) => {
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

const fill = ref<string>('#000')
const lineHeight = ref<number>()
const wordSpace = ref<number>()
const paragraphSpace = ref<number>()

watch(handleElement, () => {
  if (!handleElement.value || handleElement.value.type !== 'text') return

  fill.value = handleElement.value.fill || '#fff'
  lineHeight.value = handleElement.value.lineHeight || 1.5
  wordSpace.value = handleElement.value.wordSpace || 0
  paragraphSpace.value = handleElement.value.paragraphSpace === undefined ? 5 : handleElement.value.paragraphSpace
  emitter.emit(EmitterEvents.SYNC_RICH_TEXT_ATTRS_TO_STORE)
}, { deep: true, immediate: true })

const lineHeightOptions = [0.9, 1.0, 1.15, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0]
const wordSpaceOptions = [0, 1, 2, 3, 4, 5, 6, 8, 10]
const paragraphSpaceOptions = [0, 5, 10, 15, 20, 25, 30, 40, 50, 80]

// 设置行高
const updateLineHeight = (value: number) => {
  updateElement({ lineHeight: value })
}

// 设置段间距
const updateParagraphSpace = (value: number) => {
  updateElement({ paragraphSpace: value })
}

// 设置字间距
const updateWordSpace = (value: number) => {
  updateElement({ wordSpace: value })
}

// 设置文本框填充
const updateFill = (value: string) => {
  updateElement({ fill: value })
}

// 发送富文本设置命令（批量）
const emitBatchRichTextCommand = (action: RichTextAction[]) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action })
}
</script>

<style lang="scss" scoped>
.text-style-panel {
  user-select: none;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.preset-style {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.preset-style-item {
  width: 50%;
  height: 50px;
  border: solid 1px #d6d6d6;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all $transitionDelay;

  &:hover {
    border-color: $themeColor;
    color: $themeColor;
    z-index: 1;
  }

  &:nth-child(2n) {
    margin-left: -1px;
  }
  &:nth-child(n+3) {
    margin-top: -1px;
  }
}
</style>