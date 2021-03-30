<template>
  <div class="toolbar">
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ 'active': tab.value === toolbarState }"
        v-for="tab in currentTabs" 
        :key="tab.value"
        @click="setToolbarState(tab.value)"
      >{{tab.label}}</div>
    </div>
    <div class="content">
      <component :is="currentPanelComponent"></component>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { ToolbarState, ToolbarStates } from '@/types/toolbar'

import ElementStylePanel from './ElementStylePanel/index.vue'
import ElementPositionPanel from './ElementPositionPanel.vue'
import ElementAnimationPanel from './ElementAnimationPanel.vue'
import SlideStylePanel from './SlideStylePanel.vue'
import SlideAnimationPanel from './SlideAnimationPanel.vue'
import MultiPositionPanel from './MultiPositionPanel.vue'

export default defineComponent({
  name: 'toolbar',
  setup() {
    const store = useStore()
    const toolbarState = computed(() => store.state.toolbarState)

    const elementTabs = [
      { label: '样式', value: ToolbarStates.EL_STYLE },
      { label: '位置', value: ToolbarStates.EL_POSITION },
      { label: '动画', value: ToolbarStates.EL_ANIMATION },
    ]
    const slideTabs = [
      { label: '页面样式', value: ToolbarStates.SLIDE_STYLE },
      { label: '切换', value: ToolbarStates.SLIDE_ANIMATION },
      { label: '动画', value: ToolbarStates.EL_ANIMATION },
    ]
    const multiSelectTabs = [
      { label: '位置', value: ToolbarStates.MULTI_POSITION },
      { label: '样式', value: ToolbarStates.EL_STYLE },
    ]

    const setToolbarState = (value: ToolbarState) => {
      store.commit(MutationTypes.SET_TOOLBAR_STATE, value)
    }

    const activeElementIdList = computed(() => store.state.activeElementIdList)
    const currentTabs = computed(() => {
      if (!activeElementIdList.value.length) return slideTabs
      else if (activeElementIdList.value.length > 1) return multiSelectTabs
      return elementTabs
    })

    watch(currentTabs, () => {
      const currentTabsValue = currentTabs.value.map(tab => tab.value)
      if (!currentTabsValue.includes(toolbarState.value)) {
        store.commit(MutationTypes.SET_TOOLBAR_STATE, currentTabsValue[0])
      }
    })

    const currentPanelComponent = computed(() => {
      const panelMap = {
        [ToolbarStates.EL_STYLE]: ElementStylePanel,
        [ToolbarStates.EL_POSITION]: ElementPositionPanel,
        [ToolbarStates.EL_ANIMATION]: ElementAnimationPanel,
        [ToolbarStates.SLIDE_STYLE]: SlideStylePanel,
        [ToolbarStates.SLIDE_ANIMATION]: SlideAnimationPanel,
        [ToolbarStates.MULTI_POSITION]: MultiPositionPanel,
      }
      return panelMap[toolbarState.value] || null
    })

    return {
      toolbarState,
      currentTabs,
      setToolbarState,
      currentPanelComponent,
    }
  },
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
  overflow: auto;
  overflow: overlay;
}
</style>