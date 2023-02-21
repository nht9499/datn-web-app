import globalFilter from '@/helpers/filters'
import { computed, ref } from 'vue'
import { db } from '@/services/config'
import { AppRole, COLLECTION_NAME } from '@/constants/enums'
import { useAsyncCall } from './useAsyncCall'
import { getDoc, doc } from 'firebase/firestore'
import { userApi } from '@/api/user'

export const useFetchStatistics = () => {
  const { loading, setLoading, errorMsg, setErrorMsg } = useAsyncCall()
  const lastVisible = ref<AnyObject | null>(null)
  const statisticsDetail = ref()

  const isLoadmore = computed(() => !!lastVisible.value?.id)

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const thisYear = new Date().getFullYear().toString()
      const docRef = doc(db, 'salesStatisticsByYear', thisYear)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) return
      const data = docSnap.data()
      console.log(data)
      statisticsDetail.value = data
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    }
    setLoading(false)
  }

  return {
    statisticsDetail,
    isLoadmore,
    loading,
    errorMsg,
    fetchStatistics,
  }
}
