<template>
  <div class="writing-board-tool">
    <div class="writing-board-wrap"
      :style="{
        width: slideWidth + 'px',
        height: slideHeight + 'px',
      }"
    >
      <WritingBoard 
        ref="writingBoardRef" 
        :color="writingBoardColor" 
        :blackboard="blackboard" 
        :model="writingBoardModel"
        :penSize="penSize"
        :markSize="markSize"
        :rubberSize="rubberSize"
        :shapeSize="shapeSize"
        :shapeType="shapeType"
        @end="handleWritingEnd()"
      />
    </div>

    <MoveablePanel 
      class="tools-panel" 
      :width="510" 
      :height="50"
      :left="left" 
      :top="top"
    >
      <div class="tools" @mousedown.stop>
        <div class="tool-content">
          <Popover placement="top" trigger="manual" :value="sizePopoverType === 'pen'" @hide="sizePopoverType = ''">
            <template #content>
              <div class="setting">
                <div class="label">{{ $t('Commons.text.text_a689ve', {}) }}</div>
                <Slider class="size-slider" :min="4" :max="10" :step="2" v-model:value="penSize" />
              </div>
            </template>
            <div class="btn" :class="{ 'active': writingBoardModel === 'pen' }" v-tooltip="$t('Commons.text.text_km61')" @click="changeModel('pen')">
              <i-icon-park-outline:write class="icon" />
            </div>
          </Popover>
          <Popover placement="top" trigger="manual" :value="sizePopoverType === 'shape'" @hide="sizePopoverType = ''">
            <template #content>
              <div class="setting shape">
                <div class="shapes">
                  <i-icon-park-outline:square class="icon" :class="{ 'active': shapeType === 'rect' }" @click="shapeType = 'rect'" />
                  <i-icon-park-outline:round class="icon" :class="{ 'active': shapeType === 'circle' }" @click="shapeType = 'circle'" />
                  <i-icon-park-outline:arrow-right class="icon" :class="{ 'active': shapeType === 'arrow' }" @click="shapeType = 'arrow'" />
                </div>
                <Divider type="vertical" />
                <div class="label">{{ $t('Commons.text.text_a689ve', {}) }}</div>
                <Slider class="size-slider" :min="2" :max="8" :step="2" v-model:value="shapeSize" />
              </div>
            </template>
            <div class="btn" :class="{ 'active': writingBoardModel === 'shape' }" v-tooltip="$t('Commons.text.text_guqc')" @click="changeModel('shape')">
              <i-icon-park-outline:graphic-design class="icon" />
            </div>
          </Popover>
          <Popover placement="top" trigger="manual" :value="sizePopoverType === 'mark'" @hide="sizePopoverType = ''">
            <template #content>
              <div class="setting">
                <div class="label">{{ $t('Commons.text.text_a689ve', {}) }}</div>
                <Slider class="size-slider" :min="16" :max="40" :step="4" v-model:value="markSize" />
              </div>
            </template>
            <div class="btn" :class="{ 'active': writingBoardModel === 'mark' }" v-tooltip="$t('Commons.text.text_jndsi')" @click="changeModel('mark')">
              <i-icon-park-outline:high-light class="icon" />
            </div>
          </Popover>
          <Popover placement="top" trigger="manual" :value="sizePopoverType === 'eraser'" @hide="sizePopoverType = ''">
            <template #content>
              <div class="setting">
                <div class="label">{{ $t('Commons.text.text_53jkcl', {}) }}</div>
                <Slider class="size-slider" :min="20" :max="200" :step="20" v-model:value="rubberSize" />
              </div>
            </template>
            <div class="btn" :class="{ 'active': writingBoardModel === 'eraser' }" v-tooltip="$t('Commons.text.text_g5o9l')" @click="changeModel('eraser')">
              <i-icon-park-outline:erase class="icon" />
            </div>
          </Popover>
          <div class="btn" v-tooltip="$t('Commons.text.text_ei0x3k')" @click="clearCanvas()">
            <i-icon-park-outline:clear class="icon" />
          </div>
          <div class="btn" :class="{ 'active': blackboard }" v-tooltip="$t('Commons.text.text_rky6')" @click="blackboard = !blackboard">
            <i-icon-park-outline:fill class="icon" />
          </div>
          <div class="colors">
            <div 
              class="color" 
              :class="{ 'active': color === writingBoardColor, 'white': color === '#ffffff' }"
              v-for="color in writingBoardColors"
              :key="color"
              :style="{ backgroundColor: color }"
              @click="changeColor(color)"
            ></div>
          </div>
        </div>
        <div class="btn close" v-tooltip="$t('Commons.text.text_awd1n7')" @click="closeWritingBoard()">
          <i-icon-park-outline:close class="icon" />
        </div>
      </div>
    </MoveablePanel>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref, watch, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { db } from '@/utils/database'

import WritingBoard from '@/components/WritingBoard.vue'
import MoveablePanel from '@/components/MoveablePanel.vue'
import Slider from '@/components/Slider.vue'
import Popover from '@/components/Popover.vue'
import Divider from '@/components//Divider.vue'

const AUDIENCE_SYNC_CHANNEL = 'pptist-audience-sync'

