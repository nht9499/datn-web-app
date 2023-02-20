import { api } from '@/modules/axios'
// * Sample
// get: (id: number) => api.get(`/api/users/${id}`),
// login: (obj: any) => api.post('/api/login', obj),
// create: (obj: any) => api.post('/api/users', obj),
// update: (obj: any) => api.put('/api/users', obj),
// remove: (id: number) => api.delete(`/api/users/${id}`),

export const taskApi = {
  updateStatus: (id: string, payload: any) => api.patch(`/tasks/${id}/status`, payload),
  makeACall: (taskId: string) => api.post(`/tasks/${taskId}/call`),
  sendMessage: (taskId: string, body: AnyObject) => api.post(`/communications/send-task-message`, { taskId, content: body.content, attachedImageBase64List: body.attachedImageBase64List }),
  updateCallSessionCallerState: (sessionId: string, state: string) => api.patch(`/communications/call-sessions/${sessionId}/update-caller-state`, { state }),
  updateCallSessionRecipientState: (sessionId: string, state: string) => api.patch(`/communications/call-sessions/${sessionId}/update-recipient-state`, { state }),
}