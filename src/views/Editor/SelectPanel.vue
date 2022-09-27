<template>
  <MoveablePanel 
    class="select-panel" 
    :width="200" 
    :height="360" 
    :title="`选择（${activeElementIdList.length}/${currentSlide.elements.length}）`" 
    :left="-270" 
    :top="90"
    @close="close()"
  >
    <div class="btns" v-if="elements.length">
      <Button size="small" style="margin-right: 5px;" @click="showAll()">全部显示</Button>
      <Button size="small" @click="hideAll()">全部隐藏</Button>
    </div>
    <div class="element-list">
      <template v-for="item in elements" :key="item.id">
        <div class="group-els" v-if="item.type === 'group'">
          <div class="group-title">组合</div>
          <div 
            class="item" 
            :class="{
              'active': activeElementIdList.includes(groupItem.id),
              'group-active': activeGroupElementId.includes(groupItem.id),
            }"
            v-for="groupItem in item.elements" 
            :key="groupItem.id" 
            @click="selectGroupEl(item, groupItem.id)"
          >
            <div class="name">{{ELEMENT_TYPE_ZH[groupItem.type]}}</div>
            <div class="icons">
              <IconPreviewClose style="font-size: 17px;" @click.stop="hideElement(groupItem.id)" v-if="hiddenElementIdList.includes(groupItem.id)" />
              <IconPreviewOpen style="font-size: 17px;" @click.stop="hideElement(groupItem.id)" v-else />
            </div>
          </div>
        </div>
        <div 
          class="item" 
          :class="{ 'active': activeElementIdList.includes(item.id) }"
          v-else 
          @click="selectEl(item.id)"
        >
          <div class="name">{{ELEMENT_TYPE_ZH[item.type]}}</div>
          <div class="icons">
            <IconPreviewClose style="font-size: 17px;" @click.stop="hideElement(item.id)" v-if="hiddenElementIdList.includes(item.id)" />
            <IconPreviewOpen style="font-size: 17px;" @click.stop="hideElement(item.id)" v-else />
          </div>
        </div>
      </template>
    </div>
  </MoveablePanel>
</template>

<script lang="ts" setup>
import { computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore, useMainStore } from '@/store'
import { PPTElement } from '@/types/slides'
import { ELEMENT_TYPE_ZH } from '@/configs/element'

const slidesStore = useSlidesStore()
const mainStore = useMainStore()
const { currentSlide } = storeToRefs(slidesStore)
const { handleElementId, activeElementIdList, activeGroupElementId, hiddenElementIdList } = storeToRefs(mainStore)

interface GroupElements {
  type: 'group'
  id: string
  elements: PPTElement[]
}
type ElementItem = PPTElement | GroupElements

const elements = computed<ElementItem[]>(() => {
  const _elements: ElementItem[] = []

  for (const el of currentSlide.value.elements) {
    if (el.groupId) {
      const lastItem = _elements[_elements.length - 1]

      if (lastItem && lastItem.type === 'group' && lastItem.id && lastItem.id === el.groupId) {
        lastItem.elements.push(el)
      }
      else _elements.push({ type: 'group', id: el.groupId, elements: [el] })
    }
    else _elements.push(el)
  }

  return _elements
})

const selectGroupEl = (item: GroupElements, id: string) => {
  if (handleElementId.value === id) return
  if (hiddenElementIdList.value.includes(id)) return

  const idList = item.elements.map(el => el.id)
  mainStore.setActiveElementIdList(idList)
  mainStore.setHandleElementId(id)
  nextTick(() => mainStore.setActiveGroupElementId(id))
}

const selectEl = (id: string) => {
  if (handleElementId.value === id) return
  if (hiddenElementIdList.value.includes(id)) return

  mainStore.setActiveElementIdList([id])
}

const hideElement = (id: string) => {
  if (hiddenElementIdList.value.includes(id)) {
    mainStore.setHiddenElementIdList(hiddenElementIdList.value.filter(item => item !== id))
  }
  else mainStore.setHiddenElementIdList([...hiddenElementIdList.value, id])

  if (activeElementIdList.value.includes(id)) mainStore.setActiveElementIdList([])
}

const showAll = () => {
  if (hiddenElementIdList.value.length) mainStore.setHiddenElementIdList([])
}
const hideAll = () => {
  mainStore.setHiddenElementIdList(currentSlide.value.elements.map(item => item.id))
  if (activeElementIdList.value.length) mainStore.setActiveElementIdList([])
}

const close = () => {
  mainStore.setSelectPanelState(false)
}
</script>

<style lang="scss" scoped>
.select-panel {
  height: 100%;
  font-size: 12px;
  user-select: none;
}
.btns {
  margin-bottom: 6px;
}
.element-list {
  height: calc(100% - 30px);
  padding-right: 10px;
  margin-right: -10px;
  overflow: auto;
}
.item {
  padding: 5px;
  font-size: 12px;
  border-radius: $borderRadius;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &.active {
    background-color: rgba($color: $themeColor, $alpha: .1);
  }
  &.group-active {
    background-color: rgba($color: $themeColor, $alpha: .2);
  }
  &:hover {
    background-color: rgba($color: $themeColor, $alpha: .25);
  }

  .icons {
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.group-els {
  padding: 5px 0;

  .group-title {
    margin-bottom: 5px;
    padding: 0 5px;
  }
  .item {
    margin-left: 15px;
  }
}
</style>