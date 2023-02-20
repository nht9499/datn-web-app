import { computed, ref } from 'vue'
import { db } from '@/services/config'
import { COLLECTION_NAME, DriverStatus } from '@/constants/enums'
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
  onSnapshot,
} from 'firebase/firestore'
import { addWhen } from '@/util/object'
import { useEnhancer } from '@/app/enhancer'
import { driverApi } from '@/api/driver'

export const useFetchDrivers = () => {
  const { loading, setLoading, errorMsg, setErrorMsg } = useAsyncCall()
  const { showNotify, showGlobalLoading, hideGlobalLoading } = useEnhancer()
  const listDrivers = ref<DriverServerResponse[]>([])
  const listDriversWaiting = ref<DriverServerResponse[]>([])
  const listRatings = ref<any[]>([])
  const listDebts = ref<DriverDebt[]>([])
  const lastVisibleDebt = ref<any | null>(null)
  const lastVisible = ref<AnyObject | null>(null)
  const lastVisibleRating = ref<AnyObject | null>(null)
  const driverDetail = ref<DriverServerResponse>({} as DriverServerResponse)
  const driversRef = collection(db, COLLECTION_NAME.DRIVER)

  const isLoadmore = computed(() => !!lastVisible.value?.id)
  const isLoadmoreRating = computed(() => !!lastVisibleRating.value?.id)
  const isDeletionRequest = computed(
    () => driverDetail.value.status === DriverStatus.DELETION_REQUESTED
  )
  const limitDoc = 20

  const computedConditions = (queryParams: DriverQueryParams) => {
    const sortAbleTo: any = queryParams?.sort?.split(',') ?? ['workingStatusOrder', 'desc']
    return [
      // ...addWhen(queryParams.uid, where("id", "==", queryParams.uid)),
      ...addWhen(
        queryParams?.status?.length,
        where(
          'status',
          'in',
          [queryParams.status].flatMap((item) => item)
        )
      ),
      ...addWhen(
        queryParams?.workingStatus?.length,
        where(
          'workingStatus',
          'in',
          [queryParams.workingStatus].flatMap((item) => item)
        )
      ),
      ...addWhen(queryParams.name, where('nameAsArray', 'array-contains', queryParams.name)),
      ...addWhen(queryParams.telephone, where('telephone', '==', queryParams.telephone)),
      ...addWhen(queryParams.bikeNumber, where('bikeNumber', '==', queryParams.bikeNumber)),
      ...addWhen(queryParams.gender, where('gender', '==', queryParams.gender)),
      limit(limitDoc + 1),
      sortAbleTo && orderBy(sortAbleTo[0], sortAbleTo[1]),
      ...addWhen(lastVisible.value, startAfter(lastVisible.value)),
    ]
  }
  const computedRatingConditions = (queryParams: DriverQueryParams) => {
    const sortAbleTo: any = queryParams?.sort?.split(',') ?? ['createdAt', 'desc']
    return [
      limit(limitDoc + 1),
      sortAbleTo && orderBy(sortAbleTo[0], sortAbleTo[1]),
      ...addWhen(lastVisibleRating.value, startAfter(lastVisibleRating.value)),
    ]
  }
  const transformDriverResult = (doc: AnyObject) => {
    const snap = doc.data()
    return {
      ...snap,
      uid: doc.id,
      ...(snap.birthday && {
        birthday: snap.birthday.seconds * 1000,
      }),
      ...(snap.createdAt && {
        createdAt: snap.createdAt.seconds * 1000,
      }),
      ...(snap.updatedAt && {
        updatedAt: snap.updatedAt.seconds * 1000,
      }),
    } as DriverServerResponse
  }

  const transformRatingResult = (doc: AnyObject) => {
    const snap = doc.data()
    return {
      ...snap,
      id: doc.id,
      ...(snap.createdAt && {
        createdAt: snap.createdAt.seconds * 1000,
      }),
    } as any
  }

  const subscribeDriverAvailable = () => {
    const composeCondition = [
      where('status', 'in', [
        DriverStatus.WAITING,
        DriverStatus.WAITING_TOO_LONG,
        DriverStatus.DELETION_REQUESTED,
      ]),
      // orderBy("status", "desc")
    ]
    const q = query(driversRef, ...composeCondition)
    return onSnapshot(q, (snapshot) => {
      listDriversWaiting.value = snapshot.docs.map(transformDriverResult)
    })
  }

  const fetchDrivers = async (queryParams: DriverQueryParams = {}, isLoadmore = false) => {
    try {
      setLoading(true)
      const driversRef = collection(db, COLLECTION_NAME.DRIVER)
      const conditions = computedConditions(queryParams)
      const q = query(driversRef, ...conditions)
      const documentSnapshots = await getDocs(q)
      handleResult(documentSnapshots, isLoadmore)
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    }
    setLoading(false)
  }

  const fetchRatings = async (
    queryParams: DriverQueryParams = {},
    id: string,
    isLoadmore = false
  ) => {
    try {
      setLoading(true)
      const docRef = collection(db, COLLECTION_NAME.DRIVER, id, COLLECTION_NAME.REVIEWS)
      const conditions = computedRatingConditions(queryParams)
      const q = query(docRef, ...conditions)
      const documentSnapshots = await getDocs(q)
      handleResultRating(documentSnapshots, isLoadmore)
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    }
    setLoading(false)
  }

  const computedDebtConditions = (queryParams: DriverDebtQueryParams) => {
    const sortAbleTo: any = ['createdAt', 'desc']
    return [
      // limit(limitDoc + 1),
      // sortAbleTo && orderBy(sortAbleTo[0], sortAbleTo[1]),
      ...addWhen(queryParams.notPaid, where('paidAt', '==', null)),
      ...addWhen(lastVisibleDebt.value, startAfter(lastVisibleDebt.value)),
    ]
  }
  const fetchDebts = async (
    driverId: string,
    queryParams: DriverDebtQueryParams,
    isLoadmore = false
  ) => {
    try {
      setLoading(true)
      const debtRef = collection(db, COLLECTION_NAME.DRIVER, driverId, COLLECTION_NAME.SUB_DEBT)
      const conditions = computedDebtConditions(queryParams)
      const q = query(debtRef, ...conditions)
      const documentSnapshots = await getDocs(q)
      handleResultDebts(documentSnapshots, isLoadmore)
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    }
    setLoading(false)
  }

  const handleResultDebts = (
    documentSnapshots: QuerySnapshot<DocumentData>,
    isLoadmore: boolean
  ) => {
    !isLoadmore && resetDataDebts()
    // TODO: compare loadmore
    if (documentSnapshots.docs[limitDoc]) {
      const lastItem = documentSnapshots.docs[documentSnapshots.docs.length - 2]
      lastVisibleDebt.value = lastItem
      const newSnapshots = documentSnapshots.docs.slice(0, documentSnapshots.docs.length - 1)
      listDebts.value = [...listDebts.value, ...newSnapshots.map(transformDebtResult)]
    } else {
      lastVisibleDebt.value = null
      listDebts.value = [...listDebts.value, ...documentSnapshots.docs.map(transformDebtResult)]
    }
  }

  const transformDebtResult = (doc: AnyObject) => {
    const snap = doc.data()
    return {
      ...snap,
      id: doc.id,
      ...(snap.createdAt && {
        createdAt: snap.createdAt.seconds * 1000,
      }),
      ...(snap.paidAt && {
        createdAt: snap.createdAt.seconds * 1000,
      }),
    } as any
  }
  const resetDataDebts = () => {
    listDebts.value = []
    lastVisibleDebt.value = null
  }

  const fetchDriverById = async (id: string) => {
    if (!id) return
    try {
      setLoading(true)
      const docRef = doc(db, COLLECTION_NAME.DRIVER, id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) return
      const data = docSnap.data()
      driverDetail.value = {
        authInfo: data.authInfo,
        status: data.status,
        name: data.name,
        gender: data.gender,
        // email: data.email,
        telephone: data.telephone,
        photoUrl: data.photoUrl,
        address: data.address,
        personalId: data.personalId,
        bikeNumber: data.bikeNumber,
        bikePhotoUrl: data.bikePhotoUrl,
        bikeNumberPlatePhotoUrl: data.bikeNumberPlatePhotoUrl,
        idCardFrontPhotoUrl: data.idCardFrontPhotoUrl,
        idCardBackPhotoUrl: data.idCardBackPhotoUrl,
        drivingLicenseCardFrontPhotoUrl: data.drivingLicenseCardFrontPhotoUrl,
        drivingLicenseCardBackPhotoUrl: data.drivingLicenseCardBackPhotoUrl,
        totalReviewCount: data.totalReviewCount,
        averageRating: data.averageRating,
        birthday: data.birthday.seconds * 1000,
        createdAt: data.createdAt.seconds * 1000,
        updatedAt: data.updatedAt.seconds * 1000,
        accountDeletionRequest: {
          reason: data?.accountDeletionRequest?.reason ?? '',
          createdAt: (data?.accountDeletionRequest?.createdAt?.seconds ?? 0) * 1000,
        },
      } as any
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    }
    setLoading(false)
  }

  const updateDriver = async (payload: DriverUpdatePayload) => {
    if (!payload.driverAuthInfo) return
    try {
      setLoading(true)
      // const docRef = doc(db, COLLECTION_NAME.DRIVER, id)
      // await updateDoc(docRef, {
      //   ...payload,
      //   updatedAt: serverTimestamp(),
      // })
      await driverApi.updateDriver(payload)
      showNotify(`Chỉnh sửa tài xế thành công`, 'positive')
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    }
    setLoading(false)
  }

  const deleteDriver = async (payload: DeleteDriverPayload) => {
    try {
      setLoading(true)
      await driverApi.deleteDriver(payload)
      showNotify(`Xóa tài khoản tài xế thành công`, 'positive')
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    }
    setLoading(false)
  }

  const updateDeposit = async (payload: DepositUpdatePayload) => {
    try {
      showGlobalLoading()
      await driverApi.updateDeposit(payload)
      showNotify(`Đã cộng thêm ${payload.depositAmount} đồng cho tài xế`, 'positive')
    } catch (error) {
      showNotify(`Không thể cập nhật tiền ký quỹ. Thử lại sau`, 'negative')
    }
    hideGlobalLoading()
  }

  const settleDebt = async (payload: { driverAuthInfo: AuthInfo }) => {
    try {
      showGlobalLoading()
      await driverApi.settleDebt(payload)
      showNotify(`Đã thanh toán công nợ cho tài xế`, 'positive')
    } catch (error) {
      showNotify(`Không thể thanh toán công nợ. Thử lại sau`, 'negative')
    }
    hideGlobalLoading()
  }

  const updateStatus = async (payload: any) => {
    try {
      showGlobalLoading()
      await driverApi.updateStatus(payload)
      showNotify(`Chuyển trạng thái tài xế thành công`, 'positive')
    } catch (error) {
      showNotify(`Không thể chuyển trạng thái tài xế. Thử lại sau`, 'negative')
    }
    hideGlobalLoading()
  }

  const handleResult = (documentSnapshots: QuerySnapshot<DocumentData>, isLoadmore: boolean) => {
    // documentSnapshots.forEach((doc) => {
    //   const snap = doc.data();
    //   snap.uid = doc.id;
    //   snap.birthday = snap.birthday.seconds * 1000,
    //   snap.createdAt = snap.createdAt.seconds * 1000
    //   snap.updatedAt = snap.updatedAt.seconds * 1000
    //   listDrivers.value.push(snap as DriverServerResponse);
    // });
    !isLoadmore && resetData()
    // TODO: compare loadmore
    if (documentSnapshots.docs[limitDoc]) {
      const lastItem = documentSnapshots.docs[documentSnapshots.docs.length - 2]
      lastVisible.value = lastItem
      const newSnapshots = documentSnapshots.docs.slice(0, documentSnapshots.docs.length - 1)
      listDrivers.value = [...listDrivers.value, ...newSnapshots.map(transformDriverResult)]
    } else {
      lastVisible.value = null
      listDrivers.value = [
        ...listDrivers.value,
        ...documentSnapshots.docs.map(transformDriverResult),
      ]
    }
  }

  const handleResultRating = (
    documentSnapshots: QuerySnapshot<DocumentData>,
    isLoadmore: boolean
  ) => {
    !isLoadmore && resetDataRating()
    // TODO: compare loadmore
    if (documentSnapshots.docs[limitDoc]) {
      const lastItem = documentSnapshots.docs[documentSnapshots.docs.length - 2]
      lastVisibleRating.value = lastItem
      const newSnapshots = documentSnapshots.docs.slice(0, documentSnapshots.docs.length - 1)
      listRatings.value = [...listRatings.value, ...newSnapshots.map(transformRatingResult)]
    } else {
      lastVisibleRating.value = null
      listRatings.value = [
        ...listRatings.value,
        ...documentSnapshots.docs.map(transformRatingResult),
      ]
    }
  }

  const resetData = () => {
    listDrivers.value = []
    lastVisible.value = null
  }
  const resetDataRating = () => {
    listRatings.value = []
    lastVisibleRating.value = null
  }

  return {
    listDrivers,
    listDriversWaiting,
    isDeletionRequest,
    driverDetail,
    isLoadmore,
    loading,
    errorMsg,
    listRatings,
    lastVisibleRating,
    isLoadmoreRating,
    fetchRatings,
    fetchDrivers,
    fetchDriverById,
    updateDriver,
    subscribeDriverAvailable,
    updateDeposit,
    updateStatus,
    deleteDriver,
    settleDebt,
    fetchDebts,
    listDebts,
  }
}
