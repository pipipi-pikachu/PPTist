<template>
  <div class="element-float-layer">
    <template v-for="item in elementFloatItems" :key="item.element.id">
      <AnimationIndex
        v-if="item.animationIndexList.length"
        :elementInfo="item.element"
        :range="item.range"
        :indexList="item.animationIndexList"
      />

      <LinkHandler
        v-if="handleElementId === item.element.id && item.element.link"
        :elementInfo="item.element"
        :range="item.range"
        :openLinkDialog="openLinkDialog"
        @mousedown.stop
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import { getElementRange } from '@/utils/element'

import AnimationIndex from './AnimationIndex.vue'
import LinkHandler from './LinkHandler.vue'

const props = defineProps<{
  elementList: PPTElement[]
  openLinkDialog: () => void
}>()

const { handleElementId, hiddenElementIdList, toolbarState } = storeToRefs(useMainStore())
const { formatedAnimations } = storeToRefs(useSlidesStore())

const getAnimationIndexList = (element: PPTElement) => {
  const indexList = []
  for (let i = 0; i < formatedAnimations.value.length; i++) {
    const elIds = formatedAnimations.value[i].animations.map(item => item.elId)
    if (elIds.includes(element.id)) indexList.push(i)
  }
  return indexList
}

const elementFloatItems = computed(() => {
  const items = []

  for (const element of props.elementList) {
    if (hiddenElementIdList.value.includes(element.id)) continue

    const animationIndexList = toolbarState.value === 'elAnimation' ? getAnimationIndexList(element) : []
    const showLinkHandler = handleElementId.value === element.id && !!element.link
    if (!animationIndexList.length && !showLinkHandler) continue

    items.push({
      element,
      range: getElementRange(element),
      animationIndexList,
    })
  }

  return items
})
</script>

<style lang="scss" scoped>
.element-float-layer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 102;
}
</style>
