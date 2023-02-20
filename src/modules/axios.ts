// import router from '@/routes/router'
import axios from 'axios'
import { SessionStorage } from 'quasar'
import { Storage } from '@/configs/app.config'
import { useAuthStore } from '@/stores/auth'
import { getToken } from '@/transform/string'
import { getAuth } from 'firebase/auth'
import * as API_CONFIGS from '@/configs/api.config'
const refreshSubscribers: string[] = []

const api = axios.create({
  baseURL: API_CONFIGS.API_ENDPOINT,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'x-auth-role': 'staff',
  },
})

api.interceptors.request.use((req: any) => {
  //TODO Authorization should be processed here
  const token: string = getToken(SessionStorage.getItem(Storage.AUTH))
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

/**
 *  {
 *   code : 200
 *   data: {}
 *  }
 */
api.interceptors.response.use(
  (res) => {
    return res.data
  },
  async (err) => {
    const {
      config,
      response: { status, data },
    } = err
    const originalRequest = config
    // TODO: Handle case expired token
    if (status === 401 && data?.message === 'auth/unauthorized') {
      getAuth().currentUser?.getIdToken(true).then(onRefreshed);
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          //TODO replace the expired token and retry
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          resolve(axios(originalRequest));
        });
      });
    }
    return Promise.reject(err)
  }
)

const subscribeTokenRefresh = (cb: any) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token: string) => {
  // console.info('New token' + token)
  refreshSubscribers.map((cb: any) => cb(token))
  useAuthStore().updateToken(token)
}

export { api, axios }
