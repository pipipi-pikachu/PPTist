<template>
  <div class="rotate-handler">
    <div class="rotate-icon"><IconFont type="icon-rotate" /></div>
  </div>
</template>

<script>
export default {
  name: 'rotate-handler',
}
</script>

<style lang="scss" scoped>
.rotate-handler {
  position: absolute;
  top: -24px;
  margin: -12px 0 0 -12px;
  width: 24px;
  height: 24px;
  background-color: #333;
  border-radius: 50%;
  color: #fff;

  .rotate-icon {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>