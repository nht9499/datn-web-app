<template>
  <section class="q-pt-md">
    <list-organizations />
  </section>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent } from 'vue'
  export default defineComponent({
    name: 'Organizations',
    components: {
      ListOrganizations: defineAsyncComponent(() => import('./components/ListOrganizations.vue')),
    },
  })
</script>

<style lang="scss" scoped></style>
<route lang="yaml">
meta:
  requiresAuth: true
  title: 'Quản lý Bác sĩ'
</route>
