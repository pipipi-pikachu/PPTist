<template>
  <div 
    class="mask"
    @contextmenu.prevent="removeContextmenu()"
    @mousedown="removeContextmenu()"
  ></div>

  <div 
    class="contextmenu"
    :style="{
      left: style.left + 'px',
      top: style.top + 'px',
    }"
    @contextmenu.prevent
  >
    <MenuContent 
      :menus="menus"
      :handleClickMenuItem="handleClickMenuItem" 
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { ContextmenuItem, Axis } from './types'

import MenuContent from './MenuContent.vue'

const props = defineProps({
  axis: {
    type: Object as PropType<Axis>,
    required: true,
  },
  el: {
    type: Object as PropType<HTMLElement>,
    required: true,
  },
  menus: {
    type: Array as PropType<ContextmenuItem[]>,
    required: true,
  },
  removeContextmenu: {
    type: Function,
    required: true,
  },
})

const style = computed(() => {
  const MENU_WIDTH = 170
  const MENU_HEIGHT = 30
  const DIVIDER_HEIGHT = 11
  const PADDING = 5

  const { x, y } = props.axis
  const menuCount = props.menus.filter(menu => !(menu.divider || menu.hide)).length
  const dividerCount = props.menus.filter(menu => menu.divider).length

  const menuWidth = MENU_WIDTH
  const menuHeight = menuCount * MENU_HEIGHT + dividerCount * DIVIDER_HEIGHT + PADDING * 2

  const screenWidth = document.body.clientWidth
  const screenHeight = document.body.clientHeight

  return {
    left: screenWidth <= x + menuWidth ? x - menuWidth : x,
    top: screenHeight <= y + menuHeight ? y - menuHeight : y,
  }
})

const handleClickMenuItem = (item: ContextmenuItem) => {
  if (item.disable) return
  if (item.children && !item.handler) return
  if (item.handler) item.handler(props.el)
  props.removeContextmenu()
}
</script>

<style lang="scss">
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
}
.contextmenu {
  position: fixed;
  z-index: 9999;
  user-select: none;
}
</style>