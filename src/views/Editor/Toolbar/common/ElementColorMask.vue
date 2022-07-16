<template>
  <div class="element-color-mask">
    <div class="row">
      <div style="flex: 1;">重新着色（蒙版）：</div>
      <div class="switch-wrapper" style="flex: 1;">
        <Switch 
          :checked="hasColorMask" 
          @change="checked => toggleColorMask(checked as boolean)" 
        />
      </div>
    </div>
    <template v-if="hasColorMask">
      <div class="row" style="margin-top: 15px;">
        <div style="flex: 2;">蒙版颜色：</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker
              :modelValue="colorMask.color"
              @update:modelValue="value => updateColorMask({ color: value })"
            />
          </template>
          <ColorButton :color="colorMask.color" style="flex: 3;" />
        </Popover>
      </div>
      <div class="row">
        <div style="flex: 2;">不透明度：</div>
        <Slider
          class="opacity-slider"
          :max="1"
          :min="0"
          :step="0.05"
          :value="colorMask.opacity"
          @change="value => updateColorMask({ opacity: value as number })"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { ImageColorElementMask } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from './ColorButton.vue'

const defaultColorMask = { color: 'transparent', opacity: 0.3 }

const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(useMainStore())

const colorMask = ref<ImageColorElementMask>(defaultColorMask)
const hasColorMask = ref(false)

const { addHistorySnapshot } = useHistorySnapshot()

watch(handleElement, () => {
  if (!handleElement.value || handleElement.value.type !== 'image') return

  if (handleElement.value.colorMask) {
    colorMask.value = handleElement.value.colorMask
    hasColorMask.value = true
  }
  else hasColorMask.value = false
}, { deep: true, immediate: true })

const toggleColorMask = (checked: boolean) => {
  if (!handleElement.value) return
  if (checked) {
    slidesStore.updateElement({ id: handleElement.value.id, props: { colorMask: defaultColorMask } })
  }
  else {
    slidesStore.removeElementProps({ id: handleElement.value.id, propName: 'colorMask' })
  }
  addHistorySnapshot()
}

const updateColorMask = (colorMaskProp: Partial<ImageColorElementMask>) => {
  const newColorMask = { ...colorMask.value, ...colorMaskProp }
  slidesStore.updateElement({ id: handleElementId.value, props: { colorMask: newColorMask } })
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
.opacity-slider {
  flex: 3;
}
</style>