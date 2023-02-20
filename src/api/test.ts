import { api } from '@/modules/axios'

export const testApi = {
  executeTest: (payload: any) => api.post(`/tests/`, payload),
}