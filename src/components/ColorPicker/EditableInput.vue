<template>
  <div class="editable-input">
    <input
      class="input-content"
      :value="val"
      @input="$event => handleInput($event)"
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import tinycolor, { ColorFormats } from 'tinycolor2'

export default defineComponent({
  name: 'editable-input',
  emits: ['colorChange'],
  props: {
    value: {
      type: Object as PropType<ColorFormats.RGBA>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const val = computed(() => {
      let _hex = ''
      if (props.value.a < 1) _hex = tinycolor(props.value).toHex8String().toUpperCase()
      else _hex = tinycolor(props.value).toHexString().toUpperCase()
      return _hex.replace('#', '')
    })

    const handleInput = (e: Event) => {
      const value = (e.target as HTMLInputElement).value
      if (value.length >= 6) emit('colorChange', tinycolor(value).toRgb())
    }

    return {
      val,
      handleInput,
    }
  },
})
</script>

<style lang="scss" scoped>
.editable-input {
  width: 100%;
  position: relative;
  overflow: hidden;
  text-align: center;
  font-size: 14px;

  &::after {
    content: '#';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
}
.input-content {
  width: 100%;
  padding: 3px;
  border: 0;
  border-bottom: 1px solid #ddd;
  outline: none;
  text-align: center;
}
.input-label {
  text-transform: capitalize;
}
</style>
