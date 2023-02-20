import { shop } from '@/constants/define'

export const inject = () => ({
  getShopStatusLabel(key: string) {
    return shop.statusLabel?.[key] ?? ''
  },
  getShopStatusColor(key: string) {
    return shop.statusColor?.[key] ?? ''
  }
})