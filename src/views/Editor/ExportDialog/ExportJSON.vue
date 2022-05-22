<template>
  <div class="export-json-dialog">
    <div class="preview">
      <pre>{{slides}}</pre>
    </div>

    <div class="btns">
      <Button class="btn export" type="primary" @click="exportJSON()">导出 JSON</Button>
      <Button class="btn close" @click="close()">关闭</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import useExport from '@/hooks/useExport'

export default defineComponent({
  name: 'export-json-dialog',
  setup(props, { emit }) {
    const close = () => emit('close')

    const { slides } = storeToRefs(useSlidesStore())

    const { exportJSON } = useExport()
    
    return {
      slides,
      exportJSON,
      close,
    }
  },
})
</script>

<style lang="scss" scoped>
.export-json-dialog {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.preview {
  width: calc(100% - 20px);
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #2d2d30;
  color: #fff;
}
.btns {
  width: 300px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  .export {
    flex: 1;
  }
  .close {
    width: 100px;
    margin-left: 10px;
  }
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #2d2d30;
}
::-webkit-scrollbar-thumb {
  background-color: #777;
}
</style>