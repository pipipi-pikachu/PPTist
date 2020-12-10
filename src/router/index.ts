import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Editor from '@/views/Editor/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Editor',
    component: Editor,
  },
  {
    path: '/player',
    name: 'Player',
    component: () => import(/* webpackChunkName: "Player" */ '@/views/Player/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
