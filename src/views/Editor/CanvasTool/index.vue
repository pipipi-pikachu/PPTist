<template>
  <div class="canvas-tool">
    <div class="left-handler">
      <IconFont class="handler-item" type="icon-undo" />
      <IconFont class="handler-item" type="icon-redo" />
    </div>

    <div class="add-element-handler">
      <IconFont class="handler-item" type="icon-font-size" />
      <IconFont class="handler-item" type="icon-image" />
      <IconFont class="handler-item" type="icon-star" />
      <IconFont class="handler-item" type="icon-line" />
      <IconFont class="handler-item" type="icon-table" />
      <IconFont class="handler-item" type="icon-piechart" />
    </div>

    <div class="right-handler">
      <IconFont class="handler-item viewport-size" type="icon-minus" />
      <span class="text">100%</span>
      <IconFont class="handler-item viewport-size" type="icon-plus" />
      <IconFont class="handler-item viewport-size" type="icon-number" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'canvas-tool',
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
}
.handler-item {
  margin: 0 10px;
  cursor: pointer;
}
.right-handler {
  display: flex;
  align-items: center;

  .viewport-size {
    font-size: 12px;
    margin-top: -1px;
  }
}
</style>