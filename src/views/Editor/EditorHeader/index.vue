<template>
  <div class="editor-header">
    <div class="left">
      <Popover trigger="click" placement="bottomLeft" v-model:open="mainMenuVisible">
        <template #content>
          <div class="popover-list">
            <FileInput accept=".pptist"  @change="files => importSpecificFile(files)">
              <div class="popover-item" @click="mainMenuVisible = false">导入 pptist 文件</div>
            </FileInput>
            <FileInput accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"  @change="files => importPPTXFile(files)">
              <div class="popover-item" @click="mainMenuVisible = false">导入 pptx 文件（测试版）</div>
            </FileInput>
            <div class="popover-item" @click="setDialogForExport('pptx')">导出文件</div>
            <div class="popover-item" @click="resetSlides(); mainMenuVisible = false">重置幻灯片</div>
            <div class="popover-item" @click="goLink('https://github.com/pipipi-pikachu/PPTist/issues')">意见反馈</div>
            <div class="popover-item" @click="goLink('https://github.com/pipipi-pikachu/PPTist/blob/master/doc/Q&A.md')">常见问题</div>
            <div class="popover-item" @click="mainMenuVisible = false; hotkeyDrawerVisible = true">快捷键</div>
          </div>
        </template>
        <div class="menu-item"><IconHamburgerButton class="icon" /></div>
      </Popover>

      <div class="title">
        <Input 
          class="title-input" 
          ref="titleInputRef"
          v-model:value="titleValue" 
          @blur="handleUpdateTitle()" 
          v-if="editingTitle" 
        ></Input>
        <div 
          class="title-text"
          @click="startEditTitle()"
          :title="title"
          v-else
        >{{ title }}</div>
      </div>
    </div>

    <div class="right">
      <div class="group-menu-item">
        <Tooltip :mouseLeaveDelay="0" title="幻灯片放映">
          <div class="menu-item" @click="enterScreening()">
            <IconPpt class="icon" />
          </div>
        </Tooltip>
        <Popover trigger="click">
          <template #content>
            <div class="popover-list">
              <div class="popover-item" @click="enterScreeningFromStart()">从头开始</div>
              <div class="popover-item" @click="enterScreening()">从当前页开始</div>
            </div>
          </template>
          <div class="arrow-btn"><IconDown class="arrow" /></div>
        </Popover>
      </div>
      <Tooltip :mouseLeaveDelay="0" title="导出">
        <div class="menu-item" @click="setDialogForExport('pptx')">
          <IconDownload class="icon" />
        </div>
      </Tooltip>
      <a class="github-link" href="https://github.com/pipipi-pikachu/PPTist" target="_blank">
        <div class="menu-item"><IconGithub class="icon" /></div>
      </a>
    </div>

    <Drawer
      :width="320"
      v-model:visible="hotkeyDrawerVisible"
      placement="right"
    >
      <HotkeyDoc />
    </Drawer>

    <FullscreenSpin :loading="exporting" tip="正在导入..." />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useImport from '@/hooks/useImport'
import useSlideHandler from '@/hooks/useSlideHandler'
import type { DialogForExportTypes } from '@/types/export'

import HotkeyDoc from './HotkeyDoc.vue'
import FileInput from '@/components/FileInput.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import Drawer from '@/components/Drawer.vue'
import {
  Tooltip,
  Popover,
  Input,
} from 'ant-design-vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { title } = storeToRefs(slidesStore)
const { enterScreening, enterScreeningFromStart } = useScreening()
const { importSpecificFile, importPPTXFile, exporting } = useImport()
const { resetSlides } = useSlideHandler()

const mainMenuVisible = ref(false)
const hotkeyDrawerVisible = ref(false)
const editingTitle = ref(false)
const titleInputRef = ref<HTMLInputElement>()
const titleValue = ref('')

const startEditTitle = () => {
  titleValue.value = title.value
  editingTitle.value = true
  nextTick(() => titleInputRef.value?.focus())
}

const handleUpdateTitle = () => {
  slidesStore.setTitle(titleValue.value)
  editingTitle.value = false
}

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
.editor-header {
  background-color: #fff;
  user-select: none;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
}
.left, .right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.menu-item {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  border-radius: $borderRadius;
  cursor: pointer;

  .icon {
    font-size: 18px;
    color: #666;
  }

  &:hover {
    background-color: #f1f1f1;
  }
}
.group-menu-item {
  height: 30px;
  display: flex;
  margin: 0 8px;
  padding: 0 2px;

  &:hover {
    background-color: #f1f1f1;
  }

  .menu-item {
    padding: 0 3px;
  }
  .arrow-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
.title {
  height: 30px;
  margin-left: 2px;
  font-size: 13px;

  .title-input {
    width: 200px;
    height: 100%;
    padding-left: 5px;
    padding-right: 5px;
    font-family: 'Microsoft YaHei';
  }
  .title-text {
    min-width: 20px;
    max-width: 400px;
    line-height: 30px;
    padding: 0 6px;
    border-radius: $borderRadius;
    cursor: pointer;

    @include ellipsis-oneline();

    &:hover {
      background-color: #f1f1f1;
    }
  }
}
.github-link {
  display: inline-block;
  height: 30px;
}
.popover-list {
  display: flex;
  flex-direction: column;
  padding: 5px;
  margin: -12px;
}
.popover-item {
  padding: 6px 10px;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
}
</style>