import globalFilter from '@/helpers/filters'
import { computed, ref } from 'vue'
import { db } from '@/services/config'
import { AppRole, COLLECTION_NAME } from '@/constants/enums'
import { useAsyncCall } from './useAsyncCall'
import {
  getDoc,
  doc,
} from 'firebase/firestore'
import { userApi } from '@/api/user'

export const useFetchUser = () => {
  const { loading, setLoading, errorMsg, setErrorMsg } = useAsyncCall()
  const lastVisible = ref<AnyObject | null>(null)
  const userDetail = ref()

  const isLoadmore = computed(() => !!lastVisible.value?.id)

  const fetchUserById = async (id: string) => {
    if (!id) return
    try {
      setLoading(true)
      const docRef = doc(db, 'users', id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) return
      const data = transformDoctorsResult(docSnap)
      userDetail.value = data
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    }
    setLoading(false)
  }
  const joinOrganization = async (organizationUid: string) => {
    await userApi.joinOrganization(organizationUid)
  }

  const uploadFile = async (payload: any) => {
    await userApi.uploadFile(payload)
  }
  const removeFile = async (userUid: string, fileId: string) => {
    await userApi.removeFile(userUid, fileId)
  }
  const shareFile = async (userUid: string, payload: any) => {
    await userApi.shareFile(userUid, payload)
  }

  const transformDoctorsResult = (doc: AnyObject) => {
    const snap = doc.data()
    return {
      ...snap,
      uid: doc.id,
      ...(snap.dob && {
        dob: snap.dob.seconds * 1000,
      }),
      ...(snap.createdAt && {
        createdAt: snap.createdAt.seconds * 1000,
      }),
      ...(snap.updatedAt && {
        updatedAt: snap.updatedAt.seconds * 1000,
      }),
    } as DoctorServerResponse
  }

  return {
    userDetail,
    isLoadmore,
    loading,
    errorMsg,
    fetchUserById,
    uploadFile,
    joinOrganization,
    removeFile,
    shareFile
  }
}
