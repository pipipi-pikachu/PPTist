<template>
  <div class="element-toolbar">
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ 'active': activeTab === item.key }" 
        v-for="item in tabs" 
        :key="item.key"
        @click="activeTab = item.key"
      >{{item.label}}</div>
    </div>

    <div class="content">
      <div class="style" v-if="activeTab === 'style'">
        <CheckboxButtonGroup class="row">
          <CheckboxButton 
            style="flex: 1;"
            :checked="richTextAttrs.bold"
            @click="emitRichTextCommand('bold')"
          ><IconTextBold /></CheckboxButton>
          <CheckboxButton 
            style="flex: 1;"
            :checked="richTextAttrs.em"
            @click="emitRichTextCommand('em')"
          ><IconTextItalic /></CheckboxButton>
          <CheckboxButton 
            style="flex: 1;"
            :checked="richTextAttrs.underline"
            @click="emitRichTextCommand('underline')"
          ><IconTextUnderline /></CheckboxButton>
          <CheckboxButton 
            style="flex: 1;"
            :checked="richTextAttrs.strikethrough"
            @click="emitRichTextCommand('strikethrough')"
          ><IconStrikethrough /></CheckboxButton>
        </CheckboxButtonGroup>

        <ButtonGroup class="row">
          <Button 
            style="flex: 2;"
            @click="emitRichTextCommand('fontsize-add')"
          ><IconFontSize />+</Button>
          <Button 
            style="flex: 2;"
            @click="emitRichTextCommand('fontsize-reduce')"
          ><IconFontSize />-</Button>
        </ButtonGroup>
        
        <Divider style="margin: 20px 0;" />

        <RadioGroup 
          class="row" 
          button-style="solid" 
          :value="richTextAttrs.align"
          @change="e => emitRichTextCommand('align', e.target.value)"
        >
          <RadioButton value="left" style="flex: 1;"><IconAlignTextLeft /></RadioButton>
          <RadioButton value="center" style="flex: 1;"><IconAlignTextCenter /></RadioButton>
          <RadioButton value="right" style="flex: 1;"><IconAlignTextRight /></RadioButton>
        </RadioGroup>
        
        <Divider style="margin: 20px 0;" />

        <div class="row-block">
          <div class="label">文字颜色：</div>
          <div class="colors">
            <div class="color" 
              v-for="color in colors" 
              :key="color"
              @click="updateFontColor(color)"
            >
              <div class="color-block" :style="{ backgroundColor: color }"></div>
            </div>
          </div>
        </div>
        <div class="row-block">
          <div class="label">填充色：</div>
          <div class="colors">
            <div class="color" 
              v-for="color in colors" 
              :key="color"
              @click="updateFill(color)"
            >
              <div class="color-block" :style="{ backgroundColor: color }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="common" v-if="activeTab === 'common'">
        <ButtonGroup class="row">
          <Button style="flex: 1;" @click="copyElement()"><IconCopy class="icon" /> 复制</Button>
          <Button style="flex: 1;" @click="deleteElement()"><IconDelete class="icon" /> 删除</Button>
        </ButtonGroup>
        
        <Divider style="margin: 20px 0;" />

        <ButtonGroup class="row">
          <Button style="flex: 1;" @click="orderElement(handleElement!, ElementOrderCommands.TOP)"><IconSendToBack class="icon" /> 置顶</Button>
          <Button style="flex: 1;" @click="orderElement(handleElement!, ElementOrderCommands.BOTTOM)"><IconBringToFrontOne class="icon" /> 置底</Button>
          <Button style="flex: 1;" @click="orderElement(handleElement!, ElementOrderCommands.UP)"><IconBringToFront class="icon" /> 上移</Button>
          <Button style="flex: 1;" @click="orderElement(handleElement!, ElementOrderCommands.DOWN)"><IconSentToBack class="icon" /> 下移</Button>
        </ButtonGroup>
        
        <Divider style="margin: 20px 0;" />

        <ButtonGroup class="row">
          <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.LEFT)"><IconAlignLeft class="icon" /> 左对齐</Button>
          <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.HORIZONTAL)"><IconAlignVertically class="icon" /> 水平居中</Button>
          <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.RIGHT)"><IconAlignRight class="icon" /> 右对齐</Button>
        </ButtonGroup>
        <ButtonGroup class="row">
          <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.TOP)"><IconAlignTop class="icon" /> 上对齐</Button>
          <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.VERTICAL)"><IconAlignHorizontally class="icon" /> 垂直居中</Button>
          <Button style="flex: 1;" @click="alignElementToCanvas(ElementAlignCommands.BOTTOM)"><IconAlignBottom class="icon" /> 下对齐</Button>
        </ButtonGroup>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTElement, TableCell } from '@/types/slides'
