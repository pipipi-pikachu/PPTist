<template>
  <div class="canvas-tool">
    <div class="left-handler">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="撤销">
        <IconBack class="handler-item" :class="{ 'disable': !canUndo }" @click="undo()" />
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="重做">
        <IconNext class="handler-item" :class="{ 'disable': !canRedo }" @click="redo()" />
      </Tooltip>
    </div>

    <div class="add-element-handler">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入文字">
        <div class="handler-item group-btn">
          <IconFontSize class="icon" :class="{ 'active': creatingElement?.type === 'text' }" @click="drawText()" />
          
          <Popover trigger="click" v-model:visible="textTypeSelectVisible">
            <template #content>
              <div class="text-type-item" @click="() => { drawText(); textTypeSelectVisible = false }"><IconTextRotationNone /> 横向文本框</div>
              <div class="text-type-item" @click="() => { drawText(true); textTypeSelectVisible = false }"><IconTextRotationDown /> 竖向文本框</div>
            </template>
            <IconDown class="arrow" />
          </Popover>
        </div>
      </Tooltip>
      <FileInput @change="files => insertImageElement(files)">
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入图片">
          <IconPicture class="handler-item" />
        </Tooltip>
      </FileInput>
      <Popover trigger="click" v-model:visible="shapePoolVisible">
        <template #content>
          <ShapePool @select="shape => drawShape(shape)" />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入形状">
          <IconGraphicDesign class="handler-item" :class="{ 'active': creatingElement?.type === 'shape' }" />
        </Tooltip>
      </Popover>
      <Popover trigger="click" v-model:visible="linePoolVisible">
        <template #content>
          <LinePool @select="line => drawLine(line)" />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入线条">
          <IconConnection class="handler-item" :class="{ 'active': creatingElement?.type === 'line' }" />
        </Tooltip>
      </Popover>
      <Popover trigger="click" v-model:visible="chartPoolVisible">
        <template #content>
          <ChartPool @select="chart => { createChartElement(chart); chartPoolVisible = false }" />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入图表">
          <IconChartProportion class="handler-item" />
        </Tooltip>
      </Popover>
      <Popover trigger="click" v-model:visible="tableGeneratorVisible">
        <template #content>
          <TableGenerator
            @close="tableGeneratorVisible = false"
            @insert="({ row, col }) => { createTableElement(row, col); tableGeneratorVisible = false }"
          />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入表格">
          <IconInsertTable class="handler-item" />
        </Tooltip>
      </Popover>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入公式">
        <IconFormula class="handler-item" @click="latexEditorVisible = true" />
      </Tooltip>
      <Popover trigger="click" v-model:visible="mediaInputVisible">
        <template #content>
          <MediaInput 
            @close="mediaInputVisible = false"
            @insertVideo="src => { createVideoElement(src); mediaInputVisible = false }"
            @insertAudio="src => { createAudioElement(src); mediaInputVisible = false }"
          />
        </template>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入音视频">
          <IconVideoTwo class="handler-item" />
        </Tooltip>
      </Popover>
    </div>

    <div class="right-handler">
      <IconMinus class="handler-item viewport-size" @click="scaleCanvas('-')" />
      <Popover trigger="click" v-model:visible="canvasScaleVisible">
        <template #content>
          <div class="viewport-size-preset">
            <div 
              class="preset-item" 
              v-for="item in canvasScalePresetList" 
              :key="item" 
              @click="applyCanvasPresetScale(item)"
            >{{item}}%</div>
          </div>
        </template>
        <span class="text">{{canvasScalePercentage}}</span>
      </Popover>
      <IconPlus class="handler-item viewport-size" @click="scaleCanvas('+')" />
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="适应屏幕">
        <IconFullScreen class="handler-item viewport-size-adaptation" @click="resetCanvas()" />
      </Tooltip>
    </div>

    <Modal
      v-model:visible="latexEditorVisible" 
      :footer="null" 
      centered
      :width="880"
      destroyOnClose
    >
      <LaTeXEditor 
        @close="latexEditorVisible = false"
        @update="data => { createLatexElement(data); latexEditorVisible = false }"
      />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSnapshotStore } from '@/store'
