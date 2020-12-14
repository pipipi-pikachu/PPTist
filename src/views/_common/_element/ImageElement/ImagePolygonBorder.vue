<template>
  <SvgWrapper 
    class="image-polygon-border" 
    overflow="visible" 
    :width="width"
    :height="height"
  >
    <path 
      vector-effect="non-scaling-stroke" 
      stroke-linecap="butt" 
      stroke-miterlimit="8"
      stroke-linejoin
      fill="transparent"
      :d="createPath(width, height)"
      :stroke="borderColor"
      :stroke-width="borderWidth" 
      :stroke-dasharray="borderStyle === 'dashed' ? '12 9' : '0 0'" 
    ></path>
	</SvgWrapper>
</template>

<script lang="ts">
export default {
  name: 'image-polygon-border',
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    borderColor: {
      type: String,
      default: '',
    },
    borderWidth: {
      type: Number,
      default: 0,
    },
    borderStyle: {
      type: String,
      default: '',
    },
    createPath: {
      type: Function,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
svg {
  overflow: visible;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
}
</style>