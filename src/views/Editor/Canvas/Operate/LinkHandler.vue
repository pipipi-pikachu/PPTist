<template>
  <div class="link-handler">
    <a class="link" :href="elementInfo.link" target="_blank">{{elementInfo.link}}</a>
    <div class="btns">
      <div class="btn" @click="openLinkDialog()">更换</div>
      <Divider type="vertical" />
      <div class="btn" @click="removeLink(elementInfo)">移除</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PPTElement } from '@/types/slides'
import useLink from '@/hooks/useLink'

export default defineComponent({
  name: 'link-handler',
  props: {
    elementInfo: {
      type: Object as PropType<PPTElement>,
      required: true,
    },
    openLinkDialog: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup() {
    const { removeLink } = useLink()

    return {
      removeLink,
    }
  },
})
</script>

<style lang="scss" scoped>
.link-handler {
  height: 30px;
  position: absolute;
  top: -36px;
  left: 0;
  font-size: 12px;
  padding: 0 10px;
  background-color: #fff;
  box-shadow: $boxShadow;
  display: flex;
  align-items: center;
  color: $themeColor;
}
.link {
  margin-right: 20px;
  word-break: keep-all;
  white-space: nowrap;
}
.btns {
  display: flex;
  align-items: center;

  .btn {
    word-break: keep-all;
    cursor: pointer;
  }
}
</style>