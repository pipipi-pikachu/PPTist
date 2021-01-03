<template>
  <div class="element-positopn-panel">
    <ButtonGroup class="row">
      <Button style="flex: 1;">顶</Button>
      <Button style="flex: 1;">底</Button>
      <Button style="flex: 1;">上移</Button>
      <Button style="flex: 1;">下移</Button>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Button style="flex: 1;">左</Button>
      <Button style="flex: 1;">中</Button>
      <Button style="flex: 1;">右</Button>
    </ButtonGroup>
    <ButtonGroup class="row">
      <Button style="flex: 1;">上</Button>
      <Button style="flex: 1;">中</Button>
      <Button style="flex: 1;">下</Button>
    </ButtonGroup>

    <Divider />

    <div class="row">
      <div style="flex: 3;">位置：</div>
      <InputNumber style="flex: 4;" />
      <div style="flex: 1;"></div>
      <InputNumber style="flex: 4;" />
    </div>
    <div class="row">
      <div style="flex: 3;"></div>
      <div style="flex: 4;" class="label">X</div>
      <div style="flex: 1;"></div>
      <div style="flex: 4;" class="label">Y</div>
    </div>
    <div class="row">
      <div style="flex: 3;">大小：</div>
      <InputNumber style="flex: 4;" />
      <LockOutlined style="flex: 1;" class="icon-btn" />
      <InputNumber style="flex: 4;" />
    </div>
    <div class="row">
      <div style="flex: 3;"></div>
      <div style="flex: 4;" class="label">宽</div>
      <div style="flex: 1;"></div>
      <div style="flex: 4;" class="label">高</div>
    </div>

    <Divider />

    <div class="row">
      <div style="flex: 3;">旋转：</div>
      <RotateLeftOutlined class="icon-btn" style="flex: 2;" />
      <RotateRightOutlined class="icon-btn" style="flex: 2;" />
      <div style="flex: 1;"></div>
      <InputNumber style="flex: 4;" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { InputNumber, Divider, Button } from 'ant-design-vue'
import {
  LockOutlined,
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
    RotateLeftOutlined,
    RotateRightOutlined,
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