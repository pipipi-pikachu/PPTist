<template>
  <div class="text-style-panel">
    <div class="preset-style">
      <div
        class="preset-style-item"
        v-for="item in presetStyles"
        :key="item.label"
        :style="item.style"
        @click="emitBatchRichTextCommand(item.cmd)"
      >{{t(item.label)}}</div>
    </div>

    <Divider />

    <InputGroup compact class="row">
      <Select
        class="font-select"
        style="flex: 3;"
        :value="richTextAttrs.fontname"
        @change="value => emitRichTextCommand('fontname', value as string)"
      >
        <template #suffixIcon><IconFontSize /></template>
        <SelectOptGroup :label="t('textStyle.system')">
          <SelectOption v-for="font in availableFonts" :key="font.value" :value="font.value">
            <span :style="{ fontFamily: font.value }">{{font.label}}</span>
          </SelectOption>
        </SelectOptGroup>
        <SelectOptGroup :label="t('textStyle.web')">
          <SelectOption v-for="font in WEB_FONTS" :key="font.value" :value="font.value">
            <span>{{font.label}}</span>
          </SelectOption>
        </SelectOptGroup>
      </Select>
      <Select
        style="flex: 2;"
        :value="richTextAttrs.fontsize"
        @change="value => emitRichTextCommand('fontsize', value as string)"
      >
        <template #suffixIcon><IconAddText /></template>
        <SelectOption v-for="fontsize in fontSizeOptions" :key="fontsize" :value="fontsize">
          {{fontsize}}
        </SelectOption>
      </Select>
    </InputGroup>

    <ButtonGroup class="row">
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="richTextAttrs.color"
            @update:modelValue="value => emitRichTextCommand('color', value)"
          />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.color')">
          <TextColorButton :color="richTextAttrs.color" style="flex: 3;">
            <IconText />
          </TextColorButton>
        </Tooltip>
      </Popover>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="richTextAttrs.backcolor"
            @update:modelValue="value => emitRichTextCommand('backcolor', value)"
          />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.highlight')">
          <TextColorButton :color="richTextAttrs.backcolor" style="flex: 3;">
            <IconHighLight />
          </TextColorButton>
        </Tooltip>
      </Popover>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.fontSizePlus')">
        <Button
          class="font-size-btn"
          style="flex: 2;"
          @click="emitRichTextCommand('fontsize-add')"
        ><IconFontSize />+</Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.fontSizePlus')">
        <Button
          class="font-size-btn"
          style="flex: 2;"
          @click="emitRichTextCommand('fontsize-reduce')"
        ><IconFontSize />-</Button>
      </Tooltip>
    </ButtonGroup>

    <CheckboxButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.bold')">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.bold"
          @click="emitRichTextCommand('bold')"
        ><IconTextBold /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.italic')">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.em"
          @click="emitRichTextCommand('em')"
        ><IconTextItalic /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.underline')">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.underline"
          @click="emitRichTextCommand('underline')"
        ><IconTextUnderline /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.strikethrough')">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.strikethrough"
          @click="emitRichTextCommand('strikethrough')"
        ><IconStrikethrough /></CheckboxButton>
      </Tooltip>
    </CheckboxButtonGroup>

    <CheckboxButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.super')">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.superscript"
          @click="emitRichTextCommand('superscript')"
        >A²</CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.sub')">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.subscript"
          @click="emitRichTextCommand('subscript')"
        >A₂</CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.code')">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.code"
          @click="emitRichTextCommand('code')"
        ><IconCode /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.quote')">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.blockquote"
          @click="emitRichTextCommand('blockquote')"
        ><IconQuote /></CheckboxButton>
      </Tooltip>
    </CheckboxButtonGroup>

    <CheckboxButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.clear')">
        <CheckboxButton
          style="flex: 1;"
          @click="emitRichTextCommand('clear')"
        ><IconFormat /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.preview')">
        <CheckboxButton
          style="flex: 1;"
          :checked="!!textFormatPainter"
          @click="toggleFormatPainter()"
        ><IconFormatBrush /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.link')">
        <Popover placement="bottomRight" trigger="click" v-model:visible="linkPopoverVisible">
          <template #content>
            <div class="link-popover">
              <Input v-model:value="link" :placeholder="t('textStyle.linkPlaceholder')" />
              <div class="btns">
                <Button size="small" :disabled="!richTextAttrs.link" @click="updateLink()" style="margin-right: 5px;">{{t('common.remove')}}</Button>
                <Button size="small" type="primary" @click="updateLink(link)">{{t('common.confirm')}}</Button>
              </div>
            </div>
          </template>
          <CheckboxButton
            style="flex: 1;"
            :checked="!!richTextAttrs.link"
            @click="openLinkPopover()"
          ><IconLinkOne /></CheckboxButton>
        </Popover>
      </Tooltip>
    </CheckboxButtonGroup>

    <Divider />

    <RadioGroup
      class="row"
      button-style="solid"
      :value="richTextAttrs.align"
      @change="e => emitRichTextCommand('align', e.target.value)"
    >
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.alignLeft')">
        <RadioButton value="left" style="flex: 1;"><IconAlignTextLeft /></RadioButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.alignCenter')">
        <RadioButton value="center" style="flex: 1;"><IconAlignTextCenter /></RadioButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.alignRight')">
        <RadioButton value="right" style="flex: 1;"><IconAlignTextRight /></RadioButton>
      </Tooltip>
    </RadioGroup>

    <div class="row">
      <ButtonGroup style="flex: 15;">
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.ul')">
          <Button
            :type="richTextAttrs.bulletList ? 'primary' : 'default'"
            style="flex: 1;"
            @click="emitRichTextCommand('bulletList')"
          ><IconList /></Button>
        </Tooltip>
        <Popover trigger="click" v-model:visible="bulletListPanelVisible">
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
          <Button class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
      <div style="flex: 1;"></div>
      <ButtonGroup style="flex: 15;">
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.ol')">
          <Button
            :type="richTextAttrs.orderedList ? 'primary' : 'default'"
            style="flex: 1;"
            @click="emitRichTextCommand('orderedList')"
          ><IconOrderedList /></Button>
        </Tooltip>
        <Popover trigger="click" v-model:visible="orderedListPanelVisible">
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
          <Button class="popover-btn"><IconDown /></Button>
        </Popover>
      </ButtonGroup>
    </div>

    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.indentMinus')">
        <Button style="flex: 1;" @click="emitRichTextCommand('indent', '-1')"><IconIndentLeft /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" :title="t('textStyle.indentPlus')">
        <Button style="flex: 1;" @click="emitRichTextCommand('indent', '+1')"><IconIndentRight /></Button>
      </Tooltip>
    </ButtonGroup>

    <Divider />

    <div class="row">
      <div style="flex: 2;">{{t('textStyle.lineHeight')}}：</div>
      <Select style="flex: 3;" :value="lineHeight" @change="value => updateLineHeight(value as number)">
        <template #suffixIcon><IconRowHeight /></template>
        <SelectOption v-for="item in lineHeightOptions" :key="item" :value="item">{{item + t('textStyle.times')}}</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">{{t('textStyle.pSpacing')}}：</div>
      <Select style="flex: 3;" :value="paragraphSpace" @change="value => updateParagraphSpace(value as number)">
        <template #suffixIcon><IconVerticalSpacingBetweenItems /></template>
        <SelectOption v-for="item in paragraphSpaceOptions" :key="item" :value="item">{{item}}px</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">{{t('textStyle.wordSpace')}}：</div>
      <Select style="flex: 3;" :value="wordSpace" @change="value => updateWordSpace(value as number)">
        <template #suffixIcon><IconFullwidth /></template>
        <SelectOption v-for="item in wordSpaceOptions" :key="item" :value="item">{{item}}px</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">{{t('textStyle.textIndent')}}：</div>
      <Select style="flex: 3;" :value="textIndent" @change="value => updateTextIndent(value as number)">
        <template #suffixIcon><IconIndentRight /></template>
        <SelectOption v-for="item in textIndentOptions" :key="item" :value="item">{{item}}px</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">{{t('textStyle.textFill')}}：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="fill"
            @update:modelValue="value => updateFill(value)"
          />
        </template>
        <ColorButton :color="fill" style="flex: 3;" />
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
import { PPTTextElement } from '@/types/slides'
import emitter, { EmitterEvents, RichTextAction } from '@/utils/emitter'
import { WEB_FONTS } from '@/configs/font'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useTextFormatPainter from '@/hooks/useTextFormatPainter'

