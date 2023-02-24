import {
  AppRole,
  TaskStatus,
  DriverStatus,
  Gender,
  GoodTypes,
  UserNotification,
  Status,
  WorkingStatus,
  OrderTypes,
  TagList,
  DriverAccountType,
  DiscountType,
  TaskType,
  OrderTransportType,
  ShopStatus,
  DoctorStatus,
  TransferStatus,
  TestStatus,
  TestType,
} from './enums'

export const auth = {
  roleName: {
    [AppRole.admin]: 'Quản lý',
    [AppRole.accountant]: 'Kế toán',
    [AppRole.staff]: 'Nhân viên',
  } as AnyObject,
  firstCharacter: {
    [AppRole.admin]: 'AD',
    [AppRole.accountant]: 'KT',
    [AppRole.staff]: 'NV',
  } as AnyObject,
  color: {
    [AppRole.admin]: 'red',
    [AppRole.accountant]: 'orange',
    [AppRole.staff]: 'blue',
  } as AnyObject,
}

export const task = {
  taskStatus: {
    [TaskStatus.waiting]: 'Đang chờ',
    [TaskStatus.waitingTooLong]: 'Chờ quá lâu',
    [TaskStatus.handling]: 'Đang xử lý',
    [TaskStatus.confirming]: 'Đã xác nhận',
    [TaskStatus.canceledByStaff]: 'Nhân viên hủy yêu cầu',
    [TaskStatus.canceledByUser]: 'Khách hủy yêu cầu',
    [TaskStatus.done]: 'Đã xong',
  } as AnyObject,
  taskStatusColors: {
    [TaskStatus.waiting]: 'warning',
    [TaskStatus.waitingTooLong]: 'orange',
    [TaskStatus.handling]: 'positive',
    [TaskStatus.confirming]: 'grey',
    [TaskStatus.canceledByStaff]: 'negative',
    [TaskStatus.canceledByUser]: 'red',
    [TaskStatus.done]: 'dark',
  } as AnyObject,
  taskActions: {
    [TaskStatus.waiting]: 'Xử lý',
    [TaskStatus.waitingTooLong]: 'Xử lý',
    [TaskStatus.handling]: 'Theo dõi',
    [TaskStatus.confirming]: 'Theo dõi',
    [TaskStatus.canceledByStaff]: 'Xem',
    [TaskStatus.canceledByUser]: 'Xem',
    [TaskStatus.done]: 'Theo dõi',
  } as AnyObject,
}

export const order = {
  goodAttribute: {
    [GoodTypes.bulky]: 'Hàng cồng kềnh',
    [GoodTypes.need_wait]: 'Chờ điểm dừng',
  } as AnyObject,
  orderStatus: {
    [OrderTypes.waiting_user_confirm]: 'Chờ khách xác nhận',
    [OrderTypes.waiting_driver]: 'Đợi tài xế',
    [OrderTypes.picking_up]: 'Đang lấy hàng',
    [OrderTypes.carrying]: 'Đang giao hàng',
    [OrderTypes.done]: 'Hoàn thành',
    [OrderTypes.canceled_by_driver]: 'Tài xế hủy đơn',
    [OrderTypes.canceled_by_user]: 'Khách hủy đơn',
    [OrderTypes.canceled_by_too_long]: 'Hủy đơn do không có tài xế',
  } as AnyObject,
  orderStatusColor: {
    [OrderTypes.waiting_user_confirm]: 'warning',
    [OrderTypes.waiting_driver]: 'orange',
    [OrderTypes.picking_up]: 'info',
    [OrderTypes.carrying]: 'positive',
    [OrderTypes.done]: 'dark',
    [OrderTypes.canceled_by_driver]: 'negative',
    [OrderTypes.canceled_by_user]: 'red',
    [OrderTypes.canceled_by_too_long]: 'grey',
  } as AnyObject,
  driverAccountType: {
    [DriverAccountType.bike]: {
      label: 'Shipper PQ Bike',
      description: '1 chỗ',
      value: DriverAccountType.bike,
    },
    [DriverAccountType.fourSeaterCar]: {
      label: 'Shipper PQ Car',
      description: '4 chỗ',
      value: DriverAccountType.fourSeaterCar,
    },
    [DriverAccountType.sevenSeaterCar]: {
      label: 'Shipper PQ CarXL',
      description: '7 chỗ',
      value: DriverAccountType.sevenSeaterCar,
    },
  } as AnyObject,
  taskType: {
    [TaskType.audio]: 'Ghi âm',
    // [TaskType.form]: 'Biểu mẫu',
    [TaskType.fromOrderByStaff]: 'Tạo bởi nhân viên',
    [TaskType.fromOrderByUser]: 'Tạo bởi người dùng',
  } as AnyObject,
  orderType: {
    [OrderTransportType.travel]: 'Đơn chở người',
    [OrderTransportType.goodsDelivery]: 'Đơn giao hàng',
    [OrderTransportType.shop]: 'Đơn của cửa hàng',
  } as AnyObject,
}

