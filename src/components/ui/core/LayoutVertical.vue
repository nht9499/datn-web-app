<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-2">
    <q-header elevated class="bg-primary text-white text-left">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="flex">
          <q-avatar>
            <img
              src="https://png.pngtree.com/png-vector/20190721/ourlarge/pngtree-food-delivery--logo-design-template-png-image_1567363.jpg" />
          </q-avatar>
          <h2 class="text-h5 text-weight-medium q-ml-md q-mb-none self-center">{{ META.title }}</h2>
        </q-toolbar-title>

        <!-- <the-notification /> -->
        <user-menu />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered :width="220">
      <q-list class="q-pt-xs">
        <essential-link v-for="(link, index) in essentialLinks" :key="index" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition name="scale" mode="out-in">
          <div :key="route.name">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { EssentialLink, UserMenu } from '@/components'
  import { useMenus } from '@/hooks/useMenu'
  import { useEnhancer } from '@/app/enhancer'
  export default defineComponent({
    name: 'LayoutVertical',
    components: {
      EssentialLink,
      UserMenu,
      // TheNotification,
    },
    setup() {
      const { authStore } = useEnhancer()
      const { essentialLinks } = useMenus(authStore.role)

      const leftDrawerOpen = ref(false)

      const toggleLeftDrawer = () => {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }

      const isRender = (navItem: AnyObject) => {
        return navItem.meta?.groups?.includes(authStore.role)
      }

      return {
        essentialLinks,
        isRender,
        toggleLeftDrawer,
        leftDrawerOpen,
      }
    },
  })
</script>
