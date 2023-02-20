import { api } from '@/modules/axios'
// * Sample
// get: (id: number) => api.get(`/api/users/${id}`),
// login: (obj: any) => api.post('/api/login', obj),
// create: (obj: any) => api.post('/api/users', obj),
// update: (obj: any) => api.put('/api/users', obj),
// remove: (id: number) => api.delete(`/api/users/${id}`),

export const promoteApi = {
  createNewPromote: (payload: TPromoteItemServerRequest) => api.post('/promotion-campaigns', payload),
  updatePromote: (id: string, payload: TPromoteItemServerRequest) => api.patch(`/promotion-campaigns/${id}`, payload),
}