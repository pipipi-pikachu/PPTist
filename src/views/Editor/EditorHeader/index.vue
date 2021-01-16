<template>
  <div class="editor-header">
    <div class="left">
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconSeoFolder /> 文件</div>
        <template #overlay>
          <Menu>
            <MenuItem>导出JSON文件</MenuItem>
            <MenuItem>保存到本地</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconEdit /> 编辑</div>
        <template #overlay>
          <Menu>
            <MenuItem>撤销</MenuItem>
            <MenuItem>重做</MenuItem>
            <MenuItem>添加页面</MenuItem>
            <MenuItem>删除页面</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconSlide /> 演示</div>
        <template #overlay>
          <Menu>
            <MenuItem>从头开始</MenuItem>
            <MenuItem>从当前页开始</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconHelpcenter /> 帮助</div>
        <template #overlay>
          <Menu>
            <MenuItem>开发文档</MenuItem>
            <MenuItem>常见使用问题</MenuItem>
            <MenuItem>快捷键</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </div>

    <div class="right">
      <Tooltip :mouseLeaveDelay="0" title="幻灯片放映">
        <div class="menu-item" @click="enterScreening()">
          <IconSlide size="18" fill="#666" style="margin-top: 2px;" />
        </div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" title="Github 仓库">
        <div class="menu-item"><IconGithub size="18" fill="#666" /></div>
      </Tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useScreening from '@/hooks/useScreening'

export default defineComponent({
  name: 'editor-header',
  setup() {
    const { enterScreening } = useScreening()

    return {
      enterScreening,
    }
  },
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
}
</style>