import { ElementAlignCommands, ElementOrderCommands } from '@/types/edit'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useOrderElement from '@/hooks/useOrderElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useDeleteElement from '@/hooks/useDeleteElement'
import useAddSlidesOrElements from '@/hooks/useAddSlidesOrElements'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

interface TabItem {
  key: 'style' | 'common'
  label: string
}

const colors = ['#000000', '#ffffff', '#eeece1', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c', '#c21401', '#ff1e02', '#ffc12a', '#ffff3a', '#90cf5b', '#00af57']

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElement, handleElementId, richTextAttrs } = storeToRefs(mainStore)

const { addHistorySnapshot } = useHistorySnapshot()

const updateElement = (id: string, props: Partial<PPTElement>) => {
  slidesStore.updateElement({ id, props })
  addHistorySnapshot()
}

const tabs: TabItem[] = [
  { key: 'style', label: '样式' },
  { key: 'common', label: '布局' },
]
const activeTab = ref('common')

const { orderElement } = useOrderElement()
const { alignElementToCanvas } = useAlignElementToCanvas()
const { addElementsFromData } = useAddSlidesOrElements()
const { deleteElement } = useDeleteElement()

const copyElement = () => {
  const element: PPTElement = JSON.parse(JSON.stringify(handleElement.value))
  addElementsFromData([element])
}

const emitRichTextCommand = (command: string, value?: string) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action: { command, value } })
}

const updateFontColor = (color: string) => {
  if (!handleElement.value) return
  if (handleElement.value.type === 'text' || (handleElement.value.type === 'shape' && handleElement.value.text?.content)) {
    emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action: { command: 'color', value: color } })
  }
  if (handleElement.value.type === 'table') {
    const data: TableCell[][] = JSON.parse(JSON.stringify(handleElement.value.data))
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const style = data[i][j].style || {}
        data[i][j].style = { ...style, color }
      }
    }
    updateElement(handleElementId.value, { data })
  }
  if (handleElement.value.type === 'latex') {
    updateElement(handleElementId.value, { color })
  }
}

const updateFill = (color: string) => {
  if (!handleElement.value) return
  if (
    handleElement.value.type === 'text' ||
    handleElement.value.type === 'shape' ||
    handleElement.value.type === 'chart'
  ) updateElement(handleElementId.value, { fill: color })

  if (handleElement.value.type === 'table') {
    const data: TableCell[][] = JSON.parse(JSON.stringify(handleElement.value.data))
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const style = data[i][j].style || {}
        data[i][j].style = { ...style, backcolor: color }
      }
    }
    updateElement(handleElementId.value, { data })
  }

  if (handleElement.value.type === 'audio') updateElement(handleElementId.value, { color })
}
</script>

<style lang="scss" scoped>
.element-toolbar {
  width: 100%;
  height: 240px;
  position: absolute;
  z-index: 99;
  bottom: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: slideInUp .15s;
}
.tabs {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid $borderColor;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
}
.tab {
  width: 30%;
  padding: 10px 10px 12px;
  margin: 0 10%;
  border-bottom: 2px solid transparent;
  text-align: center;
  cursor: pointer;

  &.active {
    border-bottom: 2px solid $themeColor;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.content {
  padding: 10px;
  flex: 1;
  overflow: auto;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .icon {
    margin-right: 3px;
  }
}
.row-block {
  margin-bottom: 10px;
  background-color: $lightGray;
  border-radius: $borderRadius;
  padding: 10px;
}
.label {
  font-size: 13px;
  margin-bottom: 20px;
  margin-left: 6px;
}
.colors {
  @include flex-grid-layout();
}
.color {
  @include flex-grid-layout-children(8, 12%);

  padding-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  .color-block {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
}
</style>