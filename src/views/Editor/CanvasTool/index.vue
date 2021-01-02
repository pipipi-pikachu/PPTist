<template>
  <div class="canvas-tool">
    <div class="left-handler">
      <UndoOutlined class="handler-item" :class="{ 'disable': !canUndo }" @click="undo()" />
      <RedoOutlined class="handler-item" :class="{ 'disable': !canRedo }" @click="redo()" />
    </div>

    <div class="add-element-handler">
      <FontSizeOutlined class="handler-item" @click="createElement('text')" />
      <FileInput @change="files => insertImageElement(files)">
        <PictureOutlined class="handler-item" />
      </FileInput>
      <StarOutlined class="handler-item" @click="createElement('shape')" />
      <LineOutlined class="handler-item" @click="createElement('line')" />
      <TableOutlined class="handler-item" />
      <PieChartOutlined class="handler-item" />
    </div>

    <div class="right-handler">
      <MinusOutlined class="handler-item viewport-size" @click="scaleCanvas('-')" />
      <span class="text">{{canvasScalePercentage}}</span>
      <PlusOutlined class="handler-item viewport-size" @click="scaleCanvas('+')" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { getImageDataURL } from '@/utils/image'
import useScaleCanvas from '@/hooks/useScaleCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useCreateElement from '@/hooks/useCreateElement'

import FileInput from '@/components/FileInput.vue'
import {
  UndoOutlined,
  RedoOutlined,
  FontSizeOutlined,
  PictureOutlined,
  StarOutlined,
  LineOutlined,
  TableOutlined,
  PieChartOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'

export default defineComponent({
  name: 'canvas-tool',
  components: {
    FileInput,
    UndoOutlined,
    RedoOutlined,
    FontSizeOutlined,
    PictureOutlined,
    StarOutlined,
    LineOutlined,
    TableOutlined,
    PieChartOutlined,
    MinusOutlined,
    PlusOutlined,
  },
  setup() {
    const store = useStore<State>()
    const canvasScale = computed(() => store.state.canvasScale)
    const canUndo = computed(() => store.getters.canUndo)
    const canRedo = computed(() => store.getters.canRedo)

    const canvasScalePercentage = computed(() => parseInt(canvasScale.value * 100 + '') + '%')

    const { scaleCanvas } = useScaleCanvas()
    const { redo, undo } = useHistorySnapshot()

    const { createImageElement } = useCreateElement()

    const insertImageElement = (files: File[]) => {
      const imageFile = files[0]
      if(!imageFile) return
      getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
    }

    const createElement = (type: string) => {
      store.commit(MutationTypes.SET_CREATING_ELEMENT_TYPE, type)
    }

    return {
      scaleCanvas,
      canvasScalePercentage,
      canUndo,
      canRedo,
      redo,
      undo,
      insertImageElement,
      createElement,
    }
  },
})
</script>

<style lang="scss" scoped>
.canvas-tool {
  position: relative;
  border-bottom: 1px solid #eee;
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
}
.handler-item {
  margin: 0 10px;
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
  }

  .viewport-size {
    font-size: 12px;
    margin-top: -1px;
  }
}
</style>