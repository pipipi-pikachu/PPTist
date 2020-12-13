<template>
  <div class="animation-index">
    <div class="index" v-for="(item, index) in animations" :key="index">
      {{index}}
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { PPTAnimation } from '@/types/slides'

export default {
  name: 'animation-index',
  props: {
    animations: {
      type: Array as PropType<PPTAnimation[]>,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.animation-index {
  position: absolute;
  top: 0;
  left: -22px;
  font-size: 12px;
}
.index {
  width: 20px;
  height: 20px;
  background-color: #fff;
  color: #333;
  border: 1px solid #666;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3px;
}
</style>