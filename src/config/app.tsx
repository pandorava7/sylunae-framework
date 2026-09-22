import { Blocks, Home, Layers3, LayoutDashboard, PackageOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type RouteId = 'home' | 'workspace' | 'components' | 'about'

export interface NavigationLink {
  kind: 'link'
  id: RouteId
  label: string
  description: string
  icon: LucideIcon
}

export interface NavigationGroup {
  kind: 'group'
  id: string
  label: string
  icon: LucideIcon
  children: NavigationLink[]
}

export type NavigationItem = NavigationLink | NavigationGroup

export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'Sylunae Framework',
  shortName: 'Sylunae',
  eyebrow: 'REUSABLE APP SHELL',
  description: import.meta.env.VITE_APP_DESCRIPTION || '一个面向 Electron 与 Web 的高性能前端壳。',
  navigation: [
    { kind: 'link', id: 'home', label: '开始', description: '框架概览', icon: Home },
    {
      kind: 'group', id: 'examples', label: '示例页面', icon: Layers3,
      children: [
        { kind: 'link', id: 'workspace', label: '工作区', description: '内容页模板', icon: LayoutDashboard },
        { kind: 'link', id: 'components', label: '基础组件', description: 'shadcn/ui 示例', icon: Blocks },
        { kind: 'link', id: 'about', label: '框架说明', description: '环境与元数据', icon: PackageOpen },
      ],
    },
  ] satisfies NavigationItem[],
} as const

export function isRouteId(value: string): value is RouteId {
  return appConfig.navigation.some((item) => item.kind === 'link'
    ? item.id === value
    : item.children.some((child) => child.id === value))
}
