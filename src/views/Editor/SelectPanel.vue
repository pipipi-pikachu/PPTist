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
    <div class="handler" v-if="elements.length">
      <div class="btns">
        <Button size="small" style="margin-right: 5px;" @click="showAllElements()">全部显示</Button>
        <Button size="small" @click="hideAllElements()">全部隐藏</Button>
      </div>
      <div class="icon-btns" v-if="handleElement">
        <IconDown class="icon-btn" @click="orderElement(handleElement!, ElementOrderCommands.UP)" />
        <IconUp class="icon-btn" @click="orderElement(handleElement!, ElementOrderCommands.DOWN)" />
      </div>
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
            @dblclick="enterEdit(groupItem.id)"
          >
            <input 
              :id="`select-panel-input-${groupItem.id}`" 
              :value="groupItem.name || ELEMENT_TYPE_ZH[groupItem.type]" 
              class="input" 
              type="text" 
              v-if="editingElId === groupItem.id" 
              @blur="$event => saveElementName($event, groupItem.id)"
              @keydown.enter="$event => saveElementName($event, groupItem.id)"
            >
            <div v-else class="name">{{groupItem.name || ELEMENT_TYPE_ZH[groupItem.type]}}</div>
            <div class="icons">
              <IconPreviewClose style="font-size: 17px;" @click.stop="toggleHideElement(groupItem.id)" v-if="hiddenElementIdList.includes(groupItem.id)" />
              <IconPreviewOpen style="font-size: 17px;" @click.stop="toggleHideElement(groupItem.id)" v-else />
            </div>
          </div>
        </div>
        <div 
          class="item" 
          :class="{ 'active': activeElementIdList.includes(item.id) }"
          v-else 
          @click="selectElement(item.id)"
          @dblclick="enterEdit(item.id)"
        >
          <input 
            :id="`select-panel-input-${item.id}`" 
            :value="item.name || ELEMENT_TYPE_ZH[item.type]" 
            class="input" 
            type="text" 
            v-if="editingElId === item.id" 
            @blur="$event => saveElementName($event, item.id)"
            @keydown.enter="$event => saveElementName($event, item.id)"
          >
          <div v-else class="name">{{item.name || ELEMENT_TYPE_ZH[item.type]}}</div>
          <div class="icons">
            <IconPreviewClose style="font-size: 17px;" @click.stop="toggleHideElement(item.id)" v-if="hiddenElementIdList.includes(item.id)" />
            <IconPreviewOpen style="font-size: 17px;" @click.stop="toggleHideElement(item.id)" v-else />
          </div>
        </div>
      </template>
    </div>
  </MoveablePanel>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore, useMainStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import { ELEMENT_TYPE_ZH } from '@/configs/element'
import useOrderElement from '@/hooks/useOrderElement'
import useHideElement from '@/hooks/useHideElement'
import useSelectElement from '@/hooks/useSelectElement'
import { ElementOrderCommands } from '@/types/edit'

import MoveablePanel from '@/components/MoveablePanel.vue'
import Button from '@/components/Button.vue'

const slidesStore = useSlidesStore()
const mainStore = useMainStore()
const { currentSlide } = storeToRefs(slidesStore)
const { handleElement, handleElementId, activeElementIdList, activeGroupElementId, hiddenElementIdList } = storeToRefs(mainStore)

const { orderElement } = useOrderElement()
const { selectElement } = useSelectElement()
const { toggleHideElement, showAllElements, hideAllElements } = useHideElement()

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

const editingElId = ref('')

const saveElementName = (e: FocusEvent | KeyboardEvent, id: string) => {
  const name = (e.target as HTMLInputElement).value
  slidesStore.updateElement({ id, props: { name } })
  editingElId.value = ''
}

const enterEdit = (id: string) => {
  editingElId.value = id
  nextTick(() => {
    const inputRef = document.querySelector(`#select-panel-input-${id}`) as HTMLInputElement
    inputRef.focus()
  })
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
.handler {
  height: 24px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .icon-btns {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .icon-btn {
    width: 16px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      color: $themeColor;
    }
  }
}
.element-list {
  height: calc(100% - 32px);
  padding-right: 10px;
  margin-right: -10px;
  overflow: auto;
}
.item {
  padding: 5px;
  font-size: 12px;
  border-radius: $borderRadius;
  display: flex;
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

  .name {
    height: 18px;
    line-height: 18px;
    flex: 1;
    @include ellipsis-oneline();
  }
  .icons {
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
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
.input {
  width: 100%;
  height: 16px;
  border: 0;
  outline: 0;
  padding-left: 0;
  padding-right: 0;
  flex: 1;
  font-size: 12px;
  background-color: transparent;
}
</style>