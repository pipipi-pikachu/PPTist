<template>
  <div class="editor-header">
    <div class="left">
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconFolderClose /> <span class="text">{{t('editorHeader.file')}}</span></div>
        <template #overlay>
          <Menu>
            <FileInput accept=".pptist"  @change="files => importSpecificFile(files)">
              <MenuItem>{{t('editorHeader.importpptist')}}</MenuItem>
            </FileInput>
            <FileInput accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"  @change="files => importPPTXFile(files)">
              <MenuItem>{{t('editorHeader.importpptx')}}（demo）</MenuItem>
            </FileInput>
            <MenuItem @click="setDialogForExport('pptx')">{{t('editorHeader.export')}}</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconEdit /> <span class="text">{{t('editorHeader.edit')}}</span></div>
        <template #overlay>
          <Menu>
            <MenuItem @click="undo()">{{t('editorHeader.undo')}}</MenuItem>
            <MenuItem @click="redo()">{{t('editorHeader.redo')}}</MenuItem>
            <MenuItem @click="createSlide()">{{t('editorHeader.createSlide')}}</MenuItem>
            <MenuItem @click="deleteSlide()">{{t('editorHeader.deleteSlide')}}</MenuItem>
            <MenuItem @click="toggleGridLines()">{{ gridLineSize ? t('editorHeader.turnGridOff') : t('editorHeader.turnGridOn') }}</MenuItem>
            <MenuItem @click="toggleRuler()">{{ showRuler ? t('editorHeader.turnRulerOff') : t('editorHeader.turnRulerOn') }}</MenuItem>
            <MenuItem @click="resetSlides()">{{t('editorHeader.resetSlides')}}</MenuItem>
            <MenuItem @click="openSelectPanel()">{{ showSelectPanel ? t('editorHeader.closeSelectionPanel') : t('editorHeader.openSelectionPanel') }}</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconPpt /> <span class="text">{{t('editorHeader.showSlides')}}</span></div>
        <template #overlay>
          <Menu>
            <MenuItem @click="enterScreeningFromStart()">{{t('editorHeader.fromStart')}}</MenuItem>
            <MenuItem @click="enterScreening()">{{t('editorHeader.fromCurrent')}}</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item"><IconHelpcenter /> <span class="text">{{t('editorHeader.help')}}</span></div>
        <template #overlay>
          <Menu>
            <MenuItem @click="goLink('https://github.com/pipipi-pikachu/PPTist/issues')">{{t('editorHeader.feedback')}}</MenuItem>
            <MenuItem @click="goLink('https://github.com/pipipi-pikachu/PPTist/blob/master/doc/Q&A.md')">{{t('editorHeader.QA')}}</MenuItem>
            <MenuItem @click="hotkeyDrawerVisible = true">{{t('editorHeader.hotkey')}}</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </div>

    <div class="right">
      <Tooltip :mouseLeaveDelay="0" :title="t('editorHeader.export')">
        <div class="menu-item" @click="setDialogForExport('pptx')">
          <IconShare size="18" fill="#666" />
        </div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :title="t('editorHeader.showSlides')">
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

    <FullscreenSpin :loading="exporting" :tip="t('editorHeader.importing')" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useImport from '@/hooks/useImport'
import usei18n from '@/hooks/usei18n'
import HotkeyDoc from './HotkeyDoc.vue'
import FileInput from '@/components/FileInput.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import {
  Tooltip,
  Dropdown,
  Menu,
  Drawer,
} from 'ant-design-vue'

const MenuItem = Menu.Item
const {t} = usei18n()
const mainStore = useMainStore()
const { gridLineSize, showRuler, showSelectPanel } = storeToRefs(mainStore)

const { enterScreening, enterScreeningFromStart } = useScreening()
const { createSlide, deleteSlide, resetSlides } = useSlideHandler()
const { redo, undo } = useHistorySnapshot()
const { importSpecificFile, importPPTXFile, exporting } = useImport()

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
