<template>
  <SvgWrapper 
    class="element-border"
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
      :d="`M0,0 L${width},0 L${width},${height} L0,${height} Z`" 
      :stroke="borderColor"
      :stroke-width="borderWidth" 
      :stroke-dasharray="borderStyle === 'dashed' ? '12 9' : '0 0'" 
    ></path>
	</SvgWrapper>
</template>

<script lang="ts">
export default {
  name: 'element-border',
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
    },
    borderWidth: {
      type: Number,
    },
    borderStyle: {
      type: String,
    },
  },
}
</script>

<style lang="scss" scoped>
svg {
  overflow: visible;
  position: absolute;
  top: 0;
  left: 0;
}
</style>