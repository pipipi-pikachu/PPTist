<template>
  <div class="latex-style-panel">
    <div class="row">
      <Button style="flex: 1;" @click="openLatexEditor()"><i-icon-park-outline:edit /> 编辑 LaTeX</Button>
    </div>

    <Divider />

    <div class="row">
      <div style="width: 40%;">颜色：</div>
      <Popover trigger="click" style="width: 60%;">
        <template #content>
          <ColorPicker
            :modelValue="handleLatexElement.color"
            @update:modelValue="value => updateLatex({ color: value })"
          />
        </template>
        <ColorButton :color="handleLatexElement.color" />
      </Popover>
    </div>
    <div class="row">
      <div style="width: 40%;">粗细：</div>
      <NumberInput 
        :min="1"
        :max="3"
        :value="handleLatexElement.strokeWidth" 
        @update:value="value => updateLatex({ strokeWidth: value })" 
        style="width: 60%;" 
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTLatexElement } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from '@/components/ColorButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Divider from '@/components/Divider.vue'
import Button from '@/components/Button.vue'
import NumberInput from '@/components/NumberInput.vue'
import Popover from '@/components/Popover.vue'

const slidesStore = useSlidesStore()
const { handleElement } = storeToRefs(useMainStore())

const handleLatexElement = handleElement as Ref<PPTLatexElement>

const { addHistorySnapshot } = useHistorySnapshot()

const updateLatex = (props: Partial<PPTLatexElement>) => {
  if (!handleElement.value) return
  slidesStore.updateElement({ id: handleElement.value.id, props })
  addHistorySnapshot()
}

const openLatexEditor = () => emitter.emit(EmitterEvents.OPEN_LATEX_EDITOR)
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
