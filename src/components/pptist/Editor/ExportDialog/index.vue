<template>
  <div class="export-dialog">
    <Tabs
      :tabs="tabs"
      :value="dialogForExport"
      card
      @update:value="key => setDialogForExport(key as DialogForExportTypes)"
    />
    <div class="content">
      <component :is="currentDialogComponent" @close="setDialogForExport('')"></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '../../store'
import type { DialogForExportTypes } from '../../types/export'

// import ExportImage from './ExportImage.vue'
// import ExportJSON from './ExportJSON.vue'
// import ExportPDF from './ExportPDF.vue'
// import ExportPPTX from './ExportPPTX.vue'
// import ExportSpecificFile from './ExportSpecificFile.vue'
import Tabs from '../../components/Tabs.vue'

interface TabItem {
  key: DialogForExportTypes
  label: string
}

const mainStore = useMainStore()
const { dialogForExport, exportFileTypes } = storeToRefs(mainStore)

const setDialogForExport = mainStore.setDialogForExport

const tabs: TabItem[] = [
]
if (exportFileTypes.value.includes('pptist')) {
  tabs.push({ key: 'pptist', label: '导出 pptist 文件' })
}
if (exportFileTypes.value.includes('pptx')) {
  tabs.push({ key: 'pptx', label: '导出 PPTX' })
}
if (exportFileTypes.value.includes('image')) {
  tabs.push({ key: 'image', label: '导出图片' })
}
if (exportFileTypes.value.includes('json')) {
  tabs.push({ key: 'json', label: '导出 JSON' })
}
if (exportFileTypes.value.includes('pdf')) {
  tabs.push({ key: 'pdf', label: '打印 / 导出 PDF' })
}

let dialogMap: any = {
  'image': defineAsyncComponent(() => import('./ExportImage.vue')),
  'json': defineAsyncComponent(() => import('./ExportJSON.vue')),
  'pdf': defineAsyncComponent(() => import('./ExportPDF.vue')),
  'pptx': defineAsyncComponent(() => import('./ExportPPTX.vue')),
  'pptist': defineAsyncComponent(() => import('./ExportSpecificFile.vue')),
}

const currentDialogComponent = computed<unknown>(() => {
  if (dialogForExport.value) return dialogMap[dialogForExport.value] || null
  return null
})
</script>

<style lang="scss" scoped>
.export-dialog {
  margin: -20px;
}
.content {
  height: 460px;
  padding: 12px;
  font-size: 13px;

  @include overflow-overlay();
}
</style>
