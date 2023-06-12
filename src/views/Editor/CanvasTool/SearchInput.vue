<template>
  <div class="search-input">
      <Input v-model:value="searchObj.searchText" placeholder="输入查找内容" @pressEnter="search()">
        <template #prefix>
          <IconSearch class="icon-item" />
        </template>
        <template #suffix>
          <span class="num-tip">{{ searchObj.searchIndex }}/{{ searchObj.searchCount }}</span>
          <span class="edge-line"></span>
          <Tooltip title="上一个">
              <IconLeftOne theme="filled" size="10"
                :fill="searchObj.searchIndex > 1 ? '#333' : '#999'"
                @click="prev()"
              />
          </Tooltip>
          <Tooltip title="下一个">
              <IconRightOne theme="filled" size="10"
                :fill="searchObj.searchIndex < searchObj.searchCount ? '#333' : '#999'"
                @click="next()"
              />
          </Tooltip>
        </template>
      </Input>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useSearch from '@/hooks/useSearch'
import { SearchAction } from '@/types/toolbar'
import { Input, InputSearch, Tooltip } from 'ant-design-vue'

export default defineComponent({
  name: 'search-input',
  emits: ['select'],
  props: {
    value: String,
    width: Number,
  },
  components: {
    Input,
    // InputSearch,
    Tooltip,
  },
  setup(props, { emit }) {
    const { searchObj } = storeToRefs(useMainStore())
    const { search } = useSearch()

    const prev = () => {
      search(SearchAction.Prev)
    }
    const next = () => {
      search(SearchAction.Next)
    }

    return {
      searchObj,
      search,
      prev,
      next,
    }
  },
})
</script>

<style lang="scss" scoped>
.search-input {
  box-sizing: border-box;
  height: 32px;
  display: flex;
  flex-direction: column;
  .num-tip {
    color: #999;
    font-size: 12px;
  }
  .edge-line {
    width: 1px;
    background: #eee;
    height: 18px;
    margin: 0 10px;
  }
  .i-icon-left-one {
    margin-right: 8px;
  }
}
</style>
