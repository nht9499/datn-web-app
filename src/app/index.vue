<template>
  <section>
    <!-- <div v-if="isShowEnv" :data-env="envMode" class="thumbnail-newlabel"></div> -->
    <router-view />
  </section>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, watch } from 'vue'
  import { useMeta } from 'quasar'
  // import { initPricingPlan } from '@/hooks/usePricingPlan'
  import { useEnhancer } from '@/app/enhancer'
  import { initMeta } from '@/hooks/useMeta'
  import { initEvents } from '@/hooks/useEvents'
  import { META } from '@/configs/app.config'
  import { isDev, isStag, envMode } from '@/app/environment'

  export default defineComponent({
    name: 'RootApp',
    setup() {
      // * Provide Register
      initEvents()
      // initPricingPlan()
      const { title } = initMeta()
      const { route } = useEnhancer()

      const composeTitle = computed<string>(() => {
        if (!(title.value || route.meta?.title)) return META.title
        return [route.meta?.title || title.value, META.title].join(' | ')
      })

      const isShowEnv = computed(() => isDev || isStag)

      onMounted(() => {
        useMeta(() => ({ title: composeTitle.value }))
      })

      watch(title, () => {
        useMeta(() => ({ title: composeTitle.value }))
      })

      return {
        isShowEnv,
        envMode,
      }
    },
  })
</script>
<style lang="scss" scoped>
  .thumbnail-newlabel {
    position: fixed;
    z-index: 5000;
  }
  .thumbnail-newlabel::before {
    border-top: 0 solid transparent;
    border-left: 50px solid var(--q-primary);
    border-bottom: 50px solid transparent;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    z-index: 1;
  }
  .thumbnail-newlabel::after {
    content: attr(data-env);
    font-weight: 600;
    position: absolute;
    left: 2px;
    top: 2px;
    color: #fff;
    transform: rotate(-45deg);
    z-index: 1;
  }
</style>
