<template>
  <div class="writing-board-tool">
    <teleport to="body">
      <WritingBoard 
        ref="writingBoardRef" 
        :color="writingBoardColor" 
        :model="writingBoardModel"
      />
    </teleport>

    <div class="tools">
      <div class="btn" :class="{ 'active': writingBoardModel === 'pen' }" @click="changePen()">画笔</div>
      <div class="btn" :class="{ 'active': writingBoardModel === 'eraser' }" @click="changeEraser()">橡皮</div>
      <div class="btn" @click="clearCanvas()">清除墨迹</div>
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
      <div class="btn" @click="closeWritingBoard()">退出画笔</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import WritingBoard from '@/components/WritingBoard.vue'

const writingBoardColors = ['#000000', '#ffffff', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c']

export default defineComponent({
  name: 'writing-board-tool',
  components: {
    WritingBoard,
  },
  setup(props, { emit }) {
    const writingBoardRef = ref()
    const writingBoardColor = ref('#e2534d')
    const writingBoardModel = ref('pen')

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
    bottom: 0;
    left: 0;
    z-index: 11;
    padding: 12px;
    background-color: #fff;
    display: flex;
    align-items: center;
  }
  .btn {
    padding: 6px 10px;
    cursor: pointer;

    &:hover, &.active {
      background-color: rgba($color: $themeColor, $alpha: .2);
    }
  }
  .colors {
    display: flex;
    padding: 0 10px;
  }
  .color {
    width: 15px;
    height: 15px;
    outline: 1px solid #ccc;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }
    &.active {
      outline: 2px solid $themeColor;
    }

    & + .color {
      margin-left: 5px;
    }
  }
}
</style>