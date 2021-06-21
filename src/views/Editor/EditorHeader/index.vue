<template>
  <div class="editor-header">
    <div class="left">
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconEdit /> <span class="text">编辑</span></div>
        <template #overlay>
          <Menu>
            <MenuItem @click="undo()">撤销</MenuItem>
            <MenuItem @click="redo()">重做</MenuItem>
            <MenuItem @click="createSlide()">添加页面</MenuItem>
            <MenuItem @click="deleteSlide()">删除页面</MenuItem>
            <MenuItem @click="toggleGridLines()">{{ showGridLines ? '关闭网格线' : '打开网格线' }}</MenuItem>
            <MenuItem @click="resetSlides()">重置幻灯片</MenuItem>
            <MenuItem @click="exportDialogVisible = true">导出 JSON</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconPpt /> <span class="text">演示</span></div>
        <template #overlay>
          <Menu>
            <MenuItem @click="enterScreeningFromStart()">从头开始</MenuItem>
            <MenuItem @click="enterScreening()">从当前页开始</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconHelpcenter /> <span class="text">帮助</span></div>
        <template #overlay>
          <Menu>
            <MenuItem @click="goIssues()">意见反馈</MenuItem>
            <MenuItem @click="hotkeyDrawerVisible = true">快捷键</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </div>

    <div class="right">
      <Tooltip :mouseLeaveDelay="0" title="幻灯片放映">
        <div class="menu-item" @click="enterScreening()">
          <IconPpt size="18" fill="#666" style="margin-top: 2px;" />
        </div>
      </Tooltip>
      <a href="https://github.com/pipipi-pikachu/PPTist" target="_blank">
        <div class="menu-item"><IconGithub size="18" fill="#666" /></div>
      </a>
    </div>

    <Drawer
      width="320"
      placement="right"
      :visible="hotkeyDrawerVisible"
      @close="hotkeyDrawerVisible = false"
    >
      <HotkeyDoc />
    </Drawer>

    <Modal
      v-model:visible="exportDialogVisible" 
      :footer="null" 
      centered
      :closable="false"
      :width="680"
      destroyOnClose
    >
      <ExportDialog @close="exportDialogVisible = false"/>
    </Modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { MutationTypes, useStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import HotkeyDoc from './HotkeyDoc.vue'
import ExportDialog from './ExportDialog.vue'

export default defineComponent({
  name: 'editor-header',
  components: {
    HotkeyDoc,
    ExportDialog,
  },
  setup() {
    const store = useStore()

    const { enterScreening, enterScreeningFromStart } = useScreening()
    const { createSlide, deleteSlide, resetSlides } = useSlideHandler()
    const { redo, undo } = useHistorySnapshot()

    const showGridLines = computed(() => store.state.showGridLines)
    const toggleGridLines = () => {
      store.commit(MutationTypes.SET_GRID_LINES_STATE, !showGridLines.value)
    }

    const hotkeyDrawerVisible = ref(false)
    const exportDialogVisible = ref(false)

    const goIssues = () => {
      window.open('https://github.com/pipipi-pikachu/PPTist/issues')
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
      resetSlides,
      hotkeyDrawerVisible,
      exportDialogVisible,
      goIssues,
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
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  transition: background-color $transitionDelay;
  cursor: pointer;

  .text {
    margin-left: 4px;
  }
}

.left .menu-item:hover {
  background-color: $lightGray;
}
</style>