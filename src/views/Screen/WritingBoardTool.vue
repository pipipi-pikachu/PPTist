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
        @end="hanldeWritingEnd()"
      />
    </div>

    <MoveablePanel 
      class="tools-panel" 
      :width="520" 
      :height="50"
      :left="left" 
      :top="top"
    >
      <div class="tools">
        <div class="tool-content">
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="画笔">
            <div class="btn" :class="{ 'active': writingBoardModel === 'pen' }" @click="changeModel('pen')"><IconWrite class="icon" /></div>
          </Tooltip>
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="荧光笔">
            <div class="btn" :class="{ 'active': writingBoardModel === 'mark' }" @click="changeModel('mark')"><IconHighLight class="icon" /></div>
          </Tooltip>
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="橡皮擦">
            <div class="btn" :class="{ 'active': writingBoardModel === 'eraser' }" @click="changeModel('eraser')"><IconErase class="icon" /></div>
          </Tooltip>
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="清除墨迹">
            <div class="btn" @click="clearCanvas()"><IconClear class="icon" /></div>
          </Tooltip>
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="黑板">
            <div class="btn" :class="{ 'active': blackboard }" @click="blackboard = !blackboard"><IconFill class="icon" /></div>
          </Tooltip>
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
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="关闭画笔">
          <div class="btn" @click="closeWritingBoard()"><IconClose class="icon" /></div>
        </Tooltip>
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

const writingBoardColors = ['#000000', '#ffffff', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c', '#ffff3a']

type WritingBoardModel = 'pen' | 'mark' | 'eraser'

defineProps({
  slideWidth: {
    type: Number,
    required: true,
  },
  slideHeight: {
    type: Number,
    required: true,
  },
  left: {
    type: Number,
    default: -5,
  },
  top: {
    type: Number,
    default: -5,
  },
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { currentSlide } = storeToRefs(useSlidesStore())

const writingBoardRef = ref<typeof WritingBoard>()
const writingBoardColor = ref('#e2534d')
const writingBoardModel = ref<WritingBoardModel>('pen')
const blackboard = ref(false)

const changeModel = (model: WritingBoardModel) => {
  writingBoardModel.value = model
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
</style>