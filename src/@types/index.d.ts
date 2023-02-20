// * Define type in here
declare type $TODO = any

declare type AnyObject = {
  [key: string]: any
}

declare type CommonObject = {
  key: string
  value: string
}

declare type ArrayOrNot<T> = T | Array<T>

declare type RouterLink = RouterLinkItem & {
  children: RouterLinkItem[]
}

declare type RouteMiddleware = {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  next: NavigationGuardNext
}

declare type RouterLinkItem = {
  name: string
  title: string
  caption?: string
  icon?: string
  hidden?: boolean
  path: string
  level: number
  groups: string[]
}

declare type AuthInfo = {
  uid?: string
  authRole?: string
  driverAccountType?: string
}

declare type OrderItemClientLocation = {
  id?: string
  address: string | null
  lat: number | null
  lng: number | null
}

declare type OrderItemClient = {
  id: string
  forDriverAccountType: string | null
  locations: OrderItemClientLocation[]
  // goodAttributes: string[] | null
  zaloReceiver: ZaloReceiver | null
  // orderType: 'travel' | 'goodsDelivery'
  note: string | null
  distance: number | null
  completionPhotoUrl?: string | null
  staticMapUrl: string
  shippingFee: number | null
  shippingFeeOriginal: number | null
  editedShippingFee?: number
  shopFee?: ShopInvoice | null
  status?: string
  createdAt?: string | number
  updatedAt?: any
}

declare type SignInData = {
  email: string
  password: string
}

declare type TaskQueryParams = {
  uid?: string
  status?: string[]
  type?: string[]
  userName?: string
  staffName?: string
  sort?: string
}

declare interface AudioPlayerOption {
  src: string //audio source
  title?: string //audio title
  coverImage?: string //cover image
  coverRotate?: boolean //cover rotate when playing
  progressBarColor?: string //progress bar color
  indicatorColor?: string //indicator color
  loop?: boolean
}

declare type UserSnapShot = {
  id: string
  authInfo: AuthInfo
  name?: string
  nameAsArray?: string[]
  birthday?: Timestamp
  gender?: string
  telephone?: string
  photoUrl?: string
  address?: string
  tier?: string
}

