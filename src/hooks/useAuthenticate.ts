import { AppRole } from '@/constants/enums'
import { useAsyncCall } from './useAsyncCall'
import {
  signInWithEmailAndPassword,
  signOut as signOutApi,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from 'firebase/auth'
import { auth, db } from '@/services/config'
import { doc, getDoc } from 'firebase/firestore'
import { COLLECTION_NAME } from 'src/constants/enums'
import { useEnhancer } from '@/app/enhancer'
import { ref } from 'vue'
import { getRedirectConfig } from '@/configs/nav.config'
import { userApi } from '@/api/user'

export const useAuthenticate = () => {
  const { authStore, router, showNotify, showGlobalLoading, hideGlobalLoading } = useEnhancer()
  const { loading, setLoading } = useAsyncCall()
  const refStaffPing = ref()

  // const redirectTo: string = get(route, 'query.redirect', '/')

  const signIn = async (data: SignInData) => {
    const { email, password } = data

    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)

      // TODO: force change password first login
      // if (password.length < 9) {
      //   router.push({ name: 'reset-password' })
      //   return
      // }

      const response: AnyObject = (await auth.currentUser?.getIdTokenResult()) ?? {}
      const role = response?.claims?.role ?? ''
      const userSnap = null
      // if ([AppRole.staff, AppRole.admin, AppRole.accountant].includes(role)) {
      //   const authId = `${response.claims.user_id}`
      //   const userRef = doc(db, COLLECTION_NAME.STAFFS, authId)
      //   const userDoc = await getDoc(userRef)
      //   userSnap = userDoc.data()
      // }
      await userApi.registerUser({ email: response.email })
      console.log(response)
      authStore.setCurrentUser({
        ...response,
        currentUser: auth.currentUser?.toJSON(),
        userInfo: userSnap,
      })

      // router.push(getRedirectConfig(role))
      router.push('/dashboard')
      // setSuccessMsg('auth/sign-success')
    } catch (error) {
      console.log(error)
      // const { message } = error as { message: string }
      showNotify('Email hoặc mật khẩu không đúng', 'negative')
    }
    setLoading(false)
  }

  const provider = new GoogleAuthProvider()
  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const auth = getAuth()
      const res = await signInWithPopup(auth, provider)
      const credential = GoogleAuthProvider.credentialFromResult(res)
      // const token = credential?.accessToken;
      // The signed-in user info.
      const user = res.user
      authStore.setCurrentUser({
        ...user,
        token: user.accessToken,
        currentUser: auth.currentUser?.toJSON(),
      })
      await userApi.registerUser({ email: user.email })
      const response: AnyObject = (await auth.currentUser?.getIdTokenResult()) ?? {}
      authStore.setCurrentUser({
        ...response,
        // token: user.accessToken,
        currentUser: auth.currentUser?.toJSON(),
      })
      router.push('/tests')
    } catch (error) {
      console.log(error)
      // const { message } = error as { message: string }
      // showNotify('Email hoặc mật khẩu không đúng', 'negative')
    }
    setLoading(false)
  }

  const signOut = () => {
    signOutApi(auth)
  }

  const changePassword = async (newPassword: string) => {
    try {
      showGlobalLoading()
      const user = auth.currentUser
      if (!user) return
      await updatePassword(user, newPassword)
      // ! Login again to get new token
      await signIn({ email: user.email as string, password: newPassword })
      showNotify('Thay đổi mật khẩu thành công', 'positive')
    } catch (error) {
      showNotify('Không thay đổi được mật khẩu', 'negative')
      console.log(error)
    } finally {
      hideGlobalLoading()
    }
  }

  // const staffPingAvailable = () => {
  //   userApi.ping()
  //   refStaffPing.value = setInterval(() => {
  //     userApi.ping()
  //   }, 2 * 60 * 1000)
  // }

  // const clearPingAvailable = () => {
  //   clearTimeout(refStaffPing.value)
  // }

  return {
    signIn,
    signOut,
    loading,
    changePassword,
    signInWithGoogle,
    // staffPingAvailable,
    // clearPingAvailable,
  }
}
