<template>
  <div class="shape-style-panel">
    <div class="row">
      <Select 
        style="flex: 10;" 
        :value="fillType" 
        @change="value => updateFillType(value)"
      >
        <SelectOption value="fill">纯色填充</SelectOption>
        <SelectOption value="gradient">渐变填充</SelectOption>
      </Select>
      <div style="flex: 1;"></div>
      <Popover trigger="click" v-if="fillType === 'fill'">
        <template #content>
          <ColorPicker
            :modelValue="fill"
            @update:modelValue="value => updateFill(value)"
          />
        </template>
        <ColorButton :color="fill" style="flex: 10;" />
      </Popover>
      <Select 
        style="flex: 10;" 
        :value="gradient.type" 
        @change="value => updateGradient({ type: value })"
        v-else
      >
        <SelectOption value="linear">线性渐变</SelectOption>
        <SelectOption value="radial">径向渐变</SelectOption>
      </Select>
    </div>
    
    <template v-if="fillType === 'gradient'">
      <div class="row">
        <div style="flex: 2;">起点颜色：</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker
              :modelValue="gradient.color[0]"
              @update:modelValue="value => updateGradient({ color: [value, gradient.color[1]] })"
            />
          </template>
          <ColorButton :color="gradient.color[0]" style="flex: 3;" />
        </Popover>
      </div>
      <div class="row">
        <div style="flex: 2;">终点颜色：</div>
        <Popover trigger="click">
          <template #content>
            <ColorPicker
              :modelValue="gradient.color[1]"
              @update:modelValue="value => updateGradient({ color: [gradient.color[0], value] })"
            />
          </template>
          <ColorButton :color="gradient.color[1]" style="flex: 3;" />
        </Popover>
      </div>
      <div class="row" v-if="gradient.type === 'linear'">
        <div style="flex: 2;">渐变角度：</div>
        <Slider
          :min="0"
          :max="360"
          :step="15"
          :value="gradient.rotate"
          style="flex: 3;"
          @change="value => updateGradient({ rotate: value })" 
        />
      </div>
    </template>

    <ElementFlip />
    <Divider />
    <ElementOutline />
    <Divider />
    <ElementShadow />
    <Divider />
    <ElementOpacity />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { PPTShapeElement, ShapeGradient } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementOpacity from '../common/ElementOpacity.vue'
import ElementOutline from '../common/ElementOutline.vue'
import ElementShadow from '../common/ElementShadow.vue'
import ElementFlip from '../common/ElementFlip.vue'
import ColorButton from '../common/ColorButton.vue'

export default defineComponent({
  name: 'shape-style-panel',
  components: {
    ElementOpacity,
    ElementOutline,
    ElementShadow,
    ElementFlip,
    ColorButton,
  },
  setup() {
    const store = useStore()
    const handleElement = computed<PPTShapeElement>(() => store.getters.handleElement)

    const fill = ref<string>()
    const gradient = ref<ShapeGradient>()
    const fillType = ref('fill')

    watch(handleElement, () => {
      if (!handleElement.value || handleElement.value.type !== 'shape') return
      fill.value = handleElement.value.fill || '#000'

      gradient.value = handleElement.value.gradient || { type: 'linear', rotate: 0, color: [fill.value, '#fff'] }

      fillType.value = handleElement.value.gradient ? 'gradient' : 'fill'
    }, { deep: true, immediate: true })

    const { addHistorySnapshot } = useHistorySnapshot()

    // 设置填充类型：渐变、纯色
    const updateFillType = (type: 'gradient' | 'fill') => {
      if (type === 'fill') {
        store.commit(MutationTypes.REMOVE_ELEMENT_PROPS, {
          id: handleElement.value.id,
          propName: 'gradient',
        })
      }
      else {
        const props = { gradient: gradient.value }
        store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      }
      addHistorySnapshot()
    }

    // 设置渐变填充
    const updateGradient = (gradientProps: Partial<ShapeGradient>) => {
      const props = { gradient: { ...gradient.value, ...gradientProps } }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    // 设置填充色
    const updateFill = (value: string) => {
      const props = { fill: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

    return {
      fill,
      gradient,
      fillType,
      updateFillType,
      updateFill,
      updateGradient,
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