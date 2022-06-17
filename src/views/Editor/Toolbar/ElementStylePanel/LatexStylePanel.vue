<template>
  <div class="latex-style-panel">
    <div class="row"><Button style="flex: 1;" @click="latexEditorVisible = true">编辑 LaTeX</Button></div>

    <Divider />

    <div class="row">
      <div style="flex: 2;">颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="handleLatexElement.color"
            @update:modelValue="value => updateLatex({ color: value })"
          />
        </template>
        <ColorButton :color="handleLatexElement.color" style="flex: 3;" />
      </Popover>
    </div>
    <div class="row">
      <div style="flex: 2;">粗细：</div>
      <InputNumber 
        :min="1"
        :max="3"
        :value="handleLatexElement.strokeWidth" 
        @change="value => updateLatex({ strokeWidth: value as number })" 
        style="flex: 3;" 
      />
    </div>

    <Modal
      v-model:visible="latexEditorVisible" 
      :footer="null" 
      centered
      :width="880"
      destroyOnClose
    >
      <LaTeXEditor 
        :value="handleLatexElement.latex"
        @close="latexEditorVisible = false"
        @update="data => { updateLatexData(data); latexEditorVisible = false }"
      />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTLatexElement } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from '../common/ColorButton.vue'
import LaTeXEditor from '@/components/LaTeXEditor/index.vue'

const slidesStore = useSlidesStore()
const { handleElement } = storeToRefs(useMainStore())

const handleLatexElement = handleElement as Ref<PPTLatexElement>

const latexEditorVisible = ref(false)

const { addHistorySnapshot } = useHistorySnapshot()

const updateLatex = (props: Partial<PPTLatexElement>) => {
  if (!handleElement.value) return
  slidesStore.updateElement({ id: handleElement.value.id, props })
  addHistorySnapshot()
}

const updateLatexData = (data: { path: string; latex: string; w: number; h: number; }) => {
  updateLatex({
    path: data.path,
    latex: data.latex,
    width: data.w,
    height: data.h,
    viewBox: [data.w, data.h],
  })
}

const openLatexEditor = () => latexEditorVisible.value = true

emitter.on(EmitterEvents.OPEN_LATEX_EDITOR, openLatexEditor)
onUnmounted(() => {
  emitter.off(EmitterEvents.OPEN_LATEX_EDITOR, openLatexEditor)
})
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>