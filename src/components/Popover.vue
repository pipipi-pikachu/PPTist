<template>
  <APopover trigger="click" overlayClassName="popover">
    <template v-slot:content>
      <slot name="content"></slot>
    </template>
    <slot></slot>
  </APopover>
</template>

<script>
import { Popover } from 'ant-design-vue'

export default {
  name: 'popover',
  components: {
    APopover: Popover,
  },
}
</script>

<style lang="scss">
.popover {
  padding-top: 6px;

  .ant-popover-arrow {
    display: none;
  }
  .ant-popover-inner {
    border: 1px solid #eee;
    box-shadow: 3px 3px 3px rgba(#000, 0.15);
  }
}
</style>