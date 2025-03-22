<template>
  <div class="multi-position-panel">
    <ButtonGroup class="row">
      <Button style="flex: 1;" v-tooltip="'Align Left'" @click="alignElement(ElementAlignCommands.LEFT)"><IconAlignLeft /></Button>
      <Button style="flex: 1;" v-tooltip="'Align Center'" @click="alignElement(ElementAlignCommands.HORIZONTAL)"><IconAlignHorizontally /></Button>
      <Button style="flex: 1;" v-tooltip="'Align Right'" @click="alignElement(ElementAlignCommands.RIGHT)"><IconAlignRight /></Button>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Button style="flex: 1;" v-tooltip="'Top'" @click="alignElement(ElementAlignCommands.TOP)"><IconAlignTop /></Button>
      <Button style="flex: 1;" v-tooltip="'Center'" @click="alignElement(ElementAlignCommands.VERTICAL)"><IconAlignVertically /></Button>
      <Button style="flex: 1;" v-tooltip="'Bottom'" @click="alignElement(ElementAlignCommands.BOTTOM)"><IconAlignBottom /></Button>
    </ButtonGroup>
    <ButtonGroup class="row" v-if="displayItemCount > 2">
      <Button style="flex: 1;" @click="uniformHorizontalDisplay()">Uniform Horizontal Display</Button>
      <Button style="flex: 1;" @click="uniformVerticalDisplay()">Uniform Vertical Display</Button>
    </ButtonGroup>

    <Divider />

    <ButtonGroup class="row">
      <Button :disabled="!canCombine" @click="combineElements()" style="flex: 1;"><IconGroup style="margin-right: 3px;" />Combine</Button>
      <Button :disabled="canCombine" @click="uncombineElements()" style="flex: 1;"><IconUngroup style="margin-right: 3px;" />Uncombine</Button>
    </ButtonGroup>
  </div>
</template>

<script lang="ts" setup>
import { ElementAlignCommands } from '@/types/edit'
import useCombineElement from '@/hooks/useCombineElement'
import useAlignActiveElement from '@/hooks/useAlignActiveElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useUniformDisplayElement from '@/hooks/useUniformDisplayElement'
import Divider from '@/components/Divider.vue'
import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'

const { canCombine, combineElements, uncombineElements } = useCombineElement()
const { alignActiveElement } = useAlignActiveElement()
const { alignElementToCanvas } = useAlignElementToCanvas()
const { displayItemCount, uniformHorizontalDisplay, uniformVerticalDisplay } = useUniformDisplayElement()

// 多选元素对齐，需要先判断当前所选中的元素状态：
// 如果所选元素为一组组合元素，则将它对齐到画布；
// 如果所选元素不是组合元素或不止一组元素（即当前为可组合状态），则将这多个（多组）元素相互对齐。
const alignElement = (command: ElementAlignCommands) => {
  if (canCombine.value) alignActiveElement(command)
  else alignElementToCanvas(command)
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>