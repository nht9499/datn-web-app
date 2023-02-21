<template>
  <section class="q-pt-md">
    <test-stepper />
  </section>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent } from 'vue'
  export default defineComponent({
    name: 'Tests',
    components: {
      TestStepper: defineAsyncComponent(() => import('./components/TestStepper.vue')),
    },
  })
</script>

<style lang="scss" scoped></style>
<route lang="yaml">
meta:
  requiresAuth: true
  title: 'Kiểm tra tương đồng'
</route>
