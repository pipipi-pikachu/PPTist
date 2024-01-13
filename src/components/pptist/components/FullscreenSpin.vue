<template>
  <div class="fullscreen-spin" v-if="loading">
    <div class="spin">
      <div class="spinner"></div>
      <div class="text">{{tip}}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  loading?: boolean
  tip?: string
}>(), {
  loading: false,
  tip: '',
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
.spin {
  width: 200px;
  height: 200px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -100px;
  margin-left: -100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid $themeColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spinner .8s linear infinite;
}
.text {
  margin-top: 20px;
  color: $themeColor;
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>