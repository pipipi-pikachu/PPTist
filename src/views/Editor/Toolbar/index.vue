<template>
  <div class="toolbar">
    <Tabs 
      :tabs="currentTabs" 
      :value="toolbarState" 
      card 
      @update:value="key => setToolbarState(key as ToolbarStates)"
    />
    <div class="content">
      <component :is="currentPanelComponent"></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { ToolbarStates } from '@/types/toolbar'

import ElementStylePanel from './ElementStylePanel/index.vue'
import ElementPositionPanel from './ElementPositionPanel.vue'
import ElementAnimationPanel from './ElementAnimationPanel.vue'
import SlideDesignPanel from './SlideDesignPanel/index.vue'
import SlideAnimationPanel from './SlideAnimationPanel.vue'
import MultiPositionPanel from './MultiPositionPanel.vue'
import MultiStylePanel from './MultiStylePanel.vue'
import SymbolPanel from './SymbolPanel.vue'
import Tabs from '@/components/Tabs.vue'

interface ElementTabs {
  label: string
  key: ToolbarStates
}

const mainStore = useMainStore()
const { activeElementIdList, activeElementList, activeGroupElementId, handleElement, toolbarState } = storeToRefs(mainStore)

const elementTabs = computed<ElementTabs[]>(() => {
  if (handleElement.value?.type === 'text') {
    return [
    { label: 'Style', key: ToolbarStates.EL_STYLE },
    { label: 'Symbol', key: ToolbarStates.SYMBOL },
    { label: 'Position', key: ToolbarStates.EL_POSITION },
    // { label: 'Animation', key: ToolbarStates.EL_ANIMATION },
    ]
  }
  return [
    { label: 'Style', key: ToolbarStates.EL_STYLE },
    { label: 'Position', key: ToolbarStates.EL_POSITION },
    // { label: 'Animation', key: ToolbarStates.EL_ANIMATION },
  ]
})
const slideTabs = [
  { label: 'Design', key: ToolbarStates.SLIDE_DESIGN },
  // { label: 'Switch', key: ToolbarStates.SLIDE_ANIMATION },
  // { label: 'Animation', key: ToolbarStates.EL_ANIMATION },
]
const multiSelectTabs = [
  { label: 'Style (multiple choices)', key: ToolbarStates.MULTI_STYLE },
  { label: 'Position (multiple choices)', key: ToolbarStates.MULTI_POSITION },
]

const setToolbarState = (value: ToolbarStates) => {
  mainStore.setToolbarState(value)
}

const currentTabs = computed(() => {
  if (!activeElementIdList.value.length) return slideTabs
  else if (activeElementIdList.value.length > 1) {
    if (!activeGroupElementId.value) return multiSelectTabs

    const activeGroupElement = activeElementList.value.find(item => item.id === activeGroupElementId.value)
    if (activeGroupElement) return elementTabs.value
    return multiSelectTabs
  }
  return elementTabs.value
})

watch(currentTabs, () => {
  const currentTabsValue: ToolbarStates[] = currentTabs.value.map(tab => tab.key)
  if (!currentTabsValue.includes(toolbarState.value)) {
    mainStore.setToolbarState(currentTabsValue[0])
  }
})

const currentPanelComponent = computed(() => {
  const panelMap = {
    [ToolbarStates.EL_STYLE]: ElementStylePanel,
    [ToolbarStates.EL_POSITION]: ElementPositionPanel,
    [ToolbarStates.EL_ANIMATION]: ElementAnimationPanel,
    [ToolbarStates.SLIDE_DESIGN]: SlideDesignPanel,
    [ToolbarStates.SLIDE_ANIMATION]: SlideAnimationPanel,
    [ToolbarStates.MULTI_STYLE]: MultiStylePanel,
    [ToolbarStates.MULTI_POSITION]: MultiPositionPanel,
    [ToolbarStates.SYMBOL]: SymbolPanel,
  }
  return panelMap[toolbarState.value] || null
})
</script>

<style lang="scss" scoped>
.toolbar {
  border-left: solid 1px $borderColor;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.content {
  padding: 12px;
  font-size: 13px;

  @include overflow-overlay();
}
</style>