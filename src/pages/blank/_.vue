<template>
  <q-page class="v-bg">
    <div class="absolute-center z-top text-center">
      <h1 class="text-h4">
        Không tìm thấy trang<q-icon name="warning" size="32px" color="warning" />
      </h1>
      <p class="text-body1">chúng tôi không thể tìm thấy trang bạn đang tìm kiếm</p>
      <div class="full-width q-mx-auto q-my-lg">
        <q-img src="@/assets/img/not_found.png" style="width: 700px; height: auto" fit="contain" />
      </div>
      <q-btn
        text-color="white"
        class="bg-gradient-primary"
        label="Về trang chủ"
        to="/"
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
export default defineComponent({
  name: 'NotFound',
})
</script>

<style lang="scss" scoped>
.v-icon {
  align-items: center;
  display: inline-flex;
  font-feature-settings: 'liga';
  font-size: 24px;
  justify-content: center;
  letter-spacing: normal;
  line-height: 1;
  position: relative;
  text-indent: 0;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
<route lang="yaml">
meta:
  layout: blank
  requiresAuth: true
</route>
