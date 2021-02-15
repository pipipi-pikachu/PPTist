<template>
  <div class="writing-board-tool">
    <teleport to="body">
      <WritingBoard 
        ref="writingBoardRef" 
        :color="writingBoardColor" 
        :model="writingBoardModel" 
        v-if="writingBoardVisible" 
        v-contextmenu="contextmenus"
      />
    </teleport>

    <div class="tools">
      <div class="btn" @click="changePen()">画笔</div>
      <div class="btn" @click="changeEraser()">橡皮擦</div>
      <div class="btn" @click="clearCanvas()">擦除所有墨迹</div>
      <div class="btn" @click="closeWritingBoard()">退出画笔</div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import WritingBoard from '@/components/WritingBoard.vue'
import { ContextmenuItem } from '@/components/Contextmenu/types'

const writingBoardColors = ['#000000', '#ffffff', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c']

export default defineComponent({
  name: 'writing-board-tool',
  components: {
    WritingBoard,
  },
  setup(props, { emit }) {
    const writingBoardRef = ref()
    const writingBoardVisible = ref(false)
    const writingBoardColor = ref('#e2534d')
    const writingBoardModel = ref('pen')

    // 切换到画笔状态
    const changePen = () => {
      if (!writingBoardVisible.value) writingBoardVisible.value = true
      writingBoardModel.value = 'pen'
      emit('close')
    }

    // 切换到橡皮状态
    const changeEraser = () => {
      writingBoardModel.value = 'eraser'
      emit('close')
    }

    // 清除画布上的墨迹
    const clearCanvas = () => {
      writingBoardRef.value.clearCanvas()
      emit('close')
    }

    // 修改画笔颜色，如果当前不处于画笔状态则先切换到画笔状态
    const changeColor = (color: string) => {
      if (writingBoardModel.value !== 'pen') writingBoardModel.value = 'pen'
      writingBoardColor.value = color
      emit('close')
    }
    
    // 关闭写字板
    const closeWritingBoard = () => {
      writingBoardVisible.value = false
      emit('close')
    }

    const contextmenus = (): ContextmenuItem[] => {
      return [
        {
          text: '画笔',
          handler: changePen,
          disable: writingBoardModel.value === 'pen',
        },
        {
          text: '橡皮擦',
          handler: changeEraser,
          disable: writingBoardModel.value === 'eraser',
        },
        {
          text: '擦除所有墨迹',
          handler: clearCanvas,
        },
        {
          text: '退出画笔',
          handler: closeWritingBoard,
        },
      ]
    }

    return {
      writingBoardRef,
      writingBoardVisible,
      writingBoardColors,
      writingBoardColor,
      writingBoardModel,
      changePen,
      changeEraser,
      clearCanvas,
      changeColor,
      closeWritingBoard,
      contextmenus,
    }
  },
})
</script>

<style lang="scss" scoped>
.writing-board-tool {
  font-size: 12px;

  .btn {
    padding: 3px 10px;
    margin: 0 -10px;
    margin-bottom: 3px;
    cursor: pointer;

    &:hover {
      background-color: rgba($color: $themeColor, $alpha: .2);
    }
  }
  .colors {
    display: flex;
    margin-top: 8px;
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