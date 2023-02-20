<template>
  <section class="q-pt-md">
    <doctor-list />
  </section>
</template>

<script lang="ts">
  import { defineAsyncComponent, defineComponent } from 'vue'
  export default defineComponent({
    name: 'Doctors',
    components: {
      DoctorList: defineAsyncComponent(() => import('./components/DoctorList.vue')),
    },
  })
</script>

<style lang="scss" scoped></style>
<route lang="yaml">
meta:
  requiresAuth: true
  title: 'Quản lý Bác sĩ'
</route>
