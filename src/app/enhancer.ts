import { useRoute, useRouter } from 'vue-router'
// import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useSettingStore } from '@/stores/setting'
// import { useAgoraCall } from "@/stores/call";
import { useQuasar, QSpinnerIos, copyToClipboard } from 'quasar'
import { NotifyType } from '@/constants/enums'

export const useEnhancer = () => {
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const settingStore = useSettingStore()
  // const agoraStore = useAgoraCall();

  // const { t, locale, availableLocales } = useI18n()

  const showNotify = (message: string, type: NotifyType = 'positive') => {
    $q.notify({
      type,
      position: 'top-right',
      message,
    })
  }

  const showGlobalLoading = (message = 'Vui lòng chờ 1 xíu.') => {
    $q.loading.show({
      spinner: QSpinnerIos,
      spinnerColor: 'white',
      message,
    })
  }

  const hideGlobalLoading = () => {
    $q.loading.hide()
  }

  const saveForStorage = (key: string, value: AnyObject) => {
    $q.localStorage.set(key, value)
  }

  const getFromStorage = (key: string) => {
    const payload = $q.localStorage.getItem(key)
    return payload //? JSON.parse(payload) : null
  }

  const removeFromStorage = (key: string) => {
    $q.localStorage.remove(key)
  }

  const handleCopyContent = (text: string) => {
    copyToClipboard(text)
      .then(() => {
        showNotify('Đã sao chép vào bộ nhớ đệm', 'info')
      })
      .catch(() => {
        showNotify('Trình duyệt không hổ trợ sao chép', 'warning')
      })
  }

  return {
    route,
    router,
    // t,
    // locale,
    // availableLocales,
    authStore,
    settingStore,
    // agoraStore,
    showNotify,
    showGlobalLoading,
    hideGlobalLoading,
    showDialog: $q.dialog,
    saveForStorage,
    getFromStorage,
    removeFromStorage,
    handleCopyContent,
  }
}
