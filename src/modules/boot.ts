import VueGoogleMaps from '@fawmi/vue-google-maps'
import * as API_CONFIG from '@/configs/api.config'

export const install = (app: any) => {
  app.use(VueGoogleMaps, {
    load: {
      key: API_CONFIG.MAP_API_KEY,
      libraries: "places"
    },
  })
}
