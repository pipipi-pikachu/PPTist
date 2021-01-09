<template>
  <div class="element-positopn-panel">
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="置顶层">
        <Button style="flex: 1;" @click="orderElement(handleElement, 'top')"><IconFont type="icon-layer-top" /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="置底层">
        <Button style="flex: 1;" @click="orderElement(handleElement, 'bottom')"><IconFont type="icon-layer-bottom" /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="上移一层">
        <Button style="flex: 1;" @click="orderElement(handleElement, 'up')"><IconFont type="icon-layer-up" /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="下移一层">
        <Button style="flex: 1;" @click="orderElement(handleElement, 'down')"><IconFont type="icon-layer-down" /></Button>
      </Tooltip>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="左对齐">
        <Button style="flex: 1;" @click="alignElementToCanvas('left')"><IconFont type="icon-align-left" /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="水平居中">
        <Button style="flex: 1;" @click="alignElementToCanvas('horizontal')"><IconFont type="icon-align-vertical-center" /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="右对齐">
        <Button style="flex: 1;" @click="alignElementToCanvas('right')"><IconFont type="icon-align-right" /></Button>
      </Tooltip>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="上对齐">
        <Button style="flex: 1;" @click="alignElementToCanvas('top')"><IconFont type="icon-align-top" /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="垂直居中">
        <Button style="flex: 1;" @click="alignElementToCanvas('vertical')"><IconFont type="icon-align-horizontal-center" /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="下对齐">
        <Button style="flex: 1;" @click="alignElementToCanvas('bottom')"><IconFont type="icon-align-bottom" /></Button>
      </Tooltip>
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
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="解除宽高比锁定" v-if="fixedRatio">
            <IconFont type="icon-lock" style="flex: 1;" class="icon-btn" @click="updateFixedRatio(false)" />
          </Tooltip>
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="宽高比锁定" v-else>
            <IconFont type="icon-unlock" style="flex: 1;" class="icon-btn" @click="updateFixedRatio(true)" />
          </Tooltip>
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
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="逆时针旋转">
          <IconFont type="icon-rotate-left" class="icon-btn" @click="updateRotate45('-')" style="flex: 2;" />
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="顺时针旋转">
          <IconFont type="icon-rotate-right" class="icon-btn" @click="updateRotate45('+')" style="flex: 2;" />
        </Tooltip>
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

export default defineComponent({
  name: 'element-positopn-panel',
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