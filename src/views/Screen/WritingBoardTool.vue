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
        @end="hanldeWritingEnd()"
      />
    </div>

    <MoveablePanel 
      class="tools-panel" 
      :width="520" 
      :height="50"
      :left="left" 
      :top="top"
      :moveable="sizePopoverType === ''"
    >
      <div class="tools" @mousedown.stop>
        <div class="tool-content">
          <Popover trigger="manual" :value="sizePopoverType === 'pen'">
            <template #content>
              <div class="size">
                <div class="label">墨迹粗细：</div>
                <Slider class="size-slider" :min="4" :max="10" :step="2" v-model:value="penSize" />
              </div>
            </template>
            <div class="btn" :class="{ 'active': writingBoardModel === 'pen' }" v-tooltip="'画笔'" @click="changeModel('pen')">
              <IconWrite class="icon" />
            </div>
          </Popover>
          <Popover trigger="manual" :value="sizePopoverType === 'mark'">
            <template #content>
              <div class="size">
                <div class="label">墨迹粗细：</div>
                <Slider class="size-slider" :min="16" :max="40" :step="4" v-model:value="markSize" />
              </div>
            </template>
            <div class="btn" :class="{ 'active': writingBoardModel === 'mark' }" v-tooltip="'荧光笔'" @click="changeModel('mark')">
              <IconHighLight class="icon" />
            </div>
          </Popover>
          <Popover trigger="manual" :value="sizePopoverType === 'eraser'">
            <template #content>
              <div class="size">
                <div class="label">橡皮大小：</div>
                <Slider class="size-slider" :min="20" :max="200" :step="20" v-model:value="rubberSize" />
              </div>
            </template>
            <div class="btn" :class="{ 'active': writingBoardModel === 'eraser' }" v-tooltip="'橡皮擦'" @click="changeModel('eraser')">
              <IconErase class="icon" />
            </div>
          </Popover>
          <div class="btn" v-tooltip="'清除墨迹'" @click="clearCanvas()">
            <IconClear class="icon" />
          </div>
          <div class="btn" :class="{ 'active': blackboard }" v-tooltip="'黑板'" @click="blackboard = !blackboard">
            <IconFill class="icon" />
          </div>
          <div class="colors">
            <div 
              class="color" 
              :class="{ 'active': color === writingBoardColor }"
              v-for="color in writingBoardColors"
              :key="color"
              :style="{ backgroundColor: color }"
              @click="changeColor(color)"
            ></div>
          </div>
        </div>
        <div class="btn" v-tooltip="'关闭画笔'" @click="closeWritingBoard()">
          <IconClose class="icon" />
        </div>
      </div>
    </MoveablePanel>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { db } from '@/utils/database'

import WritingBoard from '@/components/WritingBoard.vue'
import MoveablePanel from '@/components/MoveablePanel.vue'
import Slider from '@/components/Slider.vue'
import Popover from '@/components/Popover.vue'

const writingBoardColors = ['#000000', '#ffffff', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c', '#ffff3a']

type WritingBoardModel = 'pen' | 'mark' | 'eraser'

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

const writingBoardRef = ref<InstanceType<typeof WritingBoard>>()
const writingBoardColor = ref('#e2534d')
const writingBoardModel = ref<WritingBoardModel>('pen')
const blackboard = ref(false)
const sizePopoverType = ref<'' | WritingBoardModel>('')

const penSize = ref(6)
const markSize = ref(24)
const rubberSize = ref(80)

const changeModel = (model: WritingBoardModel) => {
  if (writingBoardModel.value === model) {
    sizePopoverType.value = sizePopoverType.value === model ? '' : model
  }
  else {
    if (sizePopoverType.value) sizePopoverType.value = ''
    writingBoardModel.value = model
  }
}

// 清除画布上的墨迹
const clearCanvas = () => {
  writingBoardRef.value!.clearCanvas()
}

// 修改画笔颜色，如果当前处于橡皮状态则先切换到画笔状态
const changeColor = (color: string) => {
  if (writingBoardModel.value === 'eraser') writingBoardModel.value = 'pen'
  writingBoardColor.value = color
}

// 关闭写字板
const closeWritingBoard = () => {
  emit('close')
}

// 打开画笔工具或切换页面时，将数据库中存储的墨迹绘制到画布上
watch(currentSlide, () => {
  db.writingBoardImgs.where('id').equals(currentSlide.value.id).toArray().then(ret => {
    const currentImg = ret[0]
    writingBoardRef.value!.setImageDataURL(currentImg?.dataURL || '')
  })
}, { immediate: true })

// 每次绘制完成后将绘制完的图片更新到数据库
const hanldeWritingEnd = () => {
  const dataURL = writingBoardRef.value!.getImageDataURL()
  if (!dataURL) return

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
    padding: 5px 10px;
    cursor: pointer;

    &:hover {
      color: $themeColor;
    }
    &.active {
      background-color: rgba($color: $themeColor, $alpha: .5);
      color: #fff;
    }
  }
  .icon {
    font-size: 20px;
  }
  .colors {
    display: flex;
    padding: 0 10px;
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

    & + .color {
      margin-left: 8px;
    }
  }
}
.size {
  width: 200px;
  display: flex;
  align-items: center;
  user-select: none;
  font-size: 13px;

  .label {
    width: 70px;
  }
  .size-slider {
    flex: 1;
  }
}
</style>