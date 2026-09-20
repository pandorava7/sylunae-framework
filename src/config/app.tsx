import { Blocks, Home, LayoutDashboard, PackageOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type RouteId = 'home' | 'workspace' | 'components' | 'about'

export interface NavigationItem {
  id: RouteId
  label: string
  description: string
  icon: LucideIcon
}

export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'Sylunae Framework',
  shortName: 'Sylunae',
  eyebrow: 'REUSABLE APP SHELL',
  description: import.meta.env.VITE_APP_DESCRIPTION || '一个面向 Electron 与 Web 的高性能前端壳。',
  navigation: [
    { id: 'home', label: '开始', description: '框架概览', icon: Home },
    { id: 'workspace', label: '工作区', description: '内容页模板', icon: LayoutDashboard },
    { id: 'components', label: '组件', description: 'shadcn/ui 示例', icon: Blocks },
    { id: 'about', label: '关于', description: '环境与元数据', icon: PackageOpen },
  ] satisfies NavigationItem[],
} as const

export function isRouteId(value: string): value is RouteId {
  return appConfig.navigation.some((item) => item.id === value)
}
