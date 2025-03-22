<template>
  <div class="rich-text-base">
    <SelectGroup class="row">
      <Select
        style="width: 60%;"
        :value="richTextAttrs.fontname"
        search
        searchLabel="Search fonts"
        @update:value="value => emitRichTextCommand('fontname', value as string)"
        :options="FONTS"
      >
        <template #icon>
          <IconFontSize />
        </template>
      </Select>
      <Select
        style="width: 40%;"
        :value="richTextAttrs.fontsize"
        search
        searchLabel="Search font size"
        @update:value="value => emitRichTextCommand('fontsize', value as string)"
        :options="fontSizeOptions.map(item => ({
          label: item, value: item
        }))"
      >
        <template #icon>
          <IconAddText />
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
        <TextColorButton first v-tooltip="'Text Color'" :color="richTextAttrs.color">
          <IconText />
        </TextColorButton>
      </Popover>
      <Popover trigger="click" style="width: 30%;">
        <template #content>
          <ColorPicker
            :modelValue="richTextAttrs.backcolor"
            @update:modelValue="value => emitRichTextCommand('backcolor', value)"
          />
        </template>
        <TextColorButton v-tooltip="'Text highlighting'" :color="richTextAttrs.backcolor">
          <IconHighLight />
        </TextColorButton>
      </Popover>
      <Button 
        class="font-size-btn"
        style="width: 20%;"
        v-tooltip="'Increase font size'"
        @click="emitRichTextCommand('fontsize-add')"
      ><IconFontSize />+</Button>
      <Button
        last
        class="font-size-btn"
        style="width: 20%;"
        v-tooltip="'Reduce font size'"
        @click="emitRichTextCommand('fontsize-reduce')"
      ><IconFontSize />-</Button>
    </ButtonGroup>

    <ButtonGroup class="row">
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.bold"
        v-tooltip="'Bold'"
        @click="emitRichTextCommand('bold')"
      ><IconTextBold /></CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.em"
        v-tooltip="'Italic'"
        @click="emitRichTextCommand('em')"
      ><IconTextItalic /></CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.underline"
        v-tooltip="'Underline'"
        @click="emitRichTextCommand('underline')"
      ><IconTextUnderline /></CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="richTextAttrs.strikethrough"
        v-tooltip="'Strikethrough'"
        @click="emitRichTextCommand('strikethrough')"
      ><IconStrikethrough /></CheckboxButton>
    </ButtonGroup>

    <ButtonGroup class="row">
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.superscript"
        v-tooltip="'Superscript'"
        @click="emitRichTextCommand('superscript')"
      >A²</CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.subscript"
        v-tooltip="'Subscript'"
        @click="emitRichTextCommand('subscript')"
      >A₂</CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.code"
        v-tooltip="'Inline code'"
        @click="emitRichTextCommand('code')"
      ><IconCode /></CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="richTextAttrs.blockquote"
        v-tooltip="'References'"
        @click="emitRichTextCommand('blockquote')"
      ><IconQuote /></CheckboxButton>
    </ButtonGroup>

    <ButtonGroup class="row" passive>
      <CheckboxButton
        first
        style="flex: 1;"
        v-tooltip="'Clear Formatting'"
        @click="emitRichTextCommand('clear')"
      ><IconFormat /></CheckboxButton>
      <CheckboxButton
        style="flex: 1;"
        :checked="!!textFormatPainter"
        v-tooltip="'Format Painter (double-click to use continuously)'"
        @click="toggleTextFormatPainter()"
        @dblclick="toggleTextFormatPainter(true)"
      ><IconFormatBrush /></CheckboxButton>
      <Popover placement="bottom-end" trigger="click" v-model:value="linkPopoverVisible" style="width: 33.33%;">
        <template #content>
          <div class="link-popover">
            <Input v-model:value="link" placeholder="Please enter a hyperlink" />
            <div class="btns">
              <Button size="small" :disabled="!richTextAttrs.link" @click="removeLink()" style="margin-right: 5px;">Remove</Button>
              <Button size="small" type="primary" @click="updateLink(link)">Confirm</Button>
            </div>
          </div>
        </template>
        <CheckboxButton
          last
          style="width: 100%;"
          :checked="!!richTextAttrs.link"
          v-tooltip="'Hyperlink'"
          @click="openLinkPopover()"
        ><IconLinkOne /></CheckboxButton>
      </Popover>
    </ButtonGroup>
    <Divider />

    <RadioGroup 
      class="row" 
      button-style="solid" 
      :value="richTextAttrs.align"
      @update:value="value => emitRichTextCommand('align', value)"
    >
      <RadioButton value="left" v-tooltip="'Align Left'" style="flex: 1;"><IconAlignTextLeft /></RadioButton>
      <RadioButton value="center" v-tooltip="'Center'" style="flex: 1;"><IconAlignTextCenter /></RadioButton>
      <RadioButton value="right" v-tooltip="'Right Align'" style="flex: 1;"><IconAlignTextRight /></RadioButton>
      <RadioButton value="justify" v-tooltip="'Justify'" style="flex: 1;"><IconAlignTextBoth /></RadioButton>
    </RadioGroup>

    <div class="row" passive>
      <ButtonGroup style="flex: 1;">
        <Button
          first
          :type="richTextAttrs.bulletList ? 'primary' : 'default'"
          style="flex: 1;"
          v-tooltip="'Bullet'"
          @click="emitRichTextCommand('bulletList')"
        ><IconList /></Button>
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
          <Button last class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
      <div style="width: 10px;"></div>
      <ButtonGroup style="flex: 1;" passive>
        <Button
          first
          :type="richTextAttrs.orderedList ? 'primary' : 'default'"
          style="flex: 1;"
          v-tooltip="'serial number'"
          @click="emitRichTextCommand('orderedList')"
        ><IconOrderedList /></Button>
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
          <Button last class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
    </div>

    <div class="row">
      <ButtonGroup style="flex: 1;" passive>
        <Button first style="flex: 1;" v-tooltip="'Decrease paragraph indent'" @click="emitRichTextCommand('indent', '-1')"><IconIndentLeft /></Button>
        <Popover trigger="click" v-model:value="indentLeftPanelVisible">
          <template #content>
            <PopoverMenuItem @click="emitRichTextCommand('textIndent', '-1')">Decrease first line indent</PopoverMenuItem>
          </template>
          <Button last class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
      <div style="width: 10px;"></div>
      <ButtonGroup style="flex: 1;" passive>
        <Button first style="flex: 1;" v-tooltip="'Increase paragraph indent'" @click="emitRichTextCommand('indent', '+1')"><IconIndentRight /></Button>
        <Popover trigger="click" v-model:value="indentRightPanelVisible">
          <template #content>
            <PopoverMenuItem @click="emitRichTextCommand('textIndent', '+1')">Increase first line indent</PopoverMenuItem>
          </template>
          <Button last class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import emitter, { EmitterEvents } from '@/utils/emitter'
import { FONTS } from '@/configs/font'
import useTextFormatPainter from '@/hooks/useTextFormatPainter'
import message from '@/utils/message'

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

const { richTextAttrs, textFormatPainter } = storeToRefs(useMainStore())

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

watch(richTextAttrs, () => linkPopoverVisible.value = false)

const openLinkPopover = () => {
  link.value = richTextAttrs.value.link
}
const updateLink = (link?: string) => {
  const linkRegExp = /^(https?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/
  if (!link || !linkRegExp.test(link)) return message.error('Not a correct web link address')

  emitRichTextCommand('link', link)
  linkPopoverVisible.value = false
}

const removeLink = () => {
  emitRichTextCommand('link')
  linkPopoverVisible.value = false
}
</script>

<style lang="scss" scoped>
.rich-text-base {
  user-select: none;
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
  font-size: 12px;
  top: -3px;

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
</style>