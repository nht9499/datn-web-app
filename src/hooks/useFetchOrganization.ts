import globalFilter from '@/helpers/filters'
import { computed, ref } from 'vue'
import { db } from '@/services/config'
import { AppRole, COLLECTION_NAME } from '@/constants/enums'
import { useAsyncCall } from './useAsyncCall'
import { getDoc, doc } from 'firebase/firestore'
import { userApi } from '@/api/user'
import { organizationApi } from '@/api/organization'

export const useFetchOrganization = () => {
  const { loading, setLoading, errorMsg, setErrorMsg } = useAsyncCall()
  const lastVisible = ref<AnyObject | null>(null)
  const organizationDetail = ref()

  const isLoadmore = computed(() => !!lastVisible.value?.id)

  const fetchOrganizationById = async (id: string) => {
    if (!id) return
    try {
      setLoading(true)
      const docRef = doc(db, 'organizations', id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) return
      const data = transformDoctorsResult(docSnap)
      organizationDetail.value = data
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    }
    setLoading(false)
  }

  const createOrg = async (payload: any) => {
    await organizationApi.create(payload)
  }
  const addMember = async (organizationUid: string, userUid: string) => {
    await organizationApi.addMember(organizationUid, userUid)
  }
  const removeMember = async (organizationUid: string, userUid: string) => {
    await organizationApi.removeMember(organizationUid, userUid)
  }
  const addAdmin = async (organizationUid: string, userUid: string) => {
    await organizationApi.addAdmin(organizationUid, userUid)
  }
  const removeAdmin = async (organizationUid: string, userUid: string) => {
    await organizationApi.removeAdmin(organizationUid, userUid)
  }

  const uploadFile = async (organizationUid: string, payload: any) => {
    await organizationApi.uploadFile(organizationUid, payload)
  }
  const shareFile = async (organizationUid: string, payload: any) => {
    await organizationApi.shareFile(organizationUid, payload)
  }
  const removeFile = async (organizationUid: string, fileId: string) => {
    await organizationApi.removeFile(organizationUid, fileId)
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
    organizationDetail,
    isLoadmore,
    loading,
    errorMsg,
    uploadFile,
    createOrg,
    addMember,
    removeMember,
    addAdmin,
    removeAdmin,
    fetchOrganizationById,
    shareFile,
    removeFile,
  }
}
