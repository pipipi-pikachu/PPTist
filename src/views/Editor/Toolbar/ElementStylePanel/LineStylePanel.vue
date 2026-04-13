<template>
  <div class="line-style-panel">
    <div class="title">
      <span>点击替换线条类型</span>
      <i-icon-park-outline:down />
    </div>
    <div class="line-pool-wrapper">
      <div class="line-type-list">
        <div class="line-type-item" v-for="item in lineTypeOptions" :key="item.key" @click="changeLineType(item)">
          <div class="line-type-content">
            <svg
              overflow="visible"
              width="24"
              height="24"
            >
              <defs>
                <LinePointMarker
                  v-if="handleLineElement.points[0]"
                  :id="`replace-line-${item.key}`"
                  position="start"
                  :type="handleLineElement.points[0]"
                  color="currentColor"
                  :baseSize="2"
                />
                <LinePointMarker
                  v-if="handleLineElement.points[1]"
                  :id="`replace-line-${item.key}`"
                  position="end"
                  :type="handleLineElement.points[1]"
                  color="currentColor"
                  :baseSize="2"
                />
              </defs>
              <path
                :d="item.path"
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                :stroke-dasharray="handleLineElement.style === 'solid' ? '0, 0' : '4, 1'"
                :marker-start="handleLineElement.points[0] ? `url(#${`replace-line-${item.key}`}-${handleLineElement.points[0]}-start)` : ''"
                :marker-end="handleLineElement.points[1] ? `url(#${`replace-line-${item.key}`}-${handleLineElement.points[1]}-end)` : ''"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

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
      <Button style="flex: 1;" @click="updateLine({ start: handleLineElement.end, end: handleLineElement.start })"><i-icon-park-outline:switch /> 交换方向</Button>
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
import LinePointMarker from '@/views/components/element/LineElement/LinePointMarker.vue'
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
interface LineTypeOption {
  key: string
  path: string
  isBroken?: boolean
  isBroken2?: boolean
  isCurve?: boolean
  isCubic?: boolean
}

const lineTypeOptions: LineTypeOption[] = [
  { key: 'straight', path: 'M 2 2 L 22 22' },
  { key: 'broken', path: 'M 2 2 L 2 22 L 22 22', isBroken: true },
  { key: 'broken2', path: 'M 2 2 L 12 2 L 12 22 L 22 22', isBroken2: true },
  { key: 'curve', path: 'M 2 2 Q 2 22 22 22', isCurve: true },
  { key: 'cubic', path: 'M 2 2 C 22 2 2 22 22 22', isCubic: true },
] 

const changeLineType = (line: LineTypeOption) => {
  if (!handleElement.value) return

  const { id, start, end } = handleElement.value as PPTLineElement
  const midpoint: [number, number] = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]

  slidesStore.removeElementProps({
    id,
    propName: ['broken', 'broken2', 'curve', 'cubic'],
  })

  const props: Partial<PPTLineElement> = {}
  if (line.isBroken) props.broken = midpoint
  if (line.isBroken2) props.broken2 = midpoint
  if (line.isCurve) props.curve = midpoint
  if (line.isCubic) props.cubic = [midpoint, midpoint]

  slidesStore.updateElement({ id, props })
  addHistorySnapshot()
}

const updateLine = (props: Partial<PPTLineElement>) => {
  if (!handleElement.value) return
  slidesStore.updateElement({ id: handleElement.value.id, props })
  addHistorySnapshot()
}
</script>

<style lang="scss" scoped>
.line-style-panel {
  user-select: none;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.line-pool-wrapper {
  width: 235px;
  padding: 5px;
  border: 1px solid $borderColor;
  margin-bottom: 20px;
}
.line-type-list {
  @include flex-grid-layout();
}
.line-type-item {
  @include flex-grid-layout-children(6, 14%);

  height: 0;
  padding-bottom: 14%;
  margin-bottom: 0;
  flex-shrink: 0;
  position: relative;
  color: #999;
  cursor: pointer;

  &:hover {
    color: $themeColor;
  }
}
.line-type-content {
  @include absolute-0();

  display: flex;
  justify-content: center;
  align-items: center;
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