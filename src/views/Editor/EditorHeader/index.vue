<template>
  <div class="editor-header">
    <div class="left">
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconSeoFolder /> 文件</div>
        <template #overlay>
          <Menu>
            <MenuItem>重置幻灯片</MenuItem>
            <MenuItem>缓存幻灯片</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconEdit /> 编辑</div>
        <template #overlay>
          <Menu>
            <MenuItem @click="undo()">撤销</MenuItem>
            <MenuItem @click="redo()">重做</MenuItem>
            <MenuItem @click="createSlide()">添加页面</MenuItem>
            <MenuItem @click="deleteSlide()">删除页面</MenuItem>
            <MenuItem @click="toggleGridLines()">{{ showGridLines ? '关闭网格线' : '打开网格线' }}</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconSlide /> 演示</div>
        <template #overlay>
          <Menu>
            <MenuItem @click="enterScreeningFromStart()">从头开始</MenuItem>
            <MenuItem @click="enterScreening()">从当前页开始</MenuItem>
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
import { computed, defineComponent } from 'vue'
import { MutationTypes, useStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default defineComponent({
  name: 'editor-header',
  setup() {
    const store = useStore()

    const { enterScreening, enterScreeningFromStart } = useScreening()
    const { createSlide, deleteSlide } = useSlideHandler()
    const { redo, undo } = useHistorySnapshot()

    const showGridLines = computed(() => store.state.showGridLines)
    const toggleGridLines = () => {
      store.commit(MutationTypes.SET_GRID_LINES_STATE, !showGridLines.value)
    }

    return {
      enterScreening,
      enterScreeningFromStart,
      createSlide,
      deleteSlide,
      redo,
      undo,
      toggleGridLines,
      showGridLines,
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