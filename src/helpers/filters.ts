// import dayjs from 'dayjs'
import { Filterers } from '@/@types/vue.shim'
// declare type Filterers = {
// getGenderLabel: (val: string) => any
// getTagLabel: (val: string) => any
// getTagIcon: (val: string) => any
// nameToArray: (arg0: string) => []
// getIconNotify(arg0: any): string | undefined
// getNotifyColor(arg0: any): string | undefined
// getTaskStatusLabel: (key: string) => string
// getTaskStatusColor: (key: string) => string
// getStatus: (key: string) => string
// getStatusColor: (key: string) => string
// getOrderStatusLabel: (key: string) => string
// getOrderStatusColor: (key: string) => string
// getTaskActionLabel: (key: string) => string
// getGoodAttributeLabel: (key: string | unknown) => string
// toDistance: (value: string | number) => string
// dateFormat: (value: string | number, patter?: string) => string
// dateFromNow: (value: string | number, force?: boolean) => string
// currencyFormat: (value: string | number | unknown, pattern?: number, showCurrency?: boolean) => string
// roundNumber: (value: string | number | unknown) => number
// roundUpNumber: (value: string | number | unknown) => number
// getRoleLabel: (key: string) => string
// getRoleColor: (key: string) => string
// escape: (value: string | number, defaultData?: string | number) => string
// getStatisticsIdFromDate: (date: Date | dayjs.Dayjs, type: StatisticBy) => string
// removeAccents: (value: string) => string
// getDiscountLabel: (key: string) => string
// }
// TODO install all filters part under `modules/`
const modules = import.meta.glob<any>('./filters/*.ts', { eager: true })
export default Object.values(modules).reduce(
  (acc, module) => ({ ...acc, ...module.inject?.() }),
  {}
) as Filterers