import { getImageDataURL } from '@/utils/image'
import { ShapePoolItem } from '@/configs/shapes'
import { LinePoolItem } from '@/configs/lines'
import useScaleCanvas from '@/hooks/useScaleCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useCreateElement from '@/hooks/useCreateElement'

import ShapePool from './ShapePool.vue'
import LinePool from './LinePool.vue'
import ChartPool from './ChartPool.vue'
import TableGenerator from './TableGenerator.vue'
import MediaInput from './MediaInput.vue'
import LaTeXEditor from '@/components/LaTeXEditor/index.vue'

const mainStore = useMainStore()
const { creatingElement } = storeToRefs(mainStore)
const { canUndo, canRedo } = storeToRefs(useSnapshotStore())

const { redo, undo } = useHistorySnapshot()

const {
  scaleCanvas,
  setCanvasScalePercentage,
  resetCanvas,
  canvasScalePercentage,
} = useScaleCanvas()

const canvasScalePresetList = [200, 150, 100, 80, 50]
const canvasScaleVisible = ref(false)

const applyCanvasPresetScale = (value: number) => {
  setCanvasScalePercentage(value)
  canvasScaleVisible.value = false
}

const {
  createImageElement,
  createChartElement,
  createTableElement,
  createLatexElement,
  createVideoElement,
  createAudioElement,
} = useCreateElement()

const insertImageElement = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
}

const shapePoolVisible = ref(false)
const linePoolVisible = ref(false)
const chartPoolVisible = ref(false)
const tableGeneratorVisible = ref(false)
const mediaInputVisible = ref(false)
const latexEditorVisible = ref(false)
const textTypeSelectVisible = ref(false)

// 绘制文字范围
const drawText = (vertical = false) => {
  mainStore.setCreatingElement({
    type: 'text',
    vertical,
  })
}

// 绘制形状范围
const drawShape = (shape: ShapePoolItem) => {
  mainStore.setCreatingElement({
    type: 'shape',
    data: shape,
  })
  shapePoolVisible.value = false
}

// 绘制线条路径
const drawLine = (line: LinePoolItem) => {
  mainStore.setCreatingElement({
    type: 'line',
    data: line,
  })
  linePoolVisible.value = false
}
</script>

<style lang="scss" scoped>
.canvas-tool {
  position: relative;
  border-bottom: 1px solid $borderColor;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 13px;
  user-select: none;
}
.left-handler {
  display: flex;
  align-items: center;
}
.add-element-handler {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;

  .handler-item {
    width: 32px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 2px;
    border-radius: $borderRadius;

    &:not(.group-btn):hover {
      background-color: #f1f1f1;
    }

    &.active {
      color: $themeColor;
    }

    &.group-btn {
      width: auto;
      margin-right: 4px;

      &:hover {
        background-color: #f3f3f3;
      }

      .icon, .arrow {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .icon {
        width: 26px;
        padding: 0 2px;

        &:hover {
          background-color: #e9e9e9;
        }
        &.active {
          color: $themeColor;
        }
      }
      .arrow {
        font-size: 12px;

        &:hover {
          background-color: #e9e9e9;
        }
      }
    }
  }
}
.handler-item {
  margin: 0 10px;
  font-size: 14px;
  overflow: hidden;
  cursor: pointer;

  &.disable {
    opacity: .5;
  }
}
.right-handler {
  display: flex;
  align-items: center;

  .text {
    width: 40px;
    text-align: center;
    cursor: pointer;
  }

  .viewport-size {
    font-size: 13px;
  }
}
.preset-item {
  padding: 8px 20px;
  text-align: center;
  cursor: pointer;

  &:hover {
    color: $themeColor;
  }
}
.text-type-item {
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }

  & + .text-type-item {
    margin-top: 3px;
  }
}
</style>