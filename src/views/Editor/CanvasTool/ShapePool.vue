<template>
  <ul class="shape-pool">
    <li class="shape-item" v-for="(shape, index) in shapeList" :key="index">
      <div class="shape-content" @click="selectShape(shape)">
        <SvgWrapper 
          overflow="visible" 
          width="20"
          height="20"
        >
          <g 
            :transform="`scale(${20 / shape.viewBox}, ${20 / shape.viewBox}) translate(0,0) matrix(1,0,0,1,0,0)`"
          >
            <path 
              vector-effect="non-scaling-stroke" 
              stroke-linecap="butt" 
              stroke-miterlimit="8"
              stroke-linejoin
              fill="transparent"
              stroke="#999"
              stroke-width="2" 
              :d="shape.path"
            ></path>
          </g>
        </SvgWrapper>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SHAPE_LIST, ShapePoolItem } from '@/configs/shapes'

export default defineComponent({
  name: 'shape-pool',
  setup(props, { emit }) {
    const shapeList = SHAPE_LIST

    const selectShape = (shape: ShapePoolItem) => {
      emit('select', shape)
    }

    return {
      shapeList,
      selectShape,
    }
  },
})
</script>

<style lang="scss" scoped>
.shape-pool {
  width: 400px;
  max-height: 400px;
  overflow: auto;
  margin-bottom: -5px;

  @include grid-layout-wrapper();
}
.shape-item {
  @include grid-layout-item(10, 9%);

  height: 0;
  padding-bottom: 9%;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
}
.shape-content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  svg:not(:root) {
    overflow: visible;
  }
}
</style>