export enum COLLECTION_NAME {
  USERS = 'users',
  TASKS = 'tasks',
  TASKS_MESSAGES = 'chatMessages',
  DRIVER = 'drivers',
  ORDERS = 'orders',
  NOTIFY = 'notificationInfos',
  SUB_NOTI = 'notifications',
  STAFFS = 'staffs',
  STAFFS_BOOKMARK = 'bookmarkLocations',
  NEWS = 'news',
  SHOP = 'shops',
  SETTINGS = 'settings',
  CALL_SESSION = 'callSessions',
  STATISTICS_BY_DAY = 'statisticsByDay',
  STATISTICS_BY_WEEK = 'statisticsByWeek',
  STATISTICS_BY_MONTH = 'statisticsByMonth',
  STATISTICS_BY_YEAR = 'statisticsByYear',
  STATISTICS_OVERALL = 'statisticsOverall',
  NOTIFICATION_CAMPAIGNS = 'notificationCampaigns',
  FEED_BACKS = 'feedbacks',
  REVIEWS = 'reviews',
  PROMOTE = 'promotionCampaigns',
  SUB_DEBT = 'debts',
  DOCTORS = 'doctors',
  DOCTOR_SUBCOL_PRIVATES = 'privates',
  DOCTOR_SUBCOL_PRIVATES_DOCID = 'privateData',
  DOCTOR_BALANCEINFOS = 'doctorBalanceInfos',
  DOCTOR_BALANCEINFOS_SUBCOL_TRANSACTION = 'transactions',
  DOCTOR_BALANCEINFOS_SUBCOL_STATISTICS = 'incomeStatisticsByYear',
  FILES = 'files',
}

export enum AppRole {
  admin = 'admin',
  accountant = 'accountant',
  staff = 'staff',
  user = 'user',
}

export enum UserTierTypes {
  basic = 'basic',
  premium = 'premium',
}
export const userTierList = [UserTierTypes.basic, UserTierTypes.premium] as const
export type UserTier = typeof userTierList[number]

// waiting, waiting_too_long, handling, confirming
export enum TaskStatus {
  waiting = 'waiting',
  waitingTooLong = 'waiting_too_long',
  handling = 'handling',
  confirming = 'confirming',
  done = 'done',
  canceledByStaff = 'canceledByStaff',
  canceledByUser = 'canceledByUser',
}

export enum GoodTypes {
  bulky = 'bulky',
  need_wait = 'need_wait',
}

export enum EventType {
  SHOW_MAP = 'SHOW_MAP',
  PICK_MAP = 'PICK_MAP',
  STREAM_ADDED = 'stream-added',
  STREAM_SUBSCRIBED = 'stream-subscribed',
  STREAM_REMOVED = 'stream-removed',
  PEER_ONLINE = 'peer-online',
  PEER_LEAVE = 'peer-leave',
}

export const goodsAttributeList = [GoodTypes.bulky, GoodTypes.need_wait] as const
export type GoodsAttribute = typeof goodsAttributeList[number]

export const notifyList = ['positive', 'negative', 'warning', 'info', 'ongoing'] as const
export type NotifyType = typeof notifyList[number]
export enum OrderTypes {
  waiting_user_confirm = 'waiting_user_confirm',
  waiting_driver = 'waiting_driver',
  picking_up = 'picking_up',
  carrying = 'carrying',
  done = 'done',
  canceled_by_driver = 'canceled_by_driver',
  canceled_by_user = 'canceled_by_user',
  canceled_by_too_long = 'canceled_by_too_long',
}
export enum TaskType {
  audio = 'audio',
  form = 'form',
  fromOrderByStaff = 'fromOrderByStaff',
  fromOrderByUser = 'fromOrderByUser',
}

export enum OrderTransportType {
  travel = 'travel',
  goodsDelivery = 'goodsDelivery',
  shop = 'shop',
}

export const orderStatusList = [
  OrderTypes.waiting_user_confirm,
  OrderTypes.waiting_driver,
  OrderTypes.picking_up,
  OrderTypes.canceled_by_too_long,
  OrderTypes.carrying,
  OrderTypes.done,
  OrderTypes.canceled_by_user,
  OrderTypes.canceled_by_driver,
] as const
export type OrderStatus = typeof orderStatusList[number]

