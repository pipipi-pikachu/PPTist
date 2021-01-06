import { ref, Ref, watchEffect } from 'vue'
import { PPTElementShadow } from '@/types/slides'

export default (shadow: Ref<PPTElementShadow | undefined>) => {
  const shadowStyle = ref('')

  watchEffect(() => {
    if(shadow.value) {
      const { h, v, blur, color } = shadow.value
      shadowStyle.value = `${h}px ${v}px ${blur}px ${color}`
    }
    else shadowStyle.value = ''
  })

  return {
    shadowStyle,
  }
}