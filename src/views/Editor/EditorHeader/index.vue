<template>
  <div class="editor-header">
    <div class="left">
      <div class="menu-item"><IconSeoFolder /> 文件</div>
      <div class="menu-item"><IconEdit /> 编辑</div>
      <div class="menu-item"><IconSettingOne /> 设置</div>
      <div class="menu-item"><IconSlide /> 演示</div>
      <div class="menu-item"><IconHelpcenter /> 帮助</div>
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