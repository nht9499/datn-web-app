import { useAuthStore } from '@/stores/auth'
import { AppRole } from '@/constants/enums'
import { guardConfig } from '@/configs/nav.config'
import { findFirst } from '@/util/object'
const allowRoles = [AppRole.admin, AppRole.accountant, AppRole.staff, AppRole.user]

export default ({ to, next }: RouteMiddleware) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticate) {
    next(`/login?redirect=${to.fullPath}`)
    return false
  }
  if (!allowRoles.includes(authStore.role)) {
    next('/403')
    return false
  }
  const pageRoute = findFirst(guardConfig, 'children', { path: to.path })

  if (pageRoute && !pageRoute.groups.includes(authStore.role)) {
    next('/404')
    return false
  }
  next()
}
