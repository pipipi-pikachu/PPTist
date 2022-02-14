<template>
  <div class="writing-board-tool">
    <teleport to="body">
      <WritingBoard 
        ref="writingBoardRef" 
        :color="writingBoardColor" 
        :blackboard="blackboard" 
        :model="writingBoardModel"
      />
    </teleport>

    <div class="tools">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="画笔">
        <div class="btn" :class="{ 'active': writingBoardModel === 'pen' }" @click="changePen()"><IconWrite class="icon" /></div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="橡皮擦">
        <div class="btn" :class="{ 'active': writingBoardModel === 'eraser' }" @click="changeEraser()"><IconErase class="icon" /></div>
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
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="关闭画笔">
        <div class="btn" @click="closeWritingBoard()"><IconClose class="icon" /></div>
      </Tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import WritingBoard from '@/components/WritingBoard.vue'

const writingBoardColors = ['#000000', '#ffffff', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c']

export default defineComponent({
  name: 'writing-board-tool',
  emits: ['close'],
  components: {
    WritingBoard,
  },
  setup(props, { emit }) {
    const writingBoardRef = ref()
    const writingBoardColor = ref('#e2534d')
    const writingBoardModel = ref<'pen' | 'eraser'>('pen')
    const blackboard = ref(false)

    // 切换到画笔状态
    const changePen = () => {
      writingBoardModel.value = 'pen'
    }

    // 切换到橡皮状态
    const changeEraser = () => {
      writingBoardModel.value = 'eraser'
    }

    // 清除画布上的墨迹
    const clearCanvas = () => {
      writingBoardRef.value.clearCanvas()
    }

    // 修改画笔颜色，如果当前不处于画笔状态则先切换到画笔状态
    const changeColor = (color: string) => {
      if (writingBoardModel.value !== 'pen') writingBoardModel.value = 'pen'
      writingBoardColor.value = color
    }
    
    // 关闭写字板
    const closeWritingBoard = () => {
      emit('close')
    }

    return {
      writingBoardRef,
      writingBoardColors,
      writingBoardColor,
      writingBoardModel,
      blackboard,
      changePen,
      changeEraser,
      clearCanvas,
      changeColor,
      closeWritingBoard,
    }
  },
})
</script>

<style lang="scss" scoped>
.writing-board-tool {
  font-size: 12px;

  .tools {
    height: 50px;
    position: fixed;
    bottom: 5px;
    left: 5px;
    z-index: 11;
    padding: 12px;
    background-color: #eee;
    border-radius: $borderRadius;
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