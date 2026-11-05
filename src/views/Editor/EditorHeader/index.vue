<template>
  <div class="editor-header">
    <div class="left">
      <Popover trigger="click" placement="bottom-start" v-model:value="mainMenuVisible">
        <template #content>
          <div class="main-menu" v-if="ENABLE_AI">
            <div class="ai-menu" @click="openAIPPTDialog(); mainMenuVisible = false">
              <div class="icon"><i-custom:click /></div>
              <div class="aippt-content">
                <div class="aippt"><span>AIPPT</span></div>
                <div class="aippt-subtitle">输入一句话，智能生成演示文稿</div>
              </div>
            </div>
          </div>
          <Divider :margin="10" />
          <div class="import-section">
            <div class="import-label">导入文件</div>
            <div class="import-grid">
              <FileInput class="import-block" accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" @change="files => {
                importPPTXFile(files)
                mainMenuVisible = false
              }">
                <span class="icon"><i-custom:file-ppt /></span>
                <span class="label">PPTX</span>
                <span class="sub-label">（仅供测试）</span>
              </FileInput>
              <FileInput class="import-block" accept=".json" @change="files => {
                importJSON(files)
                mainMenuVisible = false
              }">
                <span class="icon"><i-custom:file-jpg /></span>
                <span class="label">JSON</span>
                <span class="sub-label">（仅供测试）</span>
              </FileInput>
              <FileInput class="import-block" accept=".pptist" @change="files => {
                importSpecificFile(files)
                mainMenuVisible = false
              }">
                <span class="icon"><i-custom:file-pptist /></span>
                <span class="label">PPTIST</span>
                <span class="sub-label">（专属格式）</span>
              </FileInput>
            </div>
          </div>
          <Divider :margin="10" />
          <PopoverMenuItem class="popover-menu-item" @click="setDialogForExport('pptx')"><i-icon-park-outline:download class="icon" /> 导出文件</PopoverMenuItem>
          <PopoverMenuItem class="popover-menu-item" v-if="viewUrl" @click="copyViewLink()"><i-icon-park-outline:link class="icon" /> 复制只读链接</PopoverMenuItem>
          <Divider :margin="10" />
          <PopoverMenuItem class="popover-menu-item" @click="resetSlides(); mainMenuVisible = false"><i-icon-park-outline:refresh class="icon" /> 重置幻灯片</PopoverMenuItem>
          <PopoverMenuItem class="popover-menu-item" @click="openMarkupPanel(); mainMenuVisible = false"><i-icon-park-outline:mark class="icon" /> 幻灯片类型标注</PopoverMenuItem>
          <PopoverMenuItem class="popover-menu-item" @click="mainMenuVisible = false; hotkeyDrawerVisible = true"><i-icon-park-outline:command class="icon" /> 快捷操作</PopoverMenuItem>
          <PopoverMenuItem class="popover-menu-item" @click="goLink('https://github.com/pipipi-pikachu/PPTist/issues')"><i-icon-park-outline:comment class="icon" /> 意见反馈</PopoverMenuItem>
          <PopoverMenuItem class="popover-menu-item" @click="goLink('https://github.com/pipipi-pikachu/PPTist/blob/master/doc/Q&A.md')"><i-icon-park-outline:helpcenter class="icon" /> 常见问题</PopoverMenuItem>
          <Divider :margin="10" />
          <div class="statement">注：本站仅作测试/演示，不提供任何形式的服务</div>
        </template>
        <div class="menu-item"><i-icon-park-outline:hamburger-button class="icon" /></div>
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
      <div class="save-status" :class="saveStatus" v-if="docId">{{ saveStatusText }}</div>
    </div>

    <div class="right">
      <div class="group-menu-item">
        <div class="menu-item" v-tooltip="'幻灯片放映（F5）'" @click="enterScreening()">
          <i-icon-park-outline:ppt class="icon" />
        </div>
        <Popover trigger="click" center>
          <template #content>
            <PopoverMenuItem class="popover-menu-item" @click="enterScreeningFromStart()"><i-icon-park-outline:slide-two class="icon" /> 从头开始</PopoverMenuItem>
            <PopoverMenuItem class="popover-menu-item" @click="enterScreening()"><i-icon-park-outline:ppt class="icon" /> 从当前页开始</PopoverMenuItem>
          </template>
          <div class="arrow-btn"><i-icon-park-outline:down class="arrow" /></div>
        </Popover>
      </div>
      <div class="menu-item" v-if="ENABLE_AI" v-tooltip="'AI生成PPT'" @click="openAIPPTDialog(); mainMenuVisible = false">
        <span class="text ai">AI</span>
      </div>
      <div class="menu-item" v-tooltip="'导出'" @click="setDialogForExport('pptx')">
        <i-icon-park-outline:download class="icon" />
      </div>
      <a class="github-link" v-tooltip="'Copyright © 2020-PRESENT pipipi-pikachu'" href="https://github.com/pipipi-pikachu/PPTist" target="_blank">
        <div class="menu-item"><i-icon-park-outline:github class="icon" /></div>
      </a>
    </div>

    <Drawer
      :width="320"
      v-model:visible="hotkeyDrawerVisible"
      placement="right"
    >
      <HotkeyDoc />
      <template v-slot:title>快捷操作</template>
    </Drawer>

    <FullscreenSpin :loading="exporting" tip="正在导入..." />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore, useDocumentStore } from '@/store'
