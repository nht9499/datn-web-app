<template>
  <q-layout view="lHh lpr lFf" class="fit v-bg">
    <progress-bar />
    <q-header class="shadow-6 bg-blur">
      <q-toolbar>
        <q-toolbar-title class="flex">
          <q-avatar>
            <q-img fetchpriority="high" src="@/assets/img/kitor-logo.png" alt="App logo" />
          </q-avatar>
          <h2 class="text-h5 text-dark text-weight-medium q-ml-md q-mb-none self-center">
            <router-link to="/">
              {{ META.title }}
            </router-link>
          </h2>
        </q-toolbar-title>

        <!-- <the-notification /> -->
        <user-menu />
      </q-toolbar>
      <q-separator />
      <q-toolbar class="text-black q-px-xl">
        <essential-horizontal-link
          v-for="(link, index) in essentialLinks"
          :key="index"
          v-bind="link" />
      </q-toolbar>
    </q-header>

    <q-footer class="v-bg text-grey-9">
      <div class="text-center text-caption q-py-xs">
        COPYRIGHT © {{ $filters.dateFormat(META.date, 'YYYY') }}
        <a class="text-primary" href="https://sk-global.biz/" target="_blank">
          SK-GLOBAL JOINT STOCK COMPANY
        </a>
        <span>, All rights Reserved</span>
      </div>
    </q-footer>

    <q-page-container class="app-content-container q-px-xl">
      <router-view v-slot="{ Component, route }">
        <transition name="scale" mode="out-in">
          <div :key="route.name || ''">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </q-page-container>
    <!-- <incoming-call /> -->
  </q-layout>
  <keep-alive>
    <map-helper ref="googleMap" @ok="onPickMap" />
  </keep-alive>
</template>

<script lang="ts">
  import { ref, defineComponent, onBeforeUnmount, onMounted } from 'vue'
  import {
    EssentialHorizontalLink,
    UserMenu,
    // TheNotification,
    ProgressBar,
    // IncomingCall,
  } from '@/components'
  import { useEvents, EventType } from '@/hooks/useEvents'
  import { useMenus } from '@/hooks/useMenu'
  import { useEnhancer } from '@/app/enhancer'
  import { useAuthenticate } from '@/hooks/useAuthenticate'
  import { META } from '@/configs/app.config'

  export default defineComponent({
    name: 'DefaultLayout',
    components: {
      EssentialHorizontalLink,
      UserMenu,
      // TheNotification,
      ProgressBar,
      // IncomingCall,
    },
    setup() {
      const eventBus = useEvents()
      const { authStore } = useEnhancer()

      // const { staffPingAvailable, clearPingAvailable } = useAuthenticate()
      const { essentialLinks } = useMenus(authStore.role)
      const googleMap = ref()

      const onPickMap = (payload: AnyObject) => {
        eventBus.emit(EventType.PICK_MAP, payload)
      }

      onMounted(() => {
        // TODO Listen event show map
        eventBus.on(EventType.SHOW_MAP, (payload) => {
          googleMap.value.show(payload)
        })
        // if (!authStore.isAdmin) {
        //   staffPingAvailable()
        // }
      })

      // onBeforeUnmount(() => {
      //   eventBus.off(EventType.SHOW_MAP)
      //   clearPingAvailable()
      // })

      return {
        META,
        essentialLinks,
        googleMap,
        onPickMap,
      }
    },
  })
</script>
<style lang="scss" scoped>
  .scale-enter-active,
  .scale-leave-active {
    transition: all 0.2s ease-out;
  }
  .scale-enter-from,
  .scale-leave-to {
    opacity: 0;
    transform: translateX(15%);
  }
</style>