import ElementOpacity from '../common/ElementOpacity.vue'
import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'
import ColorButton from '../common/ColorButton.vue'
import TextColorButton from '../common/TextColorButton.vue'
import CheckboxButton from '@/components/CheckboxButton.vue'
import CheckboxButtonGroup from '@/components/CheckboxButtonGroup.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import {
  Divider,
  Button,
  Tooltip,
  Popover,
  Select,
  Radio,
  Input,
  message,
} from 'ant-design-vue'
import usei18n from '@/hooks/usei18n'

const {t} = usei18n()
const { Group: RadioGroup, Button: RadioButton } = Radio
const { OptGroup: SelectOptGroup, Option: SelectOption } = Select
const InputGroup = Input.Group
const ButtonGroup = Button.Group

// 注意，存在一个未知原因的BUG，如果文本加粗后文本框高度增加，画布的可视区域定位会出现错误
// 因此在执行预置样式命令时，将加粗命令放在尽可能靠前的位置，避免字号增大后再加粗
const presetStyles = [
  {
    label: 'textStyle.headline',
    style: {
      fontSize: '26px',
      fontWeight: 700,
    },
    cmd: [
      { command: 'clear' },
      { command: 'bold' },
      { command: 'fontsize', value: '48px' },
      { command: 'align', value: 'center' },
    ],
  },
  {
    label: 'textStyle.subheading',
    style: {
      fontSize: '22px',
      fontWeight: 700,
    },
    cmd: [
      { command: 'clear' },
      { command: 'bold' },
      { command: 'fontsize', value: '36px' },
      { command: 'align', value: 'center' },
    ],
  },
  {
    label: 'textStyle.text',
    style: {
      fontSize: '20px',
    },
    cmd: [
      { command: 'clear' },
      { command: 'fontsize', value: '20px' },
    ],
  },
  {
    label: 'textStyle.textSmall',
    style: {
      fontSize: '18px',
    },
    cmd: [
      { command: 'clear' },
      { command: 'fontsize', value: '18px' },
    ],
  },
  {
    label: 'textStyle.note1',
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
    label: 'textStyle.note1',
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
const { handleElement, handleElementId, richTextAttrs, availableFonts, textFormatPainter } = storeToRefs(mainStore)

const { addHistorySnapshot } = useHistorySnapshot()
const { toggleFormatPainter } = useTextFormatPainter()

const updateElement = (props: Partial<PPTTextElement>) => {
  slidesStore.updateElement({ id: handleElementId.value, props })
  addHistorySnapshot()
}

const bulletListPanelVisible = ref(false)
const orderedListPanelVisible = ref(false)

const bulletListStyleTypeOption = ref(['disc', 'circle', 'square'])
const orderedListStyleTypeOption = ref(['decimal', 'lower-roman', 'upper-roman', 'lower-alpha', 'upper-alpha', 'lower-greek'])

const fill = ref<string>('#000')
const lineHeight = ref<number>()
const wordSpace = ref<number>()
const textIndent = ref<number>()
const paragraphSpace = ref<number>()

watch(handleElement, () => {
  if (!handleElement.value || handleElement.value.type !== 'text') return

  fill.value = handleElement.value.fill || '#fff'
  lineHeight.value = handleElement.value.lineHeight || 1.5
  wordSpace.value = handleElement.value.wordSpace || 0
  textIndent.value = handleElement.value.textIndent || 0
  paragraphSpace.value = handleElement.value.paragraphSpace === undefined ? 5 : handleElement.value.paragraphSpace
}, { deep: true, immediate: true })

const fontSizeOptions = [
  '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
  '36px', '40px', '44px', '48px', '54px', '60px', '66px', '72px', '76px',
  '80px', '88px', '96px', '104px', '112px', '120px',
]
const lineHeightOptions = [0.9, 1.0, 1.15, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0]
const wordSpaceOptions = [0, 1, 2, 3, 4, 5, 6, 8, 10]
const textIndentOptions = [0, 48, 96, 144, 192, 240, 288, 336]
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

// 设置首行缩进
const updateTextIndent = (value: number) => {
  updateElement({ textIndent: value })
}

// 设置文本框填充
const updateFill = (value: string) => {
  updateElement({ fill: value })
}

// 发射富文本设置命令
const emitRichTextCommand = (command: string, value?: string) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action: { command, value } })
}

// 发射富文本设置命令（批量）
const emitBatchRichTextCommand = (action: RichTextAction[]) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action })
}

// 设置富文本超链接
const link = ref('')
const linkPopoverVisible = ref(false)

watch(richTextAttrs, () => linkPopoverVisible.value = false)

const openLinkPopover = () => {
  link.value = richTextAttrs.value.link
  linkPopoverVisible.value = true
}
const updateLink = (link?: string) => {
  if (link) {
    const linkRegExp = /^(https?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/
    if (!linkRegExp.test(link)) return message.error('不是正确的网页链接地址')
  }
  emitRichTextCommand('link', link)
  linkPopoverVisible.value = false
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
.font-select {
  max-width: 50%;
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
  top: -5px;

  span {
    width: 100%;
    height: 2px;
    display: inline-block;
    position: absolute;
    top: 10px;
    background-color: #666;
  }
}
.popover-btn {
  padding: 0 3px;
}
</style>
