<template>
  <SvgWrapper 
    class="image-ellipse-border" 
    overflow="visible" 
    :width="width"
    :height="height"
  >
    <ellipse 
      vector-effect="non-scaling-stroke" 
      stroke-linecap="butt" 
      stroke-miterlimit="8"
      stroke-linejoin
      fill="transparent"
      :cx="width / 2" 
      :cy="height / 2"
      :rx="width / 2" 
      :ry="height / 2"
      :stroke="borderColor"
      :stroke-width="borderWidth" 
      :stroke-dasharray="borderStyle === 'dashed' ? '12 9' : '0 0'" 
    ></ellipse>
	</SvgWrapper>
</template>

<script lang="ts">
export default {
  name: 'image-ellipse-border',
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