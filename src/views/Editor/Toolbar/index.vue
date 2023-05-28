<template>
  <div class="toolbar">
    <div class="tabs">
      <div
        class="tab"
        :class="{ 'active': tab.value === toolbarState }"
        v-for="tab in currentTabs"
        :key="tab.value"
        @click="setToolbarState(tab.value)"
      >{{t(tab.label)}}</div>
    </div>
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
import SlideDesignPanel from './SlideDesignPanel.vue'
import SlideAnimationPanel from './SlideAnimationPanel.vue'
import MultiPositionPanel from './MultiPositionPanel.vue'
import SymbolPanel from './SymbolPanel.vue'
import useI18n from '@/hooks/usei18n'

interface ElementTabs {
  label: string
  value: ToolbarStates
}

const {t} = useI18n()
const mainStore = useMainStore()
const { activeElementIdList, handleElement, toolbarState } = storeToRefs(mainStore)

const elementTabs = computed<ElementTabs[]>(() => {
  if (handleElement.value?.type === 'text') {
    return [
      { label: 'toolbar.style', value: ToolbarStates.EL_STYLE },
      { label: 'toolbar.symbol', value: ToolbarStates.SYMBOL },
      { label: 'toolbar.position', value: ToolbarStates.EL_POSITION },
      { label: 'toolbar.animation', value: ToolbarStates.EL_ANIMATION },
    ]
  }
  return [
    { label: 'toolbar.style', value: ToolbarStates.EL_STYLE },
    { label: 'toolbar.position', value: ToolbarStates.EL_POSITION },
    { label: 'toolbar.animation', value: ToolbarStates.EL_ANIMATION },
  ]
})
const slideTabs = [
  { label: 'toolbar.design', value: ToolbarStates.SLIDE_DESIGN },
  { label: 'toolbar.slide', value: ToolbarStates.SLIDE_ANIMATION },
  { label: 'toolbar.animation', value: ToolbarStates.EL_ANIMATION },
]
const multiSelectTabs = [
  { label: 'toolbar.style', value: ToolbarStates.EL_STYLE },
  { label: 'toolbar.position', value: ToolbarStates.MULTI_POSITION },
]

const setToolbarState = (value: ToolbarStates) => {
  mainStore.setToolbarState(value)
}

const currentTabs = computed(() => {
  if (!activeElementIdList.value.length) return slideTabs
  else if (activeElementIdList.value.length > 1) return multiSelectTabs
  return elementTabs.value
})

watch(currentTabs, () => {
  const currentTabsValue: ToolbarStates[] = currentTabs.value.map(tab => tab.value)
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
.tabs {
  height: 40px;
  font-size: 12px;
  flex-shrink: 0;
  display: flex;
  user-select: none;
}
.tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $lightGray;
  border-bottom: 1px solid $borderColor;
  cursor: pointer;

  &.active {
    background-color: #fff;
    border-bottom-color: #fff;
  }

  & + .tab {
    border-left: 1px solid $borderColor;
  }
}
.content {
  padding: 12px;
  font-size: 13px;

  @include overflow-overlay();
}
</style>
