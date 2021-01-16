<template>
  <div class="editor-header">
    <div class="left">
      <div class="menu-item">文件</div>
      <div class="menu-item">编辑</div>
      <div class="menu-item">设置</div>
      <div class="menu-item">演示</div>
      <div class="menu-item">帮助</div>
    </div>

    <div class="right">
      <div class="menu-item icon">
        <IconGithub />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'editor-header',
})
</script>

<style lang="scss" scoped>
.editor-header {
  background-color: #fff;
  user-select: none;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.left, .right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-item {
  font-size: 13px;
  margin: 0 10px;
  cursor: pointer;

  &.icon {
    font-size: 20px;
    color: #666;
  }
}
</style>