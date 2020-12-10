<template>
  <div class="editor">
    <EditorHeader class="layout-header" />
    <div class="layout-content">
      <Thumbnails class="layout-content-left" />
      <div class="layout-content-body">
        <CanvasTool />
        <Canvas />
      </div>
      <Toolbar class="layout-content-right" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import EditorHeader from './EditorHeader/index.vue'
import Canvas from './Canvas/index.vue'
import CanvasTool from './CanvasTool/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import Toolbar from './Toolbar/index.vue'

export default defineComponent({
  name: 'editor',
  components: {
    EditorHeader,
    Canvas,
    CanvasTool,
    Thumbnails,
    Toolbar,
  },
})
</script>

<style lang="scss" scoped>
.editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.layout-header {
  height: 40px;
}
.layout-content {
  flex: 1;
  display: flex;
}
.layout-content-left {
  width: 180px;
  height: 100%;
}
.layout-content-body {
  flex: 1;
}
.layout-content-right {
  width: 260px;
  height: 100%;
}
</style>