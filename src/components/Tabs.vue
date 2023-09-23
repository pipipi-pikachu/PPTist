<template>
  <div class="tabs" :class="{ 'card': card }" :style="tabsStyle || {}">
    <div 
      class="tab" 
      :class="{ 'active': tab.key === value }"
      v-for="tab in tabs" 
      :key="tab.key"
      :style="tabStyle || {}"
      @click="emit('update:value', tab.key)"
    >{{tab.label}}</div>
  </div>
</template>

<script lang="ts" setup>
import { type CSSProperties } from 'vue'

interface TabItem {
  key: string
  label: string
}

withDefaults(defineProps<{
  value: string
  tabs: TabItem[]
  card?: boolean
  tabsStyle?: CSSProperties
  tabStyle?: CSSProperties
}>(), {
  card: false,
})

const emit = defineEmits<{
  (event: 'update:value', payload: string): void
}>()
</script>

<style lang="scss" scoped>
.tabs {
  font-size: 13px;
  display: flex;
  user-select: none;

  &:not(.card) {
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid $borderColor;

    .tab {
      padding: 8px 10px;
      text-align: center;
      border-bottom: 2px solid transparent;
      cursor: pointer;
    
      &.active {
        border-bottom: 2px solid $themeColor;
      }
    }
  }

  &.card {
    .tab {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $lightGray;
      border-bottom: 1px solid $borderColor;
      cursor: pointer;

      &.active {
        background-color: transparent;
        border-bottom-color: transparent;
      }

      & + .tab {
        border-left: 1px solid $borderColor;
      }
    }
  }
}
</style>