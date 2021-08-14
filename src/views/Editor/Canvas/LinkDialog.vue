<template>
  <div class="link-dialog">
    <Input v-model:value="link" placeholder="请输入网页链接地址" />

    <div class="btns">
      <Button @click="close()" style="margin-right: 10px;">取消</Button>
      <Button type="primary" @click="save()">确认</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from '@/store'
import { PPTElement } from '@/types/slides'
import useLink from '@/hooks/useLink'

export default defineComponent({
  name: 'link-dialog',
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore()
    const handleElement = computed<PPTElement | null>(() => store.getters.handleElement)

    const link = ref('')

    const { setLink } = useLink()

    onMounted(() => {
      if (handleElement.value?.link) link.value = handleElement.value.link
    })

    const close = () => emit('close')

    const save = () => {
      if (handleElement.value) {
        const success = setLink(handleElement.value, link.value)
        if (success) close()
        else link.value = ''
      }
    }

    return {
      link,
      close,
      save,
    }
  },
})
</script>

<style lang="scss" scoped>
.link-dialog {
  padding: 25px 10px 10px 10px;
}
.btns {
  margin-top: 10px;
  text-align: right;
}
</style>