declare type TaskServerResponse = {
  id: string
  status: string
  audioUrl?: string
  stopList?: string[]
  note?: string
  forDriverAccountType: string
  attachedImageUrlList?: string[]
  orderType: 'travel' | 'goodsDelivery'
  zaloReceiver?: ZaloReceiver
  staff: UserSnapShot
  user: UserSnapShot
  userPosition: {
    latitude: number
    longitude: number
    geohash: string
  } | null
  staffAuthInfo: {
    uid: string
    authRole: string
  } | null
  userUid: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

declare type TaskMessageServerResponse = {
  id: string
  type: string
  attachedImageUrlList?: string[]
  content: string
  createdAt: Timestamp
  receiverAuthInfo: AuthInfo
  senderAuthInfo: AuthInfo
}

declare type CallSession = {
  uuid: string
  type: string
  callerState: string
  callerAuthInfo: AuthInfo
  recipientState: string
  recipientAuthInfo: AuthInfo
}

declare type CallInfo = {
  sessionId: string
  callerName: string
  callerAuthInfo: AuthInfo
  recipientName: string
  recipientAuthInfo: AuthInfo
}

declare type MessageClient = {
  id: string
  receiverAuthInfo: AuthInfo
  senderAuthInfo: AuthInfo
  type: string
  content: string[]
  attachedImageUrlList?: string[]
  createdAt: Timestamp
}

declare type DriverQueryParams = {
  uid?: string
  status?: string[]
  workingStatus?: string[]
  name?: string
  telephone?: string
  bikeNumber?: string
  gender?: string
  sort?: string
}
declare type DeletionRequest = {
  reason: string
  createdAt: Timestamp
}
declare type DriverServerResponse = {
  id: string
  authInfo: AuthInfo
  status: string
  name: string
  nameAsArray?: string[]
  birthday: string | number
  gender: string
  email: string
  telephone: string
  photoUrl: string
  address: string
  personalId: string
  bikeNumber: string
  bikePhotoUrl: string
  bikeNumberPlatePhotoUrl: string
  idCardFrontPhotoUrl: string
  idCardBackPhotoUrl: string
  drivingLicenseCardFrontPhotoUrl: string
  drivingLicenseCardBackPhotoUrl: string
  deposit: number
  createdAt: Timestamp
  updatedAt: Timestamp
  accountDeletionRequest?: DeletionRequest
}

declare type DriverUpdatePayload = {
  driverAuthInfo?: AuthInfo
  status?: string
  name?: string
  nameAsArray?: string[]
  birthday?: Timestamp
  gender?: string
  email?: string
  telephone?: string
  photo?: string
  address?: string
  personalId?: string
  bikeNumber?: string
  bikePhoto?: string
}

declare type DeleteDriverPayload = {
  driverAuthInfo: AuthInfo
}

declare type DepositUpdatePayload = {
  driverAuthInfo: AuthInfo
  depositAmount: number
}

declare type OrderQueryParams = {
  uid?: string
  status?: string[]
  taskType?: string[]
  orderType?: string[]
  priceEdited?: boolean
  sort?: string
}

declare type OrderItemLocationServerRequest = {
  address: string
  position: {
    latitude: number
    longitude: number
  }
}

declare type OrderItemLocationServerResponse = {
  id: string
  address: string
  position: {
    latitude: number
    longitude: number
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

declare type OrderItemServerRequest = {
  // startLocation?: OrderItemLocationServerRequest
  // endLocation?: OrderItemLocationServerRequest
  locationList: OrderItemLocationServerRequest[]
  // goodsAttributes: string[]
  note: string | null
  staticMapUrl: string
  distanceInMeters: number
  forDriverAccountType: string | null
  editedFee?: number
  // transportType: 'goods' | 'people'
}

declare type OrderItemServerResponse = {
  id: string
  taskId: string
  status: string
  transportType: 'goods' | 'people'
  locationList: OrderItemLocationServerRequest[]
  // goodsAttributes: string[]
  zaloReceiver: ZaloReceiver
  note: string
  completionPhotoUrl: string | null
  distanceInMeters: number
  staticMapUrl: string
  invoice: {
    discountAmountPremium: number
    discountAmountPromotion: number
    distanceFee: number
    finalFeeBeforeDiscount: number
    discountAmountInPercent: number
    finalFeeAfterDiscount: number
    driverChargeFee: number
    goodsAttributeFeeInfos: AnyObject[]
    // finalFee: number
    isPriceEdited: boolean
    shopInvoice?: ShopInvoice
  }
  statusHistory: string[]
  forDriverAccountType: string | null
  driver: UserSnapShot
  user: UserSnapShot
  createdAt: Timestamp
  updatedAt: Timestamp
}
declare type ShopInvoice = {
  discountAmountByShop: number
  productInvoiceList: ProductInvoice[]
}
declare type ProductInvoice = {
  pricePerItem: number
  productId: string
  qty: number
}
declare type ZaloReceiver = {
  phoneNumber: string
  name: string
}

declare type StaffServerResponse = {
  id: string
  authInfo: AuthInfo
  name: string
  gender: string
  birthday: Timestamp
  personalId: string
  address: string
  email: string
  telephone: string
  accountType: string
  status: string
  nameAsArray: string[]
  photoUrl: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
declare type StaffPayload = {
  id?: string
  authInfo: AuthInfo
  name?: string
  gender?: string
  birthday?: string | Timestamp
  personalId?: string
  address?: string
  email?: string
  telephone?: string
  accountType?: string
  status?: string
  nameAsArray?: string[]
  photoBase64?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

declare type StaffStatusPayload = {
  staffAuthInfo: AuthInfo
  newStatus: string
}
declare type UserStatusPayload = {
  userAuthInfo: AuthInfo
  newStatus: string
}
declare type UserTierPayload = {
  tier: string
}

declare type StaffQueryParams = {
  status?: string
  name?: string
  accountType?: string
  sort?: string
}

declare type StatisticServerResponse = {
  id?: string
  totalUsers?: number
  totalDrivers?: number
  totalStaffs?: number
  totalOrdersSuccessful?: number
  totalOrdersCanceledByUser?: number
  totalOrdersCanceledByDriver?: number
  totalOrdersFeeEdited?: number
  totalAmountOrderFee?: number
  totalAmountDriverCharge?: number
  totalAmountDriverDeposit?: number
  updatedAt?: number
}

declare type StatisticPayload = {
  id?: string
  totalUsers: number
  totalDrivers: number
  totalStaffs: number
  totalOrdersSuccessful: number
  totalOrdersCanceledByUser: number
  totalOrdersCanceledByDriver: number
  totalOrdersFeeEdited: number
  totalAmountOrderFee: number
  totalAmountDriverCharge: number
  totalAmountDriverDeposit: number
  totalTasksAudio: number
  totalTasksForm: number
  totalTasksFromOrderByStaff: number
  totalTasksFromOrderByUser: number
  updatedAt?: number
}

declare type StatisticBy = 'byDay' | 'byWeek' | 'byMonth' | 'byYear'
declare type StatisticType = 'user' | 'driver' | 'order' | 'revenue'

declare type LocationItemClient = {
  id: string
  isFetching: boolean
  address: string
  lat: number | null
  lng: number | null
  name: string | null
  fullAddress?: string
  isSaved?: boolean
  isUserLocation?: boolean
}
declare type Settings = {
  // transportFeeFor1KmOrLess: string | number
  // transportFeeFor2KmOrLess: string | number
  // transportFeePerKmForMoreThan2Km: string | number
  driverAccountTypeFeeConfigList: DriverAccountTypeConfig[]
  goodsWeightFeeConfigList: GoodWeightTypeConfig[]
  // attributeBulkyFeePerKm: string | number
  // attributeLongWaitFeePerTrip: string | number
  shopDistanceFeeConfig: {
    distanceSegmentFeeConfigList: TransportSegmentFeeConfig[]
    driverChargePerTripInPercent: number | string
  }
  premiumDiscountPerTripInPercent: string | number
  maxRadiusOrdersQueryInMeters: string | number
  minDriverDeposit: string | number
}
declare type DriverAccountType = 'bike' | 'fourSeaterCar' | 'sevenSeaterCar'
declare type GoodWeightType = 'light' | 'medium' | 'heavy'
declare type DriverAccountTypeConfig = {
  driverAccountType: DriverAccountType
  distanceFeeConfig: {
    distanceSegmentFeeConfigList: TransportSegmentFeeConfig[]
    driverChargePerTripInPercent: number | string
  }
}
declare type GoodWeightTypeConfig = {
  goodsWeight: GoodWeightType
  distanceFeeConfig: {
    distanceSegmentFeeConfigList: TransportSegmentFeeConfig[]
    driverChargePerTripInPercent: number | string
  }
}
declare type TransportSegmentFeeConfig = {
  kmsCount: number | string | null
  feePerKm: number | string
}
declare type AuthInfoTarget = {
  authRole: 'driver' | 'staff' | 'user'
  authInfo: AuthInfo
}
declare type NotificationCampaign = {
  id?: string
  targetAuthTargetList?: AuthInfoTarget[]
  targetAuthInfoList?: AuthInfo[]
  createdByAuthInfo?: AuthInfo
  title: string
  description: string
  createdAt?: string | Timestamp
}

// declare type TDriverAccountTypeConfigItem = {
//   driverAccountType: string
//   driverChargePerTripInPercent: number
//   transportSegmentFeeConfigList: TTransportSegmentFeeConfigItem[]
// }

declare type TTransportSegmentFeeConfigItem = {
  feePerKm: number
  kmsCount: number | null
}

declare type TPromoteItemClient = {
  promoCode: string
  bannerImageBase64: string
  description: string
  discountAmount: number
  discountType: string
  budget: number
  canUseMaxDiscount?: boolean
  maxDiscountAmount: number
  canUseQuota?: boolean
  applyTimesPerUserPerDay: number
  activeFrom: string
  canUseActiveTo?: boolean
  activeTo: string
}

declare type TPromoteItemServerRequest = {
  promoCode: string | null
  description: string | null
  bannerImageBase64: string | null
  isEnabled: boolean
  discountAmount: number | null
  discountInfo: {
    type: string
    discountAmount: number
    discountInPercent: number
    minDiscountAmount: number
    maxDiscountAmount: number
  } | null
  budget: number | null
  applyTimesPerUserPerDay: number | null
  activeFrom: string | null
  activeTo: string | null
}

declare type TPromoteItemServerResponse = {
  id: string
  promoCode: string
  description: string
  isEnabled: boolean
  bannerImageUrl: string
  discountInfo: {
    type: string
    discountAmount: number
    discountInPercent: number
    minDiscountAmount: number
    maxDiscountAmount: number
  }
  originalBudget: number
  remainingBudget: number
  applyTimesPerUserPerDay: number
  activeFrom: {
    seconds: number
  }
  activeTo: {
    seconds: number
  }
  createdAt: Timestamp
}

declare type TShopItemServerResponse = {
  id: string
  shopName: string
  ownerName: string
  shopDescription: string
  shopDiscount: number | null
  phoneNumber: string
  imageUrl: string
  ownerEmail?: string
  shopLocation: OrderItemLocationServerRequest
  status: string
  createdAt: number
  updatedAt: number
}

declare type TShopItemServerRequest = {
  shopName: string
  ownerName: string
  ownerEmail?: string
  phoneNumber: string
  shopLocation: OrderItemLocationServerRequest
  status: string
}

declare type DriverDebt = {
  id: string
  createdAt: Timestamp
  accountantAuthInfo: AuthInfo
  paidAt?: Timestamp | null
  orderId: string
  driverAuthInfo: AuthInfo
  debtAmount: number | string
}

declare type DriverDebtQueryParams = {
  notPaid?: boolean
}

declare type DoctorServerResponse = {
  uid: string
  authInfo: AuthInfo
  fullName: string
  dob: Timestamp
  email: string
  phoneNumber: string
  lastWithdrawalSnapshot?: DoctorWithdrawal | null
  costPerMau?: number | null
  status: string
  avatarImageUrl: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

declare type DoctorWithdrawal = {
  status: string
  createdAt: Timestamp
}

declare type DoctorQueryParams = {
  status?: string
  fullName?: string
  sort?: string
  transactionsYear?: string
  statisticsYear?: string
}
