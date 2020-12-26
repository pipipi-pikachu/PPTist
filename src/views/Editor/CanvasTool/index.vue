<template>
  <div class="canvas-tool">
    <div class="left-handler">
      <IconFont class="handler-item" :class="{ 'disable': !canUndo }" type="icon-undo" @click="undo()" />
      <IconFont class="handler-item" :class="{ 'disable': !canRedo }" type="icon-redo" @click="redo()" />
    </div>

    <div class="add-element-handler">
      <IconFont class="handler-item" type="icon-font-size" />
      <UploadInput @change="files => insertImageElement(files)">
        <IconFont class="handler-item" type="icon-image" />
      </UploadInput>
      <IconFont class="handler-item" type="icon-star" />
      <IconFont class="handler-item" type="icon-line" />
      <IconFont class="handler-item" type="icon-table" />
      <IconFont class="handler-item" type="icon-piechart" />
    </div>

    <div class="right-handler">
      <IconFont class="handler-item viewport-size" type="icon-minus" @click="scaleCanvas('-')" />
      <span class="text">{{canvasScalePercentage}}</span>
      <IconFont class="handler-item viewport-size" type="icon-plus" @click="scaleCanvas('+')" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { State } from '@/store'
import { getImageDataURL } from '@/utils/image'
import useScaleCanvas from '@/hooks/useScaleCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useCreateElement from '@/hooks/useCreateElement'

import UploadInput from '@/components/UploadInput.vue'

export default defineComponent({
  name: 'canvas-tool',
  components: {
    UploadInput,
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

    return {
      scaleCanvas,
      canvasScalePercentage,
      canUndo,
      canRedo,
      redo,
      undo,
      insertImageElement,
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