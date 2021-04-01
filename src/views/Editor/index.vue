<template>
  <div class="pptist-editor">
    <EditorHeader class="layout-header" />
    <div class="layout-content">
      <Thumbnails class="layout-content-left" />
      <div class="layout-content-center">
        <CanvasTool class="center-top" />
        <Canvas class="center-body" />
        <Remark class="center-bottom" />
      </div>
      <Toolbar class="layout-content-right" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import useGlobalHotkey from '@/hooks/useGlobalHotkey'
import usePasteEvent from '@/hooks/usePasteEvent'

import EditorHeader from './EditorHeader/index.vue'
import Canvas from './Canvas/index.vue'
import CanvasTool from './CanvasTool/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import Toolbar from './Toolbar/index.vue'
import Remark from './Remark/index.vue'

export default defineComponent({
  name: 'editor',
  components: {
    EditorHeader,
    Canvas,
    CanvasTool,
    Thumbnails,
    Toolbar,
    Remark,
  },
  setup() {
    useGlobalHotkey()
    usePasteEvent()
  },
})
</script>

<style lang="scss" scoped>
.pptist-editor {
  height: 100%;
}
.layout-header {
  height: 40px;
}
.layout-content {
  height: calc(100% - 40px);
  display: flex;
}
.layout-content-left {
  width: 160px;
  height: 100%;
  flex-shrink: 0;
}
.layout-content-center {
  width: calc(100% - 160px - 260px);

  .center-top {
    height: 40px;
  }
  .center-body {
    height: calc(100% - 40px - 40px);
  }
  .center-bottom {
    height: 40px;
  }
}
.layout-content-right {
  width: 260px;
  height: 100%;
}
</style>