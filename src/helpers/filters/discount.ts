import { discount } from '@/constants/define'

export const inject = () => ({
  getDiscountLabel(key: string) {
    return discount.discountLabel?.[key] ?? ''
  },
  getDiscountStatus(isEnabled: boolean) {
    const key = isEnabled === null ? 'end' : isEnabled ? 'active' : 'deActive'
    return discount.discountStatus?.[key] ?? ''
  },
  getDiscountStatusColor(isEnabled: boolean | null) {
    const key = isEnabled === null ? 'end' : isEnabled ? 'active' : 'deActive'
    return discount.discountStatusColor?.[key] ?? ''
  }
})