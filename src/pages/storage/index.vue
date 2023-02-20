<template>
  <section class="q-pt-md">
    <list-files />
  </section>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent } from 'vue'
  export default defineComponent({
    name: 'Tests',
    components: {
      ListFiles: defineAsyncComponent(() => import('./components/ListFiles.vue')),
    },
  })
</script>

<style lang="scss" scoped></style>
<route lang="yaml">
meta:
  requiresAuth: true
  title: 'Quản lý kho ngữ liệu'
</route>
