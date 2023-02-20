import { order } from '@/constants/define'
import round from 'lodash/round'

export const inject = () => ({
  getOrderStatusColor(key: string) {
    return order.orderStatusColor?.[key] ?? ''
  },
  getOrderStatusLabel(key: string) {
    return order.orderStatus?.[key] ?? ''
  },
  getTaskTypeLabel(key: string) {
    return order.taskType?.[key] ?? ''
  },
  getOrderTypeLabel(key: string) {
    return order.orderType?.[key] ?? ''
  },
  toDistance(value: string | number) {
    return round(+value / 1000, 1) + ' km'
  },
  getGoodAttributeLabel(key: string) {
    return order.goodAttribute?.[key] ?? ''
  },
  getDriveAccountTypeLabel(key: string) {
    return order.driverAccountType?.[key]?.description ?? ''
  },
})
