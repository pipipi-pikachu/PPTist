<template>
  <div class="text-style-panel">
    <InputGroup compact class="row">
      <Select
        style="flex: 3;"
        :value="richTextAttrs.fontname"
      >
        <SelectOption v-for="font in availableFonts" :key="font.en" :value="font.en">
          <span :style="{ fontFamily: font.en }">{{font.zh}}</span>
        </SelectOption>
      </Select>
      <Select
        style="flex: 2;"
        :value="richTextAttrs.fontsize"
      >
        <SelectOption v-for="fontsize in fontSizeOptions" :key="fontsize" :value="fontsize">
          {{fontsize}}
        </SelectOption>
      </Select>
    </InputGroup>

    <ButtonGroup class="row">
      <Popover trigger="click">
        <template #content>
          <ColorPicker v-model="richTextAttrs.color" />
        </template>
        <Button class="text-color-btn" style="flex: 1;">
          <FontColorsOutlined />
          <div class="text-color-block" :style="{ backgroundColor: richTextAttrs.color }"></div>
        </Button>
      </Popover>
      <Popover trigger="click">
        <template #content>
          <ColorPicker v-model="richTextAttrs.backcolor" />
        </template>
        <Button class="text-color-btn" style="flex: 1;">
          <HighlightOutlined />
          <div class="text-color-block" :style="{ backgroundColor: richTextAttrs.backcolor }"></div>
        </Button>
      </Popover>
      <Popover trigger="click">
        <template #content>
          <ColorPicker v-model="fill" />
        </template>
        <Button class="text-color-btn" style="flex: 1;">
          <BgColorsOutlined />
          <div class="text-color-block" :style="{ backgroundColor: fill }"></div>
        </Button>
      </Popover>
    </ButtonGroup>

    <ButtonGroup class="row">
      <Button style="flex: 1;" :type="richTextAttrs.bold ? 'primary' : 'default'"><BoldOutlined /></Button>
      <Button style="flex: 1;" :type="richTextAttrs.em ? 'primary' : 'default'"><ItalicOutlined /></Button>
      <Button style="flex: 1;" :type="richTextAttrs.underline ? 'primary' : 'default'"><UnderlineOutlined /></Button>
      <Button style="flex: 1;" :type="richTextAttrs.strikethrough ? 'primary' : 'default'"><StrikethroughOutlined /></Button>
    </ButtonGroup>

    <ButtonGroup class="row">
      <Button style="flex: 1;" :type="richTextAttrs.superscript ? 'primary' : 'default'">上</Button>
      <Button style="flex: 1;" :type="richTextAttrs.subscript ? 'primary' : 'default'">下</Button>
      <Button style="flex: 1;" :type="richTextAttrs.code ? 'primary' : 'default'">码</Button>
      <Button style="flex: 1;" :type="richTextAttrs.blockquote ? 'primary' : 'default'">引</Button>
      <Button style="flex: 1;">清</Button>
    </ButtonGroup>

    <Divider />

    <RadioGroup class="row" button-style="solid" :value="richTextAttrs.align">
      <RadioButton value="left" style="flex: 1;"><AlignLeftOutlined /></RadioButton>
      <RadioButton value="center" style="flex: 1;"><AlignCenterOutlined /></RadioButton>
      <RadioButton value="right" style="flex: 1;"><AlignRightOutlined /></RadioButton>
    </RadioGroup>

    <ButtonGroup class="row">
      <Button style="flex: 1;" :type="richTextAttrs.bulletList ? 'primary' : 'default'"><UnorderedListOutlined /></Button>
      <Button style="flex: 1;" :type="richTextAttrs.orderedList ? 'primary' : 'default'"><OrderedListOutlined /></Button>
    </ButtonGroup>

    <Divider />

    <div class="row">
      <div style="flex: 2;">行间距：</div>
      <Select style="flex: 3;" :value="lineHeight" @change="value => updateLineHeight(value)">
        <template #suffixIcon><ColumnHeightOutlined /></template>
        <SelectOption v-for="item in lineHeightOptions" :key="item" :value="item">{{item}}倍</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">字间距：</div>
      <Select style="flex: 3;" :value="wordSpace" @change="value => updateWordSpace(value)">
        <template #suffixIcon><ColumnWidthOutlined /></template>
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
import { computed, defineComponent, onUnmounted, Ref, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { PPTTextElement } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import { TextAttrs } from '@/prosemirror/utils'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOpacity from '../common/ElementOpacity.vue'
import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import { Select, Input, Button, Divider, Popover, Radio } from 'ant-design-vue'
import {
  FontColorsOutlined,
  HighlightOutlined,
  BgColorsOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  ColumnHeightOutlined,
  ColumnWidthOutlined,
} from '@ant-design/icons-vue'

export default defineComponent({
  name: 'text-style-panel',
  components: {
    ColorPicker,
    Select,
    SelectOption: Select.Option,
    InputGroup: Input.Group,
    Button,
    ButtonGroup: Button.Group,
    Divider,
    Popover,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    FontColorsOutlined,
    HighlightOutlined,
    BgColorsOutlined,
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    ColumnHeightOutlined,
    ColumnWidthOutlined,
    ElementOpacity,
    ElementOutline,
    ElementShadow,
  },
  setup() {
    const store = useStore<State>()
    const handleElement: Ref<PPTTextElement> = computed(() => store.getters.handleElement)

    const fill = ref<string>()
    const lineHeight = ref<number>()
    const wordSpace = ref<number>()

    watch(handleElement, () => {
      if(!handleElement.value) return
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
    }
  },
})
</script>

<style lang="scss" scoped>
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