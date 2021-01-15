<template>
  <svg class="icon-font" aria-hidden="true">
    <use :xlink:href="`#${type}`"></use>
  </svg>
</template>

<script lang="ts">
export default {
  name: 'icon-font',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.icon-font {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  outline: 0;
}
</style>