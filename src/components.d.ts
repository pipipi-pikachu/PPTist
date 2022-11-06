import { icons } from '@/plugins/icon'

declare module 'vue' {
  export type GlobalComponents = typeof icons
}

export {}