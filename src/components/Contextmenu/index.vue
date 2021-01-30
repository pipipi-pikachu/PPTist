<template>
  <div 
    class="mask"
    @contextmenu.prevent="removeContextMenu()"
    @mousedown="removeContextMenu()"
  ></div>

  <div 
    class="contextmenu"
    :style="{
      left: style.left,
      top: style.top,
    }"
    @contextmenu.prevent
  >
    <MenuContent 
      :menus="menus"
      :subMenuPosition="style.subMenuPosition" 
      :handleClickMenuItem="handleClickMenuItem" 
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ContextmenuItem, Axis } from './types'

import MenuContent from './MenuContent.vue'

const MENU_WIDTH = 160
const MENU_HEIGHT = 30
const DIVIDER_HEIGHT = 11
const SUB_MENU_WIDTH = 120

export default defineComponent({
  name: 'contextmenu',
  components: {
    MenuContent,
  },
  props: {
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
    removeContextMenu: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const style = computed(() => {
      const { x, y } = props.axis
      const normalMenuCount = props.menus.filter(menu => !menu.divider && !menu.hide).length
      const dividerMenuCount = props.menus.filter(menu => menu.divider).length
      const padding = 10

      const menuWidth = MENU_WIDTH
      const menuHeight = normalMenuCount * MENU_HEIGHT + dividerMenuCount * DIVIDER_HEIGHT + padding

      const maxMenuWidth = MENU_WIDTH + SUB_MENU_WIDTH - 10

      const screenWidth = document.body.clientWidth
      const screenHeight = document.body.clientHeight

      const left = (screenWidth <= x + menuWidth ? x - menuWidth : x)
      const top = (screenHeight <= y + menuHeight ? y - menuHeight : y)

      const subMenuPosition = screenWidth <= left + maxMenuWidth ? 'right' : 'left'

      return {
        left: left + 'px',
        top: top + 'px',
        subMenuPosition,
      }
    })

    const handleClickMenuItem = (item: ContextmenuItem) => {
      if(item.disable || item.children) return
      if(item.handler) item.handler(props.el)
      props.removeContextMenu()
    }

    return {
      style,
      handleClickMenuItem,
    }
  },
})
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