<template>
  <div class="editor-header">
    <div class="left">
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconFolderClose /> <span class="text">文件</span></div>
        <template #overlay>
          <Menu>
            <FileInput accept=".pptist"  @change="files => importSpecificFile(files)">
              <MenuItem>导入 pptist 文件</MenuItem>
            </FileInput>
            <MenuItem @click="setDialogForExport('pptist')">导出 pptist 文件</MenuItem>
            <MenuItem @click="setDialogForExport('pptx')">导出 PPTX</MenuItem>
            <MenuItem @click="setDialogForExport('image')">导出图片</MenuItem>
            <MenuItem @click="setDialogForExport('json')">导出 JSON</MenuItem>
            <MenuItem @click="setDialogForExport('pdf')">打印 / 导出 PDF</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconEdit /> <span class="text">编辑</span></div>
        <template #overlay>
          <Menu>
            <MenuItem @click="undo()">撤销</MenuItem>
            <MenuItem @click="redo()">重做</MenuItem>
            <MenuItem @click="createSlide()">添加页面</MenuItem>
            <MenuItem @click="deleteSlide()">删除页面</MenuItem>
            <MenuItem @click="toggleGridLines()">{{ gridLineSize ? '关闭网格线' : '打开网格线' }}</MenuItem>
            <MenuItem @click="toggleRuler()">{{ showRuler ? '关闭标尺' : '打开标尺' }}</MenuItem>
            <MenuItem @click="resetSlides()">重置幻灯片</MenuItem>
            <MenuItem @click="openSelectPanel()">{{ showSelectPanel ? '关闭选择面板' : '打开选择面板' }}</MenuItem>
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
            <MenuItem @click="goLink('https://github.com/pipipi-pikachu/PPTist/issues')">意见反馈</MenuItem>
            <MenuItem @click="goLink('https://github.com/pipipi-pikachu/PPTist/blob/master/doc/Q&A.md')">常见问题</MenuItem>
            <MenuItem @click="hotkeyDrawerVisible = true">快捷键</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </div>

    <div class="right">
      <Tooltip :mouseLeaveDelay="0" title="导出">
        <div class="menu-item" @click="setDialogForExport('pptx')">
          <IconShare size="18" fill="#666" />
        </div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" title="幻灯片放映">
        <div class="menu-item" @click="enterScreening()">
          <IconPpt size="19" fill="#666" style="margin-top: 1px;" />
        </div>
      </Tooltip>
      <a href="https://github.com/pipipi-pikachu/PPTist" target="_blank">
        <div class="menu-item"><IconGithub size="18" fill="#666" /></div>
      </a>
    </div>

    <Drawer
      width="320"
      placement="right"
      :closable="false"
      :visible="hotkeyDrawerVisible"
      @close="hotkeyDrawerVisible = false"
    >
      <HotkeyDoc />
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useExport from '@/hooks/useExport'

import HotkeyDoc from './HotkeyDoc.vue'

const mainStore = useMainStore()
const { gridLineSize, showRuler, showSelectPanel } = storeToRefs(mainStore)

const { enterScreening, enterScreeningFromStart } = useScreening()
const { createSlide, deleteSlide, resetSlides } = useSlideHandler()
const { redo, undo } = useHistorySnapshot()
const { importSpecificFile } = useExport()

const setDialogForExport = mainStore.setDialogForExport

const toggleGridLines = () => {
  mainStore.setGridLineSize(gridLineSize.value ? 0 : 50)
}

const toggleRuler = () => {
  mainStore.setRulerState(!showRuler.value)
}

const openSelectPanel = () => {
  if (!showSelectPanel.value) mainStore.setSelectPanelState(true)
  else mainStore.setSelectPanelState(false)
}

const hotkeyDrawerVisible = ref(false)

const goLink = (url: string) => window.open(url)
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
  cursor: pointer;

  .text {
    margin-left: 4px;
  }
}

.left .menu-item:hover {
  background-color: #f9f9f9;
}
</style>