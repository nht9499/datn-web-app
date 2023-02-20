import { TransportType } from './../constants/enums'
import { uid } from 'quasar'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { DiscountType } from '@/constants/enums'
import dayjs from 'dayjs'

export const getUid = () => uid()

export const transformDefaultOrder = () => {
  const item: OrderItemClient = {
    id: uid(),
    locations: [
      {
        id: uid(),
        address: '',
        lat: null,
        lng: null,
      },
      {
        id: uid(),
        address: '',
        lat: null,
        lng: null,
      },
    ],
    goodAttributes: [],
    // transportType: TransportType.goods,
    zaloReceiver: null,
    note: '',
    distance: null,
    shippingFee: null,
    shippingFeeOriginal: null,
    forDriverAccountType: 'bike',
    completionPhotoUrl: '',
    staticMapUrl: '',
    editedShippingFee: 0,
  }

  return item
}

export const parseOrderServerToClient = (order: OrderItemServerResponse) => {
  const item: OrderItemClient = {
    id: uid(),
    locations: order.locationList?.map((item) => ({
      id: uid(),
      address: item.address,
      lat: item.position.latitude,
      lng: item.position.longitude,
    })),
    // goodAttributes: order?.goodsAttributes,
    zaloReceiver: order?.zaloReceiver,
    // transportType: order?.transportType,
    note: order?.note,
    distance: order?.distanceInMeters,
    forDriverAccountType: order.forDriverAccountType,
    shippingFee: order?.invoice?.distanceFee,
    shopFee: order?.invoice?.shopInvoice,
    shippingFeeOriginal: order?.invoice?.finalFeeBeforeDiscount,
    staticMapUrl: order?.staticMapUrl,
    editedShippingFee: order?.invoice?.isPriceEdited ? order.invoice?.finalFeeAfterDiscount : 0,
    completionPhotoUrl: order?.completionPhotoUrl,
  }

  return item
}

export const transformToOrderServer = (orderList: OrderItemClient[]): OrderItemServerRequest[] => {
  return orderList.map((order) => {
    return {
      locationList: order.locations?.map((item) => ({
        address: item.address || '',
        position: {
          latitude: item.lat || 0,
          longitude: item.lng || 0,
        },
      })),
      // goodsAttributes: order.goodAttributes || [],
      note: order?.note || '',
      ...(order.zaloReceiver && {
        zaloReceiver: order.zaloReceiver,
      }),
      // ...(order.transportType && {
      //   transportType: order.transportType,
      // }),
      staticMapUrl: order.staticMapUrl,
      forDriverAccountType: order.forDriverAccountType,
      distanceInMeters: order.distance || 0,
      ...(order.editedShippingFee && {
        editedFee: order.editedShippingFee,
      }),
    }
  })
}

export const transformResponse = (doc: QueryDocumentSnapshot) => {
  const snap = doc.data()
  return {
    ...snap,
    ...(snap.createdAt && {
      createdAt: snap.createdAt.seconds * 1000,
    }),
    ...(snap.updatedAt && {
      updatedAt: snap.updatedAt.seconds * 1000,
    }),
  } as DocumentData
}

export const transformBookmarkResponse = (payload: OrderItemLocationServerResponse) => {
  const index = payload?.address?.lastIndexOf('-')
  const name = index ? payload?.address?.slice(0, index) : ''
  return {
    id: payload.id,
    address: payload.address,
    lat: payload.position.latitude,
    lng: payload.position.longitude,
    isFetching: false,
    name,
    fullAddress: payload?.address ?? '',
    isSaved: true,
  } as LocationItemClient
}

export const transformDefaultLocation = (defaultItem = {} as LocationItemClient) => {
  const index = defaultItem?.address?.lastIndexOf('-')
  const name = index ? defaultItem?.address?.slice(0, index) : ''
  const item: LocationItemClient = {
    id: uid(),
    address: defaultItem?.address ?? '',
    isFetching: false,
    lat: defaultItem?.lat,
    lng: defaultItem?.lng,
    name,
    fullAddress: defaultItem?.address ?? '',
  }

  return item
}

export const transformLocationToOrderLocation = (defaultItem = {} as LocationItemClient) => {
  const item: OrderItemClientLocation = {
    id: uid(),
    address: defaultItem?.address ?? '',
    lat: defaultItem.lat,
    lng: defaultItem.lng,
  }
  return item
}

export const transformToPromoteServer = (
  promote: TPromoteItemClient
): TPromoteItemServerRequest => {
  const [dateS, hourS] = promote.activeFrom.split(' ') as string[]
  const [dateE, hourE] = promote.activeTo.split(' ') as string[]

  const [dayS, monthS, yearS] = dateS?.split('/') as string[]
  const [dayE, monthE, yearE] = dateE?.split('/') as string[]

  const startDate = `${yearS}-${monthS}-${dayS} ${hourS}`
  const endDate = `${yearE}-${monthE}-${dayE} ${hourE}`

  return {
    promoCode: promote.promoCode,
    description: promote.description,
    bannerImageBase64: promote.bannerImageBase64.replace(/^data:.+;base64,/, ''),
    isEnabled: true,
    discountAmount: +promote.discountAmount || 0,
    discountInfo: {
      type: promote.discountType,
      discountAmount: promote.discountType === DiscountType.price ? +promote.discountAmount : 0,
      discountInPercent:
        promote.discountType === DiscountType.percent ? +promote.discountAmount : 0,
      minDiscountAmount: 0,
      maxDiscountAmount: promote.canUseMaxDiscount ? +promote.maxDiscountAmount : 0,
    },
    budget: +promote.budget,
    applyTimesPerUserPerDay: +promote.applyTimesPerUserPerDay,
    activeFrom: dayjs(startDate).toISOString(),
    activeTo: dayjs(endDate).toISOString(),
  }
}

export const transformToUpdatePromoteServer = (
  promote: TPromoteItemServerResponse,
  promoteEdit: AnyObject | null = null
): TPromoteItemServerRequest => {
  if (!promoteEdit) {
    return {
      promoCode: promote.promoCode,
      description: promote.description,
      bannerImageBase64: null, //promote.bannerImageUrl,
      isEnabled: promote.isEnabled,
      discountAmount: promote.discountInfo.discountAmount,
      discountInfo: promote.discountInfo,
      budget: null,
      applyTimesPerUserPerDay: promote.applyTimesPerUserPerDay,
      activeFrom: dayjs(promote.activeFrom.seconds * 1000).toISOString(),
      activeTo: dayjs(promote.activeTo.seconds * 1000).toISOString(),
    }
  }
  const [dateE, hourE] = promoteEdit.activeTo.split(' ') as string[]
  const [dayE, monthE, yearE] = dateE?.split('/') as string[]
  const endDate = `${yearE}-${monthE}-${dayE} ${hourE}`

  console.info(endDate)
  console.info(dayjs(endDate).toISOString())

  return {
    promoCode: promote.promoCode,
    description: promoteEdit.description,
    bannerImageBase64: promoteEdit?.bannerImageBase64?.replace(/^data:.+;base64,/, '') || null, //promote.bannerImageUrl,
    isEnabled: promote.isEnabled,
    discountAmount: promote.discountInfo.discountAmount,
    discountInfo: promote.discountInfo,
    budget: null,
    applyTimesPerUserPerDay: promote.applyTimesPerUserPerDay,
    activeFrom: dayjs(promote.activeFrom.seconds * 1000).toISOString(),
    activeTo: dayjs(endDate).toISOString(), // dayjs(promote.activeTo.seconds * 1000).toISOString(),
  }
}
