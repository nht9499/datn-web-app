import { api } from '@/modules/axios'
// * Sample
// get: (id: number) => api.get(`/api/users/${id}`),
// login: (obj: any) => api.post('/api/login', obj),
// create: (obj: any) => api.post('/api/users', obj),
// update: (obj: any) => api.put('/api/users', obj),
// remove: (id: number) => api.delete(`/api/users/${id}`),

export const orderApi = {
  createOrders: (taskId: string, travelOrderList: OrderItemServerRequest[], shouldBypassUserConfirm: boolean) => api.post('/orders/create-from-task', { taskId, travelOrderList, shouldBypassUserConfirm }),
  createOrdersManual: (userUid: string, travelOrderList: OrderItemServerRequest[], shouldBypassUserConfirm: boolean) => api.post('/orders/create-from-user', { userUid, travelOrderList, shouldBypassUserConfirm }),
  updateOrderByStaff: (orderId: string, status: string) => api.patch(`/orders/${orderId}/statusByStaff`, { status })
}