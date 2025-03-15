<template>
  <Button class="color-btn">
    <div class="blocks">
      <div class="color-block" v-for="(color, index) in colors" :key="index">
        <div class="content" :style="{ backgroundColor: color }"></div>
      </div>
    </div>
    <IconPlatte class="color-btn-icon" />
  </Button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Button from './Button.vue'

const props = defineProps<{
  colors: string[]
}>()

const colors = computed(() => {
  if (props.colors.length > 12) return props.colors.slice(0, 12)
  return props.colors
})
</script>

<style lang="scss" scoped>
.color-btn {
  width: 100%;
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}
.blocks {
  display: flex;
  flex: 1;
  margin-left: 8px;
  outline: 1px dashed rgba($color: #666, $alpha: .12);
}
.color-block {
  height: 20px;
  flex: 1;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAEBJREFUOE9jfPbs2X8GIoCkpCQRqhgYGEcNxBlOo2GIM2iGQLL5//8/UTnl+fPnxOWUUQNxhtNoGOLOKYM+2QAAh2Nq10DwkukAAAAASUVORK5CYII=);

  & + & {
    margin-left: 2px;
  }
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