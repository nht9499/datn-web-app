<template>
  <section class="q-pt-md">
    <list-histories />
  </section>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent } from 'vue'
  export default defineComponent({
    name: 'Tests',
    components: {
      ListHistories: defineAsyncComponent(() => import('./components/ListHistories.vue')),
    },
  })
</script>

<style lang="scss" scoped></style>
<route lang="yaml">
meta:
  requiresAuth: true
  title: 'Lịch sử kiểm tra'
</route>
