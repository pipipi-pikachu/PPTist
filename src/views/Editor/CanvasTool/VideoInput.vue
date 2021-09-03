<template>
  <div class="video-input">
    <Input v-model:value="src" placeholder="请输入视频地址，e.g. https://xxx.mp4"></Input>
    <div class="btns">
      <Button @click="close()" style="margin-right: 10px;">取消</Button>
      <Button type="primary" @click="intsertVideo()">确认</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'video-input',
  emits: ['insert', 'close'],
  setup(props, { emit }) {
    const src = ref('https://www.w3school.com.cn/i/movie.ogg')

    const intsertVideo = () => {
      if (!src.value) return message.error('请先输入正确的视频地址')
      emit('insert', src.value)
    }

    const close = () => emit('close')

    return {
      src,
      intsertVideo,
      close,
    }
  },
})
</script>

<style lang="scss" scoped>
.video-input {
  width: 480px;
}
.btns {
  margin-top: 10px;
  text-align: right;
}
</style>
