import { api } from '@/modules/axios'

export const notifyApi = {
  markAsRead: (id: string) => api.patch(`/notifications/mark-as-read/${id}`),
}
