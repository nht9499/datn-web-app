import { api } from '@/modules/axios'

export const organizationApi = {
  create: (payload: any) => api.post(`/organizations/`, payload),
  uploadFile: (organizationUid: string, payload: any) =>
    api.post(`/organizations/${organizationUid}/upload`, payload),
  removeFile: (organizationUid: string, fileId: string) =>
    api.post(`/organizations/${organizationUid}/file-remove/${fileId}`),
  shareFile: (organizationUid: string, payload: any) =>
    api.post(`/organizations/${organizationUid}/file-share`, payload),
  addMember: (organizationUid: string, userUid: string) =>
    api.post(`/organizations/${organizationUid}/add-member/${userUid}`),
  addAdmin: (organizationUid: string, userUid: string) =>
    api.post(`/organizations/${organizationUid}/add-admin/${userUid}`),
  removeMember: (organizationUid: string, userUid: string) =>
    api.post(`/organizations/${organizationUid}/remove-member/${userUid}`),
  removeAdmin: (organizationUid: string, userUid: string) =>
    api.post(`/organizations/${organizationUid}/remove-admin/${userUid}`),
}