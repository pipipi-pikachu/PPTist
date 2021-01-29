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
import { MutationTypes, useStore } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import { ElementAlignCommand, ElementAlignCommands } from '@/types/edit'
import { getElementListRange } from '@/utils/element'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useCombineElement from '@/hooks/useCombineElement'

export default defineComponent({
  name: 'multi-position-panel',
  setup() {
    const store = useStore()
    const activeElementIdList = computed(() => store.state.activeElementIdList)
    const activeElementList = computed<PPTElement[]>(() => store.getters.activeElementList)
    const currentSlide = computed<Slide>(() => store.getters.currentSlide)

    const { addHistorySnapshot } = useHistorySnapshot()
    const { combineElements, uncombineElements } = useCombineElement()

    const canCombine = computed(() => {
      const firstGroupId = activeElementList.value[0].groupId
      if(!firstGroupId) return true

      const inSameGroup = activeElementList.value.every(el => (el.groupId && el.groupId) === firstGroupId)
      return !inSameGroup
    })

    const alignActiveElement = (command: ElementAlignCommand) => {
      const { minX, maxX, minY, maxY } = getElementListRange(activeElementList.value)
      const elementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

      // 获取每一个组合的宽高位置
      const groupElementRangeMap = {}
      for(const activeElement of activeElementList.value) {
        if(activeElement.groupId && !groupElementRangeMap[activeElement.groupId]) {
          const groupElements = activeElementList.value.filter(item => item.groupId === activeElement.groupId)
          groupElementRangeMap[activeElement.groupId] = getElementListRange(groupElements)
        }
      }

      if(command === ElementAlignCommands.LEFT) {
        elementList.forEach(element => {
          if(activeElementIdList.value.includes(element.id)) {
            if(!element.groupId) element.left = minX
            else {
              const range = groupElementRangeMap[element.groupId]
              const offset = range.minX - minX
              element.left = element.left - offset
            }
          }
        })
      }
      else if(command === ElementAlignCommands.RIGHT) {
        elementList.forEach(element => {
          if(activeElementIdList.value.includes(element.id)) {
            if(!element.groupId) {
              const elWidth = element.type === 'line' ? Math.max(element.start[0], element.end[0]) : element.width
              element.left = maxX - elWidth
            }
            else {
              const range = groupElementRangeMap[element.groupId]
              const offset = range.maxX - maxX
              element.left = element.left - offset
            }
          }
        })
      }
      else if(command === ElementAlignCommands.TOP) {
        elementList.forEach(element => {
          if(activeElementIdList.value.includes(element.id)) {
            if(!element.groupId) element.top = minY
            else {
              const range = groupElementRangeMap[element.groupId]
              const offset = range.minY - minY
              element.top = element.top - offset
            }
          }
        })
      }
      else if(command === ElementAlignCommands.BOTTOM) {
        elementList.forEach(element => {
          if(activeElementIdList.value.includes(element.id)) {
            if(!element.groupId) {
              const elHeight = element.type === 'line' ? Math.max(element.start[1], element.end[1]) : element.height
              element.top = maxY - elHeight
            }
            else {
              const range = groupElementRangeMap[element.groupId]
              const offset = range.maxY - maxY
              element.top = element.top - offset
            }
          }
        })
      }
      else if(command === ElementAlignCommands.HORIZONTAL) {
        const horizontalCenter = (minX + maxX) / 2
        elementList.forEach(element => {
          if(activeElementIdList.value.includes(element.id)) {
            if(!element.groupId) {
              const elWidth = element.type === 'line' ? Math.max(element.start[0], element.end[0]) : element.width
              element.left = horizontalCenter - elWidth / 2
            }
            else {
              const range = groupElementRangeMap[element.groupId]
              const center = (range.maxX + range.minX) / 2
              const offset = center - horizontalCenter
              element.left = element.left - offset
            }
          }
        })
      }
      else if(command === ElementAlignCommands.VERTICAL) {
        const verticalCenter = (minY + maxY) / 2
        elementList.forEach(element => {
          if(activeElementIdList.value.includes(element.id)) {
            if(!element.groupId) {
              const elHeight = element.type === 'line' ? Math.max(element.start[1], element.end[1]) : element.height
              element.top = verticalCenter - elHeight / 2
            }
            else {
              const range = groupElementRangeMap[element.groupId]
              const center = (range.maxY + range.minY) / 2
              const offset = center - verticalCenter
              element.top = element.top - offset
            }
          }
        })
      }
      
      store.commit(MutationTypes.UPDATE_SLIDE, { elements: elementList })
      addHistorySnapshot()
    }

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