export const defaultPricingPlan = {
  addOnBulkyFeeByKm: 2000,
  addOnLongWaitFeeByTrip: 20000,
  serviceFeePerTripInPercent: 0.15,
  premiumDiscountPerTripInPercent: 0.1,
  driverAccountTypeFeeConfigList: [] as DriverAccountTypeConfig[],
  // driverAccountTypeConfigList: [] as TDriverAccountTypeConfigItem[]
}

export const driver = {
  driverStatus: {
    [DriverStatus.WAITING]: 'Đang chờ',
    [DriverStatus.WAITING_TOO_LONG]: 'Chờ quá lâu',
    [DriverStatus.ACTIVE]: 'Đang hoạt động',
    [DriverStatus.DEACTIVE]: 'Ngưng hoạt động',
    [DriverStatus.DELETION_REQUESTED]: 'Yêu cầu xóa',
    [DriverStatus.DELETED]: 'Đã xóa',
  } as AnyObject,
  driverStatusColor: {
    [DriverStatus.WAITING]: 'warning',
    [DriverStatus.WAITING_TOO_LONG]: 'orange',
    [DriverStatus.ACTIVE]: 'positive',
    [DriverStatus.DEACTIVE]: 'grey',
    [DriverStatus.DELETION_REQUESTED]: 'red',
    [DriverStatus.DELETED]: 'grey',
  } as AnyObject,
}

export const gender = {
  genderOpt: {
    [Gender.MALE]: 'Nam',
    [Gender.FEMALE]: 'Nữ',
    [Gender.OTHER]: 'Khác',
    [Gender.ALL]: 'Tất cả',
  } as AnyObject,
}

export const notify = {
  notifyIcon: {
    [UserNotification.COMMUNICATION]: 'chat',
    [UserNotification.ACCOUNT]: 'person',
    [UserNotification.FINANCIAL]: 'attach_money',
    [UserNotification.TASK]: 'task',
    [UserNotification.ORDER]: 'inventory',
    [UserNotification.GENERAL]: 'article',
    [UserNotification.TASK_STATUS]: 'task',
    [UserNotification.SHOP_STATUS]: 'shopfront',
    [UserNotification.DRIVER_STATUS]: 'person',
    [UserNotification.DRIVER_WORKING_STATUS]: 'two_wheeler',
    [UserNotification.USER_STATUS]: 'face',
    [UserNotification.TASK_HANDLING]: 'task',
    [UserNotification.TASK_CANCELED]: 'task',
    [UserNotification.ORDERS_CREATED]: 'task',
    [UserNotification.ORDER_IN_PROCESS]: 'task',
    [UserNotification.ORDER_DONE]: 'task',
    [UserNotification.ORDER_AVAILABLE_FOR_DRIVER]: 'task',
    [UserNotification.ORDER_CANCELED]: 'task',
    [UserNotification.CALL]: 'call',
    [UserNotification.CHAT]: 'chat',
    [UserNotification.CALL_REQUEST_ORDER]: 'call',
  } as AnyObject,
  notifyColor: {
    [UserNotification.COMMUNICATION]: 'light-blue-3',
    [UserNotification.ACCOUNT]: 'teal',
    [UserNotification.FINANCIAL]: 'green',
    [UserNotification.TASK]: 'orange',
    [UserNotification.ORDER]: 'amber',
    [UserNotification.GENERAL]: 'positive',
    [UserNotification.TASK_STATUS]: 'orange',
    [UserNotification.SHOP_STATUS]: 'orange',
    [UserNotification.DRIVER_STATUS]: 'teal',
    [UserNotification.DRIVER_WORKING_STATUS]: 'teal',
    [UserNotification.USER_STATUS]: 'light-blue-3',
    [UserNotification.TASK_HANDLING]: 'positive',
    [UserNotification.TASK_CANCELED]: 'red',
    [UserNotification.ORDERS_CREATED]: 'info',
    [UserNotification.ORDER_IN_PROCESS]: 'cyan',
    [UserNotification.ORDER_DONE]: 'grey',
    [UserNotification.ORDER_AVAILABLE_FOR_DRIVER]: 'dark',
    [UserNotification.ORDER_CANCELED]: 'red',
    [UserNotification.CALL]: 'positive',
    [UserNotification.CHAT]: 'light-blue-3',
    [UserNotification.CALL_REQUEST_ORDER]: 'positive',
  } as AnyObject,
}

