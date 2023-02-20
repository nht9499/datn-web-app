<template>
  <!-- <q-btn :color="color" text-color="white" round size="11px" class="q-ml-md">
    <span class="text-body1 text-weight-medium">{{ firstLabel }}</span>
    <q-menu fit transition-show="jump-down" transition-hide="jump-up" :offset="[0, 10]">
      <q-list style="min-width: 200px">
        <q-item :clickable="hasProfile" @click="clickProfile">
          <q-item-section top avatar>
            <q-avatar>
              <q-img v-if="userInfo?.photoUrl" :src="userInfo?.photoUrl" />
              <q-img v-else src="@/assets/img/default_avatar.png" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body2">{{ userInfo?.name ?? role }}</q-item-label>
            <q-item-label caption v-if="userInfo?.name">{{ role }}</q-item-label>
          </q-item-section>
        </q-item>
        <template v-if="isAdmin">
          <q-separator />
          <q-item clickable v-close-popup @click="clickSetting">
            <q-item-section avatar> <q-icon name="settings" /> </q-item-section>
            <q-item-section>Cài đặt</q-item-section>
          </q-item>
        </template>
        <q-separator />
        <q-item clickable v-close-popup @click="onSignOut">
          <q-item-section avatar> <q-icon name="logout" /> </q-item-section>
          <q-item-section>Đăng xuất</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn> -->
  <q-btn flat round color="primary" icon="logout" @click="onSignOut"> </q-btn>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import { format } from 'quasar'
  import { useEnhancer } from '@/app/enhancer'
  import { auth } from '@/constants/define'
  import { useAuthenticate } from '@/hooks/useAuthenticate'
  import { AppRole } from 'src/constants/enums'
  export default defineComponent({
    name: 'UserMenu',
    setup() {
      const { authStore, showDialog, router } = useEnhancer()
      const { signOut } = useAuthenticate()
      const firstLabel = computed(() => auth.firstCharacter?.[authStore.role] ?? '')
      const display = computed(() => auth.roleName?.[authStore.role] ?? '')
      const userInfo = computed(() => authStore.currentUser)
      const color = computed(() => auth.color?.[authStore.role] ?? '')
      const role = computed(() => format.capitalize(authStore.role))
      const hasProfile = computed(() =>
        [AppRole.staff, AppRole.accountant].includes(authStore.role)
      )
      const isAdmin = computed(() => authStore.role === AppRole.admin)
      const onSignOut = () => {
        showDialog({
          title: 'Xác nhận',
          message: `Đăng xuất khỏi tài khoản ${display.value}`,
          ok: {
            noCaps: true,
            label: 'Đồng ý',
          },
          cancel: {
            flat: true,
            noCaps: true,
            label: 'Hủy',
          },
          persistent: true,
        })
          .onOk(() => {
            signOut()
            authStore.resetDefault().then(() => {
              // location.reload()
              router.push('/login')
            })
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
      }
      const clickProfile = () => {
        if (hasProfile.value) {
          router.push({ name: 'profile' })
        }
      }
      const clickSetting = () => {
        router.push({ name: 'settings' })
      }

      return {
        userInfo,
        firstLabel,
        display,
        color,
        role,
        onSignOut,
        clickProfile,
        clickSetting,
        hasProfile,
        isAdmin,
      }
    },
  })
</script>
<style lang="scss" scoped></style>
