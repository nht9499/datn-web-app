import { acceptHMRUpdate, defineStore } from 'pinia'
import { Storage } from '@/configs/app.config'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    setting: {} as AnyObject,
  }),
  getters: {
    doctorCostPerMau: (state) => state.setting.doctorCostPerMau ?? null,
    doctorMinBalance: (state) => state.setting.doctorMinBalance ?? null,
    doctorMaxMonthlyWithdrawal: (state) => state.setting.doctorMaxMonthlyWithdrawal ?? null,
  },
  actions: {
    setCurrentSetting<Type>(context: Type): void {
      Object.assign(this.setting, context)
    },
  },
  persist: {
    key: Storage.SETTING,
    storage: window.sessionStorage,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))
}
