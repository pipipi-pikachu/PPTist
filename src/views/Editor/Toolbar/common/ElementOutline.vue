<template>
  <div class="element-outline">
    <div class="row" v-if="!fixed">
      <div style="flex: 2;">启用边框：</div>
      <div class="switch-wrapper" style="flex: 3;">
        <Switch 
          :checked="hasOutline" 
          @change="checked => toggleOutline(checked as boolean)" 
        />
      </div>
    </div>
    <template v-if="hasOutline && outline">
      <div class="row">
        <div style="flex: 2;">边框样式：</div>
        <Select 
          style="flex: 3;" 
          :value="outline.style" 
          @change="value => updateOutline({ style: value as 'dashed' | 'solid' })"
        >
          <SelectOption value="solid">实线边框</SelectOption>
          <SelectOption value="dashed">虚线边框</SelectOption>
        </Select>
      </div>
      <div class="row">
        <div style="flex: 2;">边框颜色：</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker
              :modelValue="outline.color"
              @update:modelValue="value => updateOutline({ color: value })"
            />
          </template>
          <ColorButton :color="outline.color || '#000'" style="flex: 3;" />
        </Popover>
      </div>
      <div class="row">
        <div style="flex: 2;">边框粗细：</div>
        <InputNumber 
          :value="outline.width" 
          @change="value => updateOutline({ width: value as number })" 
          style="flex: 3;" 
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTElementOutline } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from './ColorButton.vue'

defineProps({
  fixed: {
    type: Boolean,
    default: false,
  },
})

const slidesStore = useSlidesStore()
const { handleElement } = storeToRefs(useMainStore())

const outline = ref<PPTElementOutline>()
const hasOutline = ref(false)

watch(handleElement, () => {
  if (!handleElement.value) return
  outline.value = 'outline' in handleElement.value ? handleElement.value.outline : undefined
  hasOutline.value = !!outline.value
}, { deep: true, immediate: true })

const { addHistorySnapshot } = useHistorySnapshot()

const updateOutline = (outlineProps: Partial<PPTElementOutline>) => {
  if (!handleElement.value) return
  const props = { outline: { ...outline.value, ...outlineProps } }
  slidesStore.updateElement({ id: handleElement.value.id, props })
  addHistorySnapshot()
}

const toggleOutline = (checked: boolean) => {
  if (!handleElement.value) return
  if (checked) {
    const _outline: PPTElementOutline = { width: 2, color: '#000', style: 'solid' }
    slidesStore.updateElement({ id: handleElement.value.id, props: { outline: _outline } })
  }
  else {
    slidesStore.removeElementProps({ id: handleElement.value.id, propName: 'outline' })
  }
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.switch-wrapper {
  text-align: right;
}
</style>