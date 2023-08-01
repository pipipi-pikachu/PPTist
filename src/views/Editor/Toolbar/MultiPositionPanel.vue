<template>
  <div class="multi-position-panel">
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Left alignment">
        <Button style="flex: 1;" @click="alignElement(ElementAlignCommands.LEFT)"><IconAlignLeft /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Horizontal Center">
        <Button style="flex: 1;" @click="alignElement(ElementAlignCommands.HORIZONTAL)"><IconAlignHorizontally /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Right Align">
        <Button style="flex: 1;" @click="alignElement(ElementAlignCommands.RIGHT)"><IconAlignRight /></Button>
      </Tooltip>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Top alignment">
        <Button style="flex: 1;" @click="alignElement(ElementAlignCommands.TOP)"><IconAlignTop /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Vertical Center">
        <Button style="flex: 1;" @click="alignElement(ElementAlignCommands.VERTICAL)"><IconAlignVertically /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="Bottom alignment">
        <Button style="flex: 1;" @click="alignElement(ElementAlignCommands. BOTTOM)"><IconAlignBottom /></Button>
      </Tooltip>
    </ButtonGroup>
    <ButtonGroup class="row" v-if="displayItemCount > 2">
      <Button  @click="uniformHorizontalDisplay()"><IconHorizontalSpacingBetweenItems /></Button>
      <Button  @click="uniformVerticalDisplay()"><IconVerticalSpacingBetweenItems /></Button>
    </ButtonGroup>

    <Divider />

    <ButtonGroup class="row">
      <Button :disabled="!canCombine" @click="combineElements()" style="flex: 1;"><IconGroup style="margin-right: 3px;" />combination</Button>
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

import {
  Divider,
  Button,
  Tooltip,
} from 'ant-design-vue'
const ButtonGroup = Button.Group

const { canCombine, combineElements, uncombineElements } = useCombineElement()
const { alignActiveElement } = useAlignActiveElement()
const { alignElementToCanvas } = useAlignElementToCanvas()
const { displayItemCount, uniformHorizontalDisplay, uniformVerticalDisplay } = useUniformDisplayElement()

// To align multiple selected elements, you need to first determine the status of the currently selected element:
// If the selected element is a set of composite elements, align it to the canvas;
// If the selected element is not a combined element or more than one set of elements (that is, currently in a composable state), align the multiple (multiple sets) of elements with each other.
const alignElement = (command: ElementAlignCommands) => {
  if (canCombine. value) alignActiveElement(command)
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