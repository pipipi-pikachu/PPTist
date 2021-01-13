<template>
  <teleport to="body">
    <WritingBoard 
      ref="writingBoardRef" 
      :color="writingBoardColor" 
      :model="writingBoardModel" 
      v-if="visible" 
    />
  </teleport>

  <div class="writing-board-tool">
    <div class="btn" @click="writingBoardModel = 'pen'; close()">画笔</div>
    <div class="btn" @click="writingBoardModel = 'eraser'; close()">橡皮擦</div>
    <div class="btn" @click="writingBoardRef.clearCanvas(); close()">擦除所有墨迹</div>
    <div class="btn" @click="closeWritingBoard()">关闭画笔</div>
    <div class="colors">
      <div 
        class="color" 
        :class="{ 'active': color === writingBoardColor }"
        v-for="color in writingBoardColors" 
        :key="color"
        :style="{ backgroundColor: color }"
        @click="writingBoardColor = color; close()"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import WritingBoard from '@/components/WritingBoard.vue'

const writingBoardColors = ['#000000', '#ffffff', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c']

export default defineComponent({
  name: 'writing-board-tool',
  emits: ['close', 'update:visible'],
  components: {
    WritingBoard,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const writingBoardRef = ref()
    const writingBoardColor = ref('#e2534d')
    const writingBoardModel = ref('pen')

    const close = () => {
      emit('close')
    }

    const closeWritingBoard = () => {
      emit('update:visible', false)
      emit('close')
    }

    return {
      writingBoardRef,
      writingBoardColors,
      writingBoardColor,
      writingBoardModel,
      closeWritingBoard,
      close,
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
      background-color: #ccc;
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