<template>
  <div class="text-style-panel">
    <InputGroup compact class="row">
      <Select
        style="flex: 3;"
      >
        <SelectOption value="jack">Jack</SelectOption>
        <SelectOption value="lucy">Lucy</SelectOption>
        <SelectOption value="disabled">Disabled</SelectOption>
        <SelectOption value="Yiminghe">yiminghe</SelectOption>
      </Select>
      <Select
        style="flex: 2;"
      >
        <SelectOption value="jack">Jack</SelectOption>
        <SelectOption value="lucy">Lucy</SelectOption>
        <SelectOption value="disabled">Disabled</SelectOption>
        <SelectOption value="Yiminghe">yiminghe</SelectOption>
      </Select>
    </InputGroup>

    <ButtonGroup class="row">
      <Button style="flex: 1;"><FontColorsOutlined /></Button>
      <Button style="flex: 1;"><HighlightOutlined /></Button>
      <Button style="flex: 1;"><BgColorsOutlined /></Button>
    </ButtonGroup>

    <ButtonGroup class="row">
      <Button style="flex: 1;"><BoldOutlined /></Button>
      <Button style="flex: 1;"><ItalicOutlined /></Button>
      <Button style="flex: 1;"><UnderlineOutlined /></Button>
      <Button style="flex: 1;"><StrikethroughOutlined /></Button>
    </ButtonGroup>

    <Divider />

    <ButtonGroup class="row">
      <Button style="flex: 1;"><AlignLeftOutlined /></Button>
      <Button style="flex: 1;"><AlignCenterOutlined /></Button>
      <Button style="flex: 1;"><AlignRightOutlined /></Button>
    </ButtonGroup>

    <ButtonGroup class="row">
      <Button style="flex: 1;"><OrderedListOutlined /></Button>
      <Button style="flex: 1;"><UnorderedListOutlined /></Button>
    </ButtonGroup>

    <Divider />

    <div class="row">
      <div style="flex: 2;">行间距：</div>
      <Select style="flex: 3;">
        <SelectOption value="jack">Jack</SelectOption>
        <SelectOption value="lucy">Lucy</SelectOption>
        <SelectOption value="disabled">Disabled</SelectOption>
        <SelectOption value="Yiminghe">yiminghe</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">字间距：</div>
      <Select style="flex: 3;">
        <SelectOption value="jack">Jack</SelectOption>
        <SelectOption value="lucy">Lucy</SelectOption>
        <SelectOption value="disabled">Disabled</SelectOption>
        <SelectOption value="Yiminghe">yiminghe</SelectOption>
      </Select>
    </div>

    <Divider />

    <ButtonGroup class="row">
      <Button style="flex: 1;">边框</Button>
      <Button style="flex: 1;">阴影</Button>
    </ButtonGroup>

    <div class="row">
      <div style="flex: 2;">透明度：</div>
      <Slider style="flex: 3;" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Select, Input, Button, Divider, Slider } from 'ant-design-vue'
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
} from '@ant-design/icons-vue'

export default defineComponent({
  name: 'text-style-panel',
  components: {
    Select,
    SelectOption: Select.Option,
    InputGroup: Input.Group,
    Button,
    ButtonGroup: Button.Group,
    Divider,
    Slider,
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
</style>