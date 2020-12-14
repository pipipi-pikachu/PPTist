<template>
  <SvgWrapper 
    class="image-rect-border" 
    overflow="visible" 
    :width="width"
    :height="height"
  >
    <rect 
      vector-effect="non-scaling-stroke" 
      stroke-linecap="butt" 
      stroke-miterlimit="8"
      stroke-linejoin
      fill="transparent"
      :rx="radius" 
      :ry="radius"
      :width="width"
      :height="height"
      :stroke="borderColor"
      :stroke-width="borderWidth" 
      :stroke-dasharray="borderStyle === 'dashed' ? '12 9' : '0 0'" 
    ></rect>
	</SvgWrapper>
</template>

<script lang="ts">
export default {
  name: 'image-rect-border',
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
    radius: {
      type: String,
      default: '0',
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