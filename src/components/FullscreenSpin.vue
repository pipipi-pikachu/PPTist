<template>
  <div class="fullscreen-spin" v-if="loading"><Spin :tip="tip" size="large" /></div>
</template>

<script lang="ts" setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  tip: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
.fullscreen-spin {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba($color: #f1f1f1, $alpha: .7);
}
</style>