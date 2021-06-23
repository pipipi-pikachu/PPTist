<template>
  <div class="export-dialog">
    <div class="preview">
      <pre>{{slides}}</pre>
    </div>
    <div class="handle">
      <Button class="btn" type="primary" @click="exportJSON()">导出</Button>
      <Button class="btn" @click="emit('close')">关闭</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'
import { saveAs } from 'file-saver'

export default defineComponent({
  name: 'export-dialog',
  setup(props, { emit }) {
    const store = useStore()
    const slides = computed(() => store.state.slides)


    const exportJSON = () => {
      const blob = new Blob([JSON.stringify(slides.value)], { type: '' })
      saveAs(blob, 'pptist_slides.json')
    }

    return {
      slides,
      exportJSON,
      emit,
    }
  },
})
</script>

<style lang="scss" scoped>
.export-dialog {
  height: 500px;
  display: flex;
  justify-content: center;
  position: relative;
}
.preview {
  width: 460px;
  height: 100%;
  overflow: auto;
  margin-right: 20px;
  background-color: #2d2d30;
  color: #fff;

  pre {
    width: 100%;
    height: 100%;
  }
}
.handle {
  flex: 1;

  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>