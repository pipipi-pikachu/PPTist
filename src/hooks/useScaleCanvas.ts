import { computed } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes, State } from '@/store'

export default () => {
  const store = useStore<State>()
  const canvasPercentage = computed(() => store.state.canvasPercentage)

  const scaleCanvas = (command: '+' | '-') => {
    let percentage = canvasPercentage.value
    const step = 5
    const max = 120
    const min = 60
    if(command === '+' && percentage <= max) percentage += step
    if(command === '-' && percentage >= min) percentage -= step
    
    store.commit(MutationTypes.SET_CANVAS_PERCENTAGE, percentage)
  }
  
  return {
    scaleCanvas,
  }
}