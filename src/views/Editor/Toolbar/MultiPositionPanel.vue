<template>
  <div class="multi-position-panel">
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

    <ButtonGroup class="row">
      <Button style="flex: 1;">组合</Button>
      <Button style="flex: 1;">取消组合</Button>
    </ButtonGroup>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Button, Divider } from 'ant-design-vue'

export default defineComponent({
  name: 'multi-position-panel',
  components: {
    Button,
    ButtonGroup: Button.Group,
    Divider,
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
</style>