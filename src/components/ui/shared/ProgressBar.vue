<template>
  <q-ajax-bar ref="bar" position="top" color="primary" size="3px" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useEnhancer } from '@/app/enhancer'

export default defineComponent({
  name: 'ProgressBar',
  setup() {
    const bar = ref()
    const { router } = useEnhancer()

    router.beforeEach(() => {
      bar.value && bar.value.start(150)
    })

    router.afterEach(() => {
      bar.value && bar.value.stop()
    })

    return {
      bar,
    }
  },
})
</script>
