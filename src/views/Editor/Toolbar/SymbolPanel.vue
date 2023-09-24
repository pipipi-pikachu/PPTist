<template>
  <div class="symbol-panel">
    <Tabs 
      :tabs="tabs" 
      v-model:value="selectedSymbolKey" 
      :tabsStyle="{ marginBottom: '8px' }" 
      spaceBetween
    />
    <div class="pool">
      <div class="symbol-item" v-for="(item, index) in symbolPool" :key="index" @click="selectSymbol(item)">
        <div class="symbol">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { SYMBOL_LIST } from '@/configs/symbol'
import emitter, { EmitterEvents } from '@/utils/emitter'
import Tabs from '@/components/Tabs.vue'

const selectedSymbolKey = ref(SYMBOL_LIST[0].key)
const symbolPool = computed(() => {
  const selectedSymbol = SYMBOL_LIST.find(item => item.key === selectedSymbolKey.value)
  return selectedSymbol?.children || []
})

const tabs = SYMBOL_LIST.map(item => ({
  key: item.key,
  label: item.label,
}))

const selectSymbol = (value: string) => {
  emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action: { command: 'insert', value } })
}
</script>

<style lang="scss" scoped>
.symbol-panel {
  height: 100%;
  display: flex;
  flex-direction: column;

  .pool {
    padding: 5px 12px;
    margin: 0 -12px;
    flex: 1;
    font-size: 18px;

    @include overflow-overlay();
    @include flex-grid-layout();
  }
  .symbol-item {
    @include flex-grid-layout-children(5, 18%);

    height: 0;
    padding-bottom: 18%;
    position: relative;
    cursor: pointer;
    border: 1px solid $borderColor;

    &:hover {
      color: $themeColor;
    }

    .symbol {
      @include absolute-0();

      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
    }
  }
}
</style>
