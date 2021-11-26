<template>
  <div class="line-style-panel">
    <div class="row">
      <div style="flex: 2;">线条样式：</div>
      <Select 
        style="flex: 3;" 
        :value="handleElement.style" 
        @change="value => updateLine({ style: value })"
      >
        <SelectOption value="solid">实线</SelectOption>
        <SelectOption value="dashed">虚线</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">线条颜色：</div>
      <Popover trigger="click">
        <template #content>
          <ColorPicker
            :modelValue="handleElement.color"
            @update:modelValue="value => updateLine({ color: value })"
          />
        </template>
        <ColorButton :color="handleElement.color" style="flex: 3;" />
      </Popover>
    </div>
    <div class="row">
      <div style="flex: 2;">线条宽度：</div>
      <InputNumber 
        :value="handleElement.width" 
        @change="value => updateLine({ width: value })" 
        style="flex: 3;" 
      />
    </div>
    
    <div class="row">
      <div style="flex: 2;">起点样式：</div>
      <Select 
        style="flex: 3;" 
        :value="handleElement.points[0]" 
        @change="value => updateLine({ points: [value, handleElement.points[1]] })"
      >
        <SelectOption value="">无</SelectOption>
        <SelectOption value="arrow">箭头</SelectOption>
        <SelectOption value="dot">圆点</SelectOption>
      </Select>
    </div>
    <div class="row">
      <div style="flex: 2;">终点样式：</div>
      <Select 
        style="flex: 3;" 
        :value="handleElement.points[1]" 
        @change="value => updateLine({ points: [handleElement.points[0], value] })"
      >
        <SelectOption value="">无</SelectOption>
        <SelectOption value="arrow">箭头</SelectOption>
        <SelectOption value="dot">圆点</SelectOption>
      </Select>
    </div>

    <Divider />
    <ElementShadow />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTLineElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementShadow from '../common/ElementShadow.vue'
import ColorButton from '../common/ColorButton.vue'

export default defineComponent({
  name: 'line-style-panel',
  components: {
    ElementShadow,
    ColorButton,
  },
  setup() {
    const slidesStore = useSlidesStore()
    const { handleElement } = storeToRefs(useMainStore())

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateLine = (props: Partial<PPTLineElement>) => {
      if (!handleElement.value) return
      slidesStore.updateElement({ id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    return {
      handleElement,
      updateLine,
    }
  }
})
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.line-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 !important;

  .line-wrapper {
    margin-left: 8px;
  }
}
.line-wrapper {
  overflow: visible;
}
.line-btn-icon {
  width: 30px;
  font-size: 12px;
  margin-top: 2px;
  color: #bfbfbf;
}
.preset-point-style {
  padding: 0 10px;

  & + .preset-point-style {
    margin-top: 10px;
  }
}
</style>