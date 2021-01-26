<template>
  <div class="text-style-panel">
    <InputGroup compact class="row">
      <Select
        style="flex: 3;"
        :value="richTextAttrs.fontname"
        @change="value => emitRichTextCommand('fontname', value)"
      >
        <template #suffixIcon><IconFontSize /></template>
        <SelectOption v-for="font in availableFonts" :key="font.en" :value="font.en">
          <span :style="{ fontFamily: font.en }">{{font.zh}}</span>
        </SelectOption>
      </Select>
      <Select
        style="flex: 2;"
        :value="richTextAttrs.fontsize"
        @change="value => emitRichTextCommand('fontsize', value)"
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
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="文字颜色">
          <Button class="text-color-btn" style="flex: 1;">
            <IconText />
            <div class="text-color-block" :style="{ backgroundColor: richTextAttrs.color }"></div>
          </Button>
        </Tooltip>
      </Popover>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="richTextAttrs.backcolor"
            @update:modelValue="value => emitRichTextCommand('backcolor', value)"
          />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="文字高亮">
          <Button class="text-color-btn" style="flex: 1;">
            <IconBackgroundColor />
            <div class="text-color-block" :style="{ backgroundColor: richTextAttrs.backcolor }"></div>
          </Button>
        </Tooltip>
      </Popover>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="fill"
            @update:modelValue="value => updateFill(value)"
          />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="文本框填充">
          <Button class="text-color-btn" style="flex: 1;">
            <IconFill />
            <div class="text-color-block" :style="{ backgroundColor: fill }"></div>
          </Button>
        </Tooltip>
      </Popover>
    </ButtonGroup>

    <CheckboxButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="加粗">
        <CheckboxButton 
          style="flex: 1;"
          :checked="richTextAttrs.bold"
          @click="emitRichTextCommand('bold')"
        ><IconTextBold /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="斜体">
        <CheckboxButton 
          style="flex: 1;"
          :checked="richTextAttrs.em"
          @click="emitRichTextCommand('em')"
        ><IconTextItalic /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="下划线">
        <CheckboxButton 
          style="flex: 1;"
          :checked="richTextAttrs.underline"
          @click="emitRichTextCommand('underline')"
        ><IconTextUnderline /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="删除线">
        <CheckboxButton 
          style="flex: 1;"
          :checked="richTextAttrs.strikethrough"
          @click="emitRichTextCommand('strikethrough')"
        ><IconStrikethrough /></CheckboxButton>
      </Tooltip>
    </CheckboxButtonGroup>

    <CheckboxButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="上标">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.superscript"
          @click="emitRichTextCommand('superscript')"
        ><IconUpOne /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="下标">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.subscript"
          @click="emitRichTextCommand('subscript')"
        ><IconDownOne /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="行内代码">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.code"
          @click="emitRichTextCommand('code')"
        ><IconCode /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="引用">
        <CheckboxButton
          style="flex: 1;"
          :checked="richTextAttrs.blockquote"
          @click="emitRichTextCommand('blockquote')"
        ><IconQuote /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="清除格式">
        <CheckboxButton
          style="flex: 1;"
          @click="emitRichTextCommand('clear')"
        ><IconFormat /></CheckboxButton>
      </Tooltip>
    </CheckboxButtonGroup>

    <Divider />

    <RadioGroup 
      class="row" 
      button-style="solid" 
      :value="richTextAttrs.align"
      @change="e => emitRichTextCommand('align', e.target.value)"
    >
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="左对齐">
        <RadioButton value="left" style="flex: 1;"><IconAlignTextLeft /></RadioButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="居中">
        <RadioButton value="center" style="flex: 1;"><IconAlignTextCenter /></RadioButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="右对齐">
        <RadioButton value="right" style="flex: 1;"><IconAlignTextRight /></RadioButton>
      </Tooltip>
    </RadioGroup>

    <CheckboxButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="项目符号">
        <CheckboxButton 
          style="flex: 1;" 
          :checked="richTextAttrs.bulletList"
          @click="emitRichTextCommand('bulletList')"
        ><IconList /></CheckboxButton>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="编号">
        <CheckboxButton 
          style="flex: 1;" 
          :checked="richTextAttrs.orderedList"
          @click="emitRichTextCommand('orderedList')"
        ><IconOrderedList /></CheckboxButton>
      </Tooltip>
    </CheckboxButtonGroup>

    <Divider />

    <div class="row">
      <div style="flex: 2;">行间距：</div>
      <Select style="flex: 3;" :value="lineHeight" @change="value => updateLineHeight(value)">
        <template #suffixIcon><IconRowHeight /></template>
        <SelectOption v-for="item in lineHeightOptions" :key="item" :value="item">{{item}}倍</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">字间距：</div>
      <Select style="flex: 3;" :value="wordSpace" @change="value => updateWordSpace(value)">
        <template #suffixIcon><IconFullwidth /></template>
        <SelectOption v-for="item in wordSpaceOptions" :key="item" :value="item">{{item}}px</SelectOption>
      </Select>
    </div>

    <Divider />
    <ElementOutline />
    <Divider />
    <ElementShadow />
    <Divider />
    <ElementOpacity />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { PPTTextElement } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import { TextAttrs } from '@/prosemirror/utils'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOpacity from '../common/ElementOpacity.vue'
