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

<script lang="ts" setup>import { t } from '@/i18n';


import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import type { DialogForExportTypes } from '@/types/export'

import ExportImage from './ExportImage.vue'
import ExportJSON from './ExportJSON.vue'
import ExportPDF from './ExportPDF.vue'
import ExportPPTX from './ExportPPTX.vue'
import ExportSpecificFile from './ExportSpecificFile.vue'
import Tabs from '@/components/Tabs.vue'

interface TabItem {
  key: DialogForExportTypes
  label: string
}

const mainStore = useMainStore()
const { dialogForExport } = storeToRefs(mainStore)

const setDialogForExport = mainStore.setDialogForExport

const tabs: TabItem[] = [
  { key: 'pptist', label: t('Views.Editor.ExportDialog.Index.text.pptist') },
  { key: 'pptx', label: t('Commons.button.pptx') },
  { key: 'image', label: t('Commons.button.text_by3nrb') },
  { key: 'json', label: t('Commons.button.json') },
  { key: 'pdf', label: t('Views.Editor.ExportDialog.Index.text.pdf') },
]

const currentDialogComponent = computed<unknown>(() => {
  const dialogMap = {
    'image': ExportImage,
    'json': ExportJSON,
    'pdf': ExportPDF,
    'pptx': ExportPPTX,
    'pptist': ExportSpecificFile,
  }
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