export const status = {
  statusOpt: {
    [Status.ACTIVE]: 'Đang hoạt động',
    [Status.DEACTIVE]: 'Ngưng hoạt động',
  } as AnyObject,
  statusColors: {
    [Status.ACTIVE]: 'positive',
    [Status.DEACTIVE]: 'grey',
  } as AnyObject,
}
export const work = {
  workingStatus: {
    [WorkingStatus.OOS]: 'Đang nghỉ',
    [WorkingStatus.OOS_TOO_LONG]: 'Nghỉ quá lâu',
    [WorkingStatus.WAITING]: 'Đang chờ',
    [WorkingStatus.WORKING]: 'Đang làm việc',
    [WorkingStatus.DEACTIVE]: 'Ngưng hoạt động',
  } as AnyObject,
  workingStatusColors: {
    [WorkingStatus.OOS]: 'orange',
    [WorkingStatus.OOS_TOO_LONG]: 'negative',
    [WorkingStatus.WAITING]: 'grey',
    [WorkingStatus.WORKING]: 'positive',
    [WorkingStatus.DEACTIVE]: 'negative',
  } as AnyObject,
}

export const tagList = {
  tagList: {
    [TagList.fastDelivery]: 'Giao hàng nhanh',
    [TagList.friendly]: 'Thân thiện',
    [TagList.polite]: 'Lịch sự',
    [TagList.wellPacked]: 'Bảo quản tốt',
  } as AnyObject,
  tagListIcon: {
    [TagList.fastDelivery]: 'bolt',
    [TagList.friendly]: 'mood',
    [TagList.polite]: 'face_retouching_natural',
    [TagList.wellPacked]: 'inventory',
  } as AnyObject,
}

export const discount = {
  discountLabel: {
    [DiscountType.price]: '₫',
    [DiscountType.percent]: '%',
  } as AnyObject,
  discountStatus: {
    active: 'Đang khuyến mãi',
    deActive: 'Tạm ngưng',
    end: 'Đã kết thúc',
  },
  discountStatusColor: {
    active: 'positive',
    deActive: 'orange',
    end: 'red',
  },
}
export const shop = {
  statusLabel: {
    [ShopStatus.inReview]: 'Đang chờ duyệt',
    [ShopStatus.inactive]: 'Đã kích hoạt',
    [ShopStatus.active]: 'Đang hoạt động',
    [ShopStatus.banned]: 'Đã bị khóa',
    [ShopStatus.deleted]: 'Đã đóng cửa',
  } as AnyObject,
  statusColor: {
    [ShopStatus.inReview]: 'orange',
    [ShopStatus.inactive]: 'blue',
    [ShopStatus.active]: 'positive',
    [ShopStatus.banned]: 'grey',
    [ShopStatus.deleted]: 'negative',
  } as AnyObject,
}

export const doctorStatus = {
  label: {
    [DoctorStatus.inReview]: 'Đang chờ duyệt',
    [DoctorStatus.activated]: 'Đang hoạt động',
    [DoctorStatus.deactivated]: 'Ngưng hoạt động',
  } as AnyObject,
  color: {
    [DoctorStatus.inReview]: 'orange',
    [DoctorStatus.activated]: 'positive',
    [DoctorStatus.deactivated]: 'negative',
  } as AnyObject,
}

export const transferStatus = {
  color: {
    [TransferStatus.waiting]: 'orange',
    [TransferStatus.transfered]: 'positive',
    [TransferStatus.canceledByDoctor]: 'grey',
    [TransferStatus.rejected]: 'negative',
  } as AnyObject,
}

export const testStatus = {
  label: {
    [TestStatus.PROCESSING]: 'Đang kiểm tra',
    [TestStatus.DONE]: 'Thành công',
    [TestStatus.FAIL]: 'Thất bại',
  } as AnyObject,
  color: {
    [TestStatus.PROCESSING]: 'orange',
    [TestStatus.DONE]: 'positive',
    [TestStatus.FAIL]: 'negative',
  } as AnyObject,
}
export const testType = {
  label: {
    [TestType.own]: 'Của bạn',
    [TestType.internet]: 'Internet',
    [TestType.organization]: 'Tổ chức',
    [TestType.system]: 'Hệ thống',
  } as AnyObject,
}
