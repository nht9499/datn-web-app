import { format } from 'quasar'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'
import { auth } from '@/constants/define'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(relativeTime)
dayjs.locale('vi')
type StatisticBy = 'byDay' | 'byWeek' | 'byMonth' | 'byYear'
export const inject = () => ({
  percentDiff(prev: number, now: number) {
    if (now === 0 || prev === 0) return '-'
    if (prev > now) return Math.round((prev / now - 1) * 100)
    return Math.round((now / prev - 1) * 100)
  },
  getStatisticOptions() {
    const listOptions = []
    for (let i = 0; i < 12; i++) {
      listOptions.push(dayjs().subtract(i, 'month').format('YYYY-MM'))
    }
    return listOptions
  },
  getStatMonthLabel(monthId: string) {
    if (!monthId) return 'T'
    return 'Tháng' + (dayjs(monthId).get('month') + 1)
  },
  getThisMonthFormat(date: Date) {
    return dayjs(date).format('YYYY-MM')
  },
  getPrevMonthFormat(date: Date) {
    return dayjs(date).subtract(1, 'month').format('YYYY-MM')
  },
  randomNumber() {
    return Math.floor(Math.random() * 1000000).toString()
  },
  getSizeDisplay(size: number) {
    if (size > 1073741823) {
      return Math.round((size / 1024 / 1024 / 1024) * 100) / 100 + ' GB'
    }
    if (size > 1048575) {
      return Math.round((size / 1024 / 1024) * 100) / 100 + ' MB'
    }
    if (size > 1023) {
      return Math.round((size / 1024) * 100) / 100 + ' KB'
    }
    return size + ' byte'
  },

  dateFormat(timeStamp: string | number, patter = 'DD/MM/YYYY HH:mm') {
    if (!dayjs(timeStamp).isValid()) return ''
    return dayjs(timeStamp).format(patter)
  },
  dateFromNow(timeStamp: string | number, force = false) {
    if (!dayjs(timeStamp).isValid()) return ''
    const now = dayjs()
    const current = dayjs(timeStamp)
    const diffHour = now.diff(current, 'hours')
    if (diffHour < 1) return format.capitalize(current.fromNow(force))
    if (diffHour >= 1 && diffHour < 24) return format.capitalize(current.format('dddd HH:mm'))
    if (diffHour >= 24 && diffHour < 48) return format.capitalize(current.format('ddd HH:mm'))
    return current.format('DD/MM/YYYY HH:mm')
  },
  ageNumber(timeStamp: string | number) {
    if (!dayjs(timeStamp).isValid()) return ''
    const now = dayjs()
    const current = dayjs(timeStamp)
    const age = now.diff(current, 'years')
    return `${age} tuổi`
  },
  phoneNumber(phone: string) {
    return phone.replace(/[^0-9]/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '(+$1) $2$3$4')
  },
  getRoleLabel(key: string) {
    return auth.roleName?.[key] ?? ''
  },
  getRoleColor(key: string) {
    return auth.color?.[key] ?? ''
  },
  currencyFormat(value: string | number, showCurrency = true) {
    const maximumSignificantDigits = `${value}`.length - 3

    return new Intl.NumberFormat('vi-VN', {
      maximumSignificantDigits: maximumSignificantDigits > 0 ? maximumSignificantDigits : 3,
      ...(showCurrency && { style: 'currency' }),
      currency: 'VND',
    }).format(value ? +value : 0)
  },
  escape(value: string | number, defaultData = '') {
    return value || defaultData
  },
  roundNumber(value: number) {
    return Math.round(value / 1000) * 1000
  },
  roundUpNumber(value: number) {
    return Math.ceil(value / 1000) * 1000
  },
  convertToMilion(value: number) {
    if (value === 0) return 0
    if (value < 1000000)
      return this.currencyFormat(Math.round(value / 100) / 10, false) + ' nghìn đồng'
    return this.currencyFormat(Math.round(value / 100000) / 10, false) + ' triệu đồng'
  },
  convertToMilionShort(value: number) {
    if (value === 0) return 0
    if (value < 1000000) return this.currencyFormat(Math.round(value / 100) / 10, false) + ' k'
    return this.currencyFormat(Math.round(value / 100000) / 10, false) + ' tr'
  },
  getStatisticsIdFromDate(date: Date, type: StatisticBy) {
    const nowDayJs = dayjs.tz(date, 'Asia/Bangkok')

    switch (type) {
      case 'byDay':
        return nowDayJs.format(
          'YYYY-MM-DD'
        ) as `${number}${number}${number}${number}-${number}${number}-${number}${number}`
      case 'byWeek':
        const week2Digits = nowDayJs.week().toLocaleString('en-US', { minimumIntegerDigits: 2 })

        return `${nowDayJs.weekYear()}-W${week2Digits}` as `${number}${number}${number}${number}-W${number}${number}`
      case 'byMonth':
        return nowDayJs.format(
          'YYYY-MM'
        ) as `${number}${number}${number}${number}-${number}${number}`
      case 'byYear':
        return nowDayJs.format('YYYY') as `${number}${number}${number}${number}`
    }
  },
  roundPercent(value: number) {
    return Math.round(value * 1000) / 10
  },
  removeUnique(value: string) {
    return value.substring(value.indexOf('---') + 3)
  },
})
