<template>
  <div class="loading">
    <div class="loading-spinner"></div>
    <div class="loading-text">{{ text }}</div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  text?: string
}>(), {
  text: '正在加载中，请稍等 ...',
})
</script>

<style lang="scss" scoped>
.loading {
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

  .loading-spinner {
    width: 42px;
    height: 42px;
    border: 3px solid #d14424;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spinner .8s linear infinite;
  }
  .loading-text {
    margin-top: 20px;
    color: #d14424;
  }
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