<template>
  <q-layout view="hHh lpR fFf">
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
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BlankLayout',
})
</script>
<style lang="scss" scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease-in;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
