import { doctorStatus, testStatus, transferStatus } from '@/constants/define'

export const inject = () => ({
  getDoctorStatus(key: string) {
    return doctorStatus.label?.[key] ?? ''
  },
  getDoctorStatusColor(key: string) {
    return doctorStatus.color?.[key] ?? ''
  },
  getTransferColor(key: string) {
    return transferStatus.color?.[key] ?? ''
  },
  getTestStatus(key: string) {
    return testStatus.label?.[key] ?? ''
  },
  getTestStatusColor(key: string) {
    return testStatus.color?.[key] ?? ''
  }
})
