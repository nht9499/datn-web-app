import { Ref, ref } from 'vue'
import { db } from '@/services/config'
import { COLLECTION_NAME } from '@/constants/enums'
import { useAsyncCall } from './useAsyncCall'
import { doc, getDoc } from 'firebase/firestore'
import { settingApi } from 'src/api/setting'
import { useEnhancer } from '@/app/enhancer'

export const useFetchSettings = () => {
  const { loading, setLoading, errorMsg, setErrorMsg } = useAsyncCall()
  const { settingStore } = useEnhancer()

  const initialSetting: Settings = {
    driverAccountTypeFeeConfigList: [
      {
        driverAccountType: 'bike',
        distanceFeeConfig: {
          distanceSegmentFeeConfigList: [
            {
              kmsCount: 1,
              feePerKm: 10000,
            },
            {
              kmsCount: null,
              feePerKm: 5000,
            },
          ],
          driverChargePerTripInPercent: 15,
        },
      },
      {
        driverAccountType: 'fourSeaterCar',
        distanceFeeConfig: {
          distanceSegmentFeeConfigList: [
            {
              kmsCount: 1,
              feePerKm: 18000,
            },
            {
              kmsCount: 29,
              feePerKm: 16000,
            },
            {
              kmsCount: null,
              feePerKm: 14000,
            },
          ],
          driverChargePerTripInPercent: 15,
        },
      },
      {
        driverAccountType: 'sevenSeaterCar',
        distanceFeeConfig: {
          distanceSegmentFeeConfigList: [
            {
              kmsCount: 1,
              feePerKm: 20000,
            },
            {
              kmsCount: 29,
              feePerKm: 18000,
            },
            {
              kmsCount: null,
              feePerKm: 16000,
            },
          ],
          driverChargePerTripInPercent: 15,
        },
      },
    ],
    goodsWeightFeeConfigList: [
      {
        goodsWeight: 'light',
        distanceFeeConfig: {
          distanceSegmentFeeConfigList: [
            {
              kmsCount: 1,
              feePerKm: 10000,
            },
            {
              kmsCount: null,
              feePerKm: 5000,
            },
          ],
          driverChargePerTripInPercent: 15,
        },
      },
      {
        goodsWeight: 'medium',
        distanceFeeConfig: {
          distanceSegmentFeeConfigList: [
            {
              kmsCount: 1,
              feePerKm: 15000,
            },
            {
              kmsCount: null,
              feePerKm: 10000,
            },
          ],
          driverChargePerTripInPercent: 15,
        },
      },
      {
        goodsWeight: 'heavy',
        distanceFeeConfig: {
          distanceSegmentFeeConfigList: [
            {
              kmsCount: 1,
              feePerKm: 20000,
            },
            {
              kmsCount: null,
              feePerKm: 15000,
            },
          ],
          driverChargePerTripInPercent: 15,
        },
      },
    ],
    // attributeBulkyFeePerKm: 2000,
    // attributeLongWaitFeePerTrip: 20000,
    premiumDiscountPerTripInPercent: 10,
    maxRadiusOrdersQueryInMeters: 5000,
    minDriverDeposit: 50000,
    shopDistanceFeeConfig: {
      distanceSegmentFeeConfigList: [
        {
          kmsCount: 1,
          feePerKm: 10000,
        },
        {
          kmsCount: null,
          feePerKm: 5000,
        },
      ],
      driverChargePerTripInPercent: 15,
    },
  }
  const settings: Ref<Settings> = ref({ ...initialSetting })
  const fetchSettings = async () => {
    try {
      setLoading(true)
      const docRef = doc(db, COLLECTION_NAME.SETTINGS, 'settings')
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) return
      settings.value = transformSettingsResult(docSnap)
      settingStore.setCurrentSetting({
        ...settings.value,
      })
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    } finally {
      setLoading(false)
    }
  }
  const updateSettings = async (payload: Settings) => {
    try {
      setLoading(true)

      await settingApi.updateSetting({
        ...payload,
      })
    } catch (error) {
      const { message } = error as { message: string }
      setErrorMsg(message)
      throw error
    } finally {
      setLoading(false)
    }
  }
  const transformSettingsResult = (doc: AnyObject) => {
    const snap = doc.data()
    return {
      ...snap,
    } as Settings
  }
  return {
    loading,
    errorMsg,
    settings,
    fetchSettings,
    updateSettings,
  }
}
