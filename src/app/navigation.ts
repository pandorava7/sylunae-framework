import type { RouteId } from '@/config/app'

export const NAVIGATE_EVENT = 'sylunae:navigate'

export function navigate(route: RouteId) {
  window.dispatchEvent(new CustomEvent<RouteId>(NAVIGATE_EVENT, { detail: route }))
}
