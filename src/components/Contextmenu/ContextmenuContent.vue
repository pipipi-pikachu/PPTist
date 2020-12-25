<template>
  <ul class="contextmenu-content">
    <template v-for="(menu, index) in menus">
      <li
        v-if="!menu.hide"
        class="contextmenu-item"
        :key="menu.text || index"
        @click.stop="handleClickMenuItem(menu)"
        :class="{'divider': menu.divider, 'disable': menu.disable}"
      >
        <div class="contextmenu-item-content" :class="{'has-sub-menu': menu.children}" v-if="!menu.divider">
          <span class="text">{{menu.text}}</span>
          <span class="sub-text" v-if="menu.subText && !menu.children">{{menu.subText}}</span>

          <contextmenu-content 
            class="sub-menu" 
            :style="{
              [subMenuPosition]: '112.5%',
            }"
            :menus="menu.children" 
            v-if="menu.children && menu.children.length"
            :handleClickMenuItem="handleClickMenuItem" 
          />
        </div>
      </li>
    </template>
  </ul>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { ContextmenuItem } from './types'

export default {
  name: 'contextmenu-content',
  props: {
    menus: {
      type: Array as PropType<ContextmenuItem[]>,
      required: true,
    },
    subMenuPosition: {
      type: String,
      default: 'left',
    },
    handleClickMenuItem: {
      type: Function,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
$menuWidth: 160px;
$menuHeight: 32px;
$subMenuWidth: 120px;

.contextmenu-content {
  width: $menuWidth;
  padding: 5px 0;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 3px 3px 3px rgba(#000, 0.3);
  border-radius: 2px;
  list-style: none;
  margin: 0;
}
.contextmenu-item {
  padding: 0 20px;
  color: #555;
  font-size: 12px;
  transition: all 0.2s;
  white-space: nowrap;
  height: $menuHeight;
  line-height: $menuHeight;
  background-color: #fff;
  cursor: pointer;

  &:not(.disable):hover > .contextmenu-item-content > .sub-menu {
    display: block;
  }

  &:hover:not(.disable) {
    background-color: #e1e1e1;
  }

  &.divider {
    height: 1px;
    overflow: hidden;
    margin: 5px;
    background-color: #e5e5e5;
    line-height: 0;
    padding: 0;
  }

  &.disable {
    color: #b1b1b1;
    cursor: no-drop;
  }
}
.contextmenu-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &.has-sub-menu::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-left: 6px solid rgba($color: $themeColor, $alpha: .8);
    border-bottom: 4px solid transparent;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .sub-text {
    opacity: 0.6;
  }
  .sub-menu {
    position: absolute;
    top: -5px;
    display: none;
    width: $subMenuWidth;
  }
}
</style>