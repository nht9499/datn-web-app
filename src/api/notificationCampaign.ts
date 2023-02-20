import { api } from '@/modules/axios'

export const notificationCampaignApi = {
  sendNotification: (payload: any) => api.post(`/notification-campaigns`, payload),
}
