<template>
  <router-view/>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { MutationTypes } from '@/store/constants'

export default defineComponent({
  name: 'app',
  setup() {
    const store = useStore()
    onMounted(() => {
      store.commit(MutationTypes.SET_AVAILABLE_FONTS)
    })
  },
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>