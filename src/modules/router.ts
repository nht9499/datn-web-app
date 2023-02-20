import router from '@/routes/router'

export const install = (app: any) => {
  app.use(router)
}
