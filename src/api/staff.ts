import { api } from '@/modules/axios'
// * Sample
// get: (id: number) => api.get(`/api/users/${id}`),
// login: (obj: any) => api.post('/api/login', obj),
// create: (obj: any) => api.post('/api/users', obj),
// update: (obj: any) => api.put('/api/users', obj),
// remove: (id: number) => api.delete(`/api/users/${id}`),

export const staffApi = {
  createStaff: (payload: StaffPayload) => api.post(`/auth/staff/create`, payload),
  updateStaff: (payload: StaffPayload, uid: string) => api.put(`/staffs/${uid}`, payload),
  updateProfile: (payload: StaffPayload) => api.put(`/staffs`, payload),
  createBookmarkLocations: (payload: OrderItemLocationServerRequest) =>
    api.post(`/staffs/bookmark-locations`, payload),
  deleteBookmarkLocations: (id: string) => api.delete(`/staffs/bookmark-locations/${id}`),
  updateStatus: (payload: StaffStatusPayload) => api.put(`auth/staff/set-status`, payload),
}
