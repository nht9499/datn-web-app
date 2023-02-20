declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}

declare type Filterers = {
  randomNumber(): string
  getDriverStatusColor(status: string): any
  getDriverStatusLabel(status: string)
  getIconNotify(type: any): string | undefined
  getNotifyColor(type: any): string | undefined
  getGenderLabel: (val: string) => any
  getTagLabel: (val: string) => any
  getTagIcon: (val: string) => any
  nameToArray: (arg0: string) => []
  getTaskStatusLabel: (key: string) => string
  getTaskStatusColor: (key: string) => string
  getStatus: (key: string) => string
  getStatusColor: (key: string) => string
  getOrderStatusLabel: (key: string) => string
  getOrderStatusColor: (key: string) => string
  getTaskActionLabel: (key: string) => string
  getGoodAttributeLabel: (key: string | unknown) => string
  toDistance: (value: string | number) => string
  dateFormat: (value: string | number, patter?: string) => string
  dateFromNow: (value: string | number, force?: boolean) => string
  ageNumber: (value: string | number) => string
  phoneNumber: (value: string | number) => string
  roundNumber: (value: string | number | unknown) => string
  currencyFormat: (
    value: string | number | unknown,
    pattern?: number,
    showCurrency?: boolean
  ) => string
  roundNumber: (value: string | number | unknown) => number
  roundUpNumber: (value: string | number | unknown) => number
  getRoleLabel: (key: string) => string
  getGenderLabel: (value: string | number | unknown) => string
  getRoleColor: (key: string) => string
  getTagLabel: (value: string | number | unknown) => string
  getTagIcon: (key: string) => string
  escape: (value: string | number, defaultData?: string | number) => string
  getStatisticsIdFromDate: (date: Date | dayjs.Dayjs, type: StatisticBy) => string
  removeAccents: (value: string) => string
  getDiscountLabel: (key: string) => string
  getDiscountStatus: (isEnabled: boolean | null) => string
  getDiscountStatusColor: (isEnabled: boolean | null) => string
  getDriveAccountTypeLabel: (key: string) => string
  getShopStatusLabel: (key: string) => string
  getShopStatusColor: (key: string) => string
  getDoctorStatus: (key: string) => string
  getDoctorStatusColor: (key: string) => string
  getTransferColor: (key: string) => string
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: Filterers
  }
  interface ComponentCustomProperties {
    $apexcharts: typeof ApexCharts
  }
}

export { Filterers }
