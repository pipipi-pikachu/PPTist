import { Ref } from 'vue'
import { PPTElementShadow } from '@/types/slides'

export default (shadow: Ref<PPTElementShadow | undefined>) => {
  let shadowStyle = ''
  if(shadow.value) {
    const { h, v, blur, color } = shadow.value
    shadowStyle = `${h}px ${v}px ${blur}px ${color}`
  }

  return {
    shadowStyle,
  }
}