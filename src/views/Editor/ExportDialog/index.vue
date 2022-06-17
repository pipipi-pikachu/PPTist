<template>
  <div class="export-dialog">
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ 'active': tab.key === dialogForExport }"
        v-for="tab in tabs" 
        :key="tab.key"
        @click="setDialogForExport(tab.key)"
      >{{tab.label}}</div>
    </div>
    <div class="content">
      <component :is="currentDialogComponent" @close="setDialogForExport('')"></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { DialogForExportTypes } from '@/types/export'

import ExportImage from './ExportImage.vue'
import ExportJSON from './ExportJSON.vue'
import ExportPDF from './ExportPDF.vue'
import ExportPPTX from './ExportPPTX.vue'
import ExportSpecificFile from './ExportSpecificFile.vue'

interface TabItem {
  key: DialogForExportTypes
  label: string
}

const mainStore = useMainStore()
const { dialogForExport } = storeToRefs(mainStore)

const setDialogForExport = mainStore.setDialogForExport

const tabs: TabItem[] = [
  { key: 'pptist', label: '导出 pptist 文件' },
  { key: 'pptx', label: '导出 PPTX' },
  { key: 'image', label: '导出图片' },
  { key: 'json', label: '导出 JSON' },
  { key: 'pdf', label: '打印 / 导出 PDF' },
]

const currentDialogComponent = computed(() => {
  const dialogMap = {
    'image': ExportImage,
    'json': ExportJSON,
    'pdf': ExportPDF,
    'pptx': ExportPPTX,
    'pptist': ExportSpecificFile,
  }
  return dialogMap[dialogForExport.value] || null
})
</script>

<style lang="scss" scoped>
.export-dialog {
  margin: -24px;
}
.tabs {
  height: 50px;
  font-size: 12px;
  flex-shrink: 0;
  display: flex;
  user-select: none;
  border-top-left-radius: $borderRadius;
  border-top-right-radius: $borderRadius;
  overflow: hidden;
}
.tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $lightGray;
  border-bottom: 1px solid $borderColor;
  cursor: pointer;

  &.active {
    background-color: #fff;
    border-bottom-color: #fff;
  }

  & + .tab {
    border-left: 1px solid $borderColor;
  }
}
.content {
  height: 460px;
  padding: 12px;
  font-size: 13px;

  @include overflow-overlay();
}
</style>