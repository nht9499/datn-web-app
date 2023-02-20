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
import { staffApi } from 'src/api/staff'

export const useFetchDoctors = () => {
  const { loading, setLoading, errorMsg, setErrorMsg } = useAsyncCall()
  const listDoctors = ref<DoctorServerResponse[]>([])
  const lastVisible = ref<AnyObject | null>(null)
  const doctorDetail = ref<DoctorServerResponse>({} as DoctorServerResponse)
  const balanceInfo = ref({})
  const listTransactions = ref()
  const listWithdrawal = ref<any[]>([])
  const statisticsInfo = ref({})
  const doctorPrivate = ref({})
  const limitDoc = 20

  const isLoadmore = computed(() => !!lastVisible.value?.id)

  const computedConditions = (queryParams: DoctorQueryParams) => {
    const sortAbleTo: any = queryParams?.sort?.split(',') ?? ['updatedAt', 'desc']
    return [
      ...addWhen(queryParams?.status, where('status', '==', queryParams.status)),
      ...addWhen(
        queryParams?.fullName,
        where('nameAsArray', 'array-contains', queryParams.fullName)
      ),
      orderBy(sortAbleTo[0], sortAbleTo[1]),
      limit(limitDoc + 1),
      ...addWhen(lastVisible.value, startAfter(lastVisible.value)),
    ]
  }
  const computedTransactionCondition = (queryParams: DoctorQueryParams) => {
    const sortAbleTo: any = queryParams?.sort?.split(',') ?? ['createdAt', 'desc']
    const thisYear = new Date().getFullYear().toString()
    let queryTransactionsYear = new Date(thisYear)
    if (queryParams?.transactionsYear)
      queryTransactionsYear = new Date(queryParams?.transactionsYear)
    return [where('createdAt', '>=', queryTransactionsYear), orderBy(sortAbleTo[0], sortAbleTo[1])]
  }

  const fetchDoctors = async (queryParams: DoctorQueryParams = {}, isLoadmore = false) => {
    !isLoadmore && resetData()
    try {
      setLoading(true)
      const doctorsRef = collection(db, COLLECTION_NAME.DOCTORS)
      const conditions = computedConditions(queryParams)
      const q = query(doctorsRef, ...conditions)
      const documentSnapshots = await getDocs(q)
      const listResult = handleResult(documentSnapshots)
      listResult.map(async (doctor) => {
        const docRef = doc(
          db,
          COLLECTION_NAME.DOCTORS,
          doctor.uid,
          COLLECTION_NAME.DOCTOR_SUBCOL_PRIVATES,
          COLLECTION_NAME.DOCTOR_SUBCOL_PRIVATES_DOCID
        )
        const snapshot = await getDoc(docRef)
        const data = snapshot.data()
        if (data) {
          doctor.costPerMau = data.costPerMau
          if (data.lastWithdrawalSnapshot) {
            doctor.lastWithdrawalSnapshot = {
              status: data.lastWithdrawalSnapshot.status,
              createdAt: data.lastWithdrawalSnapshot.createdAt.seconds * 1000,
            }
          }
        }
      })
      console.log(listResult)
      listDoctors.value = listResult
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctorById = async (id: string, queryParams: DoctorQueryParams) => {
    if (!id) return
    try {
      setLoading(true)
      const yearId = queryParams.statisticsYear ?? new Date().getFullYear().toString()
      const docRef = doc(db, COLLECTION_NAME.DOCTORS, id)
      const docPrivateRef = doc(
        db,
        COLLECTION_NAME.DOCTORS,
        id,
        COLLECTION_NAME.DOCTOR_SUBCOL_PRIVATES,
        COLLECTION_NAME.DOCTOR_SUBCOL_PRIVATES_DOCID
      )
      const balanceRef = doc(db, COLLECTION_NAME.DOCTOR_BALANCEINFOS, id)
      const transactionRef = collection(
        db,
        COLLECTION_NAME.DOCTOR_BALANCEINFOS,
        id,
        COLLECTION_NAME.DOCTOR_BALANCEINFOS_SUBCOL_TRANSACTION
      )
      const statisticsRef = doc(
        db,
        COLLECTION_NAME.DOCTOR_BALANCEINFOS,
        id,
        COLLECTION_NAME.DOCTOR_BALANCEINFOS_SUBCOL_STATISTICS,
        yearId
      )
      const [
        doctorInfo,
        doctorPrivateInfo,
        doctorBalance,
        transaction,
        statistics,
        listWithdrawalDoc,
      ] = await Promise.all([
        getDoc(docRef),
        getDoc(docPrivateRef),
        getDoc(balanceRef),
        getDocs(query(transactionRef, ...computedTransactionCondition(queryParams))),
        getDoc(statisticsRef),
        getDocs(
          query(
            transactionRef,
            where('type', '==', 'withdrawal'),
            where('withdrawalTransaction.status', '==', 'waiting')
          )
        ),
      ])
      doctorDetail.value = transformDoctorsResult(doctorInfo)
      balanceInfo.value = doctorBalance.data() ?? {}
      listTransactions.value = []
      transaction.forEach((t) => {
        const data = t.data()
        if (data) {
          data.createdAt = data.createdAt.seconds * 1000
          listTransactions.value.push(data)
        }
      })
      listWithdrawal.value = []
      listWithdrawalDoc.forEach((t) => {
        const data = t.data()
        if (data) {
          data.createdAt = data.createdAt.seconds * 1000
          listWithdrawal.value.push(data)
        }
      })
      statisticsInfo.value = statistics.data() ?? {}
      doctorPrivate.value = doctorPrivateInfo.data() ?? {}
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateStaffStatus = async (payload: StaffStatusPayload) => {
    try {
      setLoading(true)
      await staffApi.updateStatus(payload)
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    } finally {
      setLoading(false)
    }
  }
  const createStaff = async (payload: StaffPayload) => {
    const res: AnyObject = await staffApi.createStaff(payload)
    return res
  }
  const updateStaff = async (payload: StaffPayload, id: string) => {
    if (!id) return
    try {
      setLoading(true)
      await staffApi.updateStaff(payload, id)
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    } finally {
      setLoading(false)
    }
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
    return [...listDoctors.value, ...transformData]
    // const lastItem = documentSnapshots.docs[documentSnapshots.docs.length - 1]
    // lastVisible.value = lastItem
  }

  const resetData = () => {
    listDoctors.value = []
    lastVisible.value = null
  }

  return {
    listDoctors,
    doctorDetail,
    doctorPrivate,
    balanceInfo,
    listTransactions,
    statisticsInfo,
    listWithdrawal,
    isLoadmore,
    loading,
    errorMsg,
    fetchDoctors,
    fetchDoctorById,
    createStaff,
    updateStaff,
    updateStaffStatus,
  }
}
