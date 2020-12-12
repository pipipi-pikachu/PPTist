<template>
  <div class="contextmenu" 
    ref="contextmenuRef"
    v-show="visible" 
    :style="{
      left: style.left,
      top: style.top,
    }"
    @contextmenu.prevent
    v-click-outside="removeContextMenu"
  >
    <ContextmenuContent 
      :menus="menus" 
      :isDark="isDark"
      :subMenuPosition="style.subMenuPosition" 
      :handleClickMenuItem="handleClickMenuItem" 
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, PropType } from 'vue'
import { ContextmenuItem, Axis } from './types'

import ContextmenuContent from './ContextmenuContent.vue'
import clickOutside from '@/plugins/clickOutside'

const MENU_WIDTH = 160
const MENU_HEIGHT = 32
const DIVIDER_HEIGHT = 11
const SUB_MENU_WIDTH = 120

export default defineComponent({
  name: 'contextmenu',
  components: {
    ContextmenuContent,
  },
  directives: {
    'click-outside': clickOutside.directive,
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
    isDark: {
      type: Boolean,
      default: false,
    },
    removeContextMenu: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const contextmenuRef = ref<Element | null>(null)
    const visible = ref(false)

    const style = computed(() => {
      const { x, y } = props.axis
      const normalMenuCount = props.menus.filter(menu => !menu.divider && !menu.hide).length
      const dividerMenuCount = props.menus.filter(menu => menu.divider).length

      const menuWidth = MENU_WIDTH
      const menuHeight = normalMenuCount * MENU_HEIGHT + dividerMenuCount * DIVIDER_HEIGHT

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

      visible.value = false
      item.action && item.action(props.el)

      props.removeContextMenu()
    }

    onMounted(() => {
      nextTick(() => visible.value = true)
    })
    onUnmounted(() => {
      if(contextmenuRef.value) document.body.removeChild(contextmenuRef.value)
    })

    return {
      visible,
      style,
      contextmenuRef,
      handleClickMenuItem,
    }
  },
})
</script>

<style lang="scss">
.contextmenu {
  position: fixed;
  z-index: 9999;
  user-select: none;
}
</style>