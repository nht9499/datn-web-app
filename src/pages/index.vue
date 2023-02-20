<script lang="ts">
import { useEnhancer } from '@/app/enhancer'
import { getRedirectConfig } from '@/configs/nav.config'
// import { useI18n } from 'vue-i18n'
// import { matLanguage } from '@quasar/extras/material-icons'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RootPage',
  setup() {
    const { router, authStore } = useEnhancer()
    router.replace(getRedirectConfig(authStore?.role))
  },
})
</script>
<template>
  <span></span>
</template>