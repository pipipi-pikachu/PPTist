<template>
  <div class="search-panel">
    <div class="tabs">
      <div
        class="tab"
        v-for="item in tabList"
        :key="item.key"
        @click="selectedTabKey = item.key"
      >
        <p class="text" :class="{ 'selected': selectedTabKey === item.key }">{{ item.label }}</p>
        <div v-if="selectedTabKey === item.key" class="line"></div>
      </div>
    </div>
    <div class="panel-list">
      <div class="panel-item" v-if="selectedTabKey === 'find'">
        <SearchInput/>
      </div>
      <div class="panel-item" v-if="selectedTabKey === 'replace'">
        <div class="line-item">
          <span class="line-title">查找</span>
          <SearchInput/>
        </div>
        <div class="line-item">
          <span class="line-title">替换为</span>
          <Input v-model:value="searchObj.replaceText" placeholder="输入替换内容"/>
        </div>
        <div class="line-item line-item-btn">
          <Button @click="replace()">替换</Button>
          <Button type="primary" @click="replaceAll()">全部替换</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useSearch from '@/hooks/useSearch'
import { useMainStore } from '@/store'
import SearchInput from './SearchInput.vue'
import { Input, Button } from 'ant-design-vue'

const tabList = [
  {
    key: 'find',
    label: '查找',
  },
  {
    key: 'replace',
    label: '替换',
  },
]

export default defineComponent({
  name: 'search-panel',
  emits: ['select'],
  components: {
    SearchInput,
    Input,
    Button,
  },
  setup(props, { emit }) {
    const selectedTabKey = ref(tabList[0].key)
    const { searchObj } = storeToRefs(useMainStore())
    const { replace, replaceAll } = useSearch()

    return {
      tabList,
      selectedTabKey,
      searchObj,
      replace,
      replaceAll,
    }
  },
})
</script>

<style lang="scss" scoped>
.search-panel {
  box-sizing: border-box;
  width: 281px;
  display: flex;
  flex-direction: column;

  .tabs {
    display: flex;
    align-items: center;
    border-bottom: 1px solid $borderColor;
    margin-left: 8px;
  }
  .tab {
    position: relative;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
    .text {
      padding-bottom: 4px;
      font-weight: 500;
    }
    .selected {
      color: $themeColor;
    }
    .line {
      position: absolute;
      box-sizing: border-box;
      bottom: 0;
      width: 60%;
      height: 2px;
      background-color: $themeColor;
    }
  }
  .panel-list {
    box-sizing: border-box;
    padding: 16px 20px 0px 20px;
    margin: 0 -12px;
    flex: 1;
    font-size: 14px;
    @include overflow-overlay();
    @include flex-grid-layout();
  }
  .panel-item {
    width: 100%;
  }
  .line-item {
    display: flex;
    margin-bottom: 12px;
    justify-content: space-between;
    .line-title {
      line-height: 32px;
      font-size: 13px;
    }
    .search-input,.ant-input {
      width: 210px;
    }
  }
  .line-item-btn {
    justify-content: end;
  }
  .ant-btn {
    width: 63px;
    height: 28px;
    border-radius: 4px;
    padding: 0px;
    font-size: 12px;
    line-height: 12px;
    font-weight: 400;
  }
  .ant-btn:hover {
    color: #41464b;
  }
  .ant-btn-primary {
    margin-left: 12px;
  }
  .ant-btn-primary:hover {
    color: #fff;
  }
}
</style>
