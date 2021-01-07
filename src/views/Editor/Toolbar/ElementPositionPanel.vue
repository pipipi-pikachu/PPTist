<template>
  <div class="element-positopn-panel">
    <ButtonGroup class="row">
      <Button style="flex: 1;" @click="orderElement(handleElement, 'top')">顶</Button>
      <Button style="flex: 1;" @click="orderElement(handleElement, 'bottom')">底</Button>
      <Button style="flex: 1;" @click="orderElement(handleElement, 'up')">上移</Button>
      <Button style="flex: 1;" @click="orderElement(handleElement, 'down')">下移</Button>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Button style="flex: 1;" @click="alignElementToCanvas('left')">左</Button>
      <Button style="flex: 1;" @click="alignElementToCanvas('horizontal')">中</Button>
      <Button style="flex: 1;" @click="alignElementToCanvas('right')">右</Button>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Button style="flex: 1;" @click="alignElementToCanvas('top')">上</Button>
      <Button style="flex: 1;" @click="alignElementToCanvas('vertical')">中</Button>
      <Button style="flex: 1;" @click="alignElementToCanvas('bottom')">下</Button>
    </ButtonGroup>

    <Divider />

    <div class="row">
      <div style="flex: 3;">位置：</div>
      <InputNumber :value="left" style="flex: 4;" />
      <div style="flex: 1;"></div>
      <InputNumber :value="top" style="flex: 4;" />
    </div>
    <div class="row">
      <div style="flex: 3;"></div>
      <div style="flex: 4;" class="label">X</div>
      <div style="flex: 1;"></div>
      <div style="flex: 4;" class="label">Y</div>
    </div>

    <template v-if="handleElement.type !== 'line'">
      <div class="row">
        <div style="flex: 3;">大小：</div>
        <InputNumber :value="width" style="flex: 4;" />
        <template v-if="['image', 'shape'].includes(handleElement.type)">
          <LockOutlined style="flex: 1;" class="icon-btn" v-if="fixedRatio" />
          <UnlockOutlined style="flex: 1;" class="icon-btn" v-else />
        </template>
        <div style="flex: 1;" v-else></div>
        <InputNumber :value="height" style="flex: 4;" />
      </div>
      <div class="row">
        <div style="flex: 3;"></div>
        <div style="flex: 4;" class="label">宽</div>
        <div style="flex: 1;"></div>
        <div style="flex: 4;" class="label">高</div>
      </div>
    </template>

    <template v-if="['text', 'image', 'shape'].includes(handleElement.type)">
      <Divider />

      <div class="row">
        <div style="flex: 3;">旋转：</div>
        <RotateLeftOutlined class="icon-btn" style="flex: 2;" />
        <RotateRightOutlined class="icon-btn" style="flex: 2;" />
        <div style="flex: 1;"></div>
        <InputNumber :value="rotate" style="flex: 4;" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref, watch } from 'vue'
import { useStore } from 'vuex'
import round from 'lodash/round'
import { State } from '@/store'
import { PPTElement } from '@/types/slides'
import useOrderElement from '@/hooks/useOrderElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'

import { InputNumber, Divider, Button } from 'ant-design-vue'
import {
  LockOutlined,
  UnlockOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
} from '@ant-design/icons-vue'

export default defineComponent({
  name: 'element-positopn-panel',
  components: {
    InputNumber,
    Divider,
    Button,
    ButtonGroup: Button.Group,
    LockOutlined,
    UnlockOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
  },
  setup() {
    const store = useStore<State>()
    const handleElement: Ref<PPTElement> = computed(() => store.getters.handleElement)

    const left = ref(0)
    const top = ref(0)
    const width = ref(0)
    const height = ref(0)
    const rotate = ref(0)
    const fixedRatio = ref(false)

    watch(handleElement, () => {
      if(!handleElement.value) return

      left.value = round(handleElement.value.left, 1)
      top.value = round(handleElement.value.top, 1)

      fixedRatio.value = 'fixedRatio' in handleElement.value && !!handleElement.value.fixedRatio

      if(handleElement.value.type !== 'line') {
        width.value = round(handleElement.value.width, 1)
        height.value = round(handleElement.value.height, 1)
        rotate.value = 'rotate' in handleElement.value && handleElement.value.rotate !== undefined ? round(handleElement.value.rotate, 1) : 0
      }
    }, { deep: true, immediate: true })

    const { orderElement } = useOrderElement()
    const { alignElementToCanvas } = useAlignElementToCanvas()

    return {
      handleElement,
      orderElement,
      alignElementToCanvas,
      left,
      top,
      width,
      height,
      rotate,
      fixedRatio,
    }
  },
})
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.label {
  text-align: center;
}
.icon-btn {
  cursor: pointer;
}
</style>