import globalFilter from '@/helpers/filters'
import { computed, ref } from 'vue'
import { db } from '@/services/config'
import { AppRole, COLLECTION_NAME } from '@/constants/enums'
import { useAsyncCall } from './useAsyncCall'
import {
  collection,
  query,
  where,
  orderBy,
  getDoc,
  doc,
  getDocs,
  limit,
  QuerySnapshot,
  DocumentData,
  startAfter,
  Timestamp,
} from 'firebase/firestore'
import { addWhen } from '@/util/object'
import { testApi } from 'src/api/test'
import { useEnhancer } from '@/app/enhancer'

export const useFetchTestResult = () => {
  const { authStore } = useEnhancer()
  const { loading, setLoading, errorMsg, setErrorMsg } = useAsyncCall()
  const listTests = ref()
  const lastVisible = ref<AnyObject | null>(null)
  const doctorDetail = ref<DoctorServerResponse>({} as DoctorServerResponse)
  const balanceInfo = ref({})
  const listTransactions = ref()
  const listWithdrawal = ref<any[]>([])
  const statisticsInfo = ref({})
  const doctorPrivate = ref({})
  const limitDoc = 20
  const resultData = ref()

  const isLoadmore = computed(() => !!lastVisible.value?.id)

  const computedTransactionCondition = (queryParams: DoctorQueryParams) => {
    const sortAbleTo: any = queryParams?.sort?.split(',') ?? ['createdAt', 'desc']
    const thisYear = new Date().getFullYear().toString()
    let queryTransactionsYear = new Date(thisYear)
    if (queryParams?.transactionsYear)
      queryTransactionsYear = new Date(queryParams?.transactionsYear)
    return [where('createdAt', '>=', queryTransactionsYear), orderBy(sortAbleTo[0], sortAbleTo[1])]
  }
  const computedConditions = (queryParams: DoctorQueryParams) => {
    const sortAbleTo: any = queryParams?.sort?.split(',') ?? ['updatedAt', 'desc']
    return [
      where('userUid', '==', authStore.uid),
      orderBy(sortAbleTo[0], sortAbleTo[1]),
      ...addWhen(lastVisible.value, startAfter(lastVisible.value)),
    ]
  }

  const fetchTests = async (queryParams: DoctorQueryParams = {}, isLoadmore = false) => {
    !isLoadmore && resetData()
    try {
      setLoading(true)
      const doctorsRef = collection(db, 'testResults')
      const conditions = computedConditions(queryParams)
      const q = query(doctorsRef, ...conditions)
      const documentSnapshots = await getDocs(q)
      const listResult = handleResult(documentSnapshots)
      listTests.value = listResult
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getTestResultById = async (id: string) => {
    const docRef = doc(db, 'testResults', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return
    const data = docSnap.data()
    resultData.value = data
  }

  const executeTest = async (payload: any) => {
    await testApi.executeTest(payload)
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
  const handleResult = (documentSnapshots: QuerySnapshot<DocumentData>) => {
    // TODO: compare loadmore
    const transformData = [...documentSnapshots.docs.map(transformDoctorsResult)]
    if (documentSnapshots.docs[limitDoc]) {
      const lastItem = documentSnapshots.docs[documentSnapshots.docs.length - 2]
      lastVisible.value = lastItem
      transformData.splice(-1)
    } else {
      lastVisible.value = null
    }
    return [...listTests.value, ...transformData]
    // const lastItem = documentSnapshots.docs[documentSnapshots.docs.length - 1]
    // lastVisible.value = lastItem
  }

  const resetData = () => {
    listTests.value = []
    lastVisible.value = null
  }

  return {
    listTests,
    doctorDetail,
    doctorPrivate,
    balanceInfo,
    listTransactions,
    statisticsInfo,
    listWithdrawal,
    isLoadmore,
    loading,
    errorMsg,
    fetchTests,
    executeTest,
    resultData,
    getTestResultById,
  }
}
