<template>
  <div class="multi-position-panel">
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="左对齐">
        <Button style="flex: 1;" @click="alignElement('left')"><IconAlignLeft /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="水平居中">
        <Button style="flex: 1;" @click="alignElement('horizontal')"><IconAlignVertically /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="右对齐">
        <Button style="flex: 1;" @click="alignElement('right')"><IconAlignRight /></Button>
      </Tooltip>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="上对齐">
        <Button style="flex: 1;" @click="alignElement('top')"><IconAlignTop /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="垂直居中">
        <Button style="flex: 1;" @click="alignElement('vertical')"><IconAlignHorizontally /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="下对齐">
        <Button style="flex: 1;" @click="alignElement('bottom')"><IconAlignBottom /></Button>
      </Tooltip>
    </ButtonGroup>
    <ButtonGroup class="row" v-if="activeElementList.length > 2">
      <Button style="flex: 1;" @click="uniformHorizontalDisplay()">水平均匀分布</Button>
      <Button style="flex: 1;" @click="uniformVerticalDisplay()">垂直均匀分布</Button>
    </ButtonGroup>

    <Divider />

    <ButtonGroup class="row">
      <Button :disabled="!canCombine" @click="combineElements()" style="flex: 1;"><IconGroup style="margin-right: 3px;" />组合</Button>
      <Button :disabled="canCombine" @click="uncombineElements()" style="flex: 1;"><IconUngroup style="margin-right: 3px;" />取消组合</Button>
    </ButtonGroup>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import { PPTElement } from '@/types/slides'
import { ElementAlignCommand } from '@/types/edit'
import useCombineElement from '@/hooks/useCombineElement'
import useAlignActiveElement from '@/hooks/useAlignActiveElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useUniformDisplayElement from '@/hooks/useUniformDisplayElement'

export default defineComponent({
  name: 'multi-position-panel',
  setup() {
    const store = useStore()
    const activeElementList = computed<PPTElement[]>(() => store.getters.activeElementList)

    const { combineElements, uncombineElements } = useCombineElement()
    const { alignActiveElement } = useAlignActiveElement()
    const { alignElementToCanvas } = useAlignElementToCanvas()
    const { uniformHorizontalDisplay, uniformVerticalDisplay } = useUniformDisplayElement()

    // 判断当前多选的几个元素是否可以组合
    const canCombine = computed(() => {
      const firstGroupId = activeElementList.value[0].groupId
      if (!firstGroupId) return true

      const inSameGroup = activeElementList.value.every(el => (el.groupId && el.groupId) === firstGroupId)
      return !inSameGroup
    })

    // 多选元素对齐，需要先判断当前所选中的元素状态：
    // 如果所选元素为一组组合元素，则将它对齐到画布；
    // 如果所选元素不是组合元素或不止一组元素（即当前为可组合状态），则将这多个（多组）元素相互对齐。
    const alignElement = (command: ElementAlignCommand) => {
      if (canCombine.value) alignActiveElement(command)
      else alignElementToCanvas(command)
    }

    return {
      activeElementList,
      canCombine,
      combineElements,
      uncombineElements,
      uniformHorizontalDisplay,
      uniformVerticalDisplay,
      alignElement,
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