import { ENABLE_AI } from '@/configs/collab'
import useScreening from '@/hooks/useScreening'
import useImport from '@/hooks/useImport'
import useSlideHandler from '@/hooks/useSlideHandler'
import message from '@/utils/message'
import type { DialogForExportTypes } from '@/types/export'

import HotkeyDoc from './HotkeyDoc.vue'
import FileInput from '@/components/FileInput.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import Drawer from '@/components/Drawer.vue'
import Input from '@/components/Input.vue'
import Popover from '@/components/Popover.vue'
import PopoverMenuItem from '@/components/PopoverMenuItem.vue'
import Divider from '@/components/Divider.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const documentStore = useDocumentStore()
const { title } = storeToRefs(slidesStore)
const { docId, viewUrl, saveStatus, lastRemoteSummary } = storeToRefs(documentStore)
const { enterScreening, enterScreeningFromStart } = useScreening()
const { importSpecificFile, importPPTXFile, importJSON, exporting } = useImport()
const { resetSlides } = useSlideHandler()

const mainMenuVisible = ref(false)
const hotkeyDrawerVisible = ref(false)
const editingTitle = ref(false)
const titleValue = ref('')
const titleInputRef = useTemplateRef<InstanceType<typeof Input>>('titleInputRef')

const startEditTitle = () => {
  titleValue.value = title.value
  editingTitle.value = true
  nextTick(() => titleInputRef.value?.focus())
}

const handleUpdateTitle = () => {
  slidesStore.setTitle(titleValue.value)
  editingTitle.value = false
}

const saveStatusText = computed(() => ({
  saved: '已保存',
  saving: '保存中 ...',
  dirty: '未保存',
  offline: '离线',
  conflict: '冲突',
})[saveStatus.value])

// 收到 Agent 更新时弹出简短提示，内容为摘要的前 3 条
watch(lastRemoteSummary, summary => {
  if (!summary.length) return
  message.info(summary.slice(0, 3).join('；'), { title: 'Agent 更新了文档' })
})

const copyViewLink = async () => {
  try {
    await navigator.clipboard.writeText(viewUrl.value)
    message.success('只读链接已复制')
  }
  catch {
    message.error('复制失败')
  }
  mainMenuVisible.value = false
}

const goLink = (url: string) => {
  window.open(url)
  mainMenuVisible.value = false
}

const setDialogForExport = (type: DialogForExportTypes) => {
  mainStore.setDialogForExport(type)
  mainMenuVisible.value = false
}

const openMarkupPanel = () => {
  mainStore.setMarkupPanelState(true)
}

const openAIPPTDialog = () => {
  mainStore.setAIPPTDialogState(true)
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
  .text {
    width: 18px;
    text-align: center;
    font-size: 17px;
  }
  .ai {
    background: linear-gradient(270deg, #d897fd, #33bcfc);
    background-clip: text;
    color: transparent;
    font-weight: 700;
  }

  &:hover {
    background-color: #f1f1f1;
  }
}
.popover-menu-item {
  display: flex;
  padding: 8px 10px;

  .icon {
    font-size: 18px;
    margin-right: 10px;
  }
}
.statement {
  font-size: 12px;
  color: #999;
  padding: 8px 10px;
  font-style: italic;
}
.main-menu {
  width: 300px;
}
.ai-menu {
  background: linear-gradient(270deg, #f8edff, #d4f1ff);
  color: $themeColor;
  border-radius: $borderRadius;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;

  .icon {
    font-size: 22px;
    margin-right: 16px;
  }
  .aippt-content {
    display: flex;
    flex-direction: column;
  }
  .aippt {
    font-weight: 700;
    font-size: 16px;

    span {
      background: linear-gradient(270deg, #d897fd, #33bcfc);
      background-clip: text;
      color: transparent;
    }
  }
  .aippt-subtitle {
    font-size: 12px;
    color: #777;
    margin-top: 5px;
  }
}

.import-section {
  padding: 5px 0;

  .import-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 6px;
  }
  .import-grid {
    display: flex;
    gap: 8px;
    justify-content: space-between;
  }
  .import-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    border-radius: $borderRadius;
    border: 1px solid $borderColor;
    transition: background-color .2s;
    cursor: pointer;
  
    &:hover {
      background-color: #f1f1f1;
    }
    .icon {
      font-size: 24px;
      margin-bottom: 2px;
    }
    .label {
      font-size: 12px;
      text-align: center;
    }
    .sub-label {
      font-size: 10px;
      color: #999;
    }
  }
}

.group-menu-item {
  height: 30px;
  display: flex;
  margin: 0 8px;
  padding: 0 2px;
  border-radius: $borderRadius;

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
    padding-left: 0;
    padding-right: 0;

    ::v-deep(input) {
      height: 28px;
      line-height: 28px;
    }
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
.save-status {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
  flex-shrink: 0;

  &.saving {
    color: $themeColor;
  }
  &.dirty, &.offline, &.conflict {
    color: #faad14;
  }
}
.github-link {
  display: inline-block;
  height: 30px;
}
</style>