<template>
  <div class="link-handler" :style="{ top: elementInfo.height * canvasScale + 10 + 'px' }">
    <a class="link" v-if="elementInfo.link.type === 'web'" :href="elementInfo.link.target" target="_blank">{{elementInfo.link.target}}</a>
    <a class="link" v-else>幻灯片页面 {{elementInfo.link.target}}</a>
    <div class="btns">
      <div class="btn" @click="openLinkDialog()">更换</div>
      <Divider type="vertical" />
      <div class="btn" @click="removeLink(elementInfo)">移除</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
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
    const { canvasScale } = storeToRefs(useMainStore())

    const { removeLink } = useLink()

    return {
      canvasScale,
      removeLink,
    }
  },
})
</script>

<style lang="scss" scoped>
.link-handler {
  height: 30px;
  position: absolute;
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
  max-width: 300px;
  margin-right: 20px;
  word-break: keep-all;
  white-space: nowrap;

  @include ellipsis-oneline();
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