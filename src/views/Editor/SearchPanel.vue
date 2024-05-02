<template>
  <MoveablePanel 
    class="search-panel" 
    :width="330" 
    :height="0"
    :left="-270" 
    :top="90"
  >
    <div class="close-btn" @click="close()" @mousedown.stop><IconClose /></div>
    <Tabs 
      :tabs="tabs" 
      v-model:value="type" 
    />

    <div class="content" :class="type" @mousedown.stop>
      <Input class="input" v-model:value="searchWord" placeholder="输入查找内容" @enter="searchNext()" ref="searchInpRef">
        <template #suffix>
          <span class="count">{{searchIndex + 1}}/{{searchResults.length}}</span>
          <Divider type="vertical" />
          <span class="ignore-case"
            :class="{ 'active': modifiers === 'g' }"
            v-tooltip="'忽略大小写'"
            @click="toggleModifiers()"
          >Aa</span>
          <Divider type="vertical" />
          <IconLeft class="next-btn left" @click="searchPrev()" v-tooltip="'上一个'" />
          <IconRight class="next-btn right" @click="searchNext()" v-tooltip="'下一个'" />
        </template>
      </Input>
      <Input class="input" v-model:value="replaceWord" placeholder="输入替换内容" @enter="replace()" v-if="type === 'replace'"></Input>
      <div class="footer" v-if="type === 'replace'">
        <Button :disabled="!searchWord" style="margin-left: 5px;" @click="replace()">替换</Button>
        <Button :disabled="!searchWord" type="primary" style="margin-left: 5px;" @click="replaceAll()">全部替换</Button>
      </div>
    </div>
  </MoveablePanel>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useMainStore } from '@/store'
import useSearch from '@/hooks/useSearch'
import MoveablePanel from '@/components/MoveablePanel.vue'
import Tabs from '@/components/Tabs.vue'
import Divider from '@/components/Divider.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'

type TypeKey = 'search' | 'replace'
interface TabItem {
  key: TypeKey
  label: string
}

const mainStore = useMainStore()

const {
  searchWord,
  replaceWord,
  searchResults,
  searchIndex,
  modifiers,
  searchNext,
  searchPrev,
  replace,
  replaceAll,
  toggleModifiers,
} = useSearch()

const type = ref<TypeKey>('search')
const tabs: TabItem[] = [
  { key: 'search', label: '查找' },
  { key: 'replace', label: '替换' },
]

const close = () => {
  mainStore.setSearchPanelState(false)
}

const searchInpRef = ref<InstanceType<typeof Input>>()
onMounted(() => {
  searchInpRef.value!.focus()
})

watch(type, () => {
  nextTick(() => {
    searchInpRef.value!.focus()
  })
})
</script>

<style lang="scss" scoped>
.search-panel {
  font-size: 13px;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.input {
  margin-top: 10px;
}
.count {
  font-size: 12px;
  margin-right: 8px;
  user-select: none;
}
.ignore-case {
  font-size: 12px;
  user-select: none;
  cursor: pointer;

  &.active {
    color: $themeColor;
  }
}
.next-btn {
  width: 22px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 !important;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: $themeColor;
  }
}
.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}
.close-btn {
  width: 32px;
  height: 32px;
  position: absolute;
  top: 8px;
  right: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 13px;
  cursor: pointer;
}
</style>