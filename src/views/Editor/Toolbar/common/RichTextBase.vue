<template>
  <div class="rich-text-base">
    <SelectGroup class="row">
      <Select
        style="width: 60%;"
        :value="richTextAttrs.fontname"
        search
        :searchLabel="$t('Commons.text.text_d5bwf6')"
        autofocus
        @update:value="value => emitRichTextCommand('fontname', value as string)"
        :options="FONTS"
      >
        <template #icon>
          <i-icon-park-outline:font-size />
        </template>
      </Select>
      <Select
        style="width: 40%;"
        :value="richTextAttrs.fontsize"
        search
        :searchLabel="$t('Commons.text.text_d5bxc6')"
        autofocus
        @update:value="value => emitRichTextCommand('fontsize', value as string)"
        :options="fontSizeOptions.map(item => ({
          label: item, value: item
        }))"
      >
        <template #icon>
          <i-icon-park-outline:add-text />
        </template>
      </Select>
    </SelectGroup>

    <ButtonGroup class="row" passive>
      <Popover trigger="click" style="width: 30%;">
        <template #content>
          <ColorPicker
            :modelValue="richTextAttrs.color"
            @update:modelValue="value => emitRichTextCommand('color', value)"
          />
        </template>
        <TextColorButton first v-tooltip="$t('Commons.text.text_d74746')" :color="richTextAttrs.color">
          <i-icon-park-outline:text />
        </TextColorButton>
      </Popover>
      <Popover trigger="click" style="width: 30%;">
        <template #content>
          <ColorPicker
            :modelValue="richTextAttrs.backcolor"
            @update:modelValue="value => emitRichTextCommand('backcolor', value)"
          />
        </template>
        <TextColorButton v-tooltip="$t('Commons.text.text_d74akm')" :color="richTextAttrs.backcolor">
          <i-icon-park-outline:high-light />
        </TextColorButton>
      </Popover>
      <Button 
        class="font-size-btn"
        style="width: 20%;"
        v-tooltip="$t('Commons.text.text_bjvnux')"
        @click="emitRichTextCommand('fontsize-add')"
      ><i-icon-park-outline:font-size />+</Button>
      <Button
        last
        class="font-size-btn"
        style="width: 20%;"
        v-tooltip="$t('Commons.text.text_ape1eo')"
        @click="emitRichTextCommand('fontsize-reduce')"
      ><i-icon-park-outline:font-size />-</Button>
    </ButtonGroup>

    <ButtonGroup class="row">
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.bold"
        v-tooltip="$t('Commons.label.text_eqk7')"
        @click="emitRichTextCommand('bold')"
      ><i-icon-park-outline:text-bold /></CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.em"
        v-tooltip="$t('Commons.label.text_hpvb')"
        @click="emitRichTextCommand('em')"
      ><i-icon-park-outline:text-italic /></CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.underline"
        v-tooltip="$t('Commons.label.text_bu69k')"
        @click="emitRichTextCommand('underline')"
      ><i-icon-park-outline:text-underline /></CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.strikethrough"
        v-tooltip="$t('Commons.text.text_crbi3')"
        @click="emitRichTextCommand('strikethrough')"
      ><i-icon-park-outline:strikethrough /></CheckboxButton>
    </ButtonGroup>

    <ButtonGroup class="row">
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.superscript"
        v-tooltip="$t('Commons.text.text_duf1')"
        @click="emitRichTextCommand('superscript')"
      >{{$t('Commons.button.a2')}}</CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.subscript"
        v-tooltip="$t('Commons.text.text_dufw')"
        @click="emitRichTextCommand('subscript')"
      >{{$t('Commons.button.a2_2')}}</CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.code"
        v-tooltip="$t('Commons.label.text_hj7bp3')"
        @click="emitRichTextCommand('code')"
      ><i-icon-park-outline:code /></CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.blockquote"
        v-tooltip="$t('Commons.text.text_gtdf')"
        @click="emitRichTextCommand('blockquote')"
      ><i-icon-park-outline:quote /></CheckboxButton>
    </ButtonGroup>

    <ButtonGroup class="row" passive>
      <Popover trigger="click" v-model:value="AIPopoverVisible" style="width: 25%;">
        <template #content>
          <PopoverMenuItem center @click="execAI('美化改写')">{{ $t('Commons.text.text_m5hk', {}) }}</PopoverMenuItem>
          <PopoverMenuItem center @click="execAI('扩写丰富')">{{ $t('Commons.text.text_h6q8', {}) }}</PopoverMenuItem>
          <PopoverMenuItem center @click="execAI('精简提炼')">{{ $t('Commons.text.text_lw8y', {}) }}</PopoverMenuItem>
        </template>
        <CheckboxButton
          first
          style="width: 100%;"
          v-tooltip="$t('Commons.text.ai_2')"
        ><span :class="{ 'ai-loading': isAIWriting }">{{ isAIWriting ? '' : 'AI' }}</span></CheckboxButton>
      </Popover>
      <CheckboxButton
        style="flex: 1;"
        v-tooltip="$t('Commons.text.text_ei3atu')"
        @click="emitRichTextCommand('clear')"
      ><i-icon-park-outline:format /></CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="!!textFormatPainter"
        v-tooltip="$t('Commons.text.text_x7ozvm')"
        @click="toggleTextFormatPainter()"
        @dblclick="toggleTextFormatPainter(true)"
      ><i-icon-park-outline:format-brush /></CheckboxButton>
      <Popover placement="bottom-end" trigger="click" v-model:value="linkPopoverVisible" style="width: 25%;">
        <template #content>
          <div class="link-popover">
            <Input v-model:value="link" :placeholder="$t('Commons.placeholder.text_7cyb19')" />
            <div class="btns">
              <Button size="small" :disabled="!richTextAttrs.link" @click="removeLink()" style="margin-right: 5px;">{{ $t('Commons.button.text_lknd', {}) }}</Button>
              <Button size="small" type="primary" @click="updateLink(link)">{{ $t('Commons.button.text_l912', {}) }}</Button>
            </div>
          </div>
        </template>
        <CheckboxButton
          last
          style="width: 100%;"
          :checked="!!richTextAttrs.link"
          v-tooltip="$t('Commons.text.text_lg4a4')"
          @click="openLinkPopover()"
        ><i-icon-park-outline:link-one /></CheckboxButton>
      </Popover>
    </ButtonGroup>
    <Divider />

    <RadioGroup 
      class="row" 
      button-style="solid" 
      :value="richTextAttrs.align"
      @update:value="value => emitRichTextCommand('align', value)"
    >
      <RadioButton value="left" v-tooltip="$t('Commons.button.text_e7n4t')" style="flex: 1;"><i-icon-park-outline:align-text-left /></RadioButton>
      <RadioButton value="center" v-tooltip="$t('Commons.text.text_g4g8')" style="flex: 1;"><i-icon-park-outline:align-text-center /></RadioButton>
      <RadioButton value="right" v-tooltip="$t('Commons.button.text_cr6i2')" style="flex: 1;"><i-icon-park-outline:align-text-right /></RadioButton>
      <RadioButton value="justify" v-tooltip="$t('Commons.text.text_ad9sea')" style="flex: 1;"><i-icon-park-outline:align-text-both /></RadioButton>
    </RadioGroup>

    <div class="row" passive>
      <ButtonGroup style="flex: 1;">
        <Button
          first
          :type="richTextAttrs.bulletList ? 'primary' : 'default'"
          style="flex: 1;"
          v-tooltip="$t('Commons.text.text_jqc1ra')"
          @click="emitRichTextCommand('bulletList')"
        ><i-icon-park-outline:list /></Button>
        <Popover trigger="click" v-model:value="bulletListPanelVisible">
          <template #content>
            <div class="list-wrap">
              <ul class="list" 
                v-for="item in bulletListStyleTypeOption" 
                :key="item" 
                :style="{ listStyleType: item }"
                @click="emitRichTextCommand('bulletList', item)"
              >
                <li class="list-item" v-for="key in 3" :key="key"><span></span></li>
              </ul>
            </div>
          </template>
          <Button last class="popover-btn"><i-icon-park-outline:down /></Button>
        </Popover>
      </ButtonGroup>
      <div style="width: 10px;"></div>
      <ButtonGroup style="flex: 1;" passive>
        <Button
          first
          :type="richTextAttrs.orderedList ? 'primary' : 'default'"
          style="flex: 1;"
          v-tooltip="$t('Commons.text.text_m2sh')"
          @click="emitRichTextCommand('orderedList')"
        ><i-icon-park-outline:ordered-list /></Button>
        <Popover trigger="click" v-model:value="orderedListPanelVisible">
          <template #content>
            <div class="list-wrap">
              <ul class="list" 
                v-for="item in orderedListStyleTypeOption" 
                :key="item" 
                :style="{ listStyleType: item }"
                @click="emitRichTextCommand('orderedList', item)"
              >
                <li class="list-item" v-for="key in 3" :key="key"><span></span></li>
              </ul>
            </div>
          </template>
          <Button last class="popover-btn"><i-icon-park-outline:down /></Button>
        </Popover>
      </ButtonGroup>
    </div>

    <div class="row">
      <ButtonGroup style="flex: 1;" passive>
        <Button first style="flex: 1;" v-tooltip="$t('Commons.text.text_9fk06e')" @click="emitRichTextCommand('indent', '-1')"><i-icon-park-outline:indent-left /></Button>
        <Popover trigger="click" v-model:value="indentLeftPanelVisible">
          <template #content>
            <PopoverMenuItem center @click="emitRichTextCommand('textIndent', '-1')">{{ $t('Commons.text.text_3mn4t4', {}) }}</PopoverMenuItem>
          </template>
          <Button last class="popover-btn"><i-icon-park-outline:down /></Button>
        </Popover>
      </ButtonGroup>
      <div style="width: 10px;"></div>
      <ButtonGroup style="flex: 1;" passive>
        <Button first style="flex: 1;" v-tooltip="$t('Commons.text.text_n4npvn')" @click="emitRichTextCommand('indent', '+1')"><i-icon-park-outline:indent-right /></Button>
        <Popover trigger="click" v-model:value="indentRightPanelVisible">
          <template #content>
            <PopoverMenuItem center @click="emitRichTextCommand('textIndent', '+1')">{{ $t('Commons.text.text_sxkl8x', {}) }}</PopoverMenuItem>
          </template>
          <Button last class="popover-btn"><i-icon-park-outline:down /></Button>
        </Popover>
      </ButtonGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import api from '@/services'
