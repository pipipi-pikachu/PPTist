<template>
  <Screen v-if="screening" />
  <div class="pptist-editor-wrapper" v-else-if="_isPC">
    <div class="pptist-editor">
      <EditorHeader class="layout-header" />
      <div class="layout-content">
        <Thumbnails class="layout-content-left" />
        <div class="layout-content-center">
          <CanvasTool class="center-top" />
          <Canvas class="center-body" :style="{ height: `calc(100% - ${remarkHeight + 40}px)` }" />
          <Remark class="center-bottom" v-model:height="remarkHeight" :style="{ height: `${remarkHeight}px` }" />
        </div>
        <Toolbar class="layout-content-right" />
      </div>
    </div>

    <SelectPanel v-if="showSelectPanel" />
    <SearchPanel v-if="showSearchPanel" />
    <NotesPanel v-if="showNotesPanel" />

    <Modal :visible="!!dialogForExport" :width="680" @closed="closeExportDialog()">
      <ExportDialog />
    </Modal>
  </div>
  <Mobile v-else />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useScreenStore, useSlidesStore } from '@/store'

import useGlobalHotkey from '@/hooks/useGlobalHotkey'
import usePasteEvent from '@/hooks/usePasteEvent'

import Screen from '@/views/Screen/index.vue'
import Mobile from '@/views/Mobile/index.vue'

import EditorHeader from './EditorHeader/index.vue'
import Canvas from './Canvas/index.vue'
import CanvasTool from './CanvasTool/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import Toolbar from './Toolbar/index.vue'
import Remark from './Remark/index.vue'
import ExportDialog from './ExportDialog/index.vue'
import SelectPanel from './SelectPanel.vue'
import SearchPanel from './SearchPanel.vue'
import NotesPanel from './NotesPanel.vue'
import Modal from '@/components/Modal.vue'

import { isPC } from '@/utils/common'
import { useRouter } from 'vue-router'
const _isPC = isPC()

const router = useRouter()

const slidesStore = useSlidesStore()

const { screening } = storeToRefs(useScreenStore())

const mainStore = useMainStore()
const { dialogForExport, showSelectPanel, showSearchPanel, showNotesPanel } = storeToRefs(mainStore)
const closeExportDialog = () => mainStore.setDialogForExport('')

const remarkHeight = ref(40)

useGlobalHotkey()
usePasteEvent()


onMounted(() => {
  const pptId = router.currentRoute.value.query.id
  const pptData = GlobalPPTs.find((item: any) => item.id == pptId)
  if (pptId) {
    slidesStore.setSlidesData(pptData)
  }
  console.log(pptData)
})
</script>

<style lang="scss" scoped>
.pptist-editor-wrapper,
.pptist-editor {
  height: 100%;
}

.layout-header {
  height: 40px;
}

.layout-content {
  height: calc(100% - 40px);
  display: flex;
}

.layout-content-left {
  width: 160px;
  height: 100%;
  flex-shrink: 0;
}

.layout-content-center {
  // width: calc(100% - 160px - 260px);
  flex:1;


  .center-top {
    height: 40px;
  }
}

.layout-content-right {
  width: 260px;
  height: 100%;
}
</style>