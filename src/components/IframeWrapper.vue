<template>
  <iframe 
    class="iframe-wrapper"
    frameborder="0" 
    allowfullscreen="true" 
    :src="src"
    :width="width"
    :height="height"
  ></iframe>
</template>

<script lang="ts">
export default {
  name: 'iframe-wrapper',
  props: {
    src: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
  },
}
</script>

<style lang="scss" scoped>
.iframe-wrapper {
  transform-origin: 0 0;
  display: block;
}
</style>