import { api } from '@/modules/axios'

export const organizationApi = {
  create: (payload: any) => api.post(`/organizations/`, payload),
  uploadFile: (organizationUid: string, payload: any) => api.post(`/organizations/${organizationUid}/upload`, payload),
  removeFile: (organizationUid: string, fileId: string) => api.post(`/organizations/${organizationUid}/file-remove/${fileId}`),
  shareFile: (organizationUid: string, payload: any) => api.post(`/organizations/${organizationUid}/file-share`, payload),
  addMember: (organizationUid: string, userUid: string) => api.post(`/${organizationUid}/add-member/${userUid}`),
  addAdmin: (organizationUid: string, userUid: string) => api.post(`/${organizationUid}/remove-member/${userUid}`),
  removeMember: (organizationUid: string, userUid: string) => api.post(`/${organizationUid}/add-admin/${userUid}`),
  removeAdmin: (organizationUid: string, userUid: string) => api.post(`/${organizationUid}/remove-admin/${userUid}`),
}