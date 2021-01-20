import { Ref, computed } from 'vue'
import { SlideBackground } from '@/types/slides'

export default (background: Ref<SlideBackground | undefined>) => {
  const backgroundStyle = computed(() => {
    if(!background.value) return { backgroundColor: '#fff' }

    const {
      type,
      color,
      image,
      imageSize,
    } = background.value

    if(type === 'solid') return { backgroundColor: color }
    else if(type === 'image') {
      if(!image) return { backgroundColor: '#fff' }
      if(imageSize === 'repeat') {
        return {
          backgroundImage: `url(${image}`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'initial',
        }
      }
      return {
        backgroundImage: `url(${image}`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: imageSize,
      }
    }

    return { backgroundColor: '#fff' }
  })

  return {
    backgroundStyle,
  }
}