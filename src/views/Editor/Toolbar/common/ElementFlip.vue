<template>
  <div class="element-flip">
    <CheckboxButtonGroup class="row">
      <CheckboxButton 
        style="flex: 1;"
        :checked="flipH"
        @click="updateFlip({ flipH: !flipH })"
      ><IconFlipVertically /> 垂直翻转</CheckboxButton>
      <CheckboxButton 
        style="flex: 1;"
        :checked="flipV"
        @click="updateFlip({ flipV: !flipV })"
      ><IconFlipHorizontally /> 水平翻转</CheckboxButton>
    </CheckboxButtonGroup>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTImageElement, PPTShapeElement, ImageOrShapeFlip } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default defineComponent({
  name: 'element-flip',
  setup() {
    const store = useStore()
    const handleElement = computed<PPTImageElement | PPTShapeElement>(() => store.getters.handleElement)

    const flipH = ref(false)
    const flipV = ref(false)

    watch(handleElement, () => {
      if (!handleElement.value || !['image', 'shape'].includes(handleElement.value.type)) return

      flipH.value = !!handleElement.value.flipH
      flipV.value = !!handleElement.value.flipV
    }, { deep: true, immediate: true })

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateFlip = (flipProps: ImageOrShapeFlip) => {
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props: flipProps })
      addHistorySnapshot()
    }

    return {
      flipH,
      flipV,
      updateFlip,
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