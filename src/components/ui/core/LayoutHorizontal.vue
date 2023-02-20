<template>
  <q-layout view="lHh lpr lFf" class="fit">
    <q-header elevated class="shadow-6 bg-blur">
      <q-toolbar>
        <q-toolbar-title class="flex">
          <q-avatar>
            <img
              src="https://png.pngtree.com/png-vector/20190721/ourlarge/pngtree-food-delivery--logo-design-template-png-image_1567363.jpg" />
          </q-avatar>
          <h2 class="text-h5 text-dark text-weight-medium q-ml-md q-mb-none self-center">
            {{ META.title }}
          </h2>
        </q-toolbar-title>

        <!-- <the-notification /> -->
        <user-menu />
      </q-toolbar>
      <q-separator />
      <q-toolbar class="bg-white text-black q-px-xl">
        <q-btn-dropdown
          flat
          rounded
          label="Dropdown"
          no-caps
          class="text-white bg-gradient-primary"
          dropdown-icon="expand_more">
          <q-list>
            <q-item-label header>Folders</q-item-label>
            <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-popup tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="folder" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Photos</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
            <q-separator inset spaced />
            <q-item-label header>Files</q-item-label>
            <q-item v-for="n in 3" :key="`y.${n}`" clickable v-close-popup tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="assignment" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Vacation</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-separator dark vertical />
        <q-btn stretch flat label="Link" />
        <q-separator dark vertical />
        <q-btn stretch flat label="Link" />
      </q-toolbar>
    </q-header>

    <q-page-container class="app-content-container q-px-xl v-bg">
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
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'LayoutHorizontal',
  })
</script>
