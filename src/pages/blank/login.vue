<template>
  <blank-wrap>
    <div class="login-container absolute-center z-top">
      <div class="row justify-center" style="min-width: 400px">
        <div class="q-px-md" style="min-width: 400px">
          <div class="text-center">
            <q-img src="@/assets/img/kitor-logo.png" style="width: 140px"></q-img>
          </div>
          <h1 class="text-h3 q-mb-xs text-weight-bolder text-center text-primary">DATN</h1>
          <div class="text-body1 q-mb-lg text-primary text-weight-bold text-center">
            Kiểm tra tương đồng
          </div>
          <q-form @submit="onSubmit" ref="formAuth">
            <q-input
              v-model="email"
              name="email"
              type="email"
              label="Email *"
              lazy-rules
              outlined
              :rules="emailRules">
              <template #prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input
              v-model="password"
              label="Mật khẩu *"
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
              <template #prepend>
                <q-icon name="key" />
              </template>
            </q-input>

            <div>
              <q-btn
                label="Đăng nhập"
                :loading="loading"
                type="submit"
                color="primary"
                class="full-width text-weight-bold"
                padding="sm xl" />
            </div>
          </q-form>
          <div class="text-center q-my-md text-bold">Hoặc</div>
          <div class="text-center">
            <q-btn round @click="signInWithGG">
              <q-avatar>
                <img :src="iconPath" />
              </q-avatar>
            </q-btn>
          </div>
          <div class="flex justify-between text-caption text-grey-8 q-mt-lg">
            <div>
              <q-icon name="history" size="sm"></q-icon>
              <span class="q-ml-xs">version 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </blank-wrap>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue'
  import { useAuthenticate } from '@/hooks/useAuthenticate'
  import { useFetchSettings } from '@/hooks/useFetchSettings'
  import BlankWrap from './components/BlankWrap.vue'
  import { testPattern } from '@/util/pattern'
  import { META } from '@/configs/app.config'
  import iconPath from '@/assets/img/google.png'

  export default defineComponent({
    name: 'TheLogin',
    components: {
      BlankWrap,
    },
    setup() {
      // TODO: define use
      const { signIn, loading, signInWithGoogle } = useAuthenticate()
      const { fetchSettings } = useFetchSettings()

      const formAuth = ref()
      const email = ref('')
      const password = ref('')
      const isPwd = ref(true)

      const onSubmit = async () => {
        const success = await formAuth.value.validate()
        if (success) {
          return handleSignIn()
        }
      }

      const handleSignIn = async () => {
        await signIn({ email: email.value, password: password.value })
        await fetchSettings()
      }
      const signInWithGG = async () => {
        await signInWithGoogle()
      }

      const emailRules = computed(() => [
        (val: string) => (val && val.length > 0) || 'Email không được trống',
        (val: string) => (val && testPattern.email(val)) || 'Vui lòng nhập đúng email',
      ])

      const passwordRules = computed(() => [
        (val: string) => (val && val.length > 0) || 'Mật khẩu không được trống',
      ])

      return {
        formAuth,
        email,
        password,
        isPwd,
        onSubmit,
        emailRules,
        passwordRules,
        loading,
        META,
        iconPath,
        signInWithGG,
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
    padding: 1rem 0.875rem;

    &--cover {
      border-radius: 0 0.7rem 0.7rem 0;
    }
  }
</style>
<route lang="yaml">
meta:
  layout: blank
  title: 'Đăng nhập'
</route>
