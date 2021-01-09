<template>
  <div class="canvas-tool">
    <div class="left-handler">
      <IconFont type="icon-undo" class="handler-item" :class="{ 'disable': !canUndo }" @click="undo()" />
      <IconFont type="icon-redo" class="handler-item" :class="{ 'disable': !canRedo }" @click="redo()" />
    </div>

    <div class="add-element-handler">
      <IconFont type="icon-font-size" class="handler-item" @click="drawText()" />
      <FileInput @change="files => insertImageElement(files)">
        <IconFont type="icon-image" class="handler-item" />
      </FileInput>
      <Popover trigger="click" v-model:visible="isOpenShapePool">
        <template #content>
          <ShapePool @select="shape => drawShape(shape)" />
        </template>
        <IconFont type="icon-star" class="handler-item" />
      </Popover>
      <Popover trigger="click" v-model:visible="isOpenLinePool">
        <template #content>
          <LinePool @select="line => drawLine(line)" />
        </template>
        <IconFont type="icon-line" class="handler-item" />
      </Popover>
      <IconFont type="icon-table" class="handler-item" />
      <IconFont type="icon-piechart" class="handler-item" />
    </div>

    <div class="right-handler">
      <IconFont type="icon-minus" class="handler-item viewport-size" @click="scaleCanvas('-')" />
      <span class="text">{{canvasScalePercentage}}</span>
      <IconFont type="icon-plus" class="handler-item viewport-size" @click="scaleCanvas('+')" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { getImageDataURL } from '@/utils/image'
import { ShapePoolItem } from '@/configs/shapes'
import { LinePoolItem } from '@/configs/lines'
import useScaleCanvas from '@/hooks/useScaleCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useCreateElement from '@/hooks/useCreateElement'

import ShapePool from './ShapePool.vue'
import LinePool from './LinePool.vue'

export default defineComponent({
  name: 'canvas-tool',
  components: {
    ShapePool,
    LinePool,
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

    const isOpenShapePool = ref(false)
    const isOpenLinePool = ref(false)
    const drawText = () => {
      store.commit(MutationTypes.SET_CREATING_ELEMENT, {
        type: 'text',
        data: null,
      })
    }
    const drawShape = (shape: ShapePoolItem) => {
      store.commit(MutationTypes.SET_CREATING_ELEMENT, {
        type: 'shape',
        data: shape,
      })
      isOpenShapePool.value = false
    }
    const drawLine = (line: LinePoolItem) => {
      store.commit(MutationTypes.SET_CREATING_ELEMENT, {
        type: 'line',
        data: line,
      })
      isOpenLinePool.value = false
    }

    return {
      scaleCanvas,
      canvasScalePercentage,
      canUndo,
      canRedo,
      redo,
      undo,
      insertImageElement,
      isOpenShapePool,
      isOpenLinePool,
      drawText,
      drawShape,
      drawLine,
    }
  },
})
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