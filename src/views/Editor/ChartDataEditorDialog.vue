<template>
  <Modal
    v-model:visible="visible"
    :width="640"
  >
    <ChartDataEditor
      v-if="editingChartElement"
      :type="editingChartElement.chartType"
      :data="editingChartElement.data"
      @close="visible = false"
      @save="value => updateData(value)"
    />
  </Modal>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { ChartData, ChartType, PPTChartElement } from '@/types/slides'
import emitter, { EmitterEvents } from '@/utils/emitter'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ChartDataEditor from '@/components/ChartDataEditor.vue'
import Modal from '@/components/Modal.vue'

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const { handleElementId } = storeToRefs(mainStore)
const { currentSlide } = storeToRefs(slidesStore)

const visible = ref(false)
const editingElementId = ref('')

const editingChartElement = computed(() => {
  const element = currentSlide.value.elements.find(item => item.id === editingElementId.value)
  return element?.type === 'chart' ? element as PPTChartElement : null
})

watch(editingChartElement, () => {
  if (!visible.value || editingChartElement.value) return
  visible.value = false
  editingElementId.value = ''
})

const { addHistorySnapshot } = useHistorySnapshot()

const openDataEditor = () => {
  const element = currentSlide.value.elements.find(item => item.id === handleElementId.value)
  if (!element || element.type !== 'chart') return

  editingElementId.value = element.id
  visible.value = true
}

const updateData = (payload: {
  data: ChartData
  type: ChartType
}) => {
  if (!editingChartElement.value) return

  slidesStore.updateElement({
    id: editingChartElement.value.id,
    props: { data: payload.data, chartType: payload.type },
  })
  addHistorySnapshot()
  visible.value = false
}

emitter.on(EmitterEvents.OPEN_CHART_DATA_EDITOR, openDataEditor)
onUnmounted(() => {
  emitter.off(EmitterEvents.OPEN_CHART_DATA_EDITOR, openDataEditor)
})
</script>
