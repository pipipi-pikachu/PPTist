import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'


export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/designer',
    name: 'Root',
    meta: {
      title: 'PPTIST - 首页'
    },
    children: [
      {
        path: 'designer',
        name: 'Designer',
        component: () => import('@/views/Editor/index.vue'),
        meta: {
          title: 'PPTIST - 设计器'
        }
      },
      {
        path: 'preview',
        component: () => import('@/views/Screen/index.vue'),
        name: 'Preview',
        meta: {
          title: 'PPTIST - 预览'
        }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
