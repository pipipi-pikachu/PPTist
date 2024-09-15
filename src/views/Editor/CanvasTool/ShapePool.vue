<template>
  <div class="shape-pool">
    <div class="category" v-for="item in SHAPE_LIST" :key="item.type">
      <div class="category-name">{{item.type}}</div>
      <div class="shape-list">
        <ShapeItemThumbnail 
          class="shape-item"
          v-for="(shape, index) in item.children" 
          :key="index" 
          :shape="shape" 
          @click="selectShape(shape)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SHAPE_LIST, type ShapePoolItem } from '@/configs/shapes'
import ShapeItemThumbnail from './ShapeItemThumbnail.vue'

const emit = defineEmits<{
  (event: 'select', payload: ShapePoolItem): void
}>()

const selectShape = (shape: ShapePoolItem) => {
  emit('select', shape)
}
</script>

<style lang="scss" scoped>
.shape-pool {
  width: 340px;
  max-height: 520px;
  overflow: auto;
  margin-top: -8px;
  margin-bottom: -8px;
  margin-right: -10px;
  padding-right: 10px;
  padding-top: 10px;
}
.category-name {
  width: 100%;
  font-size: 12px;
  margin-bottom: 10px;
  border-left: 4px solid #bbb;
  background-color: #f1f1f1;
  padding: 3px 0 3px 8px;
  color: #555;
}
.shape-list {
  @include flex-grid-layout();

  margin-bottom: 10px;
}
.shape-item {
  @include flex-grid-layout-children(10, 8%);

  height: 0;
  padding-bottom: 8%;
  flex-shrink: 0;
}
</style>