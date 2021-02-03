<template>
  <div class="element-opacity">
    <div class="row">
      <div style="flex: 2;">不透明度：</div>
      <Slider
        :min="0"
        :max="1"
        :step="0.1"
        :value="opacity"
        style="flex: 3;"
        @change="value => updateOpacity(value)" 
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default defineComponent({
  name: 'element-opacity',
  setup() {
    const store = useStore()
    const handleElement = computed<PPTElement>(() => store.getters.handleElement)

    const opacity = ref<number>()

    watch(handleElement, () => {
      if (!handleElement.value) return
      opacity.value = 'opacity' in handleElement.value && handleElement.value.opacity !== undefined ? handleElement.value.opacity : 1
    }, { deep: true, immediate: true })

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateOpacity = (value: number) => {
      const props = { opacity: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    return {
      opacity,
      updateOpacity,
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
</style>