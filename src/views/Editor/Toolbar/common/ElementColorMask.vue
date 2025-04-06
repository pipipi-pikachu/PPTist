<template>
  <div class="element-color-mask">
    <div class="row">
      <div style="width: 40%;">着色（蒙版）：</div>
      <div class="switch-wrapper" style="width: 60%;">
        <Switch 
          :value="hasColorMask" 
          @update:value="value => toggleColorMask(value)" 
        />
      </div>
    </div>
    <template v-if="hasColorMask">
      <div class="row" style="margin-top: 15px;">
        <div style="width: 40%;">蒙版颜色：</div>
        <Popover trigger="click" style="width: 60%;">
          <template #content>
            <ColorPicker
              :modelValue="colorMask"
              @update:modelValue="value => updateColorMask(value)"
            />
          </template>
          <ColorButton :color="colorMask" />
        </Popover>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import tinycolor from 'tinycolor2'
import { useMainStore, useSlidesStore } from '@/store'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ColorButton from '@/components/ColorButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Switch from '@/components/Switch.vue'
import Popover from '@/components/Popover.vue'

const slidesStore = useSlidesStore()
const { handleElement, handleElementId } = storeToRefs(useMainStore())
const { theme } = storeToRefs(slidesStore)

const { addHistorySnapshot } = useHistorySnapshot()

const defaultColorMask = computed(() => {
  const themeColor = theme.value.themeColors[0]
  return tinycolor(themeColor).setAlpha(0.5).toRgbString()
})
const colorMask = ref('')
const hasColorMask = ref(false)

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
    slidesStore.updateElement({ id: handleElement.value.id, props: { colorMask: defaultColorMask.value } })
  }
  else {
    slidesStore.removeElementProps({ id: handleElement.value.id, propName: 'colorMask' })
  }
  addHistorySnapshot()
}

const updateColorMask = (colorMask: string) => {
  slidesStore.updateElement({ id: handleElementId.value, props: { colorMask } })
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