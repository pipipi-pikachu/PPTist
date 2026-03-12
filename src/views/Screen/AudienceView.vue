<template>
  <div class="audience-view">
    <ScreenSlideList
      :slideWidth="slideWidth"
      :slideHeight="slideHeight"
      :animationIndex="animationIndex"
      :turnSlideToId="turnSlideToId"
      :manualExitFullscreen="() => {}"
    />
    <div class="writing-board-overlay" v-if="writingBoardVisible">
      <div
        class="writing-board-content"
        :style="{
          width: slideWidth + 'px',
          height: slideHeight + 'px',
        }"
      >
        <div class="blackboard" v-if="writingBoardBlackboard"></div>
        <img v-if="writingBoardDataURL" :src="writingBoardDataURL" />
      </div>
    </div>
    <div
      v-if="laserPenVisible"
      class="laser-pen"
      :style="{
        left: `calc(50% - ${slideWidth / 2}px + ${laserPenX * slideWidth}px)`,
        top: `calc(50% - ${slideHeight / 2}px + ${laserPenY * slideHeight}px)`,
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, nextTick, ref } from 'vue'
import type { Slide } from '@/types/slides'
import { useSlidesStore } from '@/store'
import useExecPlay from './hooks/useExecPlay'
import useSlideSize from './hooks/useSlideSize'
import ScreenSlideList from './ScreenSlideList.vue'

const slidesStore = useSlidesStore()
const { slideWidth, slideHeight } = useSlideSize()
const { execNext, execPrev, turnSlideToIndex, turnSlideToId, animationIndex, restoreAnimationState } = useExecPlay()

// 画板覆盖层状态
const writingBoardVisible = ref(false)
const writingBoardBlackboard = ref(false)
const writingBoardDataURL = ref('')

// 激光笔状态
const laserPenVisible = ref(false)
const laserPenX = ref(0)
const laserPenY = ref(0)

// 建立接收频道，向主窗口请求当前状态，并处理同步指令
const syncChannel = new BroadcastChannel('pptist-audience-sync')

onMounted(() => {
  syncChannel.postMessage({ type: 'REQUEST_STATE' })
  syncChannel.postMessage({ type: 'REQUEST_WRITING_BOARD' })

  syncChannel.onmessage = ({ data }) => {
    const msg = data as {
      type: string
      index?: number
      id?: string
      slideIndex?: number
      animationIndex?: number
      slides?: Slide[]
      dataURL?: string
      blackboard?: boolean
      x?: number
      y?: number
    }
    if (msg.type === 'EXEC_NEXT') execNext()
    else if (msg.type === 'EXEC_PREV') execPrev()
    else if (msg.type === 'TURN_TO_INDEX' && msg.index !== undefined) turnSlideToIndex(msg.index)
    else if (msg.type === 'TURN_TO_ID' && msg.id !== undefined) turnSlideToId(msg.id)
    else if (msg.type === 'INIT_STATE' && msg.slideIndex !== undefined) {
      // 先用演讲者的实际幻灯片数据覆盖 mock 数据，确保动画序列等编辑内容一致
      if (msg.slides) slidesStore.setSlides(msg.slides)
      turnSlideToIndex(msg.slideIndex)
      if (msg.animationIndex !== undefined) {
        animationIndex.value = msg.animationIndex
        // 等待 DOM 渲染完成后，补齐已执行过的退场动画 CSS 终态
        nextTick(() => restoreAnimationState(msg.animationIndex!))
      }
    }
    else if (msg.type === 'WRITING_BOARD_UPDATE') {
      writingBoardVisible.value = true
      writingBoardDataURL.value = msg.dataURL || ''
      writingBoardBlackboard.value = msg.blackboard || false
    }
    else if (msg.type === 'WRITING_BOARD_CLOSE') {
      writingBoardVisible.value = false
      writingBoardDataURL.value = ''
    }
    else if (msg.type === 'LASER_PEN_MOVE' && msg.x !== undefined && msg.y !== undefined) {
      laserPenVisible.value = true
      laserPenX.value = msg.x
      laserPenY.value = msg.y
    }
    else if (msg.type === 'LASER_PEN_OFF') {
      laserPenVisible.value = false
    }
    else if (msg.type === 'EXIT') {
      window.close()
    }
  }
})

onUnmounted(() => {
  syncChannel.close()
})
</script>

<style lang="scss" scoped>
.audience-view {
  width: 100%;
  height: 100%;
  background: #1d1d1d;
}
.writing-board-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 8;

  .writing-board-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .blackboard {
    width: 100%;
    height: 100%;
    background-color: #0f392b;
  }
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.laser-pen {
  position: absolute;
  width: 40px;
  height: 40px;
  margin-left: -20px;
  margin-top: -20px;
  pointer-events: none;
  z-index: 9;
  background-image: url(data:image/png;base64,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);
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
