<template>
  <q-page class="bg-blur relative-position">
    <slot />
    <!-- <div>
      <q-img src="@/assets/img/bg3.png" class="absolute-bottom" style="width: 100%" />
      <q-img
        src="@/assets/img/bg2.png"
        fit="contain"
        class="absolute-bottom-left"
        style="width: 280px; height: 185px" />
      <q-img
        src="@/assets/img/bg1.png"
        fit="contain"
        class="absolute-bottom-right"
        style="width: 377px; height: 289px" />
    </div> -->
  </q-page>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'BlankWrap',
  })
</script>
