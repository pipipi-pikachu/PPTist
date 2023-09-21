<template>
  <div class="select-group">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.select-group {
  display: flex;
  align-items: center;

  ::v-deep(.select-wrap) {
    .select {
      border-radius: 0;
      border-left-width: 0;
      border-right-width: 0;
    }

    & + .select-wrap {
      .select {
        border-left-width: 1px;
      }
    }

    &:hover {
      & + .select-wrap {
        .select {
          border-left-color: $themeColor;
        }
      }
    }

    &:first-child {
      .select {
        border-top-left-radius: $borderRadius;
        border-bottom-left-radius: $borderRadius;
        border-left-width: 1px;
      }
    }

    &:last-child {
      .select {
        border-top-right-radius: $borderRadius;
        border-bottom-right-radius: $borderRadius;
        border-right-width: 1px;
      }
    }
  }
}
</style>