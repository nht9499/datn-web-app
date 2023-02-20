import generatedRoutes from '~pages'
import authentication from "@/middleware/authentication"
import { addWhen } from '@/util/object'
const whiteList = ['all', 'login', 'reset-password', '403']

export default generatedRoutes.map(route => ({
  ...route,
  meta: {
    ...route?.meta,
    middleware: addWhen(!whiteList.includes(route.name as string), [authentication]),
  }
}))