<template>
  <div class="tabs"
    :class="{
      'card': card,
      'space-around': spaceAround,
      'space-between': spaceBetween,
    }" 
    :style="tabsStyle || {}"
  >
    <div 
      class="tab" 
      :class="{ 'active': tab.key === value }"
      v-for="tab in tabs" 
      :key="tab.key"
      :style="{
        ...(tabStyle || {}),
        '--color': tab.color,
      }"
      @click="emit('update:value', tab.key)"
    >{{tab.label}}</div>
  </div>
</template>

<script lang="ts" setup>
import { type CSSProperties } from 'vue'

interface TabItem {
  key: string
  label: string
  color?: string
}

withDefaults(defineProps<{
  value: string
  tabs: TabItem[]
  card?: boolean
  tabsStyle?: CSSProperties
  tabStyle?: CSSProperties
  spaceAround?: boolean
  spaceBetween?: boolean
}>(), {
  card: false,
  spaceAround: false,
  spaceBetween: false,
})

const emit = defineEmits<{
  (event: 'update:value', payload: string): void
}>()
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  user-select: none;
  line-height: 1;

  &:not(.card) {
    font-size: 13px;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid $borderColor;

    &.space-around {
      justify-content: space-around;
    }
    &.space-between {
      justify-content: space-between;
    }

    .tab {
      text-align: center;
      border-bottom: 2px solid transparent;
      padding: 8px 10px;
      cursor: pointer;

      &.active {
        border-bottom: 2px solid var(--color, $themeColor);
      }
    }
  }

  &.card {
    height: 40px;
    font-size: 12px;
    flex-shrink: 0;

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