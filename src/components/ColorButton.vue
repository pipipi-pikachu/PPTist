<template>
  <Button class="color-btn">
    <div class="color-block">
      <div class="content" :style="{ backgroundColor: color }"></div>
    </div>
    <IconPlatte class="color-btn-icon" />
  </Button>
</template>

<script lang="ts" setup>
import Button from './Button.vue'

defineProps<{
  color: string
}>()
</script>

<style lang="scss" scoped>
.color-btn {
  width: 100%;
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}
.color-block {
  height: 20px;
  margin-left: 8px;
  flex: 1;
  outline: 1px dashed rgba($color: #666, $alpha: .12);
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAEBJREFUOE9jfPbs2X8GIoCkpCQRqhgYGEcNxBlOo2GIM2iGQLL5//8/UTnl+fPnxOWUUQNxhtNoGOLOKYM+2QAAh2Nq10DwkukAAAAASUVORK5CYII=);
}
.content {
  width: 100%;
  height: 100%;
}
.color-btn-icon {
  width: 32px;
  font-size: 13px;
  color: #bfbfbf;
}
</style>