const writingBoardColors = ['#000000', '#ffffff', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c', '#ffff3a']

type WritingBoardModel = 'pen' | 'mark' | 'eraser' | 'shape'

withDefaults(defineProps<{
  slideWidth: number
  slideHeight: number
  left?: number
  top?: number
}>(), {
  left: -5,
  top: -5,
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { currentSlide } = storeToRefs(useSlidesStore())

const writingBoardRef = useTemplateRef<InstanceType<typeof WritingBoard>>('writingBoardRef')
const writingBoardColor = ref('#e2534d')
const writingBoardModel = ref<WritingBoardModel>('pen')
const blackboard = ref(false)
const sizePopoverType = ref<'' | WritingBoardModel>('')
const shapeType = ref<'rect' | 'circle' | 'arrow'>('rect')

const penSize = ref(6)
const markSize = ref(24)
const rubberSize = ref(80)
const shapeSize = ref(4)

const changeModel = (model: WritingBoardModel) => {
  writingBoardModel.value = model
  sizePopoverType.value = sizePopoverType.value === model ? '' : model
}

// 清除画布上的墨迹
const clearCanvas = () => {
  writingBoardRef.value!.clearCanvas()
  broadcastWritingBoard('')
}

// 修改画笔颜色，如果当前处于橡皮状态则先切换到画笔状态
const changeColor = (color: string) => {
  if (writingBoardModel.value === 'eraser') writingBoardModel.value = 'pen'
  writingBoardColor.value = color
}

// 观众视图同步频道
const syncChannel = new BroadcastChannel(AUDIENCE_SYNC_CHANNEL)

const broadcastWritingBoard = (dataURL: string) => {
  syncChannel.postMessage({ type: 'WRITING_BOARD_UPDATE', dataURL, blackboard: blackboard.value })
}

syncChannel.onmessage = ({ data }) => {
  if (data.type === 'REQUEST_WRITING_BOARD') {
    const dataURL = writingBoardRef.value?.getImageDataURL() || ''
    broadcastWritingBoard(dataURL)
  }
}

onUnmounted(() => {
  syncChannel.postMessage({ type: 'WRITING_BOARD_CLOSE' })
  syncChannel.close()
})

// 关闭写字板
const closeWritingBoard = () => {
  syncChannel.postMessage({ type: 'WRITING_BOARD_CLOSE' })
  emit('close')
}

// 打开画笔工具或切换页面时，将数据库中存储的墨迹绘制到画布上
watch(currentSlide, () => {
  db.writingBoardImgs.where('id').equals(currentSlide.value.id).toArray().then(ret => {
    const currentImg = ret[0]
    const dataURL = currentImg?.dataURL || ''
    writingBoardRef.value!.setImageDataURL(dataURL)
    broadcastWritingBoard(dataURL)
  })
}, { immediate: true })

// 黑板模式切换时同步
watch(blackboard, () => {
  const dataURL = writingBoardRef.value?.getImageDataURL() || ''
  broadcastWritingBoard(dataURL)
})

// 每次绘制完成后将绘制完的图片更新到数据库
const handleWritingEnd = () => {
  const dataURL = writingBoardRef.value!.getImageDataURL()
  if (!dataURL) return

  broadcastWritingBoard(dataURL)

  db.writingBoardImgs.where('id').equals(currentSlide.value.id).toArray().then(ret => {
    const currentImg = ret[0]
    if (currentImg) db.writingBoardImgs.update(currentImg, { dataURL })
    else db.writingBoardImgs.add({ id: currentSlide.value.id, dataURL })
  })
}
</script>

<style lang="scss" scoped>
.writing-board-tool {
  font-size: 12px;
  z-index: 10;
  @include absolute-0();

  .writing-board-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .tools {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tool-content {
    display: flex;
    align-items: center;
  }
  .btn {
    padding: 5px;
    margin-right: 5px; 
    border-radius: $borderRadius;
    cursor: pointer;

    &:hover {
      color: $themeColor;
    }
    &.active {
      background-color: rgba($color: $themeColor, $alpha: .5);
      color: #fff;
    }
    &.close {
      margin-right: 0;
      margin-left: 5px;
    }
  }
  .icon {
    font-size: 20px;
  }
  .colors {
    display: flex;
    padding: 0 5px;
  }
  .color {
    width: 16px;
    height: 16px;
    border-radius: $borderRadius;
    cursor: pointer;

    &:hover {
      transform: scale(1.15);
    }
    &.active {
      transform: scale(1.3);
    }
    &.white {
      border: 1px solid #f1f1f1; 
    }

    & + .color {
      margin-left: 8px;
    }
  }
}
.setting {
  width: 200px;
  display: flex;
  align-items: center;
  user-select: none;
  font-size: 13px;

  &.shape {
    width: 280px;
  }

  .shapes {
    display: flex;
    align-items: center;

    .icon {
      font-size: 20px;
      cursor: pointer;

      & + .icon {
        margin-left: 6px; 
      }

      &.active {
        color: $themeColor;
      }
    }
  }

  .label {
    width: 70px;
  }
  .size-slider {
    flex: 1;
  }
}
</style>