<template>
  <Popover trigger="click" placement="bottom-start" v-model:value="mainMenuVisible">
    <template #content>
      <FileInput v-if="fileMenuItems.includes('importPPTIST')" accept=".pptist"  @change="files => {
        importSpecificFile(files)
        mainMenuVisible = false
      }">
        <PopoverMenuItem>导入 pptist 文件</PopoverMenuItem>
      </FileInput>
      <FileInput v-if="fileMenuItems.includes('importPPTX')"
        accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"  @change="files => {
        importPPTXFile(files)
        mainMenuVisible = false
      }">
        <PopoverMenuItem>导入 pptx 文件（测试版）</PopoverMenuItem>
      </FileInput>
      <PopoverMenuItem v-if="fileMenuItems.includes('export')"
        @click="setDialogForExport('pptx')">导出文件</PopoverMenuItem>
      <PopoverMenuItem v-if="fileMenuItems.includes('resetSliders')"
       @click="resetSlides(); mainMenuVisible = false">重置幻灯片</PopoverMenuItem>
      <PopoverMenuItem v-if="fileMenuItems.includes('issues')"
       @click="goLink('https://github.com/pipipi-pikachu/PPTist/issues')">意见反馈</PopoverMenuItem>
      <PopoverMenuItem v-if="fileMenuItems.includes('qa')"
       @click="goLink('https://github.com/pipipi-pikachu/PPTist/blob/master/doc/Q&A.md')">常见问题</PopoverMenuItem>
      <PopoverMenuItem v-if="fileMenuItems.includes('hotkey')"
       @click="mainMenuVisible = false; hotkeyDrawerVisible = true">快捷键</PopoverMenuItem>
    </template>
    <div class="menu-item"><IconHamburgerButton class="icon" /></div>
  </Popover>
  <Drawer
    :width="320"
    v-model:visible="hotkeyDrawerVisible"
    placement="right"
  >
    <HotkeyDoc />
  </Drawer>

  <FullscreenSpin :loading="exporting" tip="正在导入..." />
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '../../store'
import useScreening from '../../hooks/useScreening'
import useImport from '../../hooks/useImport'
import useSlideHandler from '../../hooks/useSlideHandler'
import type { DialogForExportTypes } from '../../types/export'

import FileInput from '../../components/FileInput.vue'
import FullscreenSpin from '../../components/FullscreenSpin.vue'
import Drawer from '../../components/Drawer.vue'
import Input from '../../components/Input.vue'
import Popover from '../../components/Popover.vue'
import PopoverMenuItem from '../../components/PopoverMenuItem.vue'
import HotkeyDoc from './HotkeyDoc.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { title } = storeToRefs(slidesStore)
const { importSpecificFile, importPPTXFile, exporting } = useImport()
const { resetSlides } = useSlideHandler()
const { fileMenuItems, exportFileTypes } = storeToRefs(mainStore)

const mainMenuVisible = ref(false)
const hotkeyDrawerVisible = ref(false)

const goLink = (url: string) => {
  window.open(url)
  mainMenuVisible.value = false
}

const setDialogForExport = (type: DialogForExportTypes) => {
  mainStore.setDialogForExport(type)
  mainMenuVisible.value = false
}
</script>

<style lang="scss" scoped>
</style>
