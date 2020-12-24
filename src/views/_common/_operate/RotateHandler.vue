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
  margin: -10px 0 0 -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 1px 1px 2px #888;

  .rotate-icon {
    width: 100%;
    height: 100%;
    font-size: 12px;
    color: #666;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>