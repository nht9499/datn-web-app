import { api } from '@/modules/axios'
// * Sample
// get: (id: number) => api.get(`/api/users/${id}`),
// login: (obj: any) => api.post('/api/login', obj),
// create: (obj: any) => api.post('/api/users', obj),
// update: (obj: any) => api.put('/api/users', obj),
// remove: (id: number) => api.delete(`/api/users/${id}`),

export const userApi = {
  registerUser: (payload: any) => api.post(`/users/`, payload),
  uploadFile: (payload: any) => api.post(`/users/upload`, payload),
  removeFile: (userUid: string, fileId: string) => api.post(`/users/${userUid}/file-remove/${fileId}`),
  shareFile: (userUid: string, payload: any) => api.post(`/users/${userUid}/file-share`, payload),
  joinOrganization: (organizationUid: string) => api.post(`/users/join-organization/${organizationUid}`)
}
