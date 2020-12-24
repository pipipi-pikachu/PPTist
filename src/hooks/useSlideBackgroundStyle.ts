import { Ref, computed } from 'vue'
import { SlideBackground } from '@/types/slides'

export default (background: Ref<SlideBackground | undefined>) => {
  const backgroundStyle = computed(() => {
    if(!background.value) return { backgroundColor: '#fff' }

    const { type, value } = background.value
    if(type === 'solid') return { backgroundColor: value }
    else if(type === 'image') return { backgroundImage: `url(${value}` }

    return { backgroundColor: '#fff' }
  })

  return {
    backgroundStyle,
  }
}