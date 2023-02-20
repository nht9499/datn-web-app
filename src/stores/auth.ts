import { acceptHMRUpdate, defineStore } from 'pinia'
import { AppRole } from '@/constants/enums'
import { Storage } from '@/configs/app.config'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    auth: {} as AnyObject,
  }),
  getters: {
    authInfo: (state) => ({
      // authRole: state.auth?.claims?.roleList?.[0],
      authRole: state.auth?.claims?.role,
      uid: state.auth?.currentUser?.uid ?? null,
    }),
    uid: (state) => state.auth?.currentUser?.uid ?? null,
    // role: (state) => state.auth?.claims?.roleList?.[0],
    role: (state) => state.auth?.claims?.role ?? 'user',
    isAdmin: (state: AnyObject) => state.role === AppRole.admin,
    isAccountant: (state: AnyObject) => state.role === AppRole.accountant,
    isStaff: (state: AnyObject) => state.role === AppRole.staff,
    isAnonymous: (state: AnyObject) => !state.role,
    isAuthenticate: (state: AnyObject) => !!state.uid || !!state.token, //(state.isAdmin || state.isAccountant || state.isStaff),
    userInfo: (state) => state.auth?.currentUser ?? null,
    currentUser: (state) => state.auth?.userInfo ?? null,
    token: (state) => state.auth?.token ?? state.auth?.accessToken,
    // isActiveAccount: (state: AnyObject) =>
    //   state.isAdmin || state.auth?.userInfo?.status === 'active',
  },
  actions: {
    setCurrentUser<Type>(context: Type): void {
      Object.assign(this.auth, context)
    },
    updateToken(token: string) {
      Object.assign(this.auth, {
        ...(token && { token }),
      })
    },
    resetDefault(): Promise<boolean> {
      return new Promise((resolve) => {
        this.$reset()
        resolve(true)
      })
    },
  },
  persist: {
    key: Storage.AUTH,
    storage: window.sessionStorage,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
