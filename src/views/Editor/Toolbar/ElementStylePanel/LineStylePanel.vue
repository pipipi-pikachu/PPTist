<template>
  <div class="line-style-panel">
    <div class="row">
      <div style="width: 40%;">线条样式：</div>
      <SelectCustom style="width: 60%;">
        <template #options>
          <div class="option" v-for="item in lineStyleOptions" :key="item" @click="updateLine({ style: item })">
            <SVGLine :type="item" />
          </div>
        </template>
        <template #label>
          <SVGLine :type="handleLineElement.style" />
        </template>
      </SelectCustom>
    </div>
    <div class="row">
      <div style="width: 40%;">线条颜色：</div>
      <Popover trigger="click" style="width: 60%;">
        <template #content>
          <ColorPicker
            :modelValue="handleLineElement.color"
            @update:modelValue="value => updateLine({ color: value })"
          />
        </template>
        <ColorButton :color="handleLineElement.color" />
      </Popover>
    </div>
    <div class="row">
      <div style="width: 40%;">线条宽度：</div>
      <NumberInput 
        :value="handleLineElement.width" 
        @update:value="value => updateLine({ width: value })" 
        style="width: 60%;" 
      />
    </div>
    
    <div class="row">
      <div style="width: 40%;">起点样式：</div>
      <SelectCustom style="width: 60%;">
        <template #options>
          <div class="option" v-for="item in lineMarkerOptions" :key="item" @click="updateLine({ points: [item, handleLineElement.points[1]] })">
            <SVGLine :padding="5" :markers="[item, '']" />
          </div>
        </template>
        <template #label>
          <SVGLine :padding="5" :markers="[handleLineElement.points[0], '']" />
        </template>
      </SelectCustom>
    </div>
    <div class="row">
      <div style="width: 40%;">终点样式：</div>
      <SelectCustom style="width: 60%;">
        <template #options>
          <div class="option" v-for="item in lineMarkerOptions" :key="item" @click="updateLine({ points: [handleLineElement.points[0], item] })">
            <SVGLine :padding="5" :markers="['', item]" />
          </div>
        </template>
        <template #label>
          <SVGLine :padding="5" :markers="['', handleLineElement.points[1]]" />
        </template>
      </SelectCustom>
    </div>

    <Divider />

    <div class="row">
      <Button style="flex: 1;" @click="updateLine({ start: handleLineElement.end, end: handleLineElement.start })"><IconSwitch /> 交换方向</Button>
    </div>

    <Divider />
    <ElementShadow />
  </div>
</template>

<script lang="ts" setup>
import { type Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { LinePoint, LineStyleType, PPTLineElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import ElementShadow from '../common/ElementShadow.vue'
import SVGLine from '../common/SVGLine.vue'
import Button from '@/components/Button.vue'
import ColorButton from '@/components/ColorButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import Divider from '@/components/Divider.vue'
import NumberInput from '@/components/NumberInput.vue'
import SelectCustom from '@/components/SelectCustom.vue'
import Popover from '@/components/Popover.vue'

const slidesStore = useSlidesStore()
const { handleElement } = storeToRefs(useMainStore())

const handleLineElement = handleElement as Ref<PPTLineElement>

const { addHistorySnapshot } = useHistorySnapshot()

const lineStyleOptions = ref<LineStyleType[]>(['solid', 'dashed', 'dotted'])
const lineMarkerOptions = ref<LinePoint[]>(['', 'arrow', 'dot'])

const updateLine = (props: Partial<PPTLineElement>) => {
  if (!handleElement.value) return
  slidesStore.updateElement({ id: handleElement.value.id, props })
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
.preset-point-style {
  padding: 0 10px;

  & + .preset-point-style {
    margin-top: 10px;
  }
}
.option {
  height: 32px;
  padding: 0 5px;
  border-radius: $borderRadius;

  &:not(.selected):hover {
    background-color: rgba($color: $themeColor, $alpha: .05);
    cursor: pointer;
  }

  &.selected {
    color: $themeColor;
    font-weight: 700;
  }
}
</style>