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

    <ButtonGroup class="row">
      <Button style="flex: 1;" :type="richTextAttrs.align === 'left' || '' ? 'primary' : 'default'"><AlignLeftOutlined /></Button>
      <Button style="flex: 1;" :type="richTextAttrs.align === 'center' ? 'primary' : 'default'"><AlignCenterOutlined /></Button>
      <Button style="flex: 1;" :type="richTextAttrs.align === 'right' ? 'primary' : 'default'"><AlignRightOutlined /></Button>
    </ButtonGroup>

    <ButtonGroup class="row">
      <Button style="flex: 1;" :type="richTextAttrs.bulletList ? 'primary' : 'default'"><UnorderedListOutlined /></Button>
      <Button style="flex: 1;" :type="richTextAttrs.orderedList ? 'primary' : 'default'"><OrderedListOutlined /></Button>
    </ButtonGroup>

    <Divider />

    <div class="row">
      <div style="flex: 2;">行间距：</div>
      <Select style="flex: 3;" :value="lineHeight">
        <template #suffixIcon><ColumnHeightOutlined /></template>
        <SelectOption v-for="item in lineHeightOptions" :key="item" :value="item">{{item}}</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">字间距：</div>
      <Select style="flex: 3;" :value="wordSpace">
        <template #suffixIcon><ColumnWidthOutlined /></template>
        <SelectOption v-for="item in wordSpaceOptions" :key="item" :value="item">{{item}}</SelectOption>
      </Select>
    </div>

    <Divider />

    <div class="row">
      <div style="flex: 2;">描边样式：</div>
      <Select style="flex: 3;" :value="wordSpace">
        <template #suffixIcon><ColumnWidthOutlined /></template>
        <SelectOption v-for="item in wordSpaceOptions" :key="item" :value="item">{{item}}</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">描边颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker v-model="fill" />
        </template>
        <Button class="color-btn" style="flex: 3;">
          <div class="color-block"></div>
          <DownOutlined class="color-btn-icon" />
        </Button>
      </Popover>
    </div>
    <div class="row">
      <div style="flex: 2;">描边粗细：</div>
      <InputNumber style="flex: 3;" />
    </div>

    <Divider />

    <div class="row">
      <div style="flex: 2;">水平阴影：</div>
      <Slider :min="0" :max="1" :step="0.1" :value="opacity" style="flex: 3;" />
    </div>
    <div class="row">
      <div style="flex: 2;">垂直阴影：</div>
      <Slider :min="0" :max="1" :step="0.1" :value="opacity" style="flex: 3;" />
    </div>
    <div class="row">
      <div style="flex: 2;">模糊距离：</div>
      <Slider :min="0" :max="1" :step="0.1" :value="opacity" style="flex: 3;" />
    </div>
    <div class="row">
      <div style="flex: 2;">阴影颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker v-model="fill" />
        </template>
        <Button class="color-btn" style="flex: 3;">
          <div class="color-block"></div>
          <DownOutlined class="color-btn-icon" />
        </Button>
      </Popover>
    </div>

    <Divider />

    <div class="row">
      <div style="flex: 2;">透明度：</div>
      <Slider :min="0" :max="1" :step="0.1" :value="opacity" style="flex: 3;" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'
import { PPTElementOutline, PPTElementShadow } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import { TextAttrs } from '@/prosemirror/utils'

import ColorPicker from '@/components/ColorPicker/index.vue'
import { Select, Input, Button, Divider, Slider, Popover, InputNumber } from 'ant-design-vue'
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
  DownOutlined,
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
    Slider,
    Popover,
    InputNumber,
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
    DownOutlined,
  },
  setup() {
    const store = useStore<State>()

    const fill = ref('#000')
    const lineHeight = ref(1.5)
    const wordSpace = ref(0)
    const opacity = ref(1)
    const shadow = ref<PPTElementShadow>()
    const outline = ref<PPTElementOutline>()

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

    return {
      fill,
      lineHeight,
      wordSpace,
      opacity,
      shadow,
      outline,
      richTextAttrs,
      availableFonts,
      fontSizeOptions,
      lineHeightOptions,
      wordSpaceOptions,
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
.color-btn {
  display: flex;
  align-items: center;
  padding: 0 !important;
}
.color-block {
  width: 100px;
  height: 20px;
  background-color: #777;
  margin: 0 8px;
}
.color-btn-icon {
  font-size: 12px;
  margin-top: 2px;
}
</style>