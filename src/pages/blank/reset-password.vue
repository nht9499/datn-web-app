<template>
  <blank-wrap>
    <div class="login-container absolute-center z-top">
      <div class="row justify-center">
        <div class="q-px-md">
          <h1 class="text-h4 q-mb-xs text-weight-bold">Đặt lại mật khẩu 🔒</h1>
          <div class="text-body1 q-mb-xl">
            Mật khẩu mới của bạn phải khác với các mật khẩu đã sử dụng trước đó
          </div>
          <q-form @submit="onSubmit" ref="formAuth">
            <q-input
              class="q-mb-sm"
              v-model="newPassword"
              label="Mật khẩu mới*"
              name="password"
              :type="isPwd ? 'password' : 'text'"
              lazy-rules
              outlined
              :rules="passwordRules">
              <template #append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <q-input
              v-model="confirmPassword"
              label="Nhập lại mật khẩu mới*"
              name="password"
              :type="isPwd ? 'password' : 'text'"
              lazy-rules
              outlined
              :rules="confirmPasswordRules">
              <template #append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>

            <div class="q-pt-lg">
              <q-btn
                label="Đặt mật khẩu mới"
                :loading="loading"
                type="submit"
                color="primary"
                class="full-width text-weight-bold"
                padding="sm xl" />
              <q-btn
                label="Quay lại"
                flat
                icon="arrow_back"
                color="primary"
                class="q-mt-md text-weight-bold full-width"
                to="/login" />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </blank-wrap>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useAuthenticate } from '@/hooks/useAuthenticate'
import { useEnhancer } from '@/app/enhancer'
import BlankWrap from './components/BlankWrap.vue'
import get from 'lodash/get'

export default defineComponent({
  name: 'ResetPassword',
  components: {
    BlankWrap,
  },
  setup() {
    // TODO: define use
    const { loading, changePassword } = useAuthenticate()
    const { route, router } = useEnhancer()

    const redirectTo: string = get(route, 'query.redirect', '/')

    const formAuth = ref()
    const email = ref('')
    const isPwd = ref(true)
    const newPassword = ref('')
    const confirmPassword = ref('')

    const onSubmit = async () => {
      const success = await formAuth.value.validate()
      if (success) {
        await changePassword(newPassword.value)
        newPassword.value = ''
        confirmPassword.value = ''
        formAuth.value.reset()
        router.push(redirectTo)
      }
    }

    const passwordRules = computed(() => [
      (val: string) => (val && val.length > 0) || 'Vui lòng nhập mật khẩu mới',
      (val: string) => (val && val.length > 8) || 'Mật khẩu có ít nhất 9 kí tự',
    ])

    const confirmPasswordRules = computed(() => [
      (val: string) => (val && val.length > 0) || 'Vui lòng nhập lại mật khẩu mới',
      (val: string) => (val && val === newPassword.value) || 'Không trùng khớp',
    ])

    return {
      formAuth,
      router,
      email,
      newPassword,
      confirmPassword,
      isPwd,
      onSubmit,
      passwordRules,
      loading,
      confirmPasswordRules,
    }
  },
})
</script>

<style lang="scss" scoped>
.login-container {
  // max-height: 70%;
  // width: 80%;
  background-color: #fff;
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25), 0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  border-radius: 0.7rem;
  padding: 2rem 0.875rem;

  &--cover {
    border-radius: 0 0.7rem 0.7rem 0;
  }
}
</style>
<route lang="yaml">
meta:
  layout: blank
  title: 'Đặt lại mật khẩu'
</route>
