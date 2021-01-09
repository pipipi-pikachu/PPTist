import { Ref, computed } from 'vue'
import { SlideBackground } from '@/types/slides'

export default (background: Ref<SlideBackground | undefined>) => {
  const backgroundStyle = computed(() => {
    if(!background.value) return { backgroundColor: '#fff' }

    const { type, value, size } = background.value
    if(type === 'solid') return { backgroundColor: value }
    else if(type === 'image') {
      if(size === 'repeat') {
        return {
          backgroundImage: `url(${value}`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'initial',
        }
      }
      return {
        backgroundImage: `url(${value}`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: size,
      }
    }

    return { backgroundColor: '#fff' }
  })

  return {
    backgroundStyle,
  }
}