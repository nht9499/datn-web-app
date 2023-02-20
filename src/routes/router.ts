import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from '@/routes/generatedRoutes'
import middleware from '@/middleware'
const routes: RouteRecordRaw[] = setupLayouts(generatedRoutes)
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
})
// TODO: Register middleware
router.beforeEach(middleware())
export default router