import { useMainStore } from '@/store'
import emitter, { EmitterEvents } from '@/utils/emitter'
import { FONTS } from '@/configs/font'
import useTextFormatPainter from '@/hooks/useTextFormatPainter'
import message from '@/utils/message'
import { htmlToText } from '@/utils/common'

import TextColorButton from '@/components/TextColorButton.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Select from '@/components/Select.vue'
import SelectGroup from '@/components/SelectGroup.vue'
import Divider from '@/components/Divider.vue'
import Popover from '@/components/Popover.vue'
import RadioButton from '@/components/RadioButton.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'
import { t } from '@/i18n';

const { handleElement, handleElementId, richTextAttrs, textFormatPainter } = storeToRefs(useMainStore())

const { toggleTextFormatPainter } = useTextFormatPainter()

const fontSizeOptions = [
  '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
  '36px', '40px', '44px', '48px', '54px', '60px', '66px', '72px', '76px',
  '80px', '88px', '96px', '104px', '112px', '120px',
]

const emitRichTextCommand = (command: string, value?: string) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action: { command, value } })
}

const bulletListPanelVisible = ref(false)
const orderedListPanelVisible = ref(false)
const indentLeftPanelVisible = ref(false)
const indentRightPanelVisible = ref(false)

const bulletListStyleTypeOption = ref(['disc', 'circle', 'square'])
const orderedListStyleTypeOption = ref(['decimal', 'lower-roman', 'upper-roman', 'lower-alpha', 'upper-alpha', 'lower-greek'])

