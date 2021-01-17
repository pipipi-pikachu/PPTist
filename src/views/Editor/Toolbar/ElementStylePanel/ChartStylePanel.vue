<template>
  <div class="chart-style-panel">
    <Button class="full-width-btn" @click="chartDataEditorVisible = true">
      <IconEdit class="btn-icon" /> 编辑图表数据
    </Button>
    <ElementOutline />

    <Modal
      v-model:visible="chartDataEditorVisible" 
      :footer="null" 
      centered
      :closable="false"
      :width="648"
      destroyOnClose
    >
      <ChartDataEditor 
        :data="handleElement.data"
        @close="chartDataEditorVisible = false"
        @save="value => updateData(value)"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'
import { ChartData, PPTChartElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOutline from '../common/ElementOutline.vue'
import ChartDataEditor from './ChartDataEditor.vue'

export default defineComponent({
  name: 'chart-style-panel',
  components: {
    ElementOutline,
    ChartDataEditor,
  },
  setup() {
    const store = useStore<State>()
    const handleElement: Ref<PPTChartElement> = computed(() => store.getters.handleElement)

    const chartDataEditorVisible = ref(false)

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateData = (data: ChartData) => {
      chartDataEditorVisible.value = false
      const props = { data }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    return {
      chartDataEditorVisible,
      handleElement,
      updateData,
    }
  },
})
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.full-width-btn {
  width: 100%;
  margin-bottom: 10px;
}
.btn-icon {
  margin-right: 3px;
}
</style>