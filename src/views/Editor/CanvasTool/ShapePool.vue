<template>
  <div class="shape-pool">
    <div class="category" v-for="item in SHAPE_LIST" :key="item.type">
      <div class="category-name">{{item.type}}</div>
      <div class="shape-list">
        <div class="shape-item" v-for="(shape, index) in item.children" :key="index">
          <div class="shape-content" @click="selectShape(shape)">
            <svg 
              overflow="visible" 
              width="18"
              height="18"
            >
              <g 
                :transform="`scale(${18 / shape.viewBox[0]}, ${18 / shape.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`"
              >
                <path 
                  class="shape-path"
                  :class="{ 'outlined': shape.outlined }"
                  vector-effect="non-scaling-stroke" 
                  stroke-linecap="butt" 
                  stroke-miterlimit="8"
                  :fill="shape.outlined ? '#999' : 'transparent'"
                  :stroke="shape.outlined ? 'transparent' : '#999'"
                  stroke-width="2" 
                  :d="shape.path"
                ></path>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SHAPE_LIST, ShapePoolItem } from '@/configs/shapes'

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
  margin-top: -12px;
  margin-bottom: -12px;
  margin-right: -12px;
  padding-right: 12px;
  padding-top: 12px;
}
.category-name {
  width: 100%;
  font-size: 13px;
  margin-bottom: 10px;
  border-left: 4px solid #aaa;
  background-color: #eee;
  padding: 2px 0 2px 10px;
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
  position: relative;
  cursor: pointer;
}
.shape-content {
  @include absolute-0();

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover .shape-path {
    &:not(.outlined) {
      stroke: $themeColor;
    }
    &.outlined {
      fill: $themeColor;
    }
  }

  svg:not(:root) {
    overflow: visible;
  }
}
</style>