const link = ref('')
const linkPopoverVisible = ref(false)
const AIPopoverVisible = ref(false)
const isAIWriting = ref(false)

watch(richTextAttrs, () => linkPopoverVisible.value = false)
watch(handleElementId, () => {
  if (isAIWriting.value) isAIWriting.value = false
})

const openLinkPopover = () => {
  link.value = richTextAttrs.value.link
}
const updateLink = (link?: string) => {
  const linkRegExp = /^(https?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/
  if (!link || !linkRegExp.test(link)) return message.error(t('Commons.text.text_e97vf2'))

  emitRichTextCommand('link', link)
  linkPopoverVisible.value = false
}

const removeLink = () => {
  emitRichTextCommand('link')
  linkPopoverVisible.value = false
}

const execAI = async (command: string) => {
  AIPopoverVisible.value = false

  if (!handleElement.value) return

  let content = ''
  if (handleElement.value.type === 'text' && handleElement.value.content) {
    content = handleElement.value.content
  }
  if (handleElement.value.type === 'shape' && handleElement.value.text && handleElement.value.text.content) {
    content = handleElement.value.text.content
  }

  if (!content) return message.error(t('Commons.text.text_7tpdju'))

  let resultText = ''

  const stream = await api.AI_Writing({
    content: htmlToText(content),
    command,
  })
  if (typeof stream === 'object' && stream.state === -1) {
    return message.error(t('Commons.text.api'))
  }

  isAIWriting.value = true

  const reader: ReadableStreamDefaultReader = stream.body.getReader()
  const decoder = new TextDecoder('utf-8')
  
  const readStream = () => {
    reader.read().then(({ done, value }) => {
      if (!isAIWriting.value) return
      if (done) {
        isAIWriting.value = false
        return
      }

      const chunk = decoder.decode(value, { stream: true })
      resultText += chunk
      emitRichTextCommand('replace', resultText)

      readStream()
    })
  }
  readStream()
}
</script>

<style lang="scss" scoped>
.rich-text-base {
  user-select: none;

  ::v-deep(.ai-loading) {
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-top: 8px;
    border: 1px solid $themeColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spinner .8s linear infinite;
  }
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.font-size-btn {
  padding: 0;
}
.link-popover {
  width: 240px;

  .btns {
    margin-top: 10px;
    text-align: right;
  }
}
.list-wrap {
  width: 176px;
  color: #666;
  padding: 8px;
  margin: -12px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.list {
  background-color: $lightGray;
  padding: 4px 4px 4px 20px;
  cursor: pointer;

  &:not(:nth-child(3n)) {
    margin-right: 8px;
  }

  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    margin-top: 8px;
  }

  &:hover {
    color: $themeColor;

    span {
      background-color: $themeColor;
    }
  }
}
.list-item {
  width: 24px;
  height: 12px;
  position: relative;
  font-size: 10px;
  top: -2px;

  span {
    width: 100%;
    height: 2px;
    display: inline-block;
    position: absolute;
    top: 8px;
    background-color: #666;
  }
}
.popover-btn {
  padding: 0 3px;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>