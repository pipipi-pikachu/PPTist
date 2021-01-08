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
      <InputNumber
        :step="5"
        :value="left"
        @change="value => updateLeft(value)"
        style="flex: 4;"
      />
      <div style="flex: 1;"></div>
      <InputNumber
        :step="5"
        :value="top"
        @change="value => updateTop(value)"
        style="flex: 4;"
      />
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
        <InputNumber
          :min="15"
          :max="1500"
          :step="5"
          :value="width"
          @change="value => updateWidth(value)"
          style="flex: 4;"
        />
        <template v-if="['image', 'shape'].includes(handleElement.type)">
          <LockOutlined style="flex: 1;" class="icon-btn" @click="updateFixedRatio(false)" v-if="fixedRatio" />
          <UnlockOutlined style="flex: 1;" class="icon-btn" @click="updateFixedRatio(true)" v-else />
        </template>
        <div style="flex: 1;" v-else></div>
        <InputNumber 
          :min="15"
          :max="800"
          :step="5"
          :disabled="handleElement.type === 'text'" 
          :value="height" 
          @change="value => updateHeight(value)"
          style="flex: 4;"
        />
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
        <RotateLeftOutlined class="icon-btn" @click="updateRotate45('-')" style="flex: 2;" />
        <RotateRightOutlined class="icon-btn" @click="updateRotate45('+')" style="flex: 2;" />
        <div style="flex: 1;"></div>
        <InputNumber 
          :min="-180"
          :max="180"
          :step="5"
          :value="rotate" 
          @change="value => updateRotate(value)" 
          style="flex: 4;" 
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref, watch } from 'vue'
import { useStore } from 'vuex'
import round from 'lodash/round'
import { MutationTypes, State } from '@/store'
import { PPTElement } from '@/types/slides'
import useOrderElement from '@/hooks/useOrderElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

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

    const { addHistorySnapshot } = useHistorySnapshot()

    const updateLeft = (value: number) => {
      const props = { left: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }
    const updateTop = (value: number) => {
      const props = { top: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }
    const updateWidth = (value: number) => {
      const props = { width: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }
    const updateHeight = (value: number) => {
      const props = { height: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }
    const updateRotate = (value: number) => {
      const props = { rotate: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }
    const updateFixedRatio = (value: boolean) => {
      const props = { fixedRatio: value }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }
    const updateRotate45 = (command: '+' | '-') => {
      let _rotate = Math.floor(rotate.value / 45) * 45
      if(command === '+') _rotate = _rotate + 45
      else if(command === '-') _rotate = _rotate - 45

      if(_rotate < -180) _rotate = -180
      if(_rotate > 180) _rotate = 180

      const props = { rotate: _rotate }
      store.commit(MutationTypes.UPDATE_ELEMENT, { id: handleElement.value.id, props })
      addHistorySnapshot()
    }

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
      updateLeft,
      updateTop,
      updateWidth,
      updateHeight,
      updateRotate,
      updateFixedRatio,
      updateRotate45,
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