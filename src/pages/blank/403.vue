<template>
  <q-page class="v-bg">
    <div class="absolute-center z-top text-center">
      <h1 class="text-h4">Bạn không được ủy quyền! 🔐</h1>
      <p class="text-body1">
        {{ 'Bạn không có quyền truy cập trang này!' }}
      </p>
      <div class="full-width q-mx-auto q-my-lg">
        <q-img
          src="@/assets/img/not-authorized.png"
          style="width: 700px; height: auto"
          fit="contain" />
      </div>
      <q-btn
        text-color="white"
        class="bg-gradient-primary"
        label="Quay lại"
        @click="onSignOut"
        rounded
        padding="xs lg"
        size="md" />
    </div>
    <q-img
      class="absolute-bottom-left"
      src="@/assets/img/bg4.png"
      style="width: 300px; height: 226px; z-index: 2"
      fit="contain" />
    <q-img
      class="absolute-bottom"
      src="@/assets/img/bg5.png"
      style="width: 100%; height: auto; z-index: 1"
      fit="contain" />
  </q-page>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useEnhancer } from '@/app/enhancer'
  import { useAuthenticate } from '@/hooks/useAuthenticate'

  export default defineComponent({
    name: 'AccessDenied',
    setup() {
      const { authStore } = useEnhancer()
      const { signOut } = useAuthenticate()

      const onSignOut = () => {
        signOut()
        authStore.resetDefault().then(() => {
          location.href = '/login'
        })
      }

      return {
        authStore,
        onSignOut,
      }
    },
  })
</script>

<route lang="yaml">
meta:
  layout: blank
</route>
