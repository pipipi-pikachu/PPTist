<template>
  <div class="multi-position-panel">
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="左对齐">
        <Button style="flex: 1;" @click="alignActiveElement('left')"><IconAlignLeft /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="水平居中">
        <Button style="flex: 1;" @click="alignActiveElement('horizontal')"><IconAlignVertically /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="右对齐">
        <Button style="flex: 1;" @click="alignActiveElement('right')"><IconAlignRight /></Button>
      </Tooltip>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="上对齐">
        <Button style="flex: 1;" @click="alignActiveElement('top')"><IconAlignTop /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="垂直居中">
        <Button style="flex: 1;" @click="alignActiveElement('vertical')"><IconAlignHorizontally /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="下对齐">
        <Button style="flex: 1;" @click="alignActiveElement('bottom')"><IconAlignBottom /></Button>
      </Tooltip>
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
import useCombineElement from '@/hooks/useCombineElement'
import useAlignActiveElement from '@/hooks/useAlignActiveElement'

export default defineComponent({
  name: 'multi-position-panel',
  setup() {
    const store = useStore()
    const activeElementList = computed<PPTElement[]>(() => store.getters.activeElementList)

    const { combineElements, uncombineElements } = useCombineElement()
    const { alignActiveElement } = useAlignActiveElement()

    // 判断当前多选的几个元素是否可以组合
    const canCombine = computed(() => {
      const firstGroupId = activeElementList.value[0].groupId
      if (!firstGroupId) return true

      const inSameGroup = activeElementList.value.every(el => (el.groupId && el.groupId) === firstGroupId)
      return !inSameGroup
    })

    return {
      canCombine,
      combineElements,
      uncombineElements,
      alignActiveElement,
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