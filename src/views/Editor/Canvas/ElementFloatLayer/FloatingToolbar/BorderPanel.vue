<template>
  <Popover
    trigger="click"
    :contentStyle="{ width: '240px' }"
  >
    <template #content>
      <div class="border-popover">
        <div class="row">
          <div class="label">边框样式：</div>
          <SelectCustom class="control">
            <template #options>
              <div
                class="option"
                v-for="item in lineStyleOptions"
                :key="item"
                @click="updateOutline({ style: item })"
              >
                <SVGLine :type="item" />
              </div>
            </template>
            <template #label>
              <SVGLine :type="(outline?.style || 'solid') as LineStyleType" />
            </template>
          </SelectCustom>
        </div>
        <div class="row">
          <div class="label">边框颜色：</div>
          <Popover trigger="click" class="control">
            <template #content>
              <ColorPicker :modelValue="outline?.color || '#000'" @update:modelValue="value => updateOutline({ color: value })" />
            </template>
            <ColorButton :color="outline?.color || '#000'" />
          </Popover>
        </div>
        <div class="row">
          <div class="label">边框粗细：</div>
          <NumberInput
            class="control"
            :value="outline?.width || 0"
            @update:value="value => updateOutline({ width: value })"
          />
        </div>
      </div>
    </template>
    <div class="toolbar-btn">
      <i-icon-park-outline:selected class="icon" />
      <span>边框</span>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import { computed, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { LineStyleType, PPTElementOutline, PPTShapeElement, PPTTableElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

import SVGLine from '@/views/Editor/Toolbar/common/SVGLine.vue'
import Popover from '@/components/Popover.vue'
import ColorButton from '@/components/ColorButton.vue'
import ColorPicker from '@/components/ColorPicker/index.vue'
import NumberInput from '@/components/NumberInput.vue'
import SelectCustom from '@/components/SelectCustom.vue'

const slidesStore = useSlidesStore()
const { theme } = storeToRefs(slidesStore)
const { handleElement } = storeToRefs(useMainStore())

const handleOutlinedElement = handleElement as Ref<PPTShapeElement | PPTTableElement>
const outline = computed<PPTElementOutline | undefined>(() => {
  const el = handleOutlinedElement.value
  if (!el) return undefined
  return el.outline
})

const lineStyleOptions: LineStyleType[] = ['solid', 'dashed', 'dotted']

const { addHistorySnapshot } = useHistorySnapshot()

const updateOutline = (outlineProps: Partial<PPTElementOutline>) => {
  if (!handleElement.value) return
  const baseOutline = outline.value || theme.value.outline
  const newOutline: PPTElementOutline = { ...baseOutline, ...outlineProps }
  slidesStore.updateElement({ id: handleElement.value.id, props: { outline: newOutline } })
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.toolbar-btn {
  min-width: 30px;
  height: 30px;
  flex-shrink: 0;
  padding: 0 5px;
  border: 0;
  color: $textColor;
  background-color: transparent;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  border-radius: $borderRadius;
  cursor: pointer;

  &:hover {
    background-color: $lightGray;
  }

  .icon {
    flex-shrink: 0;
    font-size: 16px;
  }
  span {
    flex-shrink: 0;
    font-size: 12px;
    margin-left: 5px;
  }
}
.border-popover {
  user-select: none;
}
.row {
  display: flex;
  align-items: center;

  & + .row {
    margin-top: 10px;
  }
}
.label {
  width: 40%;
  font-size: 13px;
}
.control {
  width: 60%;
}
.option {
  height: 32px;
  padding: 0 5px;
  border-radius: $borderRadius;

  &:hover {
    background-color: rgba($color: $themeColor, $alpha: .05);
    cursor: pointer;
  }
}
</style>