import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'

export default defineComponent({
  name: 'text-style-panel',
  components: {
    ElementOpacity,
    ElementOutline,
    ElementShadow,
  },
  setup() {
    const store = useStore<State>()
    const handleElement = computed<PPTTextElement>(() => store.getters.handleElement)

    const fill = ref<string>()
    const lineHeight = ref<number>()
    const wordSpace = ref<number>()

    watch(handleElement, () => {
      if(!handleElement.value || handleElement.value.type !== 'text') return

      fill.value = handleElement.value.fill || '#000'
      lineHeight.value = handleElement.value.lineHeight || 1.5
      wordSpace.value = handleElement.value.wordSpace || 0
    }, { deep: true, immediate: true })

    const richTextAttrs = ref<TextAttrs>({
      bold: false,
      em: false,
      underline: false,
      strikethrough: false,
      superscript: false,
      subscript: false,
      code: false,
      color: '#000',
      backcolor: '#000',
      fontsize: '12px',
      fontname: '微软雅黑',
      align: 'left',
      bulletList: false,
      orderedList: false,
      blockquote: false,
    })

    const availableFonts = computed(() => store.state.availableFonts)
    const fontSizeOptions = [
      '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
      '36px', '40px', '44px', '48px', '54px', '60px', '66px', '72px', '80px',
    ]
    const lineHeightOptions = [0.5, 1.0, 1.2, 1.5, 1.8, 2.0, 3.0]
    const wordSpaceOptions = [0, 1, 2, 3, 4, 5, 8]

    const updateRichTextAttrs = (attr: TextAttrs) => richTextAttrs.value = attr

    emitter.on(EmitterEvents.UPDATE_TEXT_STATE, attr => updateRichTextAttrs(attr))
    onUnmounted(() => {
      emitter.off(EmitterEvents.UPDATE_TEXT_STATE, attr => updateRichTextAttrs(attr))
    })

    const emitRichTextCommand = (command: string, value?: string) => {
      emitter.emit(EmitterEvents.EXEC_TEXT_COMMAND, { command, value })
    }

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateLineHeight = (value: number) => {
      const props = { lineHeight: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    const updateWordSpace = (value: number) => {
      const props = { wordSpace: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    const updateFill = (value: string) => {
      const props = { fill: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    return {
      fill,
      lineHeight,
      wordSpace,
      richTextAttrs,
      availableFonts,
      fontSizeOptions,
      lineHeightOptions,
      wordSpaceOptions,
      updateLineHeight,
      updateWordSpace,
      updateFill,
      emitRichTextCommand,
    }
  },
})
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
.text-color-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.text-color-block {
  width: 16px;
  height: 3px;
  margin-top: 1px;
}
</style>