export const taskTypeList = [
  TaskType.audio,
  // TaskType.form,
  TaskType.fromOrderByStaff,
  TaskType.fromOrderByUser,
] as const
export const orderTypeList = [
  OrderTransportType.travel,
  OrderTransportType.goodsDelivery,
  OrderTransportType.shop,
] as const
export type TaskTypeList = typeof taskTypeList[number]

export enum DriverStatus {
  WAITING = 'waiting',
  WAITING_TOO_LONG = 'waiting_too_long',
  ACTIVE = 'active',
  DEACTIVE = 'deactive',
  DELETION_REQUESTED = 'deletion_requested',
  DELETED = 'deleted',
}

export enum DriverAccountType {
  bike = 'bike',
  fourSeaterCar = 'fourSeaterCar',
  sevenSeaterCar = 'sevenSeaterCar',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  ALL = 'all',
}

export enum UserNotification {
  COMMUNICATION = 'communication',
  ACCOUNT = 'account',
  FINANCIAL = 'financial',
  TASK = 'task',
  ORDER = 'order',
  GENERAL = 'general',
  TASK_STATUS = 'taskStatus',
  SHOP_STATUS = 'shopStatus',
  DRIVER_STATUS = 'driverStatus',
  DRIVER_WORKING_STATUS = 'driverWorkingStatus',
  USER_STATUS = 'userStatus',
  TASK_HANDLING = 'taskHandling',
  TASK_CANCELED = 'taskCanceled',
  ORDERS_CREATED = 'ordersCreated',
  ORDER_IN_PROCESS = 'orderInProcess',
  ORDER_DONE = 'orderDone',
  ORDER_AVAILABLE_FOR_DRIVER = 'orderAvailableForDriver',
  ORDER_CANCELED = 'ordersCanceled',
  CALL = 'call',
  CHAT = 'chat',
  CALL_REQUEST_ORDER = 'callRequestOrder',
}

export enum Status {
  ACTIVE = 'active',
  DEACTIVE = 'deactive',
}

export enum WorkingStatus {
  OOS = 'oos',
  OOS_TOO_LONG = 'oos_too_long',
  WAITING = 'waiting',
  WORKING = 'working',
  DEACTIVE = 'null',
}
// pending, joined, rejected, left
export enum CallType {
  call_by_me = 'call_by_me',
  call_from_user = 'call_from_user',
  call_start = 'call_start',
  call_end = 'call_end',
  call_request_order = 'call_request_order',
}

export enum CallStatus {
  pending = 'pending',
  joined = 'joined',
  rejected = 'rejected',
  left = 'left',
}

export enum TagList {
  fastDelivery = 'fastDelivery',
  polite = 'polite',
  wellPacked = 'wellPacked',
  friendly = 'friendly',
}

export enum DiscountType {
  price = 'byAmount',
  percent = 'byPercent',
}

export const discountTypes = [DiscountType.price, DiscountType.percent] as const

export enum TransportType {
  goods = 'goods',
  people = 'people',
}

export const shopStatusList = ['inReview', 'inactive', 'active', 'banned', 'deleted']
export enum ShopStatus {
  inReview = 'inReview',
  inactive = 'inactive',
  active = 'active',
  banned = 'banned',
  deleted = 'deleted',
}

export const doctorStatusList = ['inReview', 'activated', 'deactivated']
export enum DoctorStatus {
  inReview = 'inReview',
  activated = 'activated',
  deactivated = 'deactivated',
}

export enum TransferStatus {
  waiting = 'waiting',
  transfered = 'transfered',
  rejected = 'rejected',
  canceledByDoctor = 'canceledByDoctor',
}

export enum TestStatus {
  PROCESSING = 'processing',
  DONE = 'done',
  FAIL = 'fail',
}

export const testTypelist = ['own', 'internet', 'organization', 'system']
export enum TestType {
  own = 'own',
  internet = 'internet',
  organization = 'organization',
  system = 'system',
}

export const similarMethodlist = ['cross', 'vi', 'en']
export enum SimilarMethod {
  cross = 'cross',
  vi = 'vi',
  en = 'en',
}
