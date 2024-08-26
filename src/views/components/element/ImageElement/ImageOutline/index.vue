<template>
  <div class="image-outline">
    <ImageRectOutline
      v-if="clipShape.type === 'rect'"
      :width="elementInfo.width"
      :height="elementInfo.height"
      :radius="clipShape.radius"
      :outline="elementInfo.outline"
    />
    <ImageEllipseOutline
      v-else-if="clipShape.type === 'ellipse'"
      :width="elementInfo.width"
      :height="elementInfo.height"
      :outline="elementInfo.outline"
    />
    <ImagePolygonOutline
      v-else-if="clipShape.type === 'polygon'"
      :width="elementInfo.width"
      :height="elementInfo.height"
      :outline="elementInfo.outline"
      :createPath="clipShape.createPath!"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PPTImageElement } from '@/types/slides'
import useClipImage from '../useClipImage'

import ImageRectOutline from './ImageRectOutline.vue'
import ImageEllipseOutline from './ImageEllipseOutline.vue'
import ImagePolygonOutline from './ImagePolygonOutline.vue'

const props = defineProps<{
  elementInfo: PPTImageElement
}>()

const imageElement = computed(() => props.elementInfo)
const { clipShape } = useClipImage(imageElement)
</script>