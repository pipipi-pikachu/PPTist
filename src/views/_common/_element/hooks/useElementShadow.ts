import { Ref } from 'vue'
import { PPTElementShadow } from '@/types/slides'

export default (shadow: Ref<PPTElementShadow | undefined>) => {
  let shadowStyle = ''
  if(shadow.value) {
    const { h, v, blur, color } = shadow.value
    shadowStyle = `${h} ${v} ${blur} ${color}`
  }

  return {
    shadowStyle,
  }
}