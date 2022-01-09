<template>
  <div class="element-positopn-panel">
    <div class="title">层级：</div>
    <ButtonGroup class="row">
      <Button style="flex: 1;" @click="orderElement(handleElement, 'top')"><IconSendToBack class="btn-icon" /> 置于顶层</Button>
      <Button style="flex: 1;" @click="orderElement(handleElement, 'bottom')"><IconBringToFrontOne class="btn-icon" /> 置于底层</Button>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Button style="flex: 1;" @click="orderElement(handleElement, 'up')"><IconBringToFront class="btn-icon" /> 上移一层</Button>
      <Button style="flex: 1;" @click="orderElement(handleElement, 'down')"><IconSentToBack class="btn-icon" /> 下移一层</Button>
    </ButtonGroup>

    <Divider />
    
    <div class="title">对齐：</div>
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="左对齐">
        <Button style="flex: 1;" @click="alignElementToCanvas('left')"><IconAlignLeft /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="水平居中">
        <Button style="flex: 1;" @click="alignElementToCanvas('horizontal')"><IconAlignVertically /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="右对齐">
        <Button style="flex: 1;" @click="alignElementToCanvas('right')"><IconAlignRight /></Button>
      </Tooltip>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="上对齐">
        <Button style="flex: 1;" @click="alignElementToCanvas('top')"><IconAlignTop /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="垂直居中">
        <Button style="flex: 1;" @click="alignElementToCanvas('vertical')"><IconAlignHorizontally /></Button>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="下对齐">
        <Button style="flex: 1;" @click="alignElementToCanvas('bottom')"><IconAlignBottom /></Button>
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
          :min="minSize"
          :max="1500"
          :step="5"
          :value="width"
          @change="value => updateWidth(value)"
          style="flex: 4;"
        />
        <template v-if="['image', 'shape', 'audio'].includes(handleElement.type)">
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="解除宽高比锁定" v-if="fixedRatio">
            <IconLock style="flex: 1;" class="icon-btn" @click="updateFixedRatio(false)" />
          </Tooltip>
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="宽高比锁定" v-else>
            <IconUnlock style="flex: 1;" class="icon-btn" @click="updateFixedRatio(true)" />
          </Tooltip>
        </template>
        <div style="flex: 1;" v-else></div>
        <InputNumber 
          :min="minSize"
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

    <template v-if="!['line', 'video', 'audio'].includes(handleElement.type)">
      <Divider />

      <div class="row">
        <div style="flex: 3;">旋转：</div>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="逆时针旋转">
          <IconRotate class="icon-btn" @click="updateRotate45('-')" style="flex: 2;" />
        </Tooltip>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="顺时针旋转">
          <IconRotate 
            class="icon-btn" 
            @click="updateRotate45('+')" 
            :style="{
              flex: 2,
              transform: 'rotateY(180deg)',
            }" 
          />
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
import { computed, defineComponent, ref, watch } from 'vue'
import { round } from 'lodash'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { MIN_SIZE } from '@/configs/element'
import useOrderElement from '@/hooks/useOrderElement'
import useAlignElementToCanvas from '@/hooks/useAlignElementToCanvas'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default defineComponent({
  name: 'element-positopn-panel',
  setup() {
    const slidesStore = useSlidesStore()
    const { handleElement, handleElementId } = storeToRefs(useMainStore())

    const left = ref(0)
    const top = ref(0)
    const width = ref(0)
    const height = ref(0)
    const rotate = ref(0)
    const fixedRatio = ref(false)

    const minSize = computed(() => {
      if (!handleElement.value) return 20
      return MIN_SIZE[handleElement.value.type] || 20
    })

    watch(handleElement, () => {
      if (!handleElement.value) return

      left.value = round(handleElement.value.left, 1)
      top.value = round(handleElement.value.top, 1)

      fixedRatio.value = 'fixedRatio' in handleElement.value && !!handleElement.value.fixedRatio

      if (handleElement.value.type !== 'line') {
        width.value = round(handleElement.value.width, 1)
        height.value = round(handleElement.value.height, 1)
        rotate.value = 'rotate' in handleElement.value && handleElement.value.rotate !== undefined ? round(handleElement.value.rotate, 1) : 0
      }
    }, { deep: true, immediate: true })

    const { orderElement } = useOrderElement()
    const { alignElementToCanvas } = useAlignElementToCanvas()

    const { addHistorySnapshot } = useHistorySnapshot()

    // 设置元素位置
    const updateLeft = (value: number) => {
      const props = { left: value }
      slidesStore.updateElement({ id: handleElementId.value, props })
      addHistorySnapshot()
    }
    const updateTop = (value: number) => {
      const props = { top: value }
      slidesStore.updateElement({ id: handleElementId.value, props })
      addHistorySnapshot()
    }

    // 设置元素宽度、高度、旋转角度
    const updateWidth = (value: number) => {
      const props = { width: value }
      slidesStore.updateElement({ id: handleElementId.value, props })
      addHistorySnapshot()
    }
    const updateHeight = (value: number) => {
      const props = { height: value }
      slidesStore.updateElement({ id: handleElementId.value, props })
      addHistorySnapshot()
    }
    const updateRotate = (value: number) => {
      const props = { rotate: value }
      slidesStore.updateElement({ id: handleElementId.value, props })
      addHistorySnapshot()
    }

    // 固定元素的宽高比
    const updateFixedRatio = (value: boolean) => {
      const props = { fixedRatio: value }
      slidesStore.updateElement({ id: handleElementId.value, props })
      addHistorySnapshot()
    }

    // 将元素旋转45度（顺时针或逆时针）
    const updateRotate45 = (command: '+' | '-') => {
      let _rotate = Math.floor(rotate.value / 45) * 45
      if (command === '+') _rotate = _rotate + 45
      else if (command === '-') _rotate = _rotate - 45

      if (_rotate < -180) _rotate = -180
      if (_rotate > 180) _rotate = 180

      const props = { rotate: _rotate }
      slidesStore.updateElement({ id: handleElementId.value, props })
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
      minSize,
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
.title {
  margin-bottom: 10px;
}
.label {
  text-align: center;
}
.btn-icon {
  margin-right: 3px;
}
.icon-btn {
  cursor: pointer;
}
</style>