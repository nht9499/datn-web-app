import { api } from '@/modules/axios'

export const driverApi = {
  updateDriver: (payload: any) => api.put(`/drivers/update-by-staff`, payload),
  updateDeposit: (payload: any) => api.put(`/drivers/deposit`, payload),
  settleDebt: (payload: any) => api.put(`/drivers/mark-all-debts-as-paid`, payload),
  updateStatus: (payload: any) => api.put('/auth/driver/set-status', payload),
  deleteDriver: (payload: any) => api.delete(`/auth/driver/delete`, payload),
  uploadImage: (payload: any) => api.post(`/media/upload-image`, payload),
}
